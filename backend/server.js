// =============================================
// Fichier principal du backend : server.js
// Initialise l'application Express, configure les middlewares,
// gère les routes, la connexion à la base de données et démarre le serveur.
// =============================================

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { testConnection, sequelize } = require('./config/database');
const authService = require('./services/authService');

// Charger les variables d'environnement
dotenv.config();

// Tester la connexion à la base de données
testConnection();

// Importer les modèles et leurs associations
require('./models/index');

// Initialiser Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// ========== Gestion des erreurs de parsing JSON ========== 
// Si le body JSON est mal formé, cette gestion d'erreur renverra une réponse claire
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Requête JSON invalide.' });
  }
  next(err);
});

// ========== Intégration des routes d'authentification ========== 
// Routes pour l'inscription et la connexion
app.use('/api/auth', require('./routes/authRoutes'));

// ========== Intégration des routes de profil ========== 
// Routes pour la gestion du profil utilisateur
app.use('/api', require('./routes/profileRoutes'));

// ========== Intégration des routes de trajets ========== 
// Routes pour la gestion des trajets
app.use('/api', require('./routes/trajetRoutes'));

// Autres routes
app.use('/api/users', require('./routes/userRoutes'));

// Route de base
app.get('/', (req, res) => {
    res.send('API Billettigue en cours d\'exécution...');
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Port
const PORT = process.env.PORT || 5000;

// ========== Fonction de nettoyage des tokens expirés ==========
// Nettoie automatiquement les tokens expirés toutes les heures
const cleanupExpiredTokens = async () => {
    try {
        const deletedCount = await authService.cleanupExpiredTokens();
        if (deletedCount > 0) {
            console.log(`🧹 ${deletedCount} tokens expirés supprimés`);
        }
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage des tokens:', error);
    }
};

// Démarrer le nettoyage automatique (toutes les heures)
setInterval(cleanupExpiredTokens, 60 * 60 * 1000); // 1 heure

// Synchroniser la base de données et démarrer le serveur
const startServer = async () => {
    try {
        // Synchroniser les modèles avec la base de données
        await sequelize.sync({ alter: true });
        console.log('✅ Modèles synchronisés avec la base de données');
        
        // Nettoyer les tokens expirés au démarrage
        await cleanupExpiredTokens();
        
        // Démarrer le serveur
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur en cours d'exécution sur http://0.0.0.0:${PORT}`);
            console.log(`🧹 Nettoyage automatique des tokens configuré (toutes les heures)`);
        });
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};

startServer(); 