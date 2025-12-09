import { pool } from '../../infrastructure/database/db.js';

export async function insertPolicy({
  userId,
  vehicleId,
  quoteId,
  policyNumber,
  type,
  coverageType,
  coverageDetails,
  premiumAmount,
  startDate,
  endDate,
  status = 'pending',
  paymentFrequency = 'annually',
  nextPaymentDate,
  autoRenewal = true,
}) {
  const [result] = await pool.execute(
    `INSERT INTO policies (user_id, vehicle_id, quote_id, policy_number, type, coverage_type, coverage, premium, start_date, end_date, status, payment_frequency, next_payment_date, auto_renewal)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      vehicleId,
      quoteId,
      policyNumber,
      type,
      coverageType,
      JSON.stringify(coverageDetails || {}),
      premiumAmount,
      startDate,
      endDate,
      status,
      paymentFrequency,
      nextPaymentDate,
      autoRenewal,
    ]
  );
  return result.insertId;
}

export async function findPolicyById(id) {
  const [rows] = await pool.execute('SELECT * FROM policies WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function findPolicyByNumber(policyNumber) {
  const [rows] = await pool.execute('SELECT * FROM policies WHERE policy_number = ?', [
    policyNumber,
  ]);
  return rows[0] || null;
}

export async function findPoliciesByUser(userId) {
  const [rows] = await pool.execute(
    `
    SELECT p.*, v.brand, v.model, v.year, v.license_plate, u.name as customer_name, u.email as customer_email
    FROM policies p
    LEFT JOIN vehicles v ON p.vehicle_id = v.id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `,
    [userId]
  );
  return rows;
}

export async function findAllPolicies(filters = {}) {
  let query = `
    SELECT p.*, v.brand, v.model, v.year, v.license_plate, u.name as customer_name, u.email as customer_email
    FROM policies p
    LEFT JOIN vehicles v ON p.vehicle_id = v.id
    LEFT JOIN users u ON p.user_id = u.id
  `;
  
  const conditions = [];
  const params = [];
  
  if (filters.status) {
    conditions.push('p.status = ?');
    params.push(filters.status);
  }
  
  if (filters.type) {
    conditions.push('p.type = ?');
    params.push(filters.type);
  }
  
  if (filters.coverageType) {
    conditions.push('p.coverage_type = ?');
    params.push(filters.coverageType);
  }
  
  if (filters.dateFrom) {
    conditions.push('p.start_date >= ?');
    params.push(filters.dateFrom);
  }
  
  if (filters.dateTo) {
    conditions.push('p.start_date <= ?');
    params.push(filters.dateTo);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY p.created_at DESC';
  
  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
    
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
  }
  
  const [rows] = await pool.execute(query, params);
  return rows;
}

export async function findActivePolicies() {
  const [rows] = await pool.execute(`
    SELECT p.*, v.brand, v.model, v.year, v.license_plate, u.name as customer_name, u.email as customer_email
    FROM policies p
    LEFT JOIN vehicles v ON p.vehicle_id = v.id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.status = 'active'
    ORDER BY p.end_date ASC
  `);
  return rows;
}

export async function findPoliciesExpiringSoon(days = 30) {
  const [rows] = await pool.execute(
    `
    SELECT p.*, v.brand, v.model, v.year, v.license_plate, u.name as customer_name, u.email as customer_email
    FROM policies p
    LEFT JOIN vehicles v ON p.vehicle_id = v.id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.status = 'active' 
    AND p.end_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
    AND p.end_date > CURDATE()
    ORDER BY p.end_date ASC
  `,
    [days]
  );
  return rows;
}

export async function updatePolicyStatus(id, status) {
  await pool.execute(
    'UPDATE policies SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id]
  );
}

export async function updatePolicy(id, updateData) {
  const fields = [];
  const values = [];

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      fields.push(`${key} = ?`);
      if (key === 'coverage_details') {
        values.push(JSON.stringify(updateData[key]));
      } else {
        values.push(updateData[key]);
      }
    }
  });

  if (fields.length === 0) return;

  values.push(id);
  const query = `UPDATE policies SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  await pool.execute(query, values);
}

export async function cancelPolicy(id, reason = null) {
  await pool.execute(
    `
    UPDATE policies 
    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ? AND status = 'active'
  `,
    [id]
  );

  // Log the cancellation reason if provided
  if (reason) {
    await pool.execute(
      `
      INSERT INTO audit_logs (action, table_name, record_id, new_values, created_at)
      VALUES ('policy_cancelled', 'policies', ?, ?, CURRENT_TIMESTAMP)
    `,
      [id, JSON.stringify({ reason, cancelled_at: new Date() })]
    );
  }
}

export async function renewPolicy(id, newStartDate, newEndDate, newPremiumAmount = null) {
  const policy = await findPolicyById(id);
  if (!policy) throw new Error('Policy not found');

  // Create new policy record for renewal
  const renewalData = {
    userId: policy.user_id,
    vehicleId: policy.vehicle_id,
    quoteId: null, // New renewal, no quote
    policyNumber: null, // Will be auto-generated
    type: policy.type,
    coverageType: policy.coverage_type,
    coverageDetails: JSON.parse(policy.coverage_details),
    premiumAmount: newPremiumAmount || policy.premium,
    startDate: newStartDate,
    endDate: newEndDate,
    status: 'pending',
    paymentFrequency: policy.payment_frequency,
    nextPaymentDate: newStartDate,
    autoRenewal: policy.auto_renewal,
  };

  const newPolicyId = await insertPolicy(renewalData);

  // Update old policy status
  await updatePolicyStatus(id, 'expired');

  return newPolicyId;
}

export async function getPolicyStatistics() {
  const [stats] = await pool.execute(`
    SELECT 
      COUNT(*) as total_policies,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_policies,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_policies,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_policies,
      SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_policies,
      SUM(CASE WHEN status = 'active' THEN premium_amount ELSE 0 END) as total_active_premiums,
      AVG(CASE WHEN status = 'active' THEN premium_amount ELSE NULL END) as average_premium
    FROM policies
  `);

  return stats[0];
}

export async function getPoliciesByType() {
  const [rows] = await pool.execute(`
    SELECT 
      type,
      coverage_type,
      COUNT(*) as count,
      AVG(premium) as average_premium,
      SUM(premium) as total_premium
    FROM policies 
    WHERE status = 'active'
    GROUP BY type, coverage_type
    ORDER BY type, coverage_type
  `);
  return rows;
}
