#!/bin/bash

# Sisio Interculturaap Backend Startup Script

echo "🚀 Starting Sisio Interculturaap Backend..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python found: $(python --version)"

# Check if requirements are installed
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/Scripts/activate 2>/dev/null || . venv/Scripts/activate

# Install requirements
echo "📥 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Please create it with your configuration."
    echo "   See .env.example for reference"
fi

# Start the server
echo "🌐 Starting server on http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/api/docs"
echo ""

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
