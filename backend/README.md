# Raya Candidate Navigator Backend

This is the backend for the Raya Candidate Navigator application, providing AI-powered features for HR and recruitment.

## Features

1. **AI Assistant**: Conversational AI for HR tech topics, email drafting, and web search.
2. **Resume Screening**: Upload and analyze resumes against job descriptions, with vector DB storage.
3. **Candidate Search**: Match job descriptions with candidates and generate engagement emails.

## Prerequisites

- Python 3.9+
- API keys for:
  - Google Gemini API
  - Serper API (for web search)
  - Pinecone (for vector database)

## Setup

1. **Clone the repository**:
   ```
   git clone https://github.com/your-username/raya-candidate-navigator.git
   cd raya-candidate-navigator/backend
   ```

2. **Create a virtual environment**:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your API keys:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   SERPER_API_KEY=your_serper_api_key_here
   PINECONE_API_KEY=your_pinecone_api_key_here
   PINECONE_ENVIRONMENT=your_pinecone_environment_here
   PINECONE_INDEX_NAME=raya_candidates
   ```

## Running the Server

Start the FastAPI server:

```
python main.py
```

The API will be available at `http://localhost:8000`.

API documentation is available at `http://localhost:8000/docs`.

## API Endpoints

### AI Assistant

- `POST /api/assistant/chat`: Chat with the AI assistant
- `POST /api/assistant/search`: Perform web searches
- `POST /api/assistant/draft-email`: Draft emails for candidates

### Resume Screening

- `POST /api/resume/upload`: Upload and process resumes
- `POST /api/resume/screen`: Screen resumes against job descriptions
- `POST /api/resume/engage`: Generate engagement emails for candidates

### Candidate Search

- `POST /api/search/job-matches`: Find candidates matching a job description
- `POST /api/search/perfect-fits`: Identify perfect fit candidates
- `POST /api/search/engage-candidate`: Generate emails for job match candidates

## Connecting to the Frontend

The frontend application is configured to communicate with this backend. Ensure the backend is running before using the frontend features.

## Directory Structure

- `api/`: API endpoints and routers
- `agents/`: Agent implementations using LangChain
- `utils/`: Utility functions for API integration
- `config/`: Configuration files
- `uploads/`: Temporary directory for file uploads

## Technologies Used

- FastAPI: Web framework
- LangChain: Framework for working with LLMs
- Pinecone: Vector database for storing resume embeddings
- Google Gemini: AI model for natural language processing
- Serper API: Web search capabilities 