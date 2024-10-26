import pg from 'pg';
const { Pool } = pg;

import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432, // default port//
});
// logs messages to advise if the connection was sucessful or failed:
pool.connect(err => {
  if (err) throw err;
  console.log('Database successfully connected.');
});

export default { pool };
