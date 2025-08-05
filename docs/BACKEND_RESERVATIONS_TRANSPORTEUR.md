# Backend - Réservations Transporteur

## 📋 Vue d'ensemble

Ce module backend gère toutes les fonctionnalités liées aux réservations côté transporteur dans l'application BilletTigue.

## 🏗️ Architecture

### Structure des fichiers

```
backend/
├── controllers/
│   └── transporterReservationController.js    # Contrôleur transporteur
├── services/
│   └── transporterReservationService.js       # Service métier transporteur
├── routes/
│   └── transporterReservationRoutes.js        # Routes API transporteur
└── server.js                                  # Intégration des routes
```

## 🔗 Endpoints API

### Base URL
```
/api/transporter/reservations
```

### 1. Récupérer les réservations du transporteur

**Endpoint:** `GET /api/transporter/reservations`

**Description:** Récupère toutes les réservations pour les trajets du transporteur connecté

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optionnel): Filtre par statut (`pending`, `confirmed`, `completed`, `cancelled`)
- `trajet_id` (optionnel): Filtre par ID de trajet
- `date_depart` (optionnel): Filtre par date de départ (format: YYYY-MM-DD)
- `client` (optionnel): Recherche par nom/email du client
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 20)

**Réponse:**
```json
{
  "success": true,
  "message": "Réservations récupérées avec succès",
  "data": [
    {
      "id": 1,
      "numero_reservation": "RES-2024-001",
      "created_at": "2024-01-15T10:30:00Z",
      "date_depart": "2024-01-20T08:00:00Z",
      "trajet_depart": "Dakar",
      "trajet_arrivee": "Thiès",
      "client_nom": "Dupont",
      "client_prenom": "Jean",
      "client_email": "jean.dupont@email.com",
      "client_telephone": "+221701234567",
      "nombre_places": 2,
      "montant_total": 5000,
      "status": "confirmed",
      "paiement_status": "paid",
      "paiement_methode": "mobile_money"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

### 2. Récupérer les détails d'une réservation

**Endpoint:** `GET /api/transporter/reservations/:id`

**Description:** Récupère les détails complets d'une réservation spécifique

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "success": true,
  "message": "Détails de la réservation récupérés avec succès",
  "data": {
    "id": 1,
    "numero_reservation": "RES-2024-001",
    "reservation_date": "2024-01-15T10:30:00Z",
    "status": "confirmed",
    "seats_reserved": 2,
    "total_amount": 5000,
    "refundable_option": true,
    "refund_supplement_amount": 500,
    "trajet": {
      "id": 1,
      "departure_city": "Dakar",
      "arrival_city": "Thiès",
      "departure_time": "2024-01-20T08:00:00Z",
      "arrival_time": "2024-01-20T09:30:00Z",
      "price": 2500,
      "vehicle_type": "Bus",
      "vehicle_number": "DK-1234-AB"
    },
    "client": {
      "id": 1,
      "email": "jean.dupont@email.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone_number": "+221701234567",
      "address": "123 Rue de la Paix, Dakar"
    },
    "paiement": {
      "id": 1,
      "amount": 5000,
      "status": "paid",
      "payment_date": "2024-01-15T10:35:00Z",
      "payment_method": "mobile_money",
      "transaction_id": "TXN-123456"
    }
  }
}
```

### 3. Mettre à jour le statut d'une réservation

**Endpoint:** `PUT /api/transporter/reservations/:id/status`

**Description:** Met à jour le statut d'une réservation

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "status": "confirmed",
  "reason": "Réservation confirmée par le transporteur"
}
```

**Statuts autorisés:**
- `pending` → `confirmed`, `cancelled`
- `confirmed` → `completed`, `cancelled`
- `completed` → (aucune transition)
- `cancelled` → (aucune transition)

**Réponse:**
```json
{
  "success": true,
  "message": "Statut de la réservation mis à jour avec succès",
  "data": {
    // Détails complets de la réservation mise à jour
  }
}
```

### 4. Statistiques des réservations

**Endpoint:** `GET /api/transporter/reservations/stats/overview`

**Description:** Récupère les statistiques des réservations pour le transporteur

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optionnel): Période (`week`, `month`, `year`) - défaut: `month`

**Réponse:**
```json
{
  "success": true,
  "message": "Statistiques récupérées avec succès",
  "data": {
    "period": "month",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-01-31T23:59:59Z",
    "total_reservations": 45,
    "total_revenue": 225000,
    "average_amount": 5000,
    "recent_reservations": 12,
    "by_status": {
      "pending": {
        "count": 5,
        "revenue": 25000
      },
      "confirmed": {
        "count": 25,
        "revenue": 125000
      },
      "completed": {
        "count": 15,
        "revenue": 75000
      }
    }
  }
}
```

### 5. Liste des trajets du transporteur

**Endpoint:** `GET /api/transporter/reservations/trips/list`

**Description:** Récupère tous les trajets du transporteur pour les filtres

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "success": true,
  "message": "Trajets récupérés avec succès",
  "data": [
    {
      "id": 1,
      "departure_city": "Dakar",
      "arrival_city": "Thiès",
      "departure_time": "2024-01-20T08:00:00Z"
    }
  ]
}
```

## 🔐 Sécurité

### Authentification
- Tous les endpoints nécessitent un token JWT valide
- Le token doit être inclus dans le header `Authorization: Bearer <token>`

### Autorisation
- Seuls les utilisateurs avec le rôle `transporteur` peuvent accéder à ces endpoints
- Chaque transporteur ne peut voir que ses propres réservations

### Middleware utilisé
- `protect`: Vérifie l'authentification
- `requireTransporter`: Vérifie que l'utilisateur a le rôle transporteur

## 🗄️ Base de données

### Modèles utilisés
- `Reservation`: Réservations
- `Trajet`: Trajets
- `Transporteur`: Profils transporteurs
- `Compte`: Comptes utilisateurs
- `Utilisateur`: Profils utilisateurs
- `Paiement`: Paiements

### Relations
```sql
Reservation -> Trajet (belongsTo)
Reservation -> Compte (belongsTo)
Reservation -> Paiement (hasOne)
Trajet -> Transporteur (belongsTo)
Compte -> Utilisateur (hasOne)
```

## 🧪 Tests

### Fichier de test
`test-transporter-reservations-backend.js`

### Exécution des tests
```bash
node test-transporter-reservations-backend.js
```

### Tests inclus
- Connexion et authentification
- Récupération des réservations
- Récupération des détails
- Statistiques
- Liste des trajets
- Filtres et pagination

## 🚀 Déploiement

### Intégration dans le serveur
Les routes sont automatiquement intégrées dans `server.js`:

```javascript
app.use('/api/transporter/reservations', require('./routes/transporterReservationRoutes'));
```

### Variables d'environnement
Aucune variable d'environnement spécifique requise pour ce module.

## 📝 Logs

### Actions loggées
- Modification de statut des réservations
- Erreurs de validation
- Tentatives d'accès non autorisées

### Format des logs
```
Transporteur {id} a modifié le statut de la réservation {id} de {ancien_statut} vers {nouveau_statut}. Raison: {raison}
```

## 🔄 Workflow

### Flux de gestion des réservations
1. **Récupération**: Le transporteur consulte ses réservations
2. **Filtrage**: Application de filtres (statut, date, client, etc.)
3. **Détails**: Consultation des détails d'une réservation
4. **Mise à jour**: Modification du statut si nécessaire
5. **Suivi**: Consultation des statistiques

### Transitions de statut
```
pending → confirmed (validation par le transporteur)
pending → cancelled (annulation)
confirmed → completed (trajet terminé)
confirmed → cancelled (annulation tardive)
```

## 🐛 Gestion d'erreurs

### Codes d'erreur HTTP
- `400`: Données invalides ou transition de statut non autorisée
- `401`: Token d'authentification manquant ou invalide
- `403`: Accès non autorisé (rôle incorrect)
- `404`: Réservation ou profil transporteur introuvable
- `500`: Erreur interne du serveur

### Messages d'erreur
Tous les messages d'erreur sont en français et incluent des détails utiles pour le débogage.

## 📈 Performance

### Optimisations
- Requêtes avec `include` pour éviter les N+1 queries
- Pagination pour limiter le nombre de résultats
- Index sur les colonnes fréquemment utilisées
- Transactions pour les opérations critiques

### Monitoring
- Logs détaillés des opérations
- Métriques de performance via les logs
- Gestion des timeouts

## 🔮 Évolutions futures

### Fonctionnalités prévues
- Notifications en temps réel
- Export des données (PDF, Excel)
- API pour les applications mobiles
- Intégration avec des systèmes de paiement externes
- Système de notifications push

### Améliorations techniques
- Cache Redis pour les statistiques
- Rate limiting pour les API
- Documentation OpenAPI/Swagger
- Tests unitaires et d'intégration complets 
