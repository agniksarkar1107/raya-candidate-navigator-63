/**
 * API configuration for the Raya Candidate Navigator
 */

// Base URL for the backend API
export const API_BASE_URL = 'http://localhost:8001';

// API Endpoints
export const API_ENDPOINTS = {
  // AI Assistant endpoints
  assistant: {
    chat: `${API_BASE_URL}/api/assistant/chat`,
    search: `${API_BASE_URL}/api/assistant/search`,
    draftEmail: `${API_BASE_URL}/api/assistant/draft-email`,
  },
  
  // Resume Screening endpoints
  resume: {
    upload: `${API_BASE_URL}/api/resume/upload`,
    screen: `${API_BASE_URL}/api/resume/screen`,
    engage: `${API_BASE_URL}/api/resume/engage`,
  },
  
  // Candidate Search endpoints
  search: {
    jobMatches: `${API_BASE_URL}/api/search/job-matches`,
    perfectFits: `${API_BASE_URL}/api/search/perfect-fits`,
    engageCandidate: `${API_BASE_URL}/api/search/engage-candidate`,
    talentDiscovery: `${API_BASE_URL}/api/search/talent-discovery`,
    draftOutreachEmail: `${API_BASE_URL}/api/search/draft-outreach-email`,
    draftLinkedInMessage: `${API_BASE_URL}/api/search/draft-linkedin-message`,
  },
}; 