from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import API routers
from api.ai_assistant import router as ai_assistant_router
from api.resume_screening import router as resume_screening_router
from api.candidate_search import router as candidate_search_router

# Create FastAPI app
app = FastAPI(
    title="Raya Candidate Navigator API",
    description="Backend API for Raya Candidate Navigator",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ai_assistant_router, prefix="/api/assistant", tags=["AI Assistant"])
app.include_router(resume_screening_router, prefix="/api/resume", tags=["Resume Screening"])
app.include_router(candidate_search_router, prefix="/api/search", tags=["Candidate Search"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Raya Candidate Navigator API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True) 