from flask import Flask, request, jsonify
import pymupdf4llm
import os
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Define base directories for container
INPUT_BASE_DIR = Path("/app/input")
OUTPUT_BASE_DIR = Path("/app/output")

def process_pdf(input_pdf_path, output_folder):
    """
    Process a single PDF file and save its text content to the output folder
    """
    try:
        # Create output path with same name but .txt extension
        output_filename = input_pdf_path.stem + ".txt"
        output_path = output_folder / output_filename
        
        # Check if output file already exists
        if output_path.exists():
            logger.info(f"Output file already exists: {output_path}, skipping processing.")
            return True, None

        
        # Convert PDF to markdown text
        md_text = pymupdf4llm.to_markdown(
            doc=str(input_pdf_path),
            write_images=True,
            image_path="images",
            image_format="png",
            dpi=300,
        )
        
        # Write the output
        with open(output_path, "w", encoding="utf-8") as output:
            output.write(md_text)
            
        logger.info(f"Successfully processed: {input_pdf_path.name}")
        return True, None
        
    except Exception as e:
        error_msg = f"Error processing {input_pdf_path.name}: {str(e)}"
        logger.error(error_msg)
        return False, error_msg

@app.route('/api/processSinglePDF', methods=['GET', 'POST'])
def process_single_pdf():
    """
    Process a single PDF file with flexible input methods
    Supports:
    1. GET request with query parameters
    2. POST request with JSON body
    3. Handling full paths or relative paths
    """
    # Determine input method and extract parameters
    if request.method == 'GET':
        input_pdf_path = request.args.get('inputPDFPath')
        output_folder = request.args.get('outputFolder')
    else:  # POST
        data = request.get_json()
        input_pdf_path = data.get('inputPDFPath')
        output_folder = data.get('outputFolder')
    
    # Validate required parameters
    if not input_pdf_path:
        return jsonify({
            'success': False,
            'error': 'Input PDF path is required'
        }), 400
    
    # Resolve input PDF path
    # Check if it's an absolute path or a path relative to input base dir
    pdf_path = Path(input_pdf_path)
    if not pdf_path.is_absolute():
        pdf_path = INPUT_BASE_DIR / input_pdf_path
    
    # Resolve output folder
    if output_folder:
        output_dir = Path(output_folder)
        if not output_dir.is_absolute():
            output_dir = OUTPUT_BASE_DIR / output_folder
    else:
        # Use default output base directory if not specified
        output_dir = OUTPUT_BASE_DIR
    
    # Create output directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Validate input PDF exists
    if not pdf_path.exists():
        return jsonify({
            'success': False,
            'error': f'Input PDF does not exist: {pdf_path}'
        }), 404
    
    # Validate input is a PDF
    if pdf_path.suffix.lower() != '.pdf':
        return jsonify({
            'success': False,
            'error': f'Input file is not a PDF: {pdf_path}'
        }), 400
    
    try:
        # Process the single PDF
        success, error = process_pdf(pdf_path, output_dir)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'PDF processed successfully',
                'input_file': str(pdf_path),
                'output_directory': str(output_dir)
            })
        else:
            return jsonify({
                'success': False,
                'error': error,
                'input_file': str(pdf_path)
            }), 500
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'input_file': str(pdf_path)
        }), 500
    
@app.route('/api/processPDFs', methods=['GET', 'POST'])
def process_pdfs():
    # Get parameters from query string or POST body
    if request.method == 'GET':
        input_subfolder = request.args.get('inputFolder', '')
        output_subfolder = request.args.get('outputFolder', '')
    else:  # POST
        data = request.get_json()
        input_subfolder = data.get('inputFolder', '')
        output_subfolder = data.get('outputFolder', '')
    
    # Construct full paths
    pdf_dir = INPUT_BASE_DIR / input_subfolder if input_subfolder else INPUT_BASE_DIR
    output_dir = OUTPUT_BASE_DIR / output_subfolder if output_subfolder else OUTPUT_BASE_DIR
    
    # Create input directory if it doesn't exist
    pdf_dir.mkdir(parents=True, exist_ok=True)
    
    # Create output directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)
    
    logger.info(f"Looking for PDFs in: {pdf_dir}")
    logger.info(f"Output directory: {output_dir}")
    
    # Get all PDF files in the directory
    pdf_files = list(pdf_dir.glob("*.pdf"))
    
    if not pdf_files:
        return jsonify({
            'success': False,
            'error': f'No PDF files found in {pdf_dir}',
            'note': 'Directory exists but contains no PDF files'
        }), 404
    
    # Process results
    results = {
        'total_files': len(pdf_files),
        'processed': 0,
        'failed': 0,
        'errors': [],
        'input_directory': str(pdf_dir),
        'output_directory': str(output_dir)
    }
    
    # Process each PDF file
    for pdf_file in pdf_files:
        success, error = process_pdf(pdf_file, output_dir)
        if success:
            results['processed'] += 1
        else:
            results['failed'] += 1
            results['errors'].append(error)
    
    # Return response
    return jsonify({
        'success': True,
        'message': 'PDF processing completed',
        'results': results
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'input_base': str(INPUT_BASE_DIR),
        'output_base': str(OUTPUT_BASE_DIR)
    })

if __name__ == '__main__':
    # Ensure base directories exist
    INPUT_BASE_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_BASE_DIR.mkdir(parents=True, exist_ok=True)
    
    port = int(os.environ.get('PORT', 3500))
    host = os.environ.get('HOST', '0.0.0.0')
    app.run(host=host, port=port)