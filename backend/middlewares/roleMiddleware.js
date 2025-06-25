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

module.exports = roleMiddleware; 