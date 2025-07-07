# Chapitre 3 : Architecture Conceptuelle et Fonctionnelle de Billettigue

## 3.1 Introduction

Billettigue est une plateforme de billetterie et transport qui s'appuie sur une architecture moderne et évolutive. Ce chapitre présente l'architecture conceptuelle et fonctionnelle du système, détaillant les choix technologiques, les patterns architecturaux et l'organisation des composants.

## 3.2 Vision Architecturale Globale

### 3.2.1 Philosophie de l'Architecture

L'architecture de Billettigue repose sur les principes suivants :

- **Séparation des responsabilités** : Chaque composant a un rôle défini et limité
- **Modularité** : Le système est divisé en modules indépendants et réutilisables
- **Scalabilité** : L'architecture permet une évolution horizontale et verticale
- **Maintenabilité** : Le code est organisé pour faciliter la maintenance et l'évolution
- **Sécurité** : Multiples couches de sécurité intégrées à tous les niveaux

### 3.2.2 Architecture Multi-Plateforme

Billettigue adopte une approche multi-plateforme avec trois interfaces utilisateur distinctes :

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   APPLICATION   │    │   APPLICATION   │    │   APPLICATION   │
│     MOBILE      │    │      WEB        │    │   ADMINISTRATIF │
│   (Flutter)     │    │  (HTML/CSS/JS)  │    │   (Dashboard)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API REST      │
                    │   (Node.js)     │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   BASE DE       │
                    │   DONNÉES       │
                    │  (PostgreSQL)   │
                    └─────────────────┘
```

## 3.3 Architecture Conceptuelle

### 3.3.1 Modèle de Domaine

Le domaine métier de Billettigue est organisé autour de plusieurs entités principales :

#### **Entités Métier**

1. **Utilisateur** : Représente les clients de la plateforme
   - Attributs : identifiant, nom, prénom, email, téléphone, adresse
   - Comportements : réservation, consultation historique, gestion profil

2. **Transporteur** : Représente les entreprises de transport
   - Attributs : identifiant, nom entreprise, type véhicule, zones desservies
   - Comportements : création trajets, gestion réservations, suivi colis

3. **Trajet** : Représente un voyage proposé par un transporteur
   - Attributs : ville départ/arrivée, date/heure, prix, places disponibles
   - Comportements : réservation, mise à jour statut, calcul disponibilité

4. **Réservation** : Représente une réservation de place(s) sur un trajet
   - Attributs : trajet, passager(s), nombre places, montant, statut
   - Comportements : paiement, annulation, modification

5. **Colis** : Représente un envoi de marchandise
   - Attributs : poids, dimensions, type, valeur déclarée
   - Comportements : suivi, livraison, signature

#### **Relations Entre Entités**

```
Utilisateur (1:N) Réservation (N:1) Trajet (N:1) Transporteur
Utilisateur (1:N) Colis (N:1) Transporteur
Transporteur (1:N) ZonesDesservies
Trajet (1:N) Réservation (1:1) Paiement
```

### 3.3.2 Patterns Architecturaux

#### **Pattern MVC (Model-View-Controller)**

L'architecture suit le pattern MVC pour séparer les responsabilités :

- **Model** : Représente les données et la logique métier
- **View** : Interface utilisateur et présentation
- **Controller** : Gère les interactions et coordonne Model/View

#### **Pattern Repository**

Pour l'accès aux données, le pattern Repository est utilisé :

```javascript
// Exemple : UserRepository
class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }
  
  async create(userData) {
    return await User.create(userData);
  }
}
```

#### **Pattern Service Layer**

La logique métier est encapsulée dans des services :

```javascript
// Exemple : AuthService
class AuthService {
  async registerUser(data) {
    // Validation métier
    // Création compte
    // Génération token
    // Retour réponse
  }
}
```

## 3.4 Architecture Fonctionnelle

### 3.4.1 Couches Architecturales

L'architecture fonctionnelle de Billettigue est organisée en plusieurs couches :

#### **Couche Présentation (Tier 1)**

**Application Mobile (Flutter)**
- **Technologies** : Flutter 3.7.2+, Dart, Provider
- **Responsabilités** :
  - Interface utilisateur native
  - Gestion d'état avec Provider
  - Navigation fluide entre écrans
  - Communication avec l'API backend

**Application Web (HTML/CSS/JavaScript)**
- **Technologies** : HTML5, CSS3, JavaScript ES6+, Tailwind CSS
- **Responsabilités** :
  - Interface utilisateur responsive
  - Gestion des formulaires
  - Appels API REST
  - Validation côté client

**Dashboard Administratif**
- **Technologies** : HTML/CSS/JavaScript, Chart.js
- **Responsabilités** :
  - Tableaux de bord transporteurs
  - Statistiques et rapports
  - Gestion des utilisateurs
  - Monitoring système

#### **Couche Logique Métier (Tier 2)**

**Services Métier**
```javascript
// Structure des services
services/
├── authService.js          // Authentification et autorisation
├── reservationService.js   // Gestion des réservations
├── trajetService.js        // Gestion des trajets
├── notificationService.js  // Système de notifications
└── profileService.js       // Gestion des profils
```

**Contrôleurs**
```javascript
// Structure des contrôleurs
controllers/
├── authController.js       // Contrôleur authentification
├── reservationController.js // Contrôleur réservations
├── trajetController.js     // Contrôleur trajets
├── adminController.js      // Contrôleur administration
└── profileController.js    // Contrôleur profils
```

**Middlewares**
```javascript
// Middlewares de sécurité et validation
middlewares/
├── authMiddleware.js       // Authentification JWT
├── roleMiddleware.js       // Autorisation par rôle
└── validationMiddleware.js // Validation des données
```

#### **Couche Données (Tier 3)**

**Modèles de Données**
```javascript
// Modèles Sequelize
models/
├── role.js                 // Rôles utilisateurs
├── compte.js              // Comptes utilisateurs
├── utilisateur.js         // Profils utilisateurs
├── transporteur.js        // Profils transporteurs
├── trajet.js              // Trajets de transport
├── reservation.js         // Réservations
├── colis.js               // Gestion des colis
└── paiement.js            // Transactions
```

**Base de Données**
- **SGBD** : PostgreSQL 12+
- **ORM** : Sequelize 6.37.7
- **Migrations** : Gestion des versions de schéma
- **Seeders** : Données initiales

### 3.4.2 Communication Inter-Services

#### **API REST**

L'architecture utilise une API REST pour la communication entre les couches :

```javascript
// Endpoints principaux
POST   /api/auth/register-user      // Inscription utilisateur
POST   /api/auth/register-transporter // Inscription transporteur
POST   /api/auth/login              // Connexion
GET    /api/trajets                 // Liste trajets
POST   /api/reservations            // Créer réservation
GET    /api/admin/stats             // Statistiques admin
```

#### **Format des Réponses**

```javascript
// Réponse de succès
{
  "success": true,
  "data": { /* données */ },
  "message": "Opération réussie"
}

// Réponse d'erreur
{
  "success": false,
  "status": 400,
  "message": "Message d'erreur",
  "data": { /* détails */ }
}
```

### 3.4.3 Gestion de l'État

#### **Application Mobile**

L'état de l'application mobile est géré avec le pattern Provider :

```dart
// AuthController - Gestion de l'état d'authentification
class AuthController extends ChangeNotifier {
  User? _user;
  String? _token;
  bool _isLoading = false;
  
  // Getters
  User? get user => _user;
  bool get isAuthenticated => _user != null && _token != null;
  
  // Méthodes
  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();
    // Logique de connexion
    _isLoading = false;
    notifyListeners();
  }
}
```

#### **Application Web**

L'état de l'application web est géré avec le localStorage et sessionStorage :

```javascript
// Gestion du token d'authentification
const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

// Headers d'authentification
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

## 3.5 Sécurité et Authentification

### 3.5.1 Système d'Authentification

#### **JWT (JSON Web Tokens)**

L'authentification repose sur les JWT pour une approche stateless :

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

#### **Gestion des Rôles**

Le système implémente un système de rôles hiérarchique :

- **admin** : Accès complet au système
- **transporteur** : Gestion de ses trajets et colis
- **user** : Réservations et suivi de ses commandes

```javascript
// Middleware de vérification de rôle
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Accès refusé' });
  }
};
```

### 3.5.2 Sécurité des Données

#### **Hashage des Mots de Passe**

```javascript
// Hashage avec bcrypt
const hashedPassword = await bcrypt.hash(password, 10);

// Vérification
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### **Validation des Données**

```javascript
// Validation côté serveur
function validateReservationData(data) {
  if (!data.trajet_id || !data.passenger_name) {
    throw new Error('Champs obligatoires manquants');
  }
  // Autres validations...
}
```

## 3.6 Performance et Optimisation

### 3.6.1 Stratégies de Performance

#### **Chargement Asynchrone**

```dart
// Chargement parallèle des données
final results = await Future.wait([
  _dataService.getUser(),
  _dataService.getFeaturedEvents(),
  _dataService.getCategories(),
]);
```

#### **Mise en Cache**

```javascript
// Nettoyage automatique des tokens expirés
setInterval(cleanupExpiredTokens, 60 * 60 * 1000); // 1 heure
```

### 3.6.2 Optimisation Base de Données

#### **Indexation**

```sql
-- Index sur les colonnes fréquemment utilisées
CREATE INDEX idx_trajets_date_depart ON trajets(date_depart);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
```

#### **Requêtes Optimisées**

```javascript
// Requête avec includes pour éviter les N+1 queries
const trajet = await Trajet.findByPk(id, {
  include: [
    { model: Transporteur, as: 'transporteur' },
    { model: Reservation, as: 'reservations' }
  ]
});
```

## 3.7 Évolutivité et Maintenance

### 3.7.1 Architecture Évolutive

#### **Modularité**

L'architecture modulaire permet l'ajout de nouvelles fonctionnalités sans impact sur l'existant :

```javascript
// Ajout d'un nouveau service
services/
├── existingService.js
└── newFeatureService.js  // Nouveau service
```

#### **API Versioning**

```javascript
// Support de versions d'API
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
```

### 3.7.2 Tests et Qualité

#### **Organisation des Tests**

```
tests/
├── tests_effectues/     # Plans de test
│   ├── 01-TEST-AUTHENTIFICATION.md
│   ├── 02-TEST-GESTION-UTILISATEURS.md
│   └── 03-TEST-GESTION-COLIS.md
└── tests_rapports/      # Rapports de test
    └── RAPPORT-TEST-2024-12-14.md
```

#### **Couverture de Test**

- **Authentification** : 8 tests
- **Gestion utilisateurs** : 10 tests
- **Gestion colis** : 12 tests
- **Notifications** : 14 tests
- **Frontend** : 14 tests

## 3.8 Conclusion

L'architecture conceptuelle et fonctionnelle de Billettigue repose sur des principes solides de séparation des responsabilités, de modularité et de scalabilité. L'approche multi-plateforme avec une API REST centralisée permet une évolution indépendante des différentes interfaces utilisateur.

Les choix technologiques (Node.js, Flutter, PostgreSQL) et les patterns architecturaux (MVC, Repository, Service Layer) offrent une base robuste pour le développement et la maintenance du système.

L'architecture actuelle, bien que fonctionnelle, pourrait être améliorée en adoptant une approche 3-tiers plus pure, notamment en séparant complètement la logique métier des contrôleurs dans le backend.

Cette architecture constitue une base solide pour l'évolution future de la plateforme Billettigue, permettant l'ajout de nouvelles fonctionnalités tout en maintenant la qualité et la performance du système. 