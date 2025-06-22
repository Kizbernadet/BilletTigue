# 🌐 GUIDE DE TEST COMPLET - FRONTEND BILLETTIGUE

## 🎯 État actuel du projet

### **✅ Backend (Port 5000)**
- **Statut :** ✅ Fonctionnel
- **Authentification :** ✅ Opérationnelle
- **Base de données :** ✅ Connectée
- **Compte admin :** ✅ Créé (admin@billettigue.com / admin123)

### **✅ Frontend (Port 3000)**
- **Statut :** ✅ Serveur démarré
- **URL :** http://localhost:3000
- **Pages :** Accueil, Connexion, Inscription
- **API :** Configurée pour localhost:5000

## 🚀 Instructions de test

### **Étape 1 : Accéder au frontend**
1. Ouvrez votre navigateur (Chrome recommandé)
2. Allez à l'adresse : **http://localhost:3000**
3. Vous devriez voir la page d'accueil de Billettigue

### **Étape 2 : Tester la page d'accueil**
**Actions à effectuer :**
- [ ] Vérifier que la page se charge
- [ ] Vérifier que le logo s'affiche
- [ ] Tester la navigation (Accueil, Bus, Colis, Aide)
- [ ] Tester le sélecteur de langue
- [ ] Tester le menu de connexion

**Validation attendue :**
- ✅ Page se charge sans erreur
- ✅ Tous les éléments sont visibles
- ✅ Navigation fonctionne
- ✅ Pas d'erreurs dans la console (F12)

---

### **Étape 3 : Tester la connexion**
**URL :** http://localhost:3000/pages/login.html

**Actions à effectuer :**
1. Cliquer sur "Se connecter" dans le menu
2. Remplir le formulaire :
   ```
   Email: admin@billettigue.com
   Mot de passe: admin123
   ```
3. Cliquer sur "Se connecter"
4. Vérifier la redirection vers l'accueil

**Validation attendue :**
- ✅ Formulaire se charge correctement
- ✅ Connexion réussie
- ✅ Redirection vers l'accueil
- ✅ Token JWT stocké (F12 → Application → Local Storage)

---

### **Étape 4 : Tester l'inscription**
**URL :** http://localhost:3000/pages/register.html

**Actions à effectuer :**
1. Cliquer sur "S'inscrire" depuis la page de connexion
2. Remplir le formulaire avec des données valides :
   ```
   Email: test@example.com
   Mot de passe: Test123!
   Confirmation: Test123!
   Service: Transport de personnes
   Prénom: Jean
   Nom: Dupont
   Rôle: Utilisateur
   ```
3. Cliquer sur "S'inscrire"
4. Vérifier la redirection vers la connexion

**Validation attendue :**
- ✅ Formulaire se charge correctement
- ✅ Sélecteur de rôle fonctionne
- ✅ Inscription réussie
- ✅ Redirection vers la connexion

---

### **Étape 5 : Tester la gestion des erreurs**

#### **5.1 Erreur de connexion**
**Actions :**
1. Aller sur la page de connexion
2. Essayer de se connecter avec :
   ```
   Email: inexistant@test.com
   Mot de passe: password123
   ```

**Validation attendue :**
- ✅ Message d'erreur s'affiche
- ✅ Message est clair et compréhensible

#### **5.2 Erreur d'inscription**
**Actions :**
1. Aller sur la page d'inscription
2. Essayer de s'inscrire avec :
   ```
   Email: admin@billettigue.com (déjà utilisé)
   Mot de passe: 123 (trop faible)
   ```

**Validation attendue :**
- ✅ Messages d'erreur s'affichent
- ✅ Validation empêche la soumission

---

### **Étape 6 : Tester la responsivité**
**Actions :**
1. Ouvrir les DevTools (F12)
2. Activer le mode responsive (Ctrl+Shift+M)
3. Tester différentes tailles :
   - Mobile (375px)
   - Tablette (768px)
   - Desktop (1024px+)

**Validation attendue :**
- ✅ Interface s'adapte aux petites tailles
- ✅ Navigation mobile fonctionne
- ✅ Formulaires sont utilisables sur mobile

---

### **Étape 7 : Vérifier les logs API**
**Actions :**
1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet "Console"
3. Effectuer une connexion ou inscription
4. Observer les logs API

**Validation attendue :**
- ✅ Logs de requêtes visibles
- ✅ Logs de réponses visibles
- ✅ Pas d'erreurs dans la console

## 🔧 Outils de débogage

### **DevTools Chrome/Firefox**
- **F12** : Ouvrir les DevTools
- **Console** : Voir les erreurs et logs
- **Network** : Analyser les requêtes API
- **Application** : Vérifier le localStorage
- **Elements** : Inspecter le HTML/CSS

### **Raccourcis utiles**
- **Ctrl+Shift+I** : Inspecter les éléments
- **Ctrl+Shift+M** : Mode responsive
- **F5** : Recharger la page
- **Ctrl+F5** : Recharger sans cache

## 📊 Checklist de validation complète

### **Fonctionnalité**
- [ ] Page d'accueil se charge
- [ ] Navigation fonctionne
- [ ] Connexion réussie
- [ ] Inscription réussie
- [ ] Gestion d'erreurs appropriée
- [ ] Sélecteur de rôle fonctionne
- [ ] Validation côté client

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
- [ ] Accessibilité respectée

## 🚨 Problèmes courants et solutions

### **Erreur CORS**
**Symptôme :** Erreur "CORS policy" dans la console
**Solution :** Vérifier que le backend est démarré sur le port 5000

### **Page ne se charge pas**
**Symptôme :** Erreur 404 ou page blanche
**Solution :** Vérifier l'URL et que le serveur frontend est démarré

### **Connexion échoue**
**Symptôme :** Message d'erreur lors de la connexion
**Solution :** Vérifier les identifiants et que le backend fonctionne

### **Problème de responsive**
**Symptôme :** Interface ne s'adapte pas
**Solution :** Vérifier les media queries CSS

## 📝 Documentation des résultats

### **Template de rapport**
```
Test: [NOM DU TEST]
Date: [DATE]
Heure: [HEURE]
Résultat: ✅ Réussi / ❌ Échoué
Problèmes: [DÉTAILS]
Temps: [DURÉE]
Observations: [NOTES]
```

### **Exemple de rapport**
```
Test: Connexion admin
Date: 14/12/2024
Heure: 17:45
Résultat: ✅ Réussi
Problèmes: Aucun
Temps: 30 secondes
Observations: Connexion rapide, redirection correcte
```

## 🎯 Prochaines étapes après les tests

1. **Documenter tous les résultats** dans le rapport
2. **Signaler les problèmes** rencontrés
3. **Tester l'application mobile** Flutter
4. **Effectuer les tests de sécurité** avancés
5. **Implémenter les améliorations** suggérées

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que le backend est démarré (port 5000)
2. Vérifiez que le frontend est accessible (port 3000)
3. Consultez la console du navigateur (F12)
4. Vérifiez les logs du serveur backend

---

**💡 Conseil :** Gardez les DevTools ouverts pendant tous les tests pour détecter rapidement les problèmes !

**🎉 Bon test !** 