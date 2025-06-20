/**
 * Seed pour créer un compte administrateur
 * 
 * Ce script crée automatiquement un compte administrateur avec les caractéristiques suivantes :
 * - Récupère dynamiquement le rôle 'admin' depuis la table ROLES
 * - Hash le mot de passe avec bcrypt
 * - Crée le compte dans COMPTES puis le lien dans ADMINISTRATEUR
 * - Idempotent : ne crée l'admin qu'une seule fois
 * - Inclut une méthode down pour supprimer proprement
 * 
 * Variables d'environnement requises :
 * - ADMIN_EMAIL : Email de l'administrateur
 * - ADMIN_PWD : Mot de passe de l'administrateur
 * - ADMIN_NOM : Nom de l'administrateur
 * - ADMIN_PRENOM : Prénom de l'administrateur
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
      const adminNom = process.env.ADMIN_NOM;
      const adminPrenom = process.env.ADMIN_PRENOM;
      
      if (!adminEmail || !adminPassword || !adminNom || !adminPrenom) {
        throw new Error('Variables d\'environnement manquantes. Veuillez définir ADMIN_EMAIL, ADMIN_PWD, ADMIN_NOM et ADMIN_PRENOM dans votre fichier .env');
      }
      
      console.log('✅ Variables d\'environnement validées');
      
      // Vérifier si un administrateur existe déjà
      console.log('🔍 Vérification de l\'existence d\'un administrateur...');
      
      const existingAdmin = await queryInterface.sequelize.query(
        `SELECT c.idCompte, c.email, a.idAdmin, a.nom, a.prenom 
         FROM compte c 
         INNER JOIN administrateur a ON c.idCompte = a.idCompte 
         INNER JOIN role r ON c.idRole = r.idRole 
         WHERE r.nomRole = 'admin'`,
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
        'SELECT idRole FROM role WHERE nomRole = :roleName',
        {
          replacements: { roleName: 'admin' },
          type: Sequelize.QueryTypes.SELECT,
          transaction
        }
      );
      
      if (adminRole.length === 0) {
        throw new Error('Le rôle "admin" n\'existe pas dans la table role. Veuillez d\'abord créer ce rôle.');
      }
      
      const roleId = adminRole[0].idRole;
      console.log('✅ Rôle admin trouvé avec l\'ID:', roleId);
      
      // Vérifier si l'email existe déjà
      console.log('🔍 Vérification de l\'unicité de l\'email...');
      
      const existingEmail = await queryInterface.sequelize.query(
        'SELECT idCompte FROM compte WHERE email = :email',
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
        motDePasse: hashedPassword,
        statut: 'actif',
        idRole: roleId,
        createdAt: now,
        updatedAt: now
      };
      
      const [compteResult] = await queryInterface.bulkInsert('compte', [compteData], {
        returning: true,
        transaction
      });
      
      const compteId = compteResult.idCompte;
      console.log('✅ Compte créé avec l\'ID:', compteId);
      
      // Créer l'administrateur
      console.log('👨‍💼 Création du profil administrateur...');
      
      const adminData = {
        nom: adminNom,
        prenom: adminPrenom,
        idCompte: compteId,
        createdAt: now,
        updatedAt: now
      };
      
      const [adminResult] = await queryInterface.bulkInsert('administrateur', [adminData], {
        returning: true,
        transaction
      });
      
      console.log('✅ Administrateur créé avec l\'ID:', adminResult.idAdmin);
      
      // Validation finale
      console.log('🔍 Validation finale...');
      
      const finalCheck = await queryInterface.sequelize.query(
        `SELECT c.email, c.statut, r.nomRole, a.nom, a.prenom 
         FROM compte c 
         INNER JOIN administrateur a ON c.idCompte = a.idCompte 
         INNER JOIN role r ON c.idRole = r.idRole 
         WHERE c.idCompte = :compteId`,
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
      const adminCompte = await queryInterface.sequelize.query(
        `SELECT c.idCompte, a.idAdmin 
         FROM compte c 
         INNER JOIN administrateur a ON c.idCompte = a.idCompte 
         INNER JOIN role r ON c.idRole = r.idRole 
         WHERE c.email = :email AND r.nomRole = 'admin'`,
        {
          replacements: { email: adminEmail },
          type: Sequelize.QueryTypes.SELECT,
          transaction
        }
      );
      
      if (adminCompte.length === 0) {
        console.log('⚠️  Aucun administrateur trouvé avec cet email:', adminEmail);
        await transaction.commit();
        return;
      }
      
      const { idCompte, idAdmin } = adminCompte[0];
      
      // Supprimer l'administrateur
      console.log('🗑️  Suppression du profil administrateur...');
      await queryInterface.bulkDelete('administrateur', { idAdmin }, { transaction });
      
      // Supprimer le compte
      console.log('🗑️  Suppression du compte...');
      await queryInterface.bulkDelete('compte', { idCompte }, { transaction });
      
      console.log('✅ Administrateur supprimé avec succès');
      
      await transaction.commit();
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'administrateur:', error.message);
      await transaction.rollback();
      throw error;
    }
  }
}; 