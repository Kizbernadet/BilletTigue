# Documentation Base de Données - Billettigue

## Vue d'ensemble

Billettigue est une plateforme de transport et de livraison qui connecte les utilisateurs, transporteurs et administrateurs. La base de données utilise **Sequelize ORM** avec **MySQL** et suit une architecture modulaire avec des relations bien définies.

## Architecture générale

### Types d'utilisateurs
- **Utilisateur** : Client final qui peut réserver des trajets et envoyer des colis
- **Transporteur** : Prestataire de service qui propose des trajets et livre des colis
- **Administrateur** : Gestionnaire de la plateforme avec droits étendus

### Système d'authentification
- Gestion centralisée des comptes avec rôles
- Système de tokens JWT avec révocation
- Sécurité renforcée (verrouillage de compte, tentatives de connexion)

---

## Tables et Modèles

### 1. Table `roles` - Rôles utilisateurs

**Description** : Définit les différents rôles dans l'application

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | Nom du rôle (admin, user, transporteur) |
| `description` | TEXT | NULL | Description du rôle |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

**Rôles par défaut** :
- `admin` : Administrateur de la plateforme
- `user` : Utilisateur final
- `transporteur` : Prestataire de transport

---

### 2. Table `comptes` - Comptes utilisateurs

**Description** : Table centrale pour l'authentification et la gestion des comptes

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `email` | VARCHAR | NOT NULL, UNIQUE | Adresse email |
| `password_hash` | VARCHAR | NOT NULL | Hash du mot de passe |
| `status` | VARCHAR | NOT NULL, DEFAULT 'active' | Statut du compte |
| `email_verified` | BOOLEAN | NOT NULL, DEFAULT false | Email vérifié |
| `phone_verified` | BOOLEAN | NOT NULL, DEFAULT false | Téléphone vérifié |
| `last_login` | DATETIME | NULL | Dernière connexion |
| `login_attempts` | INTEGER | NOT NULL, DEFAULT 0 | Tentatives de connexion |
| `failed_logins` | INTEGER | NOT NULL, DEFAULT 0 | Échecs de connexion |
| `last_failed_login` | DATETIME | NULL | Dernier échec |
| `account_locked` | BOOLEAN | NOT NULL, DEFAULT false | Compte verrouillé |
| `password_changed_at` | DATETIME | NULL | Changement de mot de passe |
| `role_id` | INTEGER | NOT NULL, FK | Référence vers roles.id |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

**Statuts possibles** : `active`, `inactive`, `suspended`, `deleted`

---

### 3. Table `utilisateurs` - Profils utilisateurs

**Description** : Informations spécifiques aux utilisateurs finaux

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `last_name` | VARCHAR | NOT NULL | Nom de famille |
| `first_name` | VARCHAR | NOT NULL | Prénom |
| `phone_number` | VARCHAR | NOT NULL | Numéro de téléphone |
| `compte_id` | INTEGER | NOT NULL, FK | Référence vers comptes.id |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

---

### 4. Table `transporteurs` - Profils transporteurs

**Description** : Informations spécifiques aux transporteurs

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `phone_number` | VARCHAR | NOT NULL | Numéro de téléphone |
| `company_name` | VARCHAR | NULL | Nom de l'entreprise |
| `company_type` | VARCHAR(100) | NOT NULL, DEFAULT 'mixte' | Type d'entreprise |
| `compte_id` | INTEGER | NOT NULL, FK | Référence vers comptes.id |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

**Types d'entreprise** : `mixte`, `passagers`, `colis`

---

### 5. Table `administrateurs` - Profils administrateurs

**Description** : Informations spécifiques aux administrateurs

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `last_name` | VARCHAR | NOT NULL | Nom de famille |
| `first_name` | VARCHAR | NOT NULL | Prénom |
| `compte_id` | INTEGER | NOT NULL, FK | Référence vers comptes.id |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

---

### 6. Table `trajets` - Trajets de transport

**Description** : Trajets proposés par les transporteurs

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `departure_city` | VARCHAR(100) | NOT NULL | Ville de départ |
| `arrival_city` | VARCHAR(100) | NOT NULL | Ville d'arrivée |
| `departure_time` | DATETIME | NOT NULL | Heure de départ |
| `price` | DECIMAL(10,2) | NOT NULL, MIN 0 | Prix du trajet |
| `seats_count` | INTEGER | NOT NULL, DEFAULT 1, MIN 1, MAX 50 | Nombre total de places |
| `available_seats` | INTEGER | NOT NULL, DEFAULT 1, MIN 0 | Places disponibles |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'active' | Statut du trajet |
| `accepts_packages` | BOOLEAN | NOT NULL, DEFAULT true | Accepte les colis |
| `max_package_weight` | DECIMAL(8,2) | NULL, MIN 0 | Poids max des colis |
| `departure_point` | VARCHAR(200) | NULL | Point de départ précis |
| `arrival_point` | VARCHAR(200) | NULL | Point d'arrivée précis |
| `transporteur_id` | INTEGER | NOT NULL, FK | Référence vers transporteurs.id |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

**Statuts possibles** : `active`, `cancelled`, `completed`, `suspended`

---

### 7. Table `reservations` - Réservations de trajets

**Description** : Réservations effectuées par les utilisateurs

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `reservation_date` | DATETIME | NOT NULL | Date de réservation |
| `passenger_first_name` | VARCHAR | NOT NULL | Prénom du passager |
| `passenger_last_name` | VARCHAR | NOT NULL | Nom du passager |
| `phone_number` | VARCHAR | NOT NULL | Téléphone du passager |
| `status` | VARCHAR | NOT NULL, DEFAULT 'pending' | Statut de la réservation |
| `seats_reserved` | INTEGER | NOT NULL, DEFAULT 1, MIN 1 | Nombre de places réservées |
| `refundable_option` | BOOLEAN | NOT NULL, DEFAULT false | Option remboursable |
| `refund_supplement_amount` | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Supplément remboursable |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Montant total |
| `trajet_id` | INTEGER | NOT NULL, FK | Référence vers trajets.id |
| `compte_id` | INTEGER | NULL, FK | Référence vers comptes.id (invité si NULL) |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

**Statuts possibles** : `pending`, `confirmed`, `cancelled`, `completed`, `refunded`

---

### 8. Table `paiements` - Paiements des réservations

**Description** : Gestion des paiements pour les réservations

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `amount` | DECIMAL(10,2) | NOT NULL | Montant du paiement |
| `status` | VARCHAR | NOT NULL, DEFAULT 'pending' | Statut du paiement |
| `payment_date` | DATETIME | NOT NULL | Date du paiement |
| `reservation_id` | INTEGER | NOT NULL, FK | Référence vers reservations.id |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

**Statuts possibles** : `pending`, `completed`, `failed`, `refunded`

---

### 9. Table `envois` - Envois de colis

**Description** : Gestion des envois de colis entre utilisateurs

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `description` | VARCHAR | NOT NULL | Description de l'envoi |
| `status` | VARCHAR | NOT NULL, DEFAULT 'pending' | Statut de l'envoi |
| `expediteur_id` | INTEGER | NOT NULL, FK | Référence vers utilisateurs.id |
| `recipient_name` | VARCHAR | NOT NULL | Nom du destinataire |
| `recipient_phone` | VARCHAR | NOT NULL | Téléphone du destinataire |
| `transporteur_id` | INTEGER | NOT NULL, FK | Référence vers transporteurs.id |
| `compte_id` | INTEGER | NOT NULL, FK | Référence vers comptes.id |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

**Statuts possibles** : `pending`, `accepted`, `in_transit`, `delivered`, `cancelled`

---

### 10. Table `colis` - Détails des colis

**Description** : Informations détaillées sur les colis dans les envois

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `description` | VARCHAR | NOT NULL | Description du colis |
| `weight` | DECIMAL(8,2) | NOT NULL, MIN 0 | Poids en kg |
| `dimensions` | VARCHAR | NULL | Dimensions (LxlxH) |
| `shipping_cost` | DECIMAL(10,2) | NOT NULL, MIN 0 | Coût de livraison |
| `status` | VARCHAR | NOT NULL, DEFAULT 'pending' | Statut du colis |
| `envoi_id` | INTEGER | NOT NULL, FK | Référence vers envois.id |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

**Statuts possibles** : `pending`, `packaged`, `shipped`, `delivered`, `lost`

---

### 11. Table `zones_desservies` - Zones de service

**Description** : Zones géographiques desservies par les transporteurs

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `city_name` | VARCHAR(255) | NOT NULL | Nom de la ville |
| `region` | VARCHAR(255) | NULL | Région |
| `zone_type` | VARCHAR(50) | NOT NULL, DEFAULT 'both' | Type de zone |
| `service_frequency` | VARCHAR(50) | NULL | Fréquence de service |
| `max_weight_capacity` | DECIMAL(8,2) | NULL, MIN 0 | Capacité max en kg |
| `transporteur_id` | INTEGER | NOT NULL, FK | Référence vers transporteurs.id |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Date de modification |

**Types de zone** : `pickup_only`, `delivery_only`, `both`
**Fréquences** : `daily`, `weekly`, `monthly`, `on_demand`

**Index** :
- `city_name`
- `transporteur_id`
- `city_name, transporteur_id` (unique)

---

### 12. Table `revoked_tokens` - Tokens révoqués

**Description** : Gestion des tokens JWT révoqués pour la déconnexion

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| `token` | TEXT | NOT NULL, UNIQUE | Token JWT révoqué |
| `user_id` | INTEGER | NOT NULL, FK | Référence vers comptes.id |
| `revoked_at` | DATETIME | NOT NULL | Date de révocation |
| `expires_at` | DATETIME | NOT NULL | Date d'expiration |
| `reason` | VARCHAR | NULL, DEFAULT 'logout' | Raison de la révocation |

**Index** :
- `token`
- `user_id`
- `expires_at`

---

## Relations entre les tables

### Diagramme des relations

```
roles (1) ←→ (N) comptes (1) ←→ (1) utilisateurs
                                    ↓
                              transporteurs
                                    ↓
                              administrateurs

transporteurs (1) ←→ (N) zones_desservies
transporteurs (1) ←→ (N) trajets
transporteurs (1) ←→ (N) envois

utilisateurs (1) ←→ (N) envois
comptes (1) ←→ (N) envois
comptes (1) ←→ (N) reservations
comptes (1) ←→ (N) revoked_tokens

trajets (1) ←→ (N) reservations
reservations (1) ←→ (1) paiements

envois (1) ←→ (N) colis
```

### Détail des associations

#### Relations 1:N (One-to-Many)
- **Role → Compte** : Un rôle peut avoir plusieurs comptes
- **Compte → Reservation** : Un compte peut avoir plusieurs réservations
- **Compte → Envoi** : Un compte peut avoir plusieurs envois
- **Compte → RevokedToken** : Un compte peut avoir plusieurs tokens révoqués
- **Transporteur → Trajet** : Un transporteur peut proposer plusieurs trajets
- **Transporteur → Envoi** : Un transporteur peut gérer plusieurs envois
- **Transporteur → ZonesDesservies** : Un transporteur peut desservir plusieurs zones
- **Utilisateur → Envoi** : Un utilisateur peut envoyer plusieurs colis
- **Trajet → Reservation** : Un trajet peut avoir plusieurs réservations
- **Envoi → Colis** : Un envoi peut contenir plusieurs colis

#### Relations 1:1 (One-to-One)
- **Compte → Utilisateur** : Un compte correspond à un utilisateur
- **Compte → Transporteur** : Un compte correspond à un transporteur
- **Compte → Administrateur** : Un compte correspond à un administrateur
- **Reservation → Paiement** : Une réservation a un paiement

#### Relations N:1 (Many-to-One)
- **Compte → Role** : Plusieurs comptes peuvent avoir le même rôle
- **Reservation → Trajet** : Plusieurs réservations peuvent concerner le même trajet
- **Envoi → Transporteur** : Plusieurs envois peuvent être gérés par le même transporteur

---

## Contraintes et validations

### Contraintes d'intégrité référentielle
- Toutes les clés étrangères sont configurées avec `ON DELETE CASCADE` ou `ON DELETE RESTRICT`
- Les champs obligatoires sont marqués `NOT NULL`
- Les champs uniques sont protégés par des contraintes `UNIQUE`

### Validations métier
- **Prix** : Toujours positif (≥ 0)
- **Places** : Entre 1 et 50 pour les trajets
- **Poids** : Toujours positif pour les colis
- **Statuts** : Valeurs prédéfinies dans des listes autorisées
- **Types** : Validation des valeurs autorisées (enum-like)

### Index de performance
- **zones_desservies** : Index sur `city_name`, `transporteur_id`
- **revoked_tokens** : Index sur `token`, `user_id`, `expires_at`
- **Clés primaires** : Index automatiques sur tous les `id`

---

## Sécurité et authentification

### Gestion des mots de passe
- Hashage des mots de passe avec bcrypt
- Suivi des changements de mot de passe
- Verrouillage automatique après échecs répétés

### Gestion des sessions
- Tokens JWT pour l'authentification
- Révocation des tokens lors de la déconnexion
- Expiration automatique des tokens

### Vérification des comptes
- Vérification email et téléphone
- Statuts de compte (actif, suspendu, supprimé)
- Suivi des tentatives de connexion

---

## Fonctionnalités spéciales

### Option remboursable
- Les réservations peuvent inclure une option remboursable
- Supplément calculé automatiquement
- Gestion des remboursements

### Réservations invitées
- Possibilité de réserver sans compte (compte_id = NULL)
- Gestion des réservations anonymes

### Gestion des colis
- Support des envois multiples dans un trajet
- Calcul automatique des coûts de livraison
- Suivi détaillé des colis

---

## Maintenance et administration

### Nettoyage automatique
- Suppression des tokens expirés
- Archivage des anciennes données
- Optimisation des performances

### Monitoring
- Suivi des tentatives de connexion
- Logs des actions importantes
- Statistiques d'utilisation

### Sauvegarde
- Sauvegarde régulière des données
- Récupération en cas de panne
- Versioning des schémas

---

## Utilisation avec Sequelize

### Importation des modèles
```javascript
const {
  Role, Compte, Utilisateur, Transporteur, Administrateur,
  Trajet, Reservation, Paiement, Envoi, Colis,
  ZonesDesservies, RevokedToken
} = require('./models');
```

### Exemples de requêtes
```javascript
// Récupérer un utilisateur avec son compte et rôle
const user = await Utilisateur.findOne({
  include: [
    { model: Compte, as: 'compte', include: [{ model: Role, as: 'role' }] }
  ]
});

// Récupérer les trajets d'un transporteur avec réservations
const trajets = await Trajet.findAll({
  where: { transporteur_id: transporteurId },
  include: [{ model: Reservation, as: 'reservations' }]
});
```

---

## Évolution de la base de données

### Migrations
- Utilisation de Sequelize Migrations
- Versioning des changements de schéma
- Rollback en cas de problème

### Seeders
- Données de test et de développement
- Rôles par défaut
- Comptes administrateur

### Documentation des changements
- Historique des modifications
- Impact sur les fonctionnalités
- Guide de migration

---

*Documentation générée le : $(date)*
*Version de la base de données : 1.0*
*Dernière mise à jour : $(date)* 

## 👤 **1. Relations de l'UTILISATEUR**

### **Relations directes** :
```
utilisateurs (1) ←→ (1) comptes
utilisateurs (1) ←→ (N) envois (en tant qu'expéditeur)
comptes (1) ←→ (N) reservations
comptes (1) ←→ (N) envois
comptes (1) ←→ (N) revoked_tokens
```

### **Relations indirectes** :
```
utilisateurs → comptes → reservations → trajets → transporteurs
utilisateurs → comptes → reservations → paiements
utilisateurs → envois → colis
utilisateurs → envois → transporteurs
```

### **Données spécifiques** :
- **Table `utilisateurs`** : `last_name`, `first_name`, `phone_number`
- **Table `comptes`** : `email`, `password_hash`, `status`, `role_id`
- **Rôle** : `user`

---

## 🚛 **2. Relations du TRANSPORTEUR**

### **Relations directes** :
```
transporteurs (1) ←→ (1) comptes
transporteurs (1) ←→ (N) trajets
transporteurs (1) ←→ (N) zones_desservies
transporteurs (1) ←→ (N) envois (en tant que transporteur)
```

### **Relations indirectes** :
```
transporteurs → trajets → reservations → comptes → utilisateurs
transporteurs → envois → colis
transporteurs → envois → comptes → utilisateurs
transporteurs → zones_desservies → (influence les trajets)
```

### **Données spécifiques** :
- **Table `transporteurs`** : `phone_number`, `company_name`, `company_type`
- **Table `comptes`** : `email`, `password_hash`, `status`, `role_id`
- **Table `zones_desservies`** : `city_name`, `region`, `zone_type`, `max_weight_capacity`
- **Rôle** : `transporteur`

---

## 👨‍💼 **3. Relations de l'ADMINISTRATEUR**

### **Relations directes** :
```
administrateurs (1) ←→ (1) comptes
```

### **Relations indirectes** (accès complet) :
```
administrateurs → comptes → (accès à toutes les données)
administrateurs → (peut consulter toutes les tables)
```

### **Données spécifiques** :
- **Table `administrateurs`** : `last_name`, `first_name`
- **Table `comptes`** : `email`, `password_hash`, `status`, `role_id`
- **Rôle** : `admin`

---

## 🔗 **Relations communes à tous les acteurs**

### **Table `comptes` (centrale)** :
```
comptes (N) ←→ (1) roles
comptes (1) ←→ (1) utilisateurs OU transporteurs OU administrateurs
comptes (1) ←→ (N) reservations
comptes (1) ←→ (N) envois
comptes (1) ←→ (N) revoked_tokens
```

### **Table `roles` (définit les permissions)** :
```
roles (1) ←→ (N) comptes
```

---

## 📊 **Schéma des relations par acteur**

### **UTILISATEUR** :
```
utilisateurs
    ↓ (1:1)
comptes ←→ roles
    ↓ (1:N)
reservations ←→ trajets ←→ transporteurs
    ↓ (1:1)
paiements

utilisateurs
    ↓ (1:N)
envois ←→ transporteurs
    ↓ (1:N)
colis
```

### **TRANSPORTEUR** :
```
transporteurs
    ↓ (1:1)
comptes ←→ roles
    ↓ (1:N)
trajets ←→ reservations ←→ comptes
    ↓ (1:N)
zones_desservies

transporteurs
    ↓ (1:N)
envois ←→ utilisateurs
    ↓ (1:N)
colis
```

### **ADMINISTRATEUR** :
```
administrateurs
    ↓ (1:1)
comptes ←→ roles
    ↓ (accès complet)
Toutes les tables du système
```

---

## 🎯 **Points clés des relations**

### **1. Héritage par rôle** :
- Chaque acteur hérite des relations de `comptes`
- Un compte ne peut avoir qu'UN profil spécifique (utilisateur OU transporteur OU admin)

### **2. Relations métier** :
- **Utilisateur ↔ Transporteur** : Via `reservations` et `envois`
- **Tous ↔ Admin** : L'admin surveille toutes les relations

### **3. Sécurité** :
- `revoked_tokens` lié à `comptes` pour tous les acteurs
- `roles` définit les permissions globales

### **4. Données transactionnelles** :
- `reservations` et `paiements` : Relations utilisateur-transporteur
- `envois` et `colis` : Relations utilisateur-transporteur

Cette architecture relationnelle permet une **gestion granulaire** des données tout en maintenant une **cohérence** entre les différents acteurs de votre plateforme ! 🚀 

## 🛡️ **Système de sauvegarde créé**

### **Scripts principaux** :
1. **`scripts/backup-database.js`** : Script Node.js de sauvegarde complet
2. **`scripts/restore-database.js`** : Script Node.js de restauration sécurisée
3. **`create-backup.bat`** : Script Windows pour sauvegarde facile
4. **`restore-backup.bat`** : Script Windows pour restauration facile
5. **`scripts/README_BACKUP.md`** : Guide complet d'utilisation

##  **Comment utiliser**

### **Sauvegarde rapide** :
```bash
# Windows - Double-cliquer sur
create-backup.bat

# Ou en ligne de commande
node scripts/backup-database.js
```

### **Restauration sécurisée** :
```bash
# Restaurer la dernière sauvegarde
restore-backup.bat latest

# Restaurer une sauvegarde spécifique
restore-backup.bat billettigue_backup_2024-01-15T10-30-00-000Z
```

## ✅ **Fonctionnalités de sécurité**

### **Sauvegarde** :
- ✅ **Validation** de la connexion à la base
- ✅ **Compression** automatique (gzip)
- ✅ **Métadonnées** détaillées (JSON)
- ✅ **Vérification** de l'intégrité du fichier
- ✅ **Gestion d'erreurs** complète

### **Restauration** :
- ✅ **Sauvegarde de sécurité** automatique avant restauration
- ✅ **Validation** du fichier de sauvegarde
- ✅ **Rollback** possible en cas de problème
- ✅ **Vérification** de l'intégrité après restauration

## 📁 **Structure des fichiers**

```
backups/
├── billettigue_backup_2024-01-15T10-30-00-000Z.sql.gz    # Sauvegarde compressée
├── billettigue_backup_2024-01-15T10-30-00-000Z.sql.gz.json # Métadonnées
└── safety_backup_2024-01-16T15-30-00-000Z.sql           # Sauvegarde de sécurité
```

## 🎯 **Avantages de ce système**

1. **Sécurisé** : Sauvegarde automatique avant restauration
2. **Validé** : Vérification de l'intégrité des données
3. **Documenté** : Métadonnées complètes de chaque sauvegarde
4. **Facile** : Scripts simples à utiliser
5. **Robuste** : Gestion d'erreurs et rollback possible

##  **Prérequis**

Assurez-vous que votre fichier `.env` contient :
```env
DB_NAME=billettigue
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

Maintenant vous pouvez **sauvegarder votre base en toute sécurité** avant de procéder aux modifications des relations ! 🛡️

Voulez-vous que je lance une sauvegarde maintenant pour tester le système ? 