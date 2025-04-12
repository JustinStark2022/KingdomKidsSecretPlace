Write-Host "Starting full-stack setup..."

# Set base project root to the location of this script
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ProjectRoot

# ---- SETUP BACKEND ----
Write-Host "Setting up Flask backend..."
$BackendPath = Join-Path $ProjectRoot "flask_backend"
Set-Location $BackendPath

# Create venv if not exists
if (!(Test-Path -Path "venv")) {
    python -m venv venv
    Write-Host "Virtual environment created."
}

# Activate venv and install dependencies
& .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Write-Host "Backend dependencies installed."

# Go back to root
Set-Location $ProjectRoot

# ---- SETUP FRONTEND ----
Write-Host "Setting up Vite React frontend..."
$FrontendPath = Join-Path $ProjectRoot "client"
Set-Location $FrontendPath

# OPTIONAL: Auto-remove broken @shadcn/ui-tailwind and fix @shadcn/ui version
(Get-Content package.json) `
    -replace '"@shadcn/ui-tailwind":\s*"\^0.0.1",?', "" `
    -replace '"@shadcn/ui":\s*"\^0.0.1"', '"@shadcn/ui": "latest"' `
    | Set-Content package.json

npm install
Write-Host "Frontend dependencies installed."

Set-Location $ProjectRoot

Write-Host "`nAll dependencies installed!"

Write-Host "`nTo start backend:"
Write-Host "   cd flask_backend; .\venv\Scripts\Activate.ps1; python app.py"

Write-Host "`nTo start frontend:"
Write-Host "   cd client; npm run dev"

Write-Host "`nYou're ready to develop!"
