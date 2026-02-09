@echo off
REM Install Essential VS Code Extensions
REM Run this after installing VS Code on new machine

echo.
echo ========================================
echo Installing Essential VS Code Extensions
echo ========================================
echo.

REM AI/Development
echo Installing AI & Development Tools...
code --install-extension ms-windows-ai-studio.windows-ai-studio
code --install-extension github.copilot-chat
code --install-extension ms-python.python
code --install-extension ms-dotnettools.csharp

REM Frontend Development
echo Installing Frontend Tools...
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ecmel.vscode-html-css
code --install-extension zignd.html-css-class-completion

REM Backend/Node Development
echo Installing Backend Tools...
code --install-extension 1yib.nodejs-bundle
code --install-extension abdoseadaa.node-js-snippet
code --install-extension ms-vscode.powershell

REM Database Tools
echo Installing Database Tools...
code --install-extension mjstudio.db-viewer

REM Code Quality
echo Installing Code Quality Tools...
code --install-extension rvest.vs-code-prettier-eslint
code --install-extension standard.vscode-standard

REM Optional Tools
echo Installing Optional Tools...
code --install-extension ritwickdey.liveserver
code --install-extension bito.bito
code --install-extension codeium.codeium

echo.
echo ========================================
echo Installation Complete!
echo Press any key to restart VS Code...
echo ========================================
pause

REM Restart VS Code
code
