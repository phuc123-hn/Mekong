#!/usr/bin/env pwsh
# Install Essential VS Code Extensions
# Run: .\install-extensions.ps1

Write-Host "======================================" -ForegroundColor Green
Write-Host "Installing Essential VS Code Extensions" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

$extensions = @(
    # AI/Development Tools
    "ms-windows-ai-studio.windows-ai-studio"
    "github.copilot-chat"
    "ms-python.python"
    "ms-dotnettools.csharp"
    
    # Frontend Development
    "bradlc.vscode-tailwindcss"
    "ecmel.vscode-html-css"
    "zignd.html-css-class-completion"
    
    # Backend/Node Development
    "1yib.nodejs-bundle"
    "abdoseadaa.node-js-snippet"
    "ms-vscode.powershell"
    
    # Database Tools
    "mjstudio.db-viewer"
    
    # Code Quality
    "rvest.vs-code-prettier-eslint"
    "standard.vscode-standard"
    
    # Optional
    "ritwickdey.liveserver"
    "bito.bito"
    "codeium.codeium"
)

$count = 0
foreach ($ext in $extensions) {
    $count++
    Write-Host "[$count/$($extensions.Count)] Installing $ext..." -ForegroundColor Cyan
    & code --install-extension $ext --force
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "VS Code will restart automatically..." -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Green

Start-Sleep -Seconds 2
& code
