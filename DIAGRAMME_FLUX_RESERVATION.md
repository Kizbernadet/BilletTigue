# 🔄 Diagramme de Flux - Processus de Réservation Billettigue

## 📊 Flux Principal de Réservation

```
┌─────────────────┐
│   ACCUEIL       │
│  (index.html)   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  RECHERCHE      │
│ search-trajets  │
│   .html         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐
│  LISTE TRAJETS  │───▶│  DÉTAILS TRAJET │
│   DISPONIBLES   │    │   (Modal)       │
└─────────┬───────┘    └─────────────────┘
          │
          ▼
┌─────────────────┐
│  BOUTON         │
│ "RÉSERVER"      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  PAGE           │
│ RÉSERVATION     │
│(reservation.html)│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  CHARGEMENT     │
│  DÉTAILS TRAJET │
│   (API GET)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  FORMULAIRE     │
│  RÉSERVATION    │
│  + VALIDATION   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  BOUTON         │
│ "CONFIRMER"     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VÉRIFICATION   │
│  AUTHENTIFICATION│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  UTILISATEUR    │
│  CONNECTÉ ?     │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────┐
│   OUI   │ │   NON   │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│RÉSERVATION│ │ MODAL   │
│ DIRECTE  │ │ CHOIX   │
└────┬────┘ └────┬────┘
     │           │
     │           ▼
     │    ┌─────────┐
     │    │ INVITÉ  │
     │    │ OU      │
     │    │ CONNEXION│
     │    └────┬────┘
     │         │
     │         ▼
     │    ┌─────────┐
     │    │ INVITÉ  │
     │    └────┬────┘
     │         │
     └─────────┘
           │
           ▼
┌─────────────────┐
│  TRAITEMENT     │
│  BACKEND        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VALIDATION     │
│  DONNÉES        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VÉRIFICATION   │
│  DISPONIBILITÉ  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TRANSACTION    │
│  BASE DE DONNÉES│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  CRÉATION       │
│  RÉSERVATION    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  CRÉATION       │
│  PAIEMENT       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  MISE À JOUR    │
│  PLACES DISPO   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  RÉPONSE        │
│  API            │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TYPE DE        │
│  RÉSERVATION ?  │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────┐
│UTILISATEUR│ │  INVITÉ  │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│MODAL    │ │MODAL    │
│SUCCÈS   │ │SUCCÈS   │
│USER     │ │INVITÉ   │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│RÉFÉRENCE│ │QR CODE  │
│+ PAIEMENT│ │+ FACTURE│
└─────────┘ └─────────┘
```

## 🔄 Flux Détaillé - Réservation Utilisateur

```
┌─────────────────┐
│  UTILISATEUR    │
│  CONNECTÉ       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  API POST       │
│ /reservations   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  MIDDLEWARE     │
│  AUTHENTIFICATION│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  CONTROLLER     │
│  createReservation│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  SERVICE        │
│  createReservation│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VALIDATION     │
│  DONNÉES        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VÉRIFICATION   │
│  TRAJET         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VÉRIFICATION   │
│  RÉSERVATION    │
│  EXISTANTE      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TRANSACTION    │
│  DÉBUT          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  CRÉATION       │
│  RÉSERVATION    │
│  (status: pending)│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  CRÉATION       │
│  PAIEMENT       │
│  (status: pending)│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  DÉCRÉMENTATION │
│  PLACES DISPO   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TRANSACTION    │
│  COMMIT         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  RÉPONSE        │
│  SUCCÈS         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  MODAL SUCCÈS   │
│  + INFOS PAIEMENT│
└─────────────────┘
```

## 🔄 Flux Détaillé - Réservation Invité

```
┌─────────────────┐
│  UTILISATEUR    │
│  NON CONNECTÉ   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  MODAL CHOIX    │
│  "Continuer     │
│  en tant        │
│  qu'invité"     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  API POST       │
│ /reservations/  │
│ guest           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  CONTROLLER     │
│  createGuestReservation│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  SERVICE        │
│  createGuestReservation│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VALIDATION     │
│  DONNÉES        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VÉRIFICATION   │
│  TRAJET         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TRANSACTION    │
│  DÉBUT          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  CRÉATION       │
│  RÉSERVATION    │
│  (status: confirmed)│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  CRÉATION       │
│  PAIEMENT       │
│  (status: completed)│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  DÉCRÉMENTATION │
│  PLACES DISPO   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  GÉNÉRATION     │
│  RÉFÉRENCE      │
│  UNIQUE         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TRANSACTION    │
│  COMMIT         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  RÉPONSE        │
│  SUCCÈS         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  MODAL SUCCÈS   │
│  + QR CODE      │
│  + FACTURE      │
└─────────────────┘
```

## 🔄 Flux de Gestion des Erreurs

```
┌─────────────────┐
│  ERREUR         │
│  DÉTECTÉE       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TYPE D'ERREUR ?│
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────┐
│VALIDATION│ │MÉTIER   │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ROLLBACK │ │ROLLBACK │
│TRANSACTION│ │TRANSACTION│
└────┬────┘ └────┬────┘
     │           │
     └─────┬─────┘
           │
           ▼
┌─────────────────┐
│  RÉPONSE        │
│  ERREUR         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  AFFICHAGE      │
│  MESSAGE        │
│  UTILISATEUR    │
└─────────────────┘
```

## 🔄 Flux de Confirmation de Paiement

```
┌─────────────────┐
│  UTILISATEUR    │
│  CONNECTÉ       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  API PUT        │
│ /reservations/  │
│ :id/confirm-    │
│ payment         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  SERVICE        │
│  confirmPayment │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VÉRIFICATION   │
│  RÉSERVATION    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TRANSACTION    │
│  DÉBUT          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  MISE À JOUR    │
│  PAIEMENT       │
│  (status: completed)│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  MISE À JOUR    │
│  RÉSERVATION    │
│  (status: confirmed)│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TRANSACTION    │
│  COMMIT         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  RÉPONSE        │
│  SUCCÈS         │
└─────────────────┘
```

## 🔄 Flux d'Annulation de Réservation

```
┌─────────────────┐
│  UTILISATEUR    │
│  CONNECTÉ       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  API PUT        │
│ /reservations/  │
│ :id/cancel      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  SERVICE        │
│  cancelReservation│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VÉRIFICATION   │
│  RÉSERVATION    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VÉRIFICATION   │
│  POLITIQUE      │
│  D'ANNULATION   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TRANSACTION    │
│  DÉBUT          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  MISE À JOUR    │
│  RÉSERVATION    │
│  (status: cancelled)│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  LIBÉRATION     │
│  PLACES         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  GESTION        │
│  REMBOURSEMENT  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  TRANSACTION    │
│  COMMIT         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  RÉPONSE        │
│  SUCCÈS         │
└─────────────────┘
```

## 📊 États et Transitions

```
┌─────────────┐
│   PENDING   │
│ (En attente)│
└─────┬───────┘
      │
      ▼
┌─────────────┐    ┌─────────────┐
│ CONFIRMED   │    │ CANCELLED   │
│(Confirmée)  │    │(Annulée)    │
└─────┬───────┘    └─────────────┘
      │
      ▼
┌─────────────┐
│ COMPLETED   │
│(Terminée)   │
└─────────────┘
```

## 🔧 Points de Validation

```
┌─────────────────┐
│  VALIDATION     │
│  FRONTEND       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VALIDATION     │
│  BACKEND        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VÉRIFICATION   │
│  DISPONIBILITÉ  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VÉRIFICATION   │
│  DOUBLONS       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  VALIDATION     │
│  TRANSACTION    │
└─────────────────┘
```

## 🎯 Points Clés du Processus

1. **Séparation des responsabilités** : Frontend, Backend, Base de données
2. **Gestion transactionnelle** : Atomicité des opérations
3. **Validation multi-niveaux** : Frontend + Backend
4. **Gestion des erreurs** : Rollback automatique
5. **Flexibilité** : Réservations avec/sans compte
6. **Sécurité** : Authentification et validation
7. **UX optimisée** : Interface intuitive et responsive 