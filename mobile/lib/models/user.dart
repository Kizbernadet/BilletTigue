/**
 * FICHIER: user.dart
 * 
 * RÔLE: Modèle de données pour représenter un utilisateur de l'application
 * 
 * LOGIQUE:
 * - Définit la structure des données d'un utilisateur connecté
 * - Compatible avec les réponses JSON du backend Node/Express
 * - Gère la sérialisation/désérialisation JSON
 * - Fournit des getters calculés pour faciliter l'affichage
 * 
 * ARCHITECTURE:
 * - Classe immutable avec des propriétés finales
 * - Constructeur avec tous les paramètres requis
 * - Méthodes fromJson et toJson pour la sérialisation
 * - Getter calculé pour le nom complet
 * 
 * UTILISATION:
 * - Création d'objets User depuis les données d'authentification
 * - Affichage du nom d'utilisateur dans l'interface
 * - Gestion du profil utilisateur
 * - Compatible avec AuthResponse
 */

import 'dart:convert';

/// Modèle représentant un utilisateur de l'application
///
/// Compatible avec les réponses JSON du backend Node/Express
class User {
  /// Identifiant unique de l'utilisateur
  final String id;

  /// Nom de famille de l'utilisateur
  final String nom;

  /// Prénom de l'utilisateur
  final String prenom;

  /// Adresse email de l'utilisateur
  final String email;

  /// Rôle de l'utilisateur (ex: 'user', 'admin')
  final String role;

  /// Adresse postale de l'utilisateur (optionnel)
  final String? address;

  /// Numéro de téléphone de l'utilisateur (optionnel)
  final String? phone;

  /// Constructeur de la classe User
  ///
  /// [id] - Identifiant unique de l'utilisateur
  /// [nom] - Nom de famille de l'utilisateur
  /// [prenom] - Prénom de l'utilisateur
  /// [email] - Adresse email de l'utilisateur
  /// [role] - Rôle de l'utilisateur
  /// [address] - Adresse postale (optionnel)
  /// [phone] - Numéro de téléphone (optionnel)
  User({
    required this.id,
    required this.nom,
    required this.prenom,
    required this.email,
    required this.role,
    this.address,
    this.phone,
  });

  /// Constructeur factory depuis JSON
  ///
  /// Parse les données JSON reçues du backend
  /// [json] - Données JSON de l'utilisateur
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString() ?? '',
      nom: json['nom'] ?? '',
      prenom: json['prenom'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'user',
      address: json['address'],
      phone: json['phone'],
    );
  }

  /// Convertir en JSON
  ///
  /// Utile pour la sauvegarde locale ou l'envoi au backend
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nom': nom,
      'prenom': prenom,
      'email': email,
      'role': role,
      if (address != null) 'address': address,
      if (phone != null) 'phone': phone,
    };
  }

  /// Retourne le nom complet de l'utilisateur (prénom + nom)
  String get fullName => '$prenom $nom';

  /// Retourne le nom d'affichage (prénom seulement)
  String get displayName => prenom;

  /// Vérifie si l'utilisateur est un administrateur
  bool get isAdmin => role.toLowerCase() == 'admin';

  /// Vérifie si l'utilisateur est un utilisateur standard
  bool get isUser => role.toLowerCase() == 'user';

  /// Copie l'objet User avec des modifications
  ///
  /// Permet de créer une nouvelle instance avec certaines propriétés modifiées
  User copyWith({
    String? id,
    String? nom,
    String? prenom,
    String? email,
    String? role,
    String? address,
    String? phone,
  }) {
    return User(
      id: id ?? this.id,
      nom: nom ?? this.nom,
      prenom: prenom ?? this.prenom,
      email: email ?? this.email,
      role: role ?? this.role,
      address: address ?? this.address,
      phone: phone ?? this.phone,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User && other.id == id && other.email == email;
  }

  @override
  int get hashCode {
    return id.hashCode ^ email.hashCode;
  }

  @override
  String toString() {
    return 'User(id: $id, nom: $nom, prenom: $prenom, email: $email, role: $role)';
  }
}
