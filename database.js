import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.POSTGRES_STRING + "?sslmode=require",
});

pool.connect((err) => {
  if (err) throw err;
  console.log("Connected to PostgreSQL successfully!");
});

export default pool;
