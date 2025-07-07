# 🎯 Guide d'Utilisation du Menu Profil Global

## 📋 Vue d'ensemble

Le menu profil global permet d'afficher un bouton profil avec les informations de l'utilisateur connecté sur toutes les pages accessibles aux utilisateurs clients. Il remplace automatiquement le menu "Se connecter" quand l'utilisateur est authentifié.

## ✅ Pages déjà configurées

- ✅ `index.html` (page d'accueil)
- ✅ `pages/search-trajets.html` (recherche de trajets)
- ✅ `pages/reservation.html` (page de réservation)

## 🚀 Comment ajouter le menu profil à une nouvelle page

### Méthode 1 : Ajout manuel (recommandé)

1. **Ajouter le CSS** dans le `<head>` :
```html
<link href="../public/assets/css/profile-menu.css" rel="stylesheet">
```

2. **Ajouter le menu HTML** après le menu de connexion :
```html
<!-- Profile Menu (visible si connecté) -->
<div id="profile-menu" class="profile-dropdown-wrapper" style="display: none;">
    <button id="profileBtn" onclick="toggleProfileMenu()" class="profile-btn">
        <i class="fa-solid fa-user-circle"></i>
        <span id="profile-name">Utilisateur</span>
        <i class="fas fa-chevron-down text-xs"></i>
    </button>
    <ul class="profile-dropdown-menu" id="profileDropdown">
        <li class="profile-info">
            <div class="profile-header">
                <i class="fa-solid fa-user"></i>
                <div class="profile-details">
                    <span id="profile-full-name">Prénom Nom</span>
                    <span id="profile-role" class="profile-role">Utilisateur</span>
                </div>
            </div>
        </li>
        <li>
            <a href="profile.html" class="profile-dropdown-link">
                <i class="fa-solid fa-user"></i>
                Mon Profil
            </a>
        </li>
        <li>
            <a href="user-dashboard.html" class="profile-dropdown-link">
                <i class="fa-solid fa-tachometer-alt"></i>
                Mes Réservations
            </a>
        </li>
        <li>
            <a href="#" class="profile-dropdown-link">
                <i class="fa-solid fa-bell"></i>
                Notifications
            </a>
        </li>
        <li>
            <a href="#" class="profile-dropdown-link" onclick="logout()">
                <i class="fa-solid fa-sign-out-alt"></i>
                Déconnexion
            </a>
        </li>
    </ul>
</div>
```

3. **Ajouter le JavaScript** avant la fermeture de `</body>` :
```html
<script type="module" src="../src/js/profile-menu.js"></script>
```

### Méthode 2 : Injection automatique

Si vous voulez une solution plus simple, vous pouvez utiliser l'injecteur automatique :

```html
<script type="module" src="../src/js/global-profile-injector.js"></script>
```

⚠️ **Note** : Cette méthode nécessite que le menu de connexion (`#login-menu`) existe déjà dans la page.

## 🎨 Fonctionnalités du menu

### Affichage automatique
- **Utilisateur non connecté** : Affiche le menu "Se connecter"
- **Utilisateur connecté** : Affiche le bouton profil avec nom et rôle

### Informations affichées
- **Nom complet** : Prénom + Nom de l'utilisateur
- **Rôle** : Utilisateur, Transporteur, Admin
- **Avatar** : Icône utilisateur

### Options du menu
- **Mon Profil** : Lien vers la page de profil
- **Mes Réservations** : Lien vers le dashboard utilisateur
- **Notifications** : (À implémenter)
- **Déconnexion** : Déconnecte et redirige vers l'accueil

## 🔧 Personnalisation

### Modifier les liens
Vous pouvez personnaliser les liens dans le menu en modifiant les attributs `href` :

```html
<a href="votre-page.html" class="profile-dropdown-link">
    <i class="fa-solid fa-user"></i>
    Votre Texte
</a>
```

### Ajouter de nouvelles options
Pour ajouter une nouvelle option au menu :

```html
<li>
    <a href="nouvelle-page.html" class="profile-dropdown-link">
        <i class="fa-solid fa-cog"></i>
        Nouvelle Option
    </a>
</li>
```

### Modifier les styles
Les styles sont dans `public/assets/css/profile-menu.css`. Vous pouvez les personnaliser selon vos besoins.

## 🧪 Test du menu

1. **Connectez-vous** avec un compte utilisateur
2. **Naviguez** vers n'importe quelle page configurée
3. **Vérifiez** que le bouton profil apparaît avec vos informations
4. **Cliquez** sur le bouton pour ouvrir le menu
5. **Testez** la déconnexion

## 📱 Responsive

Le menu est entièrement responsive :
- **Desktop** : Affiche le nom complet
- **Mobile** : Affiche seulement l'icône
- **Tablette** : Adaptation automatique

## 🔒 Sécurité

- Vérification automatique du token d'authentification
- Suppression sécurisée des données de session lors de la déconnexion
- Protection contre les injections XSS

## 🐛 Dépannage

### Le menu ne s'affiche pas
1. Vérifiez que le CSS est bien chargé
2. Vérifiez que le JavaScript est bien inclus
3. Vérifiez la console pour les erreurs

### Les informations ne se mettent pas à jour
1. Vérifiez que `sessionStorage` contient `authToken` et `userData`
2. Vérifiez le format des données utilisateur

### Le menu ne se ferme pas
1. Vérifiez que les événements sont bien attachés
2. Vérifiez qu'il n'y a pas de conflit avec d'autres scripts

## 📞 Support

Pour toute question ou problème, consultez :
- Les logs de la console navigateur
- Le fichier `profile-menu.js` pour la logique
- Le fichier `profile-menu.css` pour les styles 