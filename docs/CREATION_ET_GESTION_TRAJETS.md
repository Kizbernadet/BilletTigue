# Documentation : Création et gestion des trajets

## 1. Objectif
Définir les bonnes pratiques et les champs nécessaires pour la création et la gestion des trajets dans le système BilletTigue.

---

## 2. Informations à renseigner lors de la création d’un trajet

- **Lieu de départ** : Ville ou gare de départ
- **Lieu d’arrivée** : Ville ou gare d’arrivée
- **Date et heure de départ**
- **Date et heure d’arrivée** (optionnel)
- **Numéro ou identifiant du bus**
- **Nom du transporteur**
- **Nombre de places disponibles**
- **Prix par place**
- **Type de trajet** : direct, avec escales
- **Durée estimée**
- **Informations sur le conducteur** (optionnel)
- **Points d’arrêt intermédiaires** (optionnel)
- **Catégorie** : VIP, standard, etc.
- **Services inclus** : wifi, climatisation, etc.
- **Statut du trajet** : actif, annulé, complet
- **Politique d’annulation** (optionnel)
- **Accessibilité** (optionnel)
- **Bagages autorisés** (optionnel)

---

## 3. Exemple de structure de données

```json
{
  "routeId": "TRJ20250805-001", 
  "departure": "Dakar", ()
  "arrival": "Saint-Louis",
  "departureDateTime": "2025-08-10T08:00:00Z",
  "arrivalDateTime": "2025-08-10T12:00:00Z",
  "busNumber": "BUS-12",
  "transporter": "TransBus",
  "seatsAvailable": 50,
  "pricePerSeat": 1500,
  "type": "direct",
  "duration": "4h",
  "driver": {
    "name": "Mamadou Ndiaye",
    "phone": "+221 77 123 45 67"
  },
  "stops": ["Thiès", "Louga"],
  "category": "standard",
  "services": ["wifi", "climatisation"],
  "status": "actif",
  "cancellationPolicy": "Annulation possible jusqu’à 24h avant le départ",
  "accessibility": true,
  "luggageAllowed": true
}
```

---

## 4. Gestion des trajets

- Les trajets sont créés par le transporteur ou l’administrateur.
- Les trajets peuvent être modifiés ou annulés avant le départ.
- Le nombre de places disponibles doit être mis à jour après chaque réservation.
- Les trajets complets ou annulés ne doivent plus être proposés à la réservation.
- Les informations doivent être claires et à jour pour les utilisateurs.

---

## 5. Évolutions possibles
- Ajout de la gestion des sièges (choix du siège lors de la réservation)
- Intégration de la géolocalisation des bus
- Ajout de la gestion des retards ou incidents

---

## 6. FAQ
- **Peut-on ajouter des arrêts intermédiaires ?** Oui, via le champ `stops`.
- **Peut-on proposer plusieurs catégories de places ?** Oui, via le champ `category`.
- **Comment gérer les annulations ?** Via le champ `cancellationPolicy` et le statut du trajet.

---

Pour toute question ou évolution, contacter l’équipe technique.
---

## 7. Étapes à suivre pour modifier les informations du modèle de trajet

Si vous souhaitez ajouter, supprimer ou modifier des champs dans le modèle de trajet, voici les étapes à suivre pour garantir la cohérence du système :

1. **Modèle Sequelize**
   - Modifiez le fichier `backend/models/trajet.js` pour ajouter/supprimer/adapter les champs souhaités.

2. **Migration de la base de données**
   - Créez ou modifiez une migration Sequelize pour que la table `trajets` corresponde au nouveau modèle (ajout/suppression de colonnes, modification de types, etc.).
   - Exécutez la migration pour appliquer les changements à la base.

3. **Contrôleur de création/modification**
   - Mettez à jour le contrôleur (`backend/controllers/trajetController.js`, fonction `createTrajet` et éventuellement `updateTrajet`) pour prendre en compte les nouveaux champs lors de la création ou modification d’un trajet.

4. **Routes API**
   - Vérifiez que la route POST `/api/trajets` (et PUT/PATCH si besoin) transmet bien les nouveaux champs.

5. **Frontend (formulaire de création/édition de trajet)**
   - Ajoutez les nouveaux champs dans le formulaire et dans la requête envoyée au backend.

6. **Documentation**
   - Mettez à jour la documentation technique et fonctionnelle pour refléter les nouveaux champs et leur usage.

7. **Tests**
   - Mettez à jour ou créez des tests unitaires et d’intégration pour vérifier la bonne gestion des nouveaux champs.

---

**Remarque :** Toute modification du modèle doit être synchronisée entre le backend, la base de données et le frontend pour éviter les incohérences.
