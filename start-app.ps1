Write-Host "Starting full-stack setup..."

# Set base project root to the location of this script
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ProjectRoot

# ---- SETUP BACKEND ----
Write-Host "`nSetting up Node.js Express backend..."
$BackendPath = Join-Path $ProjectRoot "node_backend"
Set-Location $BackendPath

if (Test-Path "package.json") {
    npm install
    Write-Host "Backend dependencies installed."
} else {
    Write-Host "package.json not found in node_backend. Skipping backend setup."
}

# ---- SETUP FRONTEND ----
Write-Host "`nSetting up Vite React frontend..."
$FrontendPath = Join-Path $ProjectRoot "client"
Set-Location $FrontendPath

# OPTIONAL: Patch broken ShadCN dependencies
if (Test-Path "package.json") {
    (Get-Content package.json) `
        -replace '"@shadcn/ui-tailwind":\s*"\^0.0.1",?', "" `
        -replace '"@shadcn/ui":\s*"\^0.0.1"', '"@shadcn/ui": "latest"' `
        | Set-Content package.json

    npm install
    Write-Host "Frontend dependencies installed."
} else {
    Write-Host "package.json not found in client. Skipping frontend setup."
}

Set-Location $ProjectRoot

Write-Host "`n All dependencies installed!"

Write-Host "`n To start backend:"
Write-Host "   cd node_backend; npm run dev"

Write-Host "`n To start frontend:"
Write-Host "   cd client; npm run dev"

Write-Host "`nYou're ready to develop Kingdom Kids Secret Place!"
