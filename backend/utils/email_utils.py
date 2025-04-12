from typing import Dict, Any, Optional
from utils.gemini_utils import generate_response

async def generate_candidate_email(
    candidate_info: Dict[str, Any],
    job_description: str,
    company_name: str,
    recruiter_name: str,
    salary_range: Optional[str] = None,
    benefits: Optional[str] = None,
    additional_notes: Optional[str] = None
) -> Dict[str, str]:
    """
    Generate an engagement email for a candidate.
    
    Args:
        candidate_info (Dict): Information about the candidate.
        job_description (str): Description of the job.
        company_name (str): Name of the company.
        recruiter_name (str): Name of the recruiter.
        salary_range (Optional[str]): Optional salary range information.
        benefits (Optional[str]): Optional benefits information.
        additional_notes (Optional[str]): Any additional notes.
    
    Returns:
        Dict: Dict containing subject and body of the email.
    """
    candidate_name = candidate_info.get("candidate_name", "Candidate")
    
    system_message = f"""
    You are an expert HR recruiter crafting personalized emails to potential candidates.
    Write a professional, engaging email to a candidate for a job opportunity.
    The email should be warm, professional, and compelling.
    
    Here are some guidelines:
    - Address the candidate by name
    - Briefly mention their relevant skills/experience that match the job
    - Describe the job opportunity concisely
    - Include salary range and benefits if provided
    - Include a clear call to action
    - Sign off professionally
    
    Current recruiter: {recruiter_name}
    Company: {company_name}
    """
    
    # Create a prompt with all the necessary information
    prompt = f"""
    Create an engaging recruitment email with:
    
    Candidate Information:
    {candidate_info}
    
    Job Description:
    {job_description}
    
    Salary Range: {salary_range if salary_range else "Competitive"}
    
    Benefits: {benefits if benefits else "Comprehensive benefits package"}
    
    Additional Notes: {additional_notes if additional_notes else ""}
    """
    
    # Generate a subject line
    subject_prompt = f"Generate a compelling email subject line for recruiting {candidate_name} for a {job_description.split()[0:10]}... position at {company_name}. Subject line only, no explanation."
    subject = generate_response(subject_prompt, temperature=0.7)
    
    # Generate the email body
    email_body = generate_response(prompt, system_message, temperature=0.7)
    
    return {
        "subject": subject,
        "body": email_body
    }

async def generate_job_match_email(
    candidate_name: str,
    candidate_email: str,
    job_title: str,
    company_name: str,
    job_description: str,
    recruiter_name: str,
    salary_range: Optional[str] = None,
    benefits: Optional[str] = None
) -> Dict[str, str]:
    """
    Generate an email for a job match.
    
    Args:
        candidate_name (str): Name of the candidate.
        candidate_email (str): Email of the candidate.
        job_title (str): Title of the job.
        company_name (str): Name of the company.
        job_description (str): Description of the job.
        recruiter_name (str): Name of the recruiter.
        salary_range (Optional[str]): Optional salary range information.
        benefits (Optional[str]): Optional benefits information.
    
    Returns:
        Dict: Dict containing subject and body of the email.
    """
    system_message = f"""
    You are an expert HR recruiter crafting personalized emails to potential candidates you've found through your database.
    Write a professional, engaging email to a candidate for a job opportunity that matches their profile.
    The email should be warm, professional, and highlight why they are a good match for this role.
    
    Here are some guidelines:
    - Address the candidate by name
    - Explain how you found them and why you think they're a good match
    - Describe the job opportunity concisely
    - Include salary range and benefits if provided
    - Include a clear call to action
    - Sign off professionally
    
    Current recruiter: {recruiter_name}
    Company: {company_name}
    """
    
    # Create a prompt with all the necessary information
    prompt = f"""
    Create an engaging recruitment email for a candidate match with:
    
    Candidate Name: {candidate_name}
    Candidate Email: {candidate_email}
    
    Job Title: {job_title}
    Job Description:
    {job_description}
    
    Salary Range: {salary_range if salary_range else "Competitive"}
    
    Benefits: {benefits if benefits else "Comprehensive benefits package"}
    """
    
    # Generate a subject line
    subject_prompt = f"Generate a compelling email subject line for recruiting {candidate_name} for a {job_title} position at {company_name}. Subject line only, no explanation."
    subject = generate_response(subject_prompt, temperature=0.7)
    
    # Generate the email body
    email_body = generate_response(prompt, system_message, temperature=0.7)
    
    return {
        "subject": subject,
        "body": email_body
    } 