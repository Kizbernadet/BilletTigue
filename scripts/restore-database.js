/**
 * Script de restauration de la base de données Billettigue
 * =====================================================
 * 
 * Ce script restaure une sauvegarde de la base de données
 * avec gestion des erreurs et validation de l'intégrité.
 * 
 * Utilisation :
 * node scripts/restore-database.js [fichier_backup]
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

// Configuration de la restauration
const RESTORE_CONFIG = {
    backupDir: path.join(__dirname, '..', 'backups'),
    createBackup: true,  // Créer une sauvegarde avant restauration
    dropDatabase: false, // Ne pas supprimer la base existante
    verbose: true
};

/**
 * Affiche l'aide du script
 */
function showHelp() {
    console.log(`
🔄 Script de restauration de la base de données Billettigue

Utilisation:
  node scripts/restore-database.js [fichier_backup]

Options:
  fichier_backup    Nom du fichier de sauvegarde à restaurer
                    (sans extension .sql ou .sql.gz)

Exemples:
  node scripts/restore-database.js billettigue_backup_2024-01-15T10-30-00-000Z
  node scripts/restore-database.js latest

Fonctionnalités:
  ✅ Création automatique d'une sauvegarde avant restauration
  ✅ Validation du fichier de sauvegarde
  ✅ Restauration sécurisée avec rollback possible
  ✅ Vérification de l'intégrité après restauration
`);
}

/**
 * Liste les sauvegardes disponibles
 */
function listAvailableBackups() {
    if (!fs.existsSync(RESTORE_CONFIG.backupDir)) {
        console.log('❌ Aucun répertoire de sauvegarde trouvé');
        return [];
    }
    
    const files = fs.readdirSync(RESTORE_CONFIG.backupDir)
        .filter(file => file.endsWith('.sql') || file.endsWith('.sql.gz'))
        .sort()
        .reverse();
    
    console.log('📁 Sauvegardes disponibles:');
    files.forEach((file, index) => {
        const filepath = path.join(RESTORE_CONFIG.backupDir, file);
        const stats = fs.statSync(filepath);
        const size = (stats.size / 1024 / 1024).toFixed(2);
        const date = stats.mtime.toLocaleString();
        console.log(`  ${index + 1}. ${file} (${size} MB) - ${date}`);
    });
    
    return files;
}

/**
 * Trouve le fichier de sauvegarde
 */
function findBackupFile(backupName) {
    if (!fs.existsSync(RESTORE_CONFIG.backupDir)) {
        throw new Error('❌ Répertoire de sauvegarde introuvable');
    }
    
    let backupFile = null;
    
    if (backupName === 'latest') {
        // Trouver la sauvegarde la plus récente
        const files = fs.readdirSync(RESTORE_CONFIG.backupDir)
            .filter(file => file.endsWith('.sql') || file.endsWith('.sql.gz'))
            .sort()
            .reverse();
        
        if (files.length === 0) {
            throw new Error('❌ Aucune sauvegarde trouvée');
        }
        
        backupFile = files[0];
    } else {
        // Chercher le fichier exact ou avec extensions
        const possibleFiles = [
            backupName,
            `${backupName}.sql`,
            `${backupName}.sql.gz`
        ];
        
        for (const file of possibleFiles) {
            const filepath = path.join(RESTORE_CONFIG.backupDir, file);
            if (fs.existsSync(filepath)) {
                backupFile = file;
                break;
            }
        }
        
        if (!backupFile) {
            throw new Error(`❌ Fichier de sauvegarde '${backupName}' introuvable`);
        }
    }
    
    return path.join(RESTORE_CONFIG.backupDir, backupFile);
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
 * Crée une sauvegarde de sécurité avant restauration
 */
function createSafetyBackup() {
    return new Promise((resolve, reject) => {
        if (!RESTORE_CONFIG.createBackup) {
            console.log('⚠️ Sauvegarde de sécurité désactivée');
            resolve(null);
            return;
        }
        
        console.log('🛡️ Création d\'une sauvegarde de sécurité...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safetyFile = `safety_backup_${timestamp}.sql`;
        const safetyPath = path.join(RESTORE_CONFIG.backupDir, safetyFile);
        
        let command = `pg_dump`;
        command += ` -h ${DB_CONFIG.host}`;
        command += ` -p ${DB_CONFIG.port}`;
        command += ` -U ${DB_CONFIG.user}`;
        command += ` -d ${DB_CONFIG.name}`;
        command += ` --clean --if-exists --no-owner --no-privileges`;
        command += ` > "${safetyPath}"`;
        
        exec(command, { env: { ...process.env, PGPASSWORD: DB_CONFIG.password } }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`❌ Erreur lors de la sauvegarde de sécurité: ${error.message}`));
            } else {
                console.log('✅ Sauvegarde de sécurité créée:', safetyPath);
                resolve(safetyPath);
            }
        });
    });
}

/**
 * Valide le fichier de sauvegarde
 */
function validateBackupFile(backupPath) {
    return new Promise((resolve, reject) => {
        console.log('🔍 Validation du fichier de sauvegarde...');
        
        if (!fs.existsSync(backupPath)) {
            reject(new Error('❌ Fichier de sauvegarde introuvable'));
            return;
        }
        
        const stats = fs.statSync(backupPath);
        if (stats.size === 0) {
            reject(new Error('❌ Fichier de sauvegarde vide'));
            return;
        }
        
        console.log('✅ Fichier de sauvegarde valide');
        console.log('📏 Taille:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
        resolve();
    });
}

/**
 * Effectue la restauration
 */
function performRestore(backupPath) {
    return new Promise((resolve, reject) => {
        console.log('🔄 Début de la restauration...');
        console.log('📁 Fichier source:', backupPath);
        
        const startTime = Date.now();
        
        let command = '';
        
        if (backupPath.endsWith('.gz')) {
            // Fichier compressé
            command = `gunzip -c "${backupPath}" | psql`;
        } else {
            // Fichier non compressé
            command = `psql -f "${backupPath}"`;
        }
        
        // Ajouter les paramètres de connexion
        command += ` -h ${DB_CONFIG.host}`;
        command += ` -p ${DB_CONFIG.port}`;
        command += ` -U ${DB_CONFIG.user}`;
        command += ` -d ${DB_CONFIG.name}`;
        
        if (RESTORE_CONFIG.verbose) {
            command += ` --echo-all`;
        }
        
        exec(command, { env: { ...process.env, PGPASSWORD: DB_CONFIG.password } }, (error, stdout, stderr) => {
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            
            if (error) {
                reject(new Error(`❌ Erreur lors de la restauration: ${error.message}`));
            } else {
                console.log(`✅ Restauration terminée en ${duration} secondes`);
                resolve({ duration, stdout });
            }
        });
    });
}

/**
 * Vérifie l'intégrité après restauration
 */
function verifyRestore() {
    return new Promise((resolve, reject) => {
        console.log('🔍 Vérification de l\'intégrité...');
        
        const verifyCommand = `
            psql -h ${DB_CONFIG.host} -p ${DB_CONFIG.port} -U ${DB_CONFIG.user} -d ${DB_CONFIG.name} -c "
                SELECT 
                    schemaname,
                    tablename,
                    n_live_tup as row_count
                FROM pg_stat_user_tables 
                ORDER BY schemaname, tablename;
            "`;
        
        exec(verifyCommand, { env: { ...process.env, PGPASSWORD: DB_CONFIG.password } }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`❌ Erreur lors de la vérification: ${error.message}`));
            } else {
                console.log('📊 État de la base après restauration:');
                console.log(stdout);
                console.log('✅ Vérification terminée');
                resolve();
            }
        });
    });
}

/**
 * Fonction principale
 */
async function main() {
    try {
        const args = process.argv.slice(2);
        
        if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
            showHelp();
            return;
        }
        
        const backupName = args[0];
        
        console.log('🚀 Début du processus de restauration');
        console.log('📅 Date:', new Date().toLocaleString());
        console.log('🗄️ Base de données:', DB_CONFIG.name);
        console.log('🏠 Hôte:', DB_CONFIG.host);
        console.log('🔌 Port:', DB_CONFIG.port);
        console.log('👤 Utilisateur:', DB_CONFIG.user);
        console.log('📁 Sauvegarde:', backupName);
        console.log('');
        
        // Étape 1: Lister les sauvegardes disponibles
        listAvailableBackups();
        console.log('');
        
        // Étape 2: Trouver le fichier de sauvegarde
        const backupPath = findBackupFile(backupName);
        console.log('📁 Fichier sélectionné:', backupPath);
        
        // Étape 3: Vérifier la connexion
        await checkDatabaseConnection();
        
        // Étape 4: Valider le fichier de sauvegarde
        await validateBackupFile(backupPath);
        
        // Étape 5: Créer une sauvegarde de sécurité
        const safetyBackup = await createSafetyBackup();
        
        // Étape 6: Effectuer la restauration
        const restoreInfo = await performRestore(backupPath);
        
        // Étape 7: Vérifier l'intégrité
        await verifyRestore();
        
        console.log('');
        console.log('🎉 Restauration terminée avec succès!');
        console.log('⏱️ Durée:', restoreInfo.duration, 'secondes');
        
        if (safetyBackup) {
            console.log('🛡️ Sauvegarde de sécurité:', safetyBackup);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la restauration:', error.message);
        console.log('');
        console.log('💡 Utilisez --help pour voir les options disponibles');
        process.exit(1);
    }
}

// Exécution du script
if (require.main === module) {
    main();
}

module.exports = {
    performRestore,
    checkDatabaseConnection,
    validateBackupFile,
    verifyRestore
}; 