# Palette de Couleurs - Application Mobile BilletTigue

## 🎨 Vue d'ensemble

La palette de couleurs de l'application mobile BilletTigue est inspirée de l'interface web pour assurer une cohérence visuelle parfaite entre les plateformes.

## 🌈 Couleurs Principales

### Couleurs de Base
- **Bleu Marine (Primary)** : `#183C4A`
  - Utilisation : Boutons principaux, AppBar, éléments d'accent
  - Code Flutter : `AppColors.primary`

- **Orange (Accent)** : `#EF9846`
  - Utilisation : Éléments d'accent, bordures focus, liens
  - Code Flutter : `AppColors.accent`

- **Orange Foncé (Accent Dark)** : `#dc7e26`
  - Utilisation : États hover, variantes d'accent
  - Code Flutter : `AppColors.accentDark`

### Couleurs de Texte
- **Texte de Base** : `#374151` (Gris foncé)
  - Utilisation : Texte principal, paragraphes
  - Code Flutter : `AppColors.textBase`

- **Texte Clair** : `#FFFFFF` (Blanc)
  - Utilisation : Texte sur fond sombre
  - Code Flutter : `AppColors.textLight`

- **Texte Primaire** : `#183C4A` (Bleu marine)
  - Utilisation : Titres, éléments importants
  - Code Flutter : `AppColors.textPrimary`

- **Texte d'Accent** : `#EF9846` (Orange)
  - Utilisation : Liens, éléments interactifs
  - Code Flutter : `AppColors.textAccent`

### Couleurs de Fond
- **Arrière-plan** : `#F8F8FF` (Blanc cassé)
  - Utilisation : Fond principal de l'application
  - Code Flutter : `AppColors.background`

- **Surface** : `#FFFFFF` (Blanc)
  - Utilisation : Cartes, conteneurs
  - Code Flutter : `AppColors.surface`

- **Arrière-plan Input** : `#F9FAFB` (Gris très clair)
  - Utilisation : Champs de saisie
  - Code Flutter : `AppColors.inputBackground`

### Couleurs de Bordure
- **Bordure** : `#D1D5DB` (Gris clair)
  - Utilisation : Bordures par défaut
  - Code Flutter : `AppColors.border`

- **Bordure Focus** : `#EF9846` (Orange)
  - Utilisation : Bordures des champs focus
  - Code Flutter : `AppColors.borderFocused`

## 🎯 Couleurs d'État

### États Système
- **Succès** : `#10B981` (Vert)
  - Utilisation : Messages de succès, validations
  - Code Flutter : `AppColors.success`

- **Erreur** : `#EF4444` (Rouge)
  - Utilisation : Messages d'erreur, alertes
  - Code Flutter : `AppColors.error`

- **Avertissement** : `#F59E0B` (Orange)
  - Utilisation : Avertissements, notifications
  - Code Flutter : `AppColors.warning`

- **Information** : `#3B82F6` (Bleu)
  - Utilisation : Messages informatifs
  - Code Flutter : `AppColors.info`

## 🎨 Échelle de Gris

### Gris Neutres
- **Gray 50** : `#F9FAFB` - Très clair
- **Gray 100** : `#F3F4F6` - Clair
- **Gray 200** : `#E5E7EB` - Moyen clair
- **Gray 300** : `#D1D5DB` - Moyen
- **Gray 400** : `#9CA3AF` - Moyen foncé
- **Gray 500** : `#6B7280` - Foncé
- **Gray 600** : `#4B5563` - Très foncé
- **Gray 700** : `#374151` - Extrêmement foncé
- **Gray 800** : `#1F2937` - Presque noir
- **Gray 900** : `#111827` - Noir

## 🌊 Gradients

### Gradients Disponibles
- **Primary Gradient** : Bleu marine → Blanc
  - Utilisation : Arrière-plans d'écrans d'authentification
  - Code Flutter : `AppColors.primaryGradient`

- **Accent Gradient** : Orange → Orange foncé
  - Utilisation : Éléments décoratifs, boutons spéciaux
  - Code Flutter : `AppColors.accentGradient`

## 📱 Utilisation par Écran

### Écran de Démarrage (OnboardingScreen)
- **Arrière-plan** : Blanc (`AppColors.surface`)
- **Titre** : Bleu marine (`AppColors.primary`)
- **Texte** : Gris foncé (`AppColors.textBase`)
- **Bouton** : Bleu marine (`AppColors.primary`)

### Écran de Chargement (SplashScreen)
- **Arrière-plan** : Bleu marine (`AppColors.primary`)
- **Texte** : Blanc (`AppColors.textLight`)
- **Indicateur** : Blanc (`AppColors.textLight`)

### Écrans d'Authentification
- **AppBar** : Bleu marine (`AppColors.primary`)
- **Arrière-plan** : Gradient bleu marine → blanc
- **Champs** : Gris très clair (`AppColors.inputBackground`)
- **Bordures focus** : Orange (`AppColors.borderFocused`)
- **Boutons** : Bleu marine (`AppColors.primary`)

### Écran d'Accueil (HomeScreen)
- **AppBar** : Bleu marine (`AppColors.primary`)
- **Cartes** : Blanc (`AppColors.surface`)
- **Boutons** : Bleu marine (`AppColors.primary`)
- **Bouton flottant** : Bleu marine (`AppColors.primary`)

## 🔧 Implémentation

### Fichier de Constantes
```dart
// lib/utils/colors.dart
class AppColors {
  static const Color primary = Color(0xFF183C4A);
  static const Color accent = Color(0xFFEF9846);
  // ... autres couleurs
}
```

### Utilisation dans les Widgets
```dart
Container(
  color: AppColors.primary,
  child: Text(
    'Exemple',
    style: TextStyle(color: AppColors.textLight),
  ),
)
```

## 🎨 Conseils d'Utilisation

### Règles Générales
1. **Cohérence** : Utilisez toujours les constantes `AppColors`
2. **Contraste** : Assurez un bon contraste texte/fond
3. **Accessibilité** : Respectez les standards d'accessibilité
4. **Hiérarchie** : Utilisez les couleurs pour créer une hiérarchie visuelle

### Bonnes Pratiques
- ✅ Utiliser `AppColors.primary` pour les actions principales
- ✅ Utiliser `AppColors.accent` pour les éléments d'accent
- ✅ Utiliser `AppColors.textBase` pour le texte principal
- ✅ Utiliser `AppColors.textLight` pour le texte sur fond sombre
- ❌ Éviter les couleurs hardcodées
- ❌ Éviter les couleurs qui ne sont pas dans la palette

## 🔄 Mise à Jour

Pour modifier la palette de couleurs :
1. Modifier le fichier `lib/utils/colors.dart`
2. Tester sur tous les écrans
3. Vérifier la cohérence avec l'interface web
4. Mettre à jour cette documentation 