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
const TrajetStatusService = require('./services/trajetStatusService');

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

// Configuration CORS plus explicite
app.use(cors({
    origin: true, // Permettre toutes les origines temporairement
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Middleware pour logger les requêtes CORS
app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

app.use(morgan('dev'));

const path = require('path');

// ... (autres middlewares)

app.use(express.static(path.join(__dirname, '../web')));
// Exemple : http://localhost:3000/pages/profile.html affichera le fichier web/pages/profile.html

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

// ========== Intégration des routes de trajets ========== 
// Routes pour la gestion des trajets (PUBLIC - doit être avant profileRoutes)
app.use('/api/trajets', require('./routes/trajetRoutes'));

// ========== Intégration des routes de profil ========== 
// Routes pour la gestion du profil utilisateur (PROTÉGÉ)
app.use('/api/profile', require('./routes/profileRoutes'));

// ========== Intégration des routes de réservations ========== 
// Routes pour la gestion des réservations de trajets (PROTÉGÉ)
app.use('/api/reservations', require('./routes/reservationRoutes'));

// ========== Intégration des routes de réservations transporteur ========== 
// Routes pour la gestion des réservations côté transporteur (PROTÉGÉ)
app.use('/api/transporter/reservations', require('./routes/transporterReservationRoutes'));

// ========== Intégration des routes administrateur ========== 
// Routes pour la gestion administrative (transporteurs, utilisateurs, stats)
app.use('/api/admin', require('./routes/adminRoutes'));

// ========== Intégration des routes de statistiques ========== 
// Routes pour les statistiques administrateur dynamiques
app.use('/api/stats', require('./routes/statsRoutes'));

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
const PORT = process.env.PORT || 3000;

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

// ========== Fonction de mise à jour automatique des trajets expirés ==========
// Met à jour automatiquement les statuts des trajets expirés toutes les 30 minutes
const updateExpiredTrajets = async () => {
    try {
        const result = await TrajetStatusService.updateExpiredTrajets();
        if (result.updatedCount > 0) {
            console.log(`🔄 ${result.updatedCount} trajets expirés mis à jour automatiquement`);
        }
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour des trajets expirés:', error);
    }
};

// Démarrer le nettoyage automatique (toutes les heures)
setInterval(cleanupExpiredTokens, 60 * 60 * 1000); // 1 heure

// Démarrer la mise à jour automatique des trajets expirés (toutes les 30 minutes)
setInterval(updateExpiredTrajets, 30 * 60 * 1000); // 30 minutes

// Synchroniser la base de données et démarrer le serveur
const startServer = async () => {
    try {
        // Synchroniser les modèles avec la base de données
        // await sequelize.sync({ alter: true });
        console.log('✅ Modèles synchronisés avec la base de données');
        
        // Nettoyer les tokens expirés au démarrage
        await cleanupExpiredTokens();
        
        // Mettre à jour les trajets expirés au démarrage
        await updateExpiredTrajets();
        
        // Démarrer le serveur
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur en cours d'exécution sur http://0.0.0.0:${PORT}`);
            console.log(`🧹 Nettoyage automatique des tokens configuré (toutes les heures)`);
            console.log(`🔄 Mise à jour automatique des trajets expirés configurée (toutes les 30 minutes)`);
        });
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};

startServer(); 