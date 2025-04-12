#!/bin/bash
# Script to start both backend and frontend servers

# Print header
echo "========================================"
echo "  Starting Raya Candidate Navigator"
echo "========================================"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not found"
    exit 1
fi

# Check for Node.js
if ! command -v npm &> /dev/null; then
    echo "Error: Node.js is required but not found"
    exit 1
fi

# Backend setup
echo "Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Start backend server in background
echo "Starting backend server on http://localhost:8000..."
python main.py &
BACKEND_PID=$!

# Navigate back to root directory
cd ..

# Frontend setup
echo "Setting up frontend..."

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend server
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Handle script termination
trap 'echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT TERM

# Keep script running
echo ""
echo "========================================"
echo "  Raya Candidate Navigator is running"
echo "  Backend: http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo "  Press Ctrl+C to stop"
echo "========================================"

# Wait for processes to finish
wait 