# 🚀 Guide de démarrage rapide - Administrateur

## ⚡ Création rapide de l'administrateur

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

### 2. Exécution du script de setup

```bash
cd backend
npm run setup-admin
```

### 3. Vérification

Le script affichera :
```
🎉 Administrateur créé avec succès : {
  email: 'admin@billettigue.com',
  statut: 'actif',
  nomRole: 'admin',
  nom: 'Dupont',
  prenom: 'Jean'
}
```

## 🔧 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run setup-admin` | Script complet (recommandé) |
| `npm run seed-admin` | Seeder Sequelize standard |
| `npm run add-timestamps` | Ajoute les timestamps aux tables |

## 🛠️ Dépannage rapide

### Erreur : Variables d'environnement manquantes
```bash
# Vérifiez votre fichier .env
cat .env
```

### Erreur : Connexion à la base de données
```bash
# Testez la connexion
psql -h localhost -U your_username -d billettigue_db
```

### Erreur : Rôle admin inexistant
```sql
-- Connectez-vous à PostgreSQL et exécutez :
INSERT INTO role (nomRole) VALUES ('admin');
```

## 📝 Informations de connexion

Après l'exécution réussie, vous pouvez vous connecter avec :
- **Email** : `admin@billettigue.com`
- **Mot de passe** : `Admin123!`

## 🔐 Sécurité

⚠️ **IMPORTANT** : Changez le mot de passe par défaut après la première connexion !

## 📚 Documentation complète

Pour plus de détails, consultez `SEEDER_README.md` 