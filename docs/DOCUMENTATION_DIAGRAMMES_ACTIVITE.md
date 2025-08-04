# 🔄 Documentation des Diagrammes d’Activité – BilletTigue

Cette documentation présente l’utilité des diagrammes d’activité pour le projet BilletTigue, propose des exemples de scénarios clés, fournit un exemple de code PlantUML, et explique comment les utiliser pour modéliser les processus métier.

---

## 1. Objectif des diagrammes d’activité

Le diagramme d’activité UML permet de modéliser graphiquement le déroulement d’un processus métier ou d’une fonctionnalité, en représentant les différentes étapes, les décisions, les boucles et les flux parallèles.

Il est particulièrement utile pour :
- Comprendre et optimiser les processus métier complexes
- Décrire les scénarios d’utilisation (réservation, paiement, gestion de profil, etc.)
- Communiquer avec les parties prenantes non techniques

---

## 2. Exemples de scénarios à modéliser

- **Processus de réservation d’un trajet**
- **Processus de paiement d’une réservation**
- **Processus d’inscription et d’authentification**
- **Processus d’envoi de colis**
- **Gestion du cycle de vie d’une réservation (création, paiement, annulation, etc.)**

---

## 3. Exemples de diagrammes d’activité (PlantUML)

### **A. Processus de réservation d’un trajet**

```plantuml
@startuml
start
:Afficher formulaire de recherche;
:Entrer critères de recherche;
:Rechercher trajets disponibles;
if (Trajets trouvés ?) then (oui)
  :Afficher liste des trajets;
  :Sélectionner un trajet;
  :Saisir infos passager;
  :Vérifier disponibilité;
  if (Places disponibles ?) then (oui)
    :Créer réservation;
    :Afficher confirmation;
  else (non)
    :Afficher message "Complet";
  endif
else (non)
  :Afficher message "Aucun trajet";
endif
stop
@enduml
```

**Description :**
Ce diagramme modélise le processus complet de réservation d’un trajet, avec gestion des cas d’absence de trajet ou de places disponibles.

---

### **B. Processus de paiement d’une réservation**

```plantuml
@startuml
start
:Afficher réservation à payer;
:Choisir mode de paiement;
:Entrer infos paiement;
:Envoyer demande de paiement;
if (Paiement accepté ?) then (oui)
  :Mettre à jour statut réservation;
  :Afficher confirmation;
else (non)
  :Afficher message d'échec;
endif
stop
@enduml
```

**Description :**
Ce diagramme décrit le paiement d’une réservation, avec gestion du cas d’échec (paiement refusé, erreur technique).

---

### **C. Processus d’inscription et d’authentification**

```plantuml
@startuml
start
:Afficher formulaire d'inscription/connexion;
:Entrer infos utilisateur;
:Valider côté client;
if (Données valides ?) then (oui)
  :Envoyer au serveur;
  :Valider côté serveur;
  if (Succès ?) then (oui)
    :Créer compte/session;
    :Afficher tableau de bord;
  else (non)
    :Afficher erreur serveur;
  endif
else (non)
  :Afficher erreur de saisie;
endif
stop
@enduml
```

**Description :**
Ce diagramme modélise l’inscription ou la connexion, avec gestion des erreurs côté client et serveur.

---

### **D. Processus d’envoi de colis**

```plantuml
@startuml
start
:Afficher formulaire envoi colis;
:Entrer infos colis et destinataire;
:Vérifier contraintes (poids, volume);
if (Colis conforme ?) then (oui)
  :Chercher trajets disponibles;
  if (Trajet trouvé ?) then (oui)
    :Affecter colis au trajet;
    :Afficher confirmation;
  else (non)
    :Afficher message "Aucun trajet";
  endif
else (non)
  :Afficher message "Colis non conforme";
endif
stop
@enduml
```

**Description :**
Ce diagramme décrit l’envoi d’un colis, avec gestion des contraintes et des cas d’absence de trajet ou de non-conformité du colis.

---

### **E. Cycle de vie d’une réservation**

```plantuml
@startuml
start
:Créer réservation;
:Statut = "en attente";
if (Paiement reçu ?) then (oui)
  :Statut = "confirmée";
  if (Annulation demandée ?) then (oui)
    :Statut = "annulée";
  else (non)
    :Statut = "effectuée";
  endif
else (non)
  :Attendre paiement;
endif
stop
@enduml
```

**Description :**
Ce diagramme modélise le cycle de vie d’une réservation, de la création à la confirmation, l’annulation ou la réalisation, en intégrant les transitions d’état clés.

---

## 4. Bonnes pratiques
- **Clarté** : Utiliser des noms d’étapes explicites et des décisions claires
- **Gestion des exceptions** : Toujours modéliser les cas d’échec ou d’alternative
- **Mise à jour** : Adapter les diagrammes à chaque évolution des processus métier
- **Documentation** : Intégrer les diagrammes dans la documentation projet pour faciliter la communication

---

**Pour chaque processus métier clé, il est recommandé de réaliser un diagramme d’activité et de le documenter dans ce dossier.** 