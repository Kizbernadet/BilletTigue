# 🚀 Guide de Déploiement - Administration des Transporteurs

## 📋 Vue d'ensemble

Ce guide détaille les étapes nécessaires pour déployer les fonctionnalités d'administration des transporteurs côté backend.

## ✅ Fonctionnalités implémentées

### 🔧 Routes API ajoutées
- `GET /api/admin/transporters/:id` - Récupérer un transporteur par ID
- `GET /api/admin/users/:id` - Récupérer un utilisateur par ID
- Amélioration de `GET /api/admin/transporters` avec pagination et filtres
- Amélioration de `GET /api/admin/users` avec pagination et filtres
- Amélioration de `PUT /api/admin/transporters/:id` avec validation
- Amélioration de `DELETE /api/admin/transporters/:id` avec actions multiples

### 🗄️ Modèle de données amélioré
- Ajout de colonnes de sécurité dans la table `comptes`
- Support des statistiques de connexion
- Gestion des tentatives de connexion échouées
- Vérification email/téléphone

## 🚀 Étapes de déploiement

### 1. Exécuter la migration de base de données

```bash
cd backend
node run-admin-migration.js
```

Cette commande ajoutera les colonnes suivantes à la table `comptes` :
- `email_verified` (BOOLEAN)
- `phone_verified` (BOOLEAN)
- `last_login` (DATE)
- `login_attempts` (INTEGER)
- `failed_logins` (INTEGER)
- `last_failed_login` (DATE)
- `account_locked` (BOOLEAN)
- `password_changed_at` (DATE)

### 2. Redémarrer le serveur backend

```bash
npm run dev
# ou
node server.js
```

### 3. Tester les nouvelles routes

#### Test de récupération des transporteurs avec pagination
```bash
curl -X GET "http://localhost:3000/api/admin/transporters?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### Test de récupération d'un transporteur par ID
```bash
curl -X GET "http://localhost:3000/api/admin/transporters/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### Test de mise à jour d'un transporteur
```bash
curl -X PUT "http://localhost:3000/api/admin/transporters/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "company_name": "Nouveau nom",
    "phone_number": "Nouveau téléphone",
    "status": "active"
  }'
```

#### Test de suppression/désactivation
```bash
curl -X DELETE "http://localhost:3000/api/admin/transporters/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "action": "suspend",
    "reason": "Violation des conditions",
    "notify": true
  }'
```

## 🔍 Fonctionnalités détaillées

### 📊 Pagination et filtres
Les routes `GET /api/admin/transporters` et `GET /api/admin/users` supportent :
- **Pagination** : `?page=1&limit=10`
- **Recherche** : `?search=terme`
- **Filtre par statut** : `?status=active`
- **Filtre par type** : `?company_type=passenger-carrier`

### 🛡️ Actions de suppression/désactivation
La route `DELETE /api/admin/transporters/:id` supporte 3 actions :
- `suspend` : Suspendre le compte (statut = 'suspended')
- `deactivate` : Désactiver temporairement (statut = 'inactive')
- `delete` : Supprimer définitivement

### 📧 Notifications (TODO)
- Envoi d'email automatique lors des actions admin
- Logging des actions administrateur
- Historique des modifications

## 🐛 Dépannage

### Erreur de migration
Si la migration échoue, vérifiez :
1. La connexion à la base de données
2. Les permissions sur la table `comptes`
3. Les contraintes existantes

### Erreur 404 sur les routes
Vérifiez :
1. Le serveur backend est démarré
2. Les routes sont bien enregistrées dans `server.js`
3. Le middleware d'authentification admin fonctionne

### Erreur de permissions
Assurez-vous que :
1. L'utilisateur a le rôle `admin`
2. Le token JWT est valide
3. Le middleware `admin` est bien configuré

## 📝 Notes importantes

### Données factices
Certaines données (statistiques, revenus) sont actuellement factices. Pour les vraies données :
1. Créer les tables appropriées (trajets, paiements, etc.)
2. Modifier `getTransporterById` pour récupérer les vraies statistiques
3. Implémenter les calculs de revenus

### Sécurité
- Toutes les routes admin nécessitent une authentification
- Validation des données côté serveur
- Logging des actions sensibles
- Protection contre les injections SQL

### Performance
- Pagination pour éviter le chargement de trop de données
- Index sur les colonnes de recherche
- Cache pour les statistiques fréquemment consultées

## 🎯 Prochaines étapes

1. **Implémenter les vraies statistiques** depuis les tables de trajets
2. **Ajouter le système de notifications email**
3. **Créer un système de logging admin**
4. **Implémenter la gestion des documents**
5. **Ajouter des rapports et exports**

## 📞 Support

En cas de problème, vérifiez :
1. Les logs du serveur backend
2. La console du navigateur
3. Les erreurs de base de données
4. La documentation des modèles Sequelize 
