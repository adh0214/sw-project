@echo off
chcp 65001 > nul
echo ========================================================
echo       STOCKMATE (SwipeStock) 모바일 웹 서버 실행
echo ========================================================
echo.
set PATH=%~dp0.node;%PATH%
cd /d "%~dp0"
echo [1/2] 서비스 포트: http://localhost:3000
echo [2/2] 브라우저 자동 오픈 중...
echo.
start http://localhost:3000
.\.node\node.exe server.js
pause
