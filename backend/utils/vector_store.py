import os
import chromadb
from chromadb.utils import embedding_functions
import numpy as np
from typing import Dict, List, Any, Optional
import json
import uuid
import traceback
from fastapi import HTTPException

# Create persistent ChromaDB client
CHROMA_DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_data")
os.makedirs(CHROMA_DATA_PATH, exist_ok=True)

# Initialize ChromaDB
try:
    # Create persistent client
    chroma_client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)
    
    # Use the OpenAI embedding function (default-all-mpnet-base-v2)
    default_ef = embedding_functions.DefaultEmbeddingFunction()
    
    # Create or get the resumes collection
    resume_collection = chroma_client.get_or_create_collection(
        name="resume_embeddings",
        embedding_function=default_ef,
        metadata={"description": "Resume embeddings for candidate matching"}
    )
    
    print(f"ChromaDB initialized. Resume collection has {resume_collection.count()} documents.")
except Exception as e:
    print(f"Error initializing ChromaDB: {e}")
    traceback.print_exc()
    resume_collection = None
    
async def store_resume_embeddings(
    resume_id: str,
    resume_text: str,
    candidate_info: Dict[str, Any],
    metadata: Dict[str, Any]
) -> bool:
    """
    Store resume text and extracted information as embeddings in ChromaDB.
    
    Args:
        resume_id (str): Unique ID for the resume
        resume_text (str): Full text content of the resume
        candidate_info (Dict): Structured candidate information
        metadata (Dict): Additional metadata about the resume
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        if resume_collection is None:
            print("ChromaDB not initialized")
            return False
            
        # Create metadata
        enhanced_metadata = {
            "candidate_name": candidate_info.get("candidate_name", "Unknown"),
            "candidate_email": candidate_info.get("email", ""),
            "candidate_phone": candidate_info.get("phone", ""),
            "skills": json.dumps(candidate_info.get("skills", [])),
            "experience": json.dumps(candidate_info.get("experience", [])),
            "education": json.dumps(candidate_info.get("education", [])),
            "upload_date": metadata.get("upload_date", ""),
            "file_name": metadata.get("file_name", ""),
            "file_type": metadata.get("file_type", "")
        }
        
        # Store the full resume text and candidate info
        resume_collection.upsert(
            ids=[resume_id],
            documents=[resume_text],
            metadatas=[enhanced_metadata]
        )
        
        print(f"Resume {resume_id} stored in vector database")
        return True
        
    except Exception as e:
        print(f"Error storing resume embeddings: {e}")
        traceback.print_exc()
        return False

async def search_similar_candidates(
    job_description: str,
    skills_required: List[str] = None,
    experience_level: str = None,
    location: str = None,
    top_k: int = 5
) -> List[Dict[str, Any]]:
    """
    Search for candidates that match a job description using vector similarity.
    
    Args:
        job_description (str): Job description to match against
        skills_required (List[str], optional): Required skills for the job
        experience_level (str, optional): Required experience level
        location (str, optional): Job location
        top_k (int, optional): Number of results to return. Defaults to 5.
        
    Returns:
        List[Dict]: List of matching candidates with match scores
    """
    try:
        if resume_collection is None or resume_collection.count() == 0:
            print("No resumes in the database")
            return []
            
        # Prepare filter based on skills if provided
        where_clause = {}
        if skills_required:
            # This is a simplified approach - in a real implementation, 
            # we would need more sophisticated filtering on JSON fields
            skill_filters = []
            for skill in skills_required:
                skill_filters.append({"$contains": skill})
                
        # Conduct the search
        results = resume_collection.query(
            query_texts=[job_description],
            n_results=top_k,
            include=["metadatas", "documents", "distances"]
        )
        
        # Format the results
        candidates = []
        if results and results["ids"] and len(results["ids"][0]) > 0:
            for i in range(len(results["ids"][0])):
                resume_id = results["ids"][0][i]
                metadata = results["metadatas"][0][i]
                distance = results["distances"][0][i] if "distances" in results else 0
                
                # Convert distance to score (1 - normalized distance)
                match_score = int((1 - distance) * 100) if distance is not None else 0
                
                # Parse JSON strings back to lists/objects
                skills = json.loads(metadata.get("skills", "[]"))
                experience = json.loads(metadata.get("experience", "[]"))
                education = json.loads(metadata.get("education", "[]"))
                
                candidates.append({
                    "id": resume_id,
                    "candidate_name": metadata.get("candidate_name", "Unknown"),
                    "candidate_email": metadata.get("candidate_email", ""),
                    "candidate_phone": metadata.get("candidate_phone", ""),
                    "skills": skills,
                    "experience": experience,
                    "education": education,
                    "match_score": match_score,
                    "file_name": metadata.get("file_name", "")
                })
                
        return candidates
        
    except Exception as e:
        print(f"Error searching candidates: {e}")
        traceback.print_exc()
        return []
        
async def get_candidate_by_id(resume_id: str) -> Dict[str, Any]:
    """
    Get a candidate's information by their resume ID.
    
    Args:
        resume_id (str): Resume ID to retrieve
        
    Returns:
        Dict: Candidate information
    """
    try:
        if resume_collection is None:
            raise HTTPException(status_code=500, detail="Vector database not initialized")
            
        results = resume_collection.get(
            ids=[resume_id],
            include=["metadatas", "documents"]
        )
        
        if not results["ids"]:
            raise HTTPException(status_code=404, detail="Candidate not found")
            
        metadata = results["metadatas"][0]
        resume_text = results["documents"][0]
        
        # Parse JSON strings back to lists/objects
        skills = json.loads(metadata.get("skills", "[]"))
        experience = json.loads(metadata.get("experience", "[]"))
        education = json.loads(metadata.get("education", "[]"))
        
        return {
            "id": resume_id,
            "candidate_name": metadata.get("candidate_name", "Unknown"),
            "candidate_email": metadata.get("candidate_email", ""),
            "candidate_phone": metadata.get("candidate_phone", ""),
            "skills": skills,
            "experience": experience,
            "education": education,
            "resume_text": resume_text,
            "file_name": metadata.get("file_name", "")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving candidate: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error retrieving candidate: {str(e)}") 