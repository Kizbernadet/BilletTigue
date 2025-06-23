/**
 * FICHIER: auth_response.dart
 * 
 * RÔLE: Modèle pour les réponses d'authentification du backend
 * 
 * LOGIQUE:
 * - Définit la structure des réponses de succès et d'erreur
 * - Gère la sérialisation/désérialisation JSON
 * - Fournit des méthodes utilitaires pour vérifier le statut
 * - Compatible avec les réponses du backend Node/Express
 * 
 * ARCHITECTURE:
 * - Classe générique pour gérer différents types de réponses
 * - Constructeurs factory pour créer depuis JSON
 * - Méthodes pour vérifier le succès et extraire les données
 * 
 * UTILISATION:
 * - Utilisé par AuthService pour parser les réponses API
 * - Fournit une interface type-safe pour les données d'authentification
 */

import 'dart:convert';
import 'package:billettigue/models/user.dart';

/// Modèle pour les réponses d'authentification du backend
///
/// Gère les réponses de succès et d'erreur de manière unifiée
class AuthResponse {
  /// Indique si la requête a réussi
  final bool success;

  /// Message d'erreur (null si succès)
  final String? message;

  /// Données utilisateur (null si erreur)
  final User? user;

  /// Token JWT (null si erreur)
  final String? token;

  /// Constructeur privé
  const AuthResponse._({
    required this.success,
    this.message,
    this.user,
    this.token,
  });

  /// Constructeur factory pour une réponse de succès
  ///
  /// [user] - Données utilisateur reçues du backend
  /// [token] - Token JWT pour l'authentification
  factory AuthResponse.success({required User user, required String token}) {
    return AuthResponse._(success: true, user: user, token: token);
  }

  /// Constructeur factory pour une réponse d'erreur
  ///
  /// [message] - Message d'erreur du backend
  factory AuthResponse.error({required String message}) {
    return AuthResponse._(success: false, message: message);
  }

  /// Constructeur factory depuis JSON
  ///
  /// Parse la réponse JSON du backend et crée l'objet approprié
  /// [json] - Données JSON reçues du backend
  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    // Vérifier si c'est une réponse de succès
    if (json.containsKey('user') && json.containsKey('token')) {
      return AuthResponse.success(
        user: User.fromJson(json['user']),
        token: json['token'],
      );
    }

    // Sinon, c'est une réponse d'erreur
    return AuthResponse.error(message: json['message'] ?? 'Erreur inconnue');
  }

  /// Convertir en JSON
  ///
  /// Utile pour le debug ou la sauvegarde locale
  Map<String, dynamic> toJson() {
    if (success) {
      return {'success': true, 'user': user?.toJson(), 'token': token};
    } else {
      return {'success': false, 'message': message};
    }
  }

  /// Vérifier si la réponse est un succès
  bool get isSuccess => success;

  /// Vérifier si la réponse est une erreur
  bool get isError => !success;

  /// Obtenir le message d'erreur (retourne une chaîne vide si succès)
  String get errorMessage => message ?? '';

  /// Obtenir les données utilisateur (lance une exception si erreur)
  User get userData {
    if (!success || user == null) {
      throw StateError(
        'Tentative d\'accès aux données utilisateur sur une réponse d\'erreur',
      );
    }
    return user!;
  }

  /// Obtenir le token (lance une exception si erreur)
  String get tokenData {
    if (!success || token == null) {
      throw StateError('Tentative d\'accès au token sur une réponse d\'erreur');
    }
    return token!;
  }

  @override
  String toString() {
    if (success) {
      return 'AuthResponse.success(user: ${user?.email}, token: ${token?.substring(0, 10)}...)';
    } else {
      return 'AuthResponse.error(message: $message)';
    }
  }
}
