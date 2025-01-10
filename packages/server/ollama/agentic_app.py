from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
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
    file_path: str
    output_file_path: str

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

class AnnouncementProcessor:
    def __init__(self):
        self.llm = create_llm()
        self.initialize_agent()

    def initialize_agent(self):
        # Define tools for the agent
        tools = [
            Tool(
                name="Process_Announcement",
                func=self._process_announcement_single_call,
                description="Processes the entire announcement in a single call"
            ),
            Tool(
                name="Validate_Output",
                func=self._validate_and_clean_output,
                description="Validates and cleans the generated output"
            )
        ]

        # Initialize the agent with memory
        memory = ConversationBufferMemory(memory_key="chat_history")
        
        self.agent = initialize_agent(
            tools,
            self.llm,
            agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
            memory=memory,
            verbose=True
        )

        # Define the supervisor chain
        supervisor_template = """
        You are a supervisor responsible for ensuring high-quality outputs from the announcement processing system.
        Review the following output and ensure it meets these criteria:
        1. Classification is from the approved list
        2. Subject is concise (one line) and relevant
        3. Summary is exactly three lines with no prefixes like "Here's the summary"
        4. All outputs are properly formatted with no extraneous text

        Current output:
        Classification: {classification}
        Subject: {subject}
        Summary: {summary}

        If any issues are found, provide corrected versions. If everything is fine, return the original.
        """
        
        self.supervisor_chain = LLMChain(
            llm=self.llm,
            prompt=PromptTemplate(
                template=supervisor_template,
                input_variables=["classification", "subject", "summary"]
            )
        )

    def _process_announcement_single_call(self, text: str) -> dict:
        template = """
        Process this corporate announcement and provide exactly three things in this order:

        1. Classification - choose exactly one category from this list:
           - Resignation of KMP
           - Preference Shares Issue
           - Receipt of Order
           - Procedural Update
           - Fund Raising
           - Capital Expenditure
           - Merger and Acquisition
           - Board Meeting
           - Financial Results
           - Credit Rating
           - Regulatory Compliance
           - Market Operations
           - Legal Proceedings
           - Strategic Alliance
           - Asset Sale
           - New Project

        2. Subject - Provide the main subject in exactly one line
        3. Summary - Provide exactly three lines summarizing the announcement
        
        Format your response exactly like this:
        CLASSIFICATION: [your classification]
        SUBJECT: [your one-line subject]
        SUMMARY:
        [first line of summary]
        [second line of summary]
        [third line of summary]

        Text: {text}"""
        
        chain = LLMChain(
            llm=self.llm, 
            prompt=PromptTemplate(template=template, input_variables=["text"])
        )
        
        # Get response and parse it
        response = chain.invoke(text).strip()
        
        try:
            # Split the response into sections
            sections = response.split('\n')
            
            # Extract each component
            classification = sections[0].replace('CLASSIFICATION:', '').strip()
            subject = sections[1].replace('SUBJECT:', '').strip()
            
            # Get the summary lines, skipping the "SUMMARY:" line
            summary_lines = [line.strip() for line in sections[3:6]]
            summary = '\n'.join(summary_lines)
            
            return {
                "classification": classification,
                "subject": subject,
                "summary": summary
            }
        except Exception as e:
            logger.error(f"Error parsing LLM response: {str(e)}")
            logger.error(f"Raw response: {response}")
            raise

    def _validate_and_clean_output(self, output: dict) -> dict:
        # invoke the supervisor chain
        supervisor_response = self.supervisor_chain.invoke(
            classification=output["classification"],
            subject=output["subject"],
            summary=output["summary"]
        )

        # Parse and clean the supervisor's response
        cleaned_output = output.copy()
        
        # Remove any common prefixes from summary
        prefixes_to_remove = [
            "Here's the summary:",
            "Summary:",
            "Here is the three-line summary:",
            "Three-line summary:"
        ]
        
        summary = cleaned_output["summary"]
        for prefix in prefixes_to_remove:
            if summary.lower().startswith(prefix.lower()):
                summary = summary[len(prefix):].strip()
        
        # Ensure summary is exactly three lines
        summary_lines = summary.split('\n')
        if len(summary_lines) != 3:
            logger.warning(f"Summary has {len(summary_lines)} lines instead of 3")
            # If more than 3 lines, take first 3
            # If less than 3 lines, pad with empty lines
            summary = '\n'.join((summary_lines + [''] * 3)[:3])
        
        cleaned_output["summary"] = summary
        return cleaned_output

    async def process_announcement(self, text: str) -> dict:
        try:
            # Single call to process the announcement
            output = self._process_announcement_single_call(text)
            
            # Only validate if needed (e.g., if we detect potential issues)
            needs_validation = any([
                "Here's" in output["summary"],
                "Summary:" in output["summary"],
                len(output["summary"].split('\n')) != 3,
                output["classification"] not in [
                    "Resignation of KMP", "Preference Shares Issue", "Receipt of Order",
                    "Procedural Update", "Fund Raising", "Capital Expenditure",
                    "Merger and Acquisition", "Board Meeting", "Financial Results",
                    "Credit Rating", "Regulatory Compliance", "Market Operations",
                    "Legal Proceedings", "Strategic Alliance", "Asset Sale", "New Project"
                ]
            ])
            
            if needs_validation:
                output = self._validate_and_clean_output(output)
            
            return output
            
        except Exception as e:
            logger.error(f"Error processing announcement: {str(e)}")
            raise

# Initialize the processor
processor = AnnouncementProcessor()

@app.post("/summarizeFile")
async def summarize_file(request: FileRequest):
    logger.info(f"Received request to summarize file: {request.file_path}")
    try:
        # Read and process the file
        content = read_and_process_file(request.file_path)
        
        # Process the announcement using the agent
        response_data = await processor.process_announcement(content)
        
        # Add input file information
        response_data["input_file"] = request.file_path
        
        # Write output to JSON file
        output_path = write_output_json(request.output_file_path, response_data)
        response_data["output_file"] = output_path
        
        return response_data
        
    except Exception as e:
        logger.error(f"Error processing file {request.file_path}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Keep the existing helper functions (read_and_process_file, write_output_json, etc.)
# [Previous helper functions remain unchanged]

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application...")
    wait_for_ollama()
    ensure_model_exists()
    os.makedirs(ANNOUNCEMENTS_DIR, exist_ok=True)
    os.makedirs(SUMMARIES_DIR, exist_ok=True)
    logger.info("Application startup complete")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)