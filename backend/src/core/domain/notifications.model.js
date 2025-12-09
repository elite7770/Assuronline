import { pool } from '../../infrastructure/database/db.js';

export async function createNotification({ userId, title, message, type = 'info' }) {
  const [result] = await pool.execute(
    `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
    [userId, title, message, type]
  );
  return result.insertId;
}
