/**
 * Script pour exécuter le seeder de création de l'administrateur
 * 
 * Ce script configure les variables d'environnement et exécute le seeder
 * pour créer le compte administrateur par défaut
 */

require('dotenv').config();

const { exec } = require('child_process');
const path = require('path');

async function runAdminSeeder() {
    console.log('🚀 EXÉCUTION DU SEEDER ADMIN');
    console.log('============================');
    
    // Vérifier les variables d'environnement
    console.log('🔍 Vérification des variables d\'environnement...');
    
    const requiredEnvVars = [
        'ADMIN_EMAIL',
        'ADMIN_PWD', 
        'ADMIN_LAST_NAME',
        'ADMIN_FIRST_NAME'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('❌ Variables d\'environnement manquantes:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.log('\n📋 Variables requises dans votre fichier .env:');
        console.log('ADMIN_EMAIL=admin@billettigue.com');
        console.log('ADMIN_PWD=VotreMotDePasse123!');
        console.log('ADMIN_LAST_NAME=Nom');
        console.log('ADMIN_FIRST_NAME=Prenom');
        process.exit(1);
    }
    
    console.log('✅ Toutes les variables d\'environnement sont présentes');
    console.log(`📧 Email admin: ${process.env.ADMIN_EMAIL}`);
    console.log(`👤 Nom: ${process.env.ADMIN_FIRST_NAME} ${process.env.ADMIN_LAST_NAME}`);
    
    // Exécuter le seeder
    console.log('\n🔄 Exécution du seeder...');
    
    const seederPath = path.join(__dirname, 'seeders', '20240620-create-admin.js');
    const command = `npx sequelize-cli db:seed --seed 20240620-create-admin.js`;
    
    return new Promise((resolve, reject) => {
        exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Erreur lors de l\'exécution du seeder:', error.message);
                if (stderr) {
                    console.error('Détails de l\'erreur:', stderr);
                }
                reject(error);
                return;
            }
            
            console.log('📄 Sortie du seeder:');
            console.log(stdout);
            
            if (stderr) {
                console.log('⚠️  Avertissements:');
                console.log(stderr);
            }
            
            console.log('✅ Seeder exécuté avec succès !');
            resolve(stdout);
        });
    });
}

// Fonction principale
async function main() {
    try {
        await runAdminSeeder();
        console.log('\n🎉 COMPTE ADMINISTRATEUR CRÉÉ AVEC SUCCÈS !');
        console.log('Vous pouvez maintenant vous connecter avec:');
        console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
        console.log(`🔐 Mot de passe: [celui défini dans ADMIN_PWD]`);
        
    } catch (error) {
        console.error('\n❌ ÉCHEC DE LA CRÉATION DU COMPTE ADMIN');
        console.error('Erreur:', error.message);
        process.exit(1);
    }
}

// Exécution si appelé directement
if (require.main === module) {
    main();
}

module.exports = { runAdminSeeder }; 