@echo off
echo ========================================
echo   Demarrage du serveur BilletTigue
echo ========================================
echo.

echo 1. Installation des dependances...
cd backend
npm install

echo.
echo 2. Demarrage du serveur backend...
echo    URL: http://localhost:5000
echo    API: http://localhost:5000/api
echo.

npm start

pause 