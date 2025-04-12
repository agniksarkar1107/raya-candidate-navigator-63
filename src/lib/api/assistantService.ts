import { API_ENDPOINTS } from './config';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  use_web_search?: boolean;
  search_query?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  web_search_used: boolean;
}

export interface WebSearchRequest {
  query: string;
  num_results?: number;
}

export interface WebSearchResponse {
  results: {
    title: string;
    link: string;
    snippet: string;
  }[];
}

export interface EmailDraftRequest {
  recipient: string;
  job_description: string;
  company_name: string;
  context?: string;
}

export interface EmailDraftResponse {
  subject: string;
  body: string;
}

/**
 * Send a chat message to the AI Assistant
 */
export const sendChatMessage = async (
  request: ChatRequest
): Promise<ChatResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.assistant.chat, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to send chat message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

/**
 * Perform a web search using the AI Assistant
 */
export const performWebSearch = async (
  request: WebSearchRequest
): Promise<WebSearchResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.assistant.search, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to perform web search');
    }

    return await response.json();
  } catch (error) {
    console.error('Error performing web search:', error);
    throw error;
  }
};

/**
 * Draft an email using the AI Assistant
 */
export const draftEmail = async (
  request: EmailDraftRequest
): Promise<EmailDraftResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.assistant.draftEmail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to draft email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error drafting email:', error);
    throw error;
  }
}; 