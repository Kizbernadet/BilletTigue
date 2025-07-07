# FICHE CHAPITRE 4 - ARCHITECTURE TECHNIQUE DE BILLETTIGUE

## 🟦 SECTION 1 – Modules fonctionnels

### Module 1 : Authentification et Gestion des Utilisateurs
- **Fonctionnalités principales** :
  - Inscription/Connexion multi-rôles (utilisateur, transporteur, admin)
  - Gestion des profils utilisateurs
  - Système de rôles et permissions
  - JWT pour l'authentification
  - Gestion des tokens révoqués
- **Acteurs concernés** : Passager, Transporteur, Admin
- **Interactions** : Base pour tous les autres modules

### Module 2 : Gestion des Trajets
- **Fonctionnalités principales** :
  - Création et gestion des trajets par les transporteurs
  - Recherche et filtrage de trajets
  - Gestion des zones desservies
  - Calcul des disponibilités
  - Option remboursable
- **Acteurs concernés** : Transporteur, Passager, Admin
- **Interactions** : Réservations, Colis, Statistiques

### Module 3 : Système de Réservation
- **Fonctionnalités principales** :
  - Réservation de places sur les trajets
  - Gestion des réservations (création, modification, annulation)
  - Réservation pour invités (sans compte)
  - Intégration paiement
  - Notifications automatiques
- **Acteurs concernés** : Passager, Transporteur, Admin
- **Interactions** : Trajets, Paiement, Notifications

### Module 4 : Gestion des Colis
- **Fonctionnalités principales** :
  - Enregistrement et suivi des colis
  - Calcul des frais de transport
  - Gestion des envois
  - Suivi de livraison
- **Acteurs concernés** : Passager, Transporteur, Admin
- **Interactions** : Trajets, Réservations, Notifications

### Module 5 : Système de Paiement
- **Fonctionnalités principales** :
  - Intégration paiement mobile (Orange Money, MTN Money, etc.)
  - Gestion des transactions
  - Historique des paiements
  - Remboursements
- **Acteurs concernés** : Passager, Transporteur, Admin
- **Interactions** : Réservations, Colis

### Module 6 : Administration et Statistiques
- **Fonctionnalités principales** :
  - Tableaux de bord transporteurs
  - Statistiques de vente et performance
  - Gestion des utilisateurs
  - Monitoring système
  - Rapports détaillés
- **Acteurs concernés** : Admin, Transporteur
- **Interactions** : Tous les modules

### Module 7 : Notifications
- **Fonctionnalités principales** :
  - Notifications par email/SMS
  - Alertes de réservation
  - Confirmations de paiement
  - Rappels de trajets
- **Acteurs concernés** : Tous les acteurs
- **Interactions** : Réservations, Paiements, Trajets

---

## 🟩 SECTION 2 – Architecture logicielle

### Modèle architectural utilisé
**Architecture 3 couches client-serveur avec pattern MVC**
- **Couche Présentation** : Applications clientes (Mobile Flutter, Web HTML/CSS/JS)
- **Couche Logique Métier** : API REST Node.js avec services et contrôleurs
- **Couche Données** : Base de données PostgreSQL avec ORM Sequelize

### Technologies frontend (mobile/web)
**Application Mobile (Flutter)**
- Flutter 3.7.2+ avec Dart
- Provider pour la gestion d'état
- HTTP pour les appels API
- SharedPreferences pour le stockage local
- Polices personnalisées (Comfortaa, Montserrat, Exo2)

**Application Web (HTML/CSS/JavaScript)**
- HTML5, CSS3, JavaScript ES6+
- Tailwind CSS pour le styling
- DaisyUI pour les composants
- Chart.js pour les graphiques
- Architecture modulaire avec séparation des responsabilités

### Technologies backend (API)
**Node.js + Express**
- Express 5.1.0 pour le serveur web
- JWT pour l'authentification
- bcrypt pour le hachage des mots de passe
- CORS pour la gestion des requêtes cross-origin
- Morgan pour les logs HTTP
- dotenv pour la gestion des variables d'environnement

### Base de données
**PostgreSQL + Sequelize ORM**
- PostgreSQL comme SGBD principal
- Sequelize 6.37.7 comme ORM
- Pool de connexions configuré
- Migrations et seeders pour la gestion des schémas
- Relations entre entités bien définies

### Services externes utilisés
- **Paiement mobile** : Intégration Orange Money, MTN Money
- **Email** : Service de notifications par email
- **SMS** : Service de notifications par SMS
- **Géolocalisation** : Pour la localisation des trajets (prévu)

---

## 🟧 SECTION 3 – Structure technique des modules

### Module Authentification
**Contrôleur** : `authController.js`
- **Fonctions/API exposées** :
  - `POST /api/auth/register-user` : Inscription utilisateur
  - `POST /api/auth/register-transporter` : Inscription transporteur
  - `POST /api/auth/register-admin` : Inscription admin
  - `POST /api/auth/login` : Connexion
  - `POST /api/auth/logout` : Déconnexion
- **Logique métier principale** : Gestion des comptes multi-rôles avec validation
- **Sécurité** : Hachage bcrypt, JWT, validation des données
- **Accès aux données** : Via `authService.js` et modèles Sequelize

### Module Trajets
**Contrôleur** : `trajetController.js`
- **Fonctions/API exposées** :
  - `GET /api/trajets` : Liste des trajets
  - `POST /api/trajets` : Création de trajet
  - `PUT /api/trajets/:id` : Modification de trajet
  - `DELETE /api/trajets/:id` : Suppression de trajet
- **Logique métier principale** : Gestion des trajets avec calculs de disponibilité
- **Sécurité** : Authentification transporteur, validation des données
- **Accès aux données** : Modèles `trajet.js`, `transporteur.js`, `zones_desservies.js`

### Module Réservation
**Contrôleur** : `reservationController.js`
- **Fonctions/API exposées** :
  - `POST /api/reservations` : Création de réservation
  - `GET /api/reservations` : Liste des réservations
  - `PUT /api/reservations/:id` : Modification de réservation
  - `DELETE /api/reservations/:id` : Annulation de réservation
- **Logique métier principale** : Gestion des réservations avec intégration paiement
- **Sécurité** : Authentification utilisateur, validation des places disponibles
- **Accès aux données** : Via `reservationService.js` et modèles associés

### Module Administration
**Contrôleur** : `adminController.js`
- **Fonctions/API exposées** :
  - `GET /api/admin/stats` : Statistiques générales
  - `GET /api/admin/users` : Gestion des utilisateurs
  - `GET /api/admin/transporters` : Gestion des transporteurs
- **Logique métier principale** : Tableaux de bord et gestion administrative
- **Sécurité** : Authentification admin, autorisation par rôle
- **Accès aux données** : Via `statsController.js` et modèles utilisateurs

### Module Profils
**Contrôleur** : `profileController.js`
- **Fonctions/API exposées** :
  - `GET /api/profile` : Récupération du profil
  - `PUT /api/profile` : Modification du profil
- **Logique métier principale** : Gestion des profils utilisateurs et transporteurs
- **Sécurité** : Authentification utilisateur, validation des données
- **Accès aux données** : Via `profileService.js` et modèles de profils

---

## 🟥 SECTION 4 – Diagrammes UML à générer

### Scénario 1 : Processus de réservation et paiement mobile
**Diagramme de séquence** montrant :
1. Connexion utilisateur
2. Recherche de trajets
3. Sélection et réservation
4. Intégration paiement mobile
5. Confirmation et notifications

### Scénario 2 : Processus d'envoi de colis
**Diagramme d'activité** illustrant :
1. Enregistrement du colis
2. Calcul des frais
3. Association au trajet
4. Suivi de livraison
5. Confirmation de réception

### Scénario 3 : Architecture système globale
**Diagramme de déploiement** montrant :
- Applications clientes (Mobile, Web, Admin)
- Serveur API Node.js
- Base de données PostgreSQL
- Services externes (Paiement, SMS, Email)

### Scénario 4 : Modèle de données
**Diagramme de classes** avec :
- Entités principales (Utilisateur, Transporteur, Trajet, Réservation, Colis)
- Relations entre entités
- Attributs et méthodes principales

### Scénario 5 : Flux d'authentification
**Diagramme de séquence** pour :
- Inscription multi-rôles
- Connexion avec JWT
- Gestion des sessions
- Déconnexion et révocation de tokens

---

## 🟨 SECTION 5 – Environnement et évolution

### Hébergement prévu
**Environnement de développement** :
- Serveur local avec Node.js
- Base de données PostgreSQL locale
- Applications clientes en développement

**Environnement de production** :
- VPS ou Cloud (AWS, DigitalOcean, OVH)
- Base de données PostgreSQL dédiée
- Load balancer pour la scalabilité

### Utilisation de conteneurs
**Docker** (recommandé pour la production) :
- Containerisation de l'API Node.js
- Container PostgreSQL
- Container Nginx pour le reverse proxy
- Docker Compose pour l'orchestration

### Outils CI/CD
**Pipeline de déploiement** :
- GitHub Actions pour l'intégration continue
- Tests automatisés avant déploiement
- Déploiement automatique sur staging/production
- Monitoring et alertes

### Idées d'évolution du système

#### Fonctionnalités avancées
- **Géolocalisation en temps réel** : Suivi GPS des véhicules
- **Système USSD** : Accès via codes USSD pour les utilisateurs sans smartphone
- **Support multilingue** : Interface en français, anglais, langues locales
- **Intelligence artificielle** : Prédiction des prix, optimisation des trajets

#### Améliorations techniques
- **API GraphQL** : Pour des requêtes plus flexibles
- **Microservices** : Séparation des modules en services indépendants
- **Cache Redis** : Pour améliorer les performances
- **WebSockets** : Notifications en temps réel

#### Intégrations externes
- **Cartes bancaires** : Support Visa, Mastercard
- **Réseaux sociaux** : Connexion via Facebook, Google
- **Système de fidélité** : Points et récompenses
- **Assurance voyage** : Intégration avec assureurs

#### Sécurité et conformité
- **Chiffrement end-to-end** : Pour les données sensibles
- **Audit trail** : Traçabilité complète des actions
- **RGPD** : Conformité européenne
- **Certification PCI DSS** : Pour les paiements

---

## 📋 RÉSUMÉ TECHNIQUE

**Architecture globale** : Application multi-plateforme avec API REST centralisée
**Stack technique** : Flutter (Mobile) + HTML/CSS/JS (Web) + Node.js/Express (Backend) + PostgreSQL (BDD)
**Patterns utilisés** : MVC, Repository, Service Layer, JWT Authentication
**Scalabilité** : Architecture modulaire permettant l'évolution horizontale
**Sécurité** : Multiples couches (JWT, bcrypt, validation, CORS, rôles)
**Évolutivité** : Structure modulaire facilitant l'ajout de nouvelles fonctionnalités 