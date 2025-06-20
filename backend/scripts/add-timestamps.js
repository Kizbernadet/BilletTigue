/**
 * Script pour ajouter les colonnes createdAt et updatedAt aux tables
 * 
 * Ce script ajoute les timestamps nécessaires aux tables compte et administrateur
 * si elles n'existent pas déjà.
 */

require('dotenv').config();
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

async function addTimestamps() {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🔧 Ajout des timestamps aux tables...');
    
    // Vérifier si les colonnes existent déjà dans la table compte
    console.log('🔍 Vérification de la table compte...');
    const compteColumns = await sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'compte' AND column_name IN ('createdAt', 'updatedAt')`,
      { type: Sequelize.QueryTypes.SELECT, transaction }
    );
    
    if (compteColumns.length === 0) {
      console.log('➕ Ajout des colonnes createdAt et updatedAt à la table compte...');
      await sequelize.query(
        `ALTER TABLE compte 
         ADD COLUMN "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         ADD COLUMN "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
        { transaction }
      );
      console.log('✅ Timestamps ajoutés à la table compte');
    } else {
      console.log('✅ Les timestamps existent déjà dans la table compte');
    }
    
    // Vérifier si les colonnes existent déjà dans la table administrateur
    console.log('🔍 Vérification de la table administrateur...');
    const adminColumns = await sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'administrateur' AND column_name IN ('createdAt', 'updatedAt')`,
      { type: Sequelize.QueryTypes.SELECT, transaction }
    );
    
    if (adminColumns.length === 0) {
      console.log('➕ Ajout des colonnes createdAt et updatedAt à la table administrateur...');
      await sequelize.query(
        `ALTER TABLE administrateur 
         ADD COLUMN "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         ADD COLUMN "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
        { transaction }
      );
      console.log('✅ Timestamps ajoutés à la table administrateur');
    } else {
      console.log('✅ Les timestamps existent déjà dans la table administrateur');
    }
    
    // Créer un trigger pour mettre à jour updatedAt automatiquement
    console.log('🔧 Création des triggers pour updatedAt...');
    
    // Trigger pour la table compte
    await sequelize.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW."updatedAt" = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `, { transaction });
    
    // Supprimer les triggers existants s'ils existent
    await sequelize.query(`
      DROP TRIGGER IF EXISTS update_compte_updated_at ON compte;
      DROP TRIGGER IF EXISTS update_administrateur_updated_at ON administrateur;
    `, { transaction });
    
    // Créer les triggers
    await sequelize.query(`
      CREATE TRIGGER update_compte_updated_at 
      BEFORE UPDATE ON compte 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `, { transaction });
    
    await sequelize.query(`
      CREATE TRIGGER update_administrateur_updated_at 
      BEFORE UPDATE ON administrateur 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `, { transaction });
    
    console.log('✅ Triggers créés avec succès');
    
    await transaction.commit();
    console.log('🎉 Timestamps ajoutés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des timestamps:', error.message);
    await transaction.rollback();
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script
addTimestamps().catch(console.error); 