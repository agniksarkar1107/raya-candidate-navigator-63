import os
import json
import random
from typing import List, Dict, Any
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SERPER_API_KEY = os.getenv("SERPER_API_KEY")
SERPER_API_URL = "https://google.serper.dev/search"

async def search_and_extract(query: str, num_results: int = 5) -> List[Dict[str, Any]]:
    """
    Perform a web search using Serper API and extract relevant information.
    
    Args:
        query (str): The search query.
        num_results (int): Number of results to return.
    
    Returns:
        List[Dict]: List of search results with title, snippet, and link.
    """
    try:
        if not SERPER_API_KEY:
            print("Warning: SERPER_API_KEY not found in environment variables. Using mock data.")
            return generate_mock_search_results(query, num_results)
        
        # Prepare the request payload
        payload = {
            "q": query,
            "num": num_results
        }
        
        # Make the API request
        async with httpx.AsyncClient() as client:
            response = await client.post(
                SERPER_API_URL,
                json=payload,
                headers={
                    "X-API-KEY": SERPER_API_KEY,
                    "Content-Type": "application/json"
                }
            )
            
            # Check if the request was successful
            if response.status_code == 200:
                data = response.json()
                
                # Extract and format the results
                results = []
                organic_results = data.get("organic", [])
                
                for result in organic_results[:num_results]:
                    results.append({
                        "title": result.get("title", "No title"),
                        "snippet": result.get("snippet", "No description available"),
                        "link": result.get("link", "#")
                    })
                
                return results
            else:
                print(f"Error from Serper API: {response.status_code} - {response.text}")
                return generate_mock_search_results(query, num_results)
    
    except Exception as e:
        print(f"Error performing web search: {e}")
        return generate_mock_search_results(query, num_results)

def generate_mock_search_results(query: str, num_results: int = 5) -> List[Dict[str, Any]]:
    """
    Generate mock search results for testing without API keys.
    
    Args:
        query (str): The search query.
        num_results (int): Number of results to return.
    
    Returns:
        List[Dict]: List of mock search results.
    """
    mock_results = [
        {
            "title": f"Latest Information on {query} - 2024 Guide",
            "snippet": f"Comprehensive overview of {query} with the most recent updates and best practices from industry experts.",
            "link": "https://example.com/latest-guide"
        },
        {
            "title": f"{query} Trends and Analysis",
            "snippet": f"In-depth analysis of current trends in {query} and how they affect the industry landscape.",
            "link": "https://example.com/trends-analysis"
        },
        {
            "title": f"Top 10 {query} Practices for HR Professionals",
            "snippet": f"Discover the most effective {query} methods that successful HR professionals are implementing in 2024.",
            "link": "https://example.com/top-practices"
        },
        {
            "title": f"How to Optimize Your {query} Strategy",
            "snippet": f"Step-by-step guide to creating and implementing an effective {query} strategy in your organization.",
            "link": "https://example.com/optimization-guide"
        },
        {
            "title": f"{query} Case Studies: Success Stories",
            "snippet": f"Real-world examples of companies that have successfully implemented {query} strategies and the results they achieved.",
            "link": "https://example.com/case-studies"
        },
        {
            "title": f"Common Mistakes to Avoid in {query}",
            "snippet": f"Learn about the pitfalls and challenges that organizations face when implementing {query} and how to avoid them.",
            "link": "https://example.com/common-mistakes"
        },
        {
            "title": f"The Future of {query} in HR Technology",
            "snippet": f"Insights into upcoming trends and innovations in {query} and how they will shape the future of HR technology.",
            "link": "https://example.com/future-trends"
        }
    ]
    
    # Shuffle the list to add some randomness
    random.shuffle(mock_results)
    
    # Return the requested number of results
    return mock_results[:num_results] 