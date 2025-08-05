# Schéma Modulaire des Composants BilletTigue

## Vue d'ensemble de l'Architecture

BilletTigue est une plateforme de transport et livraison modulaire composée de trois applications principales :

```
┌─────────────────────────────────────────────────────────────────┐
│                        BILLETTIGUE                              │
│                    Plateforme de Transport                      │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   BACKEND       │   FRONTEND WEB  │      FRONTEND MOBILE        │
│   (Node.js)     │   (HTML/CSS/JS) │        (Flutter)            │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

---

## 1. ARCHITECTURE BACKEND (Node.js/Express)

### 1.1 Structure Modulaire

```
backend/
├── 📁 config/           # Configuration (DB, connexions)
├── 📁 models/           # Modèles Sequelize (12 tables)
├── 📁 controllers/      # Contrôleurs métier (8 modules)
├── 📁 services/         # Services métier (4 modules)
├── 📁 routes/           # Routes API (8 modules)
├── 📁 middlewares/      # Middlewares (auth, roles)
├── 📁 migrations/       # Migrations DB
├── 📁 seeders/          # Données de test
├── 📁 utils/            # Utilitaires
└── 📁 tests/            # Tests automatisés
```

### 1.2 Couches d'Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 4: ROUTES                          │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │ authRoutes  │ trajetRoutes│profileRoutes│adminRoutes  │  │
│  │reservation  │  userRoutes │statsRoutes  │notification │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   LAYER 3: CONTROLLERS                      │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │authController│trajetCtrl  │profileCtrl  │adminCtrl    │  │
│  │reservationCtrl│statsCtrl  │userCtrl     │notification │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    LAYER 2: SERVICES                        │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │ authService │reservation  │profileService│notification│  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    LAYER 1: MODELS                          │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │   compte    │  utilisateur│ transporteur│administrateur│  │
│  │   trajet    │ reservation │   paiement  │    envoi    │  │
│  │    colis    │zones_desservies│revokedToken│   role     │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    LAYER 0: DATABASE                        │
│                    PostgreSQL (12 tables)                   │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Modules Principaux

#### 🔐 Module d'Authentification
- **Routes**: `/api/auth/*`
- **Contrôleur**: `authController.js`
- **Service**: `authService.js`
- **Fonctionnalités**:
  - Inscription (utilisateur, transporteur, admin)
  - Connexion avec JWT
  - Gestion des tokens (création, validation, révocation)
  - Nettoyage automatique des tokens expirés

#### 🚗 Module de Trajets
- **Routes**: `/api/trajets/*`
- **Contrôleur**: `trajetController.js`
- **Fonctionnalités**:
  - CRUD trajets
  - Recherche géolocalisée
  - Gestion des zones desservies
  - Validation des trajets

#### 📅 Module de Réservations
- **Routes**: `/api/reservations/*`
- **Contrôleur**: `reservationController.js`
- **Service**: `reservationService.js`
- **Fonctionnalités**:
  - Création/modification réservations
  - Gestion des statuts
  - Calcul des prix
  - Option remboursable

#### 👤 Module de Profils
- **Routes**: `/api/profile/*`
- **Contrôleur**: `profileController.js`
- **Service**: `profileService.js`
- **Fonctionnalités**:
  - Gestion des profils utilisateurs
  - Mise à jour des informations
  - Upload d'images

#### 🛡️ Module Administrateur
- **Routes**: `/api/admin/*`
- **Contrôleur**: `adminController.js`
- **Fonctionnalités**:
  - Gestion des transporteurs
  - Validation des comptes
  - Modération des trajets
  - Gestion des utilisateurs

#### 📊 Module de Statistiques
- **Routes**: `/api/stats/*`
- **Contrôleur**: `statsController.js`
- **Fonctionnalités**:
  - Statistiques globales
  - Statistiques par transporteur
  - Rapports de performance
  - Métriques temps réel

---

## 2. ARCHITECTURE FRONTEND WEB (HTML/CSS/JavaScript)

### 2.1 Structure Modulaire

```
web/
├── 📁 pages/            # Pages HTML (10 modules)
├── 📁 src/js/           # JavaScript modulaire (25+ modules)
│   ├── 📁 api/          # Services API
│   └── 📁 components/   # Composants UI
├── 📁 public/           # Assets statiques
│   ├── 📁 assets/css/   # Styles CSS
│   └── 📁 images/       # Images et logos
└── 📁 docs/             # Documentation
```

### 2.2 Architecture JavaScript

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 3: PAGES                           │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │   index     │    login    │  register   │   profile   │  │
│  │search-trajets│reservation │admin-dashboard│transporter │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   LAYER 2: SERVICES                         │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │ authApi     │ trajetApi   │profileApi   │adminApi     │  │
│  │reservationApi│statsApi    │notificationApi│userApi    │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   LAYER 1: MANAGERS                         │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │auth-state   │profile-menu │admin-stats  │transporter  │  │
│  │search-trajets│reservation │trajet-mgmt  │secure-logout│  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   LAYER 0: UTILS                            │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │auth-protection│auth-redirect│login-redirect│modal-steps│  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Modules Principaux

#### 🔐 Module d'Authentification
- **Fichiers**: `auth.js`, `auth-state-manager.js`, `auth-protection.js`
- **Fonctionnalités**:
  - Gestion de l'état d'authentification
  - Protection des routes
  - Redirection automatique
  - Gestion des tokens JWT

#### 🚗 Module de Recherche de Trajets
- **Fichiers**: `search-trajets.js`, `trajets-api-simple.js`
- **Fonctionnalités**:
  - Recherche géolocalisée
  - Filtres avancés
  - Affichage des résultats
  - Modal de détails

#### 📅 Module de Réservations
- **Fichiers**: `reservation.js`, `modal-steps.js`
- **Fonctionnalités**:
  - Processus de réservation en étapes
  - Calcul des prix
  - Gestion des options
  - Confirmation

#### 👤 Module de Profil
- **Fichiers**: `profile.js`, `profile-menu.js`, `profile-display.js`
- **Fonctionnalités**:
  - Menu profil global
  - Affichage des informations
  - Modification des données
  - Upload d'images

#### 🛡️ Module Administrateur
- **Fichiers**: `admin-dashboard.js`, `admin-stats-manager.js`
- **Fonctionnalités**:
  - Tableau de bord admin
  - Statistiques en temps réel
  - Gestion des transporteurs
  - Modération

#### 🚛 Module Transporteur
- **Fichiers**: `transporter-dashboard.js`, `transporter-stats-manager.js`
- **Fonctionnalités**:
  - Dashboard transporteur
  - Gestion des trajets
  - Statistiques personnelles
  - Réservations reçues

---

## 3. ARCHITECTURE FRONTEND MOBILE (Flutter)

### 3.1 Structure Modulaire

```
mobile/lib/
├── 📁 screens/          # Écrans (9 modules)
│   └── 📁 auth/         # Écrans d'authentification
├── 📁 services/         # Services (5 modules)
├── 📁 models/           # Modèles de données (5 modules)
├── 📁 controllers/      # Contrôleurs (1 module)
├── 📁 widgets/          # Widgets réutilisables
├── 📁 constants/        # Constantes (API, couleurs)
├── 📁 utils/            # Utilitaires
└── 📁 fonts/            # Polices personnalisées
```

### 3.2 Architecture Flutter

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 3: SCREENS                         │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │   splash    │ onboarding  │    home     │   trajets   │  │
│  │    auth     │   profile   │  tickets    │  parcels    │  │
│  │  history    │             │             │             │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   LAYER 2: SERVICES                         │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │ authService │trajetService│dataService  │navigation   │  │
│  │onboarding   │             │             │             │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   LAYER 1: MODELS                           │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │     user    │   trajet    │   event     │  category   │  │
│  │authResponse │             │             │             │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   LAYER 0: WIDGETS                          │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │customButton │             │             │             │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Modules Principaux

#### 🔐 Module d'Authentification
- **Écrans**: `login_screen.dart`, `register_screen.dart`
- **Service**: `auth_service.dart`
- **Modèle**: `auth_response.dart`
- **Fonctionnalités**:
  - Connexion/Inscription
  - Gestion des tokens
  - Validation des formulaires

#### 🚗 Module de Trajets
- **Écran**: `trajets_screen.dart`
- **Service**: `trajet_service.dart`
- **Modèle**: `trajet_model.dart`
- **Fonctionnalités**:
  - Affichage des trajets
  - Recherche et filtres
  - Réservation

#### 🏠 Module d'Accueil
- **Écran**: `home_screen.dart`
- **Fonctionnalités**:
  - Dashboard principal
  - Navigation vers les modules
  - Statistiques rapides

#### 📱 Module d'Onboarding
- **Écran**: `onboarding_screen.dart`
- **Service**: `onboarding_service.dart`
- **Fonctionnalités**:
  - Introduction à l'app
  - Configuration initiale
  - Tutoriel utilisateur

---

## 4. FLUX DE DONNÉES INTER-MODULES

### 4.1 Flux d'Authentification

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│   Backend   │───▶│  Database   │
│  (Web/Mob)  │    │   Auth API  │    │   Users     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ JWT Token   │◀───│ Token Gen   │◀───│ Validation  │
│ Storage     │    │ & Response  │    │ & Creation  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 4.2 Flux de Réservation

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───▶│ Reservation │───▶│  Trajet     │
│  Interface  │    │   Service   │    │ Validation  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Confirmation│◀───│ Payment     │◀───│ Price Calc  │
│ & Notify    │    │ Processing  │    │ & Availability│
└─────────────┘    └─────────────┘    └─────────────┘
```

### 4.3 Flux Administrateur

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Admin Panel │───▶│ Admin API   │───▶│ Statistics  │
│   (Web)     │    │ Controller  │    │ Collection  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Real-time   │◀───│ Data        │◀───│ Database    │
│ Updates     │    │ Processing  │    │ Aggregation │
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## 5. INTERFACES ET CONTRACTS

### 5.1 APIs REST

#### Authentification
```
POST   /api/auth/register-user
POST   /api/auth/register-transporter
POST   /api/auth/register-admin
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
```

#### Trajets
```
GET    /api/trajets
GET    /api/trajets/:id
POST   /api/trajets
PUT    /api/trajets/:id
DELETE /api/trajets/:id
GET    /api/trajets/search
```

#### Réservations
```
GET    /api/reservations
GET    /api/reservations/:id
POST   /api/reservations
PUT    /api/reservations/:id
DELETE /api/reservations/:id
```

#### Administration
```
GET    /api/admin/transporters
PUT    /api/admin/transporters/:id/validate
GET    /api/admin/users
GET    /api/admin/stats
```

### 5.2 Modèles de Données

#### Utilisateur
```javascript
{
  id: number,
  email: string,
  nom: string,
  prenom: string,
  telephone: string,
  role: 'user' | 'transporter' | 'admin',
  statut: 'actif' | 'inactif' | 'en_attente'
}
```

#### Trajet
```javascript
{
  id: number,
  transporteur_id: number,
  depart: string,
  arrivee: string,
  date_depart: Date,
  prix: number,
  places_disponibles: number,
  statut: 'disponible' | 'complet' | 'annule'
}
```

#### Réservation
```javascript
{
  id: number,
  utilisateur_id: number,
  trajet_id: number,
  statut: 'confirmee' | 'en_attente' | 'annulee',
  prix_paye: number,
  option_remboursable: boolean
}
```

---

## 6. SÉCURITÉ ET MIDDLEWARES

### 6.1 Middlewares de Sécurité

```
┌─────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE STACK                         │
├─────────────────────────────────────────────────────────────┤
│ 1. CORS Configuration                                       │
│ 2. JSON Body Parser                                         │
│ 3. Morgan (Logging)                                         │
│ 4. Authentication Middleware                                │
│ 5. Role-based Authorization                                 │
│ 6. Rate Limiting                                            │
│ 7. Error Handling                                           │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Gestion des Rôles

- **User**: Lecture trajets, création réservations, gestion profil
- **Transporter**: CRUD trajets, gestion réservations, statistiques
- **Admin**: Accès complet, modération, gestion utilisateurs

---

## 7. PERFORMANCE ET OPTIMISATION

### 7.1 Stratégies de Performance

#### Backend
- **Connection Pooling**: Gestion optimisée des connexions DB
- **Query Optimization**: Index sur les colonnes fréquemment utilisées
- **Caching**: Mise en cache des données statiques
- **Token Cleanup**: Nettoyage automatique des tokens expirés

#### Frontend Web
- **Lazy Loading**: Chargement différé des modules
- **Bundle Splitting**: Séparation des bundles par fonctionnalité
- **Image Optimization**: Compression et formats optimisés
- **Service Workers**: Cache des ressources statiques

#### Frontend Mobile
- **State Management**: Provider pour la gestion d'état
- **Image Caching**: Cache des images et ressources
- **API Caching**: Mise en cache des réponses API
- **Background Sync**: Synchronisation en arrière-plan

---

## 8. DÉPLOIEMENT ET ENVIRONNEMENTS

### 8.1 Configuration par Environnement

```
┌─────────────────┬─────────────────┬─────────────────┐
│   DEVELOPMENT   │    STAGING      │   PRODUCTION    │
├─────────────────┼─────────────────┼─────────────────┤
│ localhost:3000  │ staging-api.com │ api.billet.com  │
│ localhost:3000  │ staging-web.com │ www.billet.com  │
│ localhost:8080  │ staging-mob.com │ app.billet.com  │
└─────────────────┴─────────────────┴─────────────────┘
```

### 8.2 Variables d'Environnement

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=billettigue
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# Admin Setup
ADMIN_EMAIL=admin@billet.com
ADMIN_PWD=admin123
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User
```

---

## 9. MONITORING ET LOGS

### 9.1 Logs Structurés

```javascript
// Format de log standardisé
{
  timestamp: "2024-01-15T10:30:00Z",
  level: "info",
  module: "auth-service",
  action: "user-login",
  userId: 123,
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  duration: 150,
  success: true
}
```

### 9.2 Métriques Clés

- **Performance**: Temps de réponse API, throughput
- **Business**: Nombre de réservations, revenus, utilisateurs actifs
- **Technique**: Taux d'erreur, disponibilité, utilisation ressources
- **Sécurité**: Tentatives de connexion échouées, tokens expirés

---

## 10. ÉVOLUTIVITÉ ET MAINTENANCE

### 10.1 Principes d'Évolutivité

1. **Modularité**: Chaque module est indépendant et réutilisable
2. **Scalabilité**: Architecture horizontale possible
3. **Maintenabilité**: Code documenté et structuré
4. **Testabilité**: Tests unitaires et d'intégration
5. **Flexibilité**: Configuration par environnement

### 10.2 Stratégies de Migration

- **Base de données**: Migrations Sequelize versionnées
- **API**: Versioning des endpoints
- **Frontend**: Déploiement progressif
- **Mobile**: Mise à jour via stores

---

*Ce schéma modulaire représente l'architecture complète de BilletTigue, montrant la séparation claire des responsabilités et la modularité de chaque composant.* 