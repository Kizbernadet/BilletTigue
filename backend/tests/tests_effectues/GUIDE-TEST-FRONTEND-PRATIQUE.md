# 🌐 GUIDE PRATIQUE - TEST FRONTEND BILLETTIGUE

## 🚀 Démarrage rapide

### **1. Démarrer le backend**
```bash
cd backend
npm start
```
**Vérification :** Le serveur doit démarrer sur `http://localhost:5000`

### **2. Ouvrir le frontend**
- Ouvrir le fichier `web/index.html` dans votre navigateur
- Ou utiliser un serveur local simple :
```bash
cd web
python -m http.server 3000
# Puis ouvrir http://localhost:3000
```

## 📋 Tests à effectuer manuellement

### **Test 1 : Page d'accueil**
**URL :** `http://localhost:3000` ou `file:///path/to/web/index.html`

**Actions :**
1. ✅ Vérifier que la page se charge
2. ✅ Vérifier que le logo s'affiche
3. ✅ Tester la navigation (Accueil, Bus, Colis, Aide)
4. ✅ Tester le sélecteur de langue
5. ✅ Tester le menu de connexion

**Validation :**
- [ ] Page se charge sans erreur
- [ ] Tous les éléments sont visibles
- [ ] Navigation fonctionne
- [ ] Pas d'erreurs dans la console (F12)

---

### **Test 2 : Page de connexion**
**URL :** `http://localhost:3000/pages/login.html`

**Actions :**
1. ✅ Accéder à la page de connexion
2. ✅ Remplir le formulaire avec des données valides :
   ```
   Email: admin@billettigue.com
   Mot de passe: admin123
   ```
3. ✅ Cliquer sur "Se connecter"
4. ✅ Vérifier la redirection vers l'accueil

**Validation :**
- [ ] Formulaire se charge correctement
- [ ] Champs sont utilisables
- [ ] Connexion réussie
- [ ] Redirection fonctionne
- [ ] Token JWT stocké (F12 → Application → Local Storage)

---

### **Test 3 : Page d'inscription**
**URL :** `http://localhost:3000/pages/register.html`

**Actions :**
1. ✅ Accéder à la page d'inscription
2. ✅ Remplir le formulaire avec des données valides :
   ```
   Email: test@example.com
   Mot de passe: Test123!
   Confirmation: Test123!
   Service: Transport de personnes
   Prénom: Jean
   Nom: Dupont
   Rôle: Utilisateur
   ```
3. ✅ Cliquer sur "S'inscrire"
4. ✅ Vérifier la redirection vers la connexion

**Validation :**
- [ ] Formulaire se charge correctement
- [ ] Sélecteur de rôle fonctionne
- [ ] Validation côté client fonctionne
- [ ] Inscription réussie
- [ ] Redirection fonctionne

---

### **Test 4 : Gestion des erreurs**
**Actions :**
1. ✅ **Connexion avec email inexistant :**
   ```
   Email: inexistant@test.com
   Mot de passe: password123
   ```
2. ✅ **Connexion avec mot de passe incorrect :**
   ```
   Email: admin@billettigue.com
   Mot de passe: mauvaispassword
   ```
3. ✅ **Inscription avec email déjà utilisé :**
   ```
   Email: admin@billettigue.com
   Mot de passe: password123
   ```

**Validation :**
- [ ] Messages d'erreur s'affichent
- [ ] Messages sont clairs et compréhensibles
- [ ] Formulaire ne se soumet pas avec données invalides

---

### **Test 5 : Responsivité**
**Actions :**
1. ✅ Ouvrir les DevTools (F12)
2. ✅ Activer le mode responsive
3. ✅ Tester différentes tailles d'écran :
   - Mobile (375px)
   - Tablette (768px)
   - Desktop (1024px+)

**Validation :**
- [ ] Interface s'adapte aux petites tailles
- [ ] Navigation mobile fonctionne
- [ ] Formulaires sont utilisables sur mobile
- [ ] Pas de problèmes d'affichage

---

### **Test 6 : Performance**
**Actions :**
1. ✅ Ouvrir les DevTools (F12)
2. ✅ Aller dans l'onglet "Network"
3. ✅ Recharger la page
4. ✅ Vérifier les temps de chargement

**Validation :**
- [ ] Pages se chargent rapidement (< 3s)
- [ ] Images sont optimisées
- [ ] Pas de requêtes inutiles
- [ ] Performance acceptable

## 🔧 Outils de test

### **Navigateur Chrome/Firefox**
- **F12** : Ouvrir les DevTools
- **Ctrl+Shift+I** : Inspecter les éléments
- **Ctrl+Shift+M** : Mode responsive
- **F5** : Recharger la page

### **Onglets DevTools utiles**
- **Console** : Voir les erreurs JavaScript
- **Network** : Analyser les requêtes API
- **Application** : Vérifier le localStorage
- **Elements** : Inspecter le HTML/CSS

## 📊 Checklist de validation

### **Fonctionnalité**
- [ ] Page d'accueil se charge
- [ ] Navigation fonctionne
- [ ] Connexion réussie
- [ ] Inscription réussie
- [ ] Gestion d'erreurs appropriée

### **Performance**
- [ ] Temps de chargement < 3s
- [ ] Pas d'erreurs dans la console
- [ ] Requêtes API rapides
- [ ] Interface responsive

### **Sécurité**
- [ ] Tokens JWT stockés correctement
- [ ] Validation côté client
- [ ] Messages d'erreur appropriés
- [ ] Pas de données sensibles exposées

### **UX/UI**
- [ ] Interface intuitive
- [ ] Messages d'erreur clairs
- [ ] Navigation fluide
- [ ] Design responsive

## 🚨 Problèmes courants

### **Erreur CORS**
**Symptôme :** Erreur dans la console "CORS policy"
**Solution :** Vérifier que le backend est démarré sur le port 5000

### **Erreur 404**
**Symptôme :** Page ne se charge pas
**Solution :** Vérifier les chemins des fichiers

### **Erreur JavaScript**
**Symptôme :** Erreurs dans la console
**Solution :** Vérifier que tous les fichiers JS sont chargés

### **Problème de responsive**
**Symptôme :** Interface ne s'adapte pas
**Solution :** Vérifier les media queries CSS

## 📝 Documentation des résultats

### **Template de rapport rapide**
```
Test: [NOM DU TEST]
Date: [DATE]
Résultat: ✅ Réussi / ❌ Échoué
Problèmes: [DÉTAILS]
Temps: [DURÉE]
```

### **Exemple :**
```
Test: Connexion utilisateur
Date: 14/12/2024
Résultat: ✅ Réussi
Problèmes: Aucun
Temps: 2 minutes
```

## 🎯 Prochaines étapes

Après avoir effectué ces tests :

1. **Documenter les résultats** dans le rapport
2. **Signaler les problèmes** rencontrés
3. **Tester l'application mobile** Flutter
4. **Effectuer les tests de sécurité**
5. **Implémenter les améliorations** suggérées

---

**💡 Conseil :** Gardez les DevTools ouverts pendant tous les tests pour détecter rapidement les problèmes ! 