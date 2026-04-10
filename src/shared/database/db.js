import { createPool } from "mysql2/promise";

const pool = createPool({
  host: "127.0.0.1",
  user: "root",
  password: "adithya",
  database: "myapp",
  waitForConnections: true,
  connectionLimit: 10,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Connected to MySQL");
    conn.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
})();

export default pool;
