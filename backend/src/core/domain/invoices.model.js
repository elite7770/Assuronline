import { pool } from '../../infrastructure/database/db.js';

export async function createInvoice({ paymentId, invoiceNumber, fileUrl = null }) {
  const [result] = await pool.execute(
    `INSERT INTO invoices (payment_id, invoice_number, file_url) VALUES (?, ?, ?)`,
    [paymentId, invoiceNumber, fileUrl]
  );
  return result.insertId;
}

export async function getInvoiceByPayment(paymentId) {
  const [rows] = await pool.execute('SELECT * FROM invoices WHERE payment_id = ?', [paymentId]);
  return rows[0] || null;
}
