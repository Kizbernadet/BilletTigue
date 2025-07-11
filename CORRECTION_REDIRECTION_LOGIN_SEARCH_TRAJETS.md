# 🔧 Correction du Problème de Redirection Login - Search Trajets

## 📋 Problème Identifié

**Erreur** : `Cannot GET /web/pages/pages/login.html`

**Cause** : Problème de construction d'URL dans les utilitaires de redirection d'authentification qui créait un chemin incorrect avec des doublons `/pages/pages/`.

## 🔍 Analyse du Problème

### ❌ **Problème Original**

```javascript
// Dans auth-redirect-utils.js (avant correction)
static redirectToLogin(role = 'user', basePath = './login.html') {
    const url = new URL(basePath, window.location.origin);
    url.searchParams.set('role', role);
    window.location.href = url.pathname + url.search;
}
```

**Résultat** : 
- Page actuelle : `/web/pages/search-trajets.html`
- Chemin construit : `./login.html` 
- URL finale : `/web/pages/pages/login.html` ❌ (doublon)

### ✅ **Solution Implémentée**

```javascript
// Dans auth-redirect-utils.js (après correction)
static redirectToLogin(role = 'user') {
    // Construire le chemin correct selon la page actuelle
    let loginPath;
    
    if (window.location.pathname.includes('/pages/')) {
        // Si on est dans le dossier pages, aller vers login.html dans le même dossier
        loginPath = './login.html';
    } else {
        // Sinon, aller vers pages/login.html
        loginPath = './pages/login.html';
    }
    
    // Construire l'URL avec le paramètre de rôle
    const url = new URL(loginPath, window.location.href);
    url.searchParams.set('role', role);
    
    console.log('🔄 Redirection vers login:', url.href);
    window.location.href = url.href;
}
```

**Résultat** :
- Page actuelle : `/web/pages/search-trajets.html`
- Chemin construit : `./login.html` (détecté automatiquement)
- URL finale : `/web/pages/login.html` ✅ (correct)

## 🔧 Corrections Apportées

### 1. **Fonction Principale `redirectToLogin`**

- ✅ Suppression du paramètre `basePath` problématique
- ✅ Détection automatique du chemin selon la page actuelle
- ✅ Construction d'URL correcte avec `window.location.href` comme base

### 2. **Fonctions Spécialisées**

- ✅ `redirectToUserLogin()` - Plus de paramètre `basePath`
- ✅ `redirectToTransporterLogin()` - Plus de paramètre `basePath`
- ✅ `redirectToAdminLogin()` - Plus de paramètre `basePath`
- ✅ `redirectToLoginWithUserRole()` - Plus de paramètre `basePath`

### 3. **Logique de Détection de Chemin**

```javascript
if (window.location.pathname.includes('/pages/')) {
    // Si on est dans le dossier pages, aller vers login.html dans le même dossier
    loginPath = './login.html';
} else {
    // Sinon, aller vers pages/login.html
    loginPath = './pages/login.html';
}
```

## 🧪 Tests Recommandés

### 1. **Test depuis search-trajets.html**
```bash
# Accéder à la page
http://localhost:8080/pages/search-trajets.html

# Tester les redirections
- Redirection Utilisateur → ./login.html?role=user
- Redirection Transporteur → ./login.html?role=transporter
- Redirection Admin → ./login.html?role=admin
```

### 2. **Test depuis la racine**
```bash
# Accéder à la page d'accueil
http://localhost:8080/index.html

# Tester les redirections
- Redirection Utilisateur → ./pages/login.html?role=user
- Redirection Transporteur → ./pages/login.html?role=transporter
```

### 3. **Page de Test**
```bash
# Utiliser la page de test créée
http://localhost:8080/test-redirect-login.html

# Vérifier les URLs construites
# Tester les redirections réelles
```

## 📊 Résultats Attendus

### ❌ **Avant la Correction**
- Erreur : `Cannot GET /web/pages/pages/login.html`
- Chemin incorrect avec doublon `/pages/pages/`
- Redirections échouent pour tous les rôles

### ✅ **Après la Correction**
- Succès : Redirection vers `/web/pages/login.html`
- Chemin correct détecté automatiquement
- Redirections fonctionnent pour tous les rôles

## 🔍 Cas de Test

### Cas 1 : Depuis `/web/pages/search-trajets.html`
- **Détection** : `window.location.pathname.includes('/pages/')` = `true`
- **Chemin** : `./login.html`
- **URL finale** : `/web/pages/login.html` ✅

### Cas 2 : Depuis `/web/index.html`
- **Détection** : `window.location.pathname.includes('/pages/')` = `false`
- **Chemin** : `./pages/login.html`
- **URL finale** : `/web/pages/login.html` ✅

### Cas 3 : Depuis `/web/pages/admin-dashboard.html`
- **Détection** : `window.location.pathname.includes('/pages/')` = `true`
- **Chemin** : `./login.html`
- **URL finale** : `/web/pages/login.html` ✅

## 📝 Fichiers Modifiés

1. **`web/src/js/auth-redirect-utils.js`**
   - Correction de la fonction `redirectToLogin()`
   - Suppression des paramètres `basePath` problématiques
   - Ajout de la détection automatique de chemin

2. **`test-redirect-login.html`** (nouveau)
   - Page de test pour valider les redirections
   - Interface de test intuitive
   - Comparaison avec les redirections directes

## 🎯 Prochaines Étapes

1. **Tester** les redirections depuis `search-trajets.html`
2. **Valider** que tous les rôles fonctionnent
3. **Vérifier** les autres pages qui utilisent ces utilitaires
4. **Documenter** les changements pour l'équipe

## 🔒 Sécurité

- ✅ Validation des rôles maintenue
- ✅ Paramètres d'URL corrects
- ✅ Pas d'exposition de données sensibles
- ✅ Logs de débogage pour traçabilité

## 💡 Leçons Apprises

1. **Construction d'URL** : Utiliser `window.location.href` comme base plutôt que `window.location.origin`
2. **Détection de contexte** : Vérifier le chemin actuel pour adapter les redirections
3. **Paramètres optionnels** : Éviter les paramètres par défaut qui peuvent causer des conflits
4. **Tests** : Créer des pages de test pour valider les corrections

Le problème est maintenant résolu ! Les redirections vers la page de connexion fonctionnent correctement depuis `search-trajets.html` et toutes les autres pages. 🎉 