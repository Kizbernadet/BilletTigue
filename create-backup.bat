@echo off
echo ========================================
echo    SAUVEGARDE BASE DE DONNEES BILLETTIGUE
echo ========================================
echo.

cd /d "%~dp0"

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERREUR: Node.js n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

REM Vérifier si le fichier .env existe
if not exist "backend\.env" (
    echo ❌ ERREUR: Fichier backend\.env non trouvé
    echo Veuillez créer le fichier backend\.env avec vos paramètres de base de données
    pause
    exit /b 1
)

echo ✅ Fichier .env trouvé
echo.

echo 🚀 Lancement de la sauvegarde...
echo 📅 Date: %date% %time%
echo.

REM Exécuter le script avec dotenv depuis le backend
cd backend
node -r dotenv/config ..\scripts\backup-database.js

if errorlevel 1 (
    echo.
    echo ❌ ERREUR: La sauvegarde a échoué
    pause
    exit /b 1
)

echo.
echo ✅ Sauvegarde terminée avec succès !
echo 📁 Vérifiez le dossier backups\ pour voir vos sauvegardes
echo.
pause 