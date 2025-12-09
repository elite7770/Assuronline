import { pool } from '../../infrastructure/database/db.js';

export async function insertClaim({
  userId,
  policyId,
  type,
  incidentDate,
  description,
  amountEstimate,
  incidentLocation,
}) {
  // Generate claim number
  const claimNumber = `CLM-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  
  const [result] = await pool.execute(
    `INSERT INTO claims (user_id, policy_id, claim_number, claim_type, incident_date, incident_description, estimated_amount, incident_location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, policyId, claimNumber, type, incidentDate, description || null, amountEstimate || null, incidentLocation || null]
  );
  return result.insertId;
}

export async function updateClaimIfPending(id, userId, fields) {
  const [rows] = await pool.execute('SELECT * FROM claims WHERE id = ? AND user_id = ?', [
    id,
    userId,
  ]);
  const claim = rows[0];
  if (!claim) return null;
  if (claim.status !== 'pending') return false;
  const { type, incidentDate, description, amountEstimate } = fields;
  await pool.execute(
    `UPDATE claims SET claim_type = COALESCE(?, claim_type), incident_date = COALESCE(?, incident_date), incident_description = COALESCE(?, incident_description), estimated_amount = COALESCE(?, estimated_amount) WHERE id = ?`,
    [type || null, incidentDate || null, description || null, amountEstimate ?? null, id]
  );
  const [rows2] = await pool.execute('SELECT * FROM claims WHERE id = ?', [id]);
  return rows2[0];
}

export async function listClaimsByUser(userId) {
  const [rows] = await pool.execute(
    'SELECT * FROM claims WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

export async function listAllClaims() {
  const [rows] = await pool.execute('SELECT * FROM claims ORDER BY created_at DESC');
  return rows;
}

export async function setClaimStatus(id, status, adminComment, amountSettled) {
  await pool.execute(
    'UPDATE claims SET status = ?, admin_comment = ?, amount_estimate = COALESCE(?, amount_estimate) WHERE id = ?',
    [status, adminComment || null, amountSettled ?? null, id]
  );
  const [rows] = await pool.execute('SELECT * FROM claims WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function findClaimById(id) {
  const [rows] = await pool.execute('SELECT * FROM claims WHERE id = ?', [id]);
  return rows[0] || null;
}
