/**
 * Contrôleur des statistiques administrateur
 * Gère toutes les statistiques dynamiques pour les dashboards admin
 */

const { 
  Compte, 
  Utilisateur, 
  Transporteur, 
  Administrateur,
  Trajet, 
  Envoi, 
  Colis, 
  Paiement, 
  Reservation,
  Role 
} = require('../models');
const { Op } = require('sequelize');

/**
 * Obtenir les statistiques générales du dashboard admin principal
 */
async function getGeneralStats(req, res) {
  try {
    console.log('📊 Récupération des statistiques générales admin...');

    // Statistiques utilisateurs
    const totalUsers = await Compte.count({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'user' }
      }]
    });

    const activeUsers = await Compte.count({
      include: [{
        model: Role,
        as: 'role', 
        where: { name: 'user' }
      }],
      where: {
        status: 'active',
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 derniers jours
        }
      }
    });

    // Statistiques transporteurs
    const totalTransporters = await Transporteur.count();
    const validatedTransporters = await Compte.count({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'transporteur' }
      }],
      where: { status: 'active' }
    });

    // Statistiques trajets
    const totalTrajets = await Trajet.count();
    const activeTrajets = await Trajet.count({
      where: {
        status: {
          [Op.in]: ['active', 'scheduled', 'open']
        }
      }
    });

    // Statistiques colis
    const totalColis = await Colis.count();
    const colisEnTransit = await Colis.count({
      where: {
        status: {
          [Op.in]: ['in_transit', 'in_progress', 'shipped']
        }
      }
    });

    // Statistiques financières (ce mois)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Paiement.sum('amount', {
      where: {
        status: 'completed',
        created_at: {
          [Op.gte]: currentMonth
        }
      }
    }) || 0;

    // Statistiques de satisfaction (simulée basée sur les réservations réussies)
    const totalReservations = await Reservation.count({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const successfulReservations = await Reservation.count({
      where: {
        status: {
          [Op.in]: ['confirmed', 'completed']
        },
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const satisfactionRate = totalReservations > 0 
      ? Math.round((successfulReservations / totalReservations) * 100)
      : 95; // Valeur par défaut

    // Incidents de sécurité (pour l'instant, simulated)
    const securityIncidents = 0; // À implémenter avec un système de monitoring

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      transporters: {
        total: totalTransporters,
        validated: validatedTransporters
      },
      trajets: {
        total: totalTrajets,
        active: activeTrajets
      },
      colis: {
        total: totalColis,
        inTransit: colisEnTransit
      },
      revenue: {
        monthly: Math.round(monthlyRevenue * 100) / 100 // Arrondir à 2 décimales
      },
      satisfaction: {
        rate: satisfactionRate
      },
      security: {
        incidents: securityIncidents
      }
    };

    console.log('✅ Statistiques générales récupérées:', stats);

    return res.status(200).json({
      success: true,
      data: stats,
      message: 'Statistiques générales récupérées avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques générales:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques',
      error: error.message
    });
  }
}

/**
 * Obtenir les statistiques détaillées des transporteurs
 */
async function getTransporterStats(req, res) {
  try {
    console.log('🚛 Récupération des statistiques transporteurs...');

    // Total transporteurs
    const totalTransporters = await Transporteur.count();

    // Transporteurs par statut
    const validatedTransporters = await Compte.count({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'transporteur' }
      }],
      where: { status: 'active' }
    });

    const pendingTransporters = await Compte.count({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'transporteur' }
      }],
      where: { status: 'pending' }
    });

    const suspendedTransporters = await Compte.count({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'transporteur' }
      }],
      where: { status: 'suspended' }
    });

    // Transporteurs récemment inscrits (7 derniers jours)
    const recentTransporters = await Transporteur.count({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Transporteurs actifs (avec trajets récents)
    const activeTransporters = await Transporteur.count({
      include: [{
        model: Trajet,
        as: 'trajets',
        where: {
          created_at: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }]
    });

    const stats = {
      total: totalTransporters,
      validated: validatedTransporters,
      pending: pendingTransporters,
      suspended: suspendedTransporters,
      recent: recentTransporters,
      active: activeTransporters
    };

    console.log('✅ Statistiques transporteurs récupérées:', stats);

    return res.status(200).json({
      success: true,
      data: stats,
      message: 'Statistiques transporteurs récupérées avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques transporteurs:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques transporteurs',
      error: error.message
    });
  }
}

/**
 * Obtenir les statistiques détaillées des trajets
 */
async function getTrajetStats(req, res) {
  try {
    console.log('🛣️ Récupération des statistiques trajets...');

    const [totalTrajets, enCours, programme, termine, annule] = await Promise.all([
      Trajet.count(),
      Trajet.count({ where: { status: 'active' } }),
      Trajet.count({ where: { status: 'scheduled' } }),
      Trajet.count({ where: { status: 'completed' } }),
      Trajet.count({ where: { status: 'cancelled' } })
    ]);

    const stats = {
      total: totalTrajets,
      active: enCours,
      programmed: programme, 
      completed: termine,
      cancelled: annule
    };

    return res.status(200).json({
      success: true,
      data: stats,
      message: 'Statistiques trajets récupérées avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur statistiques trajets:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques trajets',
      error: error.message
    });
  }
}

/**
 * Obtenir toutes les statistiques en une seule requête
 */
async function getAllStats(req, res) {
  try {
    console.log('📈 Récupération de toutes les statistiques...');

    // Exécuter toutes les requêtes en parallèle pour optimiser les performances
    const [generalStatsResult, transporterStatsResult, trajetStatsResult] = await Promise.allSettled([
      getGeneralStatsData(),
      getTransporterStatsData(),
      getTrajetStatsData()
    ]);

    const allStats = {
      general: generalStatsResult.status === 'fulfilled' ? generalStatsResult.value : null,
      transporters: transporterStatsResult.status === 'fulfilled' ? transporterStatsResult.value : null,
      trajets: trajetStatsResult.status === 'fulfilled' ? trajetStatsResult.value : null,
      lastUpdated: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      data: allStats,
      message: 'Toutes les statistiques récupérées avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération de toutes les statistiques:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques',
      error: error.message
    });
  }
}

// Fonctions helpers pour récupérer les données sans réponse HTTP
async function getGeneralStatsData() {
  try {
    // Statistiques utilisateurs
    const totalUsers = await Compte.count({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'user' }
      }]
    });

    const activeUsers = await Compte.count({
      include: [{
        model: Role,
        as: 'role', 
        where: { name: 'user' }
      }],
      where: {
        status: 'active',
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Statistiques transporteurs
    const totalTransporters = await Transporteur.count();
    const validatedTransporters = await Compte.count({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'transporteur' }
      }],
      where: { status: 'active' }
    });

    // Statistiques trajets
    const totalTrajets = await Trajet.count();
    const activeTrajets = await Trajet.count({
      where: {
        status: {
          [Op.in]: ['active', 'scheduled', 'open']
        }
      }
    });

    // Statistiques colis
    const totalColis = await Colis.count();
    const colisEnTransit = await Colis.count({
      where: {
        status: {
          [Op.in]: ['in_transit', 'in_progress', 'shipped']
        }
      }
    });

    // Statistiques financières
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Paiement.sum('amount', {
      where: {
        status: 'completed',
        created_at: {
          [Op.gte]: currentMonth
        }
      }
    }) || 0;

    // Taux de satisfaction
    const totalReservations = await Reservation.count({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const successfulReservations = await Reservation.count({
      where: {
        status: {
          [Op.in]: ['confirmed', 'completed']
        },
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const satisfactionRate = totalReservations > 0 
      ? Math.round((successfulReservations / totalReservations) * 100)
      : 95;

    return {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      transporters: {
        total: totalTransporters,
        validated: validatedTransporters
      },
      trajets: {
        total: totalTrajets,
        active: activeTrajets
      },
      colis: {
        total: totalColis,
        inTransit: colisEnTransit
      },
      revenue: {
        monthly: Math.round(monthlyRevenue * 100) / 100
      },
      satisfaction: {
        rate: satisfactionRate
      },
      security: {
        incidents: 0
      }
    };
  } catch (error) {
    console.error('Erreur getGeneralStatsData:', error);
    return null;
  }
}

async function getTransporterStatsData() {
  try {
    const totalTransporters = await Transporteur.count();
    
    const validatedTransporters = await Compte.count({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'transporteur' }
      }],
      where: { status: 'active' }
    });

    const pendingTransporters = await Compte.count({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'transporteur' }
      }],
      where: { status: 'pending' }
    });

    const suspendedTransporters = await Compte.count({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'transporteur' }
      }],
      where: { status: 'suspended' }
    });

    return {
      total: totalTransporters,
      validated: validatedTransporters,
      pending: pendingTransporters,
      suspended: suspendedTransporters
    };
  } catch (error) {
    console.error('Erreur getTransporterStatsData:', error);
    return null;
  }
}

async function getTrajetStatsData() {
  try {
    const [totalTrajets, enCours, programme, termine, annule] = await Promise.all([
      Trajet.count(),
      Trajet.count({ where: { status: 'active' } }),
      Trajet.count({ where: { status: 'scheduled' } }),
      Trajet.count({ where: { status: 'completed' } }),
      Trajet.count({ where: { status: 'cancelled' } })
    ]);

    return {
      total: totalTrajets,
      active: enCours,
      programmed: programme, 
      completed: termine,
      cancelled: annule
    };
  } catch (error) {
    console.error('Erreur getTrajetStatsData:', error);
    return null;
  }
}

/**
 * Obtenir les statistiques du transporteur connecté
 */
async function getTransporterOwnStats(req, res) {
  try {
    console.log('🚛 Récupération des statistiques du transporteur connecté...');
    console.log('🔍 req.user:', req.user);
    
    // Vérifier que l'utilisateur est un transporteur
    if (!req.user.transporteur) {
      return res.status(403).json({
        success: false,
        message: 'Seuls les transporteurs peuvent accéder à cette ressource'
      });
    }

    const transporterId = req.user.transporteur.id;
    console.log('🚛 ID Transporteur trouvé:', transporterId);

    // Statistiques des trajets du transporteur
    const totalTrajets = await Trajet.count({
      where: { transporteur_id: transporterId }
    });

    const activeJourneys = await Trajet.count({
      where: { 
        transporteur_id: transporterId,
        status: 'active'
      }
    });

    const completedJourneys = await Trajet.count({
      where: { 
        transporteur_id: transporterId,
        status: 'completed'
      }
    });

    const pendingJourneys = await Trajet.count({
      where: { 
        transporteur_id: transporterId,
        status: 'pending'
      }
    });

    // Statistiques des réservations pour ce transporteur
    const totalReservations = await Reservation.count({
      include: [{
        model: Trajet,
        as: 'trajet',
        where: { transporteur_id: transporterId },
        required: true
      }]
    });

    const confirmedReservations = await Reservation.count({
      include: [{
        model: Trajet,
        as: 'trajet',
        where: { transporteur_id: transporterId },
        required: true
      }],
      where: { status: 'confirmed' }
    });

    // Revenus du transporteur (30 derniers jours) - Requête simplifiée pour PostgreSQL
    const monthlyRevenue = await Paiement.sum('amount', {
      include: [{
        model: Reservation,
        as: 'reservation',
        attributes: [], // Pas d'attributs pour éviter GROUP BY
        include: [{
          model: Trajet,
          as: 'trajet',
          attributes: [], // Pas d'attributs pour éviter GROUP BY
          where: { transporteur_id: transporterId }
        }]
      }],
      where: {
        status: 'completed',
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    }) || 0;

    // Taux d'occupation moyen - Calcul simplifié
    const [totalCapacityResult, totalReservationsForOccupancy] = await Promise.all([
      Trajet.sum('seats_count', {
        where: { 
          transporteur_id: transporterId,
          status: {
            [Op.in]: ['completed', 'active']
          }
        }
      }),
      Reservation.count({
        include: [{
          model: Trajet,
          as: 'trajet',
          attributes: [],
          where: { 
            transporteur_id: transporterId,
            status: {
              [Op.in]: ['completed', 'active']
            }
          }
        }]
      })
    ]);

    const totalCapacity = totalCapacityResult || 0;
    const totalOccupied = totalReservationsForOccupancy || 0;

    const occupancyRate = totalCapacity > 0 
      ? Math.round((totalOccupied / totalCapacity) * 100)
      : 0;

    const stats = {
      journeys: {
        total: totalTrajets,
        active: activeJourneys,
        completed: completedJourneys,
        pending: pendingJourneys
      },
      reservations: {
        total: totalReservations,
        confirmed: confirmedReservations
      },
      revenue: {
        monthly: Math.round(monthlyRevenue * 100) / 100
      },
      performance: {
        occupancyRate: occupancyRate
      }
    };

    console.log('✅ Statistiques transporteur récupérées:', stats);

    return res.status(200).json({
      success: true,
      data: stats,
      message: 'Statistiques du transporteur récupérées avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques transporteur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques',
      error: error.message
    });
  }
}

module.exports = {
  getGeneralStats,
  getTransporterStats, 
  getTrajetStats,
  getAllStats,
  getTransporterOwnStats
}; 