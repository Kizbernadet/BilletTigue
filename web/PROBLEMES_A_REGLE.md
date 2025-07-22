# 📋 Fonctionnalités Restantes & Problèmes Non Résolus

## 🚧 Fonctionnalités Restantes à Implémenter

1. **Modification du mot de passe utilisateur**
   - Modale dédiée pour changer le mot de passe (frontend + backend)
   - Validation du mot de passe actuel et du nouveau mot de passe
   - Retour utilisateur (succès/erreur)

2. **Notifications utilisateur**
   - Affichage des notifications dans le menu profil
   - Backend : endpoint pour récupérer les notifications
   - Marquage comme lues/non lues

3. **Upload et gestion de la photo de profil**
   - Ajout d’un champ pour uploader une image dans la modale profil
   - Stockage côté backend et affichage côté frontend

4. **Gestion avancée des rôles et permissions**
   - Affichage conditionnel des menus/options selon le rôle (user, transporteur, admin)
   - Sécurité backend renforcée

5. **Dashboard administrateur : gestion des utilisateurs et transporteurs**
   - CRUD complet sur les comptes
   - Filtres, recherche, pagination

6. **Historique des modifications de profil**
   - Affichage des anciennes valeurs ou logs de modification

7. **Amélioration de l’accessibilité et du responsive**
   - Tests sur mobile/tablette
   - Ajustements CSS pour une meilleure expérience utilisateur

8. **Tests automatisés (frontend et backend)**
   - Ajout de tests unitaires et d’intégration

---

## ❌ Problèmes Non Résolus / Bugs à Corriger

1. **Modification du numéro de téléphone non répercutée en base**
   - Cause probable : le frontend envoie `phone` alors que le backend attend `phoneNumber`.
   - Solution : harmoniser les noms de champs entre frontend et backend.

2. **Redirections erronées vers `/web/pages/profile.html`**
   - Certains liens ou redirections JS utilisaient encore l’ancien chemin.
   - Correction en cours : tous les chemins doivent pointer vers `/pages/profile.html`.

3. **Erreur `Cannot set properties of null (setting 'innerHTML')` dans `profile.js`**
   - Cause : l’élément `#profileContainer` n’existe pas sur toutes les pages.
   - Solution : ajouter le conteneur ou retirer l’appel à `renderProfile()` sur les pages concernées.

4. **Erreur de parsing JSON lors de la sauvegarde du profil**
   - Cause : le backend ne renvoie pas toujours un JSON valide (réponse vide ou HTML d’erreur).
   - Solution : améliorer la gestion d’erreur côté frontend et s’assurer que le backend renvoie toujours un JSON.

5. **Accès API impossible via Live Server (port 5500)**
   - Cause : Live Server ne gère pas les routes API, il faut utiliser le port du backend Express (ex : 5000).

6. **Validation des champs de profil perfectible**
   - Améliorer les messages d’erreur et la robustesse des regex (email, téléphone, etc.).

7. **Notifications et feedback utilisateur à améliorer**
   - Ajouter des messages de succès/erreur plus visibles et accessibles.

---

**À mettre à jour au fur et à mesure de l’avancement du projet.** 