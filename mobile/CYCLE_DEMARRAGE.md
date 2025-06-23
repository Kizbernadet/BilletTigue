# Cycle de Démarrage - Application Mobile BilletTigue

## Vue d'ensemble

L'application mobile BilletTigue implémente un cycle de démarrage intelligent qui guide l'utilisateur lors de sa première utilisation de l'application.

## Cycle de Démarrage

### 1. Premier Lancement
- **Écran affiché** : `SplashScreen` (2 secondes) → `OnboardingScreen`
- **Action utilisateur** : Cliquer sur "DÉMARRER"
- **Redirection** : Vers l'écran d'inscription (`RegisterScreen`)

### 2. Inscription
- **Écran affiché** : `RegisterScreen`
- **Action utilisateur** : Remplir le formulaire et cliquer sur "S'INSCRIRE"
- **Traitement** : 
  - Validation des champs
  - Simulation d'inscription (2 secondes)
  - Marquer l'utilisateur comme inscrit
- **Redirection** : Vers l'écran de connexion (`LoginScreen`)

### 3. Connexion
- **Écran affiché** : `LoginScreen`
- **Action utilisateur** : Remplir le formulaire et cliquer sur "SE CONNECTER"
- **Traitement** :
  - Validation des champs
  - Simulation de connexion (2 secondes)
  - Marquer l'utilisateur comme connecté
- **Redirection** : Vers l'écran d'accueil (`HomeScreen`)

### 4. Utilisation Normale
- **Écran affiché** : `HomeScreen`
- **Fonctionnalités** : Navigation complète de l'application

## Gestion des États

### Service OnboardingService
Le service `OnboardingService` gère trois états principaux :

1. **`isFirstLaunch()`** : Détermine si c'est le premier lancement
2. **`isUserRegistered()`** : Vérifie si l'utilisateur s'est inscrit
3. **`isUserLoggedIn()`** : Vérifie si l'utilisateur est connecté

### Logique de Navigation
```dart
// Premier lancement
if (isFirstLaunch) {
  // Afficher OnboardingScreen
} else if (isUserLoggedIn) {
  // Afficher HomeScreen
} else {
  // Afficher LoginScreen
}
```

## Fichiers Principaux

### Services
- `lib/services/onboarding_service.dart` : Gestion des états de l'application

### Écrans
- `lib/screens/splash_screen.dart` : Écran de démarrage avec logique de navigation
- `lib/screens/onboarding_screen.dart` : Écran de bienvenue avec bouton "DÉMARRER"
- `lib/screens/auth/register_screen.dart` : Écran d'inscription
- `lib/screens/auth/login_screen.dart` : Écran de connexion
- `lib/screens/home_screen.dart` : Écran d'accueil principal

### Test
- `lib/screens/test_reset_screen.dart` : Écran de test pour réinitialiser l'état

## Dépendances

- `shared_preferences: ^2.2.2` : Stockage local des préférences utilisateur

## Test du Cycle

### Méthode 1 : Réinitialisation via l'écran de test
1. Lancer l'application
2. Se connecter
3. Aller sur l'écran d'accueil
4. Cliquer sur "Test - Réinitialiser l'état"
5. Confirmer la réinitialisation
6. L'application redémarre le cycle

### Méthode 2 : Déconnexion
1. Lancer l'application
2. Se connecter
3. Aller sur l'écran d'accueil
4. Cliquer sur l'icône de déconnexion
5. Confirmer la déconnexion
6. Retour à l'écran de connexion

## Notes Importantes

- Le cycle ne se fait **qu'au premier démarrage** de l'application
- Les états sont persistants grâce à SharedPreferences
- L'utilisateur peut toujours naviguer entre les écrans d'inscription et de connexion
- Un bouton de déconnexion est disponible dans l'écran d'accueil
- Un écran de test permet de réinitialiser l'état pour les tests

## Améliorations Futures

- Intégration avec une vraie API d'authentification
- Gestion des tokens JWT
- Persistance des données utilisateur
- Gestion des erreurs réseau
- Animations de transition entre les écrans 