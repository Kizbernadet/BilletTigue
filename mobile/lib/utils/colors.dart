/**
 * FICHIER: colors.dart
 * 
 * RÔLE: Définition de la palette de couleurs de l'application mobile Billettigue
 * 
 * LOGIQUE:
 * - Centralise toutes les couleurs utilisées dans l'application
 * - Assure la cohérence visuelle avec l'interface web
 * - Fournit des couleurs sémantiques (success, error, warning, info)
 * - Inclut des gradients prédéfinis pour les éléments décoratifs
 * 
 * ARCHITECTURE:
 * - Classe statique AppColors pour un accès global
 * - Organisation par catégories (principales, texte, fond, etc.)
 * - Couleurs inspirées de la charte graphique web
 * 
 * UTILISATION:
 * - Import dans tous les fichiers qui nécessitent des couleurs
 * - Exemple: AppColors.primary, AppColors.textBase
 * - Gradients: AppColors.primaryGradient, AppColors.accentGradient
 */

import 'package:flutter/material.dart';

/// Palette de couleurs inspirée de l'interface web BilletTigue
class AppColors {
  // ========================================
  // COULEURS PRINCIPALES
  // ========================================

  /// Bleu marine - Couleur primaire de l'application
  static const Color primary = Color(0xFF183C4A);

  /// Orange - Couleur d'accent pour les éléments interactifs
  static const Color accent = Color(0xFFEF9846);

  /// Orange plus foncé - Variante pour les états hover/pressed
  static const Color accentDark = Color(0xFFdc7e26);

  // ========================================
  // COULEURS DE TEXTE
  // ========================================

  /// Gris foncé - Couleur de texte principale
  static const Color textBase = Color(0xFF374151);

  /// Blanc - Texte sur fond sombre
  static const Color textLight = Color(0xFFFFFFFF);

  /// Bleu marine - Texte d'accent
  static const Color textPrimary = Color(0xFF183C4A);

  /// Orange - Texte d'accent secondaire
  static const Color textAccent = Color(0xFFEF9846);

  // ========================================
  // COULEURS DE FOND
  // ========================================

  /// Fond très clair - Couleur de fond principale
  static const Color background = Color(0xFFF8F8FF);

  /// Blanc - Surface des cartes et conteneurs
  static const Color surface = Color(0xFFFFFFFF);

  /// Gris très clair - Fond des champs de saisie
  static const Color inputBackground = Color(0xFFF9FAFB);

  // ========================================
  // COULEURS DE BORDURE
  // ========================================

  /// Gris clair - Bordure par défaut
  static const Color border = Color(0xFFD1D5DB);

  /// Orange - Bordure en focus
  static const Color borderFocused = Color(0xFFEF9846);

  // ========================================
  // COULEURS D'ÉTAT
  // ========================================

  /// Vert - Succès, validation
  static const Color success = Color(0xFF10B981);

  /// Rouge - Erreur, danger
  static const Color error = Color(0xFFEF4444);

  /// Orange - Avertissement
  static const Color warning = Color(0xFFF59E0B);

  /// Bleu - Information
  static const Color info = Color(0xFF3B82F6);

  // ========================================
  // COULEURS NEUTRES (ÉCHELLE DE GRIS)
  // ========================================

  /// Gris très clair - Fond subtil
  static const Color gray50 = Color(0xFFF9FAFB);

  /// Gris clair - Séparateurs
  static const Color gray100 = Color(0xFFF3F4F6);

  /// Gris moyen clair - Bordures
  static const Color gray200 = Color(0xFFE5E7EB);

  /// Gris moyen - Bordures par défaut
  static const Color gray300 = Color(0xFFD1D5DB);

  /// Gris moyen foncé - Texte secondaire
  static const Color gray400 = Color(0xFF9CA3AF);

  /// Gris foncé - Texte tertiaire
  static const Color gray500 = Color(0xFF6B7280);

  /// Gris très foncé - Texte secondaire
  static const Color gray600 = Color(0xFF4B5563);

  /// Gris très foncé - Texte principal
  static const Color gray700 = Color(0xFF374151);

  /// Gris presque noir - Titres
  static const Color gray800 = Color(0xFF1F2937);

  /// Noir - Texte très important
  static const Color gray900 = Color(0xFF111827);

  // ========================================
  // GRADIENTS PRÉDÉFINIS
  // ========================================

  /// Gradient principal - Du bleu marine au blanc
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [primary, surface],
  );

  /// Gradient d'accent - De l'orange clair au foncé
  static const LinearGradient accentGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [accent, accentDark],
  );
}
