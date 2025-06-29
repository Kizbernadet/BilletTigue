/**
 * Seed pour créer un compte administrateur
 * 
 * Ce script crée automatiquement un compte administrateur avec les caractéristiques suivantes :
 * - Récupère dynamiquement le rôle 'admin' depuis la table roles
 * - Hash le mot de passe avec bcrypt
 * - Crée le compte dans comptes puis le lien dans administrateurs
 * - Idempotent : ne crée l'admin qu'une seule fois
 * - Inclut une méthode down pour supprimer proprement
 * 
 * Variables d'environnement requises :
 * - ADMIN_EMAIL : Email de l'administrateur
 * - ADMIN_PWD : Mot de passe de l'administrateur
 * - ADMIN_LAST_NAME : Nom de l'administrateur
 * - ADMIN_FIRST_NAME : Prénom de l'administrateur
 */

'use strict';

const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

module.exports = {
  /**
   * Méthode up : Création de l'administrateur
   */
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🔍 Vérification des variables d\'environnement...');
      
      // Vérification des variables d'environnement
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PWD;
      const adminLastName = process.env.ADMIN_LAST_NAME;
      const adminFirstName = process.env.ADMIN_FIRST_NAME;
      
      if (!adminEmail || !adminPassword || !adminLastName || !adminFirstName) {
        throw new Error('Variables d\'environnement manquantes. Veuillez définir ADMIN_EMAIL, ADMIN_PWD, ADMIN_LAST_NAME et ADMIN_FIRST_NAME dans votre fichier .env');
      }
      
      console.log('✅ Variables d\'environnement validées');
      
      // Vérifier si un administrateur existe déjà
      console.log('🔍 Vérification de l\'existence d\'un administrateur...');
      
      const existingAdmin = await queryInterface.sequelize.query(
        `SELECT c.id, c.email, a.id as admin_id, a.last_name, a.first_name 
         FROM comptes c 
         INNER JOIN administrateurs a ON c.id = a.compte_id 
         INNER JOIN roles r ON c.role_id = r.id 
         WHERE r.name = 'admin'`,
        { 
          type: Sequelize.QueryTypes.SELECT,
          transaction 
        }
      );
      
      if (existingAdmin.length > 0) {
        console.log('⚠️  Un administrateur existe déjà :', existingAdmin[0]);
        console.log('✅ Seed ignoré - Idempotence respectée');
        await transaction.commit();
        return;
      }
      
      console.log('✅ Aucun administrateur trouvé, création en cours...');
      
      // Récupérer le rôle 'admin' dynamiquement
      console.log('🔍 Récupération du rôle admin...');
      
      const adminRole = await queryInterface.sequelize.query(
        'SELECT id FROM roles WHERE name = :roleName',
        {
          replacements: { roleName: 'admin' },
          type: Sequelize.QueryTypes.SELECT,
          transaction
        }
      );
      
      if (adminRole.length === 0) {
        throw new Error('Le rôle "admin" n\'existe pas dans la table roles. Veuillez d\'abord créer ce rôle.');
      }
      
      const roleId = adminRole[0].id;
      console.log('✅ Rôle admin trouvé avec l\'ID:', roleId);
      
      // Vérifier si l'email existe déjà
      console.log('🔍 Vérification de l\'unicité de l\'email...');
      
      const existingEmail = await queryInterface.sequelize.query(
        'SELECT id FROM comptes WHERE email = :email',
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
      
      // Hasher le mot de passe
      console.log('🔐 Hashage du mot de passe...');
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
      console.log('✅ Mot de passe hashé avec succès');
      
      // Créer le compte
      console.log('👤 Création du compte administrateur...');
      
      const now = new Date();
      const compteData = {
        email: adminEmail,
        password_hash: hashedPassword,
        status: 'active',
        role_id: roleId,
        created_at: now,
        updated_at: now
      };
      
      const [compteResult] = await queryInterface.bulkInsert('comptes', [compteData], {
        returning: true,
        transaction
      });
      
      const compteId = compteResult.id;
      console.log('✅ Compte créé avec l\'ID:', compteId);
      
      // Créer l'administrateur
      console.log('👨‍💼 Création du profil administrateur...');
      
      const adminData = {
        last_name: adminLastName,
        first_name: adminFirstName,
        compte_id: compteId,
        created_at: now,
        updated_at: now
      };
      
      const [adminResult] = await queryInterface.bulkInsert('administrateurs', [adminData], {
        returning: true,
        transaction
      });
      
      console.log('✅ Administrateur créé avec l\'ID:', adminResult.id);
      
      // Validation finale
      console.log('🔍 Validation finale...');
      
      const finalCheck = await queryInterface.sequelize.query(
        `SELECT c.email, c.status, r.name as role_name, a.last_name, a.first_name 
         FROM comptes c 
         INNER JOIN administrateurs a ON c.id = a.compte_id
         INNER JOIN roles r ON c.role_id = r.id 
         WHERE c.id = :compteId`,
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
      console.log('✅ Transaction validée');
      
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'administrateur:', error.message);
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * Méthode down : Suppression de l'administrateur
   */
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🗑️  Suppression de l\'administrateur...');
      
      // Récupérer l'email de l'admin depuis les variables d'environnement
      const adminEmail = process.env.ADMIN_EMAIL;
      
      if (!adminEmail) {
        throw new Error('Variable d\'environnement ADMIN_EMAIL manquante pour la suppression');
      }
      
      // Trouver le compte administrateur
      const adminAccount = await queryInterface.sequelize.query(
        `SELECT c.id as compte_id, a.id as admin_id 
         FROM comptes c 
         INNER JOIN administrateurs a ON c.id = a.compte_id 
         INNER JOIN roles r ON c.role_id = r.id 
         WHERE c.email = :email AND r.name = 'admin'`,
        {
          replacements: { email: adminEmail },
          type: Sequelize.QueryTypes.SELECT,
          transaction
        }
      );
      
      if (adminAccount.length === 0) {
        console.log('⚠️  Aucun administrateur trouvé avec cet email');
        await transaction.commit();
        return;
      }
      
      const { compte_id, admin_id } = adminAccount[0];
      
      // Supprimer d'abord l'administrateur
      await queryInterface.bulkDelete('administrateurs', {
        id: admin_id
      }, { transaction });
      
      console.log('✅ Profil administrateur supprimé');
      
      // Puis supprimer le compte
      await queryInterface.bulkDelete('comptes', {
        id: compte_id
      }, { transaction });
      
      console.log('✅ Compte supprimé');
      
      await transaction.commit();
      console.log('✅ Administrateur supprimé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'administrateur:', error.message);
      await transaction.rollback();
      throw error;
    }
  }
}; 