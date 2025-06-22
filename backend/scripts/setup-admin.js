/**
 * Script complet de setup pour l'administrateur
 * 
 * Ce script :
 * 1. Ajoute les timestamps aux tables si nécessaire
 * 2. Crée le rôle admin s'il n'existe pas
 * 3. Crée le compte administrateur
 * 
 * Usage: node scripts/setup-admin.js
 */

require('dotenv').config();
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
    logging: false
  }
);

async function setupAdmin() {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🚀 Démarrage du setup administrateur...');
    console.log('📋 Configuration:');
    console.log(`   - Email: ${process.env.ADMIN_EMAIL || 'NON DÉFINI'}`);
    console.log(`   - Nom: ${process.env.ADMIN_NOM || 'NON DÉFINI'}`);
    console.log(`   - Prénom: ${process.env.ADMIN_PRENOM || 'NON DÉFINI'}`);
    console.log(`   - Mot de passe: ${process.env.ADMIN_PWD ? '***DÉFINI***' : 'NON DÉFINI'}`);
    console.log('');

    // Vérifier la connexion
    console.log('🔌 Test de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Étape 1: Ajouter les timestamps
    console.log('\n🔧 Étape 1: Préparation des timestamps...');
    
    // Vérifier et ajouter les timestamps à la table comptes
    const comptesColumns = await sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'comptes' AND column_name IN ('created_at', 'updated_at')`,
      { type: Sequelize.QueryTypes.SELECT, transaction }
    );
    
    if (comptesColumns.length === 0) {
      console.log('➕ Ajout des timestamps à la table comptes...');
      await sequelize.query(
        `ALTER TABLE comptes 
         ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
        { transaction }
      );
      console.log('✅ Timestamps ajoutés à la table comptes');
    } else {
      console.log('✅ Timestamps déjà présents dans la table comptes');
    }
    
    // Vérifier et ajouter les timestamps à la table administrateurs
    const adminColumns = await sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'administrateurs' AND column_name IN ('created_at', 'updated_at')`,
      { type: Sequelize.QueryTypes.SELECT, transaction }
    );
    
    if (adminColumns.length === 0) {
      console.log('➕ Ajout des timestamps à la table administrateurs...');
      await sequelize.query(
        `ALTER TABLE administrateurs 
         ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
        { transaction }
      );
      console.log('✅ Timestamps ajoutés à la table administrateurs');
    } else {
      console.log('✅ Timestamps déjà présents dans la table administrateurs');
    }

    // Étape 2: Créer le rôle admin s'il n'existe pas
    console.log('\n👑 Étape 2: Vérification du rôle admin...');
    
    const adminRole = await sequelize.query(
      'SELECT id_role FROM roles WHERE name = :roleName',
      {
        replacements: { roleName: 'admin' },
        type: Sequelize.QueryTypes.SELECT,
        transaction
      }
    );
    
    let roleId;
    if (adminRole.length === 0) {
      console.log('➕ Création du rôle admin...');
      const [newRole] = await sequelize.query(
        'INSERT INTO roles (name, description) VALUES (:roleName, :description) RETURNING id_role',
        {
          replacements: { roleName: 'admin', description: 'Administrateur du système' },
          type: Sequelize.QueryTypes.INSERT,
          transaction
        }
      );
      roleId = newRole[0].id_role;
      console.log('✅ Rôle admin créé avec l\'ID:', roleId);
    } else {
      roleId = adminRole[0].id_role;
      console.log('✅ Rôle admin trouvé avec l\'ID:', roleId);
    }

    // Étape 3: Vérifier si un administrateur existe déjà
    console.log('\n🔍 Étape 3: Vérification de l\'existence d\'un administrateur...');
    
    const existingAdmin = await sequelize.query(
      `SELECT c.id_compte, c.email, a.id_admin, a.last_name, a.first_name 
       FROM comptes c 
       INNER JOIN administrateurs a ON c.id_compte = a.id_compte 
       INNER JOIN roles r ON c.id_role = r.id_role 
       WHERE r.name = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT, transaction }
    );
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  Un administrateur existe déjà :', existingAdmin[0]);
      console.log('✅ Setup terminé - Idempotence respectée');
      await transaction.commit();
      return;
    }

    // Étape 4: Vérifier les variables d'environnement
    console.log('\n🔐 Étape 4: Validation des variables d\'environnement...');
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PWD;
    const adminNom = process.env.ADMIN_NOM;
    const adminPrenom = process.env.ADMIN_PRENOM;
    
    if (!adminEmail || !adminPassword || !adminNom || !adminPrenom) {
      throw new Error('Variables d\'environnement manquantes. Veuillez définir ADMIN_EMAIL, ADMIN_PWD, ADMIN_NOM et ADMIN_PRENOM dans votre fichier .env');
    }
    
    console.log('✅ Variables d\'environnement validées');

    // Étape 5: Vérifier l'unicité de l'email
    console.log('\n📧 Étape 5: Vérification de l\'unicité de l\'email...');
    
    const existingEmail = await sequelize.query(
      'SELECT id_compte FROM comptes WHERE email = :email',
      {
        replacements: { email: adminEmail },
        type: Sequelize.QueryTypes.SELECT,
        transaction
      }
    );
    
    if (existingEmail.length > 0) {
      throw new Error(`Un compte avec l'email ${adminEmail} existe déjà.`);
    }
    
    console.log('✅ Email unique validé');

    // Étape 6: Créer le compte administrateur
    console.log('\n👤 Étape 6: Création du compte administrateur...');
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    console.log('✅ Mot de passe hashé avec succès');
    
    const now = new Date();
    const compteData = {
      email: adminEmail,
      password_hash: hashedPassword,
      status: 'active',
      id_role: roleId,
      role_id: roleId,
      created_at: now,
      updated_at: now
    };
    
    const [compteResult] = await sequelize.query(
      `INSERT INTO comptes (email, password_hash, status, id_role, role_id, created_at, updated_at) 
       VALUES (:email, :password_hash, :status, :id_role, :role_id, :created_at, :updated_at) 
       RETURNING id_compte`,
      {
        replacements: compteData,
        type: Sequelize.QueryTypes.INSERT,
        transaction
      }
    );
    
    const compteId = compteResult[0].id_compte;
    console.log('✅ Compte créé avec l\'ID:', compteId);

    // Étape 7: Créer le profil administrateur
    console.log('\n👨‍💼 Étape 7: Création du profil administrateur...');
    
    const adminData = {
      last_name: adminNom,
      first_name: adminPrenom,
      id_compte: compteId,
      compte_id: compteId,
      created_at: now,
      updated_at: now
    };
    
    const [adminResult] = await sequelize.query(
      `INSERT INTO administrateurs (last_name, first_name, id_compte, compte_id, created_at, updated_at) 
       VALUES (:last_name, :first_name, :id_compte, :compte_id, :created_at, :updated_at) 
       RETURNING id_admin`,
      {
        replacements: adminData,
        type: Sequelize.QueryTypes.INSERT,
        transaction
      }
    );
    
    console.log('✅ Administrateur créé avec l\'ID:', adminResult[0].id_admin);

    // Étape 8: Validation finale
    console.log('\n🔍 Étape 8: Validation finale...');
    
    const finalCheck = await sequelize.query(
      `SELECT c.email, c.status, r.name as role_name, a.last_name, a.first_name 
       FROM comptes c 
       INNER JOIN administrateurs a ON c.id_compte = a.id_compte 
       INNER JOIN roles r ON c.id_role = r.id_role 
       WHERE c.id_compte = :compteId`,
      {
        replacements: { compteId },
        type: Sequelize.QueryTypes.SELECT,
        transaction
      }
    );
    
    if (finalCheck.length === 0) {
      throw new Error('Erreur lors de la validation finale : l\'administrateur n\'a pas été créé correctement');
    }
    
    console.log('✅ Validation finale réussie');
    console.log('🎉 Administrateur créé avec succès :', finalCheck[0]);
    
    await transaction.commit();
    console.log('\n🎉 Setup administrateur terminé avec succès !');
    console.log('\n📝 Informations de connexion:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Mot de passe: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANT: Gardez ces informations en sécurité !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du setup administrateur:', error.message);
    await transaction.rollback();
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Connexion à la base de données fermée');
  }
}

// Exécuter le script
setupAdmin().catch(console.error); 