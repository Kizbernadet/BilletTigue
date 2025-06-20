# API BilletTigue - Guide de démarrage

## 🚀 Démarrage rapide

### 1. Démarrer le serveur backend

#### Windows
```bash
# Double-cliquer sur le fichier
start-dev.bat

# Ou en ligne de commande
cd backend
npm install
npm start
```

#### Linux/Mac
```bash
# Rendre le script exécutable
chmod +x start-dev.sh

# Exécuter le script
./start-dev.sh

# Ou manuellement
cd backend
npm install
npm start
```

### 2. Vérifier que le serveur fonctionne

Le serveur devrait démarrer sur `http://localhost:5000`

Vous pouvez tester avec :
- **Page d'accueil** : http://localhost:5000
- **API de base** : http://localhost:5000/api

### 3. Tester l'API

Ouvrez le fichier `web/test-api.html` dans votre navigateur pour tester :
- La connexion au serveur
- L'inscription d'utilisateurs
- La connexion d'utilisateurs
- Le statut d'authentification

## 📁 Structure des fichiers

```
web/
├── src/js/api/
│   ├── config.js          # Configuration principale de l'API
│   ├── config.dev.js      # Configuration de développement
│   ├── authApi.js         # Service d'authentification
│   └── index.js           # Export des services
├── src/js/
│   ├── auth.js            # Gestionnaire d'authentification
│   └── main.js            # Script principal
├── pages/
│   ├── login.html         # Page de connexion
│   └── register.html      # Page d'inscription
├── test-api.html          # Page de test de l'API
└── API_README.md          # Documentation détaillée
```

## 🔧 Configuration

### Variables d'environnement

Le backend utilise les variables d'environnement suivantes (dans `backend/.env`) :
- `PORT` : Port du serveur (défaut: 5000)
- `DB_HOST` : Hôte de la base de données
- `DB_USER` : Utilisateur de la base de données
- `DB_PASS` : Mot de passe de la base de données
- `DB_NAME` : Nom de la base de données
- `JWT_SECRET` : Clé secrète pour les tokens JWT

### Configuration frontend

L'URL de l'API est configurée dans `web/src/js/api/config.dev.js` :
```javascript
BASE_URL: 'http://localhost:5000/api'
```

## 📡 Endpoints API

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription d'un nouvel utilisateur |
| POST | `/api/auth/login` | Connexion d'un utilisateur |
| POST | `/api/auth/logout` | Déconnexion d'un utilisateur |

### Format des données

#### Inscription
```json
{
  "email": "user@example.com",
  "password": "MotDePasse123!",
  "role": "user",
  "service": "passengers",
  "profile": {
    "lastName": "Dupont",
    "firstName": "Jean"
  }
}
```

#### Connexion
```json
{
  "email": "user@example.com",
  "password": "MotDePasse123!"
}
```

## 🛠️ Utilisation dans le code

### Import du service
```javascript
import { AuthAPI } from './src/js/api/index.js';
```

### Exemple d'inscription
```javascript
const userData = {
    email: "user@example.com",
    password: "MotDePasse123!",
    role: "user",
    service: "passengers",
    profile: {
        lastName: "Dupont",
        firstName: "Jean"
    }
};

const result = await AuthAPI.register(userData);
if (result.success) {
    console.log('Inscription réussie');
} else {
    console.error('Erreur:', result.message);
}
```

### Exemple de connexion
```javascript
const credentials = {
    email: "user@example.com",
    password: "MotDePasse123!"
};

const result = await AuthAPI.login(credentials);
if (result.success) {
    console.log('Connexion réussie');
    // Le token est automatiquement sauvegardé
} else {
    console.error('Erreur:', result.message);
}
```

## 🔍 Debug et logs

En mode développement, l'API affiche des logs détaillés dans la console :
- 🚀 Requêtes envoyées
- ✅ Réponses reçues
- ❌ Erreurs rencontrées

### Activer/désactiver les logs
Modifiez `web/src/js/api/config.dev.js` :
```javascript
LOG_REQUESTS: true,   // Log des requêtes
LOG_RESPONSES: true,  // Log des réponses
LOG_ERRORS: true      // Log des erreurs
```

## 🚨 Dépannage

### Problèmes courants

1. **Serveur ne démarre pas**
   - Vérifiez que Node.js est installé
   - Vérifiez les variables d'environnement
   - Consultez les logs d'erreur

2. **Erreur CORS**
   - Le backend est configuré pour accepter les requêtes depuis `localhost`
   - Vérifiez que vous accédez au frontend via `http://localhost`

3. **Erreur de connexion à la base de données**
   - Vérifiez les paramètres de connexion dans `.env`
   - Assurez-vous que la base de données est accessible

4. **Erreurs de validation**
   - Vérifiez le format des données envoyées
   - Consultez la documentation des endpoints

### Logs utiles

- **Backend** : Les logs s'affichent dans la console où le serveur a été démarré
- **Frontend** : Ouvrez la console du navigateur (F12) pour voir les logs de l'API

## 📚 Documentation complète

Pour plus de détails, consultez :
- `web/API_README.md` : Documentation complète de l'API
- `backend/README.md` : Documentation du backend

## 🤝 Support

En cas de problème :
1. Vérifiez les logs de la console
2. Testez avec `web/test-api.html`
3. Vérifiez la configuration
4. Consultez la documentation 