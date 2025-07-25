# Documentation Frontend Mobile - Billettigue

## Vue d'ensemble

Le frontend mobile de Billettigue est une **application mobile native** développée avec **Flutter**, utilisant **Dart** comme langage de programmation. Elle offre une expérience utilisateur optimisée pour les appareils mobiles avec une interface moderne et intuitive.

### Technologies utilisées

- **Flutter 3.7.2** : Framework de développement mobile
- **Dart** : Langage de programmation
- **Provider 6.0.0** : Gestion d'état
- **HTTP 1.4.0** : Requêtes API
- **Shared Preferences 2.2.2** : Stockage local
- **Intl 0.20.2** : Internationalisation
- **Cupertino Icons 1.0.8** : Icônes iOS

---

## Architecture du projet

### Structure des dossiers

```
mobile/
├── lib/                      # Code source principal
│   ├── main.dart            # Point d'entrée de l'application
│   ├── screens/             # Écrans de l'application
│   │   ├── auth/           # Écrans d'authentification
│   │   │   ├── login_screen.dart
│   │   │   └── register_screen.dart
│   │   ├── splash_screen.dart
│   │   ├── onboarding_screen.dart
│   │   ├── home_screen.dart
│   │   ├── trajets_screen.dart
│   │   ├── tickets_screen.dart
│   │   ├── parcels_screen.dart
│   │   ├── profile_screen.dart
│   │   └── history_screen.dart
│   ├── services/            # Services métier
│   │   ├── auth_service.dart
│   │   ├── trajet_service.dart
│   │   ├── data_service.dart
│   │   ├── navigation_service.dart
│   │   └── onboarding_service.dart
│   ├── models/              # Modèles de données
│   │   ├── user.dart
│   │   ├── auth_response.dart
│   │   ├── trajet_model.dart
│   │   ├── category_model.dart
│   │   └── event_model.dart
│   ├── controllers/         # Contrôleurs
│   │   └── auth_controller.dart
│   ├── constants/           # Constantes
│   │   └── api.dart
│   ├── utils/               # Utilitaires
│   │   └── colors.dart
│   ├── widgets/             # Widgets personnalisés
│   │   └── custom_button.dart
│   ├── fonts/               # Polices personnalisées
│   │   ├── Comfortaa-VariableFont_wght.ttf
│   │   ├── Montserrat-VariableFont_wght.ttf
│   │   └── Exo2-VariableFont_wght.ttf
│   └── pictures/            # Images et assets
│       └── logo bt.png
├── android/                 # Configuration Android
├── ios/                     # Configuration iOS
├── web/                     # Configuration Web
├── windows/                 # Configuration Windows
├── macos/                   # Configuration macOS
├── linux/                   # Configuration Linux
├── test/                    # Tests
├── pubspec.yaml             # Configuration et dépendances
├── analysis_options.yaml    # Configuration d'analyse
└── README.md                # Documentation
```

---

## Configuration et démarrage

### Prérequis

- **Flutter SDK** : Version 3.7.2 ou supérieure
- **Dart SDK** : Version compatible
- **Android Studio** ou **VS Code** avec extensions Flutter
- **Émulateur Android** ou **appareil physique**

### Installation des dépendances

```bash
cd mobile
flutter pub get
```

### Scripts disponibles

```bash
# Développement
flutter run

# Build pour Android
flutter build apk

# Build pour iOS
flutter build ios

# Build pour Web
flutter build web

# Tests
flutter test

# Analyse du code
flutter analyze
```

### Configuration pubspec.yaml

```yaml
name: billettigue
description: "Application mobile Billettigue"
version: 1.0.0+1

environment:
  sdk: ^3.7.2

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.0.0
  cupertino_icons: ^1.0.8
  shared_preferences: ^2.2.2
  intl: ^0.20.2
  http: ^1.4.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0
  flutter_launcher_icons: ^0.13.1
```

---

## Écrans principaux

### 1. Écran de démarrage (`splash_screen.dart`)

**Fonctionnalités** :
- Affichage du logo Billettigue
- Animation de chargement
- Vérification de l'état d'authentification
- Redirection vers l'écran approprié

**Logique** :
- Vérification du token stocké
- Redirection vers onboarding ou home
- Gestion des erreurs de connexion

### 2. Écran d'onboarding (`onboarding_screen.dart`)

**Fonctionnalités** :
- Présentation de l'application
- Slides explicatifs
- Bouton de démarrage
- Sauvegarde de l'état d'onboarding

**Composants** :
- PageView pour les slides
- Indicateurs de progression
- Boutons de navigation

### 3. Écran de connexion (`auth/login_screen.dart`)

**Fonctionnalités** :
- Formulaire de connexion
- Validation des champs
- Gestion des erreurs
- Redirection après connexion

**Champs** :
- Email
- Mot de passe
- Type d'utilisateur (utilisateur/transporteur)

### 4. Écran d'inscription (`auth/register_screen.dart`)

**Fonctionnalités** :
- Formulaire d'inscription complet
- Validation en temps réel
- Choix du type de compte
- Création de compte

**Types de comptes** :
- Utilisateur standard
- Transporteur

### 5. Écran d'accueil (`home_screen.dart`)

**Fonctionnalités** :
- Navigation principale
- Vue d'ensemble des trajets
- Accès rapide aux fonctionnalités
- Notifications

**Composants** :
- Bottom navigation
- Cards de trajets
- Boutons d'action rapide

### 6. Écran des trajets (`trajets_screen.dart`)

**Fonctionnalités** :
- Liste des trajets disponibles
- Filtres de recherche
- Détails des trajets
- Réservation

**Filtres** :
- Ville de départ/arrivée
- Date
- Prix
- Type de transport

### 7. Écran des tickets (`tickets_screen.dart`)

**Fonctionnalités** :
- Historique des réservations
- Détails des tickets
- Statut des réservations
- Actions (annulation, modification)

### 8. Écran des colis (`parcels_screen.dart`)

**Fonctionnalités** :
- Gestion des envois de colis
- Suivi des livraisons
- Création d'envois
- Historique des colis

### 9. Écran de profil (`profile_screen.dart`)

**Fonctionnalités** :
- Informations du profil
- Modification des données
- Changement de mot de passe
- Déconnexion

### 10. Écran d'historique (`history_screen.dart`)

**Fonctionnalités** :
- Historique complet des activités
- Filtres par date
- Détails des actions
- Statistiques personnelles

---

## Services métier

### 1. Service d'authentification (`services/auth_service.dart`)

**Fonctions principales** :
- `login(credentials)` : Connexion utilisateur
- `register(data)` : Inscription utilisateur
- `logout()` : Déconnexion
- `checkAuthStatus()` : Vérification de l'état d'authentification
- `saveToken(token)` : Sauvegarde du token
- `getToken()` : Récupération du token

**Gestion du stockage** :
- Utilisation de SharedPreferences
- Persistance des données d'authentification
- Gestion de la session

### 2. Service des trajets (`services/trajet_service.dart`)

**Fonctions principales** :
- `getTrajets()` : Récupération des trajets
- `searchTrajets(criteria)` : Recherche de trajets
- `getTrajetById(id)` : Détails d'un trajet
- `createReservation(data)` : Création de réservation
- `getReservations()` : Mes réservations

**Gestion des données** :
- Cache local des trajets
- Synchronisation avec l'API
- Gestion des erreurs réseau

### 3. Service de données (`services/data_service.dart`)

**Fonctions principales** :
- `getUserData()` : Récupération données utilisateur
- `updateUserData(data)` : Mise à jour profil
- `getCategories()` : Récupération catégories
- `getEvents()` : Récupération événements

**Cache et optimisation** :
- Mise en cache des données
- Gestion de la synchronisation
- Optimisation des requêtes

### 4. Service de navigation (`services/navigation_service.dart`)

**Fonctionnalités** :
- Gestion de la navigation entre écrans
- Protection des routes
- Redirection automatique
- Gestion de l'historique

**Méthodes** :
- `navigateTo(route)` : Navigation vers un écran
- `goBack()` : Retour en arrière
- `clearStack()` : Nettoyage de la pile
- `protectRoute(route)` : Protection d'une route

### 5. Service d'onboarding (`services/onboarding_service.dart`)

**Fonctionnalités** :
- Gestion de l'état d'onboarding
- Sauvegarde des préférences
- Vérification du premier lancement
- Configuration initiale

---

## Modèles de données

### 1. Modèle utilisateur (`models/user.dart`)

```dart
class User {
  final int id;
  final String email;
  final String firstName;
  final String lastName;
  final String phoneNumber;
  final String role;
  final String status;
  
  // Constructeur et méthodes
}
```

### 2. Modèle de réponse d'authentification (`models/auth_response.dart`)

```dart
class AuthResponse {
  final String token;
  final User user;
  final String message;
  final bool success;
  
  // Constructeur et méthodes
}
```

### 3. Modèle de trajet (`models/trajet_model.dart`)

```dart
class Trajet {
  final int id;
  final String departureCity;
  final String arrivalCity;
  final DateTime departureTime;
  final double price;
  final int availableSeats;
  final String status;
  final bool acceptsPackages;
  
  // Constructeur et méthodes
}
```

### 4. Modèle de catégorie (`models/category_model.dart`)

```dart
class Category {
  final int id;
  final String name;
  final String description;
  final String icon;
  
  // Constructeur et méthodes
}
```

### 5. Modèle d'événement (`models/event_model.dart`)

```dart
class Event {
  final int id;
  final String title;
  final String description;
  final DateTime date;
  final String location;
  final String type;
  
  // Constructeur et méthodes
}
```

---

## Contrôleurs

### 1. Contrôleur d'authentification (`controllers/auth_controller.dart`)

**Fonctionnalités** :
- Gestion de l'état d'authentification
- Validation des formulaires
- Gestion des erreurs
- Navigation après authentification

**Méthodes** :
- `login()` : Processus de connexion
- `register()` : Processus d'inscription
- `logout()` : Processus de déconnexion
- `validateForm()` : Validation des champs

---

## Widgets personnalisés

### 1. Bouton personnalisé (`widgets/custom_button.dart`)

**Fonctionnalités** :
- Bouton réutilisable
- Styles personnalisables
- États de chargement
- Gestion des actions

**Propriétés** :
- `text` : Texte du bouton
- `onPressed` : Action au clic
- `isLoading` : État de chargement
- `style` : Style personnalisé

### 2. Composants réutilisables

**Cards de trajets** :
- Affichage des informations de trajet
- Actions rapides
- Design responsive

**Formulaires** :
- Champs de saisie validés
- Messages d'erreur
- Styles cohérents

---

## Gestion d'état

### 1. Provider Pattern

**Utilisation** :
- Gestion de l'état global
- Notifications de changements
- Optimisation des performances

**Providers** :
- `AuthProvider` : État d'authentification
- `TrajetProvider` : État des trajets
- `UserProvider` : État utilisateur

### 2. État local

**Gestion** :
- État des formulaires
- État de chargement
- État des erreurs

---

## Configuration des plateformes

### 1. Configuration Android

**Fichiers** :
- `android/app/build.gradle` : Configuration build
- `android/app/src/main/AndroidManifest.xml` : Permissions
- `android/app/src/main/res/` : Ressources

**Permissions** :
- Internet
- Stockage
- Localisation (optionnel)

### 2. Configuration iOS

**Fichiers** :
- `ios/Runner/Info.plist` : Configuration app
- `ios/Runner/AppDelegate.swift` : Délégation app
- `ios/Runner/Assets.xcassets/` : Ressources

**Capacités** :
- Réseau
- Stockage
- Localisation (optionnel)

### 3. Configuration Web

**Fichiers** :
- `web/index.html` : Page HTML
- `web/manifest.json` : Manifeste PWA
- `web/icons/` : Icônes

**Fonctionnalités** :
- PWA (Progressive Web App)
- Responsive design
- Offline support

---

## Polices et design

### 1. Polices personnalisées

**Polices utilisées** :
- **Comfortaa** : Police principale
- **Montserrat** : Police secondaire
- **Exo2** : Police d'accent

**Configuration** :
```yaml
fonts:
  - family: Comfortaa
    fonts:
      - asset: lib/fonts/Comfortaa-VariableFont_wght.ttf
  - family: Montserrat
    fonts:
      - asset: lib/fonts/Montserrat-VariableFont_wght.ttf
  - family: Exo2
    fonts:
      - asset: lib/fonts/Exo2-VariableFont_wght.ttf
```

### 2. Palette de couleurs

**Couleurs principales** :
- Couleur primaire : Bleu Billettigue
- Couleur secondaire : Orange
- Couleur d'accent : Vert
- Couleurs neutres : Gris

**Configuration** :
```dart
class AppColors {
  static const Color primary = Color(0xFF1E40AF);
  static const Color secondary = Color(0xFFFF6B35);
  static const Color accent = Color(0xFF10B981);
  static const Color background = Color(0xFFF8FAFC);
}
```

---

## API et communication

### 1. Configuration API (`constants/api.dart`)

**Configuration** :
- URL de base de l'API
- Headers par défaut
- Timeout des requêtes
- Gestion des erreurs

### 2. Requêtes HTTP

**Utilisation** :
- Package `http` pour les requêtes
- Gestion des tokens d'authentification
- Intercepteurs de requêtes
- Gestion des erreurs réseau

### 3. Gestion des erreurs

**Types d'erreurs** :
- Erreurs réseau
- Erreurs d'authentification
- Erreurs de validation
- Erreurs serveur

---

## Tests

### 1. Tests unitaires

**Structure** :
- Tests des modèles
- Tests des services
- Tests des contrôleurs

**Exécution** :
```bash
flutter test
```

### 2. Tests d'intégration

**Fonctionnalités** :
- Tests de navigation
- Tests d'authentification
- Tests des formulaires

### 3. Tests de widgets

**Composants** :
- Tests des widgets personnalisés
- Tests des écrans
- Tests d'interaction

---

## Performance

### 1. Optimisation des images

**Techniques** :
- Compression des images
- Formats optimisés (WebP)
- Lazy loading
- Cache des images

### 2. Optimisation du code

**Techniques** :
- Code splitting
- Lazy loading des écrans
- Optimisation des widgets
- Gestion de la mémoire

### 3. Monitoring

**Métriques** :
- Temps de démarrage
- Utilisation mémoire
- Performance des animations
- Temps de réponse API

---

## Sécurité

### 1. Stockage sécurisé

**Mesures** :
- Chiffrement des données sensibles
- Stockage sécurisé des tokens
- Nettoyage automatique des données

### 2. Validation des données

**Techniques** :
- Validation côté client
- Sanitisation des entrées
- Protection contre les injections

### 3. Communication sécurisée

**Mesures** :
- HTTPS obligatoire
- Validation des certificats
- Gestion sécurisée des tokens

---

## Déploiement

### 1. Build pour Android

```bash
# Build APK
flutter build apk

# Build App Bundle
flutter build appbundle

# Build pour architecture spécifique
flutter build apk --target-platform android-arm64
```

### 2. Build pour iOS

```bash
# Build pour simulateur
flutter build ios --simulator

# Build pour appareil
flutter build ios
```

### 3. Build pour Web

```bash
# Build de production
flutter build web --release

# Build avec optimisations
flutter build web --web-renderer html
```

### 4. Publication

**Android** :
- Google Play Console
- Signing de l'APK
- Métadonnées de l'app

**iOS** :
- App Store Connect
- Certificats de développement
- Profils de provisionnement

---

## Maintenance

### 1. Mise à jour des dépendances

```bash
# Vérifier les mises à jour
flutter pub outdated

# Mettre à jour
flutter pub upgrade
```

### 2. Analyse du code

```bash
# Analyse statique
flutter analyze

# Correction automatique
dart fix --apply
```

### 3. Monitoring en production

**Métriques** :
- Crash reports
- Performance analytics
- User feedback
- App store reviews

---

## Évolution

### 1. Ajout de nouveaux écrans

1. Créer le fichier dans `lib/screens/`
2. Ajouter la route dans la navigation
3. Créer les services nécessaires
4. Tester l'écran

### 2. Ajout de nouvelles fonctionnalités

1. Créer les modèles de données
2. Développer les services
3. Créer les widgets UI
4. Intégrer dans les écrans

### 3. Amélioration des performances

1. Analyser les performances
2. Optimiser le code
3. Améliorer l'UX
4. Tester les améliorations

---

## Documentation technique

### 1. Architecture MVVM

**Modèle** : Données et logique métier
**Vue** : Interface utilisateur
**ViewModel** : Gestion de l'état et des interactions

### 2. Patterns utilisés

**Provider Pattern** : Gestion d'état
**Repository Pattern** : Accès aux données
**Service Pattern** : Logique métier
**Factory Pattern** : Création d'objets

### 3. Bonnes pratiques

**Code** :
- Nommage explicite
- Documentation des méthodes
- Gestion des erreurs
- Tests unitaires

**UI/UX** :
- Design responsive
- Accessibilité
- Performance
- Cohérence visuelle

---

*Documentation générée le : $(date)*
*Version du frontend mobile : 1.0.0*
*Dernière mise à jour : $(date)* 