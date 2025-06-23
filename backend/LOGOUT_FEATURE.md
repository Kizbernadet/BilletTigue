# 🚪 Fonctionnalité de Déconnexion - Billettigue Backend

## 📋 Vue d'ensemble

La fonctionnalité de déconnexion a été ajoutée au backend pour permettre aux utilisateurs de se déconnecter de manière sécurisée. Cette fonctionnalité implémente une **blacklist de tokens JWT** pour révoquer les tokens lors de la déconnexion.

## 🔧 Architecture

### **Composants ajoutés :**

1. **Modèle RevokedToken** (`models/revokedToken.js`)
   - Table `revoked_tokens` pour stocker les tokens révoqués
   - Champs : id, token, user_id, revoked_at, expires_at, reason

2. **Service d'authentification étendu** (`services/authService.js`)
   - `logout()` : Révoque un token
   - `isTokenRevoked()` : Vérifie si un token est révoqué
   - `cleanupExpiredTokens()` : Nettoie les tokens expirés

3. **Contrôleur de déconnexion** (`controllers/authController.js`)
   - `logout()` : Endpoint pour la déconnexion

4. **Route de déconnexion** (`routes/authRoutes.js`)
   - `POST /api/auth/logout` : Route protégée pour la déconnexion

5. **Middleware d'authentification amélioré** (`middlewares/authMiddleware.js`)
   - Vérification des tokens révoqués
   - Gestion des erreurs améliorée

## 🚀 Utilisation

### **Endpoint de déconnexion :**

```http
POST /api/auth/logout
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Réponse réussie (200) :**
```json
{
  "message": "Déconnexion réussie."
}
```

**Réponse d'erreur (401) :**
```json
{
  "message": "Token d'authentification manquant."
}
```

### **Exemple avec curl :**

```bash
# Se connecter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@billettigue.com","password":"Admin123!"}'

# Se déconnecter
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <token_obtenu>" \
  -H "Content-Type: application/json"
```

## 🔒 Sécurité

### **Mécanismes de sécurité :**

1. **Blacklist de tokens** : Les tokens révoqués sont stockés en base de données
2. **Vérification systématique** : Chaque requête authentifiée vérifie si le token est révoqué
3. **Nettoyage automatique** : Les tokens expirés sont supprimés automatiquement
4. **Protection des routes** : L'endpoint de déconnexion nécessite une authentification

### **Flux de sécurité :**

```
1. Utilisateur se connecte → Token JWT généré
2. Utilisateur se déconnecte → Token ajouté à la blacklist
3. Tentative d'accès avec token révoqué → Accès refusé (401)
4. Nettoyage automatique → Tokens expirés supprimés
```

## 🧪 Tests

### **Script de test automatique :**

```bash
# Installer les dépendances de test
npm install

# Lancer les tests de déconnexion
npm run test:logout
```

### **Tests effectués :**

1. **Test de connexion** : Vérifier qu'un utilisateur peut se connecter
2. **Test de déconnexion** : Vérifier que la déconnexion fonctionne
3. **Test de token révoqué** : Vérifier qu'un token révoqué ne fonctionne plus
4. **Test de nouvelle connexion** : Vérifier qu'on peut se reconnecter après déconnexion

## 🔧 Configuration

### **Variables d'environnement :**

```env
# Configuration JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h

# Configuration de la base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=billettigue_db
DB_USER=your_username
DB_PASS=your_password
```

### **Nettoyage automatique :**

Le serveur nettoie automatiquement les tokens expirés :
- **Fréquence** : Toutes les heures
- **Déclenchement** : Au démarrage du serveur + intervalle régulier
- **Logs** : Nombre de tokens supprimés affiché dans les logs

## 📊 Base de données

### **Table `revoked_tokens` :**

```sql
CREATE TABLE revoked_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES comptes(id),
    revoked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    reason VARCHAR DEFAULT 'logout'
);

-- Index pour optimiser les performances
CREATE INDEX idx_revoked_tokens_token ON revoked_tokens(token);
CREATE INDEX idx_revoked_tokens_user_id ON revoked_tokens(user_id);
CREATE INDEX idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);
```

### **Requêtes utiles :**

```sql
-- Voir tous les tokens révoqués
SELECT * FROM revoked_tokens ORDER BY revoked_at DESC;

-- Voir les tokens révoqués d'un utilisateur
SELECT * FROM revoked_tokens WHERE user_id = 1;

-- Compter les tokens révoqués
SELECT COUNT(*) FROM revoked_tokens;

-- Nettoyer manuellement les tokens expirés
DELETE FROM revoked_tokens WHERE expires_at < NOW();
```

## 🛠️ Maintenance

### **Nettoyage manuel :**

```javascript
const authService = require('./services/authService');

// Nettoyer les tokens expirés
const deletedCount = await authService.cleanupExpiredTokens();
console.log(`${deletedCount} tokens supprimés`);
```

### **Monitoring :**

- **Logs du serveur** : Affichage du nombre de tokens nettoyés
- **Base de données** : Requêtes pour surveiller la table `revoked_tokens`
- **Tests automatiques** : Script de test pour vérifier le bon fonctionnement

## 🚨 Dépannage

### **Problèmes courants :**

1. **Token toujours valide après déconnexion**
   - Vérifier que la table `revoked_tokens` est créée
   - Vérifier que le middleware vérifie les tokens révoqués

2. **Erreur de base de données**
   - Vérifier la connexion à PostgreSQL
   - Vérifier que les modèles sont synchronisés

3. **Performance dégradée**
   - Vérifier les index sur la table `revoked_tokens`
   - Ajuster la fréquence de nettoyage automatique

### **Logs utiles :**

```bash
# Vérifier les logs du serveur
tail -f logs/server.log

# Vérifier la base de données
psql -h localhost -U your_username -d billettigue_db -c "SELECT COUNT(*) FROM revoked_tokens;"
```

## 📈 Performance

### **Optimisations :**

1. **Index sur les colonnes clés** : `token`, `user_id`, `expires_at`
2. **Nettoyage automatique** : Suppression des tokens expirés
3. **Requêtes optimisées** : Utilisation de `findOne` avec index
4. **Cache optionnel** : Possibilité d'ajouter Redis pour les tokens révoqués

### **Métriques :**

- **Temps de vérification** : < 10ms par requête
- **Espace disque** : ~1KB par token révoqué
- **Nettoyage** : Suppression automatique des tokens expirés

## 🔄 Évolutions futures

### **Améliorations possibles :**

1. **Cache Redis** : Pour améliorer les performances
2. **Révocation en masse** : Révoquer tous les tokens d'un utilisateur
3. **Historique des connexions** : Traçabilité des sessions
4. **Notifications** : Alerter en cas de connexion suspecte
5. **Limitation de sessions** : Limiter le nombre de sessions actives

---

**📝 Note :** Cette fonctionnalité assure une déconnexion sécurisée en révoquant les tokens JWT, empêchant leur réutilisation après déconnexion. 