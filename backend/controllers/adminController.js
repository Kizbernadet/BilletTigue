/**
 * Nom du fichier : adminController.js
 * Description : Contrôleur pour les fonctionnalités administrateur
 * Rôle : Gestion des utilisateurs, transporteurs et statistiques
 */

const bcrypt = require('bcrypt');
const { Compte, Utilisateur, Transporteur, Role, Administrateur } = require('../models/index');
const { Op } = require('sequelize');
const authService = require('../services/authService'); // Service d'authentification refactorisé

// ========== Fonction : createTransporter ==========
// Description : Créer un nouveau compte transporteur (admin uniquement) - Utilise le service refactorisé
async function createTransporter(req, res) {
  try {
    const {
      email,
      password,
      phone_number,
      company_name,
      company_type
    } = req.body;

    // Validation des champs requis
    if (!email || !password || !phone_number || !company_name || !company_type) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis: email, password, phone_number, company_name, company_type' 
      });
    }

    // Valider le type de transport
    if (!['freight-carrier', 'passenger-carrier', 'mixte'].includes(company_type)) {
      return res.status(400).json({ 
        message: 'Le company_type doit être "freight-carrier", "passenger-carrier" ou "mixte"' 
      });
    }

    // Utiliser le service refactorisé pour créer le transporteur
    const result = await authService.registerTransporter({
      email,
      password,
      phoneNumber: phone_number,
      companyName: company_name,
      companyType: company_type
    });

    // Adapter la réponse pour le format attendu par le frontend admin
    res.status(201).json({
      message: 'Transporteur créé avec succès',
      transporter: {
        id: result.user.id,
        email: result.user.email,
        phone_number: result.user.phoneNumber,
        company_name: result.user.companyName,
        company_type: result.user.companyType,
        status: 'active'
      }
    });

  } catch (error) {
    console.error('Erreur création transporteur:', error);
    res.status(500).json({ message: error.message });
  }
}

// ========== Fonction : getAllTransporters ==========
// Description : Récupérer tous les transporteurs avec pagination et filtres
async function getAllTransporters(req, res) {
  try {
    const { page = 1, limit = 10, search, status, company_type } = req.query;
    const offset = (page - 1) * limit;
    
    // Construire les conditions de recherche
    const whereConditions = {};
    const transporterWhereConditions = {};
    
    if (search) {
      whereConditions.email = { [Op.like]: `%${search}%` };
      transporterWhereConditions[Op.or] = [
        { company_name: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereConditions.status = status;
    }
    
    if (company_type) {
      transporterWhereConditions.company_type = company_type;
    }
    
    const { count, rows: transporters } = await Transporteur.findAndCountAll({
      where: transporterWhereConditions,
      include: [
        {
          model: Compte,
          as: 'compte',
          where: whereConditions,
          attributes: ['id', 'email', 'status', 'created_at', 'last_login'],
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['name', 'description']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.json({
      transporters: transporters.map(t => ({
        id: t.id,
        email: t.compte.email,
        phone_number: t.phone_number,
        company_name: t.company_name,
        company_type: t.company_type,
        status: t.compte.status,
        role: t.compte.role.name,
        created_at: t.created_at,
        last_login: t.compte.last_login
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération transporteurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des transporteurs.' });
  }
}

// ========== Fonction : getTransporterById ==========
// Description : Récupérer un transporteur par son ID avec toutes ses informations
async function getTransporterById(req, res) {
  try {
    const { id } = req.params;
    
    const transporteur = await Transporteur.findByPk(id, {
      include: [
        {
          model: Compte,
          as: 'compte',
          attributes: ['id', 'email', 'status', 'created_at', 'last_login', 'email_verified', 'phone_verified'],
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['name', 'description']
            }
          ]
        }
      ]
    });
    
    if (!transporteur) {
      return res.status(404).json({ message: 'Transporteur non trouvé.' });
    }
    
    // TODO: Récupérer les statistiques réelles depuis les tables appropriées
    // Pour l'instant, on utilise des données factices
    const transporterData = {
      id: transporteur.id,
      company_name: transporteur.company_name,
      company_type: transporteur.company_type,
      email: transporteur.compte.email,
      phone_number: transporteur.phone_number,
      status: transporteur.compte.status,
      created_at: transporteur.compte.created_at,
      last_login: transporteur.compte.last_login,
      email_verified: transporteur.compte.email_verified,
      phone_verified: transporteur.compte.phone_verified,
      // Statistiques (à remplacer par de vraies données)
      total_trips: 0,
      active_trips: 0,
      completed_trips: 0,
      cancelled_trips: 0,
      average_rating: 0,
      total_reviews: 0,
      total_revenue: '0€',
      // Données de sécurité
      account_locked: false,
      login_attempts: 0,
      failed_logins: 0,
      last_failed_login: null,
      last_profile_update: transporteur.updated_at,
      password_changed_at: null,
      // Données supplémentaires
      service_areas: [],
      vehicles_count: 0,
      vehicle_types: []
    };
    
    res.json(transporterData);

  } catch (error) {
    console.error('Erreur récupération transporteur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du transporteur.' });
  }
}

// ========== Fonction : getAllUsers ==========
// Description : Récupérer tous les utilisateurs avec pagination et filtres
async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;
    
    // Construire les conditions de recherche
    const whereConditions = {};
    const userWhereConditions = {};
    
    if (search) {
      whereConditions.email = { [Op.like]: `%${search}%` };
      userWhereConditions[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereConditions.status = status;
    }
    
    const { count, rows: users } = await Utilisateur.findAndCountAll({
      where: userWhereConditions,
      include: [
        {
          model: Compte,
          as: 'compte',
          where: whereConditions,
          attributes: ['id', 'email', 'status', 'created_at', 'last_login'],
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['name', 'description']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.json({
      users: users.map(u => ({
        id: u.id,
        email: u.compte.email,
        first_name: u.first_name,
        last_name: u.last_name,
        phone_number: u.phone_number,
        status: u.compte.status,
        role: u.compte.role.name,
        created_at: u.created_at,
        last_login: u.compte.last_login
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
  }
}

// ========== Fonction : getUserById ==========
// Description : Récupérer un utilisateur par son ID
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    
    const utilisateur = await Utilisateur.findByPk(id, {
      include: [
        {
          model: Compte,
          as: 'compte',
          attributes: ['id', 'email', 'status', 'created_at', 'last_login', 'email_verified', 'phone_verified'],
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['name', 'description']
            }
          ]
        }
      ]
    });
    
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    
    res.json({
      id: utilisateur.id,
      email: utilisateur.compte.email,
      first_name: utilisateur.first_name,
      last_name: utilisateur.last_name,
      phone_number: utilisateur.phone_number,
      status: utilisateur.compte.status,
      created_at: utilisateur.compte.created_at,
      last_login: utilisateur.compte.last_login,
      email_verified: utilisateur.compte.email_verified,
      phone_verified: utilisateur.compte.phone_verified
    });

  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.' });
  }
}

// ========== Fonction : getAdminStats ==========
// Description : Récupérer les statistiques générales pour l'admin
async function getAdminStats(req, res) {
  try {
    const [
      totalUsers,
      totalTransporters,
      totalAdmins,
      activeAccounts,
      inactiveAccounts,
      recentUsers,
      recentTransporters
    ] = await Promise.all([
      Utilisateur.count(),
      Transporteur.count(),
      Administrateur.count(),
      Compte.count({ where: { status: 'active' } }),
      Compte.count({ where: { status: 'inactive' } }),
      Utilisateur.count({
        where: {
          created_at: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 derniers jours
          }
        }
      }),
      Transporteur.count({
        where: {
          created_at: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 derniers jours
          }
        }
      })
    ]);

    res.json({
      stats: {
        totalUsers,
        totalTransporters,
        totalAdmins,
        totalAccounts: totalUsers + totalTransporters + totalAdmins,
        activeAccounts,
        inactiveAccounts,
        recentUsers,
        recentTransporters
      }
    });

  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques.' });
  }
}

// ========== Fonction : updateTransporterStatus ==========
// Description : Mettre à jour le statut d'un transporteur
async function updateTransporterStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const transporteur = await Transporteur.findByPk(id, {
      include: [{ model: Compte, as: 'compte' }]
    });

    if (!transporteur) {
      return res.status(404).json({ message: 'Transporteur non trouvé.' });
    }

    await transporteur.compte.update({ status });

    res.json({
      message: 'Statut du transporteur mis à jour avec succès',
      transporter: {
        id: transporteur.id,
        company_name: transporteur.company_name,
        status
      }
    });

  } catch (error) {
    console.error('Erreur mise à jour statut transporteur:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut.' });
  }
}

// ========== Fonction : updateUserStatus ==========
// Description : Mettre à jour le statut d'un utilisateur
async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const utilisateur = await Utilisateur.findByPk(id, {
      include: [{ model: Compte, as: 'compte' }]
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    await utilisateur.compte.update({ status });

    res.json({
      message: 'Statut de l\'utilisateur mis à jour avec succès',
      user: {
        id: utilisateur.id,
        first_name: utilisateur.first_name,
        last_name: utilisateur.last_name,
        status
      }
    });

  } catch (error) {
    console.error('Erreur mise à jour statut utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut.' });
  }
}

// ========== Fonction : deleteTransporter ==========
// Description : Supprimer ou désactiver un transporteur
async function deleteTransporter(req, res) {
  try {
    const { id } = req.params;
    const { action, reason, notify } = req.body;

    const transporteur = await Transporteur.findByPk(id, {
      include: [{ model: Compte, as: 'compte' }]
    });

    if (!transporteur) {
      return res.status(404).json({ message: 'Transporteur non trouvé.' });
    }

    let resultMessage = '';

    switch (action) {
      case 'suspend':
        // Suspendre le compte
        await transporteur.compte.update({ status: 'suspended' });
        resultMessage = 'Transporteur suspendu avec succès';
        break;
        
      case 'deactivate':
        // Désactiver temporairement
        await transporteur.compte.update({ status: 'inactive' });
        resultMessage = 'Transporteur désactivé avec succès';
        break;
        
      case 'delete':
        // Supprimer définitivement
        await transporteur.destroy();
        await transporteur.compte.destroy();
        resultMessage = 'Transporteur supprimé définitivement';
        break;
        
      default:
        return res.status(400).json({ message: 'Action invalide. Actions autorisées: suspend, deactivate, delete' });
    }

    // TODO: Envoyer une notification email si demandé
    if (notify) {
      console.log(`Notification email à envoyer à ${transporteur.compte.email} pour l'action: ${action}`);
      // Implémenter l'envoi d'email ici
    }

    // TODO: Logger l'action admin
    console.log(`Admin action: ${action} on transporter ${id}, reason: ${reason}`);

    res.json({ 
      message: resultMessage,
      action: action,
      transporter: {
        id: transporteur.id,
        company_name: transporteur.company_name,
        email: transporteur.compte.email
      }
    });

  } catch (error) {
    console.error('Erreur suppression/désactivation transporteur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression/désactivation du transporteur.' });
  }
}

// ========== Fonction : deleteUser ==========
// Description : Supprimer un utilisateur
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const utilisateur = await Utilisateur.findByPk(id, {
      include: [{ model: Compte, as: 'compte' }]
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Supprimer l'utilisateur et son compte
    await utilisateur.destroy();
    await utilisateur.compte.destroy();

    res.json({ message: 'Utilisateur supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur.' });
  }
}

// ========== Fonction : updateTransporter ==========
// Description : Mettre à jour les informations d'un transporteur
async function updateTransporter(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const transporteur = await Transporteur.findByPk(id, {
      include: [{ model: Compte, as: 'compte' }]
    });
    
    if (!transporteur) {
      return res.status(404).json({ message: 'Transporteur non trouvé.' });
    }

    // Validation des données
    const allowedFields = ['company_name', 'company_type', 'phone_number'];
    const transporterUpdates = {};
    const compteUpdates = {};

    // Séparer les champs du transporteur et du compte
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        transporterUpdates[key] = updateData[key];
      } else if (['email', 'status'].includes(key)) {
        compteUpdates[key] = updateData[key];
      }
    });

    // Mettre à jour le transporteur
    if (Object.keys(transporterUpdates).length > 0) {
      await transporteur.update(transporterUpdates);
    }

    // Mettre à jour le compte
    if (Object.keys(compteUpdates).length > 0) {
      await transporteur.compte.update(compteUpdates);
    }

    // Mettre à jour le mot de passe si fourni
    if (updateData.password && updateData.password.trim()) {
      console.log('🔑 Mise à jour du mot de passe pour le compte', transporteur.compte.id);
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      transporteur.compte.password_hash = hashedPassword;
      await transporteur.compte.save();
    }

    // Récupérer les données mises à jour
    const updatedTransporter = await Transporteur.findByPk(id, {
      include: [{ model: Compte, as: 'compte' }]
    });

    res.json({
      message: 'Transporteur mis à jour avec succès',
      transporter: {
        id: updatedTransporter.id,
        company_name: updatedTransporter.company_name,
        company_type: updatedTransporter.company_type,
        phone_number: updatedTransporter.phone_number,
        email: updatedTransporter.compte.email,
        status: updatedTransporter.compte.status
      }
    });

  } catch (error) {
    console.error('Erreur mise à jour transporteur:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du transporteur.' });
  }
}

// ========== Fonction : getAllAccounts ==========
// Description : Récupérer tous les comptes (admin, users, transporteurs)
async function getAllAccounts(req, res) {
  try {
    const accounts = await Compte.findAll({
      include: [
        { model: Role, as: 'role', attributes: ['name', 'description'] },
        { model: Utilisateur, as: 'utilisateur', required: false },
        { model: Transporteur, as: 'transporteur', required: false },
        { model: Administrateur, as: 'administrateur', required: false }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      accounts: accounts.map(account => ({
        id: account.id,
        email: account.email,
        status: account.status,
        role: account.role.name,
        created_at: account.created_at,
        profile: account.utilisateur || account.transporteur || account.administrateur
      }))
    });

  } catch (error) {
    console.error('Erreur récupération comptes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des comptes.' });
  }
}

// ========== Fonction : updateAccountRole ==========
// Description : Changer le rôle d'un compte
async function updateAccountRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const compte = await Compte.findByPk(id);
    if (!compte) {
      return res.status(404).json({ message: 'Compte non trouvé.' });
    }

    const newRole = await Role.findOne({ where: { name: role } });
    if (!newRole) {
      return res.status(400).json({ message: 'Rôle invalide.' });
    }

    await compte.update({ role_id: newRole.id });

    res.json({
      message: 'Rôle du compte mis à jour avec succès',
      account: {
        id: compte.id,
        email: compte.email,
        role: newRole.name
      }
    });

  } catch (error) {
    console.error('Erreur mise à jour rôle:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle.' });
  }
}

// ========== Fonction : getUserStats ==========
// Description : Statistiques détaillées des utilisateurs
async function getUserStats(req, res) {
  try {
    // Implémentation des statistiques utilisateurs
    res.json({ message: 'Statistiques utilisateurs - À implémenter' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques utilisateurs.' });
  }
}

// ========== Fonction : getTransporterStats ==========
// Description : Statistiques détaillées des transporteurs
async function getTransporterStats(req, res) {
  try {
    // Implémentation des statistiques transporteurs
    res.json({ message: 'Statistiques transporteurs - À implémenter' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques transporteurs.' });
  }
}

module.exports = {
  createTransporter,
  getAllTransporters,
  getTransporterById,
  getAllUsers,
  getUserById,
  getAdminStats,
  updateTransporterStatus,
  updateUserStatus,
  deleteTransporter,
  deleteUser,
  updateTransporter,
  getAllAccounts,
  updateAccountRole,
  getUserStats,
  getTransporterStats
}; 