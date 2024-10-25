// import package
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_db',
  port: 5432, // default port//
});


export default pool;

