/**
 * Script de vérification des changements de port 5000 -> 3000
 */

const fs = require('fs');
const path = require('path');

// Fichiers à vérifier
const filesToCheck = [
    // Fichiers JavaScript frontend
    'web/src/js/transporter-stats-manager.js',
    'web/src/js/trajets-modal.js',
    'web/src/js/trajets-api-simple.js',
    'web/src/js/trajet-management.js',
    'web/src/js/search-trajets.js',
    'web/src/js/reservation.js',
    'web/src/js/admin-stats-manager.js',
    'web/src/js/admin-dashboard.js',
    'web/src/js/admin-dashboard-transporter.js',
    
    // Fichiers de test
    'test-reservation-fetch.js',
    'test-guest-reservation.js',
    'test-connectivity.js',
    'backend/test-connectivity.js',
    
    // Fichiers de documentation
    'web/PROBLEMES_A_REGLE.md',
    'SCHEMA_MODULAIRE_COMPOSANTS_BILLETTIGUE.md',
    'docs/DOCUMENTATION_BACKEND.md',
    
    // Fichier principal du serveur
    'backend/server.js'
];

console.log('🔍 Vérification des changements de port 5000 -> 3000...\n');

let totalFiles = 0;
let filesWith5000 = 0;
let filesWith3000 = 0;
let filesChecked = 0;

filesToCheck.forEach(filePath => {
    totalFiles++;
    
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const has5000 = content.includes('5000');
            const has3000 = content.includes('3000');
            
            filesChecked++;
            
            if (has5000) {
                filesWith5000++;
                console.log(`❌ ${filePath} - Contient encore le port 5000`);
            } else if (has3000) {
                filesWith3000++;
                console.log(`✅ ${filePath} - Port 3000 correctement configuré`);
            } else {
                console.log(`⚠️  ${filePath} - Aucun port détecté`);
            }
        } else {
            console.log(`❓ ${filePath} - Fichier non trouvé`);
        }
    } catch (error) {
        console.log(`❌ ${filePath} - Erreur de lecture: ${error.message}`);
    }
});

console.log('\n📊 Résumé de la vérification:');
console.log(`📁 Fichiers vérifiés: ${filesChecked}/${totalFiles}`);
console.log(`❌ Fichiers avec port 5000: ${filesWith5000}`);
console.log(`✅ Fichiers avec port 3000: ${filesWith3000}`);

if (filesWith5000 === 0) {
    console.log('\n🎉 Tous les changements de port ont été effectués avec succès !');
    console.log('🚀 Le backend peut maintenant démarrer sur le port 3000 sans conflit.');
} else {
    console.log('\n⚠️  Attention: Il reste des références au port 5000 à corriger.');
    console.log('💡 Vérifiez les fichiers listés ci-dessus.');
}

console.log('\n🔧 Prochaines étapes:');
console.log('1. Démarrer le serveur backend: npm start (dans le dossier backend)');
console.log('2. Tester la connexion: node test-backend-connection.js');
console.log('3. Vérifier les méthodes HTTP: node test-http-methods.js'); 