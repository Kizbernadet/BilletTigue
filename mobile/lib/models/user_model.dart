/**
 * FICHIER: user_model.dart
 * 
 * RÔLE: Modèle de données pour représenter un utilisateur de l'application
 * 
 * LOGIQUE:
 * - Définit la structure des données d'un utilisateur connecté
 * - Utilisé pour personnaliser l'interface (nom d'accueil, etc.)
 * - Stocke les informations de profil de l'utilisateur
 * - Fournit des getters calculés pour faciliter l'affichage
 * 
 * ARCHITECTURE:
 * - Classe immutable avec des propriétés finales
 * - Constructeur avec tous les paramètres requis
 * - Getter calculé pour le nom complet
 * - Compatible avec les opérations de sérialisation/désérialisation
 * 
 * UTILISATION:
 * - Création d'objets User depuis les données d'authentification
 * - Affichage du nom d'utilisateur dans l'interface
 * - Gestion du profil utilisateur
 */

/// Modèle représentant un utilisateur de l'application
class User {
  /// Identifiant unique de l'utilisateur
  final String id;

  /// Prénom de l'utilisateur
  final String firstName;

  /// Nom de famille de l'utilisateur
  final String lastName;

  /// Adresse email de l'utilisateur
  final String email;

  /// Adresse postale de l'utilisateur
  final String address;

  /// Numéro de téléphone de l'utilisateur
  final String phone;

  /// Constructeur de la classe User
  ///
  /// [id] - Identifiant unique de l'utilisateur
  /// [firstName] - Prénom de l'utilisateur
  /// [lastName] - Nom de famille de l'utilisateur
  /// [email] - Adresse email de l'utilisateur
  /// [address] - Adresse postale de l'utilisateur
  /// [phone] - Numéro de téléphone de l'utilisateur
  User({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.address,
    required this.phone,
  });

  /// Retourne le nom complet de l'utilisateur (prénom + nom)
  String get fullName => '$firstName $lastName';
}
