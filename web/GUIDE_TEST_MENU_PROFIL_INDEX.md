# 🧪 Guide de Test - Menu Profil sur Page Index

## ✅ **Configuration actuelle**

### **Scripts inclus dans index.html :**
```html
<script src="./src/js/main.js"></script>
<script src="./src/js/login-redirect-utils.js"></script>
<script src="./src/js/profile-menu.js"></script>        <!-- ✅ AJOUTÉ -->
<script src="./src/js/auth-state-manager.js"></script>
<script src="./src/js/date-validation.js"></script>
<script src="./src/js/index-form-handler.js"></script>
```

### **CSS inclus :**
```html
<link href="./public/assets/css/profile-menu.css" rel="stylesheet">  <!-- ✅ AJOUTÉ -->
```

## 🎯 **Tests à effectuer**

### **1. Test de chargement des scripts**
1. Ouvrir `web/index.html`
2. Ouvrir la console du navigateur (F12)
3. Vérifier les messages :
   ```
   🚀 Page index chargée
   ✅ AuthStateManager disponible sur index
   ✅ toggleAnyProfileMenu disponible sur index
   ```

### **2. Test sans connexion**
1. S'assurer qu'aucun utilisateur n'est connecté
2. Vérifier que le bouton "Se connecter" s'affiche
3. Console doit afficher : `🔓 Aucun utilisateur connecté sur index`

### **3. Test avec connexion**
1. Se connecter via une page de login
2. Retourner sur `index.html`
3. Vérifier que le bouton profil s'affiche avec le nom de l'utilisateur
4. Console doit afficher : `👤 Utilisateur connecté détecté sur index`

### **4. Test du menu dropdown**
1. Cliquer sur le bouton profil
2. Vérifier que le menu s'ouvre avec animation
3. Vérifier que les liens sont cliquables
4. Tester la fermeture :
   - Clic sur le bouton profil (toggle)
   - Clic en dehors du menu
   - Touche Échap

### **5. Test responsive**
1. Redimensionner la fenêtre en mode mobile
2. Vérifier que le bouton profil s'adapte
3. Tester le menu sur mobile

## 🔧 **Fonctionnalités attendues**

### **✅ Bouton profil :**
- Fond blanc par défaut
- Hover orange (#EF9846)
- Taille réduite (100px × 35px)
- Icône utilisateur + nom + flèche

### **✅ Menu dropdown :**
- Z-index 100000 (au-dessus de tout)
- Animation d'ouverture/fermeture
- 5 liens : Profil, Modifier, Mot de passe, Réservations, Déconnexion
- Fermeture automatique

### **✅ Interactions :**
- Toggle au clic
- Fermeture au clic extérieur
- Fermeture avec Échap
- Animations fluides

## 🐛 **Dépannage**

### **Si le menu ne s'ouvre pas :**
1. Vérifier que `profile-menu.js` est chargé
2. Vérifier que `toggleAnyProfileMenu` est disponible
3. Vérifier les erreurs dans la console

### **Si le menu est caché derrière d'autres éléments :**
1. Vérifier que le z-index est à 100000
2. Vérifier qu'il n'y a pas de conflits CSS

### **Si les animations ne fonctionnent pas :**
1. Vérifier que `pointer-events` est géré
2. Vérifier que les classes CSS sont appliquées

## 📱 **Test sur différentes pages**

### **Pages à tester :**
- ✅ `index.html` (page principale)
- ✅ `pages/search-trajets.html`
- ✅ `pages/reservation.html`
- ✅ `pages/profile.html`

### **Comportement attendu :**
- Menu identique sur toutes les pages
- État de connexion synchronisé
- Animations cohérentes

## 🎉 **Validation finale**

Le menu profil fonctionne correctement sur la page index si :
- ✅ Le bouton s'affiche quand l'utilisateur est connecté
- ✅ Le menu s'ouvre et se ferme correctement
- ✅ Les animations sont fluides
- ✅ Le z-index est correct (pas de chevauchement)
- ✅ Le responsive fonctionne
- ✅ Tous les liens sont cliquables

---

**Date de test :** $(date)
**Statut :** ✅ Prêt pour test 