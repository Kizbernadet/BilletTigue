/**
 * FICHIER: auth_controller.dart
 * 
 * RÔLE: Contrôleur d'authentification (MVC) pour la gestion de l'état utilisateur
 * 
 * LOGIQUE:
 * - Gère l'état d'authentification (chargement, erreur, utilisateur courant, token)
 * - Fait le lien entre AuthService et l'UI (Provider/Consumer)
 * - Fournit des méthodes pour login, register, logout
 * - Notifie l'UI lors des changements d'état
 * 
 * ARCHITECTURE:
 * - Hérite de ChangeNotifier pour la réactivité
 * - Stocke l'utilisateur courant, le token, l'état de chargement et les erreurs
 * - Utilise AuthService pour les appels réseau
 * - Peut être utilisé avec Provider ou Riverpod
 * 
 * UTILISATION:
 * - Fournir ce controller via un Provider dans main.dart
 * - Consommer dans les vues pour afficher l'état et déclencher les actions
 */

import 'package:flutter/material.dart';
import 'package:billettigue/models/user.dart';
import 'package:billettigue/models/auth_response.dart';
import 'package:billettigue/services/auth_service.dart';

/// Contrôleur d'authentification (ChangeNotifier)
class AuthController extends ChangeNotifier {
  /// Utilisateur actuellement connecté (null si déconnecté)
  User? _user;

  /// Token JWT de la session (null si déconnecté)
  String? _token;

  /// Indique si une opération est en cours
  bool _isLoading = false;

  /// Message d'erreur à afficher (null si pas d'erreur)
  String? _error;

  // ==================== GETTERS ====================
  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null && _token != null;

  // ==================== MÉTHODES ====================

  /// Connexion utilisateur
  Future<bool> login({required String email, required String password}) async {
    _setLoading(true);
    _setError(null);
    final response = await AuthService.login(email: email, password: password);
    if (response.isSuccess) {
      _user = response.user;
      _token = response.token;
      _setLoading(false);
      notifyListeners();
      return true;
    } else {
      _setError(response.errorMessage);
      _setLoading(false);
      return false;
    }
  }

  /// Inscription utilisateur
  Future<bool> register({
    required String nom,
    required String prenom,
    required String email,
    required String password,
    String? address,
    String? phone,
  }) async {
    _setLoading(true);
    _setError(null);
    final response = await AuthService.register(
      nom: nom,
      prenom: prenom,
      email: email,
      password: password,
      address: address,
      phone: phone,
    );
    if (response.isSuccess) {
      _user = response.user;
      _token = response.token;
      _setLoading(false);
      notifyListeners();
      return true;
    } else {
      _setError(response.errorMessage);
      _setLoading(false);
      return false;
    }
  }

  /// Déconnexion utilisateur
  Future<void> logout() async {
    if (_token != null) {
      await AuthService.logout(_token!);
    }
    _user = null;
    _token = null;
    _setError(null);
    notifyListeners();
  }

  /// Réinitialise l'état d'erreur
  void clearError() {
    _setError(null);
  }

  // ==================== MÉTHODES PRIVÉES ====================
  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String? message) {
    _error = message;
    notifyListeners();
  }
}
