import {
  createPayment,
  confirmPayment,
  updatePaymentStatus,
  getPaymentById,
  getPaymentsByUser,
  getAllPayments as getAllPaymentsModel,
  getPaymentStatistics as getPaymentStatisticsModel,
  getPendingPayments as getPendingPaymentsModel,
  getOverduePayments as getOverduePaymentsModel,
  getMonthlyRevenue as getMonthlyRevenueModel,
} from '../../core/domain/payments.model.js';
import { createInvoice, getInvoiceByPayment } from '../../core/domain/invoices.model.js';
import { createNotification } from '../../core/domain/notifications.model.js';

function genInvoiceNumber() {
  const ts = Date.now().toString().slice(-8);
  return `INV-${ts}`;
}

export async function createPaymentIntent(req, res) {
  try {
    const userId = req.user.id;
    const { policy_id, amount, method } = req.body;
    if (!policy_id || !amount) return res.status(400).json({ message: 'Missing fields' });
    const id = await createPayment({
      userId,
      policyId: policy_id,
      amount,
      method: method || 'card',
    });
    const p = await getPaymentById(id);
    return res.status(201).json(p);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function confirmPaymentAndInvoice(req, res) {
  try {
    const { id } = req.params;
    const { transaction_ref } = req.body;
    await confirmPayment(id, transaction_ref || null);
    const p = await getPaymentById(id);
    const existing = await getInvoiceByPayment(id);
    if (!existing) {
      const invNum = genInvoiceNumber();
      await createInvoice({ paymentId: id, invoiceNumber: invNum });
    }
    await createNotification({
      userId: p.user_id,
      title: 'Paiement confirmé',
      message: `Paiement #${id} confirmé.`,
      type: 'success',
    });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function adminUpdatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['failed', 'refunded'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });
    await updatePaymentStatus(id, status);
    const p = await getPaymentById(id);
    return res.json(p);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getInvoice(req, res) {
  try {
    const { id } = req.params; // payment id
    const inv = await getInvoiceByPayment(id);
    if (!inv) return res.status(404).json({ message: 'Invoice not found' });
    return res.json(inv);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getPayments(req, res) {
  try {
    const userId = req.user.id;
    const payments = await getPaymentsByUser(userId);
    return res.json(payments);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getAllPayments(req, res) {
  try {
    const payments = await getAllPaymentsModel();
    return res.json(payments);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getPaymentStatistics(req, res) {
  try {
    const stats = await getPaymentStatisticsModel();
    return res.json(stats);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getPendingPayments(_req, res) {
  try {
    const payments = await getPendingPaymentsModel();
    return res.json(payments);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getOverduePayments(_req, res) {
  try {
    const payments = await getOverduePaymentsModel();
    return res.json(payments);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getMonthlyRevenue(_req, res) {
  try {
    const revenue = await getMonthlyRevenueModel();
    return res.json(revenue);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}
