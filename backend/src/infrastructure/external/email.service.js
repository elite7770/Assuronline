import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
    this.templatesPath = path.join(__dirname, '../templates/email');
    this.ensureTemplatesDirectory();
  }

  createTransporter() {
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email configuration not found. Email sending will be disabled.');
      return null;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  ensureTemplatesDirectory() {
    if (!fs.existsSync(this.templatesPath)) {
      fs.mkdirSync(this.templatesPath, { recursive: true });
      this.createDefaultTemplates();
    }
  }

  createDefaultTemplates() {
    // Quote Created Template
    const quoteCreatedTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nouveau devis créé - AssurOnline</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { background: #6b7280; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .button { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
        .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AssurOnline</h1>
            <p>Votre partenaire assurance au Maroc</p>
        </div>
        
        <div class="content">
            <h2>Nouveau devis créé</h2>
            <p>Bonjour {{customerName}},</p>
            
            <p>Votre devis d'assurance {{vehicleType}} a été créé avec succès.</p>
            
            <div class="highlight">
                <h3>Détails du devis</h3>
                <p><strong>Numéro de devis:</strong> {{quoteNumber}}</p>
                <p><strong>Type:</strong> {{vehicleType}} - {{coverageType}}</p>
                <p><strong>Prime annuelle:</strong> {{premiumAmount}} MAD</p>
                <p><strong>Valide jusqu'au:</strong> {{validUntil}}</p>
            </div>
            
            <p>Vous pouvez consulter votre devis en vous connectant à votre espace client.</p>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{loginUrl}}" class="button">Accéder à mon espace</a>
            </p>
            
            <p>Pour toute question, n'hésitez pas à nous contacter.</p>
        </div>
        
        <div class="footer">
            <p>AssurOnline - Tél: +212 5XX XXX XXX | Email: contact@assuronline.ma</p>
            <p>Adresse: Avenue Mohammed V, Casablanca, Maroc</p>
        </div>
    </div>
</body>
</html>`;

    // Quote Approved Template
    const quoteApprovedTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Devis approuvé - AssurOnline</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { background: #6b7280; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .button { background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
        .success { background: #d1fae5; padding: 15px; border-left: 4px solid #059669; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AssurOnline</h1>
            <p>Votre partenaire assurance au Maroc</p>
        </div>
        
        <div class="content">
            <h2>Devis approuvé</h2>
            <p>Bonjour {{customerName}},</p>
            
            <p>Excellente nouvelle ! Votre devis d'assurance {{vehicleType}} a été approuvé.</p>
            
            <div class="success">
                <h3>Détails du devis approuvé</h3>
                <p><strong>Numéro de devis:</strong> {{quoteNumber}}</p>
                <p><strong>Type:</strong> {{vehicleType}} - {{coverageType}}</p>
                <p><strong>Prime annuelle:</strong> {{premiumAmount}} MAD</p>
                <p><strong>Prochaine étape:</strong> Création de votre police d'assurance</p>
            </div>
            
            <p>Votre police d'assurance sera créée automatiquement et vous recevrez un email de confirmation.</p>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{loginUrl}}" class="button">Consulter mon devis</a>
            </p>
        </div>
        
        <div class="footer">
            <p>AssurOnline - Tél: +212 5XX XXX XXX | Email: contact@assuronline.ma</p>
        </div>
    </div>
</body>
</html>`;

    // Policy Created Template
    const policyCreatedTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Police d'assurance créée - AssurOnline</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { background: #6b7280; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .button { background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
        .policy { background: #ede9fe; padding: 15px; border-left: 4px solid #7c3aed; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AssurOnline</h1>
            <p>Votre partenaire assurance au Maroc</p>
        </div>
        
        <div class="content">
            <h2>Police d'assurance créée</h2>
            <p>Bonjour {{customerName}},</p>
            
            <p>Votre police d'assurance {{vehicleType}} a été créée avec succès.</p>
            
            <div class="policy">
                <h3>Détails de la police</h3>
                <p><strong>Numéro de police:</strong> {{policyNumber}}</p>
                <p><strong>Type:</strong> {{vehicleType}} - {{coverageType}}</p>
                <p><strong>Prime annuelle:</strong> {{premiumAmount}} MAD</p>
                <p><strong>Date de début:</strong> {{startDate}}</p>
                <p><strong>Date de fin:</strong> {{endDate}}</p>
                <p><strong>Fichier PDF:</strong> <a href="{{policyPdfUrl}}">Télécharger la police</a></p>
            </div>
            
            <p>Votre police d'assurance est maintenant active. Conservez précieusement ce document.</p>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{loginUrl}}" class="button">Accéder à mon espace</a>
            </p>
        </div>
        
        <div class="footer">
            <p>AssurOnline - Tél: +212 5XX XXX XXX | Email: contact@assuronline.ma</p>
        </div>
    </div>
</body>
</html>`;

    // Payment Reminder Template
    const paymentReminderTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rappel de paiement - AssurOnline</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { background: #6b7280; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .button { background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
        .warning { background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AssurOnline</h1>
            <p>Votre partenaire assurance au Maroc</p>
        </div>
        
        <div class="content">
            <h2>Rappel de paiement</h2>
            <p>Bonjour {{customerName}},</p>
            
            <p>Nous vous rappelons qu'un paiement est en attente pour votre police d'assurance.</p>
            
            <div class="warning">
                <h3>Détails du paiement</h3>
                <p><strong>Numéro de police:</strong> {{policyNumber}}</p>
                <p><strong>Montant:</strong> {{amount}} MAD</p>
                <p><strong>Date d'échéance:</strong> {{dueDate}}</p>
                <p><strong>Méthode de paiement:</strong> {{paymentMethod}}</p>
            </div>
            
            <p>Pour éviter toute interruption de votre couverture, veuillez effectuer le paiement dans les plus brefs délais.</p>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{paymentUrl}}" class="button">Effectuer le paiement</a>
            </p>
        </div>
        
        <div class="footer">
            <p>AssurOnline - Tél: +212 5XX XXX XXX | Email: contact@assuronline.ma</p>
        </div>
    </div>
</body>
</html>`;

    // Write templates to files
    fs.writeFileSync(path.join(this.templatesPath, 'quote-created.html'), quoteCreatedTemplate);
    fs.writeFileSync(path.join(this.templatesPath, 'quote-approved.html'), quoteApprovedTemplate);
    fs.writeFileSync(path.join(this.templatesPath, 'policy-created.html'), policyCreatedTemplate);
    fs.writeFileSync(
      path.join(this.templatesPath, 'payment-reminder.html'),
      paymentReminderTemplate
    );
  }

  /**
   * Send Quote Created Email
   */
  async sendQuoteCreatedEmail(quoteData) {
    const template = fs.readFileSync(path.join(this.templatesPath, 'quote-created.html'), 'utf8');
    const compiledTemplate = handlebars.compile(template);

    const html = compiledTemplate({
      customerName: quoteData.customerName,
      quoteNumber: quoteData.quoteNumber,
      vehicleType: quoteData.type === 'car' ? 'Automobile' : 'Moto',
      coverageType: this.getCoverageTypeName(quoteData.coverageType),
      premiumAmount: quoteData.finalPremium.toLocaleString('fr-FR'),
      validUntil: new Date(quoteData.validUntil).toLocaleDateString('fr-FR'),
      loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
    });

    return this.sendEmail({
      to: quoteData.customerEmail,
      subject: `Nouveau devis créé - ${quoteData.quoteNumber}`,
      html: html,
    });
  }

  /**
   * Send Quote Approved Email
   */
  async sendQuoteApprovedEmail(quoteData) {
    const template = fs.readFileSync(path.join(this.templatesPath, 'quote-approved.html'), 'utf8');
    const compiledTemplate = handlebars.compile(template);

    const html = compiledTemplate({
      customerName: quoteData.customerName,
      quoteNumber: quoteData.quoteNumber,
      vehicleType: quoteData.type === 'car' ? 'Automobile' : 'Moto',
      coverageType: this.getCoverageTypeName(quoteData.coverageType),
      premiumAmount: quoteData.finalPremium.toLocaleString('fr-FR'),
      loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
    });

    return this.sendEmail({
      to: quoteData.customerEmail,
      subject: `Devis approuvé - ${quoteData.quoteNumber}`,
      html: html,
    });
  }

  /**
   * Send Policy Created Email
   */
  async sendPolicyCreatedEmail(policyData) {
    const template = fs.readFileSync(path.join(this.templatesPath, 'policy-created.html'), 'utf8');
    const compiledTemplate = handlebars.compile(template);

    const html = compiledTemplate({
      customerName: policyData.customerName,
      policyNumber: policyData.policyNumber,
      vehicleType: policyData.type === 'car' ? 'Automobile' : 'Moto',
      coverageType: this.getCoverageTypeName(policyData.coverageType),
      premiumAmount: policyData.premiumAmount.toLocaleString('fr-FR'),
      startDate: new Date(policyData.startDate).toLocaleDateString('fr-FR'),
      endDate: new Date(policyData.endDate).toLocaleDateString('fr-FR'),
      policyPdfUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/documents/policy/${policyData.policyNumber}`,
      loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
    });

    return this.sendEmail({
      to: policyData.customerEmail,
      subject: `Police d'assurance créée - ${policyData.policyNumber}`,
      html: html,
    });
  }

  /**
   * Send Payment Reminder Email
   */
  async sendPaymentReminderEmail(paymentData) {
    const template = fs.readFileSync(
      path.join(this.templatesPath, 'payment-reminder.html'),
      'utf8'
    );
    const compiledTemplate = handlebars.compile(template);

    const html = compiledTemplate({
      customerName: paymentData.customerName,
      policyNumber: paymentData.policyNumber,
      amount: paymentData.amount.toLocaleString('fr-FR'),
      dueDate: new Date(paymentData.dueDate).toLocaleDateString('fr-FR'),
      paymentMethod: this.getPaymentMethodName(paymentData.paymentMethod),
      paymentUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payments/${paymentData.id}`,
    });

    return this.sendEmail({
      to: paymentData.customerEmail,
      subject: `Rappel de paiement - Police ${paymentData.policyNumber}`,
      html: html,
    });
  }

  /**
   * Send Custom Email
   */
  async sendCustomEmail({ to, subject, html, text, attachments = [] }) {
    return this.sendEmail({
      to,
      subject,
      html,
      text,
      attachments,
    });
  }

  /**
   * Send Email (Core Method)
   */
  async sendEmail({ to, subject, html, text, attachments = [] }) {
    try {
      // Check if email transporter is available
      if (!this.transporter) {
        console.warn('Email transporter not available. Email sending disabled.');
        return {
          success: false,
          message: 'Email configuration not available',
          messageId: null,
        };
      }

      const mailOptions = {
        from: `"AssurOnline" <${process.env.EMAIL_USER || 'noreply@assuronline.ma'}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: subject,
        html: html,
        text: text,
        attachments: attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      // Email sent successfully

      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send Bulk Emails
   */
  async sendBulkEmails(emails) {
    const results = [];

    for (const email of emails) {
      try {
        const result = await this.sendEmail(email);
        results.push({ success: true, email: email.to, result });
      } catch (error) {
        results.push({ success: false, email: email.to, error: error.message });
      }
    }

    return results;
  }

  /**
   * Verify Email Configuration
   */
  async verifyEmailConfiguration() {
    try {
      await this.transporter.verify();
      // Email configuration verified successfully
      return true;
    } catch (error) {
      console.error('Email configuration verification failed:', error);
      return false;
    }
  }

  // Helper Methods

  getCoverageTypeName(coverageType) {
    const coverageNames = {
      basique: 'Basique',
      standard: 'Standard',
      premium: 'Premium',
      essentiel: 'Essentiel',
      confort: 'Confort',
      ultimate: 'Ultimate',
    };
    return coverageNames[coverageType] || coverageType;
  }

  getPaymentMethodName(method) {
    const methodNames = {
      card: 'Carte bancaire',
      bank_transfer: 'Virement bancaire',
      cash: 'Espèces',
      check: 'Chèque',
    };
    return methodNames[method] || method;
  }
}

export const emailService = new EmailService();
