# Test de la Page de Profil - BilletTigue

## 🎯 Objectif
Vérifier que la page de profil web fonctionne correctement avec toutes ses fonctionnalités.

## 📋 Checklist de Test

### 1. **Accès à la page de profil**
- [ ] Se connecter avec un compte utilisateur existant
- [ ] Vérifier que le menu utilisateur apparaît dans la topbar
- [ ] Cliquer sur "Mon Profil" dans le menu utilisateur
- [ ] Vérifier que la page de profil se charge correctement

### 2. **Affichage des données du profil**
- [ ] Vérifier que les informations utilisateur sont pré-remplies :
  - [ ] Prénom
  - [ ] Nom
  - [ ] Email (en lecture seule)
  - [ ] Numéro de téléphone
  - [ ] Adresse
- [ ] Vérifier que le nom d'utilisateur s'affiche dans la topbar

### 3. **Modification des informations personnelles**
- [ ] Modifier le prénom
- [ ] Modifier le nom
- [ ] Modifier le numéro de téléphone
- [ ] Modifier l'adresse
- [ ] Cliquer sur "Sauvegarder les modifications"
- [ ] Vérifier que le message de succès apparaît
- [ ] Recharger la page et vérifier que les modifications sont persistées

### 4. **Changement de mot de passe**
- [ ] Remplir le champ "Mot de passe actuel"
- [ ] Remplir le champ "Nouveau mot de passe" (minimum 6 caractères)
- [ ] Confirmer le nouveau mot de passe
- [ ] Cliquer sur "Sauvegarder les modifications"
- [ ] Vérifier que le message de succès apparaît
- [ ] Se déconnecter et se reconnecter avec le nouveau mot de passe

### 5. **Validation des formulaires**
- [ ] Essayer de sauvegarder sans prénom → Vérifier le message d'erreur
- [ ] Essayer de sauvegarder sans nom → Vérifier le message d'erreur
- [ ] Essayer de changer le mot de passe sans mot de passe actuel → Vérifier le message d'erreur
- [ ] Essayer de changer le mot de passe avec un mot de passe trop court → Vérifier le message d'erreur
- [ ] Essayer de changer le mot de passe avec des mots de passe qui ne correspondent pas → Vérifier le message d'erreur

### 6. **Gestion des erreurs**
- [ ] Tester avec un mot de passe actuel incorrect → Vérifier le message d'erreur
- [ ] Simuler une erreur réseau → Vérifier le message d'erreur approprié
- [ ] Vérifier que les messages d'erreur disparaissent automatiquement après 5 secondes

### 7. **Fonctionnalités de navigation**
- [ ] Cliquer sur "Annuler" → Vérifier que le formulaire se réinitialise
- [ ] Cliquer sur "Déconnexion" → Vérifier la redirection vers la page d'accueil
- [ ] Vérifier que le bouton retour fonctionne correctement

### 8. **Responsive Design**
- [ ] Tester sur mobile (largeur < 768px)
- [ ] Vérifier que le formulaire s'adapte correctement
- [ ] Vérifier que les boutons sont pleine largeur sur mobile

## 🚀 Instructions de Test

### Prérequis
1. Le backend doit être démarré sur le port 5000
2. Un compte utilisateur doit exister dans la base de données

### Étapes de test
1. Ouvrir `http://localhost:5000` dans le navigateur
2. Se connecter avec un compte utilisateur existant
3. Naviguer vers la page de profil
4. Effectuer les tests listés ci-dessus

## 🐛 Problèmes connus
- Aucun problème connu pour le moment

## ✅ Critères de succès
- [ ] Toutes les fonctionnalités de base fonctionnent
- [ ] Les validations de formulaire sont correctes
- [ ] Les messages d'erreur et de succès s'affichent correctement
- [ ] La page est responsive
- [ ] Les données sont persistées en base de données

## 📝 Notes
- La page de profil est accessible uniquement aux utilisateurs connectés
- L'email ne peut pas être modifié (champ en lecture seule)
- Les mots de passe sont validés côté client et serveur
- Les messages de notification apparaissent en haut à droite de l'écran 