const { Trajet } = require('./models');

async function checkTrajets() {
  try {
    const trajets = await Trajet.findAll();
    console.log('Trajets disponibles:', trajets.length);
    
    if (trajets.length === 0) {
      console.log('❌ Aucun trajet trouvé. Il faut en créer un pour tester.');
    } else {
      trajets.forEach(t => {
        console.log(`ID: ${t.id}, ${t.departure_city} → ${t.arrival_city}, Prix: ${t.price} FCFA`);
      });
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
  process.exit(0);
}

checkTrajets();