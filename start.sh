#!/bin/bash

echo "🚀 Starting AI Copilot System..."

# Kill old servers (safe cleanup)
pkill -f uvicorn
pkill -f http.server

echo "🧹 Cleaned old processes"

# Activate virtual environment
source venv/bin/activate

# Start backend (FastAPI)
echo "⚡ Starting backend on port 8000..."
uvicorn web:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Start frontend server
echo "🌐 Starting frontend on port 5500..."
python3 -m http.server 5500 &
FRONTEND_PID=$!

echo "----------------------------------"
echo "✅ Backend: http://127.0.0.1:8000"
echo "✅ Frontend: http://127.0.0.1:5500/index.html"
echo "----------------------------------"

# Keep script alive
wait $BACKEND_PID $FRONTEND_PID
