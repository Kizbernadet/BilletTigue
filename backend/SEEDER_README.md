# 🌱 Seeder Administrateur - BilletTigue

## 📋 Vue d'ensemble

Ce seeder crée automatiquement un compte administrateur dans votre base de données PostgreSQL avec toutes les bonnes pratiques de sécurité.

## 🎯 Fonctionnalités

### ✅ Contraintes respectées
- **Idempotent** : Ne crée l'admin qu'une seule fois
- **Rôle dynamique** : Récupère le rôle 'admin' depuis la table ROLES
- **Mot de passe sécurisé** : Hashé avec bcrypt (12 rounds)
- **Variables d'environnement** : Lecture depuis .env
- **Transaction sécurisée** : Rollback en cas d'erreur
- **Méthode down** : Suppression propre de l'admin
- **Timestamps** : createdAt et updatedAt automatiques

### 🛡️ Bonus de sécurité
- **Protection contre les doublons** : Vérification avant création
- **Validation des données** : Contrôle des variables d'environnement
- **Logs détaillés** : Suivi complet du processus
- **Gestion d'erreurs** : Messages clairs et rollback automatique

## 🚀 Installation et utilisation

### 1. Configuration des variables d'environnement

Créez ou modifiez votre fichier `.env` dans le dossier `backend/` :

```env
# Configuration de la base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=billettigue_db
DB_USER=your_username
DB_PASS=your_password

# Configuration JWT
JWT_SECRET=your_jwt_secret_key_here

# Configuration de l'administrateur (OBLIGATOIRE)
ADMIN_EMAIL=admin@billettigue.com
ADMIN_PWD=Admin123!
ADMIN_NOM=Dupont
ADMIN_PRENOM=Jean

# Configuration du serveur
PORT=5000
NODE_ENV=development
```

### 2. Exécution du seeder

#### Méthode 1 : Script personnalisé (recommandé)
```bash
cd backend
node scripts/run-seed.js
```

#### Méthode 2 : Avec Sequelize CLI
```bash
cd backend
npx sequelize-cli db:seed --seed 20240620-create-admin.js
```

### 3. Vérification

Après l'exécution, vous devriez voir :
```
🎉 Administrateur créé avec succès : {
  email: 'admin@billettigue.com',
  statut: 'actif',
  nomRole: 'admin',
  nom: 'Dupont',
  prenom: 'Jean'
}
```

## 📊 Structure de la base de données

### Tables impliquées

#### Table `role`
```sql
CREATE TABLE role (
    idRole SERIAL PRIMARY KEY,
    nomRole TEXT NOT NULL
);
```

#### Table `compte`
```sql
CREATE TABLE compte (
    idCompte SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    motDePasse VARCHAR NOT NULL,
    statut VARCHAR NOT NULL,
    idRole INTEGER REFERENCES role(idRole),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `administrateur`
```sql
CREATE TABLE administrateur (
    idAdmin SERIAL PRIMARY KEY,
    nom VARCHAR NOT NULL,
    prenom VARCHAR NOT NULL,
    idCompte INTEGER REFERENCES compte(idCompte),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Commandes SQL utiles

### Créer un UNIQUE INDEX partiel pour éviter les doublons admin
```sql
-- Créer un index unique partiel pour s'assurer qu'il n'y a qu'un seul admin
CREATE UNIQUE INDEX idx_compte_admin_unique 
ON compte (idRole) 
WHERE idRole = (SELECT idRole FROM role WHERE nomRole = 'admin');
```

### Vérifier les administrateurs existants
```sql
SELECT 
    c.email,
    c.statut,
    r.nomRole,
    a.nom,
    a.prenom,
    c.createdAt
FROM compte c
INNER JOIN administrateur a ON c.idCompte = a.idCompte
INNER JOIN role r ON c.idRole = r.idRole
WHERE r.nomRole = 'admin';
```

### Supprimer manuellement un administrateur
```sql
-- Supprimer l'administrateur (remplacez l'email)
DELETE FROM administrateur 
WHERE idCompte = (SELECT idCompte FROM compte WHERE email = 'admin@billettigue.com');

DELETE FROM compte 
WHERE email = 'admin@billettigue.com';
```

## 🛠️ Dépannage

### Erreurs courantes

#### 1. Variables d'environnement manquantes
```
❌ Variables d'environnement manquantes. Veuillez définir ADMIN_EMAIL, ADMIN_PWD, ADMIN_NOM et ADMIN_PRENOM dans votre fichier .env
```
**Solution** : Vérifiez votre fichier `.env` et assurez-vous que toutes les variables sont définies.

#### 2. Rôle admin inexistant
```
❌ Le rôle "admin" n'existe pas dans la table role. Veuillez d'abord créer ce rôle.
```
**Solution** : Créez d'abord le rôle admin :
```sql
INSERT INTO role (nomRole) VALUES ('admin');
```

#### 3. Email déjà utilisé
```
❌ Un compte avec l'email admin@billettigue.com existe déjà.
```
**Solution** : Utilisez un email différent ou supprimez le compte existant.

#### 4. Erreur de connexion à la base de données
```
❌ Connexion à la base de données échouée
```
**Solution** : Vérifiez les paramètres de connexion dans votre `.env`.

### Logs de debug

Le seeder affiche des logs détaillés :
- 🔍 Vérifications en cours
- ✅ Étapes réussies
- ⚠️ Avertissements
- ❌ Erreurs

## 🔄 Méthode down (suppression)

Pour supprimer l'administrateur créé :

```bash
# Avec Sequelize CLI
npx sequelize-cli db:seed:undo --seed 20240620-create-admin.js

# Ou manuellement avec le script
node scripts/run-seed.js down
```

## 📝 Exemple de sortie complète

```
🚀 Démarrage du seeder d'administrateur...
📋 Configuration:
   - Email: admin@billettigue.com
   - Nom: Dupont
   - Prénom: Jean
   - Mot de passe: ***DÉFINI***

🔌 Test de connexion à la base de données...
✅ Connexion à la base de données réussie

🌱 Exécution du seeder...
🔍 Vérification des variables d'environnement...
✅ Variables d'environnement validées
🔍 Vérification de l'existence d'un administrateur...
✅ Aucun administrateur trouvé, création en cours...
🔍 Récupération du rôle admin...
✅ Rôle admin trouvé avec l'ID: 1
🔍 Vérification de l'unicité de l'email...
✅ Email unique validé
🔐 Hashage du mot de passe...
✅ Mot de passe hashé avec succès
👤 Création du compte administrateur...
✅ Compte créé avec l'ID: 1
👨‍💼 Création du profil administrateur...
✅ Administrateur créé avec l'ID: 1
🔍 Validation finale...
✅ Validation finale réussie
🎉 Administrateur créé avec succès : {
  email: 'admin@billettigue.com',
  statut: 'actif',
  nomRole: 'admin',
  nom: 'Dupont',
  prenom: 'Jean'
}
✅ Transaction validée

🎉 Seeder exécuté avec succès !

📝 Informations de connexion:
   Email: admin@billettigue.com
   Mot de passe: Admin123!

⚠️  IMPORTANT: Gardez ces informations en sécurité !
🔌 Connexion à la base de données fermée
```

## 🔐 Sécurité

### Bonnes pratiques
1. **Mot de passe fort** : Utilisez au moins 8 caractères avec majuscules, minuscules, chiffres et caractères spéciaux
2. **Email sécurisé** : Utilisez un email dédié à l'administration
3. **Variables d'environnement** : Ne committez jamais le fichier `.env` dans Git
4. **Rotation des mots de passe** : Changez régulièrement le mot de passe admin
5. **Accès limité** : Limitez l'accès à la base de données

### Hashage du mot de passe
- **Algorithme** : bcrypt
- **Salt rounds** : 12 (recommandé pour 2024)
- **Temps de hashage** : ~250ms (sécurisé contre les attaques par force brute)

## 📚 Ressources

- [Documentation Sequelize](https://sequelize.org/)
- [Documentation bcrypt](https://github.com/dcodeIO/bcrypt.js)
- [Bonnes pratiques PostgreSQL](https://www.postgresql.org/docs/current/)
- [Sécurité des mots de passe](https://owasp.org/www-project-cheat-sheets/cheatsheets/Authentication_Cheat_Sheet.html) 