#!/usr/bin/env pwsh

Write-Host "========================================"
Write-Host "KMPP MEDIC DRONE AERODROP - Server Setup"
Write-Host "========================================"
Write-Host ""

# Check if Node.js is installed
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Node.js detected" -ForegroundColor Green
node --version

# Check if npm is installed
$npmCheck = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCheck) {
    Write-Host "[ERROR] npm is not installed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] npm detected" -ForegroundColor Green
npm --version

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "========================================"
Write-Host "Starting KMPP MEDIC DRONE AERODROP" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""

# Get IP address
$ipAddress = (
    Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object { $_.IPAddress -notmatch '^127\.' } | 
    Select-Object -First 1 -ExpandProperty IPAddress
)

Write-Host "Server starting..."
Write-Host ""
Write-Host "Local Access:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000"
Write-Host ""
Write-Host "Network Access (from other devices):" -ForegroundColor Cyan
Write-Host "  http://${ipAddress}:3000"
Write-Host ""
Write-Host "Open in Chrome:" -ForegroundColor Cyan
Write-Host "  1. Visit https://www.google.com/"
Write-Host "  2. Type in address bar: ${ipAddress}:3000"
Write-Host ""
Write-Host "========================================"
Write-Host ""

npm start
