import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_db',
  port: 5432,
});

const connectToDb = async () => {
  try {
    await pool.connect();
    console.log('Sucessfully connected to db!');
  } catch (err) {
    console.error('Failed to connect to db:', err);
  }
};

export { pool, connectToDb };

