from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import random
import time
import traceback

from utils.serper_utils import search_and_extract
from utils.gemini_utils import generate_response

router = APIRouter()

class JobMatchRequest(BaseModel):
    job_title: str
    company: str
    job_description: str
    skills: List[str]
    experience_level: str = "Mid-level"
    location: str = "Remote"

class TalentDiscoveryRequest(BaseModel):
    search_query: str
    job_description: Optional[str] = None
    company_name: Optional[str] = None

class PerfectFitRequest(BaseModel):
    candidates: List[Dict[str, Any]]
    job_title: str
    job_description: str
    company: str
    location: str = "Remote"

class EngagementRequest(BaseModel):
    candidate_name: str
    candidate_title: str
    job_title: str
    job_description: str
    company: str
    recruiter_name: str

# Mock data for candidate profiles
def generate_mock_candidates(query, count=10):
    """Generate mock candidate data"""
    candidates = []
    names = ["Emma Johnson", "Michael Smith", "Sophia Williams", "James Brown", 
             "Olivia Jones", "William Garcia", "Ava Martinez", "Alexander Robinson",
             "Isabella Clark", "Daniel Rodriguez", "Charlotte Lewis", "Matthew Lee"]
    
    titles = ["Software Engineer", "Senior Developer", "Full Stack Engineer", "Frontend Developer",
              "Backend Engineer", "DevOps Engineer", "Cloud Architect", "Data Scientist",
              "Machine Learning Engineer", "UI/UX Designer", "Product Manager", "Mobile Developer"]
    
    locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA",
                 "Boston, MA", "Chicago, IL", "Denver, CO", "Remote", 
                 "Los Angeles, CA", "Portland, OR", "Atlanta, GA", "Miami, FL"]
    
    all_skills = ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes",
                 "Java", "C#", ".NET", "SQL", "NoSQL", "MongoDB", "PostgreSQL", 
                 "TypeScript", "Angular", "Vue.js", "Go", "Ruby", "Django", "FastAPI",
                 "CI/CD", "Git", "Machine Learning", "TensorFlow", "PyTorch"]
    
    for i in range(min(count, len(names))):
        # Get random skills (3-6)
        num_skills = random.randint(3, 6)
        skills = random.sample(all_skills, num_skills)
        
        # Match score (higher if job_title or skills are in query)
        match_score = random.randint(65, 95)
        
        candidates.append({
            "id": f"cand-{random.randint(1000, 9999)}",
            "name": names[i],
            "title": titles[i],
            "location": locations[i],
            "experience": f"{random.randint(1, 15)} years",
            "skills": skills,
            "match_score": match_score,
            "summary": f"Experienced {titles[i]} with expertise in {', '.join(skills[:3])} and more."
        })
    
    # Sort by match score
    candidates.sort(key=lambda x: x["match_score"], reverse=True)
    return candidates

@router.post("/job-matches")
async def find_job_matches(request: JobMatchRequest):
    """
    Find candidate matches for a job description.
    
    Args:
        request (JobMatchRequest): Job details to match against.
    
    Returns:
        Dict: List of matching candidates.
    """
    try:
        # Validate input
        if not request.job_description:
            raise HTTPException(status_code=400, detail="Job description is required")
        
        # Add a small delay to simulate processing time
        time.sleep(1)
        
        # Generate mock candidate matches based on job description
        query_terms = request.job_title + " " + " ".join(request.skills)
        candidates = generate_mock_candidates(query_terms, 15)
        
        return {
            "total_matches": len(candidates),
            "candidates": candidates
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding job matches: {str(e)}")

@router.post("/perfect-fits")
async def find_perfect_fits(request: PerfectFitRequest):
    """
    Analyze candidate matches to find perfect fits.
    
    Args:
        request (PerfectFitRequest): Candidates and job details.
    
    Returns:
        Dict: List of perfect fit candidates with reasoning.
    """
    try:
        if not request.candidates:
            raise HTTPException(status_code=400, detail="Candidates are required")
        
        # Add a small delay to simulate processing time
        time.sleep(1.5)
        
        # Select top 3 candidates as "perfect fits"
        candidates = request.candidates[:3]
        
        # For each candidate, add reasoning
        perfect_fits = []
        for candidate in candidates:
            reasons = [
                f"Strong experience in {candidate['title']} role",
                f"Matches key skills: {', '.join(candidate['skills'][:3])}",
                f"Appropriate experience level: {candidate['experience']}"
            ]
            
            # Add location-based reason if not remote
            if candidate.get("location", "").lower() != "remote" and request.location != "Remote":
                reasons.append(f"Location in {candidate['location']} matches job requirements")
            
            perfect_fits.append({
                "candidate": candidate,
                "reasons": reasons,
                "recommendation_score": candidate.get("match_score", 0) + random.randint(1, 5)
            })
        
        return {
            "perfect_fits": perfect_fits,
            "total_analyzed": len(request.candidates)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding perfect fits: {str(e)}")

@router.post("/engage-candidate")
async def engage_candidate(request: EngagementRequest):
    """
    Generate an engagement email for a candidate.
    
    Args:
        request (EngagementRequest): Candidate and job details.
    
    Returns:
        Dict: Generated email content.
    """
    try:
        candidate_name = request.candidate_name
        job_title = request.job_title
        company = request.company
        recruiter_name = request.recruiter_name
        
        # Mock email content
        email_subject = f"Exciting {job_title} Opportunity at {company}"
        email_body = f"""
Dear {candidate_name},

I hope this email finds you well. I'm {recruiter_name}, a recruiter at {company}, and I'm reaching out regarding an exciting {job_title} opportunity that I believe aligns with your background.

Your experience and skills make you an excellent candidate for this role. We would love to discuss how your background could be a great fit for our team.

Would you be interested in discussing this opportunity further? If so, please let me know when you might be available for a brief call.

Best regards,
{recruiter_name}
Recruiter, {company}
        """
        
        return {
            "subject": email_subject,
            "body": email_body
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating engagement email: {str(e)}")

@router.post("/talent-discovery")
async def talent_discovery(request: TalentDiscoveryRequest):
    """
    Use web search to find real candidate profiles matching the search criteria.
    
    Args:
        request (TalentDiscoveryRequest): Search query and job details.
    
    Returns:
        Dict: Discovered talent profiles and analysis.
    """
    try:
        if not request.search_query:
            raise HTTPException(status_code=400, detail="Search query is required")
        
        print(f"Starting talent discovery for: {request.search_query}")
        
        # Format the search query to find professional profiles
        search_query = f"{request.search_query} linkedin professional profile resume"
        
        # Use Serper API to search for candidate profiles
        print("Running web search via Serper API...")
        search_results = await search_and_extract(search_query, num_results=25)
        
        if not search_results:
            return {
                "success": False,
                "message": "No candidate profiles found in web search",
                "profiles": [],
                "analysis": "",
                "email": None
            }
        
        print(f"Found {len(search_results)} potential profiles")
        
        # Transform search results into candidate profiles
        profiles = []
        for i, result in enumerate(search_results):
            # Extract only title and snippet for profiles
            profiles.append({
                "id": f"profile-{i+1}",
                "title": result.get("title", "Unknown Profile"),
                "description": result.get("snippet", "No description available"),
                "link": result.get("link", "#")
            })
        
        # Build prompt for Gemini to analyze the candidates
        system_message = """
        You are an expert talent sourcing AI specialized in identifying promising candidates from web search results.
        Your task is to analyze search results for potential candidates matching a job requirement.
        
        Provide a comprehensive analysis including:
        1. Key patterns and trends among the profiles
        2. Top matches and why they're promising
        3. Specific skills and experiences that stand out
        4. Recommendations for which candidates to prioritize
        
        Be specific and detailed in your analysis, mentioning actual candidate details from the search results.
        Focus only on professional qualifications and avoid any bias based on personal attributes.
        """
        
        # Create the analysis prompt
        prompt = f"""
        Job search query: {request.search_query}
        
        {request.job_description if request.job_description else ""}
        
        Here are the candidate profiles found from web search:
        
        """
        
        # Add each profile to the prompt
        for i, profile in enumerate(profiles, 1):
            prompt += f"\nCandidate {i}:\n"
            prompt += f"Title: {profile['title']}\n"
            prompt += f"Description: {profile['description']}\n"
            prompt += f"Link: {profile['link']}\n"
        
        prompt += """
        Please analyze these profiles and identify the most promising candidates for this position.
        Be specific and detailed in your analysis, focusing on skills, experience, and qualifications.
        """
        
        # Use Gemini to analyze the candidate profiles
        print("Asking Gemini to analyze candidate profiles...")
        analysis = generate_response(
            prompt=prompt,
            system_message=system_message,
            temperature=0.5
        )
        
        print("Analysis complete")
        
        return {
            "success": True,
            "message": f"Found {len(profiles)} potential candidates",
            "profiles": profiles,
            "analysis": analysis,
            "email": None
        }
    
    except Exception as e:
        error_detail = f"Error in talent discovery: {str(e)}"
        print(error_detail)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_detail)

@router.post("/draft-outreach-email")
async def draft_outreach_email(request: Dict[str, Any] = Body(...)):
    """
    Generate an outreach email for a promising candidate.
    
    Args:
        request: Dictionary containing candidate details and job information.
    
    Returns:
        Dict: Generated email content.
    """
    try:
        job_query = request.get("job_query", "")
        job_description = request.get("job_description", "")
        company_name = request.get("company_name", "Our Company")
        recruiter_name = request.get("recruiter_name", "Recruiter")
        candidate_profile = request.get("candidate_profile", {})
        
        if not job_query:
            raise HTTPException(status_code=400, detail="Job query is required")
        
        if not candidate_profile:
            raise HTTPException(status_code=400, detail="Candidate profile is required")
        
        # Extract candidate information
        candidate_title = candidate_profile.get("title", "Professional")
        candidate_description = candidate_profile.get("description", "")
        
        # Build prompt for Gemini to generate the email
        system_message = """
        You are an expert recruiter specialized in writing compelling outreach emails to potential candidates.
        Your task is to draft a professional email that is personalized, engaging, and likely to receive a response.
        
        Follow these guidelines:
        1. Be concise and respectful of the recipient's time
        2. Personalize based on the candidate's background
        3. Briefly explain the opportunity and why they're a good fit
        4. Include a clear call to action for a preliminary conversation
        5. Use a professional and friendly tone
        6. Do not use generic templates - make it specific to this candidate
        7. Do not include salary information
        8. DO NOT use any markdown formatting like asterisks (*) or underscores (_) in your response
        9. Format your response with a Subject line followed by the email body
        """
        
        # Create the email generation prompt
        prompt = f"""
        Draft an outreach email to a candidate with the following details:
        
        Job Position: {job_query}
        Company: {company_name}
        Recruiter Name: {recruiter_name}
        
        Job Description:
        {job_description}
        
        Candidate Information:
        Title: {candidate_title}
        Background: {candidate_description}
        
        First line should be "Subject: [Your email subject]"
        Then skip a line and write the email body.
        Draft a compelling email that would encourage this candidate to respond and schedule an interview call.
        Remember, do not use any markdown formatting like asterisks (*) or underscores (_).
        """
        
        # Use Gemini to generate the email
        print("Asking Gemini to draft an outreach email...")
        email_content = generate_response(
            prompt=prompt,
            system_message=system_message,
            temperature=0.7
        )
        
        # Remove any markdown formatting that might still be present
        email_content = email_content.replace("*", "").replace("_", "").replace("#", "")
        
        # Extract subject line and body
        email_parts = email_content.split("\n", 1)
        
        subject = email_parts[0]
        if subject.lower().startswith("subject:"):
            subject = subject[8:].strip()
        
        body = email_parts[1].strip() if len(email_parts) > 1 else email_content
        
        print(f"Email generated with subject: {subject}")
        print(f"Email body preview: {body[:100]}...")
        
        return {
            "success": True,
            "message": "Email drafted successfully",
            "email": {
                "subject": subject,
                "body": body
            }
        }
    
    except Exception as e:
        error_detail = f"Error drafting outreach email: {str(e)}"
        print(error_detail)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_detail)

@router.post("/draft-linkedin-message")
async def draft_linkedin_message(request: Dict[str, Any] = Body(...)):
    """
    Generate a LinkedIn connection message for a promising candidate.
    
    Args:
        request: Dictionary containing candidate details and job information.
    
    Returns:
        Dict: Generated LinkedIn message content.
    """
    try:
        job_query = request.get("job_query", "")
        job_description = request.get("job_description", "")
        company_name = request.get("company_name", "Our Company")
        recruiter_name = request.get("recruiter_name", "Recruiter")
        candidate_profile = request.get("candidate_profile", {})
        
        if not job_query:
            raise HTTPException(status_code=400, detail="Job query is required")
        
        if not candidate_profile:
            raise HTTPException(status_code=400, detail="Candidate profile is required")
        
        # Extract candidate information
        candidate_title = candidate_profile.get("title", "Professional")
        candidate_description = candidate_profile.get("description", "")
        
        # Build prompt for Gemini to generate the message
        system_message = """
        You are an expert recruiter specialized in writing compelling LinkedIn connection messages to potential candidates.
        Your task is to draft a concise and professional LinkedIn message that is personalized, engaging, and likely to receive a response.
        
        Follow these guidelines:
        1. Keep it very brief (150 words max) as LinkedIn has character limits
        2. Be personalized based on the candidate's background
        3. Briefly mention the opportunity without too much detail
        4. Include a clear call to action
        5. Use a professional and friendly tone
        6. Do not use generic templates - make it specific to this candidate
        7. DO NOT use any markdown formatting like asterisks (*) or underscores (_) in your response
        """
        
        # Create the message generation prompt
        prompt = f"""
        Draft a LinkedIn connection message to a candidate with the following details:
        
        Job Position: {job_query}
        Company: {company_name}
        Recruiter Name: {recruiter_name}
        
        Candidate Information:
        Title: {candidate_title}
        Background: {candidate_description}
        
        Draft a compelling but BRIEF LinkedIn message (max 150 words) that would encourage this candidate to accept your connection request and explore the job opportunity.
        Remember, do not use any markdown formatting like asterisks (*) or underscores (_).
        """
        
        # Use Gemini to generate the message
        print("Asking Gemini to draft a LinkedIn message...")
        message_content = generate_response(
            prompt=prompt,
            system_message=system_message,
            temperature=0.7
        )
        
        print(f"LinkedIn message generated (preview): {message_content[:100]}...")
        
        return {
            "success": True,
            "message": "LinkedIn message drafted successfully",
            "linkedin_message": message_content.strip()
        }
    
    except Exception as e:
        error_detail = f"Error drafting LinkedIn message: {str(e)}"
        print(error_detail)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_detail) 