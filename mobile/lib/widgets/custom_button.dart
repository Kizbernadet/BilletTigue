/**
 * FICHIER: custom_button.dart
 * 
 * RÔLE: Widgets de boutons personnalisés pour l'application
 * 
 * LOGIQUE:
 * - Fournit des boutons cohérents avec le design system
 * - Gère les états de chargement avec des indicateurs
 * - Supporte les boutons avec icônes et texte
 * - Permet la personnalisation des couleurs et dimensions
 * 
 * ARCHITECTURE:
 * - CustomButton: Bouton standard avec variantes outlined/filled
 * - GradientButton: Bouton avec effet de dégradé et ombre
 * - Méthodes privées pour construire le contenu des boutons
 * - Styles cohérents avec la charte graphique
 * 
 * UTILISATION:
 * - Remplacer les ElevatedButton/OutlinedButton standards
 * - Assurer une cohérence visuelle dans toute l'application
 * - Simplifier la création de boutons avec états de chargement
 */

import 'package:flutter/material.dart';
import 'package:billettigue/utils/colors.dart';

/// Bouton personnalisé avec support pour les états de chargement et les icônes
/// 
/// Ce widget remplace les ElevatedButton et OutlinedButton standards
/// pour assurer une cohérence visuelle dans toute l'application
class CustomButton extends StatelessWidget {
  /// Texte affiché sur le bouton
  final String text;
  
  /// Callback appelé lors du clic sur le bouton
  final VoidCallback? onPressed;
  
  /// Indique si le bouton est en état de chargement
  final bool isLoading;
  
  /// Si true, utilise le style outlined au lieu de filled
  final bool isOutlined;
  
  /// Couleur de fond du bouton (ignoré si isOutlined = true)
  final Color? backgroundColor;
  
  /// Couleur du texte et de la bordure
  final Color? textColor;
  
  /// Largeur du bouton (optionnel)
  final double? width;
  
  /// Hauteur du bouton (défaut: 50)
  final double height;
  
  /// Rayon des coins arrondis (défaut: 25)
  final double borderRadius;
  
  /// Icône à afficher à côté du texte (optionnel)
  final IconData? icon;
  
  /// Si true, le bouton prend toute la largeur disponible
  final bool isFullWidth;

  /// Constructeur du CustomButton
  /// 
  /// [text] - Texte à afficher sur le bouton
  /// [onPressed] - Callback appelé lors du clic
  /// [isLoading] - État de chargement (défaut: false)
  /// [isOutlined] - Style outlined (défaut: false)
  /// [backgroundColor] - Couleur de fond personnalisée
  /// [textColor] - Couleur du texte personnalisée
  /// [width] - Largeur personnalisée
  /// [height] - Hauteur du bouton (défaut: 50)
  /// [borderRadius] - Rayon des coins (défaut: 25)
  /// [icon] - Icône à afficher
  /// [isFullWidth] - Prend toute la largeur (défaut: false)
  const CustomButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.isOutlined = false,
    this.backgroundColor,
    this.textColor,
    this.width,
    this.height = 50,
    this.borderRadius = 25,
    this.icon,
    this.isFullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    // Calculer la largeur du bouton
    final buttonWidth = isFullWidth ? double.infinity : width ?? 200;

    // Afficher le bouton outlined si demandé
    if (isOutlined) {
      return SizedBox(
        width: buttonWidth,
        height: height,
        child: OutlinedButton(
          onPressed: isLoading ? null : onPressed, // Désactiver si en chargement
          style: OutlinedButton.styleFrom(
            foregroundColor: textColor ?? AppColors.primary,
            side: BorderSide(color: textColor ?? AppColors.primary, width: 2),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(borderRadius),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          ),
          child: _buildButtonContent(),
        ),
      );
    }

    // Afficher le bouton filled par défaut
    return SizedBox(
      width: buttonWidth,
      height: height,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed, // Désactiver si en chargement
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor ?? AppColors.primary,
          foregroundColor: textColor ?? AppColors.textLight,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          ),
          elevation: 3, // Ombre légère
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        ),
        child: _buildButtonContent(),
      ),
    );
  }

  /// Construit le contenu du bouton selon son état
  /// 
  /// Affiche un indicateur de chargement si isLoading = true,
  /// sinon affiche le texte avec ou sans icône
  Widget _buildButtonContent() {
    // Afficher l'indicateur de chargement si nécessaire
    if (isLoading) {
      return const SizedBox(
        width: 20,
        height: 20,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(AppColors.textLight),
        ),
      );
    }

    // Afficher l'icône avec le texte si fournie
    if (icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 20),
          const SizedBox(width: 8),
          Text(
            text,
            style: const TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 16,
              fontWeight: FontWeight.w800,
              letterSpacing: 1,
            ),
          ),
        ],
      );
    }

    // Afficher seulement le texte
    return Text(
      text,
      style: const TextStyle(
        fontFamily: 'Montserrat',
        fontSize: 16,
        fontWeight: FontWeight.w800,
        letterSpacing: 1,
      ),
    );
  }
}

/// Bouton avec effet de dégradé et ombre portée
/// 
/// Variante du CustomButton avec un design plus moderne
/// incluant un effet de dégradé et une ombre portée
class GradientButton extends StatelessWidget {
  /// Texte affiché sur le bouton
  final String text;
  
  /// Callback appelé lors du clic sur le bouton
  final VoidCallback? onPressed;
  
  /// Indique si le bouton est en état de chargement
  final bool isLoading;
  
  /// Couleurs du dégradé (optionnel)
  final List<Color>? gradientColors;
  
  /// Largeur du bouton (optionnel)
  final double? width;
  
  /// Hauteur du bouton (défaut: 50)
  final double height;
  
  /// Rayon des coins arrondis (défaut: 25)
  final double borderRadius;
  
  /// Icône à afficher à côté du texte (optionnel)
  final IconData? icon;

  /// Constructeur du GradientButton
  /// 
  /// [text] - Texte à afficher sur le bouton
  /// [onPressed] - Callback appelé lors du clic
  /// [isLoading] - État de chargement (défaut: false)
  /// [gradientColors] - Couleurs du dégradé
  /// [width] - Largeur personnalisée
  /// [height] - Hauteur du bouton (défaut: 50)
  /// [borderRadius] - Rayon des coins (défaut: 25)
  /// [icon] - Icône à afficher
  const GradientButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.gradientColors,
    this.width,
    this.height = 50,
    this.borderRadius = 25,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width ?? 120,
      height: height,
      decoration: BoxDecoration(
        // Utiliser la première couleur du dégradé ou la couleur primaire
        color: gradientColors?.first ?? AppColors.primary,
        borderRadius: BorderRadius.circular(borderRadius),
        // Ombre portée avec la couleur du bouton
        boxShadow: [
          BoxShadow(
            color: (gradientColors?.first ?? AppColors.primary).withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed, // Désactiver si en chargement
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent, // Transparent pour voir le dégradé
          foregroundColor: AppColors.textLight,
          shadowColor: Colors.transparent, // Pas d'ombre sur le bouton lui-même
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
        child: _buildButtonContent(),
      ),
    );
  }

  /// Construit le contenu du bouton selon son état
  /// 
  /// Version adaptée pour le GradientButton avec des tailles plus petites
  Widget _buildButtonContent() {
    // Afficher l'indicateur de chargement si nécessaire
    if (isLoading) {
      return const SizedBox(
        width: 20,
        height: 20,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(AppColors.textLight),
        ),
      );
    }

    // Afficher l'icône avec le texte si fournie
    if (icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 16),
          const SizedBox(width: 4),
          Flexible(
            child: Text(
              text,
              style: const TextStyle(
                fontFamily: 'Montserrat',
                fontSize: 14,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.5,
              ),
              overflow: TextOverflow.ellipsis, // Gérer le débordement
            ),
          ),
        ],
      );
    }

    // Afficher seulement le texte
    return Text(
      text,
      style: const TextStyle(
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: FontWeight.w800,
        letterSpacing: 0.5,
      ),
      overflow: TextOverflow.ellipsis, // Gérer le débordement
    );
  }
}
