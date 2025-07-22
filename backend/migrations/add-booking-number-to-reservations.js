// Migration Sequelize : Ajout du champ booking_number à la table reservations

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ajoute la colonne booking_number (sans unique ici)
    await queryInterface.addColumn('reservations', 'booking_number', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Numéro unique de réservation pour différencier chaque réservation utilisateur/trajet'
    });
    // Ajoute la contrainte unique séparément
    await queryInterface.addConstraint('reservations', {
      fields: ['booking_number'],
      type: 'unique',
      name: 'reservations_booking_number_key'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Supprime la contrainte unique d'abord
    await queryInterface.removeConstraint('reservations', 'reservations_booking_number_key');
    // Puis la colonne
    await queryInterface.removeColumn('reservations', 'booking_number');
  }
}; 