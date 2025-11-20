const { Pool } = require('pg'); // PostgreSQL client
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
    ssl: false
});

pool.on('connect', async (client) => {
  await client.query('SET search_path TO account;');
});

module.exports = pool;