/**
 * Nom du fichier : authMiddleware.js
 * Description : Middleware d'authentification JWT
 * Rôle : middleware (protection des routes, vérification du token)
 */

const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur'); // Utilisation du bon modèle Sequelize

/**
 * Logique du script :
 * 1. Extraire le token JWT de l'en-tête Authorization
 * 2. Vérifier la validité du token
 * 3. Récupérer l'utilisateur en base (par id)
 * 4. Passer à la suite si OK, sinon retourner une erreur 401
 */

/*
Pseudo-code / Algorithme :
- Extraire le token JWT de l'en-tête Authorization
- Vérifier la validité du token
- Si valide, passer à la suite (next)
- Sinon, retourner une erreur 401 Unauthorized
*/

// ========== Fonction : protect ========== 
// Description : Middleware pour protéger les routes par JWT
// Paramètres :
// - req (Request) : Objet requête Express
// - res (Response) : Objet réponse Express
// - next (Function) : Fonction pour passer au middleware suivant
// Retour : (void) Passe à la suite ou retourne une erreur
const protect = async (req, res, next) => {
    let token;

    // Vérifie la présence du header Authorization et du token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Récupérer le token du header
            token = req.headers.authorization.split(' ')[1];

            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Récupérer l'utilisateur en base par idUtilisateur
            req.user = await Utilisateur.findByPk(decoded.idUtilisateur, {
                attributes: { exclude: ['motDePasse'] }
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé.' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Non autorisé, token invalide' });
        }
    } else {
        res.status(401).json({ message: 'Non autorisé, pas de token' });
    }
};

// ========== Fonction : admin ========== 
// Description : Middleware pour vérifier si l'utilisateur est admin
// Paramètres :
// - req (Request) : Objet requête Express
// - res (Response) : Objet réponse Express
// - next (Function) : Fonction pour passer au middleware suivant
// Retour : (void) Passe à la suite ou retourne une erreur
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Non autorisé en tant qu\'admin' });
    }
};

module.exports = { protect, admin }; 