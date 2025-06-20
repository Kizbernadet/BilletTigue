/**
 * Script pour exécuter le seeder d'administrateur
 * 
 * Usage:
 * node scripts/run-seed.js
 * 
 * Variables d'environnement requises dans .env:
 * - ADMIN_EMAIL
 * - ADMIN_PWD
 * - ADMIN_NOM
 * - ADMIN_PRENOM
 */

require('dotenv').config();
const path = require('path');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

// Configuration de la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Désactiver les logs SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Importer le seeder
const adminSeeder = require('../seeders/20240620-create-admin.js');

async function runSeed() {
  try {
    console.log('🚀 Démarrage du seeder d\'administrateur...');
    console.log('📋 Configuration:');
    console.log(`   - Email: ${process.env.ADMIN_EMAIL || 'NON DÉFINI'}`);
    console.log(`   - Nom: ${process.env.ADMIN_NOM || 'NON DÉFINI'}`);
    console.log(`   - Prénom: ${process.env.ADMIN_PRENOM || 'NON DÉFINI'}`);
    console.log(`   - Mot de passe: ${process.env.ADMIN_PWD ? '***DÉFINI***' : 'NON DÉFINI'}`);
    console.log('');

    // Vérifier la connexion à la base de données
    console.log('🔌 Test de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Créer un mock de queryInterface pour le seeder
    const queryInterface = {
      sequelize: sequelize,
      bulkInsert: async (tableName, records, options = {}) => {
        const result = await sequelize.query(
          `INSERT INTO "${tableName}" (${Object.keys(records[0]).join(', ')}) 
           VALUES (${records.map(() => `(${Object.keys(records[0]).map(() => '?').join(', ')})`).join(', ')}) 
           RETURNING *`,
          {
            replacements: records.flatMap(record => Object.values(record)),
            type: Sequelize.QueryTypes.INSERT,
            transaction: options.transaction
          }
        );
        return options.returning ? result : [result];
      },
      bulkDelete: async (tableName, whereClause, options = {}) => {
        const whereKeys = Object.keys(whereClause);
        const whereValues = Object.values(whereClause);
        const whereSQL = whereKeys.map(key => `"${key}" = ?`).join(' AND ');
        
        await sequelize.query(
          `DELETE FROM "${tableName}" WHERE ${whereSQL}`,
          {
            replacements: whereValues,
            type: Sequelize.QueryTypes.DELETE,
            transaction: options.transaction
          }
        );
      },
      sequelize: sequelize
    };

    // Exécuter le seeder
    console.log('🌱 Exécution du seeder...');
    await adminSeeder.up(queryInterface, Sequelize);
    
    console.log('');
    console.log('🎉 Seeder exécuté avec succès !');
    console.log('');
    console.log('📝 Informations de connexion:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`   Mot de passe: ${process.env.ADMIN_PWD}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Gardez ces informations en sécurité !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution du seeder:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('🔌 Connexion à la base de données fermée');
  }
}

// Exécuter le script
runSeed(); 