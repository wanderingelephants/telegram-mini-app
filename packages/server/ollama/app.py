from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
import uvicorn
import requests
import time
import logging
import os
from pathlib import Path
import json
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

MODEL_NAME = "llama3.2"
OLLAMA_BASE_URL = "http://ollama:11434"
ANNOUNCEMENTS_DIR = "/app/data/announcements"
SUMMARIES_DIR = "/app/data/announcement_summaries"

class TextRequest(BaseModel):
    text: str

class FileRequest(BaseModel):
    file_path: str  # Format: "2025-Jan-08/TataSteel_announcement.txt"
    output_file_path: str  # Format: "2025-Jan-08/test_output.json"

def wait_for_ollama():
    max_retries = 30
    retry_delay = 2
    
    for i in range(max_retries):
        try:
            response = requests.get(f"{OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                logger.info("Successfully connected to Ollama")
                return True
        except requests.exceptions.RequestException:
            pass
        
        logger.info(f"Waiting for Ollama to be ready... Attempt {i+1}/{max_retries}")
        time.sleep(retry_delay)
    
    raise Exception("Ollama service did not become available")

def ensure_model_exists():
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags")
        models = response.json().get("models", [])
        model_exists = any(model.get("name") == MODEL_NAME for model in models)
        
        if not model_exists:
            logger.info(f"Model {MODEL_NAME} not found. Pulling...")
            response = requests.post(
                f"{OLLAMA_BASE_URL}/api/pull",
                json={"name": MODEL_NAME}
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to pull model {MODEL_NAME}")
            
            logger.info(f"Successfully pulled model {MODEL_NAME}")
        else:
            logger.info(f"Model {MODEL_NAME} already exists")
            
    except Exception as e:
        logger.error(f"Error ensuring model exists: {str(e)}")
        raise

def create_llm():
    return Ollama(model=MODEL_NAME, base_url=OLLAMA_BASE_URL)

def read_and_process_file(file_path: str) -> str:
    """
    Reads a file and processes its content, handling multiline text and escaping.
    """
    logger.info(f"Processing file: {file_path}")
    full_path = Path(ANNOUNCEMENTS_DIR) / file_path
    logger.info(f"Full path: {full_path}")
    
    try:
        # Check if path attempts to access parent directories
        if '..' in str(full_path):
            raise ValueError("Invalid file path: Parent directory access not allowed")
            
        # Ensure the path is within the announcements directory
        if not str(full_path).startswith(ANNOUNCEMENTS_DIR):
            raise ValueError("Invalid file path: Must be within announcements directory")
            
        if not full_path.is_file():
            raise FileNotFoundError(f"File not found: {file_path}")
            
        with open(full_path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Basic content validation
        if not content.strip():
            raise ValueError("File is empty")
            
        return content
            
    except Exception as e:
        logger.error(f"Error reading file {file_path}: {str(e)}")
        raise

def write_output_json(output_path: str, data: dict) -> str:
    """
    Writes the output data to a JSON file.
    Returns the full path of the written file.
    """
    logger.info(f"Writing output to: {output_path}")
    
    # Create full path
    full_path = Path(SUMMARIES_DIR) / output_path
    
    # Ensure directory exists
    os.makedirs(full_path.parent, exist_ok=True)
    
    try:
        # Add metadata to the output
        output_data = {
            **data,
            "metadata": {
                "processed_at": datetime.utcnow().isoformat(),
                "model_used": MODEL_NAME
            }
        }
        
        # Write JSON file
        with open(full_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
            
        logger.info(f"Successfully wrote output to: {full_path}")
        return str(full_path)
        
    except Exception as e:
        logger.error(f"Error writing output file: {str(e)}")
        raise

def get_subject(text: str) -> str:
    logger.info("Creating LLM instance for subject extraction")
    llm = create_llm()
    logger.info("LLM instance created successfully")
    subject_template = """
    Given the following text, identify its main subject in one line:
    
    Text: {text}
    
    Subject:"""
    
    subject_prompt = PromptTemplate(template=subject_template, input_variables=["text"])
    return llm.invoke(subject_prompt.format(text=text))

def get_summary(text: str) -> str:
    logger.info("Creating LLM instance for summary generation")
    llm = create_llm()
    logger.info("LLM instance created successfully")
    summary_template = """
    Summarize the following text in exactly 3 lines:
    
    Text: {text}
    
    Summary:"""
    
    summary_prompt = PromptTemplate(template=summary_template, input_variables=["text"])
    return llm.invoke(summary_prompt.format(text=text))

@app.get("/health")
async def health_check():
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags")
        models = response.json().get("models", [])
        return {
            "status": "healthy",
            "ollama_status": "connected",
            "available_models": models
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_text(request: TextRequest):
    try:
        subject = get_subject(request.text)
        summary = get_summary(request.text)
        
        return {
            "subject": subject.strip(),
            "summary": summary.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarizeFile")
async def summarize_file(request: FileRequest):
    logger.info(f"Received request to summarize file: {request.file_path}")
    try:
        # Read and process the file
        logger.info(f"Attempting to read file from: {ANNOUNCEMENTS_DIR}/{request.file_path}")
        content = read_and_process_file(request.file_path)
        logger.info(f"Successfully read file. Content length: {len(content)} characters")
        logger.debug(f"File content preview: {content[:200]}...")
        
        # Get subject and summary
        logger.info("Getting subject from LLM")
        subject = get_subject(content)
        logger.info(f"Got subject: {subject}")
        
        logger.info("Getting summary from LLM")
        summary = get_summary(content)
        logger.info(f"Got summary: {summary}")
        
        # Prepare response data
        response_data = {
            "input_file": request.file_path,
            "subject": subject.strip(),
            "summary": summary.strip()
        }
        
        # Write output to JSON file
        output_path = write_output_json(request.output_file_path, response_data)
        
        # Add output file path to response
        response_data["output_file"] = output_path
        
        logger.info("Successfully processed file and generated response")
        return response_data
        
    except FileNotFoundError as e:
        logger.error(f"File not found error: {str(e)}")
        logger.error(f"Searched in directory: {ANNOUNCEMENTS_DIR}")
        logger.error(f"Full path attempted: {os.path.join(ANNOUNCEMENTS_DIR, request.file_path)}")
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        logger.error(f"Value error processing file: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error processing file {request.file_path}: {str(e)}")
        logger.exception("Full traceback:")
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application...")
    wait_for_ollama()
    ensure_model_exists()
    
    # Ensure directories exist
    os.makedirs(ANNOUNCEMENTS_DIR, exist_ok=True)
    os.makedirs(SUMMARIES_DIR, exist_ok=True)
    logger.info("Application startup complete")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
