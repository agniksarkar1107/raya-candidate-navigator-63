import os
import json
from typing import Dict, Any, List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the Google Generative AI API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
print(f"Loaded Gemini API key: {GOOGLE_API_KEY[:5]}..." if GOOGLE_API_KEY else "No Gemini API key found")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

async def generate_vision_response(prompt: str, image_parts: List[Dict[str, str]]) -> str:
    """
    Generate a response using Google's Gemini Vision API.
    
    Args:
        prompt (str): The prompt to send to the model.
        image_parts (List): List of image parts in Gemini Vision format.
        
    Returns:
        str: The generated response text.
    """
    try:
        if not GOOGLE_API_KEY:
            print("No Gemini API key found - returning mock response")
            return "API key not found. Please add GOOGLE_API_KEY to your .env file."
        
        print(f"Generating Gemini Vision response for prompt: {prompt[:50]}...")
        
        # Set up the model for multimodal (vision) content
        model = genai.GenerativeModel('gemini-pro-vision')
        
        # Create the content parts (image + text)
        content_parts = [prompt] + image_parts
        
        # Generate the response
        response = model.generate_content(content_parts)
        
        print(f"Got Gemini Vision response: {response.text[:50]}...")
        
        # Return the text response
        return response.text
    
    except Exception as e:
        import traceback
        print(f"Error generating vision response from Gemini API: {e}")
        traceback.print_exc()
        return f"Error generating vision response: {str(e)}"

def generate_response(
    prompt: str,
    system_message: str = "",
    temperature: float = 0.7,
    max_tokens: int = 1024
) -> str:
    """
    Generate a response using Google's Gemini model.
    
    Args:
        prompt (str): The user prompt to generate a response for.
        system_message (str): System message to set context.
        temperature (float): Controls randomness of the response (0-1).
        max_tokens (int): Maximum number of tokens in the response.
    
    Returns:
        str: The generated response with markdown formatting removed.
    """
    try:
        if not GOOGLE_API_KEY:
            print("No Gemini API key found - returning mock response")
            return "API key not found. Please add GOOGLE_API_KEY to your .env file."
        
        print(f"Generating Gemini response for prompt: {prompt[:50]}... (max_tokens: {max_tokens})")
        
        # Set up the model
        generation_config = {
            "temperature": temperature,
            "top_p": 0.95,
            "top_k": 0,
            "max_output_tokens": max_tokens,
        }
        
        # Initialize model
        try:
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config=generation_config
            )
            print(f"Successfully initialized Gemini model with max_tokens: {max_tokens}")
        except Exception as model_error:
            print(f"Error initializing Gemini model: {model_error}")
            return f"Error initializing Gemini model: {str(model_error)}"
        
        # Create the conversation with system message
        try:
            if system_message:
                print(f"Using system message: {system_message[:50]}...")
                # We'll create a chat with history to set up the system message
                chat = model.start_chat(history=[
                    {"role": "user", "parts": [system_message]},
                    {"role": "model", "parts": ["I understand and I'll act accordingly."]}
                ])
            else:
                chat = model.start_chat()
            print("Successfully created chat session")
        except Exception as chat_error:
            print(f"Error creating chat session: {chat_error}")
            return f"Error creating chat session: {str(chat_error)}"
        
        # Send the prompt and get the response
        try:
            print("Sending message to Gemini API...")
            response = chat.send_message(prompt)
            print(f"Got Gemini response: {response.text[:50]}...")
            
            # Clean up the response by removing markdown formatting
            text = response.text
            text = text.replace("**", "").replace("*", "").replace("__", "").replace("_", "").replace("#", "")
            return text
            
        except Exception as send_error:
            print(f"Error sending message to Gemini: {send_error}")
            return f"Error sending message to Gemini: {str(send_error)}"
    
    except Exception as e:
        import traceback
        print(f"Error generating response from Gemini API: {e}")
        traceback.print_exc()
        return f"Error generating response: {str(e)}"

def structured_generate(
    prompt: str,
    system_message: str = "",
    output_schema: Dict[str, Any] = None,
    temperature: float = 0.2,
    max_tokens: int = 1024
) -> Dict[str, Any]:
    """
    Generate a structured response using Google's Gemini model.
    
    Args:
        prompt (str): The user prompt to generate a response for.
        system_message (str): System message to set context.
        output_schema (Dict): The JSON schema for the expected output.
        temperature (float): Controls randomness of the response (0-1).
        max_tokens (int): Maximum number of tokens in the response.
    
    Returns:
        Dict: The structured response.
    """
    try:
        if not GOOGLE_API_KEY:
            return {"error": "API key not found. Please add GOOGLE_API_KEY to your .env file."}
        
        if not output_schema:
            return {"error": "Output schema is required for structured generation."}
        
        # Convert schema to string
        schema_str = json.dumps(output_schema, indent=2)
        
        # Create the prompt with schema information
        full_prompt = f"""{prompt}

Please provide your response as a valid JSON object with the following schema:
```json
{schema_str}
```

Your response should be a valid JSON object and nothing else."""
        
        # Generate response
        response_text = generate_response(
            prompt=full_prompt,
            system_message=system_message,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        # Extract JSON from the response
        # Find the first occurrence of '{' and the last occurrence of '}'
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            json_str = response_text[start_idx:end_idx+1]
            try:
                return json.loads(json_str)
            except json.JSONDecodeError:
                return {"error": "Failed to parse JSON response", "raw_response": response_text}
        else:
            return {"error": "JSON response not found", "raw_response": response_text}
    
    except Exception as e:
        print(f"Error generating structured response: {e}")
        return {"error": f"Error generating structured response: {str(e)}"} 