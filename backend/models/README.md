# 📋 MODÈLES SEQUELIZE - STRUCTURE VALIDÉE

## 🎯 **Structure finale conforme aux tables validées**

### **Modifications appliquées selon la restructuration**

1. **Tables obsolètes supprimées** : `point_depot`, `depots`, `PointDepot`
2. **Nouveau modèle** : `zones_desservies` (remplace les anciens)
3. **Modèles mis à jour** : `reservations`, `paiements`, `colis`, `trajets`, `transporteurs`
4. **Associations corrigées** selon la nouvelle structure

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
  company_type: STRING DEFAULT 'mixte',
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
  seats_count: INTEGER DEFAULT 1,
  available_seats: INTEGER DEFAULT 1,
  status: STRING DEFAULT 'active',
  accepts_packages: BOOLEAN DEFAULT true,
  max_package_weight: DECIMAL,
  departure_point: STRING,
  arrival_point: STRING,
  transporteur_id: INTEGER (FK → transporteurs.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **7. Reservation (reservations)**
```javascript
{
  id: INTEGER (PK),
  reservation_date: DATE,
  passenger_first_name: STRING,
  passenger_last_name: STRING,
  phone_number: STRING,
  status: STRING DEFAULT 'pending',
  seats_reserved: INTEGER DEFAULT 1,
  trajet_id: INTEGER (FK → trajets.id),
  compte_id: INTEGER (FK → comptes.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **8. Envoi (envois)**
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

### **9. Paiement (paiements)**
```javascript
{
  id: INTEGER (PK),
  amount: DECIMAL(10,2),
  status: STRING DEFAULT 'pending',
  payment_date: DATE,
  reservation_id: INTEGER (FK → reservations.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **10. Colis (colis)**
```javascript
{
  id: INTEGER (PK),
  description: STRING,
  weight: DECIMAL(8,2),
  dimensions: STRING,
  shipping_cost: DECIMAL(10,2),
  status: STRING DEFAULT 'pending',
  envoi_id: INTEGER (FK → envois.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **11. ZonesDesservies (zones_desservies)**
```javascript
{
  id: INTEGER (PK),
  city_name: STRING,
  region: STRING,
  zone_type: STRING DEFAULT 'both',
  service_frequency: STRING,
  max_weight_capacity: DECIMAL,
  transporteur_id: INTEGER (FK → transporteurs.id),
  created_at: DATE,
  updated_at: DATE
}
```

### **12. RevokedToken (revoked_tokens)**
```javascript
{
  id: INTEGER (PK),
  token: TEXT,
  user_id: INTEGER (FK → comptes.id),
  revoked_at: DATE,
  expires_at: DATE,
  reason: STRING DEFAULT 'logout',
  created_at: DATE,
  updated_at: DATE
}
```

## 🔗 **Associations mises à jour**

### **Relations principales**
- **Role 1,N Compte** : Un rôle peut avoir plusieurs comptes
- **Compte 1,1 Utilisateur/Transporteur/Administrateur** : Un compte peut être lié à un seul profil
- **Transporteur 1,N ZonesDesservies** : Un transporteur peut desservir plusieurs zones
- **Transporteur 1,N Trajet** : Un transporteur peut proposer plusieurs trajets
- **Utilisateur 1,N Envoi** : Un utilisateur peut faire plusieurs envois
- **Transporteur 1,N Envoi** : Un transporteur peut gérer plusieurs envois
- **Reservation 1,1 Paiement** : Chaque réservation a un paiement associé
- **Compte 1,N Reservation** : Un compte peut faire plusieurs réservations
- **Trajet 1,N Reservation** : Un trajet peut avoir plusieurs réservations
- **Envoi 1,N Colis** : Un envoi peut contenir plusieurs colis
- **Compte 1,N RevokedToken** : Pour la gestion des déconnexions

## ✅ **Résultat**

Tous les modèles sont maintenant :
- ✅ **100% conformes** à la structure validée
- ✅ **Cohérents** avec la base de données restructurée
- ✅ **Optimisés** avec les bonnes associations
- ✅ **Prêts** pour l'utilisation en production

## 🚀 **Utilisation**

Pour utiliser ces modèles, importer le fichier `index.js` dans votre `server.js` :

```javascript
const models = require('./models');

// Les modèles sont disponibles :
const { Role, Compte, Utilisateur, Transporteur, ZonesDesservies, 
        Trajet, Reservation, Paiement, Envoi, Colis, RevokedToken } = models;
```

Toutes les associations sont automatiquement définies et les modèles sont prêts à l'emploi ! 