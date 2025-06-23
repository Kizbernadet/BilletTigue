/**
 * FICHIER: data_service.dart
 * 
 * RÔLE: Service de données simulées pour le développement de l'application
 * 
 * LOGIQUE:
 * - Fournit des données fictives pour simuler une API backend
 * - Gère les utilisateurs, événements et catégories
 * - Simule les délais réseau pour un comportement réaliste
 * - Permet le développement de l'interface sans backend fonctionnel
 * 
 * ARCHITECTURE:
 * - Classe singleton avec données statiques
 * - Méthodes asynchrones pour simuler les appels API
 * - Données organisées par type (utilisateurs, événements, catégories)
 * - Délais artificiels pour simuler la latence réseau
 * 
 * UTILISATION:
 * - Remplacer par de vrais appels API lors de l'intégration backend
 * - Utilisé par les écrans pour charger les données
 * - Fournit des données cohérentes pour les tests
 */

import 'package:flutter/material.dart';
import 'package:billettigue/models/category_model.dart';
import 'package:billettigue/models/event_model.dart';
import 'package:billettigue/models/user_model.dart';

/// Service de données simulées pour le développement
class DataService {
  // ========================================
  // DONNÉES UTILISATEUR SIMULÉES
  // ========================================

  /// Utilisateur connecté simulé pour les tests
  final User currentUser = User(
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    address: '123 Rue de Paris, 75001 Paris',
    phone: '0123456789',
  );

  // ========================================
  // DONNÉES CATÉGORIES SIMULÉES
  // ========================================

  /// Liste des catégories d'événements disponibles
  final List<Category> _categories = [
    Category(name: 'Concerts', icon: Icons.music_note),
    Category(name: 'Sports', icon: Icons.sports_soccer),
    Category(name: 'Théâtre', icon: Icons.theater_comedy),
    Category(name: 'Festivals', icon: Icons.celebration),
    Category(name: 'Expos', icon: Icons.museum),
  ];

  // ========================================
  // DONNÉES ÉVÉNEMENTS SIMULÉES
  // ========================================

  /// Liste complète des événements disponibles
  final List<Event> _events = [
    // Événements à la une
    Event(
      id: 'e1',
      title: 'Grand Concert de Rock',
      imageUrl: 'https://picsum.photos/seed/event1/400/200',
      date: DateTime.now().add(const Duration(days: 10)),
      location: 'Accor Arena, Paris',
      category: 'Concerts',
      isFeatured: true,
    ),
    Event(
      id: 'e2',
      title: 'Match de Football : PSG vs OM',
      imageUrl: 'https://picsum.photos/seed/event2/400/200',
      date: DateTime.now().add(const Duration(days: 5)),
      location: 'Parc des Princes, Paris',
      category: 'Sports',
      isFeatured: true,
    ),
    Event(
      id: 'e4',
      title: 'Festival Solidays',
      imageUrl: 'https://picsum.photos/seed/event4/400/200',
      date: DateTime.now().add(const Duration(days: 30)),
      location: 'Hippodrome de Longchamp, Paris',
      category: 'Festivals',
      isFeatured: true,
    ),

    // Événements normaux
    Event(
      id: 'e3',
      title: 'Pièce de Théâtre : Le Misanthrope',
      imageUrl: 'https://picsum.photos/seed/event3/400/200',
      date: DateTime.now().add(const Duration(days: 20)),
      location: 'Comédie-Française, Paris',
      category: 'Théâtre',
    ),
    Event(
      id: 'e5',
      title: 'Exposition Toutankhamon',
      imageUrl: 'https://picsum.photos/seed/event5/400/200',
      date: DateTime.now().add(const Duration(days: 15)),
      location: 'Grande Halle de la Villette, Paris',
      category: 'Expos',
    ),
    Event(
      id: 'e6',
      title: 'Concert de Jazz',
      imageUrl: 'https://picsum.photos/seed/event6/400/200',
      date: DateTime.now().add(const Duration(days: 8)),
      location: 'Duc des Lombards, Paris',
      category: 'Concerts',
    ),
  ];

  // ========================================
  // MÉTHODES DE RÉCUPÉRATION DES DONNÉES
  // ========================================

  /// Récupère les informations de l'utilisateur connecté
  ///
  /// Simule un appel API avec un délai de 300ms
  /// Retourne l'utilisateur simulé
  Future<User> getUser() async {
    // Simuler un appel réseau
    await Future.delayed(const Duration(milliseconds: 300));
    return currentUser;
  }

  /// Récupère la liste des catégories d'événements
  ///
  /// Simule un appel API avec un délai de 400ms
  /// Retourne la liste des catégories disponibles
  Future<List<Category>> getCategories() async {
    // Simuler un appel réseau
    await Future.delayed(const Duration(milliseconds: 400));
    return _categories;
  }

  /// Récupère tous les événements disponibles
  ///
  /// Simule un appel API avec un délai de 500ms
  /// Retourne la liste complète des événements
  Future<List<Event>> getAllEvents() async {
    // Simuler un appel réseau
    await Future.delayed(const Duration(milliseconds: 500));
    return _events;
  }

  /// Récupère les événements mis en avant (à la une)
  ///
  /// Simule un appel API avec un délai de 500ms
  /// Retourne uniquement les événements avec isFeatured = true
  Future<List<Event>> getFeaturedEvents() async {
    // Simuler un appel réseau
    await Future.delayed(const Duration(milliseconds: 500));
    return _events.where((event) => event.isFeatured).toList();
  }

  /// Récupère les événements à venir (non mis en avant)
  ///
  /// Simule un appel API avec un délai de 500ms
  /// Retourne les événements avec isFeatured = false
  Future<List<Event>> getUpcomingEvents() async {
    // Simuler un appel réseau
    await Future.delayed(const Duration(milliseconds: 500));
    // Retourne les événements qui ne sont pas à la une pour la démo
    return _events.where((event) => !event.isFeatured).toList();
  }
}
