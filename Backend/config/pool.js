const { Pool } = require('pg'); // PostgreSQL client
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
    ssl: false // Lưu ý: Nếu deploy lên render/vercel thì thường phải bật ssl: { rejectUnauthorized: false }
});

pool.on('connect', async (client) => {
  // QUAN TRỌNG: Đổi 'cake' thành 'app' để trỏ đúng schema mới
  await client.query('SET search_path TO app;');
});

module.exports = pool;