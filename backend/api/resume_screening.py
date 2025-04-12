from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks, Depends, Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
import tempfile
import shutil
import json
import time
import traceback
from pathlib import Path
import chromadb
from chromadb.utils import embedding_functions

from utils.document_utils import parse_resume, extract_candidate_info_with_gemini as extract_candidate_info
from utils.gemini_utils import generate_response, structured_generate
from utils.email_utils import generate_candidate_email

router = APIRouter()

# Directory for storing uploaded files temporarily
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create uploads directory if it doesn't exist
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

# Initialize ChromaDB
chroma_client = chromadb.Client()

# Use a correct embedding function from ChromaDB
# Using the default embedding function as a fallback
embedding_function = embedding_functions.DefaultEmbeddingFunction()

# Try to import and use Google's embedding function if available
try:
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    
    # Create embedding function with Google Generative AI
    google_embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    # Create a custom embedding function using Google's embeddings with the correct interface
    class CustomGoogleEmbeddingFunction(embedding_functions.EmbeddingFunction):
        def __call__(self, input):
            # ChromaDB expects 'input' parameter, not 'texts'
            embeddings = google_embeddings.embed_documents(input)
            return embeddings
    
    embedding_function = CustomGoogleEmbeddingFunction()
    print("Successfully initialized Google embeddings for ChromaDB")
except Exception as e:
    print(f"Failed to initialize Google embeddings: {e}")
    print("Using default embedding function instead")

# Create or get the resume collection
try:
    resume_collection = chroma_client.get_or_create_collection(
        name="resume_embeddings",
        embedding_function=embedding_function
    )
    print("Successfully initialized ChromaDB collection 'resume_embeddings'")
except Exception as e:
    print(f"Error initializing ChromaDB: {e}")
    traceback.print_exc()

class JobDescription(BaseModel):
    title: str
    description: str
    company: str
    salary_range: Optional[str] = None
    benefits: Optional[str] = None

class EmailRequest(BaseModel):
    candidate_id: str
    job_description: JobDescription
    recruiter_name: str
    additional_notes: Optional[str] = None

class ScreeningRequest(BaseModel):
    job_title: str
    job_description: str
    company: str
    resumes: List[str]  # List of file names to analyze

class EngagementRequest(BaseModel):
    candidate_id: str
    candidate_name: str
    job_title: str
    job_description: str
    company_name: str
    recruiter_name: str
    match_score: float
    recommendation: Optional[str] = None
    is_suitable: Optional[bool] = True
    salary_range: Optional[str] = None
    benefits: Optional[str] = None

# Add a helper function to ensure consistent recommendations based on match scores
def get_recommendation_from_score(match_score):
    """
    Determine the recommendation level based on the match score.
    
    Args:
        match_score (float): The match score (0-100)
        
    Returns:
        str: The recommendation level
    """
    if match_score >= 80:
        return "Highly Recommended"
    elif match_score >= 65:
        return "Recommended"
    elif match_score >= 40:
        return "Maybe"
    else:
        return "Not Recommended"

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a resume file and store its vector embeddings in ChromaDB.
    
    Args:
        file (UploadFile): The resume file to upload.
    
    Returns:
        Dict: Response with file information.
    """
    try:
        print(f"Received file upload: {file.filename}, content_type: {file.content_type}")
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Get file extension
        file_extension = os.path.splitext(file.filename)[1]
        
        # Check if file extension is supported
        if file_extension.lower() not in ['.pdf', '.docx']:
            return {
                "success": False,
                "message": f"Unsupported file format: {file_extension}. Please upload PDF or DOCX files."
            }
        
        # Create safe filename
        safe_filename = f"{file_id}{file_extension}"
        file_path = uploads_dir / safe_filename
        
        # Write file to disk
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        print(f"File saved to {file_path}, size: {len(content)} bytes")
        
        # Parse resume to extract text and metadata
        try:
            resume_text, metadata = await parse_resume(str(file_path), file.filename)
            candidate_info = await extract_candidate_info(resume_text)
            candidate_name = candidate_info.get("candidate_name", "Unknown Candidate")
            
            print(f"Successfully extracted text from {file.filename}, candidate name: {candidate_name}")
            
            # Store document in ChromaDB
            try:
                resume_collection.add(
                    documents=[resume_text],
                    metadatas=[{
                        "candidate_name": candidate_name,
                        "file_name": file.filename,
                        "resume_id": file_id,
                        "candidate_info": json.dumps(candidate_info)
                    }],
                    ids=[file_id]
                )
                print(f"Successfully stored resume embeddings in ChromaDB with ID: {file_id}")
            except Exception as db_error:
                print(f"Error storing resume in ChromaDB: {db_error}")
                traceback.print_exc()
            
            # Return file information with extracted data
            return {
                "success": True,
                "resume_id": file_id,
                "candidate_name": candidate_name,
                "candidate_info": candidate_info,
                "filename": file.filename,
                "stored_filename": safe_filename,
                "content_type": file.content_type,
                "size": len(content),
                "text_preview": resume_text[:200] + "..." if len(resume_text) > 200 else resume_text
            }
        except Exception as parse_error:
            print(f"Error parsing resume: {parse_error}")
            traceback.print_exc()
            
            # Return partial success - file uploaded but parsing failed
            return {
                "success": True,
                "resume_id": file_id,
                "filename": file.filename,
                "stored_filename": safe_filename,
                "content_type": file.content_type,
                "size": len(content),
                "parse_error": str(parse_error)
            }
    
    except Exception as e:
        error_message = f"Error uploading file: {str(e)}"
        print(error_message)
        traceback.print_exc()
        return {
            "success": False,
            "message": error_message
        }

@router.post("/screen")
async def screen_resumes(request: ScreeningRequest):
    """
    Analyze uploaded resumes for a job description using vector embeddings.
    
    Args:
        request (ScreeningRequest): The screening request with job details and resume files.
    
    Returns:
        Dict: Analysis results for each resume.
    """
    try:
        if not request.job_description:
            raise HTTPException(status_code=400, detail="Job description is required")
        
        if not request.resumes or len(request.resumes) == 0:
            raise HTTPException(status_code=400, detail="No resumes provided")
        
        print(f"Screening request received: {len(request.resumes)} resume(s), job: {request.job_title}")
        
        # First, create embedding of the job description
        job_desc_text = f"Job Title: {request.job_title}\n\nCompany: {request.company}\n\nJob Description: {request.job_description}"
        
        # Results list
        results = []
        
        # For each resume, perform analysis
        for resume_id in request.resumes:
            try:
                # Query ChromaDB to get the resume
                query_result = resume_collection.get(
                    ids=[resume_id],
                    include=["documents", "metadatas"]
                )
                
                if not query_result["ids"] or len(query_result["ids"]) == 0:
                    results.append({
                        "filename": resume_id,
                        "error": "Resume not found in database",
                        "success": False
                    })
                    continue
                
                resume_text = query_result["documents"][0]
                metadata = query_result["metadatas"][0]
                candidate_name = metadata.get("candidate_name", "Unknown")
                candidate_info = json.loads(metadata.get("candidate_info", "{}"))
                
                # Compare the resume with the job description using Gemini
                system_message = """
                You are an expert HR recruiter and resume analyzer with 15+ years of experience matching candidates to jobs.
                Your task is to evaluate how well a candidate's resume matches a job description and provide a fair, balanced assessment.
                
                Follow these guidelines:
                1. Be generous and fair in your scoring - don't expect perfect matches
                2. Consider transferable skills and adjacent experience when calculating match scores
                3. Look for potential and growth mindset, not just exact keyword matches
                4. Consider that candidates often undersell their skills on resumes
                5. Focus on the core requirements rather than nice-to-have skills
                6. Match scores below 40% should be rare, as most applicants have some relevant skills
                7. If a candidate has 60-70% of the core requirements, they deserve a score in that range
                """
                
                prompt = f"""
                Evaluate how well this candidate's resume matches the job description below:
                
                JOB DESCRIPTION:
                Title: {request.job_title}
                Company: {request.company}
                Details: {request.job_description}
                
                RESUME:
                {resume_text}
                
                SCORING GUIDELINES:
                - Start from a baseline of 50% match and adjust up or down based on qualifications
                - 70-100%: Strong match, having most or all key requirements
                - 50-69%: Good potential match, having many key requirements but missing some
                - 30-49%: Partial match, having some relevant skills but significant gaps
                - 0-29%: Poor match, missing most key requirements
                
                Provide your analysis with:
                1. A match percentage (0-100) based on the above criteria
                2. Top 3-5 matching qualifications that align with the job
                3. Up to 3 gaps or missing qualifications
                4. A specific recommendation: "Highly Recommended" (80-100%), "Recommended" (65-79%), "Maybe" (40-64%), or "Not Recommended" (0-39%)
                5. A brief summary explaining your rationale
                
                Structure your response as JSON with the following keys:
                candidate_name, match_score, skills, experience, education, top_matches, gaps, recommendation, summary
                """
                
                # Call Gemini for analysis
                analysis_json = structured_generate(
                    prompt=prompt,
                    system_message=system_message,
                    output_schema={
                        "candidate_name": "string",
                        "match_score": "number",
                        "skills": ["string"],
                        "experience": "string",
                        "education": "string",
                        "top_matches": [{
                            "requirement": "string",
                            "match": "string"
                        }],
                        "gaps": [{
                            "requirement": "string",
                            "gap": "string"
                        }],
                        "recommendation": "string",
                        "summary": "string"
                    },
                    temperature=0.2,
                    max_tokens=2048  # Increase token limit for more detailed analysis
                )
                
                # Check if we got valid analysis
                if "error" in analysis_json:
                    print(f"Error in analysis: {analysis_json['error']}")
                    # Use fallback analysis with more generous scoring
                    fallback_score = 55
                    analysis = {
                        "candidate_name": candidate_name,
                        "match_score": fallback_score,  # Start with a reasonable baseline match
                        "skills": candidate_info.get("skills", []),
                        "experience": candidate_info.get("experience", "Experience details not available"),
                        "education": candidate_info.get("education", "Education details not available"),
                        "top_matches": [
                            {"requirement": "Basic qualifications", "match": "Candidate meets minimum qualifications for consideration"},
                            {"requirement": "Industry knowledge", "match": "Candidate has relevant background in the industry"},
                            {"requirement": "Skills", "match": "Candidate has some matching skills for the position"}
                        ],
                        "gaps": [
                            {"requirement": "Specific expertise", "gap": "May need additional training in specific areas"},
                            {"requirement": "Experience level", "gap": "Might need mentoring in some aspects of the role"}
                        ],
                        "recommendation": get_recommendation_from_score(fallback_score),  # Ensure consistent recommendation
                        "summary": "Based on the available information, this candidate shows potential but a manual review is recommended to verify fit for the role."
                    }
                else:
                    analysis = analysis_json
                    
                # Validate match score - ensure we have a reasonable value
                if not isinstance(analysis.get("match_score"), (int, float)) or analysis.get("match_score") < 0:
                    print(f"Invalid match score found: {analysis.get('match_score')}. Using default value.")
                    analysis["match_score"] = 55
                
                # Ensure recommendation is consistent with match score
                match_score = analysis.get("match_score", 0)
                correct_recommendation = get_recommendation_from_score(match_score)
                
                # If recommendation is missing or doesn't align with score, update it
                if not analysis.get("recommendation") or analysis.get("recommendation") != correct_recommendation:
                    print(f"Updating recommendation from '{analysis.get('recommendation')}' to '{correct_recommendation}' for match score {match_score}%")
                    analysis["recommendation"] = correct_recommendation
                
                print(f"Analysis for {candidate_name}: Match Score = {analysis.get('match_score', 0)}%, Recommendation = {analysis.get('recommendation', 'None')}")
                
                # Add to results
                results.append({
                    "filename": resume_id,
                    "analysis": analysis,
                    "success": True
                })
                
            except Exception as resume_error:
                print(f"Error analyzing resume {resume_id}: {resume_error}")
                traceback.print_exc()
                results.append({
                    "filename": resume_id,
                    "error": str(resume_error),
                    "success": False
                })
        
        return {"results": results}
    
    except Exception as e:
        error_detail = f"Error analyzing resumes: {str(e)}"
        print(error_detail)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_detail)

@router.post("/engage")
async def engage_candidate(request: Dict[str, Any] = Body(...)):
    """
    Generate engagement communications (both acceptance and rejection) for a candidate.
    
    Args:
        request: Dictionary containing candidate and job details.
    
    Returns:
        Dict: Response with generated emails and LinkedIn messages for both acceptance and rejection.
    """
    try:
        # Extract data from request
        candidate_id = request.get("candidate_id", "")
        candidate_name = request.get("candidate_name", "Candidate")
        job_title = request.get("job_title", "")
        job_description = request.get("job_description", "")
        company_name = request.get("company_name", "Our Company")
        recruiter_name = request.get("recruiter_name", "Recruiter")
        match_score = request.get("match_score", 0)
        recommendation = request.get("recommendation", "")
        is_suitable = request.get("is_suitable", match_score >= 65)
        salary_range = request.get("salary_range", "")
        benefits = request.get("benefits", "")
        max_tokens = request.get("max_tokens", 2048)
        
        # Always generate both acceptance and rejection communications
        acceptance_communications = await generate_communications(
            candidate_name=candidate_name,
            job_title=job_title,
            job_description=job_description,
            company_name=company_name,
            recruiter_name=recruiter_name,
            match_score=match_score,
            is_acceptance=True,
            salary_range=salary_range,
            benefits=benefits,
            max_tokens=max_tokens
        )
        
        rejection_communications = await generate_communications(
            candidate_name=candidate_name,
            job_title=job_title,
            job_description=job_description,
            company_name=company_name,
            recruiter_name=recruiter_name,
            match_score=match_score,
            is_acceptance=False,
            salary_range=salary_range,
            benefits=benefits,
            max_tokens=max_tokens
        )
        
        # Default to the recommendation based on suitability
        is_acceptance = is_suitable
        
        return {
            "success": True,
            "message": "Communications generated successfully",
            "is_acceptance": is_acceptance,
            "match_score": match_score,
            "acceptance": {
                "email": acceptance_communications["email"],
                "linkedin_message": acceptance_communications["linkedin_message"]
            },
            "rejection": {
                "email": rejection_communications["email"],
                "linkedin_message": rejection_communications["linkedin_message"]
            },
            "email": acceptance_communications["email"] if is_acceptance else rejection_communications["email"],
            "linkedin_message": acceptance_communications["linkedin_message"] if is_acceptance else rejection_communications["linkedin_message"]
        }
    
    except Exception as e:
        error_detail = f"Error generating engagement communications: {str(e)}"
        print(error_detail)
        traceback.print_exc()
        return {
            "success": False,
            "message": error_detail
        }

async def generate_communications(
    candidate_name: str,
    job_title: str,
    job_description: str,
    company_name: str,
    recruiter_name: str,
    match_score: float,
    is_acceptance: bool,
    salary_range: str = "",
    benefits: str = "",
    max_tokens: int = 2048
) -> Dict[str, Any]:
    """
    Generate communication (email and LinkedIn message) for a candidate.
    
    Args:
        candidate_name: Name of the candidate
        job_title: Title of the job
        job_description: Description of the job
        company_name: Name of the company
        recruiter_name: Name of the recruiter
        match_score: Match score of the candidate
        is_acceptance: Whether this is an acceptance or rejection communication
        salary_range: Salary range for the job (optional)
        benefits: Benefits offered with the job (optional)
        max_tokens: Maximum tokens for the response
        
    Returns:
        Dict with email and LinkedIn message
    """
    # Build the system message for Gemini
    email_type = "positive interview invitation" if is_acceptance else "polite rejection"
    point3 = "Briefly explain the job opportunity and why they're a good fit" if is_acceptance else "Be kind but clear that they are not being moved forward"
    point4 = "Include a clear call to action for scheduling an interview" if is_acceptance else "Thank them for their time and interest"
    
    system_message = f"""
    You are an expert HR recruiter crafting personalized communications to candidates.
    Your task is to draft both a professional email and a LinkedIn message that are personalized, engaging, and appropriate.
    
    You are writing a {email_type} communication.
    
    Follow these guidelines for the email:
    1. Be concise and respectful of the recipient's time
    2. Personalize the message based on the candidate's name
    3. {point3}
    4. {point4}
    5. Use a professional and friendly tone
    6. Do not use generic templates - make it specific to this scenario
    7. Do not use markdown formatting
    
    For the LinkedIn message:
    1. Be more concise than the email (LinkedIn messages should be shorter)
    2. Maintain a professional but slightly more conversational tone
    3. Include a brief introduction about yourself and the company
    4. For acceptance: express enthusiasm about their profile and include a call to action
    5. For rejection: be respectful and encouraging for future opportunities
    
    Current recruiter: {recruiter_name}
    Company: {company_name}
    """
    
    # Create the prompt with all necessary information
    email_draft_type = "interview invitation" if is_acceptance else "polite rejection"
    match_result = "Our analysis shows this candidate is a strong match for the position." if is_acceptance else "While the candidate has merit, they are not the best fit for this specific role."
    
    prompt = f"""
    Draft the following communications for:
    
    Candidate Name: {candidate_name}
    Job Title: {job_title}
    Match Score: {match_score}%
    
    Job Description:
    {job_description}
    
    {match_result}
    
    First, create an email:
    Start with "Subject: [Your email subject]"
    Then skip a line and write the email body.
    
    After the complete email, add "---" on a separate line, then write:
    "LinkedIn Message:" followed by a short LinkedIn message suitable for this {email_draft_type} scenario.
    """
    
    # Generate the content using Gemini
    content = generate_response(
        prompt=prompt,
        system_message=system_message,
        temperature=0.7,
        max_tokens=max_tokens
    )
    
    print(f"Generated content length: {len(content)} characters for {email_draft_type}")
    
    # Extract email and LinkedIn message
    email_content = ""
    linkedin_message = ""
    
    if "---" in content:
        parts = content.split("---", 1)
        email_content = parts[0].strip()
        linkedin_part = parts[1].strip()
        
        # Extract LinkedIn message
        if "LinkedIn Message:" in linkedin_part:
            linkedin_message = linkedin_part.split("LinkedIn Message:", 1)[1].strip()
        else:
            linkedin_message = linkedin_part
    else:
        email_content = content
        linkedin_message = "Could not generate LinkedIn message."
    
    # Extract subject line and body from email
    email_parts = email_content.split("\n", 1)
    
    subject = email_parts[0]
    if subject.lower().startswith("subject:"):
        subject = subject[8:].strip()
    
    body = email_parts[1].strip() if len(email_parts) > 1 else email_content
    
    return {
        "email": {
            "subject": subject,
            "body": body
        },
        "linkedin_message": linkedin_message
    }

# To maintain expected API behavior, we'll keep these endpoints but simplify them
@router.get("/analysis/{analysis_id}")
async def get_analysis_result(analysis_id: str):
    """
    Get the result of a previous analysis by ID.
    
    This endpoint is simplified and returns mock data.
    """
    return {
        "analysis_id": analysis_id,
        "status": "completed",
        "results": {
            "candidate_name": "John Doe",
            "match_score": 85,
            "skills": ["Python", "JavaScript", "React", "FastAPI", "AWS"],
            "experience": "8 years",
            "education": "Master's Degree in Computer Science",
            "top_matches": [
                {"requirement": "5+ years of experience", "match": "Candidate has 8 years of experience"},
                {"requirement": "React experience", "match": "Candidate has worked on multiple React projects"},
                {"requirement": "Python skills", "match": "Candidate has strong Python experience"}
            ],
            "gaps": [
                {"requirement": "DevOps experience", "gap": "No significant DevOps experience mentioned"},
                {"requirement": "Team leadership", "gap": "Limited leadership experience"}
            ],
            "recommendation": "Recommended",
            "summary": "Strong technical candidate with extensive experience in software development."
        }
    } 