# 🎯 GUIDE DE TEST - TABLEAUX DE BORD BILLETTIGUE

## 📋 Vue d'ensemble

Deux nouvelles pages de test ont été créées pour vérifier l'authentification et la gestion des rôles :

### **📄 Pages créées :**
1. **Tableau de bord Utilisateur** : `web/pages/user-dashboard.html`
2. **Tableau de bord Administrateur** : `web/pages/admin-dashboard.html`

### **🔧 Fonctionnalités :**
- ✅ Affichage des informations utilisateur connecté
- ✅ Gestion des permissions selon le rôle
- ✅ Redirection automatique selon le rôle
- ✅ Boutons de déconnexion fonctionnels
- ✅ Interface responsive et moderne

## 🚀 Instructions de test

### **Étape 1 : Test de connexion administrateur**
**URL de connexion :** http://localhost:3000/pages/login.html

**Actions :**
1. Ouvrir la page de connexion
2. Remplir le formulaire avec les identifiants admin :
   ```
   Email: admin@billettigue.com
   Mot de passe: admin123
   ```
3. Cliquer sur "Se connecter"

**Résultat attendu :**
- ✅ Connexion réussie
- ✅ Redirection automatique vers `admin-dashboard.html`
- ✅ Affichage du tableau de bord administrateur

**Validation :**
- [ ] Page se charge correctement
- [ ] Message "Connexion administrateur réussie !" visible
- [ ] Badge "Compte administrateur connecté" affiché
- [ ] Statistiques affichées (150 utilisateurs, 25 transporteurs, etc.)
- [ ] Informations admin visibles (email, rôle, permissions)

---

### **Étape 2 : Test de connexion utilisateur**
**Actions :**
1. Se déconnecter (bouton "Se déconnecter")
2. Retourner à la page de connexion
3. Créer un nouveau compte utilisateur via l'inscription
4. Ou utiliser un compte existant (si disponible)

**Résultat attendu :**
- ✅ Connexion réussie
- ✅ Redirection automatique vers `user-dashboard.html`
- ✅ Affichage du tableau de bord utilisateur

**Validation :**
- [ ] Page se charge correctement
- [ ] Message "Connexion réussie !" visible
- [ ] Badge "Compte connecté" affiché
- [ ] Informations utilisateur visibles (email, rôle, date de connexion)

---

### **Étape 3 : Test des permissions**
**Actions :**
1. Se connecter en tant qu'utilisateur normal
2. Essayer d'accéder directement à `admin-dashboard.html`
3. Observer le comportement

**Résultat attendu :**
- ✅ Message d'erreur "Accès refusé"
- ✅ Redirection vers la page de connexion

**Actions :**
1. Se connecter en tant qu'administrateur
2. Essayer d'accéder directement à `user-dashboard.html`
3. Observer le comportement

**Résultat attendu :**
- ✅ Redirection automatique vers `admin-dashboard.html`

---

### **Étape 4 : Test de déconnexion**
**Actions :**
1. Être connecté sur n'importe quel tableau de bord
2. Cliquer sur "Se déconnecter" (bouton en haut ou en bas)
3. Observer le comportement

**Résultat attendu :**
- ✅ Message "Déconnexion réussie"
- ✅ Redirection vers la page d'accueil
- ✅ Token JWT supprimé du localStorage

---

### **Étape 5 : Test d'accès non authentifié**
**Actions :**
1. Se déconnecter
2. Essayer d'accéder directement à `user-dashboard.html`
3. Observer le comportement

**Résultat attendu :**
- ✅ Message "Vous devez être connecté"
- ✅ Redirection vers la page de connexion

---

### **Étape 6 : Test de responsivité**
**Actions :**
1. Ouvrir les DevTools (F12)
2. Activer le mode responsive (Ctrl+Shift+M)
3. Tester différentes tailles d'écran sur les deux tableaux de bord

**Validation :**
- [ ] Interface s'adapte aux petites tailles
- [ ] Boutons restent accessibles
- [ ] Informations restent lisibles
- [ ] Pas de problèmes d'affichage

## 📊 URLs de test

### **Pages d'authentification :**
- **Connexion :** http://localhost:3000/pages/login.html
- **Inscription :** http://localhost:3000/pages/register.html

### **Tableaux de bord :**
- **Utilisateur :** http://localhost:3000/pages/user-dashboard.html
- **Administrateur :** http://localhost:3000/pages/admin-dashboard.html

### **Identifiants de test :**
- **Admin :** admin@billettigue.com / admin123
- **Utilisateur :** Créer via l'inscription

## 🔍 Fonctionnalités à vérifier

### **Tableau de bord Utilisateur :**
- [ ] Affichage des informations utilisateur
- [ ] Boutons d'action (Retour accueil, Réservations, Profil)
- [ ] Bouton de déconnexion fonctionnel
- [ ] Design responsive
- [ ] Messages d'erreur appropriés

### **Tableau de bord Administrateur :**
- [ ] Affichage des informations admin
- [ ] Statistiques affichées
- [ ] Boutons d'action (Gérer utilisateurs, Statistiques, Paramètres)
- [ ] Design avec gradient et icônes spéciales
- [ ] Permissions d'accès restreintes

### **Gestion des rôles :**
- [ ] Redirection automatique selon le rôle
- [ ] Protection des pages selon les permissions
- [ ] Messages d'erreur appropriés pour accès refusé
- [ ] Gestion des tokens JWT

## 🚨 Problèmes courants

### **Erreur de redirection**
**Symptôme :** Redirection vers la mauvaise page
**Solution :** Vérifier que le rôle est correctement défini dans la base de données

### **Page ne se charge pas**
**Symptôme :** Erreur 404 ou page blanche
**Solution :** Vérifier que les fichiers sont bien créés dans `web/pages/`

### **Erreur JavaScript**
**Symptôme :** Erreurs dans la console
**Solution :** Vérifier que le fichier `dashboard.js` est bien chargé

### **Problème de permissions**
**Symptôme :** Accès refusé même avec le bon rôle
**Solution :** Vérifier le token JWT et les données utilisateur

## 📝 Checklist de validation

### **Fonctionnalité**
- [ ] Connexion admin redirige vers admin-dashboard
- [ ] Connexion utilisateur redirige vers user-dashboard
- [ ] Accès refusé pour utilisateur sur admin-dashboard
- [ ] Redirection automatique pour admin sur user-dashboard
- [ ] Déconnexion fonctionne sur les deux pages
- [ ] Accès non authentifié redirige vers login

### **Interface**
- [ ] Design moderne et responsive
- [ ] Informations utilisateur affichées correctement
- [ ] Boutons d'action fonctionnels
- [ ] Messages d'erreur clairs
- [ ] Badges de statut visibles

### **Sécurité**
- [ ] Vérification d'authentification
- [ ] Vérification des permissions
- [ ] Gestion sécurisée des tokens
- [ ] Redirection appropriée selon le rôle

## 🎯 Tests supplémentaires recommandés

### **Tests de performance :**
1. Temps de chargement des pages
2. Responsivité sur différents appareils
3. Gestion de la mémoire

### **Tests de sécurité :**
1. Tentative d'accès direct aux URLs
2. Manipulation des tokens JWT
3. Tests de session expirée

### **Tests d'accessibilité :**
1. Navigation au clavier
2. Lecteurs d'écran
3. Contraste des couleurs

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez que le backend est démarré
3. Vérifiez les identifiants de connexion
4. Vérifiez que tous les fichiers sont créés

---

**💡 Conseil :** Testez d'abord la connexion admin, puis créez un compte utilisateur pour tester les deux tableaux de bord !

**🎉 Bon test !** 