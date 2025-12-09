import { pool } from '../../infrastructure/database/db.js';

export async function createPayment({
  userId,
  policyId,
  amount,
  paymentType = 'premium',
  paymentMethod = 'card',
  dueDate = null,
  transactionId = null,
  gatewayResponse = null,
}) {
  const [result] = await pool.execute(
    `INSERT INTO payments (user_id, policy_id, amount, payment_type, payment_method, transaction_id, gateway_response, due_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      userId,
      policyId,
      amount,
      paymentType,
      paymentMethod,
      transactionId,
      JSON.stringify(gatewayResponse),
      dueDate,
    ]
  );
  return result.insertId;
}

export async function confirmPayment(id, transactionRef, gatewayResponse = null) {
  await pool.execute(
    `UPDATE payments SET status = 'paid', transaction_id = ?, gateway_response = ?, paid_at = NOW() WHERE id = ?`,
    [transactionRef, JSON.stringify(gatewayResponse), id]
  );
}

export async function updatePaymentStatus(id, status, gatewayResponse = null) {
  const updateFields = ['status = ?'];
  const values = [status];

  if (gatewayResponse) {
    updateFields.push('gateway_response = ?');
    values.push(JSON.stringify(gatewayResponse));
  }

  if (status === 'paid') {
    updateFields.push('paid_at = NOW()');
  }

  values.push(id);

  await pool.execute(`UPDATE payments SET ${updateFields.join(', ')} WHERE id = ?`, values);
}

export async function getPaymentById(id) {
  const [rows] = await pool.execute(
    `
    SELECT p.*, u.name as customer_name, u.email as customer_email, pol.policy_number, pol.type as policy_type
    FROM payments p 
    LEFT JOIN users u ON p.user_id = u.id 
    LEFT JOIN policies pol ON p.policy_id = pol.id
    WHERE p.id = ?
  `,
    [id]
  );
  return rows[0] || null;
}

export async function getPaymentsByUser(userId) {
  const [rows] = await pool.execute(
    `
    SELECT p.*, pol.policy_number, pol.type as policy_type, pol.coverage_type
    FROM payments p 
    LEFT JOIN policies pol ON p.policy_id = pol.id
    WHERE p.user_id = ? 
    ORDER BY p.created_at DESC
  `,
    [userId]
  );
  return rows;
}

export async function getAllPayments() {
  const [rows] = await pool.execute(`
    SELECT p.*, u.name as customer_name, u.email as customer_email, pol.policy_number, pol.type as policy_type
    FROM payments p 
    LEFT JOIN users u ON p.user_id = u.id 
    LEFT JOIN policies pol ON p.policy_id = pol.id
    ORDER BY p.created_at DESC
  `);
  return rows;
}

export async function getPaymentsByPolicy(policyId) {
  const [rows] = await pool.execute(
    `
    SELECT p.*, u.name as customer_name, u.email as customer_email, pol.policy_number
    FROM payments p 
    LEFT JOIN users u ON p.user_id = u.id 
    LEFT JOIN policies pol ON p.policy_id = pol.id
    WHERE p.policy_id = ? 
    ORDER BY p.created_at DESC
  `,
    [policyId]
  );
  return rows;
}

export async function getPendingPayments() {
  const [rows] = await pool.execute(`
    SELECT p.*, u.name as customer_name, u.email as customer_email, pol.policy_number, pol.type as policy_type
    FROM payments p 
    LEFT JOIN users u ON p.user_id = u.id 
    LEFT JOIN policies pol ON p.policy_id = pol.id
    WHERE p.status = 'pending'
    ORDER BY p.due_date ASC
  `);
  return rows;
}

export async function getOverduePayments() {
  const [rows] = await pool.execute(`
    SELECT p.*, u.name as customer_name, u.email as customer_email, pol.policy_number, pol.type as policy_type
    FROM payments p 
    LEFT JOIN users u ON p.user_id = u.id 
    LEFT JOIN policies pol ON p.policy_id = pol.id
    WHERE p.status = 'pending' AND p.due_date < CURDATE()
    ORDER BY p.due_date ASC
  `);
  return rows;
}

export async function getPaymentStatistics() {
  const [stats] = await pool.execute(`
    SELECT 
      COUNT(*) as total_payments,
      SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_payments,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_payments,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid_amount,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending_amount,
      AVG(CASE WHEN status = 'paid' THEN amount ELSE NULL END) as average_payment_amount
    FROM payments
  `);

  return stats[0];
}

export async function getPaymentsByMethod() {
  const [rows] = await pool.execute(`
    SELECT 
      payment_method,
      COUNT(*) as count,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_amount,
      AVG(CASE WHEN status = 'paid' THEN amount ELSE NULL END) as average_amount
    FROM payments 
    GROUP BY payment_method
    ORDER BY count DESC
  `);
  return rows;
}

export async function getPaymentsByType() {
  const [rows] = await pool.execute(`
    SELECT 
      payment_type,
      COUNT(*) as count,
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_amount,
      AVG(CASE WHEN status = 'paid' THEN amount ELSE NULL END) as average_amount
    FROM payments 
    GROUP BY payment_type
    ORDER BY count DESC
  `);
  return rows;
}

export async function getMonthlyRevenue(year = null) {
  const yearFilter = year ? `AND YEAR(paid_at) = ${year}` : '';

  const [rows] = await pool.execute(`
    SELECT 
      MONTH(paid_at) as month,
      YEAR(paid_at) as year,
      COUNT(*) as payment_count,
      SUM(amount) as total_revenue
    FROM payments 
    WHERE status = 'paid' ${yearFilter}
    GROUP BY YEAR(paid_at), MONTH(paid_at)
    ORDER BY year DESC, month DESC
  `);
  return rows;
}

export async function createRefund(paymentId, refundAmount, reason = null) {
  const payment = await getPaymentById(paymentId);
  if (!payment) throw new Error('Payment not found');

  if (payment.status !== 'paid') {
    throw new Error('Only paid payments can be refunded');
  }

  if (refundAmount > payment.amount) {
    throw new Error('Refund amount cannot exceed payment amount');
  }

  // Create refund record
  const refundId = await createPayment({
    userId: payment.user_id,
    policyId: payment.policy_id,
    amount: -refundAmount, // Negative amount for refund
    paymentType: 'refund',
    paymentMethod: payment.payment_method,
    transactionId: `REF-${payment.transaction_id}`,
    gatewayResponse: { reason, original_payment_id: paymentId },
  });

  // Update original payment status
  await updatePaymentStatus(paymentId, 'refunded', {
    refund_id: refundId,
    refund_amount: refundAmount,
  });

  return refundId;
}
