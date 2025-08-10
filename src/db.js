const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 27857,
  ssl: {
    ca: process.env.DB_SSL_CA, 
    rejectUnauthorized: true
  },
  connectTimeout: 10000, 
});


pool.query("SELECT 1")
  .then(() => console.log('✅ MySQL Connected'))
  .catch(err => console.error(' MySQL Connection Failed:', err));

module.exports = pool;