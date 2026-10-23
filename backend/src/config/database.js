import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

// In produzione utilizziamo DATABASE_URL.
// In locale manteniamo i parametri DB_*.
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.DB_POOL_MAX || 3),
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: Number(process.env.DB_POOL_MAX || 10),
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    };

const pool = new Pool(poolConfig);

pool.on("error", (error) => {
  console.error(
    "[PostgreSQL] Errore su connessione inattiva:",
    error.message
  );
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function checkDatabaseConnection() {
  const result = await query(`
    SELECT
      current_database() AS database_name,
      current_user AS connected_user,
      NOW() AS server_time
  `);

  return result.rows[0];
}

export async function closeDatabasePool() {
  await pool.end();
}

export default pool;
