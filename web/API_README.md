# API BilletTigue - Documentation Frontend

## Vue d'ensemble

Cette documentation décrit l'utilisation de l'API REST pour connecter le frontend web au backend BilletTigue.

## Configuration

### URL de base
- **Développement** : `http://localhost:5000/api`
- **Production** : À configurer selon l'environnement

### Headers par défaut
```javascript
{
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
```

## Services API

### 1. Service d'Authentification (`AuthAPI`)

#### Inscription (`register`)
```javascript
import { AuthAPI } from './src/js/api/index.js';

const userData = {
    email: "user@example.com",
    password: "MotDePasse123!",
    role: "user", // ou "transporter"
    service: "passengers", // ou "packages"
    profile: {
        // Pour les utilisateurs
        lastName: "Dupont",
        firstName: "Jean"
        
        // Pour les transporteurs
        companyName: "Ma Compagnie",
        phoneNumber: "123456789"
    }
};

const result = await AuthAPI.register(userData);
```

#### Connexion (`login`)
```javascript
const credentials = {
    email: "user@example.com",
    password: "MotDePasse123!"
};

const result = await AuthAPI.login(credentials);
```

#### Déconnexion (`logout`)
```javascript
const result = await AuthAPI.logout();
```

#### Vérification du statut (`isAuthenticated`)
```javascript
const isLoggedIn = AuthAPI.isAuthenticated();
```

#### Récupération de l'utilisateur (`getCurrentUser`)
```javascript
const user = AuthAPI.getCurrentUser();
```

## Structure des réponses

### Réponse de succès
```javascript
{
    success: true,
    data: {
        // Données de la réponse
    },
    message: "Message de succès"
}
```

### Réponse d'erreur
```javascript
{
    success: false,
    status: 400, // Code d'erreur HTTP
    message: "Message d'erreur",
    data: {
        // Détails de l'erreur
    }
}
```

## Gestion des erreurs

L'API gère automatiquement les erreurs suivantes :
- Erreurs de réseau (connexion impossible)
- Erreurs de serveur (codes HTTP 4xx, 5xx)
- Erreurs de parsing JSON
- Timeout des requêtes

## Authentification

### Token JWT
L'API utilise des tokens JWT pour l'authentification :
- Le token est automatiquement sauvegardé dans `localStorage` lors de la connexion
- Le token est automatiquement inclus dans les headers des requêtes authentifiées
- Le token est supprimé lors de la déconnexion

### Headers d'authentification
```javascript
{
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
```

## Utilisation dans les pages

### Page de connexion
```html
<script type="module" src="../src/js/auth.js"></script>
```

### Page d'inscription
```html
<script type="module" src="../src/js/auth.js"></script>
```

## Test de l'API

Une page de test est disponible à `test-api.html` pour vérifier :
- La connexion au serveur
- L'inscription d'utilisateurs
- La connexion d'utilisateurs
- Le statut d'authentification

## Exemples d'utilisation

### Gestionnaire de formulaire de connexion
```javascript
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await AuthAPI.login({ email, password });
    
    if (result.success) {
        // Redirection vers le tableau de bord
        window.location.href = '/dashboard.html';
    } else {
        // Affichage de l'erreur
        alert(result.message);
    }
});
```

### Gestionnaire de formulaire d'inscription
```javascript
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.querySelector('input[name="role"]:checked').value,
        service: document.getElementById('services').value,
        profile: {
            // Données selon le rôle
        }
    };
    
    const result = await AuthAPI.register(formData);
    
    if (result.success) {
        // Redirection vers la page de connexion
        window.location.href = '/login.html';
    } else {
        // Affichage de l'erreur
        alert(result.message);
    }
});
```

## Sécurité

### Bonnes pratiques
1. **Validation côté client** : Toujours valider les données avant envoi
2. **Gestion des erreurs** : Afficher des messages d'erreur appropriés
3. **Protection CSRF** : Le backend gère la protection CSRF
4. **HTTPS** : Utiliser HTTPS en production
5. **Expiration des tokens** : Les tokens JWT ont une durée de vie limitée

### Stockage sécurisé
- Les tokens sont stockés dans `localStorage`
- Les données sensibles ne sont jamais stockées en clair
- La déconnexion supprime automatiquement toutes les données

## Dépendances

- **Fetch API** : Pour les requêtes HTTP
- **ES6 Modules** : Pour l'organisation du code
- **localStorage** : Pour le stockage des tokens

## Support

Pour toute question ou problème :
1. Vérifier la console du navigateur pour les erreurs
2. Utiliser la page de test `test-api.html`
3. Vérifier que le serveur backend est en cours d'exécution
4. Contrôler les logs du serveur backend 