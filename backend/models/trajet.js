/**
 * Modèle Trajet - Gestion des trajets de transport
 * Table : trajets
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trajet = sequelize.define('Trajet', {
    idTrajet: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idCompte: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'comptes',
            key: 'id'
        }
    },
    villeDepart: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    villeArrivee: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    dateDepart: {
        type: DataTypes.DATE,
        allowNull: false
    },
    heureDepart: {
        type: DataTypes.TIME,
        allowNull: false
    },
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    nombrePlaces: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
            max: 50
        }
    },
    placesDisponibles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 0
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    typeVehicule: {
        type: DataTypes.ENUM('bus', 'minibus', 'voiture', 'camion'),
        allowNull: false,
        defaultValue: 'bus'
    },
    statut: {
        type: DataTypes.ENUM('actif', 'annulé', 'terminé', 'en_cours'),
        allowNull: false,
        defaultValue: 'actif'
    },
    accepteColis: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    poidsMaxColis: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    prixColis: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    pointDepart: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    pointArrivee: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    conditions: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'Trajet',
    timestamps: true,
    createdAt: 'dateCreation',
    updatedAt: 'dateModification'
});

module.exports = Trajet;