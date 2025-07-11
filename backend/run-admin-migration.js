/**
 * Script : Exécution de la migration des champs d'administration
 * Description : Ajoute les colonnes nécessaires à la table comptes
 */

const { sequelize } = require('./config/database');
const migration = require('./migrations/add-admin-fields-to-comptes');

async function runMigration() {
  try {
    console.log('🔄 Début de la migration des champs d\'administration...');
    
    // Tester la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');
    
    // Exécuter la migration
    await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('✅ Migration exécutée avec succès');
    
    console.log('📋 Colonnes ajoutées :');
    console.log('   - email_verified (BOOLEAN)');
    console.log('   - phone_verified (BOOLEAN)');
    console.log('   - last_login (DATE)');
    console.log('   - login_attempts (INTEGER)');
    console.log('   - failed_logins (INTEGER)');
    console.log('   - last_failed_login (DATE)');
    console.log('   - account_locked (BOOLEAN)');
    console.log('   - password_changed_at (DATE)');
    
    console.log('\n🎉 Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Exécuter la migration
runMigration(); 