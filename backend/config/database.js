/**
 * Configuration de la base de données PostgreSQL avec Sequelize
 * =========================================================
 * 
 * Ce fichier configure la connexion à la base de données PostgreSQL via Sequelize.
 * Il gère :
 * - La création de l'instance Sequelize avec les paramètres de connexion
 * - La lecture des variables d'environnement (.env) avec valeurs par défaut
 * - La configuration du pool de connexions
 * - Les logs SQL en mode développement
 * - Une fonction de test de connexion
 * 
 * Variables d'environnement utilisées :
 * - DB_NAME : Nom de la base de données (défaut: 'billettigue')
 * - DB_USER : Nom d'utilisateur PostgreSQL (défaut: 'postgres')
 * - DB_PASSWORD : Mot de passe PostgreSQL (défaut: 'postgres')
 * - DB_HOST : Hôte de la base de données (défaut: 'localhost')
 * - DB_PORT : Port PostgreSQL (défaut: 5432)
 * - NODE_ENV : Environnement ('development' pour voir les logs SQL)
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'billettigue',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT)  || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès.');
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error);
  }
};

module.exports = {
  sequelize,
  testConnection
}; 