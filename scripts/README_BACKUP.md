# Guide de Sauvegarde et Restauration - Billettigue

## 📋 Vue d'ensemble

Ce guide explique comment sauvegarder et restaurer votre base de données Billettigue de manière sécurisée.

## 🛠️ Prérequis

### Outils requis
- **Node.js** : Version 14 ou supérieure
- **PostgreSQL** : Client psql et pg_dump installés
- **Variables d'environnement** : Fichier `.env` configuré

### Variables d'environnement
Assurez-vous que votre fichier `.env` contient :
```env
DB_NAME=billettigue
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

## 🚀 Sauvegarde

### Méthode 1 : Script automatique (Recommandé)

#### Windows
```bash
# Double-cliquer sur le fichier
create-backup.bat

# Ou en ligne de commande
create-backup.bat
```

#### Linux/Mac
```bash
# Rendre le script exécutable
chmod +x create-backup.sh

# Exécuter
./create-backup.sh
```

### Méthode 2 : Script Node.js direct

```bash
# Depuis la racine du projet
node scripts/backup-database.js
```

### Méthode 3 : Commande manuelle

```bash
# Sauvegarde simple
pg_dump -h localhost -p 5432 -U postgres -d billettigue > backup.sql

# Sauvegarde compressée
pg_dump -h localhost -p 5432 -U postgres -d billettigue | gzip > backup.sql.gz
```

## 🔄 Restauration

### Méthode 1 : Script automatique (Recommandé)

#### Windows
```bash
# Restaurer la dernière sauvegarde
restore-backup.bat latest

# Restaurer une sauvegarde spécifique
restore-backup.bat billettigue_backup_2024-01-15T10-30-00-000Z
```

#### Linux/Mac
```bash
# Restaurer la dernière sauvegarde
./restore-backup.sh latest

# Restaurer une sauvegarde spécifique
./restore-backup.sh billettigue_backup_2024-01-15T10-30-00-000Z
```

### Méthode 2 : Script Node.js direct

```bash
# Lister les sauvegardes disponibles
node scripts/restore-database.js --help

# Restaurer la dernière sauvegarde
node scripts/restore-database.js latest

# Restaurer une sauvegarde spécifique
node scripts/restore-database.js billettigue_backup_2024-01-15T10-30-00-000Z
```

### Méthode 3 : Commande manuelle

```bash
# Restauration simple
psql -h localhost -p 5432 -U postgres -d billettigue < backup.sql

# Restauration depuis un fichier compressé
gunzip -c backup.sql.gz | psql -h localhost -p 5432 -U postgres -d billettigue
```

## 📁 Structure des sauvegardes

### Répertoire de sauvegarde
```
backups/
├── billettigue_backup_2024-01-15T10-30-00-000Z.sql.gz
├── billettigue_backup_2024-01-15T10-30-00-000Z.sql.gz.json
├── billettigue_backup_2024-01-16T14-20-00-000Z.sql.gz
├── billettigue_backup_2024-01-16T14-20-00-000Z.sql.gz.json
└── safety_backup_2024-01-16T15-30-00-000Z.sql
```

### Types de fichiers
- **`.sql.gz`** : Sauvegarde compressée de la base
- **`.sql.gz.json`** : Métadonnées de la sauvegarde
- **`safety_backup_*.sql`** : Sauvegarde de sécurité avant restauration

## 🔍 Validation des sauvegardes

### Vérification automatique
Les scripts vérifient automatiquement :
- ✅ Connexion à la base de données
- ✅ Intégrité du fichier de sauvegarde
- ✅ Contenu valide du fichier
- ✅ Taille du fichier

### Vérification manuelle
```bash
# Vérifier la taille du fichier
ls -lh backups/billettigue_backup_*.sql.gz

# Vérifier le contenu (premières lignes)
gunzip -c backups/billettigue_backup_*.sql.gz | head -20

# Vérifier les métadonnées
cat backups/billettigue_backup_*.sql.gz.json
```

## 🛡️ Sécurité

### Sauvegarde de sécurité
- **Automatique** : Créée avant chaque restauration
- **Nommage** : `safety_backup_TIMESTAMP.sql`
- **Conservation** : Gardée pour rollback possible

### Bonnes pratiques
1. **Sauvegardes régulières** : Au moins une fois par jour
2. **Stockage externe** : Copier les sauvegardes sur un autre serveur
3. **Test de restauration** : Tester régulièrement la restauration
4. **Documentation** : Noter les changements importants

## 📊 Monitoring

### Informations collectées
- **Timestamp** : Date et heure de la sauvegarde
- **Durée** : Temps d'exécution
- **Taille** : Taille du fichier de sauvegarde
- **Statistiques** : Nombre de lignes par table
- **Système** : Version Node.js, plateforme

### Exemple de métadonnées
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "name": "billettigue",
    "host": "localhost",
    "port": 5432,
    "user": "postgres"
  },
  "backup": {
    "filename": "billettigue_backup_2024-01-15T10-30-00-000Z.sql.gz",
    "filepath": "./backups/billettigue_backup_2024-01-15T10-30-00-000Z.sql.gz",
    "duration": "2.45",
    "fileSize": "1.23",
    "compressed": true
  },
  "system": {
    "nodeVersion": "v18.17.0",
    "platform": "win32",
    "arch": "x64"
  }
}
```

## 🚨 Gestion des erreurs

### Erreurs courantes

#### Connexion impossible
```
❌ Impossible de se connecter à la base de données
```
**Solution** : Vérifier les variables d'environnement et la connexion PostgreSQL

#### Fichier introuvable
```
❌ Fichier de sauvegarde introuvable
```
**Solution** : Vérifier le nom du fichier et le répertoire de sauvegarde

#### Permissions insuffisantes
```
❌ Erreur lors de la sauvegarde: permission denied
```
**Solution** : Vérifier les droits d'accès à PostgreSQL et au système de fichiers

### Rollback en cas de problème

#### Restauration automatique
```bash
# Restaurer la sauvegarde de sécurité
node scripts/restore-database.js safety_backup_TIMESTAMP
```

#### Restauration manuelle
```bash
# Restaurer depuis la sauvegarde de sécurité
psql -h localhost -p 5432 -U postgres -d billettigue < backups/safety_backup_TIMESTAMP.sql
```

## 📅 Planification automatique

### Windows (Task Scheduler)
```batch
# Créer une tâche planifiée
schtasks /create /tn "Billettigue Backup" /tr "C:\path\to\create-backup.bat" /sc daily /st 02:00
```

### Linux (Cron)
```bash
# Éditer le crontab
crontab -e

# Ajouter une ligne pour la sauvegarde quotidienne à 2h00
0 2 * * * cd /path/to/billettigue && node scripts/backup-database.js
```

### Mac (Launchd)
```xml
<!-- Créer un fichier plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.billettigue.backup</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/path/to/billettigue/scripts/backup-database.js</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>2</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
</dict>
</plist>
```

## 🔧 Configuration avancée

### Personnalisation des scripts

#### Modifier la compression
```javascript
// Dans backup-database.js
const BACKUP_CONFIG = {
    compress: false  // Désactiver la compression
};
```

#### Modifier le répertoire
```javascript
// Dans backup-database.js
const BACKUP_CONFIG = {
    outputDir: '/custom/backup/path'
};
```

#### Ajouter des options pg_dump
```javascript
// Dans backup-database.js
command += ` --exclude-table=logs`;  // Exclure certaines tables
command += ` --data-only`;           // Données uniquement
```

## 📞 Support

### En cas de problème
1. **Vérifier les logs** : Messages d'erreur détaillés
2. **Tester la connexion** : `psql -h localhost -U postgres -d billettigue`
3. **Vérifier les permissions** : Droits d'accès aux fichiers
4. **Consulter la documentation** : Ce guide et les commentaires dans les scripts

### Logs utiles
- **Console** : Messages en temps réel
- **Fichiers de métadonnées** : Informations détaillées
- **Logs PostgreSQL** : Erreurs de base de données

---

*Guide créé le : $(date)*
*Version : 1.0*
*Dernière mise à jour : $(date)* 