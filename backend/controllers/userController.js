/**
 * Nom du fichier : userController.js
 * Description : Contrôleur pour la gestion des utilisateurs (profil, mise à jour)
 * Rôle : contrôleur (reçoit les requêtes HTTP, appelle le service ou le modèle, gère les réponses)
 */

/**
 * Logique du script :
 * 1. Récupérer le profil utilisateur (getUserProfile)
 * 2. Mettre à jour le profil utilisateur (updateUserProfile)
 * 3. Gérer les erreurs et retourner les réponses appropriées
 */

const Utilisateur = require('../models/utilisateur'); // Modèle Sequelize Utilisateur
const Compte = require('../models/compte'); // Modèle Sequelize Compte
const jwt = require('jsonwebtoken');

// @desc    Authentifier un utilisateur et obtenir un token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier l'email et le mot de passe
        const user = await Utilisateur.findOne({ where: { email }, include: Compte });

        if (user && (await user.Compte.matchPassword(password))) {
            res.json({
                _id: user.idUtilisateur,
                nom: user.nom,
                email: user.Compte.email,
                role: user.Compte.idRole,
                isAdmin: user.Compte.statut === 'admin',
                token: generateToken(user.idUtilisateur),
            });
        } else {
            res.status(401).json({ message: 'Email ou mot de passe invalide' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { nom, email, password, telephone, adresse, role } = req.body;

        const userExists = await Utilisateur.findOne({ where: { email }, include: Compte });

        if (userExists) {
            res.status(400).json({ message: 'Utilisateur déjà existant' });
            return;
        }

        const user = await Utilisateur.create({
            nom,
            email,
            password,
            telephone,
            adresse,
            Compte: {
                email: email,
                password: password,
                statut: role,
                idRole: role
            }
        });

        if (user) {
            res.status(201).json({
                _id: user.idUtilisateur,
                nom: user.nom,
                email: user.Compte.email,
                role: user.Compte.idRole,
                isAdmin: user.Compte.statut === 'admin',
                token: generateToken(user.idUtilisateur),
            });
        } else {
            res.status(400).json({ message: 'Données utilisateur invalides' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir le profil utilisateur
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        // Récupérer l'utilisateur par son id (depuis le middleware d'authentification)
        const utilisateur = await Utilisateur.findByPk(req.user.idUtilisateur, {
            include: [{ model: Compte, attributes: ['email', 'statut', 'idRole'] }]
        });

        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Retourner les infos du profil (hors mot de passe)
        return res.json({
            id: utilisateur.idUtilisateur,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            telephone: utilisateur.telephone,
            email: utilisateur.Compte.email,
            statut: utilisateur.Compte.statut,
            idRole: utilisateur.Compte.idRole
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        // Récupérer l'utilisateur par son id
        const utilisateur = await Utilisateur.findByPk(req.user.idUtilisateur, {
            include: [{ model: Compte }]
        });

        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Mettre à jour les champs autorisés
        utilisateur.nom = req.body.nom || utilisateur.nom;
        utilisateur.prenom = req.body.prenom || utilisateur.prenom;
        utilisateur.telephone = req.body.telephone || utilisateur.telephone;
        await utilisateur.save();

        // Mettre à jour l'email si fourni
        if (req.body.email) {
            utilisateur.Compte.email = req.body.email;
            await utilisateur.Compte.save();
        }

        // Retourner le profil mis à jour
        return res.json({
            id: utilisateur.idUtilisateur,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            telephone: utilisateur.telephone,
            email: utilisateur.Compte.email
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Générer JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    loginUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
}; 