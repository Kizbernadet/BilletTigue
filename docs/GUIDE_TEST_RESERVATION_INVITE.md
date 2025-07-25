# Guide de Test - Cycle de Réservation Invité

## 🎯 Objectif
Tester le cycle complet de réservation pour un utilisateur invité (sans compte) dans BilletTigue.

## 📋 Prérequis
1. Backend en cours d'exécution sur `http://localhost:5000`
2. Base de données avec au moins un trajet disponible
3. Navigateur web moderne

## 🧪 Étapes de Test

### 1. Préparation
```bash
# Démarrer le backend
cd backend
npm start

# Dans un autre terminal, démarrer le frontend
cd web
# Ouvrir index.html dans le navigateur
```

### 2. Test de la Route API
```bash
# Exécuter le script de test
node test-guest-reservation.js
```

**Résultat attendu :**
- Status: 201
- Success: true
- Référence générée (ex: BT-000001)
- QR code et URL de facture

### 3. Test du Frontend

#### Étape 1 : Accès à la page de réservation
1. Aller sur `http://localhost:3000/pages/search-trajets.html`
2. Rechercher un trajet disponible
3. Cliquer sur "Réserver" pour un trajet

#### Étape 2 : Remplir le formulaire de réservation
1. Remplir les informations du passager :
   - Prénom : "Test"
   - Nom : "Invité"
   - Téléphone : "70123456"
   - Nombre de places : 1

2. Choisir le mode de paiement : "Paiement en espèces"

3. Optionnel : Cocher "Option remboursable" (+15%)

4. Vérifier le récapitulatif des prix

#### Étape 3 : Confirmer la réservation
1. Cliquer sur "Confirmer la réservation"
2. La modale d'authentification doit apparaître

#### Étape 4 : Choisir l'option invité
1. Dans la modale, cliquer sur "Continuer en tant qu'invité"
2. Le système doit traiter la réservation

#### Étape 5 : Vérifier la modale de succès
1. La modale de succès invité doit s'afficher avec :
   - ✅ Icône de billet animée
   - 📱 QR code stylisé (placeholder pour l'instant)
   - 📋 Détails de la réservation
   - ⚠️ Avis importants
   - 🔘 Boutons d'action

#### Étape 6 : Tester les fonctionnalités
1. **Télécharger la facture** : Affiche un message de développement
2. **Partager** : Copie les informations dans le presse-papiers
3. **Nouvelle recherche** : Redirige vers la page de recherche
4. **Fermer la modale** : Cliquer en dehors ou appuyer sur Échap

## 🔍 Points de Vérification

### ✅ Fonctionnalités à vérifier
- [ ] Formulaire de réservation se remplit correctement
- [ ] Calcul automatique des prix (avec/sans option remboursable)
- [ ] Validation des champs obligatoires
- [ ] Modale d'authentification s'affiche
- [ ] Option "Continuer en tant qu'invité" fonctionne
- [ ] Réservation créée en base de données
- [ ] Modale de succès invité s'affiche
- [ ] QR code placeholder s'affiche
- [ ] Détails de réservation corrects
- [ ] Boutons d'action fonctionnels
- [ ] Responsive design sur mobile

### ❌ Erreurs à détecter
- [ ] Erreurs de validation
- [ ] Erreurs de connexion API
- [ ] Erreurs d'affichage
- [ ] Problèmes de responsive

## 🐛 Dépannage

### Problème : "Service de réservation invité non disponible"
**Solution :** Vérifier que le backend est démarré et que la route `/api/reservations/guest` existe.

### Problème : "Trajet introuvable"
**Solution :** Vérifier qu'il y a des trajets en base de données avec `available_seats > 0`.

### Problème : "Incohérence dans le calcul du montant total"
**Solution :** Vérifier que le calcul côté frontend correspond au backend.

### Problème : Modale ne s'affiche pas
**Solution :** Vérifier les erreurs JavaScript dans la console du navigateur.

## 📊 Données de Test

### Trajet de test
```sql
INSERT INTO trajets (departure_city, arrival_city, departure_time, price, available_seats, transporteur_id) 
VALUES ('Bamako', 'Sikasso', '2024-12-20 08:00:00', 5000, 10, 1);
```

### Réservation de test
```javascript
{
    trajet_id: 1,
    passenger_first_name: "Test",
    passenger_last_name: "Invité", 
    phone_number: "70123456",
    seats_reserved: 1,
    payment_method: "cash",
    refundable_option: false,
    refund_supplement_amount: 0,
    total_amount: 5000
}
```

## 🎉 Succès
Le test est réussi si :
1. ✅ La réservation est créée en base
2. ✅ La modale de succès s'affiche correctement
3. ✅ Toutes les informations sont correctes
4. ✅ Les boutons d'action fonctionnent
5. ✅ L'expérience utilisateur est fluide

## 🔄 Prochaines Étapes
1. Implémenter la vraie génération de QR code
2. Créer la génération de facture PDF
3. Ajouter les notifications SMS
4. Tester le cycle utilisateur connecté 