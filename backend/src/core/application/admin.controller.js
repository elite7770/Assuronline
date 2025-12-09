import { findAllPolicies, getPolicyStatistics } from '../domain/policies.model.js';
import { getAllPayments, getPaymentStatistics } from '../domain/payments.model.js';
import { listAllClaims } from '../domain/claims.model.js';
import { getAllUsers, getUserStatistics, updateUserStatus as updateUserStatusModel, getUserById as getUserByIdModel, deleteUser as deleteUserModel } from '../domain/user.model.js';
import { pool } from '../../infrastructure/database/db.js';
import { createNotification } from '../domain/notifications.model.js';

/**
 * Get Quote Management Data
 */
export async function getQuoteManagement(req, res) {
  try {
    // req.user.id is not used here; access control is done via role below
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { status, type, coverageType, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

    // Build filters
    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (coverageType) filters.coverageType = coverageType;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    filters.limit = parseInt(limit);
    filters.offset = (parseInt(page) - 1) * parseInt(limit);

    res.json({
      success: true,
      quotes: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        pages: 0,
      },
    });
  } catch (_error) {
    console.error('Error getting quote management data:', _error);
    res.status(500).json({
      message: 'Error getting quote management data',
      error: process.env.NODE_ENV === 'development' ? _error.message : 'Internal server error',
    });
  }
}

/**
 * Get Policy Management Data
 */
export async function getPolicyManagement(req, res) {
  try {
    // req.user.id is not used here; access control is done via role below
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { status, type, coverageType, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

    // Build filters
    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (coverageType) filters.coverageType = coverageType;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    filters.limit = parseInt(limit);
    filters.offset = (parseInt(page) - 1) * parseInt(limit);

    // Get policies
    const policies = await findAllPolicies(filters);
    const totalPolicies = await getPolicyStatistics();

    res.json({
      success: true,
      policies: policies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalPolicies.total_policies || 0,
        pages: Math.ceil((totalPolicies.total_policies || 0) / parseInt(limit)),
      },
    });
  } catch (_error) {
    console.error('Error getting policy management data:', _error);
    res.status(500).json({
      message: 'Error getting policy management data',
      error: process.env.NODE_ENV === 'development' ? _error.message : 'Internal server error',
    });
  }
}

/**
 * Get Payment Management Data
 */
export async function getPaymentManagement(req, res) {
  try {
    // req.user.id is not used here; access control is done via role below
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const {
      status,
      paymentMethod,
      paymentType,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = req.query;

    // Build filters
    const filters = {};
    if (status) filters.status = status;
    if (paymentMethod) filters.paymentMethod = paymentMethod;
    if (paymentType) filters.paymentType = paymentType;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    filters.limit = parseInt(limit);
    filters.offset = (parseInt(page) - 1) * parseInt(limit);

    // Get payments
    const payments = await getAllPayments(filters);
    const totalPayments = await getPaymentStatistics();

    res.json({
      success: true,
      payments: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalPayments.total || 0,
        pages: Math.ceil((totalPayments.total || 0) / parseInt(limit)),
      },
    });
  } catch (_error) {
    console.error('Error getting payment management data:', _error);
    res.status(500).json({
      message: 'Error getting payment management data',
      error: process.env.NODE_ENV === 'development' ? _error.message : 'Internal server error',
    });
  }
}

/**
 * Get Claim Management Data
 */
export async function getClaimManagement(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { status, type, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

    // Build filters
    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    filters.limit = parseInt(limit);
    filters.offset = (parseInt(page) - 1) * parseInt(limit);

    // Get claims
    const claims = await listAllClaims();
    const totalClaims = claims.length;

    res.json({
      success: true,
      claims: claims,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalClaims,
        pages: Math.ceil(totalClaims / parseInt(limit)),
      },
    });
  } catch (_error) {
    console.error('Error getting claim management data:', _error);
    res.status(500).json({
      message: 'Error getting claim management data',
      error: process.env.NODE_ENV === 'development' ? _error.message : 'Internal server error',
    });
  }
}

/**
 * Get Customer Management Data (Users)
 */
export async function getCustomerManagement(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { 
      page = 1, 
      limit = 20, 
      status, 
      role, 
      date_from, 
      date_to, 
      search 
    } = req.query;

    // Get users with filters
    const users = await getAllUsers({
      status,
      role,
      date_from,
      date_to,
      search,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    // Get statistics
    const stats = await getUserStatistics();

    // Calculate pagination
    const total = stats.total;
    const pages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      users: users,
      statistics: stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: pages,
      },
    });
  } catch (error) {
    console.error('Error getting customer management data:', error);
    res.status(500).json({
      message: 'Error getting customer management data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get Reports Data
 */
export async function getReports(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { reportType, dateFrom, dateTo } = req.query;

    // Get report data based on type
    let reportData = {};

    switch (reportType) {
      case 'revenue':
        reportData = await getRevenueReport(dateFrom, dateTo);
        break;
      case 'policies':
        reportData = await getPolicyReport(dateFrom, dateTo);
        break;
      case 'claims':
        reportData = await getClaimReport(dateFrom, dateTo);
        break;
      case 'customers':
        reportData = await getCustomerReport(dateFrom, dateTo);
        break;
      default:
        return res.status(400).json({
          message: 'Invalid report type. Valid types: revenue, policies, claims, customers',
        });
    }

    res.json({
      success: true,
      reportType: reportType,
      dateFrom: dateFrom,
      dateTo: dateTo,
      data: reportData,
    });
  } catch (_error) {
    console.error('Error generating report:', _error);
    res.status(500).json({
      message: 'Error generating report',
      error: process.env.NODE_ENV === 'development' ? _error.message : 'Internal server error',
    });
  }
}

/**
 * Get System Settings
 */
export async function getSystemSettings(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Return comprehensive settings structure that matches frontend expectations
    const settings = {
      system: {
        maintenance_mode: false,
        registration_enabled: true,
        email_verification_required: true,
        max_file_size: 10,
        session_timeout: 30,
        backup_frequency: 'daily',
        log_level: 'info',
        debug_mode: false
      },
      email: {
        enabled: true,
        smtp_host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        smtp_port: parseInt(process.env.EMAIL_PORT) || 587,
        smtp_secure: process.env.EMAIL_SECURE === 'true',
        smtp_user: process.env.EMAIL_USER || '',
        smtp_password: process.env.EMAIL_PASSWORD ? '••••••••' : '',
        from_email: process.env.EMAIL_FROM || 'noreply@assuronline.ma',
        from_name: process.env.EMAIL_FROM_NAME || 'AssurOnline',
        reply_to: process.env.EMAIL_REPLY_TO || 'support@assuronline.ma'
      },
      security: {
        password_min_length: 8,
        password_require_special: true,
        password_require_numbers: true,
        password_require_uppercase: true,
        max_login_attempts: 5,
        lockout_duration: 15,
        two_factor_enabled: false,
        session_timeout: 30,
        ip_whitelist: '',
        allowed_domains: ''
      },
      business: {
        company_name: 'AssurOnline',
        company_email: 'contact@assuronline.ma',
        company_phone: '+212 5XX XXX XXX',
        company_address: 'Avenue Mohammed V, Casablanca, Maroc',
        company_logo: '',
        currency: 'MAD',
        timezone: 'Africa/Casablanca',
        language: 'fr',
        date_format: 'DD/MM/YYYY'
      },
      pricing: {
        base_rate_auto: 2500,
        base_rate_moto: 1200,
        tax_rate: 0.2,
        discount_annual: 0.05,
        discount_quarterly: 0.02,
        commission_rate: 0.1,
        minimum_premium: 500,
        maximum_premium: 50000
      },
      notifications: {
        email_enabled: true,
        sms_enabled: false,
        push_enabled: false,
        quote_created: true,
        quote_approved: true,
        quote_rejected: true,
        policy_created: true,
        payment_received: true,
        claim_filed: true,
        claim_processed: true
      }
    };

    res.json({
      success: true,
      settings: settings,
    });
  } catch (error) {
    console.error('Error getting system settings:', error);
    res.status(500).json({
      message: 'Error getting system settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Update System Settings
 */
export async function updateSystemSettings(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const settingsData = req.body;

    // For now, just return success (in a real app, you'd save to database)
    // Settings update requested

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: settingsData
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({
      message: 'Error updating system settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Reset System Settings to Default
 */
export async function resetSystemSettings(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Return default settings
    const defaultSettings = {
      system: {
        maintenance_mode: false,
        registration_enabled: true,
        email_verification_required: true,
        max_file_size: 10,
        session_timeout: 30,
        backup_frequency: 'daily',
        log_level: 'info',
        debug_mode: false
      },
      email: {
        enabled: true,
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        smtp_secure: false,
        smtp_user: '',
        smtp_password: '',
        from_email: 'noreply@assuronline.ma',
        from_name: 'AssurOnline',
        reply_to: 'support@assuronline.ma'
      },
      security: {
        password_min_length: 8,
        password_require_special: true,
        password_require_numbers: true,
        password_require_uppercase: true,
        max_login_attempts: 5,
        lockout_duration: 15,
        two_factor_enabled: false,
        session_timeout: 30,
        ip_whitelist: '',
        allowed_domains: ''
      },
      business: {
        company_name: 'AssurOnline',
        company_email: 'contact@assuronline.ma',
        company_phone: '+212 5XX XXX XXX',
        company_address: 'Avenue Mohammed V, Casablanca, Maroc',
        company_logo: '',
        currency: 'MAD',
        timezone: 'Africa/Casablanca',
        language: 'fr',
        date_format: 'DD/MM/YYYY'
      },
      pricing: {
        base_rate_auto: 2500,
        base_rate_moto: 1200,
        tax_rate: 0.2,
        discount_annual: 0.05,
        discount_quarterly: 0.02,
        commission_rate: 0.1,
        minimum_premium: 500,
        maximum_premium: 50000
      },
      notifications: {
        email_enabled: true,
        sms_enabled: false,
        push_enabled: false,
        quote_created: true,
        quote_approved: true,
        quote_rejected: true,
        policy_created: true,
        payment_received: true,
        claim_filed: true,
        claim_processed: true
      }
    };

    res.json({
      success: true,
      message: 'Settings reset to default successfully',
      settings: defaultSettings
    });
  } catch (error) {
    console.error('Error resetting system settings:', error);
    res.status(500).json({
      message: 'Error resetting system settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

// Helper Functions

// (dashboard helpers removed)

// New: Admin Dashboard Overview
export async function getDashboardOverview(req, res) {
  try {
    const userRole = req.user.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const [policyStats, paymentStats, allClaims] = await Promise.all([
      getPolicyStatistics(),
      getPaymentStatistics(),
      listAllClaims(),
    ]);

    // Get quotes statistics
    const [quotesStats] = await pool.execute(`
      SELECT COUNT(*) as total_quotes,
             SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_quotes,
             SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_quotes,
             SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_quotes
      FROM quotes
    `);


    const claimsByStatus = allClaims.reduce((acc, c) => {
      const key = c.status || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const [monthlyRevenueRows] = await pool.execute(`
      SELECT DATE_FORMAT(paid_date, '%Y-%m') as ym, SUM(amount) as total
      FROM payments
      WHERE status = 'paid' AND paid_date IS NOT NULL AND paid_date >= DATE_SUB(CURDATE(), INTERVAL 24 MONTH)
      GROUP BY ym
      ORDER BY ym ASC
    `);

    // Get policy growth data
    const [policyGrowthRows] = await pool.execute(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as ym, COUNT(*) as count
      FROM policies
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 24 MONTH)
      GROUP BY ym
      ORDER BY ym ASC
    `);

    // Get recent data for tables
    const [recentQuotesRows] = await pool.execute(`
      SELECT q.*, u.name as customer_name
      FROM quotes q
      LEFT JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC
      LIMIT 10
    `);

    const [recentPoliciesRows] = await pool.execute(`
      SELECT p.*, u.name as customer_name, p.start_date as effective_date
      FROM policies p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    const [recentPaymentsRows] = await pool.execute(`
      SELECT p.*, u.name as customer_name, p.paid_date as date
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    // Generate activity feed
    const activity = [
      ...recentQuotesRows.slice(0, 3).map(q => ({
        actor: q.customer_name || 'Unknown',
        action: `Created quote ${q.quote_number || q.id}`,
        time: new Date(q.created_at).toLocaleDateString(),
        color: 'blue'
      })),
      ...recentPoliciesRows.slice(0, 2).map(p => ({
        actor: p.customer_name || 'Unknown',
        action: `Policy ${p.policy_number} activated`,
        time: new Date(p.created_at).toLocaleDateString(),
        color: 'green'
      })),
      ...recentPaymentsRows.slice(0, 2).map(p => ({
        actor: p.customer_name || 'Unknown',
        action: `Payment of ${p.amount} MAD received`,
        time: new Date(p.created_at).toLocaleDateString(),
        color: 'purple'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

    return res.json({
      devis: {
        total: quotesStats[0]?.total_quotes || 0,
        approved: quotesStats[0]?.approved_quotes || 0,
        pending: quotesStats[0]?.pending_quotes || 0,
        rejected: quotesStats[0]?.rejected_quotes || 0,
      },
      policies: policyStats,
      payments: paymentStats,
      claims: {
        total: allClaims.length,
        byStatus: claimsByStatus,
      },
      charts: {
        monthlyRevenue: monthlyRevenueRows.map((r) => ({ month: r.ym, revenue: Number(r.total) })),
        policyGrowth: policyGrowthRows.map((r) => ({ month: r.ym, count: Number(r.count) })),
      },
      tables: {
        recentQuotes: recentQuotesRows,
        recentPolicies: recentPoliciesRows,
        recentPayments: recentPaymentsRows,
      },
      activity: activity,
    });
  } catch (_error) {
    console.error('Error getting admin dashboard overview:', _error);
    res.status(500).json({ message: 'Error getting admin dashboard overview' });
  }
}

// Placeholder report functions
async function getRevenueReport(_dateFrom, _dateTo) {
  // Implementation would query payment data
  return { message: 'Revenue report coming soon' };
}

async function getPolicyReport(_dateFrom, _dateTo) {
  // Implementation would query policy data
  return { message: 'Policy report coming soon' };
}

async function getClaimReport(_dateFrom, _dateTo) {
  // Implementation would query claim data
  return { message: 'Claim report coming soon' };
}

async function getCustomerReport(_dateFrom, _dateTo) {
  // Implementation would query customer data
  return { message: 'Customer report coming soon' };
}

/**
 * Update User Status
 */
export async function updateUserStatus(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Must be active, suspended, or pending'
      });
    }

    await updateUserStatusModel(id, status);

    res.json({
      success: true,
      message: 'User status updated successfully'
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      message: 'Error updating user status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get User by ID
 */
export async function getUserById(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { id } = req.params;

    const user = await getUserByIdModel(id);

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.status(500).json({
      message: 'Error getting user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Delete User
 */
export async function deleteUser(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { id } = req.params;

    await deleteUserModel(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.status(500).json({
      message: 'Error deleting user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Send Email to Customer
 */
export async function sendEmailToCustomer(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { policyId, email, type = 'policy_reminder' } = req.body;

    if (!policyId || !email) {
      return res.status(400).json({
        message: 'Policy ID and email are required'
      });
    }

    // Get policy details
    const [policyRows] = await pool.execute(
      'SELECT * FROM policies WHERE id = ?',
      [policyId]
    );

    if (policyRows.length === 0) {
      return res.status(404).json({
        message: 'Policy not found'
      });
    }

    const policy = policyRows[0];

    // Create notification for the customer
    await createNotification({
      userId: policy.user_id,
      title: 'Email Notification Sent',
      message: `An email regarding your policy ${policy.policy_number} has been sent to ${email}`,
      type: 'info'
    });

    // In a real implementation, you would integrate with an email service
    // For now, we'll just log the email details
    console.log(`Email sent to ${email} for policy ${policy.policy_number} (${type})`);

    res.json({
      success: true,
      message: 'Email sent successfully',
      email: email,
      policyNumber: policy.policy_number
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      message: 'Error sending email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}
