@echo off
title FrameFlow - OS Optimization Utility Launcher
echo ===================================================
echo   FrameFlow - OS Optimization Utility Launcher     
echo   Checking environment, installing and running...
echo ===================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on your system!
    echo Please download and install Node.js (LTS version) from:
    echo https://nodejs.org/
    echo.
    echo Press any key to open the Node.js website and exit...
    pause >nul
    start https://nodejs.org/
    exit /b
)

:: If Node is installed, install dependencies if node_modules folder is missing
if not exist "node_modules\" (
    echo [INFO] First-time setup: Installing required dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies. Please ensure you are connected to the internet.
        pause
        exit /b
    )
)

:: Create .env.local if it doesn't exist
if not exist ".env.local" (
    if not exist ".env" (
        echo [INFO] Creating default .env.local configuration file...
        echo GEMINI_API_KEY="" > .env.local
        echo APP_URL="http://localhost:3000" >> .env.local
    )
)

echo.
echo [SUCCESS] Starting FrameFlow dev server...
echo The app will automatically open in your browser shortly!
echo.

:: Wait a brief moment and open the browser
timeout /t 2 >nul 2>&1
start http://localhost:3000

:: Run the development server
call npm run dev
pause
