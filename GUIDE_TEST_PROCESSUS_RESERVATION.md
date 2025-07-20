# 🧪 Guide de Test - Processus de Réservation Billettigue

## 🎯 Objectif
Tester et valider le processus complet de réservation, de la recherche de trajet à la confirmation finale.

## 📋 Prérequis
- Backend en cours d'exécution sur `http://localhost:5000`
- Base de données avec trajets disponibles
- Navigateur web moderne
- Outils de développement (F12)

---

## 🚀 Test 1 : Réservation Utilisateur Connecté

### **Étape 1 : Préparation**
```bash
# Démarrer le backend
cd backend
npm start

# Vérifier la base de données
node check-trajets.js
```

### **Étape 2 : Connexion Utilisateur**
1. Aller sur `http://localhost:3000/pages/login.html`
2. Se connecter avec un compte utilisateur existant
3. Vérifier que le token est stocké dans `sessionStorage`

### **Étape 3 : Recherche de Trajet**
1. Aller sur `http://localhost:3000/pages/search-trajets.html`
2. Remplir les critères de recherche :
   - Ville de départ : "Bamako"
   - Ville d'arrivée : "Sikasso"
   - Date : Date future
3. Cliquer sur "Rechercher"
4. Vérifier l'affichage des résultats

### **Étape 4 : Sélection et Réservation**
1. Cliquer sur "Réserver" pour un trajet disponible
2. Vérifier la redirection vers `reservation.html`
3. Vérifier le chargement des détails du trajet

### **Étape 5 : Formulaire de Réservation**
1. Remplir les informations :
   - Prénom : "Test"
   - Nom : "Utilisateur"
   - Téléphone : "70123456"
   - Nombre de places : 2
2. Choisir le mode de paiement : "Paiement en espèces"
3. Optionnel : Cocher "Option remboursable"
4. Vérifier les calculs automatiques

### **Étape 6 : Confirmation**
1. Cliquer sur "Confirmer la réservation"
2. Vérifier que la réservation est créée directement (pas de modal)
3. Vérifier l'affichage de la modal de succès

### **Étape 7 : Vérification Backend**
```bash
# Vérifier la réservation en base
curl -X GET "http://localhost:5000/api/reservations" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚀 Test 2 : Réservation Invité

### **Étape 1 : Déconnexion**
1. Se déconnecter de l'application
2. Vérifier que le token est supprimé

### **Étape 2 : Recherche et Sélection**
1. Aller sur `http://localhost:3000/pages/search-trajets.html`
2. Rechercher un trajet disponible
3. Cliquer sur "Réserver"

### **Étape 3 : Formulaire Invité**
1. Remplir les informations passager
2. Choisir les options de paiement
3. Cliquer sur "Confirmer la réservation"

### **Étape 4 : Modal de Choix**
1. Vérifier l'affichage de la modal d'authentification
2. Cliquer sur "Continuer en tant qu'invité"
3. Vérifier le traitement de la réservation

### **Étape 5 : Modal de Succès Invité**
1. Vérifier l'affichage de la modal de succès invité
2. Vérifier la présence du QR code (placeholder)
3. Vérifier les détails de la réservation
4. Tester les boutons d'action

---

## 🚀 Test 3 : Validation des Données

### **Test 3.1 : Validation Frontend**
```javascript
// Dans la console du navigateur
// Test validation téléphone
document.getElementById('phone-number').value = '123';
// Doit afficher une erreur

// Test validation places
document.getElementById('seats-reserved').value = '0';
// Doit afficher une erreur

// Test validation nom
document.getElementById('passenger-first-name').value = 'A';
// Doit afficher une erreur
```

### **Test 3.2 : Validation Backend**
```bash
# Test avec données invalides
curl -X POST "http://localhost:5000/api/reservations/guest" \
  -H "Content-Type: application/json" \
  -d '{
    "trajet_id": 999,
    "passenger_first_name": "",
    "passenger_last_name": "",
    "phone_number": "invalid",
    "seats_reserved": 0
  }'
# Doit retourner 400 avec messages d'erreur
```

---

## 🚀 Test 4 : Gestion des Erreurs

### **Test 4.1 : Trajet Introuvable**
```bash
curl -X POST "http://localhost:5000/api/reservations/guest" \
  -H "Content-Type: application/json" \
  -d '{
    "trajet_id": 999999,
    "passenger_first_name": "Test",
    "passenger_last_name": "User",
    "phone_number": "70123456",
    "seats_reserved": 1,
    "total_amount": 15000
  }'
# Doit retourner 404
```

### **Test 4.2 : Places Insuffisantes**
1. Créer une réservation pour toutes les places disponibles
2. Essayer de créer une autre réservation pour le même trajet
3. Vérifier le message d'erreur

### **Test 4.3 : Réservation Doublon**
1. Se connecter avec un utilisateur
2. Créer une réservation pour un trajet
3. Essayer de créer une autre réservation pour le même trajet
4. Vérifier le message d'erreur

---

## 🚀 Test 5 : Gestion des Transactions

### **Test 5.1 : Concurrence**
```javascript
// Script de test de concurrence
async function testConcurrency() {
    const promises = [];
    for (let i = 0; i < 5; i++) {
        promises.push(
            fetch('http://localhost:5000/api/reservations/guest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trajet_id: 1,
                    passenger_first_name: `Test${i}`,
                    passenger_last_name: 'User',
                    phone_number: '70123456',
                    seats_reserved: 1,
                    total_amount: 15000
                })
            })
        );
    }
    
    const results = await Promise.all(promises);
    console.log('Résultats:', results);
}
```

### **Test 5.2 : Rollback Transaction**
1. Créer un trajet avec 1 place disponible
2. Créer une réservation pour 2 places (doit échouer)
3. Vérifier que la place n'a pas été décomptée

---

## 🚀 Test 6 : Calculs et Prix

### **Test 6.1 : Calcul Prix de Base**
```javascript
// Test calcul automatique
const basePrice = 15000;
const seats = 3;
const expectedSubtotal = basePrice * seats; // 45000
const expectedTotal = expectedSubtotal; // Sans option remboursable
```

### **Test 6.2 : Calcul Option Remboursable**
```javascript
// Test avec option remboursable
const basePrice = 15000;
const seats = 2;
const subtotal = basePrice * seats; // 30000
const refundSupplement = subtotal * 0.15; // 4500
const total = subtotal + refundSupplement; // 34500
```

### **Test 6.3 : Validation Montants**
```bash
# Test avec montant incorrect
curl -X POST "http://localhost:5000/api/reservations/guest" \
  -H "Content-Type: application/json" \
  -d '{
    "trajet_id": 1,
    "passenger_first_name": "Test",
    "passenger_last_name": "User",
    "phone_number": "70123456",
    "seats_reserved": 2,
    "refundable_option": true,
    "refund_supplement_amount": 4500,
    "total_amount": 30000
  }'
# Doit retourner erreur d'incohérence
```

---

## 🚀 Test 7 : Interface Utilisateur

### **Test 7.1 : Responsive Design**
1. Tester sur différentes tailles d'écran
2. Vérifier l'adaptation du layout
3. Tester sur mobile (F12 → Device toolbar)

### **Test 7.2 : Accessibilité**
1. Navigation au clavier
2. Contraste des couleurs
3. Messages d'erreur clairs
4. Labels appropriés

### **Test 7.3 : Performance**
```javascript
// Test temps de chargement
console.time('reservation-load');
// Charger la page de réservation
console.timeEnd('reservation-load');

// Test temps de soumission
console.time('reservation-submit');
// Soumettre la réservation
console.timeEnd('reservation-submit');
```

---

## 🚀 Test 8 : API Endpoints

### **Test 8.1 : Création Réservation Utilisateur**
```bash
curl -X POST "http://localhost:5000/api/reservations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "trajet_id": 1,
    "passenger_first_name": "Test",
    "passenger_last_name": "User",
    "phone_number": "70123456",
    "seats_reserved": 1,
    "refundable_option": false,
    "refund_supplement_amount": 0,
    "total_amount": 15000
  }'
```

### **Test 8.2 : Création Réservation Invité**
```bash
curl -X POST "http://localhost:5000/api/reservations/guest" \
  -H "Content-Type: application/json" \
  -d '{
    "trajet_id": 1,
    "passenger_first_name": "Test",
    "passenger_last_name": "Guest",
    "phone_number": "70123456",
    "seats_reserved": 1,
    "refundable_option": true,
    "refund_supplement_amount": 2250,
    "total_amount": 17250
  }'
```

### **Test 8.3 : Confirmation Paiement**
```bash
curl -X PUT "http://localhost:5000/api/reservations/1/confirm-payment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "payment_method": "cash",
    "transaction_id": "TXN123"
  }'
```

### **Test 8.4 : Annulation Réservation**
```bash
curl -X PUT "http://localhost:5000/api/reservations/1/cancel" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Checklist de Validation

### **✅ Fonctionnalités**
- [ ] Recherche de trajets fonctionne
- [ ] Sélection de trajet redirige vers réservation
- [ ] Formulaire de réservation s'affiche correctement
- [ ] Validation des données fonctionne
- [ ] Calculs automatiques sont corrects
- [ ] Réservation utilisateur connecté fonctionne
- [ ] Réservation invité fonctionne
- [ ] Modales de succès s'affichent
- [ ] QR code est généré (placeholder)
- [ ] Facture est accessible

### **✅ Sécurité**
- [ ] Authentification requise pour utilisateurs
- [ ] Validation des données côté serveur
- [ ] Gestion des erreurs appropriée
- [ ] Rollback des transactions en cas d'erreur
- [ ] Protection contre les doublons

### **✅ Performance**
- [ ] Temps de chargement acceptable
- [ ] Temps de réponse API < 2s
- [ ] Gestion de la concurrence
- [ ] Pas de fuites mémoire

### **✅ UX/UI**
- [ ] Interface responsive
- [ ] Messages d'erreur clairs
- [ ] Navigation intuitive
- [ ] Accessibilité respectée
- [ ] Design cohérent

---

## 🐛 Dépannage

### **Problèmes Courants**

#### **Erreur 404 - Trajet introuvable**
- Vérifier que le trajet existe en base
- Vérifier l'ID du trajet dans l'URL
- Vérifier les permissions d'accès

#### **Erreur 400 - Données invalides**
- Vérifier le format des données envoyées
- Vérifier les validations côté client
- Vérifier les validations côté serveur

#### **Erreur 401 - Non authentifié**
- Vérifier la présence du token
- Vérifier l'expiration du token
- Vérifier le format du token

#### **Erreur 500 - Erreur serveur**
- Vérifier les logs du serveur
- Vérifier la connexion à la base de données
- Vérifier les transactions

### **Logs Utiles**
```bash
# Logs du serveur
tail -f backend/logs/server.log

# Logs de la base de données
tail -f backend/logs/database.log

# Logs des erreurs
tail -f backend/logs/error.log
```

---

## 📈 Métriques de Test

### **Temps de Réponse**
- Chargement page réservation : < 3s
- Soumission réservation : < 2s
- Réponse API : < 1s

### **Taux de Succès**
- Réservation utilisateur : > 95%
- Réservation invité : > 95%
- Validation données : > 98%

### **Erreurs Acceptables**
- Erreurs 4xx : < 5%
- Erreurs 5xx : < 1%
- Timeouts : < 1%

---

## 🎯 Conclusion

Ce guide de test couvre l'ensemble du processus de réservation et permet de valider :
1. **Fonctionnalités** : Toutes les étapes du processus
2. **Sécurité** : Validation et authentification
3. **Performance** : Temps de réponse et concurrence
4. **UX** : Interface et expérience utilisateur

Les tests doivent être exécutés régulièrement pour garantir la qualité du système. 