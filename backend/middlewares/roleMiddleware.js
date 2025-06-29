/**
 * Middleware de gestion des rôles
 * Vérifie que l'utilisateur a le rôle requis pour accéder à une ressource.
 */

const Role = require('../models/role');

/**
 * Middleware pour vérifier les rôles autorisés
 * @param {string[]} allowedRoles - Tableau des rôles autorisés
 * @returns {Function} Middleware Express
 */
const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Token d\'authentification manquant ou invalide'
        });
      }

      // Récupérer le rôle de l'utilisateur
      const userRole = req.user.role;
      
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: 'Rôle utilisateur non défini'
        });
      }

      // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Accès refusé. Rôles autorisés: ${allowedRoles.join(', ')}`
        });
      }

      // Si tout est OK, passer au middleware suivant
      next();
    } catch (error) {
      console.error('Erreur dans le middleware de rôle:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification des permissions'
      });
    }
  };
};

/**
 * Middleware spécifique pour vérifier le rôle administrateur
 */
const requireAdmin = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant ou invalide'
      });
    }

    // Vérifier le rôle admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Privilèges administrateur requis.'
      });
    }

    next();
  } catch (error) {
    console.error('Erreur dans le middleware requireAdmin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des permissions administrateur'
    });
  }
};

/**
 * Middleware spécifique pour vérifier le rôle transporteur
 */
const requireTransporter = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant ou invalide'
      });
    }

    if (!['transporteur', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Privilèges transporteur requis.'
      });
    }

    next();
  } catch (error) {
    console.error('Erreur dans le middleware requireTransporter:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des permissions transporteur'
    });
  }
};

/**
 * Middleware spécifique pour vérifier le rôle utilisateur
 */
const requireUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant ou invalide'
      });
    }

    if (!['user', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Compte utilisateur requis.'
      });
    }

    next();
  } catch (error) {
    console.error('Erreur dans le middleware requireUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des permissions utilisateur'
    });
  }
};

module.exports = {
  roleMiddleware,
  requireAdmin,
  requireTransporter,
  requireUser
}; 