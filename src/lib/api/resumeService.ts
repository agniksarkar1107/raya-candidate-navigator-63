import { API_ENDPOINTS } from './config';

export interface JobDescription {
  title: string;
  description: string;
  company: string;
  salary_range?: string;
  benefits?: string;
}

export interface CandidateInfo {
  candidate_name: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  [key: string]: any;
}

export interface ResumeUploadResponse {
  resume_id: string;
  candidate_name: string;
  candidate_info: CandidateInfo;
}

export interface ScreeningRequest {
  job_description: JobDescription;
  resume_id: string;
}

export interface ScreeningResponse {
  resume_id: string;
  candidate_name: string;
  match_score: number;
  recommendation: string;
  analysis: string;
  job_title: string;
  suitable: boolean;
}

export interface EmailRequest {
  candidate_id: string;
  job_description: JobDescription;
  recruiter_name: string;
  additional_notes?: string;
}

export interface EmailResponse {
  subject: string;
  body: string;
}

/**
 * Upload a resume for processing
 */
export const uploadResume = async (
  resumeFile: File,
  candidateName?: string
): Promise<ResumeUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('resume_file', resumeFile);
    
    if (candidateName) {
      formData.append('candidate_name', candidateName);
    }
    
    const response = await fetch(API_ENDPOINTS.resume.upload, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to upload resume');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

/**
 * Screen a resume against a job description
 */
export const screenResume = async (
  request: ScreeningRequest
): Promise<ScreeningResponse> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.resume.screen}?resume_id=${request.resume_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.job_description),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to screen resume');
    }

    return await response.json();
  } catch (error) {
    console.error('Error screening resume:', error);
    throw error;
  }
};

/**
 * Generate an engagement email for a candidate
 */
export const engageCandidate = async (
  request: EmailRequest
): Promise<EmailResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.resume.engage, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate engagement email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating engagement email:', error);
    throw error;
  }
}; 