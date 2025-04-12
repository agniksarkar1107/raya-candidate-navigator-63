import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
print(f"Using API key: {API_KEY[:5]}...")

# Configure Gemini
genai.configure(api_key=API_KEY)

# Test 1: Simple generation
print("\nTest 1: Simple generation")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content('Hello world')
    print(f"Response: {response.text}")
    print("✅ Test 1 passed")
except Exception as e:
    print(f"❌ Test 1 failed: {e}")

# Test 2: Chat without system message
print("\nTest 2: Chat without system message")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    chat = model.start_chat()
    response = chat.send_message('Hello world')
    print(f"Response: {response.text}")
    print("✅ Test 2 passed")
except Exception as e:
    print(f"❌ Test 2 failed: {e}")

# Test 3: History-based system message (our implementation)
print("\nTest 3: History-based system message")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    system_message = "You are a helpful assistant."
    
    print("Creating chat with history...")
    chat = model.start_chat(history=[
        {"role": "user", "parts": [system_message]},
        {"role": "model", "parts": ["I understand and I'll act accordingly."]}
    ])
    
    print("Sending message...")
    response = chat.send_message('Hello world')
    print(f"Response: {response.text}")
    print("✅ Test 3 passed")
except Exception as e:
    print(f"❌ Test 3 failed: {e}")

# Test 4: Using official system parameter
print("\nTest 4: Using official system parameter")
try:
    model = genai.GenerativeModel(
        'gemini-1.5-flash',
        system_instruction="You are a helpful assistant."
    )
    
    chat = model.start_chat()
    response = chat.send_message('Hello world')
    print(f"Response: {response.text}")
    print("✅ Test 4 passed")
except Exception as e:
    print(f"❌ Test 4 failed: {e}")

print("\nDone with tests") 