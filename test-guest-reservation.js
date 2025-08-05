// Script de test pour la réservation invité
const testGuestReservation = async () => {
    const testData = {
        trajet_id: 1, // Assurez-vous qu'un trajet avec cet ID existe
        passenger_first_name: "Test",
        passenger_last_name: "Invité",
        phone_number: "70123456",
        seats_reserved: 1,
        payment_method: "cash",
        refundable_option: false,
        refund_supplement_amount: 0,
        total_amount: 5000 // Assurez-vous que c'est le bon prix
    };

    try {
        console.log('🧪 Test de réservation invité...');
        console.log('📤 Données envoyées:', testData);

        const response = await fetch('http://localhost:3000/api/reservations/guest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        console.log('📥 Réponse du serveur:');
        console.log('Status:', response.status);
        console.log('Success:', result.success);
        console.log('Message:', result.message);
        
        if (result.success) {
            console.log('✅ Réservation invité créée avec succès!');
            console.log('📋 Détails:', {
                reference: result.data.reference,
                qr_code: result.data.qr_code,
                invoice_url: result.data.invoice_url
            });
        } else {
            console.log('❌ Erreur:', result.message);
        }

    } catch (error) {
        console.error('❌ Erreur de connexion:', error.message);
    }
};

// Exécuter le test
testGuestReservation(); 