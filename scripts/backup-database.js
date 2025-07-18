/**
 * Script de sauvegarde de la base de données Billettigue
 * ===================================================
 * 
 * Ce script crée une sauvegarde complète de la base de données
 * avec gestion des erreurs et validation de l'intégrité.
 * 
 * Utilisation :
 * cd backend && node ../scripts/backup-database.js
 * 
 * Ou depuis la racine :
 * node -r dotenv/config scripts/backup-database.js dotenv_config_path=backend/.env
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement depuis le fichier .env du backend
const dotenvPath = path.join(__dirname, '..', 'backend', '.env');
try {
    if (fs.existsSync(dotenvPath)) {
        require('dotenv').config({ path: dotenvPath });
        console.log('✅ Variables d\'environnement chargées depuis backend/.env');
    } else {
        console.log('⚠️  Fichier .env non trouvé dans backend/, utilisation des valeurs par défaut');
    }
} catch (error) {
    console.log('⚠️  Module dotenv non disponible, utilisation des valeurs par défaut');
    console.log('💡 Pour utiliser dotenv, installez-le: npm install dotenv');
}

// Configuration de la base de données
const DB_CONFIG = {
    name: process.env.DB_NAME || 'billettigue',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432
};

// Configuration de la sauvegarde
const BACKUP_CONFIG = {
    outputDir: path.join(__dirname, '..', 'backups'),
    filename: `billettigue_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`,
    compress: true
};

/**
 * Crée le répertoire de sauvegarde s'il n'existe pas
 */
function createBackupDirectory() {
    if (!fs.existsSync(BACKUP_CONFIG.outputDir)) {
        fs.mkdirSync(BACKUP_CONFIG.outputDir, { recursive: true });
        console.log('✅ Répertoire de sauvegarde créé:', BACKUP_CONFIG.outputDir);
    }
}

/**
 * Génère le nom du fichier de sauvegarde
 */
function generateBackupFilename() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFilename = `billettigue_backup_${timestamp}`;
    
    if (BACKUP_CONFIG.compress) {
        return `${baseFilename}.sql.gz`;
    }
    return `${baseFilename}.sql`;
}

/**
 * Construit la commande pg_dump
 */
function buildPgDumpCommand() {
    const filename = generateBackupFilename();
    const filepath = path.join(BACKUP_CONFIG.outputDir, filename);
    
    let command = `pg_dump`;
    
    // Paramètres de connexion
    command += ` -h ${DB_CONFIG.host}`;
    command += ` -p ${DB_CONFIG.port}`;
    command += ` -U ${DB_CONFIG.user}`;
    command += ` -d ${DB_CONFIG.name}`;
    
    // Options de sauvegarde
    command += ` --verbose`;           // Affichage détaillé
    command += ` --clean`;             // Ajouter DROP/CREATE
    command += ` --if-exists`;         // IF EXISTS pour les DROP
    command += ` --no-owner`;          // Pas de propriétaire
    command += ` --no-privileges`;     // Pas de privilèges
    command += ` --schema=public`;     // Schéma public uniquement
    command += ` --data-only`;         // Données uniquement (optionnel)
    
    // Compression si activée
    if (BACKUP_CONFIG.compress) {
        command += ` | gzip > "${filepath}"`;
    } else {
        command += ` > "${filepath}"`;
    }
    
    return { command, filepath, filename };
}

/**
 * Vérifie la connectivité à la base de données
 */
function checkDatabaseConnection() {
    return new Promise((resolve, reject) => {
        const testCommand = `psql -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -U ${DB_CONFIG.user} -d ${DB_CONFIG.name} -c "SELECT 1;"`;
        
        exec(testCommand, { env: { ...process.env, PGPASSWORD: DB_CONFIG.password } }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`❌ Impossible de se connecter à la base de données: ${error.message}`));
            } else {
                console.log('✅ Connexion à la base de données établie');
                resolve();
            }
        });
    });
}

/**
 * Récupère les informations sur la base de données
 */
function getDatabaseInfo() {
    return new Promise((resolve, reject) => {
        const infoCommand = `
            psql -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -U ${DB_CONFIG.user} -d ${DB_CONFIG.name} -c "
                SELECT 
                    schemaname,
                    tablename,
                    n_tup_ins as inserts,
                    n_tup_upd as updates,
                    n_tup_del as deletes,
                    n_live_tup as live_rows
                FROM pg_stat_user_tables 
                ORDER BY schemaname, tablename;
            "`;
        
        exec(infoCommand, { env: { ...process.env, PGPASSWORD: DB_CONFIG.password } }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`❌ Impossible de récupérer les informations: ${error.message}`));
            } else {
                console.log('📊 Informations sur la base de données:');
                console.log(stdout);
                resolve();
            }
        });
    });
}

/**
 * Effectue la sauvegarde
 */
function performBackup() {
    return new Promise((resolve, reject) => {
        const { command, filepath, filename } = buildPgDumpCommand();
        
        console.log('🔄 Début de la sauvegarde...');
        console.log('📁 Fichier de sortie:', filepath);
        
        const startTime = Date.now();
        
        exec(command, { env: { ...process.env, PGPASSWORD: DB_CONFIG.password } }, (error, stdout, stderr) => {
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            
            if (error) {
                reject(new Error(`❌ Erreur lors de la sauvegarde: ${error.message}`));
            } else {
                console.log(`✅ Sauvegarde terminée en ${duration} secondes`);
                console.log('📁 Fichier créé:', filepath);
                
                // Vérifier la taille du fichier
                const stats = fs.statSync(filepath);
                const fileSize = (stats.size / 1024 / 1024).toFixed(2);
                console.log('📏 Taille du fichier:', fileSize, 'MB');
                
                resolve({ filepath, filename, duration, fileSize });
            }
        });
    });
}

/**
 * Valide la sauvegarde
 */
function validateBackup(filepath) {
    return new Promise((resolve, reject) => {
        console.log('🔍 Validation de la sauvegarde...');
        
        // Vérifier que le fichier existe et n'est pas vide
        if (!fs.existsSync(filepath)) {
            reject(new Error('❌ Fichier de sauvegarde introuvable'));
            return;
        }
        
        const stats = fs.statSync(filepath);
        if (stats.size === 0) {
            reject(new Error('❌ Fichier de sauvegarde vide'));
            return;
        }
        
        // Vérifier le contenu du fichier (premières lignes)
        const readStream = fs.createReadStream(filepath, { encoding: 'utf8' });
        let firstLines = '';
        let lineCount = 0;
        
        readStream.on('data', (chunk) => {
            firstLines += chunk;
            lineCount += (chunk.match(/\n/g) || []).length;
            
            if (lineCount >= 10) {
                readStream.destroy();
            }
        });
        
        readStream.on('end', () => {
            if (firstLines.includes('-- PostgreSQL database dump') || 
                firstLines.includes('pg_dump') ||
                firstLines.includes('CREATE TABLE')) {
                console.log('✅ Contenu de la sauvegarde valide');
                resolve();
            } else {
                reject(new Error('❌ Contenu de la sauvegarde invalide'));
            }
        });
        
        readStream.on('error', (error) => {
            reject(new Error(`❌ Erreur lors de la validation: ${error.message}`));
        });
    });
}

/**
 * Crée un fichier de métadonnées
 */
function createMetadataFile(backupInfo) {
    const metadata = {
        timestamp: new Date().toISOString(),
        database: {
            name: DB_CONFIG.name,
            host: DB_CONFIG.host,
            port: DB_CONFIG.port,
            user: DB_CONFIG.user
        },
        backup: {
            filename: backupInfo.filename,
            filepath: backupInfo.filepath,
            duration: backupInfo.duration,
            fileSize: backupInfo.fileSize,
            compressed: BACKUP_CONFIG.compress
        },
        system: {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch
        }
    };
    
    const metadataPath = path.join(BACKUP_CONFIG.outputDir, `${backupInfo.filename}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    console.log('📄 Métadonnées sauvegardées:', metadataPath);
    return metadataPath;
}

/**
 * Fonction principale
 */
async function main() {
    try {
        console.log('🚀 Début du processus de sauvegarde');
        console.log('📅 Date:', new Date().toLocaleString());
        console.log('🗄️ Base de données:', DB_CONFIG.name);
        console.log('🏠 Hôte:', DB_CONFIG.host);
        console.log('🔌 Port:', DB_CONFIG.port);
        console.log('👤 Utilisateur:', DB_CONFIG.user);
        console.log('');
        
        // Étape 1: Créer le répertoire de sauvegarde
        createBackupDirectory();
        
        // Étape 2: Vérifier la connexion
        await checkDatabaseConnection();
        
        // Étape 3: Récupérer les informations
        await getDatabaseInfo();
        
        // Étape 4: Effectuer la sauvegarde
        const backupInfo = await performBackup();
        
        // Étape 5: Valider la sauvegarde
        await validateBackup(backupInfo.filepath);
        
        // Étape 6: Créer les métadonnées
        const metadataPath = createMetadataFile(backupInfo);
        
        console.log('');
        console.log('🎉 Sauvegarde terminée avec succès!');
        console.log('📁 Fichier principal:', backupInfo.filepath);
        console.log('📄 Métadonnées:', metadataPath);
        console.log('⏱️ Durée:', backupInfo.duration, 'secondes');
        console.log('📏 Taille:', backupInfo.fileSize, 'MB');
        
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error.message);
        process.exit(1);
    }
}

// Exécution du script
if (require.main === module) {
    main();
}

module.exports = {
    performBackup,
    checkDatabaseConnection,
    getDatabaseInfo,
    validateBackup
}; 