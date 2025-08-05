# 🧪 Guide de Test - Réservations Transporteur

## 📋 Vue d'ensemble

Ce guide vous aide à tester la connexion frontend-backend pour la page des réservations transporteur.

## 🚀 Étapes de test

### 1. Démarrer le serveur backend

**Option A - Script automatique :**
```bash
start-backend.bat
```

**Option B - Manuel :**
```bash
cd backend
npm start
```

Le serveur doit démarrer sur `http://localhost:3000`

**Test rapide de connexion :**
```bash
node test-backend-connection.js
```

### 2. Tester la connexion backend

```bash
node test-transporter-reservations-connection.js
```

Ce script va :
- Vérifier que le serveur répond
- Tester le login d'un transporteur
- Récupérer les réservations

### 3. Tester la page frontend

Ouvrez `test-transporter-reservations-frontend.html` dans votre navigateur.

Cette page vous permet de :
- Voir la configuration API
- Tester le login transporteur
- Charger et afficher les réservations
- Voir les logs détaillés

### 4. Tester la page principale

Ouvrez `web/pages/transporter-dashboard-reservations.html` dans votre navigateur.

## 🔧 Configuration

### Backend
- **Port**: 3000
- **URL API**: `http://localhost:3000/api`
- **Routes**: `/transporter/reservations/*`

### Frontend
- **Configuration**: `web/src/js/api/config.dev.js`
- **URL API**: `http://localhost:3000/api`
- **Module**: `transporter-reservations.js`

## 📊 Données attendues

### Structure des réservations
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero_reservation": "RES-001",
      "statut": "en_attente",
      "montant_total": 25.00,
      "nombre_places": 2,
      "created_at": "2024-01-15T10:30:00Z",
      "Trajet": {
        "lieu_depart": "Paris",
        "lieu_arrivee": "Lyon",
        "date_depart": "2024-01-20T08:00:00Z"
      },
      "Compte": {
        "Utilisateur": {
          "nom": "Dupont",
          "prenom": "Jean"
        }
      }
    }
  ]
}
```

## 🐛 Dépannage

### Erreur de connexion
- Vérifiez que le serveur backend est démarré
- Vérifiez le port (3000)
- Vérifiez les logs du serveur

### Erreur CORS
- Vérifiez la configuration CORS dans `backend/server.js`
- Assurez-vous que l'origine frontend est autorisée

### Erreur d'authentification
- Vérifiez que le token est correctement stocké
- Vérifiez les headers d'autorisation
- Vérifiez que l'utilisateur a le rôle transporteur

### Erreur de données
- Vérifiez la structure des données retournées
- Vérifiez les relations Sequelize
- Vérifiez les logs du backend

## ✅ Checklist de validation

- [ ] Serveur backend démarré sur le port 3000
- [ ] Test de connexion backend réussi
- [ ] Login transporteur fonctionnel
- [ ] Récupération des réservations
- [ ] Page de test frontend accessible
- [ ] Configuration API correcte
- [ ] Page principale accessible
- [ ] Tableau des réservations affiché
- [ ] Actions (voir détails, modifier statut) fonctionnelles

## 📝 Notes

- Les données de test utilisent `transporteur@test.com` / `password123`
- Assurez-vous d'avoir des données de test dans la base de données
- Les logs détaillés sont disponibles dans la console du navigateur
- Le système de notifications utilise des `alert()` temporaires 
