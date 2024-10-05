@echo off

REM Check if "server" is running
tasklist /FI "IMAGENAME eq node.exe" | find /i "server.js" > nul
if %errorlevel% equ 0 (
  echo Stopping server...
  taskkill /f /im "node.exe" /fi "imagename eq server.js"
) else (
  echo Starting server...
  start "" /B npm run server
)

REM Check if "client" is running
tasklist /FI "IMAGENAME eq node.exe" | find /i "react-scripts" > nul
if %errorlevel% equ 0 (
  echo Stopping client...
  taskkill /f /im "node.exe" /fi "imagename eq react-scripts"
) else (
  echo Starting client...
  cd /d path\to\admin
  npm start
)
