/**
 * FICHIER: category_model.dart
 * 
 * RÔLE: Modèle de données pour représenter une catégorie d'événements
 * 
 * LOGIQUE:
 * - Définit la structure des données d'une catégorie
 * - Utilisé pour organiser et filtrer les événements par type
 * - Fournit une icône visuelle pour chaque catégorie
 * - Permet une navigation intuitive dans l'application
 * 
 * ARCHITECTURE:
 * - Classe immutable avec des propriétés finales
 * - Constructeur simple avec nom et icône
 * - Compatible avec les widgets d'affichage
 * 
 * UTILISATION:
 * - Création de catégories dans DataService
 * - Affichage dans les widgets de catégories
 * - Filtrage des événements par catégorie
 */

import 'package:flutter/material.dart';

/// Modèle représentant une catégorie d'événements
class Category {
  /// Nom de la catégorie (ex: "Concerts", "Sports", "Théâtre")
  final String name;

  /// Icône Material Design associée à la catégorie
  final IconData icon;

  /// Constructeur de la classe Category
  ///
  /// [name] - Nom de la catégorie
  /// [icon] - Icône Material Design pour représenter la catégorie
  Category({required this.name, required this.icon});
}
