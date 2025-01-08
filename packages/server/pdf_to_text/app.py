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
        # Convert PDF to markdown text
        md_text = pymupdf4llm.to_markdown(
            doc=str(input_pdf_path),
            write_images=True,
            image_path="images",
            image_format="png",
            dpi=300,
        )
        
        # Create output path with same name but .txt extension
        output_filename = input_pdf_path.stem + ".txt"
        output_path = output_folder / output_filename
        
        # Write the output
        with open(output_path, "w", encoding="utf-8") as output:
            output.write(md_text)
            
        logger.info(f"Successfully processed: {input_pdf_path.name}")
        return True, None
        
    except Exception as e:
        error_msg = f"Error processing {input_pdf_path.name}: {str(e)}"
        logger.error(error_msg)
        return False, error_msg

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