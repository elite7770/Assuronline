import { findPoliciesByUser } from '../../core/domain/policies.model.js';
import { getPaymentsByUser } from '../../core/domain/payments.model.js';
import { listClaimsByUser } from '../../core/domain/claims.model.js';
import { listUserQuotes } from '../../core/domain/quotes.model.js';
import { pool } from '../../infrastructure/database/db.js';

export async function getClientDashboard(req, res) {
  try {
    const userId = req.user.id;

    const [policies, payments, claims, quotes] = await Promise.all([
      findPoliciesByUser(userId),
      getPaymentsByUser(userId),
      listClaimsByUser(userId),
      listUserQuotes(userId),
    ]);

    const activePolicies = policies.filter((p) => p.status === 'active').length;
    const pendingQuotes = quotes.filter((q) => q.status === 'pending').length;
    const approvedQuotes = quotes.filter((q) => q.status === 'approved').length;
    const rejectedQuotes = quotes.filter((q) => q.status === 'rejected').length;
    const totalPaid = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const activeClaims = claims.filter(
      (c) => c.status !== 'closed' && c.status !== 'rejected'
    ).length;

    // Payment history chart (last 6 months)
    const paymentsByMonth = {};
    for (const p of payments) {
      if (p.status !== 'paid' || !p.paid_date) continue;
      const ym = new Date(p.paid_date).toISOString().slice(0, 7);
      paymentsByMonth[ym] = (paymentsByMonth[ym] || 0) + Number(p.amount || 0);
    }
    const months = Object.keys(paymentsByMonth).sort();
    const paymentHistory = months.map((m) => ({ month: m, amount: paymentsByMonth[m] }));

    // Calculate Financial Health Score
    const financialHealth = calculateFinancialHealth(policies, payments, claims, quotes);

    // Generate Activity Feed
    const activity = generateActivityFeed(quotes, policies, payments, claims);

    // Generate Policy Documents
    const documents = generatePolicyDocuments(policies);

    res.json({
      kpis: { 
        activePolicies, 
        pendingDevis: pendingQuotes,
        approvedDevis: approvedQuotes,
        rejectedDevis: rejectedQuotes,
        totalPaid, 
        activeClaims 
      },
      charts: { paymentHistory },
      analytics: {
        financialHealth
      },
      lists: {
        recentPayments: payments.slice(0, 5),
        recentPolicies: policies.slice(0, 5),
        recentClaims: claims.slice(0, 5),
        recentQuotes: quotes.slice(0, 5),
        documents
      },
      activity
    });
  } catch (error) {
    console.error('Error getting client dashboard:', error);
    res.status(500).json({ message: 'Error getting client dashboard' });
  }
}

// Helper function to calculate financial health score
function calculateFinancialHealth(policies, payments, claims, quotes) {
  let score = 0;
  let factors = [];

  // Payment history factor (40% weight)
  const paidPayments = payments.filter(p => p.status === 'paid');
  const totalPaid = paidPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const paymentScore = Math.min(100, (totalPaid / 10000) * 100); // Scale based on 10k MAD
  score += paymentScore * 0.4;
  factors.push(`Payment History: ${paymentScore.toFixed(0)}/100`);

  // Policy coverage factor (30% weight)
  const activePolicies = policies.filter(p => p.status === 'active').length;
  const policyScore = Math.min(100, activePolicies * 25); // 25 points per active policy
  score += policyScore * 0.3;
  factors.push(`Policy Coverage: ${policyScore.toFixed(0)}/100`);

  // Claims history factor (20% weight)
  const approvedClaims = claims.filter(c => c.status === 'approved').length;
  const rejectedClaims = claims.filter(c => c.status === 'rejected').length;
  const claimsScore = rejectedClaims === 0 ? 100 : Math.max(0, 100 - (rejectedClaims * 20));
  score += claimsScore * 0.2;
  factors.push(`Claims History: ${claimsScore.toFixed(0)}/100`);

  // Quote approval rate factor (10% weight)
  const totalQuotes = quotes.length;
  const approvedQuotes = quotes.filter(q => q.status === 'approved').length;
  const approvalRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 100;
  score += approvalRate * 0.1;
  factors.push(`Quote Approval: ${approvalRate.toFixed(0)}%`);

  const finalScore = Math.round(score);
  let level, description;

  if (finalScore >= 90) {
    level = 'Excellent';
    description = 'Outstanding financial health with excellent payment history and coverage';
  } else if (finalScore >= 75) {
    level = 'Good';
    description = 'Good financial health with reliable payment patterns';
  } else if (finalScore >= 60) {
    level = 'Fair';
    description = 'Fair financial health with room for improvement';
  } else if (finalScore >= 40) {
    level = 'Poor';
    description = 'Poor financial health requiring attention';
  } else {
    level = 'Critical';
    description = 'Critical financial health requiring immediate action';
  }

  return {
    score: finalScore,
    level,
    description,
    factors
  };
}

// Helper function to generate activity feed
function generateActivityFeed(quotes, policies, payments, claims) {
  const activities = [];

  // Recent quotes
  quotes.slice(0, 3).forEach(quote => {
    activities.push({
      actor: 'You',
      action: `Created quote ${quote.quote_number}`,
      time: new Date(quote.created_at).toLocaleDateString(),
      color: 'blue'
    });
  });

  // Recent policies
  policies.slice(0, 2).forEach(policy => {
    activities.push({
      actor: 'System',
      action: `Policy ${policy.policy_number} activated`,
      time: new Date(policy.start_date).toLocaleDateString(),
      color: 'green'
    });
  });

  // Recent payments
  payments.slice(0, 2).forEach(payment => {
    activities.push({
      actor: 'You',
      action: `Payment of ${payment.amount} MAD received`,
      time: new Date(payment.paid_date || payment.created_at).toLocaleDateString(),
      color: 'purple'
    });
  });

  // Recent claims
  claims.slice(0, 2).forEach(claim => {
    activities.push({
      actor: 'You',
      action: `Filed claim ${claim.claim_number}`,
      time: new Date(claim.created_at).toLocaleDateString(),
      color: 'orange'
    });
  });

  return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);
}

// Helper function to generate policy documents
function generatePolicyDocuments(policies) {
  return policies.map(policy => ({
    id: policy.id,
    name: `Policy Document - ${policy.policy_number}`,
    filename: `policy_${policy.policy_number}.pdf`,
    type: 'Policy Document',
    status: policy.status,
    created_at: policy.created_at,
    date: policy.start_date
  }));
}
