'use strict';

/**
 * Migration Sequelize pour la mise à jour de la table trajets
 * Ajout des nouveaux attributs selon le modèle actualisé
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('trajets', 'departure_address', {
      type: Sequelize.STRING(200),
      allowNull: false
    });
    await queryInterface.addColumn('trajets', 'arrival_address', {
      type: Sequelize.STRING(200),
      allowNull: false
    });
    await queryInterface.addColumn('trajets', 'currency', {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: 'XOF'
    });
    await queryInterface.addColumn('trajets', 'vehicle_type', {
      type: Sequelize.STRING(50),
      allowNull: false
    });
    await queryInterface.addColumn('trajets', 'vehicle_registration', {
      type: Sequelize.STRING(20),
      allowNull: false
    });
    await queryInterface.changeColumn('trajets', 'seats_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 100 }
    });
    await queryInterface.changeColumn('trajets', 'available_seats', {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 0 }
    });
    await queryInterface.changeColumn('trajets', 'accepts_packages', {
      type: Sequelize.BOOLEAN,
      allowNull: false
    });
    await queryInterface.changeColumn('trajets', 'max_package_weight', {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: false,
      validate: { min: 0 }
    });
    await queryInterface.addColumn('trajets', 'price_per_kg', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    });
    await queryInterface.changeColumn('trajets', 'status', {
      type: Sequelize.ENUM('active', 'cancelled', 'completed', 'full'),
      allowNull: false,
      defaultValue: 'active'
    });
    await queryInterface.addColumn('trajets', 'is_reservable_online', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
    // Sequelize gère createdAt et updatedAt automatiquement si timestamps: true
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('trajets', 'departure_address');
    await queryInterface.removeColumn('trajets', 'arrival_address');
    await queryInterface.removeColumn('trajets', 'currency');
    await queryInterface.removeColumn('trajets', 'vehicle_type');
    await queryInterface.removeColumn('trajets', 'vehicle_registration');
    await queryInterface.changeColumn('trajets', 'seats_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 50 }
    });
    await queryInterface.changeColumn('trajets', 'available_seats', {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 0 }
    });
    await queryInterface.changeColumn('trajets', 'accepts_packages', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
    await queryInterface.changeColumn('trajets', 'max_package_weight', {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: true,
      validate: { min: 0 }
    });
    await queryInterface.removeColumn('trajets', 'price_per_kg');
    await queryInterface.changeColumn('trajets', 'status', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'active'
    });
    await queryInterface.removeColumn('trajets', 'is_reservable_online');
  }
};
