import nodemailer from 'nodemailer';
import { pool } from '../../infrastructure/database/db.js';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'assuronline.demo@gmail.com',
      pass: process.env.SMTP_PASS || 'demo-password-123'
    }
  });
};

// Send quote email (existing function)
export const sendQuoteEmail = async (req, res) => {
  try {
    const { quoteId } = req.params;
    const { emailType = 'status_update' } = req.body;

    console.log('Sending email for quote:', quoteId, 'Type:', emailType);

    // Get quote details with customer and vehicle info
    const [quotes] = await pool.execute(`
      SELECT 
        q.*,
        u.name as customer_name, 
        u.email as customer_email,
        v.brand as vehicle_brand, 
        v.model as vehicle_model
      FROM quotes q
      LEFT JOIN users u ON q.user_id = u.id
      LEFT JOIN vehicles v ON q.vehicle_id = v.id
      WHERE q.id = ?
    `, [quoteId]);

    if (quotes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    const quote = quotes[0];

    // Create email content based on quote status
    let emailSubject = '';
    let emailBody = '';
    let htmlBody = '';

    switch (emailType) {
      case 'created':
        emailSubject = `Nouveau devis créé - ${quote.quote_number}`;
        emailBody = `Bonjour ${quote.customer_name},\n\nVotre devis ${quote.quote_number} a été créé avec succès.\n\nDétails du véhicule: ${quote.vehicle_brand} ${quote.vehicle_model}\nPrime: ${quote.final_premium} MAD\n\nCordialement,\nL'équipe AssurOnline`;
        break;
      case 'approved':
        emailSubject = `Devis approuvé - ${quote.quote_number}`;
        emailBody = `Bonjour ${quote.customer_name},\n\nVotre devis ${quote.quote_number} a été approuvé.\n\nVous pouvez maintenant souscrire votre police d'assurance.\n\nCordialement,\nL'équipe AssurOnline`;
        break;
      case 'rejected':
        emailSubject = `Devis rejeté - ${quote.quote_number}`;
        emailBody = `Bonjour ${quote.customer_name},\n\nVotre devis ${quote.quote_number} a été rejeté.\n\nVeuillez nous contacter pour plus d'informations.\n\nCordialement,\nL'équipe AssurOnline`;
        break;
      default:
        emailSubject = `Mise à jour devis - ${quote.quote_number}`;
        emailBody = `Bonjour ${quote.customer_name},\n\nVotre devis ${quote.quote_number} a été mis à jour.\n\nStatut: ${quote.status}\n\nCordialement,\nL'équipe AssurOnline`;
    }

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'assuronline.demo@gmail.com',
      to: quote.customer_email,
      subject: emailSubject,
      text: emailBody,
      html: htmlBody || emailBody.replace(/\n/g, '<br>')
    });

    res.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
};

// Send quote created email
export const sendQuoteCreatedEmail = async (req, res) => {
  req.body.emailType = 'created';
  return sendQuoteEmail(req, res);
};

// Send quote approved email
export const sendQuoteApprovedEmail = async (req, res) => {
  req.body.emailType = 'approved';
  return sendQuoteEmail(req, res);
};

// Send policy created email
export const sendPolicyCreatedEmail = async (req, res) => {
  try {
    const { policyId } = req.params;

    // Get policy details
    const [policies] = await pool.execute(`
      SELECT 
        p.*,
        u.name as customer_name, 
        u.email as customer_email,
        v.brand as vehicle_brand, 
        v.model as vehicle_model
      FROM policies p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN vehicles v ON p.vehicle_id = v.id
      WHERE p.id = ?
    `, [policyId]);

    if (policies.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    const policy = policies[0];

    const emailSubject = `Police d'assurance créée - ${policy.policy_number}`;
    const emailBody = `Bonjour ${policy.customer_name},\n\nVotre police d'assurance ${policy.policy_number} a été créée avec succès.\n\nDétails du véhicule: ${policy.vehicle_brand} ${policy.vehicle_model}\nPrime: ${policy.premium_amount} MAD\nPériode: ${policy.start_date} au ${policy.end_date}\n\nCordialement,\nL'équipe AssurOnline`;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'assuronline.demo@gmail.com',
      to: policy.customer_email,
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>')
    });

    res.json({
      success: true,
      message: 'Policy creation email sent successfully'
    });

  } catch (error) {
    console.error('Policy email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send policy email',
      error: error.message
    });
  }
};

// Send payment reminder email
export const sendPaymentReminderEmail = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Get payment details
    const [payments] = await pool.execute(`
      SELECT 
        p.*,
        u.name as customer_name, 
        u.email as customer_email,
        pol.policy_number
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN policies pol ON p.policy_id = pol.id
      WHERE p.id = ?
    `, [paymentId]);

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const payment = payments[0];

    const emailSubject = `Rappel de paiement - Police ${payment.policy_number}`;
    const emailBody = `Bonjour ${payment.customer_name},\n\nCeci est un rappel pour le paiement de votre police d'assurance ${payment.policy_number}.\n\nMontant: ${payment.amount} MAD\n\nVeuillez effectuer le paiement dès que possible.\n\nCordialement,\nL'équipe AssurOnline`;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'assuronline.demo@gmail.com',
      to: payment.customer_email,
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>')
    });

    res.json({
      success: true,
      message: 'Payment reminder email sent successfully'
    });

  } catch (error) {
    console.error('Payment reminder email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send payment reminder',
      error: error.message
    });
  }
};

// Send custom email
export const sendCustomEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, message'
      });
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'assuronline.demo@gmail.com',
      to: to,
      subject: subject,
      text: message,
      html: message.replace(/\n/g, '<br>')
    });

    res.json({
      success: true,
      message: 'Custom email sent successfully'
    });

  } catch (error) {
    console.error('Custom email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send custom email',
      error: error.message
    });
  }
};

// Send bulk emails
export const sendBulkEmails = async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipients array is required'
      });
    }

    const transporter = createTransporter();
    const results = [];

    for (const recipient of recipients) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER || 'assuronline.demo@gmail.com',
          to: recipient.email,
          subject: subject,
          text: message,
          html: message.replace(/\n/g, '<br>')
        });
        results.push({ email: recipient.email, status: 'sent' });
      } catch (error) {
        results.push({ email: recipient.email, status: 'failed', error: error.message });
      }
    }

    res.json({
      success: true,
      message: 'Bulk emails processed',
      results: results
    });

  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk emails',
      error: error.message
    });
  }
};

// Verify email configuration
export const verifyEmailConfiguration = async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    
    res.json({
      success: true,
      message: 'Email configuration is valid'
    });
  } catch (error) {
    console.error('Email configuration error:', error);
    res.status(500).json({
      success: false,
      message: 'Email configuration is invalid',
      error: error.message
    });
  }
};

// Get email templates
export const getEmailTemplates = async (req, res) => {
  try {
    const templates = {
      quote_created: {
        subject: 'Nouveau devis créé - {quote_number}',
        body: 'Bonjour {customer_name},\n\nVotre devis {quote_number} a été créé avec succès.\n\nCordialement,\nL\'équipe AssurOnline'
      },
      quote_approved: {
        subject: 'Devis approuvé - {quote_number}',
        body: 'Bonjour {customer_name},\n\nVotre devis {quote_number} a été approuvé.\n\nCordialement,\nL\'équipe AssurOnline'
      },
      policy_created: {
        subject: 'Police d\'assurance créée - {policy_number}',
        body: 'Bonjour {customer_name},\n\nVotre police d\'assurance {policy_number} a été créée avec succès.\n\nCordialement,\nL\'équipe AssurOnline'
      },
      payment_reminder: {
        subject: 'Rappel de paiement - Police {policy_number}',
        body: 'Bonjour {customer_name},\n\nCeci est un rappel pour le paiement de votre police d\'assurance {policy_number}.\n\nCordialement,\nL\'équipe AssurOnline'
      }
    };

    res.json({
      success: true,
      templates: templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email templates',
      error: error.message
    });
  }
};