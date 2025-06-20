const { Pool } = require('pg');
//require('dotenv').config();
require('dotenv').config({ path: __dirname + '/../.env' });


//console.log("ENV:", process.env); // temporaire pour voir si les variables sont bien chargées
//console.log("🔍 DB_USER = ", process.env.DB_USER);



const pool = new Pool({
  host     : process.env.DB_HOST || 'localhost',
  user     : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASSWORD || '',
  database : process.env.DB_NAME || 'BILLETTIGUE',
  port     : process.env.DB_PORT || 5432
});


pool.connect()
  .then(() => console.log('Connecté à PostgreSQL'))
  .catch(err => {
    console.error('Erreur connexion PostgreSQL :', err.message);
    process.exit(1);
  });

module.exports = pool;
