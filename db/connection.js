import pg from "pg";
const { Pool } = pg;

import dotenv from "dotenv";
dotenv.config(); // Connecting to .env file

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  database: process.env.DB_NAME,
  port: 5432, // Default port//
});
// Logs messages to advise if the connection was sucessful or failed:
const connectToDb = async () => {
  try {
    await pool.connect();
    console.log("Database successfully connected.");
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};

export { pool, connectToDb };
