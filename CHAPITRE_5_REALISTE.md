# CHAPITRE 5 – DÉVELOPPEMENT ET INTÉGRATION

## 5.1. Environnement et architecture

### 5.1.1. Stack et outils utilisés

**Backend :**
- **Node.js** : v18.17.0 (LTS)
- **Express** : v4.18.2
- **PostgreSQL** : v14.10
- **Sequelize** : v6.32.1
- **JWT** : v9.0.2
- **bcrypt** : v5.1.0

**Frontend Web :**
- **HTML5** / **CSS3** / **JavaScript ES6+**
- **Tailwind CSS** : v3.3.3
- **DaisyUI** : v3.9.0
- **Chart.js** : v4.4.0

**Frontend Mobile :**
- **Flutter** : v3.16.0
- **Dart** : v3.2.0
- **Provider** : v6.1.1

**Outils de développement :**
- **Git** : v2.40.0
- **npm** : v9.6.0
- **nodemon** : v3.0.1 (redémarrage automatique)

### 5.1.2. Architecture technique

**Architecture actuelle :**
- **Monolithique modulaire** : Backend Node.js/Express avec modules séparés
- **Base de données** : PostgreSQL installé localement
- **Développement local** : Environnement de développement sans conteneurisation
- **Déploiement** : Serveur local avec scripts de démarrage

**Scripts de démarrage :**
```bash
# Linux/Mac
./start-dev.sh

# Windows
start-dev.bat
```

**Structure du projet :**
```
billettigue1/
├── backend/          # API Node.js/Express
├── web/             # Frontend HTML/CSS/JS
├── mobile/          # Application Flutter
└── docs/            # Documentation
```

## 5.2. Implémentation des modules clés

### 5.2.1. Backend : APIs REST (Node.js/Express)

**Structure du projet backend :**
```
backend/
├── config/          # Configuration DB
├── controllers/     # 8 contrôleurs métier
├── services/        # 4 services métier
├── routes/          # 8 modules de routes
├── models/          # 12 modèles Sequelize
├── middlewares/     # Auth, rôles, validation
├── migrations/      # Migrations DB
├── seeders/         # Données de test
├── server.js        # Point d'entrée
└── package.json     # Dépendances
```

**Modules principaux :**

**Authentification (`authController.js`) :**
- **Responsabilités** : Inscription, connexion, gestion des tokens JWT
- **Endpoints** :
  - `POST /api/auth/register-user`
  - `POST /api/auth/register-transporter`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`

**Trajets (`trajetController.js`) :**
- **Responsabilités** : CRUD trajets, recherche, validation
- **Endpoints** :
  - `GET /api/trajets`
  - `GET /api/trajets/:id`
  - `POST /api/trajets`
  - `PUT /api/trajets/:id`
  - `DELETE /api/trajets/:id`
  - `GET /api/trajets/search`

**Réservations (`reservationController.js`) :**
- **Responsabilités** : Gestion des réservations, calcul des prix
- **Endpoints** :
  - `GET /api/reservations`
  - `POST /api/reservations`
  - `PUT /api/reservations/:id`
  - `DELETE /api/reservations/:id`

**Administration (`adminController.js`) :**
- **Responsabilités** : Gestion des transporteurs, statistiques
- **Endpoints** :
  - `GET /api/admin/transporters`
  - `PUT /api/admin/transporters/:id/validate`
  - `GET /api/admin/users`
  - `GET /api/admin/stats`

### 5.2.2. Frontend : Flutter (mobile) et HTML/CSS/JS (web)

**Application Mobile Flutter :**
- **Architecture** : Provider pour la gestion d'état
- **Navigation** : Navigation modulaire entre écrans
- **Services** : Communication avec l'API backend
- **Écrans** : 9 écrans principaux (splash, auth, home, trajets, etc.)

**Application Web :**
- **Technologies** : HTML5, CSS3, JavaScript vanilla
- **Styling** : Tailwind CSS + DaisyUI
- **Organisation** : 25+ modules JavaScript modulaires
- **Pages** : 10 pages HTML principales

**Gestion d'état :**
- **Mobile** : Provider pattern avec ChangeNotifier
- **Web** : Gestion locale avec localStorage/sessionStorage

### 5.2.3. Base de données et modèles

**PostgreSQL avec Sequelize :**
- **12 tables** principales : comptes, utilisateurs, transporteurs, administrateurs, trajets, réservations, paiements, envois, colis, zones desservies, rôles, tokens révoqués
- **Relations** : Associations entre entités (1:1, 1:N, N:N)
- **Migrations** : Évolution contrôlée du schéma
- **Seeders** : Données de test et initialisation

**Exemple de modèle :**
```javascript
// models/utilisateur.js
const Utilisateur = sequelize.define('Utilisateur', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  telephone: { type: DataTypes.STRING, allowNull: false },
  mot_de_passe: { type: DataTypes.STRING, allowNull: false }
});
```

## 5.3. Intégration et tests

### 5.3.1. Tests manuels

**Méthodologie de test :**
- **Tests manuels** : Validation des fonctionnalités principales
- **Tests d'intégration** : Vérification des interactions entre modules
- **Tests utilisateur** : Validation des parcours complets

**Scénarios testés :**
1. **Authentification** : Inscription, connexion, déconnexion
2. **Réservation** : Recherche, sélection, réservation de trajet
3. **Administration** : Gestion des transporteurs, consultation des statistiques
4. **Navigation** : Parcours utilisateur sur web et mobile

### 5.3.2. Validation de la qualité

**Métriques de qualité :**
- **Performance** : Temps de réponse API < 500ms
- **Fiabilité** : Fonctionnalités critiques testées manuellement
- **Sécurité** : Authentification JWT, validation des entrées
- **Maintenabilité** : Code modulaire et documenté

**Outils de validation :**
- **Postman** : Tests d'API manuels
- **Navigateur web** : Tests frontend
- **Émulateur Flutter** : Tests mobile
- **Console PostgreSQL** : Validation des données

## 5.4. Déploiement et environnement

### 5.4.1. Environnement de développement

**Configuration locale :**
```bash
# Backend
cd backend
npm install
npm start

# Base de données
# PostgreSQL installé localement
# Configuration dans config/database.js

# Frontend web
# Serveur de développement (Live Server, etc.)

# Frontend mobile
# Flutter development server
```

**Variables d'environnement :**
```bash
# .env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=billettigue
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
```

### 5.4.2. Scripts de démarrage

**start-dev.sh (Linux/Mac) :**
```bash
#!/bin/bash
echo "Démarrage du serveur BilletTiguè"
cd backend
npm install
npm start
```

**start-dev.bat (Windows) :**
```batch
@echo off
echo Démarrage du serveur BilletTiguè
cd backend
npm install
npm start
pause
```

## 5.5. Sécurité et bonnes pratiques

### 5.5.1. Sécurité implémentée

**Authentification :**
- **JWT** : Tokens d'authentification sécurisés
- **bcrypt** : Hachage des mots de passe
- **Rôles** : Gestion fine des permissions (user, transporteur, admin)

**Validation :**
- **Entrées utilisateur** : Validation côté serveur
- **SQL Injection** : Protection via Sequelize ORM
- **XSS** : Échappement des données côté frontend

**Middleware de sécurité :**
```javascript
// middlewares/authMiddleware.js
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token requis' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.utilisateur = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};
```

### 5.5.2. Bonnes pratiques

**Code :**
- **Modularité** : Séparation claire des responsabilités
- **Documentation** : Commentaires et README
- **Conventions** : Nommage cohérent des fichiers et variables

**Architecture :**
- **Pattern MVC** : Modèles, Contrôleurs, Vues
- **API REST** : Endpoints standardisés
- **Gestion d'erreurs** : Middleware centralisé

## 5.6. Conclusion

Le développement de BilletTiguè s'est appuyé sur des technologies modernes et éprouvées, avec une architecture modulaire facilitant la maintenance et l'évolution. L'absence de conteneurisation et de tests automatisés est compensée par une approche manuelle rigoureuse et une structure de code claire.

Les perspectives d'évolution incluent l'ajout de Docker pour la conteneurisation, l'implémentation de tests automatisés et l'intégration d'outils de monitoring pour améliorer la robustesse et la maintenabilité de la plateforme. 