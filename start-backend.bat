@echo off
echo 🚀 Démarrage du serveur backend Billettigue...
echo.
cd backend
echo 📁 Répertoire: %CD%
echo.
echo 🔧 Installation des dépendances si nécessaire...
npm install
echo.
echo 🚀 Démarrage du serveur sur http://localhost:3000...
npm start
pause 