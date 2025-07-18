# Documentation Backend - Billettigue

## Vue d'ensemble

Le backend de Billettigue est une **API REST** développée avec **Node.js** et **Express.js**, utilisant **Sequelize ORM** avec **PostgreSQL**. Il suit une architecture **MVC (Model-View-Controller)** avec une séparation claire des responsabilités.

### Technologies utilisées

- **Runtime** : Node.js
- **Framework** : Express.js 5.1.0
- **ORM** : Sequelize 6.37.7
- **Base de données** : PostgreSQL
- **Authentification** : JWT (jsonwebtoken)
- **Hashage** : bcrypt/bcryptjs
- **CORS** : Gestion des requêtes cross-origin
- **Logging** : Morgan
- **Variables d'environnement** : dotenv

---

## Architecture du projet

### Structure des dossiers

```
backend/
├── config/                 # Configuration
│   ├── database.js        # Configuration DB
│   └── connection.js      # Connexion DB
├── controllers/           # Contrôleurs (logique métier)
│   ├── authController.js
│   ├── adminController.js
│   ├── profileController.js
│   ├── reservationController.js
│   ├── statsController.js
│   ├── trajetController.js
│   ├── userController.js
│   └── notificationController.js
├── middlewares/           # Middlewares Express
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/               # Modèles Sequelize
│   ├── index.js         # Associations
│   ├── compte.js
│   ├── utilisateur.js
│   ├── transporteur.js
│   ├── administrateur.js
│   ├── trajet.js
│   ├── reservation.js
│   ├── paiement.js
│   ├── envoi.js
│   ├── colis.js
│   ├── zones_desservies.js
│   ├── role.js
│   └── revokedToken.js
├── routes/               # Routes Express
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── profileRoutes.js
│   ├── reservationRoutes.js
│   ├── statsRoutes.js
│   ├── trajetRoutes.js
│   ├── userRoutes.js
│   └── notificationRoutes.js
├── services/             # Services métier
│   ├── authService.js
│   ├── profileService.js
│   ├── reservationService.js
│   └── notificationService.js
├── migrations/           # Migrations Sequelize
├── seeders/             # Seeders Sequelize
├── tests/               # Tests
├── server.js            # Point d'entrée
└── package.json         # Dépendances
```

---

## Configuration et démarrage

### Variables d'environnement (.env)

```env
# Base de données
DB_NAME=billettigue
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=billettigue_secret_key_2024
JWT_EXPIRE=24h

# Serveur
PORT=5000
NODE_ENV=development

# Admin (pour les scripts de setup)
ADMIN_EMAIL=admin@billettigue.com
ADMIN_PWD=admin123
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=Billettigue
```

### Scripts disponibles

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "dev:debug": "nodemon --inspect server.js",
  "prod": "NODE_ENV=production node server.js",
  "setup-admin": "node scripts/setup-admin.js"
}
```

### Démarrage du serveur

```bash
# Développement
npm run dev

# Production
npm run prod

# Avec debug
npm run dev:debug
```

---

## Configuration de la base de données

### Configuration Sequelize

```javascript
const sequelize = new Sequelize(
  process.env.DB_NAME || 'billettigue',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
```

### Synchronisation automatique

Le serveur synchronise automatiquement les modèles avec la base de données au démarrage :

```javascript
await sequelize.sync({ alter: true });
```

---

## Middlewares

### 1. Middleware d'authentification (`authMiddleware.js`)

#### `protect`
Protège les routes en vérifiant le token JWT.

```javascript
const { protect } = require('../middlewares/authMiddleware');

// Utilisation
router.get('/profile', protect, profileController.getProfile);
```

**Fonctionnalités** :
- Extraction du token depuis `Authorization: Bearer <token>`
- Vérification de la validité du token JWT
- Vérification que le token n'est pas révoqué
- Récupération des informations utilisateur
- Attachement des données utilisateur à `req.user`

#### `admin`
Vérifie que l'utilisateur a le rôle administrateur.

```javascript
const { admin } = require('../middlewares/authMiddleware');

// Utilisation
router.get('/admin/stats', protect, admin, adminController.getStats);
```

#### `optionalAuth`
Authentification optionnelle (ne bloque pas si pas de token).

```javascript
const { optionalAuth } = require('../middlewares/authMiddleware');

// Utilisation
router.get('/public-data', optionalAuth, controller.getData);
```

### 2. Middleware de rôles (`roleMiddleware.js`)

Gère les permissions basées sur les rôles utilisateur.

---

## Routes API

### 1. Routes d'authentification (`/api/auth`)

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| `POST` | `/register-user` | Inscription utilisateur | Aucune |
| `POST` | `/register-transporter` | Inscription transporteur | Aucune |
| `POST` | `/register-admin` | Inscription administrateur | Aucune |
| `POST` | `/login-user` | Connexion utilisateur/admin | Aucune |
| `POST` | `/login-transporter` | Connexion transporteur | Aucune |
| `POST` | `/login` | Connexion générique | Aucune |
| `POST` | `/logout` | Déconnexion | `protect` |
| `GET` | `/verify-token` | Vérification token | `protect` |

### 2. Routes de trajets (`/api/trajets`)

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| `GET` | `/` | Liste des trajets | `optionalAuth` |
| `GET` | `/:id` | Détails d'un trajet | `optionalAuth` |
| `POST` | `/` | Créer un trajet | `protect` |
| `PUT` | `/:id` | Modifier un trajet | `protect` |
| `DELETE` | `/:id` | Supprimer un trajet | `protect` |
| `GET` | `/search` | Rechercher des trajets | `optionalAuth` |

### 3. Routes de réservations (`/api/reservations`)

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| `GET` | `/` | Mes réservations | `protect` |
| `POST` | `/` | Créer une réservation | Aucune |
| `GET` | `/:id` | Détails réservation | `protect` |
| `PUT` | `/:id` | Modifier réservation | `protect` |
| `DELETE` | `/:id` | Annuler réservation | `protect` |
| `POST` | `/:id/cancel` | Annuler réservation | `protect` |

### 4. Routes de profil (`/api/profile`)

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| `GET` | `/` | Mon profil | `protect` |
| `PUT` | `/` | Modifier profil | `protect` |
| `PUT` | `/password` | Changer mot de passe | `protect` |

### 5. Routes administrateur (`/api/admin`)

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| `GET` | `/users` | Liste utilisateurs | `protect, admin` |
| `GET` | `/transporters` | Liste transporteurs | `protect, admin` |
| `POST` | `/transporters` | Créer transporteur | `protect, admin` |
| `PUT` | `/transporters/:id` | Modifier transporteur | `protect, admin` |
| `DELETE` | `/transporters/:id` | Supprimer transporteur | `protect, admin` |
| `GET` | `/reservations` | Toutes les réservations | `protect, admin` |
| `GET` | `/trajets` | Tous les trajets | `protect, admin` |

### 6. Routes de statistiques (`/api/stats`)

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| `GET` | `/dashboard` | Stats dashboard | `protect, admin` |
| `GET` | `/reservations` | Stats réservations | `protect, admin` |
| `GET` | `/revenue` | Stats revenus | `protect, admin` |
| `GET` | `/users` | Stats utilisateurs | `protect, admin` |

### 7. Routes utilisateurs (`/api/users`)

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| `GET` | `/` | Liste utilisateurs | `protect, admin` |
| `GET` | `/:id` | Détails utilisateur | `protect, admin` |

---

## Services métier

### 1. Service d'authentification (`authService.js`)

#### Fonctions principales

**Inscription** :
- `registerUser(data)` : Inscription utilisateur complet
- `registerTransporter(data)` : Inscription transporteur complet
- `registerAdmin(data)` : Inscription administrateur complet

**Connexion** :
- `login(credentials)` : Connexion générique
- `loginUser(credentials)` : Connexion utilisateur/admin
- `loginTransporter(credentials)` : Connexion transporteur

**Gestion des tokens** :
- `logout(token, userId)` : Déconnexion et révocation
- `cleanupExpiredTokens()` : Nettoyage automatique
- `isTokenRevoked(token)` : Vérification révocation

#### Exemple d'utilisation

```javascript
const authService = require('../services/authService');

// Inscription utilisateur
const result = await authService.registerUser({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1234567890'
});

// Connexion
const loginResult = await authService.loginUser({
  email: 'user@example.com',
  password: 'password123'
});
```

### 2. Service de réservations (`reservationService.js`)

Gère toute la logique métier des réservations :
- Création de réservations
- Gestion des options remboursables
- Calcul des montants
- Validation des disponibilités

### 3. Service de profil (`profileService.js`)

Gère les opérations sur les profils utilisateurs :
- Mise à jour des informations
- Changement de mot de passe
- Validation des données

### 4. Service de notifications (`notificationService.js`)

Gère les notifications système (en développement).

---

## Contrôleurs

### 1. Contrôleur d'authentification (`authController.js`)

**Fonctions principales** :
- `registerUser(req, res)` : Inscription utilisateur
- `registerTransporter(req, res)` : Inscription transporteur
- `registerAdmin(req, res)` : Inscription admin
- `loginUser(req, res)` : Connexion utilisateur
- `loginTransporter(req, res)` : Connexion transporteur
- `logout(req, res)` : Déconnexion
- `verifyToken(req, res)` : Vérification token

### 2. Contrôleur de trajets (`trajetController.js`)

**Fonctions principales** :
- `getTrajets(req, res)` : Liste des trajets
- `getTrajetById(req, res)` : Détails d'un trajet
- `createTrajet(req, res)` : Créer un trajet
- `updateTrajet(req, res)` : Modifier un trajet
- `deleteTrajet(req, res)` : Supprimer un trajet
- `searchTrajets(req, res)` : Rechercher des trajets

### 3. Contrôleur de réservations (`reservationController.js`)

**Fonctions principales** :
- `getReservations(req, res)` : Mes réservations
- `createReservation(req, res)` : Créer réservation
- `getReservationById(req, res)` : Détails réservation
- `updateReservation(req, res)` : Modifier réservation
- `cancelReservation(req, res)` : Annuler réservation

### 4. Contrôleur administrateur (`adminController.js`)

**Fonctions principales** :
- `getUsers(req, res)` : Liste utilisateurs
- `getTransporters(req, res)` : Liste transporteurs
- `createTransporter(req, res)` : Créer transporteur
- `updateTransporter(req, res)` : Modifier transporteur
- `deleteTransporter(req, res)` : Supprimer transporteur

### 5. Contrôleur de statistiques (`statsController.js`)

**Fonctions principales** :
- `getDashboardStats(req, res)` : Stats dashboard
- `getReservationStats(req, res)` : Stats réservations
- `getRevenueStats(req, res)` : Stats revenus
- `getUserStats(req, res)` : Stats utilisateurs

---

## Sécurité

### Authentification JWT

```javascript
// Génération de token
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Vérification de token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Hashage des mots de passe

```javascript
// Hashage
const hashedPassword = await bcrypt.hash(password, 10);

// Vérification
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Révocation des tokens

Les tokens révoqués sont stockés en base de données pour empêcher leur réutilisation.

### CORS

Configuration CORS pour les origines autorisées :

```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:5000',
        'http://127.0.0.1:5000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
```

---

## Gestion des erreurs

### Middleware global d'erreur

```javascript
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});
```

### Gestion des erreurs JSON

```javascript
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Requête JSON invalide.' });
  }
  next(err);
});
```

### Codes d'erreur HTTP

- `200` : Succès
- `201` : Créé avec succès
- `400` : Requête invalide
- `401` : Non autorisé
- `403` : Accès refusé
- `404` : Ressource non trouvée
- `409` : Conflit (ex: email déjà utilisé)
- `500` : Erreur serveur

---

## Logging et monitoring

### Morgan (logs HTTP)

```javascript
app.use(morgan('dev'));
```

### Logs personnalisés

```javascript
console.log('✅ Connexion à la base de données établie');
console.log('🚀 Serveur en cours d\'exécution sur http://0.0.0.0:5000');
console.log('🧹 Nettoyage automatique des tokens configuré');
```

### Nettoyage automatique

Le serveur nettoie automatiquement les tokens expirés toutes les heures :

```javascript
setInterval(cleanupExpiredTokens, 60 * 60 * 1000); // 1 heure
```

---

## Tests et développement

### Scripts de test

```bash
# Test de déconnexion
npm run test:logout

# Test d'authentification
npm run test:auth
```

### Scripts de setup

```bash
# Setup administrateur
npm run setup-admin
```

### Mode debug

```bash
npm run dev:debug
```

---

## Déploiement

### Variables de production

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_secure_secret_key
DB_HOST=your_production_db_host
DB_PASSWORD=your_production_db_password
```

### Démarrage en production

```bash
npm run prod
```

### Process Manager (recommandé)

Utilisez PM2 pour la gestion des processus en production :

```bash
npm install -g pm2
pm2 start server.js --name "billettigue-backend"
pm2 startup
pm2 save
```

---

## Maintenance

### Sauvegarde de la base de données

```bash
pg_dump -h localhost -U postgres billettigue > backup.sql
```

### Restauration

```bash
psql -h localhost -U postgres billettigue < backup.sql
```

### Monitoring des performances

- Surveiller les logs d'erreur
- Monitorer l'utilisation de la base de données
- Vérifier les temps de réponse des API
- Surveiller l'utilisation mémoire

---

## API Documentation

### Format des réponses

**Succès** :
```json
{
  "success": true,
  "data": { ... },
  "message": "Opération réussie"
}
```

**Erreur** :
```json
{
  "success": false,
  "error": "Message d'erreur",
  "code": "ERROR_CODE"
}
```

### Authentification

Inclure le token JWT dans l'en-tête :
```
Authorization: Bearer <token>
```

### Pagination

Pour les listes, utiliser les paramètres :
```
?page=1&limit=10&sort=created_at&order=desc
```

---

## Évolution et maintenance

### Ajout de nouvelles routes

1. Créer le contrôleur dans `controllers/`
2. Créer le service dans `services/` (si nécessaire)
3. Définir les routes dans `routes/`
4. Ajouter les middlewares de protection
5. Tester l'endpoint

### Modifications de la base de données

1. Créer une migration Sequelize
2. Mettre à jour les modèles
3. Tester les changements
4. Déployer en production

### Sécurité

- Maintenir les dépendances à jour
- Surveiller les logs d'erreur
- Effectuer des audits de sécurité réguliers
- Sauvegarder régulièrement les données

---

*Documentation générée le : $(date)*
*Version du backend : 1.0.0*
*Dernière mise à jour : $(date)* 