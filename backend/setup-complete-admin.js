/**
 * Script complet pour configurer le compte administrateur
 * 
 * Ce script :
 * 1. Vérifie/charge la table roles
 * 2. Utilise les scripts existants pour créer l'admin
 */

require('dotenv').config();

const { exec } = require('child_process');
const { Sequelize } = require('sequelize');

// Configuration de la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

async function checkRolesTable() {
  console.log('🔍 Vérification de la table roles...');
  
  try {
    // Vérifier si la table roles contient les bons rôles
    const roles = await sequelize.query(
      'SELECT * FROM roles ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log('📋 Rôles existants:', roles.map(r => r.name));
    
    // Vérifier si le rôle admin existe
    const adminRole = roles.find(r => r.name === 'admin');
    
    if (!adminRole) {
      console.log('❌ Rôle admin manquant, rechargement de la table roles...');
      
      // Exécuter le script de rechargement des rôles
      await new Promise((resolve, reject) => {
        exec('psql -U ' + process.env.DB_USER + ' -d ' + process.env.DB_NAME + ' -f backend/scripts/reload-roles-table-fixed.sql', (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Erreur lors du rechargement des rôles:', error.message);
            reject(error);
            return;
          }
          console.log('✅ Table roles rechargée');
          resolve(stdout);
        });
      });
    } else {
      console.log('✅ Rôle admin trouvé');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des rôles:', error.message);
    throw error;
  }
}

async function setupAdmin() {
  console.log('🚀 SETUP COMPLET DU COMPTE ADMINISTRATEUR');
  console.log('==========================================');
  
  try {
    // Vérifier la connexion à la base
    console.log('🔌 Test de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion réussie');
    
    // Vérifier les variables d'environnement
    console.log('\n📋 Vérification des variables d\'environnement...');
    const requiredVars = ['ADMIN_EMAIL', 'ADMIN_PWD', 'ADMIN_LAST_NAME', 'ADMIN_FIRST_NAME'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Variables d\'environnement manquantes:', missingVars);
      console.log('\n📝 Ajoutez ces variables à votre fichier .env:');
      console.log('ADMIN_EMAIL=admin@billettigue.com');
      console.log('ADMIN_PWD=Admin123!');
      console.log('ADMIN_LAST_NAME=Admin');
      console.log('ADMIN_FIRST_NAME=Super');
      throw new Error('Variables d\'environnement manquantes');
    }
    
    console.log('✅ Variables d\'environnement OK');
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`👤 Nom: ${process.env.ADMIN_FIRST_NAME} ${process.env.ADMIN_LAST_NAME}`);
    
    // Étape 1: Vérifier/corriger la table roles
    console.log('\n📋 ÉTAPE 1: Vérification des rôles');
    await checkRolesTable();
    
    // Étape 2: Créer le compte admin avec le script existant
    console.log('\n👨‍💼 ÉTAPE 2: Création du compte administrateur');
    
    const { createAdmin } = require('./create-admin.js');
    await createAdmin();
    
    console.log('\n🎉 SETUP ADMINISTRATEUR TERMINÉ AVEC SUCCÈS !');
    console.log('\n📝 Informations de connexion:');
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`🔐 Mot de passe: ${process.env.ADMIN_PWD}`);
    console.log('\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion !');
    
  } catch (error) {
    if (error.message.includes('Un compte avec cet email existe déjà')) {
      console.log('\n✅ Le compte administrateur existe déjà !');
      console.log('📧 Email:', process.env.ADMIN_EMAIL);
      console.log('🔐 Utilisez le mot de passe configuré dans ADMIN_PWD');
    } else {
      console.error('\n❌ ERREUR lors du setup:', error.message);
      throw error;
    }
  } finally {
    await sequelize.close();
  }
}

// Fonction alternative avec le seeder Sequelize
async function setupAdminWithSeeder() {
  console.log('\n📦 ALTERNATIVE: Utilisation du seeder Sequelize');
  
  return new Promise((resolve, reject) => {
    exec('npx sequelize-cli db:seed --seed 20240620-create-admin.js', { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Erreur du seeder:', error.message);
        reject(error);
        return;
      }
      
      console.log('📄 Sortie du seeder:');
      console.log(stdout);
      
      if (stderr) {
        console.log('⚠️  Avertissements:', stderr);
      }
      
      console.log('✅ Seeder exécuté avec succès');
      resolve(stdout);
    });
  });
}

// Fonction principale
async function main() {
  try {
    await setupAdmin();
    
  } catch (error) {
    console.error('\n❌ ÉCHEC DU SETUP PRINCIPAL');
    console.log('\n🔄 Tentative avec le seeder...');
    
    try {
      await setupAdminWithSeeder();
      console.log('\n🎉 COMPTE ADMINISTRATEUR CRÉÉ AVEC LE SEEDER !');
      
    } catch (seederError) {
      console.error('\n❌ ÉCHEC COMPLET DU SETUP ADMINISTRATEUR');
      console.error('Erreur principale:', error.message);
      console.error('Erreur seeder:', seederError.message);
      process.exit(1);
    }
  }
}

// Exécution si appelé directement
if (require.main === module) {
  main();
}

module.exports = { setupAdmin, setupAdminWithSeeder }; 