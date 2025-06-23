/**
 * Nom du fichier : authMiddleware.js
 * Description : Middleware d'authentification JWT avec vérification des tokens révoqués
 * Rôle : middleware (protection des routes, vérification du token)
 */

const jwt = require('jsonwebtoken');
const { Compte, Utilisateur, RevokedToken } = require('../models/index'); // Modèles avec associations

/**
 * Logique du script :
 * 1. Extraire le token JWT de l'en-tête Authorization
 * 2. Vérifier la validité du token
 * 3. Vérifier si le token n'est pas révoqué
 * 4. Récupérer l'utilisateur en base (par id)
 * 5. Passer à la suite si OK, sinon retourner une erreur 401
 */

/*
Pseudo-code / Algorithme :
- Extraire le token JWT de l'en-tête Authorization
- Vérifier la validité du token
- Vérifier si le token n'est pas dans la liste des tokens révoqués
- Récupérer l'utilisateur en base par id
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
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'billettigue_secret_key_2024');

            // Vérifier si le token n'est pas révoqué
            const isRevoked = await RevokedToken.findOne({ where: { token } });
            if (isRevoked) {
                return res.status(401).json({ message: 'Token révoqué. Veuillez vous reconnecter.' });
            }

            // Récupérer le compte et l'utilisateur en base
            const compte = await Compte.findByPk(decoded.id, {
                include: [{ model: Utilisateur, as: 'utilisateur' }]
            });

            if (!compte) {
                return res.status(401).json({ message: 'Compte non trouvé.' });
            }

            // Attacher les informations utilisateur à la requête
            req.user = {
                id: compte.id,
                email: compte.email,
                status: compte.status,
                utilisateur: compte.utilisateur
            };

            next();
        } catch (error) {
            console.error('Erreur d\'authentification:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expiré. Veuillez vous reconnecter.' });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token invalide.' });
            } else {
                return res.status(401).json({ message: 'Non autorisé, token invalide' });
            }
        }
    } else {
        return res.status(401).json({ message: 'Non autorisé, pas de token' });
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
    if (req.user && req.user.status === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
    }
};

// ========== Fonction : optionalAuth ========== 
// Description : Middleware d'authentification optionnelle (ne bloque pas si pas de token)
// Paramètres :
// - req (Request) : Objet requête Express
// - res (Response) : Objet réponse Express
// - next (Function) : Fonction pour passer au middleware suivant
// Retour : (void) Passe toujours à la suite
const optionalAuth = async (req, res, next) => {
    let token;

    // Vérifie la présence du header Authorization et du token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Récupérer le token du header
            token = req.headers.authorization.split(' ')[1];

            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'billettigue_secret_key_2024');

            // Vérifier si le token n'est pas révoqué
            const isRevoked = await RevokedToken.findOne({ where: { token } });
            if (!isRevoked) {
                // Récupérer le compte et l'utilisateur en base
                const compte = await Compte.findByPk(decoded.id, {
                    include: [{ model: Utilisateur, as: 'utilisateur' }]
                });

                if (compte) {
                    // Attacher les informations utilisateur à la requête
                    req.user = {
                        id: compte.id,
                        email: compte.email,
                        status: compte.status,
                        utilisateur: compte.utilisateur
                    };
                }
            }
        } catch (error) {
            // En cas d'erreur, on continue sans authentification
            console.log('Authentification optionnelle échouée:', error.message);
        }
    }

    next();
};

module.exports = { protect, admin, optionalAuth }; 