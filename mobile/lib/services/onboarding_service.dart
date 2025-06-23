/**
 * FICHIER: onboarding_service.dart
 * 
 * RÔLE: Service de gestion de l'état de l'application et des données utilisateur
 * 
 * LOGIQUE:
 * - Gère le premier lancement de l'application (onboarding)
 * - Stocke et récupère les données utilisateur (token, email, nom)
 * - Détermine l'état actuel de l'application pour la navigation
 * - Gère l'authentification et la déconnexion
 * 
 * ARCHITECTURE:
 * - Utilise SharedPreferences pour le stockage local persistant
 * - Méthodes statiques pour un accès global
 * - Enum AppState pour représenter les états possibles
 * - Clés de stockage constantes pour éviter les erreurs
 * 
 * UTILISATION:
 * - Appelé par NavigationService pour déterminer l'écran à afficher
 * - Utilisé dans les écrans d'authentification pour sauvegarder les données
 * - Permet la persistance des données entre les sessions
 */

import 'package:shared_preferences/shared_preferences.dart';

/// Service de gestion de l'état de l'application et des données utilisateur
class OnboardingService {
  // ========================================
  // CLÉS DE STOCKAGE SHAREDPREFERENCES
  // ========================================

  /// Clé pour stocker si c'est le premier lancement
  static const String _firstLaunchKey = 'is_first_launch';

  /// Clé pour stocker si l'utilisateur s'est inscrit
  static const String _userRegisteredKey = 'user_registered';

  /// Clé pour stocker si l'utilisateur est connecté
  static const String _userLoggedInKey = 'user_logged_in';

  /// Clé pour stocker le token d'authentification
  static const String _userTokenKey = 'user_token';

  /// Clé pour stocker l'email de l'utilisateur
  static const String _userEmailKey = 'user_email';

  /// Clé pour stocker le nom de l'utilisateur
  static const String _userNameKey = 'user_name';

  // ========================================
  // GESTION DU PREMIER LANCEMENT
  // ========================================

  /// Vérifie si c'est le premier lancement de l'application
  ///
  /// Retourne true si c'est le premier lancement, false sinon
  /// Utilisé pour déterminer si afficher l'onboarding
  static Future<bool> isFirstLaunch() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_firstLaunchKey) ??
        true; // Par défaut, premier lancement
  }

  /// Marque que l'application a été lancée pour la première fois
  ///
  /// Appelé après que l'utilisateur ait terminé l'onboarding
  /// Empêche l'affichage de l'onboarding aux lancements suivants
  static Future<void> markFirstLaunchComplete() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_firstLaunchKey, false);
  }

  // ========================================
  // GESTION DE L'INSCRIPTION
  // ========================================

  /// Vérifie si l'utilisateur s'est inscrit
  ///
  /// Retourne true si l'utilisateur a déjà créé un compte
  static Future<bool> isUserRegistered() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_userRegisteredKey) ?? false;
  }

  /// Marque que l'utilisateur s'est inscrit
  ///
  /// Appelé après une inscription réussie
  /// Permet de rediriger vers la connexion au lieu de l'inscription
  static Future<void> markUserRegistered() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_userRegisteredKey, true);
  }

  // ========================================
  // GESTION DE L'AUTHENTIFICATION
  // ========================================

  /// Vérifie si l'utilisateur est connecté
  ///
  /// Vérifie à la fois le flag de connexion et la présence d'un token
  /// Retourne true seulement si les deux conditions sont remplies
  static Future<bool> isUserLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_userTokenKey);
    return prefs.getBool(_userLoggedInKey) ?? false && token != null;
  }

  /// Marque que l'utilisateur est connecté et sauvegarde ses données
  ///
  /// [token] - Token d'authentification reçu du serveur
  /// [email] - Email de l'utilisateur connecté
  /// [name] - Nom de l'utilisateur (optionnel)
  static Future<void> markUserLoggedIn({
    required String token,
    required String email,
    String? name,
  }) async {
    final prefs = await SharedPreferences.getInstance();

    // Sauvegarder les données utilisateur
    await prefs.setBool(_userLoggedInKey, true);
    await prefs.setString(_userTokenKey, token);
    await prefs.setString(_userEmailKey, email);

    // Sauvegarder le nom si fourni
    if (name != null) {
      await prefs.setString(_userNameKey, name);
    }
  }

  /// Déconnecte l'utilisateur et efface ses données
  ///
  /// Supprime le token, l'email et le nom de l'utilisateur
  /// Garde le flag d'inscription pour permettre la reconnexion
  static Future<void> logoutUser() async {
    final prefs = await SharedPreferences.getInstance();

    // Effacer les données de session
    await prefs.setBool(_userLoggedInKey, false);
    await prefs.remove(_userTokenKey);
    await prefs.remove(_userEmailKey);
    await prefs.remove(_userNameKey);
  }

  // ========================================
  // RÉCUPÉRATION DES DONNÉES UTILISATEUR
  // ========================================

  /// Récupère le token d'authentification de l'utilisateur
  ///
  /// Retourne le token stocké ou null s'il n'existe pas
  static Future<String?> getUserToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userTokenKey);
  }

  /// Récupère l'email de l'utilisateur connecté
  ///
  /// Retourne l'email stocké ou null s'il n'existe pas
  static Future<String?> getUserEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userEmailKey);
  }

  /// Récupère le nom de l'utilisateur connecté
  ///
  /// Retourne le nom stocké ou null s'il n'existe pas
  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userNameKey);
  }

  // ========================================
  // VALIDATION ET VÉRIFICATION
  // ========================================

  /// Vérifie si l'utilisateur a un token valide
  ///
  /// Pour l'instant, vérifie seulement que le token existe et n'est pas vide
  /// Peut être étendu pour vérifier l'expiration du token
  static Future<bool> hasValidToken() async {
    final token = await getUserToken();
    if (token == null) return false;

    // TODO: Ajouter une validation plus poussée du token
    // Par exemple, vérifier s'il n'est pas expiré
    return token.isNotEmpty;
  }

  /// Détermine l'état complet de l'application
  ///
  /// Analyse toutes les données stockées pour déterminer l'état actuel
  /// Utilisé par NavigationService pour choisir l'écran approprié
  static Future<AppState> getAppState() async {
    // Récupérer tous les états
    final firstLaunch = await isFirstLaunch();
    final isRegistered = await isUserRegistered();
    final isLoggedIn = await isUserLoggedIn();
    final hasToken = await hasValidToken();

    // Déterminer l'état selon la priorité
    if (firstLaunch) {
      return AppState.firstLaunch;
    } else if (isLoggedIn && hasToken) {
      return AppState.loggedIn;
    } else if (isRegistered) {
      return AppState.registered;
    } else {
      return AppState.notRegistered;
    }
  }

  // ========================================
  // MÉTHODES UTILITAIRES ET DE TEST
  // ========================================

  /// Réinitialise l'état de premier démarrage (pour les tests)
  ///
  /// Remet l'application dans l'état de premier lancement
  /// Utile pour tester le flux d'onboarding
  static Future<void> resetOnboardingState() async {
    final prefs = await SharedPreferences.getInstance();

    // Remettre dans l'état initial
    await prefs.setBool(_firstLaunchKey, true);
    await prefs.setBool(_userRegisteredKey, false);
    await prefs.setBool(_userLoggedInKey, false);

    // Effacer les données utilisateur
    await prefs.remove(_userTokenKey);
    await prefs.remove(_userEmailKey);
    await prefs.remove(_userNameKey);
  }

  /// Nettoie toutes les données utilisateur
  ///
  /// Efface complètement toutes les données stockées
  /// Attention: cette action est irréversible
  static Future<void> clearAllUserData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  /// Vérifie si l'utilisateur doit se reconnecter
  ///
  /// Retourne true si l'utilisateur est marqué comme connecté
  /// mais n'a pas de token valide
  static Future<bool> shouldReconnect() async {
    final isLoggedIn = await isUserLoggedIn();
    final hasToken = await hasValidToken();

    return isLoggedIn && !hasToken;
  }
}

// ========================================
// ÉNUMÉRATION DES ÉTATS DE L'APPLICATION
// ========================================

/// États possibles de l'application pour la navigation
enum AppState {
  /// Premier lancement - Afficher l'onboarding
  firstLaunch,

  /// Utilisateur non inscrit - Afficher l'écran d'inscription
  notRegistered,

  /// Utilisateur inscrit mais pas connecté - Afficher la connexion
  registered,

  /// Utilisateur connecté - Afficher l'accueil
  loggedIn,
}
