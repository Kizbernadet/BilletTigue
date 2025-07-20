# 📁 Fichiers Liés à la Réservation - Billettigue

## 🏗️ **ARCHITECTURE COMPLÈTE**

### **1. BACKEND - Modèles de Données**

#### **📊 Modèle Reservation**
- **Fichier** : `backend/models/reservation.js`
- **Rôle** : Définition du modèle de données pour les réservations
- **Champs** : id, reservation_date, passenger_first_name, passenger_last_name, phone_number, status, seats_reserved, refundable_option, refund_supplement_amount, total_amount, trajet_id, compte_id
- **Relations** : belongsTo(Trajet), belongsTo(Compte), hasOne(Paiement)

#### **💰 Modèle Paiement**
- **Fichier** : `backend/models/paiement.js`
- **Rôle** : Définition du modèle de données pour les paiements
- **Champs** : id, amount, status, payment_date, reservation_id
- **Relations** : belongsTo(Reservation)

#### **🔗 Relations des Modèles**
- **Fichier** : `backend/models/index.js`
- **Rôle** : Définition des associations entre modèles
- **Relations** : Reservation ↔ Paiement (1:1), Reservation ↔ Trajet (N:1), Reservation ↔ Compte (N:1)

---

### **2. BACKEND - Logique Métier**

#### **🎯 Service de Réservation**
- **Fichier** : `backend/services/reservationService.js`
- **Rôle** : Logique métier pour la gestion des réservations
- **Fonctions principales** :
  - `createReservation(data, userId)` - Créer réservation utilisateur
  - `createGuestReservation(data)` - Créer réservation invité
  - `getUserReservations(userId, query)` - Lister réservations utilisateur
  - `getReservationById(id, userId)` - Détails d'une réservation
  - `cancelReservation(id, userId)` - Annuler réservation
  - `confirmPayment(id, userId, paymentData)` - Confirmer paiement
  - `getReservationStats(userId, role, filters)` - Statistiques

#### **🎮 Contrôleur de Réservation**
- **Fichier** : `backend/controllers/reservationController.js`
- **Rôle** : Gestion des requêtes HTTP pour les réservations
- **Endpoints** :
  - `createReservation` - POST /api/reservations
  - `createGuestReservation` - POST /api/reservations/guest
  - `getMyReservations` - GET /api/reservations
  - `getReservationById` - GET /api/reservations/:id
  - `cancelReservation` - PUT /api/reservations/:id/cancel
  - `confirmPayment` - PUT /api/reservations/:id/confirm-payment

#### **🛣️ Routes de Réservation**
- **Fichier** : `backend/routes/reservationRoutes.js`
- **Rôle** : Définition des endpoints API pour les réservations
- **Routes principales** :
  - `POST /api/reservations` - Réservation utilisateur (protégée)
  - `POST /api/reservations/guest` - Réservation invité (publique)
  - `GET /api/reservations` - Mes réservations (protégée)
  - `GET /api/reservations/:id` - Détails réservation (protégée)
  - `PUT /api/reservations/:id/cancel` - Annuler réservation (protégée)
  - `PUT /api/reservations/:id/confirm-payment` - Confirmer paiement (protégée)
  - `GET /api/reservations/stats/overview` - Statistiques (protégée)
  - `GET /api/reservations/admin/all` - Toutes réservations (admin)
  - `PUT /api/reservations/admin/:id/status` - Modifier statut (admin)

#### **📊 Contrôleur de Statistiques**
- **Fichier** : `backend/controllers/statsController.js`
- **Rôle** : Statistiques incluant les réservations et paiements
- **Fonctions** : Calculs de revenus, statistiques par période

---

### **3. BACKEND - Migrations et Base de Données**

#### **🔄 Migration Option Remboursable**
- **Fichier** : `backend/migrations/add-refundable-option.js`
- **Rôle** : Migration pour ajouter les champs option remboursable
- **Modifications** : Ajout de refundable_option, refund_supplement_amount, total_amount

#### **🔧 Configuration Serveur**
- **Fichier** : `backend/server.js`
- **Rôle** : Intégration des routes de réservation
- **Ligne** : `app.use('/api/reservations', require('./routes/reservationRoutes'));`

---

### **4. FRONTEND - Interface Utilisateur**

#### **📄 Page de Réservation**
- **Fichier** : `web/pages/reservation.html`
- **Rôle** : Interface utilisateur pour la réservation
- **Fonctionnalités** :
  - Formulaire de réservation
  - Détails du trajet
  - Calcul du prix
  - Options remboursables
  - Modal d'authentification
  - Modal de succès

#### **🎨 Styles de Réservation**
- **Fichier** : `web/public/assets/css/reservation.css`
- **Rôle** : Styles CSS pour la page de réservation
- **Contenu** : 37KB, 2102 lignes de styles

#### **⚡ JavaScript de Réservation**
- **Fichier** : `web/src/js/reservation.js`
- **Rôle** : Logique frontend pour la réservation
- **Fonctionnalités** :
  - Gestion du formulaire
  - Validation des données
  - Appels API
  - Gestion des modes invité/utilisateur
  - Génération QR code
  - Modales et notifications

---

### **5. FRONTEND - APIs et Services**

#### **🌐 Configuration API**
- **Fichier** : `web/src/js/api/config.js`
- **Rôle** : Configuration des appels API
- **Fonctions** : getAuthHeaders, handleApiError, apiRequest

#### **🔧 Configuration Développement**
- **Fichier** : `web/src/js/api/config.dev.js`
- **Rôle** : Configuration spécifique au développement
- **URL** : `http://localhost:5000/api`

#### **🚌 API des Trajets**
- **Fichier** : `web/src/js/api/trajetsApi.js`
- **Rôle** : Appels API pour les trajets
- **Fonction** : `getTrajetById(id)` - Utilisée dans la réservation

---

### **6. FRONTEND - Utilitaires et Gestion**

#### **🔐 Utilitaires d'Authentification**
- **Fichier** : `web/src/js/login-redirect-utils.js`
- **Rôle** : Gestion de l'authentification et redirections
- **Utilisé dans** : Réservation pour vérifier l'état de connexion

#### **👤 Gestion du Profil**
- **Fichier** : `web/src/js/profile-menu.js`
- **Rôle** : Menu profil utilisateur
- **Utilisé dans** : Réservation pour afficher les infos utilisateur

#### **🔒 Gestion de l'État d'Authentification**
- **Fichier** : `web/src/js/auth-state-manager.js`
- **Rôle** : Gestion de l'état de connexion
- **Utilisé dans** : Réservation pour détecter le mode utilisateur/invité

---

### **7. DOCUMENTATION ET ANALYSES**

#### **📋 Analyse du Processus**
- **Fichier** : `ANALYSE_PROCESSUS_RESERVATION.md`
- **Rôle** : Documentation complète du processus de réservation
- **Contenu** : Architecture, flux, modèles, services

#### **🔄 Diagramme de Flux**
- **Fichier** : `DIAGRAMME_FLUX_RESERVATION.md`
- **Rôle** : Diagrammes ASCII des flux de réservation
- **Contenu** : Flux utilisateur connecté et invité

#### **🧪 Guide de Test**
- **Fichier** : `GUIDE_TEST_RESERVATION_INVITE.md`
- **Rôle** : Guide de test pour les réservations invité
- **Contenu** : Tests Postman, exemples de requêtes

---

### **8. FICHIERS DE TEST**

#### **🧪 Tests de Réservation**
- **Fichier** : `test-reservation-backend.js`
- **Rôle** : Tests complets du backend de réservation
- **Tests** : Réservation invité, utilisateur, annulation, statistiques

#### **🔍 Tests de Réservation Simple**
- **Fichier** : `test-reservation-simple.js`
- **Rôle** : Tests simples de réservation
- **Tests** : Réservation invité basique

#### **📡 Tests de Réservation Fetch**
- **Fichier** : `test-reservation-fetch.js`
- **Rôle** : Tests avec fetch API
- **Tests** : Validation, erreurs, cas limites

#### **👤 Tests de Réservation Invité**
- **Fichier** : `test-guest-reservation.js`
- **Rôle** : Tests spécifiques aux réservations invité
- **Tests** : Création, validation, erreurs

#### **🔗 Test de Connexion**
- **Fichier** : `test-reservation-connection.html`
- **Rôle** : Interface de test de la connexion front-back
- **Tests** : Connectivité, routes, réservations

---

### **9. FICHIERS ASSOCIÉS**

#### **📊 Modèle Trajet**
- **Fichier** : `backend/models/trajet.js`
- **Rôle** : Modèle des trajets (lié aux réservations)
- **Relation** : hasMany(Reservation)

#### **👤 Modèle Compte**
- **Fichier** : `backend/models/compte.js`
- **Rôle** : Modèle des comptes utilisateurs (lié aux réservations)
- **Relation** : hasMany(Reservation)

#### **🚌 Modèle Transporteur**
- **Fichier** : `backend/models/transporteur.js`
- **Rôle** : Modèle des transporteurs (lié aux trajets)
- **Relation** : hasMany(Trajet) → hasMany(Reservation)

---

## 📊 **STATISTIQUES DES FICHIERS**

### **Taille des Fichiers Principaux**
- `web/src/js/reservation.js` : **44KB** (1154 lignes)
- `web/public/assets/css/reservation.css` : **37KB** (2102 lignes)
- `web/pages/reservation.html` : **33KB** (586 lignes)
- `backend/services/reservationService.js` : **~25KB** (estimation)
- `backend/routes/reservationRoutes.js` : **~15KB** (estimation)

### **Répartition par Type**
- **Backend** : 8 fichiers (modèles, services, contrôleurs, routes)
- **Frontend** : 6 fichiers (HTML, CSS, JS, APIs)
- **Documentation** : 4 fichiers (analyses, guides, diagrammes)
- **Tests** : 5 fichiers (tests backend et frontend)
- **Total** : **23 fichiers** liés à la réservation

---

## 🔗 **RELATIONS ENTRE FICHIERS**

```
📁 BACKEND
├── 📊 Modèles
│   ├── reservation.js ← Paiement, Trajet, Compte
│   ├── paiement.js ← Reservation
│   └── index.js ← Relations
├── 🎯 Services
│   └── reservationService.js ← Logique métier
├── 🎮 Contrôleurs
│   ├── reservationController.js ← HTTP requests
│   └── statsController.js ← Statistiques
├── 🛣️ Routes
│   └── reservationRoutes.js ← Endpoints API
└── 🔧 Configuration
    └── server.js ← Intégration routes

📁 FRONTEND
├── 📄 Pages
│   └── reservation.html ← Interface utilisateur
├── 🎨 Styles
│   └── reservation.css ← Styles CSS
├── ⚡ JavaScript
│   ├── reservation.js ← Logique frontend
│   ├── api/config.js ← Configuration API
│   └── api/config.dev.js ← Config développement
└── 🔧 Utilitaires
    ├── login-redirect-utils.js ← Auth
    ├── profile-menu.js ← Profil
    └── auth-state-manager.js ← État auth

📁 TESTS
├── test-reservation-backend.js
├── test-reservation-simple.js
├── test-reservation-fetch.js
├── test-guest-reservation.js
└── test-reservation-connection.html

📁 DOCUMENTATION
├── ANALYSE_PROCESSUS_RESERVATION.md
├── DIAGRAMME_FLUX_RESERVATION.md
└── GUIDE_TEST_RESERVATION_INVITE.md
```

---

## ✅ **CONCLUSION**

Le système de réservation de Billettigue est **très bien structuré** avec :

- **23 fichiers** dédiés à la réservation
- **Architecture en couches** claire (modèles, services, contrôleurs, routes)
- **Séparation frontend/backend** bien définie
- **Documentation complète** avec analyses et guides
- **Tests exhaustifs** pour tous les cas d'usage
- **Gestion des deux modes** (utilisateur connecté et invité)

La connexion front-back fonctionne correctement avec des **endpoints API bien définis** et une **gestion d'erreurs robuste**. 