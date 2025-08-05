# 🚀 BilletTigue Backend

Backend Node.js/Express pour l'application BilletTigue - Plateforme de billetterie et transport.

## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Base de données](#base-de-données)
- [Développement](#développement)
- [Tests](#tests)

## 🛠️ Installation

### Prérequis

- Node.js (v16 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

### Installation des dépendances

```bash
cd backend
npm install
```

### Configuration de la base de données

1. Créez une base de données PostgreSQL :
```sql
CREATE DATABASE billettigue_db;
```

2. Copiez le fichier `.env.example` vers `.env` et configurez vos variables :
```bash
cp .env.example .env
```

3. Configurez les variables d'environnement dans `.env` :
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=billettigue_db
DB_USER=your_username
DB_PASS=your_password
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
NODE_ENV=development
```

## 🚀 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run prod
```

### Configuration de l'administrateur
```bash
npm run setup-admin
```

## 📁 Structure du projet

```
backend/
├── config/                 # Configuration de la base de données
│   ├── database.js
│   └── connection.js
├── controllers/           # Contrôleurs de l'API
│   ├── authController.js
│   ├── profileController.js
│   └── notificationController.js
├── models/               # Modèles Sequelize
│   ├── role.js
│   ├── compte.js
│   ├── administrateur.js
│   └── [autres modèles]
├── routes/               # Routes de l'API
│   ├── authRoutes.js
│   ├── profileRoutes.js
│   └── notificationRoutes.js
├── services/             # Services métier
│   ├── authService.js
│   ├── profileService.js
│   └── notificationService.js
├── middlewares/          # Middlewares Express
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── seeders/              # Seeders de base de données
│   └── 20240620-create-admin.js
├── scripts/              # Scripts utilitaires
│   └── setup-admin.js
├── tests/                # Tests et documentation
│   ├── README.md
│   ├── tests_effectues/
│   └── tests_rapports/
├── server.js             # Point d'entrée de l'application
├── package.json
└── DEV_INFO.txt          # Informations de développement
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription d'un utilisateur
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion

### Profil utilisateur
- `GET /api/profile` - Récupérer le profil
- `PUT /api/profile` - Mettre à jour le profil

### Notifications
- `GET /api/notifications` - Récupérer les notifications
- `POST /api/notifications` - Créer une notification

## 🗄️ Base de données

### Tables principales

- **roles** : Rôles utilisateurs (admin, user, transporter)
- **comptes** : Comptes utilisateurs
- **administrateurs** : Profils administrateurs
- **utilisateurs** : Profils utilisateurs
- **transporteurs** : Profils transporteurs

### Conventions

- Tables au pluriel
- Colonnes en snake_case
- Clés primaires : `id`
- Clés étrangères : `tableId` (ex: `roleId`, `compteId`)
- Timestamps automatiques : `createdAt`, `updatedAt`

## 🧪 Tests

### Guides de test disponibles

- `tests/README.md` - Guide général des tests
- `tests/tests_effectues/` - Guides de test pratiques
- `tests/tests_rapports/` - Rapports de test récents

### Exécution des tests

```bash
# Tests d'authentification
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@billettigue.com","password":"Admin123!"}'
```

## 🔧 Développement

### Scripts disponibles

- `npm start` - Démarrer en mode production
- `npm run dev` - Démarrer en mode développement
- `npm run dev:debug` - Démarrer avec debug
- `npm run setup-admin` - Configurer l'administrateur

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DB_HOST` | Hôte PostgreSQL | localhost |
| `DB_PORT` | Port PostgreSQL | 5432 |
| `DB_NAME` | Nom de la base | billettigue_db |
| `DB_USER` | Utilisateur DB | - |
| `DB_PASS` | Mot de passe DB | - |
| `JWT_SECRET` | Clé secrète JWT | - |
| `PORT` | Port du serveur | 3000 |
| `NODE_ENV` | Environnement | development |

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt (12 rounds)
- Authentification JWT
- Validation des données côté serveur
- Protection CORS
- Variables d'environnement pour les secrets

## 📚 Documentation

- `DEV_INFO.txt` - Informations détaillées de développement
- `QUICK_START_ADMIN.md` - Guide rapide administrateur
- `SEEDER_README.md` - Documentation des seeders

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

## 🆘 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les logs de la console
3. Testez avec les scripts fournis
4. Vérifiez la configuration 
