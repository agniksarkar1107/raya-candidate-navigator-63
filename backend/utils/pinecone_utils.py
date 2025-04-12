import os
from typing import Dict, List, Any, Optional
from pinecone import Pinecone
from langchain.vectorstores import Pinecone as PineconeVectorStore
from langchain_community.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv
import random
import uuid

# Load environment variables
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "raya_candidates")

# Mock resume data storage
MOCK_RESUME_DB = []

def get_embedding_model():
    """
    Get the embedding model for text to vector conversion.
    
    Returns:
        The embedding model instance.
    """
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

def initialize_pinecone():
    """
    Initialize the Pinecone client and ensure the index exists.
    
    Returns:
        tuple: (Pinecone client, index name)
    """
    if not PINECONE_API_KEY or not PINECONE_ENVIRONMENT:
        print("Warning: Pinecone API key or environment not found in environment variables.")
        
        # Return mock client for testing
        class MockIndex:
            def upsert(self, vectors, namespace=None):
                for vector in vectors:
                    MOCK_RESUME_DB.append({
                        "id": vector["id"],
                        "values": vector["values"],
                        "metadata": vector.get("metadata", {})
                    })
                return {"upserted_count": len(vectors)}
            
            def query(self, vector, top_k=10, namespace=None):
                # Return mock results
                return {
                    "matches": [
                        {
                            "id": item["id"],
                            "score": 0.8 + random.random() * 0.2,
                            "metadata": item.get("metadata", {})
                        }
                        for item in MOCK_RESUME_DB[:top_k]
                    ]
                }
        
        class MockPinecone:
            def Index(self, name):
                return MockIndex()
            
            def list_indexes(self):
                return [{"name": PINECONE_INDEX_NAME}]
            
            def create_index(self, name, dimension, metric, **kwargs):
                print(f"Mock creating index {name} with dimension {dimension}")
                return None
        
        return MockPinecone(), PINECONE_INDEX_NAME
    
    try:
        # Initialize with actual API key
        pc = Pinecone(api_key=PINECONE_API_KEY)
        
        # Check if index exists, if not create it
        existing_indexes = [index["name"] for index in pc.list_indexes()]
        
        if PINECONE_INDEX_NAME not in existing_indexes:
            pc.create_index(
                name=PINECONE_INDEX_NAME,
                dimension=384,  # dimension for all-MiniLM-L6-v2
                metric="cosine"
            )
        
        return pc, PINECONE_INDEX_NAME
    except Exception as e:
        print(f"Error initializing Pinecone: {e}")
        # Fall back to mock implementation
        return initialize_pinecone()

def get_vector_store():
    """
    Get Pinecone vector store with embedding model.
    
    Returns:
        VectorStore: The vector store instance.
    """
    pc, index_name = initialize_pinecone()
    embeddings = get_embedding_model()
    
    return PineconeVectorStore(
        index_name=index_name,
        embedding=embeddings,
        pinecone_api_key=PINECONE_API_KEY,
        environment=PINECONE_ENVIRONMENT
    )

async def store_resume_data(
    resume_id: str,
    candidate_name: str,
    resume_text: str,
    metadata: Dict[str, Any]
):
    """
    Store resume data in Pinecone vector database.
    
    Args:
        resume_id (str): Unique identifier for the resume.
        candidate_name (str): Name of the candidate.
        resume_text (str): Full text of the resume.
        metadata (Dict): Additional metadata about the candidate.
    
    Returns:
        bool: True if storage was successful, False otherwise.
    """
    try:
        vector_store = get_vector_store()
        
        # Add metadata to be stored with the embedding
        complete_metadata = {
            "resume_id": resume_id,
            "candidate_name": candidate_name,
            **metadata
        }
        
        # Store the document
        vector_store.add_texts(
            texts=[resume_text],
            metadatas=[complete_metadata]
        )
        
        return True
    except Exception as e:
        print(f"Error storing resume data: {e}")
        return False

async def search_similar_candidates(
    job_description: str,
    top_k: int = 5
) -> List[Dict[str, Any]]:
    """
    Search for candidates similar to the job description.
    
    Args:
        job_description (str): The job description to match against.
        top_k (int): Number of top matches to return.
    
    Returns:
        List[Dict]: List of matching candidates with metadata.
    """
    try:
        vector_store = get_vector_store()
        
        # Search for similar documents
        results = vector_store.similarity_search_with_score(
            query=job_description,
            k=top_k
        )
        
        # Format results
        formatted_results = []
        for doc, score in results:
            formatted_results.append({
                "candidate_name": doc.metadata.get("candidate_name", "Unknown"),
                "resume_id": doc.metadata.get("resume_id", ""),
                "similarity_score": score,
                "content": doc.page_content,
                "metadata": doc.metadata
            })
        
        return formatted_results
    except Exception as e:
        print(f"Error searching candidates: {e}")
        return [] 