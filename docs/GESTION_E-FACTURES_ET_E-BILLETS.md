# Documentation : Gestion des e-factures et e-billets

## 1. Objectif
Mettre en place un système de génération et de gestion de factures électroniques (e-factures) et de billets électroniques (e-billets) pour les réservations de places de bus.

---

## 2. Processus de génération

### a. Facture électronique (e-facture)
- Générée automatiquement lors de la validation d'une réservation.
- Une seule facture par réservation, même si plusieurs places sont réservées.
- Contient :
  - Identifiant unique de la facture
  - Identifiant de la réservation
  - Nom et prénom du réservant
  - Date et heure de la réservation
  - Nombre de places réservées
  - Montant total payé
  - Informations du transporteur (nom, contact)
  - Statut du paiement
  - Liste des billets associés
  - Mentions légales et conditions d’utilisation

### b. Billet électronique (e-billet)
- Un billet généré pour chaque place réservée.
- Chaque billet possède :
  - Identifiant unique du billet
  - Identifiant de la réservation
  - Nom et prénom du réservant (peut être le même pour tous)
  - Date et heure du trajet
  - Lieu de départ et d’arrivée
  - Numéro du bus ou transporteur
  - QR code unique (contenant l’identifiant du billet ou un lien sécurisé)
  - Statut du billet (valide, utilisé, annulé)

---

## 3. Gestion des e-factures et e-billets

- Les factures et billets sont stockés dans la base de données, liés à la réservation.
- La facture est accessible et téléchargeable par l’utilisateur (PDF ou affichage web).
- Les billets sont accessibles individuellement, chaque billet pouvant être présenté à l’entrée du bus.
- Le QR code du billet permet la vérification rapide à l’entrée (scan et validation côté backend).
- En cas de réservation groupée, tous les billets peuvent porter le même nom, mais chaque billet reste unique par son identifiant et QR code.

---

## 4. Exemple de structure de données

### Facture (e-facture)
```json
{
  "invoiceId": "F20250805-001",
  "reservationId": "R20250805-123",
  "customerName": "Jean Dupont",
  "date": "2025-08-05T10:30:00Z",
  "places": 3,
  "totalAmount": 4500,
  "transporter": {
    "name": "TransBus",
    "contact": "+221 77 123 45 67"
  },
  "status": "payé",
  "tickets": [
    "T20250805-001",
    "T20250805-002",
    "T20250805-003"
  ]
}
```

### Billet (e-billet)
```json
{
  "ticketId": "T20250805-001",
  "reservationId": "R20250805-123",
  "customerName": "Jean Dupont",
  "date": "2025-08-10T08:00:00Z",
  "departure": "Dakar",
  "arrival": "Saint-Louis",
  "busNumber": "BUS-12",
  "qrCode": "...base64 ou url...",
  "status": "valide"
}
```

---

## 5. Sécurité et conformité
- Les QR codes doivent être uniques et difficilement falsifiables.
- Les données personnelles doivent être protégées (RGPD ou équivalent).
- Les factures et billets doivent être conservés selon la législation en vigueur.

---

## 6. Points techniques
- Génération des PDF : utiliser une librairie comme `pdfkit` ou `html-pdf`.
- Génération des QR codes : utiliser une librairie comme `qrcode` ou `qr-image`.
- Vérification des billets à l’entrée : scan du QR code, vérification en base, mise à jour du statut.

---

## 7. Cas particuliers
- Annulation de réservation : la facture et les billets sont marqués comme annulés.
- Réservation groupée : tous les billets peuvent porter le même nom, mais chaque billet reste unique.

---

## 8. Workflow résumé
1. L’utilisateur réserve une ou plusieurs places.
2. Le backend génère une facture et les billets associés.
3. L’utilisateur reçoit la facture et les billets (affichage ou téléchargement).
4. À l’entrée du bus, chaque billet est scanné et validé.

---

## 9. Évolutions possibles
- Ajout de la personnalisation des billets (nom par place, choix du siège).
- Envoi automatique par email ou SMS.
- Intégration avec des systèmes de contrôle d’accès.

---

## 10. FAQ
- **Un utilisateur peut-il réserver plusieurs places sous le même nom ?** Oui, chaque billet reste unique.
- **La facture est-elle générée pour chaque billet ?** Non, une seule facture par réservation.
- **Le QR code est-il obligatoire ?** Oui, pour la sécurité et la rapidité du contrôle.

---

Pour toute question ou évolution, contacter l’équipe technique.
