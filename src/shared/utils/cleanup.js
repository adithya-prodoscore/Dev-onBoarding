import cron from "node-cron";
import pool from "../database/db.js";

const initCleanupTask = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const [result] = await pool.query(
        "DELETE FROM refresh_tokens WHERE created_at < NOW() - INTERVAL 2 DAY",
      );

      console.log(
        `Cleanup successful. Removed ${result.affectedRows} expired tokens.`,
      );
    } catch (error) {
      console.error("Cleanup Task Failed:", error.message);
    }
  });
};

export default initCleanupTask;
