import {
  insertPolicy,
  findPolicyById,
  findPolicyByNumber,
  findPoliciesByUser,
  findAllPolicies,
  findActivePolicies,
  findPoliciesExpiringSoon,
  updatePolicy,
  cancelPolicy,
  renewPolicy,
  getPolicyStatistics,
  getPoliciesByType,
} from '../../core/domain/policies.model.js';
import { findQuoteById } from '../../core/domain/quotes.model.js';
import { createNotification } from '../../core/domain/notifications.model.js';
import { generatePolicyNumber } from '../../shared/utils/id.js';

export async function createPolicy(req, res) {
  try {
    const { quoteId, paymentFrequency = 'annually' } = req.body;

    if (!quoteId) {
      return res.status(400).json({ message: 'Quote ID is required' });
    }

    // Get quote details
    const quote = await findQuoteById(quoteId);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    if (quote.status !== 'approved') {
      return res.status(400).json({ message: 'Quote must be approved before creating policy' });
    }

    // Generate policy number
    const policyNumber = generatePolicyNumber();

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Calculate next payment date based on frequency
    let nextPaymentDate = new Date(startDate);
    switch (paymentFrequency) {
      case 'monthly':
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
        break;
      case 'annually':
        nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
        break;
    }

    // Create policy
    const policyId = await insertPolicy({
      userId: quote.user_id,
      vehicleId: quote.vehicle_id,
      quoteId: quote.id,
      policyNumber,
      type: quote.type,
      coverageType: quote.coverage_type,
      coverageDetails: JSON.parse(quote.coverage_options),
      premiumAmount: quote.final_premium,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'active',
      paymentFrequency,
      nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
      autoRenewal: true,
    });

    const policy = await findPolicyById(policyId);

    // Send notification to customer
    await createNotification({
      userId: quote.user_id,
      title: "Police d'assurance créée",
      message: `Votre police ${policyNumber} a été créée et est maintenant active.`,
      type: 'success',
    });

    return res.status(201).json({
      message: 'Policy created successfully',
      policy,
    });
  } catch (_e) {
    console.error('Error creating policy:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function listPolicies(req, res) {
  try {
    const isAdmin = req.user.role === 'admin';
    const policies = isAdmin ? await findAllPolicies() : await findPoliciesByUser(req.user.id);

    return res.json(policies);
  } catch (_e) {
    console.error('Error listing policies:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getPolicy(req, res) {
  try {
    const { id } = req.params;
    const policy = await findPolicyById(id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Check if user has access to this policy
    if (req.user.role !== 'admin' && policy.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(policy);
  } catch (_e) {
    console.error('Error getting policy:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getPolicyByNumber(req, res) {
  try {
    const { policyNumber } = req.params;
    const policy = await findPolicyByNumber(policyNumber);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Check if user has access to this policy
    if (req.user.role !== 'admin' && policy.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(policy);
  } catch (_e) {
    console.error('Error getting policy by number:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function updatePolicyDetails(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const policy = await findPolicyById(id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Check if user has access to this policy
    if (req.user.role !== 'admin' && policy.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow certain fields to be updated
    const allowedFields = ['payment_frequency', 'auto_renewal', 'next_payment_date'];
    const filteredData = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    await updatePolicy(id, filteredData);
    const updatedPolicy = await findPolicyById(id);

    return res.json({
      message: 'Policy updated successfully',
      policy: updatedPolicy,
    });
  } catch (_e) {
    console.error('Error updating policy:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function cancelPolicyRequest(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const policy = await findPolicyById(id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Check if user has access to this policy
    if (req.user.role !== 'admin' && policy.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (policy.status !== 'active') {
      return res.status(400).json({ message: 'Only active policies can be cancelled' });
    }

    await cancelPolicy(id, reason);

    // Send notification
    await createNotification({
      userId: policy.user_id,
      title: 'Police annulée',
      message: `Votre police ${policy.policy_number} a été annulée.`,
      type: 'warning',
    });

    return res.json({ message: 'Policy cancelled successfully' });
  } catch (_e) {
    console.error('Error cancelling policy:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function renewPolicyRequest(req, res) {
  try {
    const { id } = req.params;
    const { newPremiumAmount } = req.body;

    const policy = await findPolicyById(id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Check if user has access to this policy
    if (req.user.role !== 'admin' && policy.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (policy.status !== 'active') {
      return res.status(400).json({ message: 'Only active policies can be renewed' });
    }

    // Calculate new dates
    const currentEndDate = new Date(policy.end_date);
    const newStartDate = new Date(currentEndDate);
    newStartDate.setDate(newStartDate.getDate() + 1);

    const newEndDate = new Date(newStartDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);

    const newPolicyId = await renewPolicy(id, newStartDate, newEndDate, newPremiumAmount);
    const newPolicy = await findPolicyById(newPolicyId);

    // Send notification
    await createNotification({
      userId: policy.user_id,
      title: 'Police renouvelée',
      message: `Votre police a été renouvelée. Nouveau numéro: ${newPolicy.policy_number}`,
      type: 'success',
    });

    return res.json({
      message: 'Policy renewed successfully',
      newPolicy,
    });
  } catch (_e) {
    console.error('Error renewing policy:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getActivePolicies(req, res) {
  try {
    const policies = await findActivePolicies();
    return res.json(policies);
  } catch (_e) {
    console.error('Error getting active policies:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getExpiringPolicies(req, res) {
  try {
    const { days = 30 } = req.query;
    const policies = await findPoliciesExpiringSoon(parseInt(days));
    return res.json(policies);
  } catch (_e) {
    console.error('Error getting expiring policies:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getPolicyStats(req, res) {
  try {
    const stats = await getPolicyStatistics();
    const policiesByType = await getPoliciesByType();

    return res.json({
      statistics: stats,
      policiesByType,
    });
  } catch (_e) {
    console.error('Error getting policy statistics:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getPolicyDocuments(req, res) {
  try {
    const { id } = req.params;
    const policy = await findPolicyById(id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Check if user has access to this policy
    if (req.user.role !== 'admin' && policy.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // TODO: Implement document generation
    const documents = {
      policy_certificate: `/documents/policy-${policy.policy_number}.pdf`,
      terms_conditions: `/documents/terms-${policy.policy_number}.pdf`,
      invoice: `/documents/invoice-${policy.policy_number}.pdf`,
    };

    return res.json(documents);
  } catch (_e) {
    console.error('Error getting policy documents:', _e);
    return res.status(500).json({ message: 'Server error' });
  }
}
