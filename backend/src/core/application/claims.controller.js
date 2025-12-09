import {
  insertClaim,
  updateClaimIfPending,
  listClaimsByUser,
  listAllClaims,
  setClaimStatus,
  findClaimById,
} from '../../core/domain/claims.model.js';
import { createNotification } from '../../core/domain/notifications.model.js';

export async function createClaim(req, res) {
  try {
    const userId = req.user.id;
    const type = req.body.type;
    const policyId = req.body.policy_id ?? req.body.policyId;
    const incidentDate = req.body.incident_date ?? req.body.incidentDate;
    const description = req.body.description;
    const amountEstimate = req.body.amount_estimate ?? req.body.amountEstimate;
    const incidentLocation = req.body.incident_location ?? req.body.incidentLocation;
    
    if (!policyId || !type || !incidentDate)
      return res.status(400).json({ message: 'Missing required fields: policy_id, type, incident_date' });
    
    const id = await insertClaim({
      userId,
      policyId,
      type,
      incidentDate,
      description,
      amountEstimate,
      incidentLocation,
    });
    const claim = await findClaimById(id);
    return res.status(201).json(claim);
  } catch (error) {
    console.error('Error creating claim:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function editClaim(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const updated = await updateClaimIfPending(id, userId, {
      type: req.body.type,
      incidentDate: req.body.incident_date ?? req.body.incidentDate,
      description: req.body.description,
      amountEstimate: req.body.amount_estimate ?? req.body.amountEstimate,
    });
    if (updated === null) return res.status(404).json({ message: 'Claim not found' });
    if (updated === false)
      return res.status(400).json({ message: 'Cannot edit non-pending claim' });
    return res.json(updated);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function listClaims(req, res) {
  try {
    const claims =
      req.user.role === 'admin' ? await listAllClaims() : await listClaimsByUser(req.user.id);
    return res.json(claims);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function setStatusAndNotify(id, status, userId, message) {
  const claim = await setClaimStatus(id, status, null, undefined);
  if (claim) {
    try {
      await createNotification({
        userId: userId || claim.user_id,
        title: 'Mise à jour sinistre',
        message,
        type: 'info',
      });
    } catch (notificationError) {
      console.warn('Failed to create notification:', notificationError.message);
      // Continue without failing the claim update
    }
  }
  return claim;
}

export async function reviewClaim(req, res) {
  try {
    const { id } = req.params;
    const claim = await setStatusAndNotify(id, 'in_review');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    return res.json(claim);
  } catch (error) {
    console.error('Error reviewing claim:', error);
    return res.status(500).json({ message: 'Server error', details: error.message });
  }
}

export async function approveClaim(req, res) {
  try {
    const { id } = req.params;
    const claim = await setStatusAndNotify(id, 'approved');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    return res.json(claim);
  } catch (error) {
    console.error('Error approving claim:', error);
    return res.status(500).json({ message: 'Server error', details: error.message });
  }
}

export async function rejectClaim(req, res) {
  try {
    const { id } = req.params;
    const claim = await setStatusAndNotify(id, 'rejected');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    return res.json(claim);
  } catch (error) {
    console.error('Error rejecting claim:', error);
    return res.status(500).json({ message: 'Server error', details: error.message });
  }
}

export async function settleClaim(req, res) {
  try {
    const { id } = req.params;
    const amount = req.body.amount;
    const claim = await setClaimStatus(id, 'settled', null, amount);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    
    try {
      await createNotification({
        userId: claim.user_id,
        title: 'Sinistre réglé',
        message: `Montant: ${amount}`,
        type: 'success',
      });
    } catch (notificationError) {
      console.warn('Failed to create settlement notification:', notificationError.message);
    }
    
    return res.json(claim);
  } catch (error) {
    console.error('Error settling claim:', error);
    return res.status(500).json({ message: 'Server error', details: error.message });
  }
}
