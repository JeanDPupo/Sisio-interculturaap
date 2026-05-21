@echo off
REM Sisio Interculturaap Backend Startup Script for Windows

echo.
echo ========================================
echo   Sisio Interculturaap Backend
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)

echo [OK] Python found:
python --version

REM Create virtual environment if it doesn't exist
if not exist "venv\" (
    echo.
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo.
echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Check .env file
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo Please create .env with your Supabase credentials
    echo You can use .env.example as a template
    echo.
)

REM Start server
echo.
echo ========================================
echo   Server starting on http://localhost:8000
echo   API Docs: http://localhost:8000/api/docs
echo ========================================
echo.

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause
