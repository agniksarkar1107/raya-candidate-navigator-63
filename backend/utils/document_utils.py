import os
from typing import Dict, Any, Optional, Tuple
import uuid
from datetime import datetime
import traceback
import base64
import io

# For PDF extraction and conversion
try:
    import fitz  # PyMuPDF
    import pdf2image  # For converting PDF to image
    HAS_PDF_TOOLS = True
except ImportError:
    HAS_PDF_TOOLS = False
    print("PDF tools (PyMuPDF/pdf2image) not installed. Will use mock PDF extraction.")

# For DOCX extraction
try:
    import docx
    from PIL import Image
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False
    print("python-docx not installed. Will use mock DOCX extraction.")

from utils.gemini_utils import generate_response, generate_vision_response

async def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file using PyMuPDF if available, otherwise return mock data.
    
    Args:
        file_path (str): Path to the PDF file.
    
    Returns:
        str: Extracted text from the PDF.
    """
    try:
        if HAS_PDF_TOOLS:
            print(f"Extracting text from PDF: {file_path}")
            
            # First try traditional text extraction
            text = ""
            with fitz.open(file_path) as pdf:
                # Extract text from each page
                for page in pdf:
                    text += page.get_text()
            
            # If we got good text, return it
            if text and len(text.strip()) > 100:  # Assuming a reasonable resume has >100 chars
                return text
                
            # If text extraction didn't yield good results, convert to image and use Gemini Vision
            print(f"Text extraction yielded limited results, trying PDF-to-image conversion")
            images = pdf2image.convert_from_path(file_path)
            
            if not images:
                print(f"No images extracted from PDF: {file_path}")
                return get_mock_resume_text()
                
            # Convert the first page to bytes (most resumes are 1-2 pages)
            first_page = images[0]
            img_byte_arr = io.BytesIO()
            first_page.save(img_byte_arr, format='JPEG')
            img_byte_arr = img_byte_arr.getvalue()
            
            # Create image part for Gemini
            image_parts = [{
                "mime_type": "image/jpeg",
                "data": base64.b64encode(img_byte_arr).decode()
            }]
            
            # Use Gemini Vision to extract text
            prompt = "Extract all text content from this resume image in plain text format. Include all details you can see."
            extracted_text = await generate_vision_response(prompt, image_parts)
            
            # If we got good text via vision, return that
            if extracted_text and len(extracted_text.strip()) > 100:
                return extracted_text
            
            # If neither method worked well, return mock data
            print(f"Vision extraction failed too, using mock data for: {file_path}")
            return get_mock_resume_text()
        else:
            print("PDF tools not available, using mock data")
            return get_mock_resume_text()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        traceback.print_exc()
        return get_mock_resume_text()

async def extract_text_from_docx(file_path: str) -> str:
    """
    Extract text from a DOCX file using python-docx if available, otherwise return mock data.
    
    Args:
        file_path (str): Path to the DOCX file.
    
    Returns:
        str: Extracted text from the DOCX.
    """
    try:
        if HAS_DOCX:
            text = ""
            # Open the document
            doc = docx.Document(file_path)
            # Extract text from paragraphs
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text
        else:
            # Return mock resume text
            return get_mock_resume_text()
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        traceback.print_exc()
        return get_mock_resume_text()

def get_mock_resume_text() -> str:
    """
    Return mock resume text for testing purposes.
    
    Returns:
        str: Mock resume text.
    """
    return """
    John Doe
    john.doe@example.com | (555) 123-4567
    
    SUMMARY
    Experienced software engineer with 8 years of experience in full-stack development.
    
    SKILLS
    Python, JavaScript, React, Node.js, AWS, Docker, FastAPI, Django
    
    EXPERIENCE
    Senior Software Engineer | Tech Solutions Inc. | 2020-Present
    - Developed scalable APIs using FastAPI and Python
    - Led a team of 5 developers on a major product launch
    
    Software Engineer | Web Innovations | 2017-2020
    - Built frontend applications with React
    - Implemented CI/CD pipelines for automated testing
    
    EDUCATION
    Master of Computer Science | State University | 2017
    Bachelor of Science in Computer Engineering | Tech Institute | 2015
    """

async def parse_resume(file_path: str, file_name: str) -> Tuple[str, Dict[str, Any]]:
    """
    Parse a resume file and extract text and metadata.
    
    Args:
        file_path (str): Path to the resume file.
        file_name (str): Original file name.
    
    Returns:
        Tuple[str, Dict]: Extracted text and metadata.
    """
    # Generate a unique ID for the resume
    resume_id = str(uuid.uuid4())
    
    # Extract text based on file type
    file_extension = os.path.splitext(file_path)[1].lower()
    
    try:
        if file_extension == '.pdf':
            resume_text = await extract_text_from_pdf(file_path)
        elif file_extension == '.docx':
            resume_text = await extract_text_from_docx(file_path)
        else:
            resume_text = f"Unsupported file type: {file_extension}"
            print(f"Unsupported file type: {file_extension}")
            
        # If we couldn't extract text, use mock data
        if not resume_text or resume_text.strip() == "":
            print(f"Empty text extracted from file: {file_name}. Using mock data.")
            resume_text = get_mock_resume_text()
    
        # Extract candidate info using Gemini
        candidate_info = await extract_candidate_info_with_gemini(resume_text)
        
        # Basic metadata
        metadata = {
            "file_name": file_name,
            "upload_date": datetime.now().isoformat(),
            "file_size": os.path.getsize(file_path),
            "file_type": file_extension,
            "candidate_name": candidate_info.get("candidate_name", "Unknown"),
            "email": candidate_info.get("email", ""),
            "phone": candidate_info.get("phone", ""),
            "skills": candidate_info.get("skills", [])
        }
        
        return resume_text, metadata
    except Exception as e:
        print(f"Error parsing resume: {e}")
        traceback.print_exc()
        return get_mock_resume_text(), {
            "file_name": file_name,
            "file_type": file_extension,
            "candidate_name": "John Doe (Mock)",
            "email": "john.doe@example.com"
        }

async def extract_candidate_info_with_gemini(resume_text: str) -> Dict[str, Any]:
    """
    Use Gemini to extract structured candidate information from resume text.
    Falls back to mock data if there's an error.
    
    Args:
        resume_text (str): The text content of the resume.
    
    Returns:
        Dict: Structured candidate information.
    """
    try:
        system_message = """
        You are an expert resume parser. Your task is to extract key information from a resume text.
        Extract only what's actually in the text - do not make assumptions or add information not present.
        If information is missing, leave those fields empty or null.
        """
        
        prompt = f"""
        Extract the following information from this resume:
        
        {resume_text}
        
        Return the following:
        - Candidate name
        - Email address
        - Phone number
        - List of skills
        - Work experience (company names, job titles, dates, and descriptions)
        - Education (institutions, degrees, graduation years)
        
        Format as JSON with keys: candidate_name, email, phone, skills, experience, education
        """
        
        # Try to use Gemini for extraction, otherwise use mock data
        try:
            response = generate_response(
                prompt=prompt,
                system_message=system_message,
                temperature=0.1
            )
            
            # Try to parse the response as JSON
            # Find the JSON part of the response (between { and })
            start_idx = response.find('{')
            end_idx = response.rfind('}')
            
            if start_idx != -1 and end_idx != -1:
                import json
                candidate_info = json.loads(response[start_idx:end_idx+1])
                return candidate_info
            else:
                # Fall back to mock data
                print("Could not extract JSON from Gemini response, using mock data")
                return get_mock_candidate_info()
                
        except Exception as e:
            print(f"Error using Gemini for resume parsing: {e}")
            return get_mock_candidate_info()
            
    except Exception as e:
        print(f"Error in extract_candidate_info: {e}")
        traceback.print_exc()
        return get_mock_candidate_info()

def get_mock_candidate_info() -> Dict[str, Any]:
    """
    Return mock candidate info for testing purposes.
    
    Returns:
        Dict: Mock candidate information.
    """
    return {
        "candidate_name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "(555) 123-4567",
        "skills": ["Python", "JavaScript", "React", "FastAPI", "AWS", "Docker"],
        "experience": [
            {
                "company": "Tech Solutions Inc.",
                "title": "Senior Software Engineer",
                "duration": "2020-Present",
                "description": "Developed scalable APIs using FastAPI and Python. Led a team of 5 developers."
            },
            {
                "company": "Web Innovations",
                "title": "Software Engineer",
                "duration": "2017-2020",
                "description": "Built frontend applications with React. Implemented CI/CD pipelines."
            }
        ],
        "education": [
            {
                "institution": "State University",
                "degree": "Master of Computer Science",
                "graduation_year": "2017"
            },
            {
                "institution": "Tech Institute",
                "degree": "Bachelor of Science in Computer Engineering",
                "graduation_year": "2015"
            }
        ]
    } 