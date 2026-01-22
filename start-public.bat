@echo off
echo ========================================
echo KMPP MEDIC DRONE AERODROP - Server Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detected
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [OK] npm detected
npm --version

echo.
echo Installing dependencies...
call npm install

echo.
echo ========================================
echo Starting KMPP MEDIC DRONE AERODROP
echo ========================================
echo.

REM Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R "IPv4 Address"') do (
    set IP=%%a
)

echo Server starting...
echo.
echo Local Access:
echo   http://localhost:3000
echo.
echo Network Access (from other devices):
echo   http://%IP%:3000
echo.
echo Open in Chrome:
echo   https://www.google.com/
echo   Type in address bar: %IP%:3000
echo.
echo ========================================
echo.

call npm start

pause
