/**
 * FICHIER: api.dart
 * 
 * RÔLE: Configuration des constantes API pour l'application
 * 
 * LOGIQUE:
 * - Définit l'URL de base de l'API backend
 * - Gère les environnements de développement et production
 * - Centralise les endpoints de l'API
 * - Facilite le changement d'environnement
 * 
 * ARCHITECTURE:
 * - Constantes pour les URLs de base
 * - Endpoints organisés par fonctionnalité
 * - Configuration facilement modifiable
 * 
 * UTILISATION:
 * - Importé par les services pour les appels API
 * - Changement d'environnement en modifiant baseUrl
 */

/// URL de base de l'API backend
///
/// À modifier selon votre configuration réseau locale
/// En production, remplacer par l'URL du serveur de production
///const String baseUrl = 'http://192.168.0.42:3000/api';
const String baseUrl = 'http://192.168.8.128:5000/api';

// ========================================
// ENDPOINTS D'AUTHENTIFICATION
// ========================================

/// Endpoint pour la connexion utilisateur
const String loginEndpoint = '/auth/login';

/// Endpoint pour l'inscription utilisateur
const String registerEndpoint = '/auth/register';

/// Endpoint pour la déconnexion (si nécessaire)
const String logoutEndpoint = '/auth/logout';

/// Endpoint pour rafraîchir le token (si nécessaire)
const String refreshTokenEndpoint = '/auth/refresh';

// ========================================
// ENDPOINTS UTILISATEUR
// ========================================

/// Endpoint pour récupérer le profil utilisateur
const String userProfileEndpoint = '/user/profile';

/// Endpoint pour mettre à jour le profil utilisateur
const String updateProfileEndpoint = '/user/profile';

// ========================================
// ENDPOINTS ÉVÉNEMENTS
// ========================================

/// Endpoint pour récupérer tous les événements
const String eventsEndpoint = '/events';

/// Endpoint pour récupérer les événements à la une
const String featuredEventsEndpoint = '/events/featured';

/// Endpoint pour récupérer les catégories d'événements
const String categoriesEndpoint = '/categories';

// ========================================
// CONFIGURATION RÉSEAU
// ========================================

/// Timeout pour les requêtes HTTP (en secondes)
const int requestTimeout = 30;

/// Headers par défaut pour les requêtes API
const Map<String, String> defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/// Headers avec authentification
Map<String, String> getAuthHeaders(String token) {
  return {...defaultHeaders, 'Authorization': 'Bearer $token'};
}
