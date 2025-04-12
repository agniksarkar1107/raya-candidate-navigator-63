import { API_ENDPOINTS } from './config';

export interface JobSearchRequest {
  job_title: string;
  job_description: string;
  company_name: string;
  skills_required: string[];
  experience_level: string;
  location?: string;
  salary_range?: string;
  benefits?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  location: string;
  resume_summary: string;
}

export interface JobMatchesResponse {
  job_title: string;
  company_name: string;
  candidates: Candidate[];
  analysis: string;
  timestamp: string;
}

export interface PerfectFitsRequest {
  job_title: string;
  company_name: string;
  candidates: Candidate[];
  analysis: string;
}

export interface PerfectFitsResponse {
  job_title: string;
  company_name: string;
  perfect_fits: Candidate[];
  analysis: string;
}

export interface CandidateEngagementRequest {
  candidate_id: string;
  job_title: string;
  job_description: string;
  company_name: string;
  recruiter_name: string;
  salary_range?: string;
  benefits?: string;
}

export interface CandidateEngagementResponse {
  candidate: Candidate;
  email: {
    subject: string;
    body: string;
  };
}

/**
 * Find job matches for a job description
 */
export const findJobMatches = async (
  request: JobSearchRequest
): Promise<JobMatchesResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.search.jobMatches, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to find job matches');
    }

    return await response.json();
  } catch (error) {
    console.error('Error finding job matches:', error);
    throw error;
  }
};

/**
 * Find perfect fits from job matches analysis
 */
export const findPerfectFits = async (
  matchesResult: JobMatchesResponse
): Promise<PerfectFitsResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.search.perfectFits, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchesResult),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to find perfect fits');
    }

    return await response.json();
  } catch (error) {
    console.error('Error finding perfect fits:', error);
    throw error;
  }
};

/**
 * Generate an engagement email for a candidate match
 */
export const engageCandidateMatch = async (
  request: CandidateEngagementRequest
): Promise<CandidateEngagementResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.search.engageCandidate, {
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