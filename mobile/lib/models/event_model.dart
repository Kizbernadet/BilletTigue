/**
 * FICHIER: event_model.dart
 * 
 * RÔLE: Modèle de données pour représenter un événement dans l'application
 * 
 * LOGIQUE:
 * - Définit la structure des données d'un événement
 * - Utilisé pour afficher les événements dans les listes et carrousels
 * - Permet de filtrer et rechercher les événements
 * - Gère les événements à la une (featured) et les événements normaux
 * 
 * ARCHITECTURE:
 * - Classe immutable avec des propriétés finales
 * - Constructeur nommé avec paramètres requis et optionnels
 * - Compatible avec les opérations de sérialisation/désérialisation
 * 
 * UTILISATION:
 * - Création d'objets Event depuis les données API
 * - Affichage dans les widgets de l'interface utilisateur
 * - Filtrage et recherche dans DataService
 */

/// Modèle représentant un événement dans l'application
class Event {
  /// Identifiant unique de l'événement
  final String id;

  /// Titre de l'événement (ex: "Grand Concert de Rock")
  final String title;

  /// URL de l'image de l'événement
  final String imageUrl;

  /// Date et heure de l'événement
  final DateTime date;

  /// Lieu où se déroule l'événement (ex: "Accor Arena, Paris")
  final String location;

  /// Catégorie de l'événement (ex: "Concerts", "Sports", "Théâtre")
  final String category;

  /// Indique si l'événement est mis en avant (à la une)
  final bool isFeatured;

  /// Constructeur de la classe Event
  ///
  /// [id] - Identifiant unique de l'événement
  /// [title] - Titre de l'événement
  /// [imageUrl] - URL de l'image de l'événement
  /// [date] - Date et heure de l'événement
  /// [location] - Lieu de l'événement
  /// [category] - Catégorie de l'événement
  /// [isFeatured] - Si l'événement est à la une (défaut: false)
  Event({
    required this.id,
    required this.title,
    required this.imageUrl,
    required this.date,
    required this.location,
    required this.category,
    this.isFeatured = false,
  });
}
