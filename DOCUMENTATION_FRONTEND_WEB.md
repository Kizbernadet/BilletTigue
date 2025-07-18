# Documentation Frontend Web - Billettigue

## Vue d'ensemble

Le frontend web de Billettigue est une **application web moderne** développée avec **HTML5**, **CSS3** et **JavaScript vanilla**, utilisant **Tailwind CSS** pour le styling et **DaisyUI** pour les composants. Elle suit une architecture modulaire avec une séparation claire entre les pages, les scripts et les styles.

### Technologies utilisées

- **HTML5** : Structure des pages
- **CSS3** : Styling avec Tailwind CSS
- **JavaScript ES6+** : Logique métier et interactions
- **Tailwind CSS 3.4.1** : Framework CSS utilitaire
- **DaisyUI 4.7.2** : Composants UI prêts à l'emploi
- **PostCSS** : Traitement CSS avancé
- **Autoprefixer** : Compatibilité navigateurs

---

## Architecture du projet

### Structure des dossiers

```
web/
├── pages/                    # Pages HTML
│   ├── login.html           # Page de connexion
│   ├── register.html        # Page d'inscription
│   ├── search-trajets.html  # Recherche de trajets
│   ├── reservation.html     # Réservation de trajets
│   ├── profile.html         # Profil utilisateur
│   ├── user-dashboard.html  # Dashboard utilisateur
│   ├── transporter-dashboard.html # Dashboard transporteur
│   ├── transporter-dashboard-trips.html # Gestion trajets
│   ├── admin-dashboard.html # Dashboard administrateur
│   └── admin-dashboard-transporter.html # Gestion transporteurs
├── src/                     # Code source
│   ├── js/                  # Scripts JavaScript
│   │   ├── api/            # Services API
│   │   │   ├── authApi.js
│   │   │   ├── profileApi.js
│   │   │   ├── trajetsApi.js
│   │   │   ├── trajetApi.js
│   │   │   ├── statsApi.js
│   │   │   ├── config.js
│   │   │   └── config.dev.js
│   │   ├── auth.js         # Gestion authentification
│   │   ├── main.js         # Script principal
│   │   ├── profile.js      # Gestion profil
│   │   ├── dashboard.js    # Dashboard utilisateur
│   │   ├── reservation.js  # Gestion réservations
│   │   ├── search-trajets.js # Recherche trajets
│   │   ├── admin-dashboard.js # Dashboard admin
│   │   ├── admin-dashboard-transporter.js # Gestion transporteurs
│   │   ├── transporter-dashboard.js # Dashboard transporteur
│   │   ├── trajet-management.js # Gestion trajets
│   │   ├── admin-stats-manager.js # Statistiques admin
│   │   ├── auth-state-manager.js # État authentification
│   │   ├── auth-protection.js # Protection des pages
│   │   ├── auth-redirect-utils.js # Utilitaires redirection
│   │   ├── login-redirect-utils.js # Redirection connexion
│   │   ├── profile-menu.js # Menu profil
│   │   ├── profile-dropdown.js # Dropdown profil
│   │   ├── profile-display.js # Affichage profil
│   │   ├── profile-button-enhancer.js # Amélioration bouton profil
│   │   ├── profile-menu-effects.js # Effets menu profil
│   │   ├── global-profile-injector.js # Injection globale profil
│   │   ├── secure-logout.js # Déconnexion sécurisée
│   │   ├── trajets-modal.js # Modales trajets
│   │   ├── trajets-api-simple.js # API trajets simplifiée
│   │   ├── trajets-management.js # Gestion trajets
│   │   ├── modal-steps.js # Étapes modales
│   │   └── transporter-stats-manager.js # Stats transporteur
│   └── css/                 # Styles source
│       ├── style.css       # Styles globaux
│       ├── auth.css        # Styles authentification
│       ├── dashboard.css   # Styles dashboard
│       └── trajet.css      # Styles trajets
├── public/                  # Fichiers publics
│   ├── assets/             # Assets compilés
│   │   ├── css/           # CSS compilé
│   │   └── images/        # Images
│   └── images/             # Images
├── index.html              # Page d'accueil
├── package.json            # Configuration projet
├── tailwind.config.js      # Configuration Tailwind
├── postcss.config.js       # Configuration PostCSS
└── docs/                   # Documentation
```

---

## Configuration et démarrage

### Installation des dépendances

```bash
cd web
npm install
```

### Scripts disponibles

```json
{
  "build": "tailwindcss -i ./src/css/style.css -o ./public/assets/css/style.css && tailwindcss -i ./src/css/auth.css -o ./public/assets/css/auth.css && tailwindcss -i ./src/css/dashboard.css -o ./public/assets/css/dashboard.css && tailwindcss -i ./src/css/trajet.css -o ./public/assets/css/trajet.css",
  "watch": "tailwindcss -i ./src/css/style.css -o ./public/assets/css/style.css --watch & tailwindcss -i ./src/css/auth.css -o ./public/assets/css/auth.css --watch & tailwindcss -i ./src/css/dashboard.css -o ./public/assets/css/dashboard.css --watch & tailwindcss -i ./src/css/trajet.css -o ./public/assets/css/trajet.css --watch"
}
```

### Compilation des styles

```bash
# Compilation unique
npm run build

# Compilation en mode watch
npm run watch
```

### Configuration Tailwind CSS

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.html",
    "./src/**/*.js",
    "./index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
}
```

---

## Pages principales

### 1. Page d'accueil (`index.html`)

**Fonctionnalités** :
- Présentation de la plateforme
- Navigation vers les différentes sections
- Boutons d'action (connexion, inscription)

**Composants** :
- Header avec navigation
- Section hero avec call-to-action
- Section fonctionnalités
- Footer

### 2. Page de connexion (`pages/login.html`)

**Fonctionnalités** :
- Formulaire de connexion
- Choix du type d'utilisateur (utilisateur/transporteur)
- Validation des champs
- Redirection après connexion

**Scripts associés** :
- `auth.js` : Gestion de l'authentification
- `auth-state-manager.js` : État de l'authentification

### 3. Page d'inscription (`pages/register.html`)

**Fonctionnalités** :
- Formulaire d'inscription
- Choix du type de compte
- Validation des données
- Création de compte

**Types de comptes** :
- Utilisateur standard
- Transporteur
- Administrateur

### 4. Page de recherche de trajets (`pages/search-trajets.html`)

**Fonctionnalités** :
- Formulaire de recherche avancée
- Filtres (ville, date, prix)
- Affichage des résultats
- Tri et pagination

**Scripts associés** :
- `search-trajets.js` : Logique de recherche
- `trajetsApi.js` : API des trajets

### 5. Page de réservation (`pages/reservation.html`)

**Fonctionnalités** :
- Sélection de trajet
- Formulaire de réservation
- Options remboursables
- Confirmation et paiement

**Scripts associés** :
- `reservation.js` : Gestion des réservations
- `modal-steps.js` : Étapes de réservation

### 6. Dashboard utilisateur (`pages/user-dashboard.html`)

**Fonctionnalités** :
- Vue d'ensemble des réservations
- Historique des trajets
- Gestion du profil
- Notifications

**Scripts associés** :
- `dashboard.js` : Logique du dashboard
- `profile.js` : Gestion du profil

### 7. Dashboard transporteur (`pages/transporter-dashboard.html`)

**Fonctionnalités** :
- Vue d'ensemble des trajets
- Statistiques de transport
- Gestion des réservations
- Profil transporteur

**Scripts associés** :
- `transporter-dashboard.js` : Dashboard transporteur
- `transporter-stats-manager.js` : Statistiques

### 8. Gestion des trajets transporteur (`pages/transporter-dashboard-trips.html`)

**Fonctionnalités** :
- Création de nouveaux trajets
- Modification des trajets existants
- Gestion des réservations
- Statistiques détaillées

**Scripts associés** :
- `trajet-management.js` : Gestion des trajets
- `trajets-management.js` : Logique avancée

### 9. Dashboard administrateur (`pages/admin-dashboard.html`)

**Fonctionnalités** :
- Vue d'ensemble de la plateforme
- Statistiques globales
- Gestion des utilisateurs
- Gestion des transporteurs

**Scripts associés** :
- `admin-dashboard.js` : Dashboard admin
- `admin-stats-manager.js` : Statistiques admin

### 10. Gestion des transporteurs admin (`pages/admin-dashboard-transporter.html`)

**Fonctionnalités** :
- Liste des transporteurs
- Création de comptes transporteur
- Modification des profils
- Statistiques par transporteur

**Scripts associés** :
- `admin-dashboard-transporter.js` : Gestion transporteurs

---

## Services API

### 1. Service d'authentification (`src/js/api/authApi.js`)

**Fonctions principales** :
- `loginUser(credentials)` : Connexion utilisateur
- `loginTransporter(credentials)` : Connexion transporteur
- `registerUser(data)` : Inscription utilisateur
- `registerTransporter(data)` : Inscription transporteur
- `logout()` : Déconnexion
- `verifyToken()` : Vérification token

### 2. Service de profil (`src/js/api/profileApi.js`)

**Fonctions principales** :
- `getProfile()` : Récupération profil
- `updateProfile(data)` : Mise à jour profil
- `changePassword(data)` : Changement mot de passe

### 3. Service des trajets (`src/js/api/trajetsApi.js`)

**Fonctions principales** :
- `getTrajets(filters)` : Liste des trajets
- `getTrajetById(id)` : Détails d'un trajet
- `searchTrajets(criteria)` : Recherche de trajets
- `createTrajet(data)` : Création de trajet
- `updateTrajet(id, data)` : Modification de trajet
- `deleteTrajet(id)` : Suppression de trajet

### 4. Service de réservations (`src/js/api/trajetApi.js`)

**Fonctions principales** :
- `createReservation(data)` : Création réservation
- `getReservations()` : Mes réservations
- `cancelReservation(id)` : Annulation réservation

### 5. Service de statistiques (`src/js/api/statsApi.js`)

**Fonctions principales** :
- `getDashboardStats()` : Stats dashboard
- `getReservationStats()` : Stats réservations
- `getRevenueStats()` : Stats revenus
- `getUserStats()` : Stats utilisateurs

### 6. Configuration API (`src/js/api/config.js`)

**Configuration** :
- URL de base de l'API
- Headers par défaut
- Gestion des erreurs
- Intercepteurs de requêtes

---

## Gestion de l'état

### 1. Gestionnaire d'état d'authentification (`auth-state-manager.js`)

**Fonctionnalités** :
- Stockage du token JWT
- Gestion de l'état de connexion
- Synchronisation entre onglets
- Persistance des données

**Méthodes principales** :
- `setAuthState(token, user)` : Définir l'état
- `getAuthState()` : Récupérer l'état
- `clearAuthState()` : Effacer l'état
- `isAuthenticated()` : Vérifier l'authentification

### 2. Protection des pages (`auth-protection.js`)

**Fonctionnalités** :
- Vérification automatique de l'authentification
- Redirection vers la connexion si nécessaire
- Protection des routes privées
- Gestion des rôles utilisateur

### 3. Utilitaires de redirection (`auth-redirect-utils.js`)

**Fonctionnalités** :
- Redirection après connexion
- Gestion des URLs de retour
- Redirection selon le rôle
- Protection contre les boucles

---

## Composants UI

### 1. Menu de profil (`profile-menu.js`)

**Fonctionnalités** :
- Affichage du profil utilisateur
- Menu déroulant avec options
- Gestion de la déconnexion
- Navigation vers le profil

### 2. Dropdown de profil (`profile-dropdown.js`)

**Fonctionnalités** :
- Menu contextuel du profil
- Options rapides
- Effets visuels
- Gestion des clics

### 3. Affichage du profil (`profile-display.js`)

**Fonctionnalités** :
- Affichage des informations utilisateur
- Avatar et nom
- Statut de connexion
- Informations de rôle

### 4. Amélioration du bouton profil (`profile-button-enhancer.js`)

**Fonctionnalités** :
- Amélioration visuelle du bouton
- Effets de survol
- Animations
- Responsive design

### 5. Injection globale du profil (`global-profile-injector.js`)

**Fonctionnalités** :
- Injection automatique du menu profil
- Gestion globale de l'affichage
- Synchronisation entre pages
- Configuration centralisée

---

## Gestion des modales

### 1. Modales de trajets (`trajets-modal.js`)

**Fonctionnalités** :
- Création de trajets
- Modification de trajets
- Suppression de trajets
- Validation des formulaires

### 2. Étapes modales (`modal-steps.js`)

**Fonctionnalités** :
- Processus en étapes
- Navigation entre étapes
- Validation progressive
- Sauvegarde d'état

---

## Sécurité

### 1. Déconnexion sécurisée (`secure-logout.js`)

**Fonctionnalités** :
- Révocation du token côté serveur
- Nettoyage du stockage local
- Redirection sécurisée
- Gestion des erreurs

### 2. Protection des données

**Mesures** :
- Validation côté client
- Sanitisation des entrées
- Protection XSS
- Gestion sécurisée des tokens

---

## Styles et design

### 1. Configuration Tailwind CSS

**Thèmes** :
- Mode clair et sombre
- Couleurs personnalisées
- Typographie
- Espacement

### 2. Composants DaisyUI

**Utilisation** :
- Boutons et formulaires
- Modales et dropdowns
- Tables et cartes
- Navigation

### 3. Responsive design

**Breakpoints** :
- Mobile first
- Tablette
- Desktop
- Large screens

---

## Performance

### 1. Optimisation des scripts

**Techniques** :
- Chargement asynchrone
- Minification
- Cache des ressources
- Lazy loading

### 2. Optimisation CSS

**Techniques** :
- Purge CSS automatique
- Compression
- Critical CSS
- Optimisation des sélecteurs

---

## Tests et développement

### 1. Pages de test

**Fichiers de test** :
- `test-fa.html` : Test FontAwesome
- `test-profile-api.html` : Test API profil
- `check-paths.html` : Vérification des chemins
- `debug-dropdown.html` : Debug dropdown

### 2. Outils de développement

**Utilitaires** :
- `deconnexion-rapide.html` : Déconnexion rapide
- `force-clear-storage.html` : Nettoyage stockage
- `exemple-topbar-avec-auth.html` : Exemple topbar

---

## Déploiement

### 1. Build de production

```bash
# Compilation des styles
npm run build

# Minification des scripts (optionnel)
# Utiliser un bundler comme Webpack ou Vite
```

### 2. Structure de déploiement

```
dist/
├── index.html
├── pages/
├── public/
│   ├── assets/
│   │   ├── css/
│   │   └── images/
│   └── images/
└── src/
    └── js/
```

### 3. Configuration serveur

**Serveur web** :
- Apache ou Nginx
- Configuration CORS
- Compression gzip
- Cache headers

---

## Maintenance

### 1. Mise à jour des dépendances

```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour
npm update
```

### 2. Monitoring

**Métriques** :
- Temps de chargement
- Erreurs JavaScript
- Performance des API
- Utilisation des ressources

### 3. Sauvegarde

**Éléments à sauvegarder** :
- Code source
- Configuration
- Assets
- Documentation

---

## Évolution

### 1. Ajout de nouvelles pages

1. Créer le fichier HTML dans `pages/`
2. Ajouter les scripts nécessaires dans `src/js/`
3. Configurer la navigation
4. Tester la page

### 2. Ajout de nouvelles fonctionnalités

1. Créer les services API
2. Développer les composants UI
3. Intégrer dans les pages
4. Tester les fonctionnalités

### 3. Amélioration des performances

1. Analyser les performances
2. Optimiser le code
3. Améliorer le design
4. Tester les améliorations

---

*Documentation générée le : $(date)*
*Version du frontend web : 1.0.0*
*Dernière mise à jour : $(date)* 