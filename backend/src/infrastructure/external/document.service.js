import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DocumentService {
  constructor() {
    this.documentsPath = path.join(__dirname, '../../documents');
    this.ensureDocumentsDirectory();
  }

  ensureDocumentsDirectory() {
    if (!fs.existsSync(this.documentsPath)) {
      fs.mkdirSync(this.documentsPath, { recursive: true });
    }
  }

  /**
   * Generate Policy Document
   */
  async generatePolicyDocument(policyData) {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Police d'assurance - ${policyData.policyNumber}`,
        Author: 'AssurOnline',
        Subject: "Police d'assurance automobile/moto",
        Keywords: 'assurance, police, véhicule, Maroc',
      },
    });

    const fileName = `policy_${policyData.policyNumber}_${Date.now()}.pdf`;
    const filePath = path.join(this.documentsPath, fileName);

    doc.pipe(fs.createWriteStream(filePath));

    // Header
    this.addHeader(doc, "POLICE D'ASSURANCE");

    // Policy Information
    this.addPolicyInfo(doc, policyData);

    // Customer Information
    this.addCustomerInfo(doc, policyData);

    // Vehicle Information
    this.addVehicleInfo(doc, policyData);

    // Coverage Details
    this.addCoverageDetails(doc, policyData);

    // Premium Information
    this.addPremiumInfo(doc, policyData);

    // Terms and Conditions
    this.addTermsAndConditions(doc);

    // Footer
    this.addFooter(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve({
          fileName,
          filePath,
          fileSize: fs.statSync(filePath).size,
        });
      });

      doc.on('error', reject);
    });
  }

  /**
   * Generate Invoice Document
   */
  async generateInvoiceDocument(invoiceData) {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Facture - ${invoiceData.invoiceNumber}`,
        Author: 'AssurOnline',
        Subject: "Facture d'assurance",
        Keywords: 'facture, assurance, paiement, Maroc',
      },
    });

    const fileName = `invoice_${invoiceData.invoiceNumber}_${Date.now()}.pdf`;
    const filePath = path.join(this.documentsPath, fileName);

    doc.pipe(fs.createWriteStream(filePath));

    // Header
    this.addHeader(doc, 'FACTURE');

    // Invoice Information
    this.addInvoiceInfo(doc, invoiceData);

    // Customer Information
    this.addCustomerInfo(doc, invoiceData);

    // Policy Information
    this.addPolicyInfo(doc, invoiceData);

    // Invoice Items
    this.addInvoiceItems(doc, invoiceData);

    // Payment Information
    this.addPaymentInfo(doc, invoiceData);

    // Footer
    this.addFooter(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve({
          fileName,
          filePath,
          fileSize: fs.statSync(filePath).size,
        });
      });

      doc.on('error', reject);
    });
  }

  /**
   * Generate Quote Document
   */
  async generateQuoteDocument(quoteData) {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Devis - ${quoteData.quoteNumber}`,
        Author: 'AssurOnline',
        Subject: "Devis d'assurance",
        Keywords: 'devis, assurance, prix, Maroc',
      },
    });

    const fileName = `quote_${quoteData.quoteNumber}_${Date.now()}.pdf`;
    const filePath = path.join(this.documentsPath, fileName);

    doc.pipe(fs.createWriteStream(filePath));

    // Header
    this.addHeader(doc, "DEVIS D'ASSURANCE");

    // Quote Information
    this.addQuoteInfo(doc, quoteData);

    // Customer Information
    this.addCustomerInfo(doc, quoteData);

    // Vehicle Information
    this.addVehicleInfo(doc, quoteData);

    // Coverage Options
    this.addCoverageOptions(doc, quoteData);

    // Pricing Breakdown
    this.addPricingBreakdown(doc, quoteData);

    // Validity Information
    this.addValidityInfo(doc, quoteData);

    // Footer
    this.addFooter(doc);

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve({
          fileName,
          filePath,
          fileSize: fs.statSync(filePath).size,
        });
      });

      doc.on('error', reject);
    });
  }

  // Helper Methods

  addHeader(doc, title) {
    // Company Logo Area (placeholder)
    doc.rect(50, 50, 100, 40).fill('#1e40af');

    doc.fillColor('#1e40af').fontSize(16).font('Helvetica-Bold').text('AssurOnline', 60, 65);

    doc
      .fillColor('#6b7280')
      .fontSize(10)
      .font('Helvetica')
      .text('Votre partenaire assurance au Maroc', 60, 80);

    // Document Title
    doc.fillColor('#000000').fontSize(20).font('Helvetica-Bold').text(title, 200, 60);

    // Document Date
    doc
      .fillColor('#6b7280')
      .fontSize(10)
      .font('Helvetica')
      .text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 200, 85);

    // Line separator
    doc.moveTo(50, 120).lineTo(550, 120).stroke('#e5e7eb');
  }

  addPolicyInfo(doc, data) {
    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INFORMATIONS DE LA POLICE', 50, 140);

    const policyInfo = [
      `Numéro de police: ${data.policyNumber}`,
      `Type d'assurance: ${data.type === 'car' ? 'Automobile' : 'Moto'}`,
      `Formule: ${this.getCoverageTypeName(data.coverageType)}`,
      `Date de début: ${new Date(data.startDate).toLocaleDateString('fr-FR')}`,
      `Date de fin: ${new Date(data.endDate).toLocaleDateString('fr-FR')}`,
      `Statut: ${this.getStatusName(data.status)}`,
    ];

    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(policyInfo.join('\n'), 50, 165);
  }

  addCustomerInfo(doc, data) {
    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INFORMATIONS CLIENT', 50, 250);

    const customerInfo = [
      `Nom: ${data.customerName}`,
      `Email: ${data.customerEmail}`,
      `Téléphone: ${data.customerPhone || 'Non renseigné'}`,
      `Adresse: ${data.customerAddress || 'Non renseignée'}`,
      `Ville: ${data.customerCity || 'Non renseignée'}`,
      `Code postal: ${data.customerPostalCode || 'Non renseigné'}`,
    ];

    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(customerInfo.join('\n'), 50, 275);
  }

  addVehicleInfo(doc, data) {
    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INFORMATIONS VÉHICULE', 50, 360);

    const vehicleInfo = [
      `Marque: ${data.vehicleBrand}`,
      `Modèle: ${data.vehicleModel}`,
      `Année: ${data.vehicleYear}`,
      `Immatriculation: ${data.vehicleLicensePlate || 'Non renseignée'}`,
      `Valeur estimée: ${data.vehicleValue ? `${data.vehicleValue.toLocaleString('fr-FR')} MAD` : 'Non renseignée'}`,
      `Type de carburant: ${data.vehicleFuelType || 'Non renseigné'}`,
    ];

    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(vehicleInfo.join('\n'), 50, 385);
  }

  addCoverageDetails(doc, data) {
    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('GARANTIES INCLUSES', 50, 470);

    const coverageDetails = this.getCoverageDetails(data.coverageType, data.type);

    doc
      .fillColor('#374151')
      .fontSize(10)
      .font('Helvetica')
      .text(coverageDetails.join('\n'), 50, 495);
  }

  addPremiumInfo(doc, data) {
    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INFORMATIONS TARIFAIRES', 50, 580);

    const premiumInfo = [
      `Prime annuelle: ${data.premiumAmount.toLocaleString('fr-FR')} MAD`,
      `Fréquence de paiement: ${this.getPaymentFrequencyName(data.paymentFrequency)}`,
      `Prochaine échéance: ${data.nextPaymentDate ? new Date(data.nextPaymentDate).toLocaleDateString('fr-FR') : 'Non définie'}`,
      `Renouvellement automatique: ${data.autoRenewal ? 'Oui' : 'Non'}`,
    ];

    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(premiumInfo.join('\n'), 50, 605);
  }

  addTermsAndConditions(doc) {
    doc.addPage();

    doc
      .fillColor('#000000')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('CONDITIONS GÉNÉRALES', 50, 50);

    const terms = [
      '1. DÉFINITIONS',
      "   - Assuré: Personne titulaire du contrat d'assurance",
      '   - Véhicule: Véhicule terrestre à moteur couvert par la police',
      '   - Sinistre: Événement dommageable couvert par la garantie',
      '',
      '2. GARANTIES',
      '   - Responsabilité Civile: Obligatoire selon la législation marocaine',
      '   - Défense et Recours: Prise en charge des frais de défense',
      "   - Assistance: Services d'assistance 24h/24",
      '',
      '3. EXCLUSIONS',
      "   - Conduite en état d'ivresse",
      '   - Conduite sans permis valide',
      '   - Utilisation du véhicule à des fins commerciales non déclarées',
      '',
      "4. OBLIGATIONS DE L'ASSURÉ",
      '   - Déclaration exacte des informations',
      '   - Notification des sinistres dans les 5 jours',
      '   - Paiement des primes dans les délais',
      '',
      '5. RÉSILIATION',
      '   - Résiliation possible avec préavis de 30 jours',
      '   - Remboursement au prorata des primes non consommées',
      '',
      '6. LÉGISLATION APPLICABLE',
      '   - Droit marocain applicable',
      '   - Tribunaux marocains compétents',
    ];

    doc.fillColor('#374151').fontSize(9).font('Helvetica').text(terms.join('\n'), 50, 80);
  }

  addFooter(doc) {
    const pageHeight = doc.page.height;
    const footerY = pageHeight - 100;

    doc.moveTo(50, footerY).lineTo(550, footerY).stroke('#e5e7eb');

    doc
      .fillColor('#6b7280')
      .fontSize(8)
      .font('Helvetica')
      .text('AssurOnline - Votre partenaire assurance au Maroc', 50, footerY + 10)
      .text('Tél: +212 5XX XXX XXX | Email: contact@assuronline.ma', 50, footerY + 25)
      .text('Adresse: Avenue Mohammed V, Casablanca, Maroc', 50, footerY + 40)
      .text('Agrément: N° XXX - RC: XXX - Patente: XXX', 50, footerY + 55);
  }

  // Invoice specific methods

  addInvoiceInfo(doc, data) {
    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INFORMATIONS FACTURE', 50, 140);

    const invoiceInfo = [
      `Numéro de facture: ${data.invoiceNumber}`,
      `Date d'émission: ${new Date(data.issueDate).toLocaleDateString('fr-FR')}`,
      `Date d'échéance: ${new Date(data.dueDate).toLocaleDateString('fr-FR')}`,
      `Statut: ${this.getPaymentStatusName(data.status)}`,
    ];

    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(invoiceInfo.join('\n'), 50, 165);
  }

  addInvoiceItems(doc, data) {
    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('DÉTAIL DES PRESTATIONS', 50, 220);

    // Table header
    doc.fillColor('#f3f4f6').rect(50, 245, 500, 25).fill();

    doc
      .fillColor('#000000')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Description', 60, 250)
      .text('Quantité', 300, 250)
      .text('Prix unitaire', 380, 250)
      .text('Total', 480, 250);

    // Table content
    const items = data.items || [
      {
        description: `Prime d'assurance ${data.type === 'car' ? 'Automobile' : 'Moto'} - ${this.getCoverageTypeName(data.coverageType)}`,
        quantity: 1,
        unitPrice: data.amount,
        total: data.amount,
      },
    ];

    let yPosition = 270;
    items.forEach((item, index) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      doc
        .fillColor(index % 2 === 0 ? '#ffffff' : '#f9fafb')
        .rect(50, yPosition - 5, 500, 20)
        .fill();

      doc
        .fillColor('#000000')
        .fontSize(9)
        .font('Helvetica')
        .text(item.description, 60, yPosition)
        .text(item.quantity.toString(), 300, yPosition)
        .text(`${item.unitPrice.toLocaleString('fr-FR')} MAD`, 380, yPosition)
        .text(`${item.total.toLocaleString('fr-FR')} MAD`, 480, yPosition);

      yPosition += 20;
    });

    // Total
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 0.2; // 20% TVA
    const taxAmount = totalAmount * taxRate;
    const finalTotal = totalAmount + taxAmount;

    yPosition += 10;
    doc
      .fillColor('#000000')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(`Sous-total: ${totalAmount.toLocaleString('fr-FR')} MAD`, 400, yPosition)
      .text(`TVA (20%): ${taxAmount.toLocaleString('fr-FR')} MAD`, 400, yPosition + 15)
      .text(`TOTAL: ${finalTotal.toLocaleString('fr-FR')} MAD`, 400, yPosition + 35);
  }

  addPaymentInfo(doc, data) {
    const paymentY = 400;

    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INFORMATIONS DE PAIEMENT', 50, paymentY);

    const paymentInfo = [
      `Méthode de paiement: ${this.getPaymentMethodName(data.paymentMethod)}`,
      `Date de paiement: ${data.paidDate ? new Date(data.paidDate).toLocaleDateString('fr-FR') : 'En attente'}`,
      `Référence de transaction: ${data.transactionId || 'Non disponible'}`,
      `Statut: ${this.getPaymentStatusName(data.status)}`,
    ];

    doc
      .fillColor('#374151')
      .fontSize(10)
      .font('Helvetica')
      .text(paymentInfo.join('\n'), 50, paymentY + 25);
  }

  // Quote specific methods

  addQuoteInfo(doc, data) {
    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INFORMATIONS DU DEVIS', 50, 140);

    const quoteInfo = [
      `Numéro de devis: ${data.quoteNumber}`,
      `Type d'assurance: ${data.type === 'car' ? 'Automobile' : 'Moto'}`,
      `Formule: ${this.getCoverageTypeName(data.coverageType)}`,
      `Date de création: ${new Date(data.createdAt).toLocaleDateString('fr-FR')}`,
      `Valide jusqu'au: ${new Date(data.validUntil).toLocaleDateString('fr-FR')}`,
      `Statut: ${this.getQuoteStatusName(data.status)}`,
    ];

    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(quoteInfo.join('\n'), 50, 165);
  }

  addCoverageOptions(doc, data) {
    doc
      .fillColor('#000000')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('OPTIONS DE COUVERTURE', 50, 250);

    const coverageOptions = this.getCoverageDetails(data.coverageType, data.type);

    doc
      .fillColor('#374151')
      .fontSize(10)
      .font('Helvetica')
      .text(coverageOptions.join('\n'), 50, 275);
  }

  addPricingBreakdown(doc, data) {
    doc.fillColor('#000000').fontSize(14).font('Helvetica-Bold').text('DÉTAIL TARIFAIRE', 50, 400);

    const pricingBreakdown = [
      `Prime de base: ${data.basePremium.toLocaleString('fr-FR')} MAD`,
      `Facteurs de risque:`,
      `  - Âge du conducteur: ${data.riskFactors?.ageFactor || 'N/A'}`,
      `  - Âge du véhicule: ${data.riskFactors?.vehicleAgeFactor || 'N/A'}`,
      `  - Valeur du véhicule: ${data.riskFactors?.valueFactor || 'N/A'}`,
      `  - Ville: ${data.riskFactors?.cityFactor || 'N/A'}`,
      `  - Expérience: ${data.riskFactors?.experienceFactor || 'N/A'}`,
      `  - Marque: ${data.riskFactors?.brandFactor || 'N/A'}`,
      `Prime finale: ${data.finalPremium.toLocaleString('fr-FR')} MAD`,
      `Prime mensuelle: ${data.monthlyPremium ? data.monthlyPremium.toLocaleString('fr-FR') + ' MAD' : 'N/A'}`,
    ];

    doc
      .fillColor('#374151')
      .fontSize(10)
      .font('Helvetica')
      .text(pricingBreakdown.join('\n'), 50, 425);
  }

  addValidityInfo(doc, data) {
    doc.fillColor('#000000').fontSize(14).font('Helvetica-Bold').text('VALIDITÉ DU DEVIS', 50, 550);

    const validityInfo = [
      `Ce devis est valable jusqu'au: ${new Date(data.validUntil).toLocaleDateString('fr-FR')}`,
      `Pour accepter ce devis, veuillez contacter notre service commercial`,
      `Tél: +212 5XX XXX XXX | Email: commercial@assuronline.ma`,
      `Les conditions générales sont disponibles sur demande`,
    ];

    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(validityInfo.join('\n'), 50, 575);
  }

  // Helper methods for text formatting

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

  getStatusName(status) {
    const statusNames = {
      active: 'Actif',
      pending: 'En attente',
      cancelled: 'Annulé',
      expired: 'Expiré',
      suspended: 'Suspendu',
    };
    return statusNames[status] || status;
  }

  getPaymentFrequencyName(frequency) {
    const frequencyNames = {
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      annually: 'Annuel',
    };
    return frequencyNames[frequency] || frequency;
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

  getPaymentStatusName(status) {
    const statusNames = {
      pending: 'En attente',
      paid: 'Payé',
      failed: 'Échoué',
      refunded: 'Remboursé',
      cancelled: 'Annulé',
    };
    return statusNames[status] || status;
  }

  getQuoteStatusName(status) {
    const statusNames = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      expired: 'Expiré',
    };
    return statusNames[status] || status;
  }

  getCoverageDetails(coverageType, vehicleType) {
    const coverageDetails = {
      car: {
        basique: [
          '✓ Responsabilité Civile obligatoire',
          '✓ Protection juridique',
          '✓ Garantie conducteur',
          '✓ Assistance dépannage',
        ],
        standard: [
          '✓ Responsabilité Civile obligatoire',
          '✓ Vol et incendie',
          '✓ Bris de glace',
          '✓ Vandalisme',
          '✓ Protection juridique',
          '✓ Garantie conducteur',
          '✓ Assistance dépannage',
        ],
        premium: [
          '✓ Responsabilité Civile obligatoire',
          '✓ Vol et incendie',
          '✓ Bris de glace',
          '✓ Vandalisme',
          '✓ Tous risques',
          '✓ Véhicule de remplacement',
          '✓ Protection juridique',
          '✓ Garantie conducteur',
          '✓ Assistance 24h/24',
        ],
      },
      moto: {
        essentiel: [
          '✓ Responsabilité Civile obligatoire',
          '✓ Protection juridique',
          '✓ Garantie conducteur',
          '✓ Assistance dépannage',
        ],
        confort: [
          '✓ Responsabilité Civile obligatoire',
          '✓ Vol et incendie',
          '✓ Équipements de protection',
          '✓ Protection juridique',
          '✓ Garantie conducteur',
          '✓ Assistance dépannage',
        ],
        ultimate: [
          '✓ Responsabilité Civile obligatoire',
          '✓ Vol et incendie',
          '✓ Équipements de protection',
          '✓ Tous risques',
          '✓ Moto de prêt',
          '✓ Protection juridique',
          '✓ Garantie conducteur',
          '✓ Assistance 24h/24',
        ],
      },
    };

    return coverageDetails[vehicleType]?.[coverageType] || ['Garanties non définies'];
  }
}

export const documentService = new DocumentService();
