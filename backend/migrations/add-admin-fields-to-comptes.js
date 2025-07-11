/**
 * Migration : Ajout des champs d'administration à la table comptes
 * Description : Ajoute les colonnes nécessaires pour la gestion admin des comptes
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('comptes', 'email_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('comptes', 'phone_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('comptes', 'last_login', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('comptes', 'login_attempts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('comptes', 'failed_logins', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('comptes', 'last_failed_login', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('comptes', 'account_locked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('comptes', 'password_changed_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('comptes', 'email_verified');
    await queryInterface.removeColumn('comptes', 'phone_verified');
    await queryInterface.removeColumn('comptes', 'last_login');
    await queryInterface.removeColumn('comptes', 'login_attempts');
    await queryInterface.removeColumn('comptes', 'failed_logins');
    await queryInterface.removeColumn('comptes', 'last_failed_login');
    await queryInterface.removeColumn('comptes', 'account_locked');
    await queryInterface.removeColumn('comptes', 'password_changed_at');
  }
}; 