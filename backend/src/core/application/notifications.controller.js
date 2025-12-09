import { pool } from '../../infrastructure/database/db.js';
import { createNotification } from '../../core/domain/notifications.model.js';

export async function listNotifications(req, res) {
  const [rows] = await pool.execute(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC',
    [req.user.id]
  );
  res.json(rows);
}

export async function markRead(req, res) {
  const { id } = req.params;
  await pool.execute('UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?', [
    id,
    req.user.id,
  ]);
  res.json({ ok: true });
}

export async function adminBroadcast(req, res) {
  const { user_id, title, message, type } = req.body;
  if (!title || !message) return res.status(400).json({ message: 'Missing fields' });
  if (user_id) {
    await createNotification({ userId: user_id, title, message, type: type || 'system' });
  } else {
    // broadcast to all users
    const [users] = await pool.execute('SELECT id FROM users');
    for (const u of users) {
      await createNotification({ userId: u.id, title, message, type: type || 'system' });
    }
  }
  res.json({ ok: true });
}
