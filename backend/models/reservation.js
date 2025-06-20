/**
 * Modèle Reservation - Gestion des réservations
 * Table : reservation
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reservation = sequelize.define('Reservation', {
    idReservation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dateReservation: {
        type: DataTypes.DATE,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idCompte: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'reservation',
    timestamps: false
});

module.exports = Reservation; 