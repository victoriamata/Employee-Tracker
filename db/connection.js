// import package
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_db',
  port: 5432, // default port//
});

// logs messages to advise if the connection was sucessful or failed:
const connectToDb = async () => {
  try {
    await pool.connect();
    console.log('Sucessfully connected to db!');
  } catch (err) {
    console.error('Failed to connect to db:', err);
  }
};

export { pool, connectToDb };

