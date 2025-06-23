/**
 * FICHIER: auth_service.dart
 * 
 * RÔLE: Service de gestion des appels d'authentification vers le backend
 * 
 * LOGIQUE:
 * - Gère les requêtes HTTP vers l'API d'authentification
 * - Parse les réponses JSON du backend Node/Express
 * - Gère les erreurs réseau et serveur
 * - Fournit une interface type-safe pour l'authentification
 * 
 * ARCHITECTURE:
 * - Méthodes asynchrones pour les appels API
 * - Gestion des timeouts et erreurs réseau
 * - Parsing automatique des réponses JSON
 * - Headers d'authentification automatiques
 * 
 * UTILISATION:
 * - Appelé par AuthController pour les opérations d'authentification
 * - Gère la communication avec le backend de manière transparente
 * - Retourne des AuthResponse pour une gestion unifiée des réponses
 */

import 'dart:convert';
import 'dart:io';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:billettigue/constants/api.dart';
import 'package:billettigue/models/auth_response.dart';
import 'package:billettigue/models/user.dart';

/// Service de gestion des appels d'authentification vers le backend
class AuthService {
  /// Instance HTTP client pour les requêtes
  static final http.Client _client = http.Client();

  // ========================================
  // MÉTHODES D'AUTHENTIFICATION
  // ========================================

  /// Authentifier un utilisateur avec email et mot de passe
  ///
  /// [email] - Email de l'utilisateur
  /// [password] - Mot de passe de l'utilisateur
  ///
  /// Retourne une AuthResponse avec les données utilisateur et le token
  /// ou une erreur si l'authentification échoue
  static Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      // Préparer les données de la requête
      final requestData = {'email': email, 'password': password};

      // Effectuer la requête POST vers l'endpoint de connexion
      final response = await _client
          .post(
            Uri.parse('$baseUrl$loginEndpoint'),
            headers: defaultHeaders,
            body: jsonEncode(requestData),
          )
          .timeout(Duration(seconds: requestTimeout));

      // Parser la réponse
      return _parseAuthResponse(response);
    } on SocketException {
      // Erreur de connexion réseau
      return AuthResponse.error(
        message:
            'Erreur de connexion réseau. Vérifiez votre connexion internet.',
      );
    } on TimeoutException {
      // Timeout de la requête
      return AuthResponse.error(
        message: 'La requête a pris trop de temps. Veuillez réessayer.',
      );
    } catch (e) {
      // Erreur inattendue
      return AuthResponse.error(
        message: 'Une erreur inattendue s\'est produite: ${e.toString()}',
      );
    }
  }

  /// Inscrire un nouvel utilisateur
  ///
  /// [nom] - Nom de famille de l'utilisateur
  /// [prenom] - Prénom de l'utilisateur
  /// [email] - Email de l'utilisateur
  /// [password] - Mot de passe de l'utilisateur
  /// [address] - Adresse postale (optionnel)
  /// [phone] - Numéro de téléphone (optionnel)
  ///
  /// Retourne une AuthResponse avec les données utilisateur et le token
  /// ou une erreur si l'inscription échoue
  static Future<AuthResponse> register({
    required String nom,
    required String prenom,
    required String email,
    required String password,
    String? address,
    String? phone,
  }) async {
    try {
      // Préparer les données de la requête
      final requestData = {
        'nom': nom,
        'prenom': prenom,
        'email': email,
        'password': password,
        if (address != null) 'address': address,
        if (phone != null) 'phone': phone,
      };

      // Effectuer la requête POST vers l'endpoint d'inscription
      final response = await _client
          .post(
            Uri.parse('$baseUrl$registerEndpoint'),
            headers: defaultHeaders,
            body: jsonEncode(requestData),
          )
          .timeout(Duration(seconds: requestTimeout));

      // Parser la réponse
      return _parseAuthResponse(response);
    } on SocketException {
      // Erreur de connexion réseau
      return AuthResponse.error(
        message:
            'Erreur de connexion réseau. Vérifiez votre connexion internet.',
      );
    } on TimeoutException {
      // Timeout de la requête
      return AuthResponse.error(
        message: 'La requête a pris trop de temps. Veuillez réessayer.',
      );
    } catch (e) {
      // Erreur inattendue
      return AuthResponse.error(
        message: 'Une erreur inattendue s\'est produite: ${e.toString()}',
      );
    }
  }

  /// Déconnecter l'utilisateur (si l'endpoint existe)
  ///
  /// [token] - Token JWT de l'utilisateur connecté
  ///
  /// Retourne true si la déconnexion a réussi, false sinon
  static Future<bool> logout(String token) async {
    try {
      // Effectuer la requête POST vers l'endpoint de déconnexion
      final response = await _client
          .post(
            Uri.parse('$baseUrl$logoutEndpoint'),
            headers: getAuthHeaders(token),
          )
          .timeout(Duration(seconds: requestTimeout));

      // Considérer comme succès si le statut est 200 ou 204
      return response.statusCode == 200 || response.statusCode == 204;
    } catch (e) {
      // En cas d'erreur, on considère que la déconnexion locale est suffisante
      print('Erreur lors de la déconnexion: $e');
      return true;
    }
  }

  /// Vérifier si un token est valide en appelant le backend
  ///
  /// [token] - Token JWT à vérifier
  ///
  /// Retourne les données utilisateur si le token est valide
  /// ou une erreur si le token est invalide
  static Future<AuthResponse> verifyToken(String token) async {
    try {
      // Effectuer la requête GET vers l'endpoint de profil utilisateur
      final response = await _client
          .get(
            Uri.parse('$baseUrl$userProfileEndpoint'),
            headers: getAuthHeaders(token),
          )
          .timeout(Duration(seconds: requestTimeout));

      // Si le statut est 200, le token est valide
      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return AuthResponse.success(
          user: User.fromJson(jsonData),
          token: token, // Réutiliser le token existant
        );
      } else {
        // Token invalide
        return AuthResponse.error(message: 'Token invalide ou expiré');
      }
    } on SocketException {
      return AuthResponse.error(
        message:
            'Erreur de connexion réseau. Vérifiez votre connexion internet.',
      );
    } on TimeoutException {
      return AuthResponse.error(
        message: 'La requête a pris trop de temps. Veuillez réessayer.',
      );
    } catch (e) {
      return AuthResponse.error(
        message: 'Une erreur inattendue s\'est produite: ${e.toString()}',
      );
    }
  }

  // ========================================
  // MÉTHODES UTILITAIRES PRIVÉES
  // ========================================

  /// Parser une réponse HTTP en AuthResponse
  ///
  /// [response] - Réponse HTTP du backend
  ///
  /// Retourne une AuthResponse appropriée selon le statut et le contenu
  static AuthResponse _parseAuthResponse(http.Response response) {
    try {
      // Parser le JSON de la réponse
      final jsonData = jsonDecode(response.body);

      // Vérifier le statut HTTP
      if (response.statusCode == 200 || response.statusCode == 201) {
        // Succès - parser les données utilisateur et token
        return AuthResponse.fromJson(jsonData);
      } else {
        // Erreur - extraire le message d'erreur
        final errorMessage =
            jsonData['message'] ?? 'Erreur serveur (${response.statusCode})';
        return AuthResponse.error(message: errorMessage);
      }
    } on FormatException {
      // Erreur de parsing JSON
      return AuthResponse.error(message: 'Réponse invalide du serveur');
    } catch (e) {
      // Erreur inattendue
      return AuthResponse.error(
        message: 'Erreur lors du traitement de la réponse: ${e.toString()}',
      );
    }
  }

  /// Fermer le client HTTP (à appeler lors de la fermeture de l'app)
  static void dispose() {
    _client.close();
  }
}
