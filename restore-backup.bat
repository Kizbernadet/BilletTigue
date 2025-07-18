@echo off
echo ========================================
echo    RESTAURATION BASE DE DONNEES BILLETTIGUE
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

if "%1"=="" (
    echo ❌ Erreur: Veuillez specifier le nom du fichier de sauvegarde
    echo.
    echo Utilisation: restore-backup.bat [nom_fichier]
    echo Exemple: restore-backup.bat latest
    echo.
    pause
    exit /b 1
)

echo 🚀 Lancement de la restauration...
echo 📅 Date: %date% %time%
echo 📁 Fichier: %1
echo.

REM Exécuter le script avec dotenv depuis le backend
cd backend
node -r dotenv/config ..\scripts\restore-database.js %1

if errorlevel 1 (
    echo.
    echo ❌ ERREUR: La restauration a échoué
    pause
    exit /b 1
)

echo.
echo ✅ Restauration terminée avec succès !
echo.
pause 