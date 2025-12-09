import { emailService } from '../../infrastructure/external/email.service.js';
import { findQuoteById } from '../../core/domain/quotes.model.js';

/**
 * Send Quote Created Email (Direct function for internal use)
 */
export async function sendQuoteCreatedEmailDirect(quoteData) {
  try {
    const result = await emailService.sendQuoteCreatedEmail(quoteData);
    return { success: true, result };
  } catch (error) {
    console.error('Error sending quote created email:', error);
    return { success: false, error: error.message };
  }
}
import { findPolicyById } from '../../core/domain/policies.model.js';
import { getPaymentById } from '../../core/domain/payments.model.js';
import { createNotification } from '../../core/domain/notifications.model.js';

/**
 * Send Quote Created Email
 */
export async function sendQuoteCreatedEmail(req, res) {
  try {
    const { quoteId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find quote
    const quote = await findQuoteById(quoteId);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    // Check access permissions
    if (userRole !== 'admin' && quote.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Prepare quote data for email
    const quoteData = {
      customerName: quote.customer_name,
      customerEmail: quote.customer_email,
      quoteNumber: quote.quote_number,
      type: quote.type,
      coverageType: quote.coverage_type,
      finalPremium: quote.final_premium,
      validUntil: quote.valid_until,
    };

    // Send email
    const result = await emailService.sendQuoteCreatedEmail(quoteData);

    // Create notification
    await createNotification({
      userId: quote.user_id,
      type: 'email_sent',
      title: 'Email de devis envoyé',
      message: `Email de confirmation du devis ${quote.quote_number} envoyé avec succès`,
      relatedTable: 'quotes',
      relatedId: quote.id,
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Quote created email sent successfully',
        emailResult: result,
      });
    } else {
      res.json({
        success: false,
        message: 'Email service not configured. Email not sent.',
        emailResult: result,
      });
    }
  } catch (error) {
    console.error('Error sending quote created email:', error);
    res.status(500).json({
      message: 'Error sending email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Send Quote Approved Email
 */
export async function sendQuoteApprovedEmail(req, res) {
  try {
    const { quoteId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find quote
    const quote = await findQuoteById(quoteId);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    // Check access permissions
    if (userRole !== 'admin' && quote.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Prepare quote data for email
    const quoteData = {
      customerName: quote.customer_name,
      customerEmail: quote.customer_email,
      quoteNumber: quote.quote_number,
      type: quote.type,
      coverageType: quote.coverage_type,
      finalPremium: quote.final_premium,
    };

    // Send email
    const result = await emailService.sendQuoteApprovedEmail(quoteData);

    // Create notification
    await createNotification({
      userId: quote.user_id,
      type: 'email_sent',
      title: "Email d'approbation envoyé",
      message: `Email d'approbation du devis ${quote.quote_number} envoyé avec succès`,
      relatedTable: 'quotes',
      relatedId: quote.id,
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Quote approved email sent successfully',
        emailResult: result,
      });
    } else {
      res.json({
        success: false,
        message: 'Email service not configured. Email not sent.',
        emailResult: result,
      });
    }
  } catch (error) {
    console.error('Error sending quote approved email:', error);
    res.status(500).json({
      message: 'Error sending email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Send Policy Created Email
 */
export async function sendPolicyCreatedEmail(req, res) {
  try {
    const { policyId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find policy
    const policy = await findPolicyById(policyId);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Check access permissions
    if (userRole !== 'admin' && policy.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Prepare policy data for email
    const policyData = {
      customerName: policy.customer_name,
      customerEmail: policy.customer_email,
      policyNumber: policy.policy_number,
      type: policy.type,
      coverageType: policy.coverage_type,
      premiumAmount: policy.premium,
      startDate: policy.start_date,
      endDate: policy.end_date,
    };

    // Send email
    const result = await emailService.sendPolicyCreatedEmail(policyData);

    // Create notification
    await createNotification({
      userId: policy.user_id,
      type: 'email_sent',
      title: 'Email de police envoyé',
      message: `Email de confirmation de la police ${policy.policy_number} envoyé avec succès`,
      relatedTable: 'policies',
      relatedId: policy.id,
    });

    res.json({
      success: true,
      message: 'Policy created email sent successfully',
      emailResult: result,
    });
  } catch (error) {
    console.error('Error sending policy created email:', error);
    res.status(500).json({
      message: 'Error sending email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Send Payment Reminder Email
 */
export async function sendPaymentReminderEmail(req, res) {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find payment
    const payment = await getPaymentById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check access permissions
    if (userRole !== 'admin' && payment.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Prepare payment data for email
    const paymentData = {
      customerName: payment.customer_name,
      customerEmail: payment.customer_email,
      policyNumber: payment.policy_number,
      amount: payment.amount,
      dueDate: payment.due_date,
      paymentMethod: payment.payment_method,
    };

    // Send email
    const result = await emailService.sendPaymentReminderEmail(paymentData);

    // Create notification
    await createNotification({
      userId: payment.user_id,
      type: 'email_sent',
      title: 'Rappel de paiement envoyé',
      message: `Rappel de paiement pour la police ${payment.policy_number} envoyé avec succès`,
      relatedTable: 'payments',
      relatedId: payment.id,
    });

    res.json({
      success: true,
      message: 'Payment reminder email sent successfully',
      emailResult: result,
    });
  } catch (error) {
    console.error('Error sending payment reminder email:', error);
    res.status(500).json({
      message: 'Error sending email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Send Custom Email
 */
export async function sendCustomEmail(req, res) {
  try {
    const { to, subject, html, text, attachments } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Only admins can send custom emails
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        message: 'Missing required fields: to, subject, and (html or text)',
      });
    }

    // Send email
    const result = await emailService.sendCustomEmail({
      to,
      subject,
      html,
      text,
      attachments: attachments || [],
    });

    // Create notification for admin
    await createNotification({
      userId: userId,
      type: 'email_sent',
      title: 'Email personnalisé envoyé',
      message: `Email personnalisé envoyé à ${Array.isArray(to) ? to.join(', ') : to}`,
      relatedTable: 'custom',
      relatedId: null,
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Custom email sent successfully',
        emailResult: result,
      });
    } else {
      res.json({
        success: false,
        message: 'Email service not configured. Email not sent.',
        emailResult: result,
      });
    }
  } catch (error) {
    console.error('Error sending custom email:', error);
    res.status(500).json({
      message: 'Error sending email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Send Bulk Emails
 */
export async function sendBulkEmails(req, res) {
  try {
    const { emails } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Only admins can send bulk emails
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Validate emails array
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        message: 'Emails array is required and must not be empty',
      });
    }

    // Validate each email
    for (const email of emails) {
      if (!email.to || !email.subject || (!email.html && !email.text)) {
        return res.status(400).json({
          message: 'Each email must have: to, subject, and (html or text)',
        });
      }
    }

    // Send bulk emails
    const results = await emailService.sendBulkEmails(emails);

    // Create notification for admin
    await createNotification({
      userId: userId,
      type: 'email_sent',
      title: 'Emails en masse envoyés',
      message: `${emails.length} emails en masse envoyés`,
      relatedTable: 'bulk',
      relatedId: null,
    });

    res.json({
      success: true,
      message: 'Bulk emails sent successfully',
      results: results,
    });
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    res.status(500).json({
      message: 'Error sending bulk emails',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Verify Email Configuration
 */
export async function verifyEmailConfiguration(req, res) {
  try {
    const isVerified = await emailService.verifyEmailConfiguration();

    res.json({
      success: isVerified,
      message: isVerified ? 'Email configuration is valid' : 'Email configuration is invalid',
      verified: isVerified,
    });
  } catch (error) {
    console.error('Error verifying email configuration:', error);
    res.status(500).json({
      message: 'Error verifying email configuration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get Email Templates
 */
export async function getEmailTemplates(req, res) {
  try {
    const templates = [
      {
        id: 'quote-created',
        name: 'Devis créé',
        description: "Email envoyé lors de la création d'un devis",
        subject: 'Nouveau devis créé - {{quoteNumber}}',
      },
      {
        id: 'quote-approved',
        name: 'Devis approuvé',
        description: "Email envoyé lors de l'approbation d'un devis",
        subject: 'Devis approuvé - {{quoteNumber}}',
      },
      {
        id: 'policy-created',
        name: 'Police créée',
        description: "Email envoyé lors de la création d'une police",
        subject: "Police d'assurance créée - {{policyNumber}}",
      },
      {
        id: 'payment-reminder',
        name: 'Rappel de paiement',
        description: 'Email de rappel de paiement',
        subject: 'Rappel de paiement - Police {{policyNumber}}',
      },
    ];

    res.json({
      success: true,
      templates: templates,
    });
  } catch (error) {
    console.error('Error getting email templates:', error);
    res.status(500).json({
      message: 'Error getting email templates',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}
