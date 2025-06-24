/// FICHIER: navigation_service.dart
/// 
/// RÔLE: Service centralisé pour gérer toute la navigation dans l'application
/// 
/// LOGIQUE:
/// - Centralise toute la logique de navigation pour éviter la duplication
/// - Gère les transitions animées entre les écrans
/// - Détermine l'écran approprié selon l'état de l'utilisateur
/// - Coordonne avec OnboardingService pour la gestion de l'état
/// 
/// ARCHITECTURE:
/// - Pattern Singleton pour un accès global
/// - Méthodes statiques pour faciliter l'utilisation
/// - Transitions personnalisées pour une UX fluide
/// - Gestion automatique de l'état de l'application
/// 
/// UTILISATION:
/// - Remplacer tous les Navigator.push/pop par les méthodes de ce service
/// - Assurer une navigation cohérente dans toute l'application
/// - Gérer automatiquement les transitions et l'état
library;

import 'package:flutter/material.dart';
import 'package:billettigue/screens/onboarding_screen.dart';
import 'package:billettigue/screens/auth/login_screen.dart';
import 'package:billettigue/screens/auth/register_screen.dart';
import 'package:billettigue/screens/home_screen.dart';
import 'package:billettigue/services/onboarding_service.dart';

/// Service centralisé pour la navigation dans l'application
class NavigationService {
  // ========================================
  // PATTERN SINGLETON
  // ========================================

  /// Instance unique du service (pattern Singleton)
  static final NavigationService _instance = NavigationService._internal();

  /// Factory constructor pour retourner l'instance unique
  factory NavigationService() => _instance;

  /// Constructeur privé pour le pattern Singleton
  NavigationService._internal();

  // ========================================
  // NAVIGATION PRINCIPALE
  // ========================================

  /// Détermine et navigue vers l'écran approprié selon l'état de l'application
  ///
  /// Cette méthode est appelée au démarrage de l'app pour déterminer
  /// si l'utilisateur doit voir l'onboarding, la connexion ou l'accueil
  static Future<void> navigateToAppropriateScreen(BuildContext context) async {
    // Récupérer l'état actuel de l'application
    final appState = await OnboardingService.getAppState();

    // Naviguer vers l'écran approprié selon l'état
    switch (appState) {
      case AppState.firstLaunch:
        // Premier lancement → Onboarding
        _navigateWithAnimation(context, const OnboardingScreen());
        break;
      case AppState.loggedIn:
        // Utilisateur connecté → Accueil
        _navigateWithAnimation(context, const HomeScreen());
        break;
      case AppState.registered:
        // Utilisateur inscrit mais pas connecté → Connexion
        _navigateWithAnimation(context, const LoginScreen());
        break;
      case AppState.notRegistered:
        // Utilisateur non inscrit → Inscription
        _navigateWithAnimation(context, const RegisterScreen());
        break;
    }
  }

  // ========================================
  // MÉTHODES DE NAVIGATION AVEC ANIMATIONS
  // ========================================

  /// Navigation avec animation fluide (fade + slide)
  ///
  /// Utilise une transition personnalisée pour une expérience utilisateur
  /// plus agréable lors des changements d'écran principaux
  static void _navigateWithAnimation(BuildContext context, Widget screen) {
    Navigator.pushReplacement(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => screen,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(
            opacity: animation,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0.0, 0.3), // Slide depuis le bas
                end: Offset.zero,
              ).animate(
                CurvedAnimation(parent: animation, curve: Curves.easeInOut),
              ),
              child: child,
            ),
          );
        },
        transitionDuration: const Duration(milliseconds: 600),
      ),
    );
  }

  /// Navigation simple sans animation
  ///
  /// Pour les transitions rapides où l'animation n'est pas nécessaire
  static void navigateTo(BuildContext context, Widget screen) {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => screen),
    );
  }

  /// Navigation avec retour possible (push au lieu de pushReplacement)
  ///
  /// Permet à l'utilisateur de revenir à l'écran précédent
  static void navigateToWithBack(BuildContext context, Widget screen) {
    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => screen,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(1.0, 0.0), // Slide depuis la droite
              end: Offset.zero,
            ).animate(
              CurvedAnimation(parent: animation, curve: Curves.easeInOut),
            ),
            child: child,
          );
        },
        transitionDuration: const Duration(milliseconds: 300),
      ),
    );
  }

  // ========================================
  // MÉTHODES DE NAVIGATION UTILITAIRES
  // ========================================

  /// Retour à l'écran précédent
  static void goBack(BuildContext context) {
    Navigator.pop(context);
  }

  /// Navigation vers l'écran d'accueil en supprimant l'historique
  ///
  /// Utilisé après une connexion réussie pour empêcher le retour
  /// vers les écrans d'authentification
  static void goToHome(BuildContext context) {
    Navigator.pushAndRemoveUntil(
      context,
      PageRouteBuilder(
        pageBuilder:
            (context, animation, secondaryAnimation) => const HomeScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 300),
      ),
      (route) => false, // Supprime tout l'historique de navigation
    );
  }

  // ========================================
  // MÉTHODES DE GESTION AUTHENTIFICATION
  // ========================================

  /// Déconnexion et retour à l'écran de connexion
  ///
  /// Efface les données utilisateur et redirige vers la connexion
  static Future<void> logoutAndNavigateToLogin(BuildContext context) async {
    // Effacer les données utilisateur
    await OnboardingService.logoutUser();

    // Vérifier que le contexte est toujours valide
    if (context.mounted) {
      // Utiliser pushAndRemoveUntil pour purger l'historique de navigation
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (Route<dynamic> route) =>
            false, // Cette condition supprime toutes les routes
      );
    }
  }

  /// Navigation après connexion réussie
  ///
  /// Sauvegarde les données utilisateur et redirige vers l'accueil
  static Future<void> navigateAfterLogin(
    BuildContext context, {
    required String token,
    required String email,
    String? name,
  }) async {
    // Marquer l'utilisateur comme connecté
    await OnboardingService.markUserLoggedIn(
      token: token,
      email: email,
      name: name,
    );

    // Vérifier que le contexte est toujours valide
    if (context.mounted) {
      goToHome(context);
    }
  }

  /// Navigation après inscription réussie
  ///
  /// Marque le premier lancement comme terminé et redirige vers la connexion
  static Future<void> navigateAfterRegister(BuildContext context) async {
    // Marquer que l'onboarding est terminé
    await OnboardingService.markFirstLaunchComplete();

    // Vérifier que le contexte est toujours valide
    if (context.mounted) {
      // Utiliser pushAndRemoveUntil pour purger l'écran d'onboarding de la pile
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (Route<dynamic> route) => false,
      );
    }
  }
}
