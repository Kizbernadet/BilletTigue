# 🔄 Guide de Mise à Jour - Option Remboursable

## ✅ **Ce qui a été modifié**

### **1. Modèle de données**
- ✅ **Modèle `Reservation`** : Nouveaux champs ajoutés
  - `refundable_option` (BOOLEAN)
  - `refund_supplement_amount` (DECIMAL)
  - `total_amount` (DECIMAL)
  - `compte_id` maintenant NULL pour invités

### **2. Service de réservation**
- ✅ **Validation étendue** : Gestion des nouveaux champs
- ✅ **Fonction `createGuestReservation`** : Réservations sans compte
- ✅ **Calculs du montant total** : Base + supplément remboursable

### **3. Contrôleur de réservation**
- ✅ **Endpoint `createGuestReservation`** : Route pour invités

### **4. Routes**
- ✅ **`POST /api/reservations/guest`** : Nouvelle route sans auth

---

## 🚀 **Étapes de déploiement**

### **Étape 1 : Migration de la base de données**
```bash
# Dans le dossier backend/
cd backend

# Exécuter la migration
node migrations/add-refundable-option.js
```

### **Étape 2 : Redémarrer le serveur**
```bash
# Arrêter le serveur actuel
# Ctrl+C dans le terminal du serveur

# Redémarrer
npm start
# ou
node server.js
```

### **Étape 3 : Vérification**
```bash
# Tester la nouvelle route invité
curl -X POST http://localhost:5000/api/reservations/guest \
  -H "Content-Type: application/json" \
  -d '{
    "trajet_id": 1,
    "passenger_first_name": "Test",
    "passenger_last_name": "User",
    "phone_number": "65123456",
    "seats_reserved": 1,
    "refundable_option": true,
    "refund_supplement_amount": 2250,
    "total_amount": 17250
  }'
```

---

## 📋 **Nouvelles fonctionnalités disponibles**

### **Pour les utilisateurs connectés**
- ✅ Option remboursable avec supplément +15%
- ✅ Calcul automatique du total
- ✅ Sauvegarde de l'option dans la réservation

### **Pour les invités**
- ✅ Réservation sans compte (`/api/reservations/guest`)
- ✅ Référence unique générée (`BT-XXXXXX`)
- ✅ QR code pour vérification
- ✅ URL d'e-facture

### **Données envoyées par le frontend**
```javascript
{
  trajet_id: 1,
  passenger_first_name: "Jean",
  passenger_last_name: "Dupont", 
  phone_number: "65123456",
  seats_reserved: 2,
  payment_method: "cash",
  refundable_option: true,           // ✅ NOUVEAU
  refund_supplement_amount: 4500,    // ✅ NOUVEAU
  total_amount: 34500               // ✅ NOUVEAU
}
```

### **Réponse API améliorée**
```javascript
{
  success: true,
  data: {
    reservation: { /* données complètes */ },
    payment_info: {
      amount: 34500,
      refundable_option: true,        // ✅ NOUVEAU
      refund_supplement: 4500         // ✅ NOUVEAU
    }
  }
}
```

---

## 🔧 **En cas de problème**

### **Erreur de migration**
```bash
# Rollback si nécessaire
node -e "require('./migrations/add-refundable-option.js').down()"
```

### **Erreur de colonne manquante**
1. Vérifier que la migration a bien été exécutée
2. Redémarrer le serveur
3. Vérifier la structure de la table `reservations`

### **Tests de l'API**
```bash
# Via Postman ou curl
# Route utilisateur connecté (avec token)
POST /api/reservations

# Route invité (sans token)  
POST /api/reservations/guest
```

---

## 📊 **Statut de compatibilité**

| Composant | Status | Version |
|-----------|--------|---------|
| **Frontend** | ✅ Prêt | Option complète |
| **Backend API** | ✅ Prêt | Routes mises à jour |
| **Base de données** | ⚠️ Nécessite migration | Nouveaux champs |
| **Services** | ✅ Prêt | Validation étendue |

---

## 🎯 **Prochaines étapes optionnelles**

1. **Génération PDF** : E-factures avec QR code
2. **Page de vérification** : `/verify/{reference}`
3. **Gestion des remboursements** : Interface admin
4. **Notifications** : Email/SMS pour invités

---

**✅ Une fois la migration exécutée, le système est prêt pour l'option remboursable !** 