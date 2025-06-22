# 📋 MODÈLES SEQUELIZE - CORRECTIONS APPORTÉES

## 🔧 **Problèmes identifiés et corrigés**

### **1. Incohérence des noms de fichiers**
- **Problème** : Le fichier `index.js` importait des modèles avec des noms en majuscules
- **Solution** : Correction des imports pour correspondre aux noms de fichiers réels

### **2. Modèle `colis.js` vide**
- **Problème** : Le fichier ne contenait qu'un espace
- **Solution** : Création complète du modèle avec tous les champs nécessaires

### **3. Noms de tables incohérents**
- **Problème** : Mélange de conventions (camelCase, snake_case, singulier/pluriel)
- **Solution** : Standardisation selon la restructuration de la base de données

### **4. Références de clés étrangères incorrectes**
- **Problème** : Références vers des tables et colonnes inexistantes
- **Solution** : Mise à jour des références selon la nouvelle structure

## 📊 **Changements appliqués**

### **Tables renommées (singulier → pluriel)**
| Ancien nom | Nouveau nom |
|------------|-------------|
| `role` | `roles` |
| `compte` | `comptes` |
| `utilisateur` | `utilisateurs` |
| `transporteur` | `transporteurs` |
| `administrateur` | `administrateurs` |
| `trajet` | `trajets` |
| `envoi` | `envois` |
| `paiement` | `paiements` |
| `reservation` | `reservations` |
| `pointDepot` | `point_depot` |

### **Colonnes renommées (camelCase → snake_case)**
| Ancien nom | Nouveau nom |
|------------|-------------|
| `idRole` | `id` |
| `nomRole` | `name` |
| `idCompte` | `id` |
| `motDePasse` | `password_hash` |
| `statut` | `status` |
| `idUtilisateur` | `id` |
| `nom` | `last_name` |
| `prenom` | `first_name` |
| `telephone` | `phone_number` |
| `villeDepart` | `departure_city` |
| `villeArrivee` | `arrival_city` |
| `dateHeure` | `departure_time` |
| `prix` | `price` |

### **Clés étrangères standardisées**
| Ancien nom | Nouveau nom |
|------------|-------------|
| `idRole` | `role_id` |
| `idCompte` | `compte_id` |
| `idTransporteur` | `transporteur_id` |
| `idUtilisateur` | `utilisateur_id` |
| `idExpediteur` | `expediteur_id` |
| `idEnvoi` | `envoi_id` |
| `idTrajet` | `trajet_id` |

## 🏗️ **Structure finale des modèles**

### **1. Role (roles)**
```javascript
{
  id: INTEGER (PK),
  name: STRING(50) UNIQUE,
  description: TEXT,
  created_at: DATE,
  updated_at: DATE
}
```

### **2. Compte (comptes)**
```javascript
{
  id: INTEGER (PK),
  email: STRING UNIQUE,
  password_hash: STRING,
  status: STRING DEFAULT 'active',
  role_id: INTEGER (FK → roles.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **3. Utilisateur (utilisateurs)**
```javascript
{
  id: INTEGER (PK),
  last_name: STRING,
  first_name: STRING,
  phone_number: STRING,
  compte_id: INTEGER (FK → comptes.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **4. Transporteur (transporteurs)**
```javascript
{
  id: INTEGER (PK),
  last_name: STRING,
  first_name: STRING,
  phone_number: STRING,
  company_name: STRING,
  compte_id: INTEGER (FK → comptes.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **5. Administrateur (administrateurs)**
```javascript
{
  id: INTEGER (PK),
  last_name: STRING,
  first_name: STRING,
  compte_id: INTEGER (FK → comptes.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **6. Trajet (trajets)**
```javascript
{
  id: INTEGER (PK),
  departure_city: STRING,
  arrival_city: STRING,
  departure_time: DATE,
  price: DECIMAL(10,2),
  transporteur_id: INTEGER (FK → transporteurs.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **7. Envoi (envois)**
```javascript
{
  id: INTEGER (PK),
  description: STRING,
  status: STRING DEFAULT 'pending',
  expediteur_id: INTEGER (FK → utilisateurs.id),
  recipient_name: STRING,
  recipient_phone: STRING,
  transporteur_id: INTEGER (FK → transporteurs.id),
  compte_id: INTEGER (FK → comptes.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **8. Paiement (paiements)**
```javascript
{
  id: INTEGER (PK),
  amount: DECIMAL(10,2),
  status: STRING DEFAULT 'pending',
  payment_date: DATE,
  envoi_id: INTEGER (FK → envois.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **9. Reservation (reservations)**
```javascript
{
  id: INTEGER (PK),
  reservation_date: DATE,
  passenger_name: STRING,
  phone_number: STRING,
  trajet_id: INTEGER (FK → trajets.id),
  compte_id: INTEGER (FK → comptes.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **10. PointDepot (point_depot)**
```javascript
{
  id: INTEGER (PK),
  adresse: STRING,
  transporteur_id: INTEGER (FK → transporteurs.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **11. Colis (colis)**
```javascript
{
  id: INTEGER (PK),
  description: STRING,
  poids: DECIMAL(8,2),
  dimensions: STRING,
  valeur: DECIMAL(10,2),
  statut: STRING DEFAULT 'en_attente',
  envoi_id: INTEGER (FK → envois.id),
  created_at: DATE,
  updated_at: DATE
}
```

## 🔗 **Associations définies**

### **Relations principales**
- **Role 1,N Compte** : Un rôle peut avoir plusieurs comptes
- **Compte 1,1 Utilisateur/Transporteur/Administrateur** : Un compte peut être lié à un seul profil
- **Transporteur 1,N PointDepot** : Un transporteur peut avoir plusieurs points de dépôt
- **Transporteur 1,N Trajet** : Un transporteur peut proposer plusieurs trajets
- **Utilisateur 1,N Envoi** : Un utilisateur peut faire plusieurs envois
- **Transporteur 1,N Envoi** : Un transporteur peut gérer plusieurs envois
- **Envoi 1,1 Paiement** : Chaque envoi a un paiement associé
- **Compte 1,N Reservation** : Un compte peut faire plusieurs réservations
- **Trajet 1,N Reservation** : Un trajet peut avoir plusieurs réservations
- **Envoi 1,N Colis** : Un envoi peut contenir plusieurs colis

## ✅ **Résultat**

Tous les modèles sont maintenant :
- ✅ **Cohérents** avec la restructuration de la base de données
- ✅ **Standardisés** avec les conventions snake_case
- ✅ **Complets** avec tous les champs nécessaires
- ✅ **Correctement associés** avec les bonnes relations
- ✅ **Prêts** pour l'utilisation avec Sequelize

## 🚀 **Utilisation**

Pour utiliser ces modèles, importer le fichier `index.js` dans votre `server.js` :

```javascript
const models = require('./models');
```

Toutes les associations seront automatiquement définies et les modèles seront disponibles. 