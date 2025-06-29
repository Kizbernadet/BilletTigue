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
// Description : Récupérer tous les transporteurs
async function getAllTransporters(req, res) {
  try {
    const transporters = await Transporteur.findAll({
      include: [
        {
          model: Compte,
          as: 'compte',
          attributes: ['id', 'email', 'status', 'created_at'],
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['name', 'description']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      transporters: transporters.map(t => ({
        id: t.id,
        email: t.compte.email,
        phone_number: t.phone_number,
        company_name: t.company_name,
        company_type: t.company_type,
        status: t.compte.status,
        role: t.compte.role.name,
        created_at: t.created_at
      }))
    });

  } catch (error) {
    console.error('Erreur récupération transporteurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des transporteurs.' });
  }
}

// ========== Fonction : getAllUsers ==========
// Description : Récupérer tous les utilisateurs
async function getAllUsers(req, res) {
  try {
    const users = await Utilisateur.findAll({
      include: [
        {
          model: Compte,
          as: 'compte',
          attributes: ['id', 'email', 'status', 'created_at'],
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['name', 'description']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      users: users.map(u => ({
        id: u.id,
        email: u.compte.email,
        first_name: u.first_name,
        last_name: u.last_name,
        phone_number: u.phone_number,
        status: u.compte.status,
        role: u.compte.role.name,
        created_at: u.created_at
      }))
    });

  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
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
// Description : Supprimer un transporteur
async function deleteTransporter(req, res) {
  try {
    const { id } = req.params;

    const transporteur = await Transporteur.findByPk(id, {
      include: [{ model: Compte, as: 'compte' }]
    });

    if (!transporteur) {
      return res.status(404).json({ message: 'Transporteur non trouvé.' });
    }

    // Supprimer le transporteur et son compte
    await transporteur.destroy();
    await transporteur.compte.destroy();

    res.json({ message: 'Transporteur supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression transporteur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du transporteur.' });
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

    const transporteur = await Transporteur.findByPk(id);
    if (!transporteur) {
      return res.status(404).json({ message: 'Transporteur non trouvé.' });
    }

    await transporteur.update(updateData);

    res.json({
      message: 'Transporteur mis à jour avec succès',
      transporter: transporteur
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
  getAllUsers,
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