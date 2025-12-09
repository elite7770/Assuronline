import { pool } from '../../infrastructure/database/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQuotePDF = async (req, res) => {
  try {
    const { quoteId } = req.params;

    console.log('Generating PDF for quote:', quoteId);

    // Get quote details with customer and vehicle info
    const [quotes] = await pool.execute(`
      SELECT 
        q.*,
        u.name as customer_name, 
        u.email as customer_email,
        u.phone as customer_phone,
        u.birth_date as customer_birth_date,
        v.brand as vehicle_brand, 
        v.model as vehicle_model,
        v.year as vehicle_year,
        v.license_plate as vehicle_license,
        v.engine_size as vehicle_engine_size,
        v.current_value as vehicle_value,
        v.color as vehicle_color,
        v.fuel_type as vehicle_fuel_type
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
    
    // Debug logging
    console.log('Quote data for PDF:', {
      id: quote.id,
      quote_number: quote.quote_number,
      customer_name: quote.customer_name,
      customer_email: quote.customer_email,
      vehicle_brand: quote.vehicle_brand,
      vehicle_model: quote.vehicle_model,
      type: quote.type,
      coverage_type: quote.coverage_type,
      base_premium: quote.base_premium,
      final_premium: quote.final_premium,
      status: quote.status
    });

    // Create PDF content
    const pdfContent = generatePDFContent(quote);
    
    // Debug PDF content
    console.log('Generated PDF content length:', pdfContent.length);
    console.log('PDF content preview:', pdfContent.substring(0, 200));
    
    // Check if PDF content is valid
    if (!pdfContent || pdfContent.trim().length === 0) {
      console.error('PDF content is empty or null');
      return res.status(500).json({
        success: false,
        message: 'Failed to generate PDF content'
      });
    }

    // Create PDF file with descriptive name
    const quoteNumber = quote.quote_number || `QUO-${quote.id}`;
    const customerName = quote.customer_name ? quote.customer_name.replace(/[^a-zA-Z0-9]/g, '_') : 'Client';
    const fileName = `Devis_${quoteNumber}_${customerName}_${Date.now()}.txt`;
    const filePath = path.join(__dirname, '../../../temp', fileName);

    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '../../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Write PDF content to file
    fs.writeFileSync(filePath, pdfContent, 'utf8');

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', Buffer.byteLength(pdfContent, 'utf8'));

    // Send the file
    res.send(pdfContent);

    // Clean up file after sending (optional)
    setTimeout(() => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }, 5000);

  } catch (error) {
    console.error('Error in generateQuotePDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const generatePDFContent = (quote) => {
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const currentTime = new Date().toLocaleTimeString('fr-FR');
  const validUntil = quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('fr-FR') : 'N/A';
  const createdAt = new Date(quote.created_at).toLocaleDateString('fr-FR');
  const createdTime = new Date(quote.created_at).toLocaleTimeString('fr-FR');
  
  // Calculate coverage details based on type
  const getCoverageDetails = (type, coverageType) => {
    const coverageMap = {
      'car': {
        'basique': 'Responsabilité civile, Protection juridique',
        'standard': 'RC + Vol, Incendie, Bris de glace, Protection juridique',
        'confort': 'RC + Vol, Incendie, Bris de glace, Dépannage, Protection juridique',
        'premium': 'RC + Vol, Incendie, Bris de glace, Dépannage, Garantie conducteur, Protection juridique'
      },
      'moto': {
        'basique': 'Responsabilité civile, Protection juridique',
        'standard': 'RC + Vol, Incendie, Bris de glace, Protection juridique',
        'confort': 'RC + Vol, Incendie, Bris de glace, Dépannage, Protection juridique',
        'premium': 'RC + Vol, Incendie, Bris de glace, Dépannage, Garantie conducteur, Protection juridique'
      }
    };
    return coverageMap[type]?.[coverageType] || 'Garanties standard';
  };

  const coverageDetails = getCoverageDetails(quote.type, quote.coverage_type);
  
  // Calculate total savings and discounts
  const basePremium = Number(quote.base_premium || 0);
  const finalPremium = Number(quote.final_premium || 0);
  const savings = basePremium - finalPremium;
  const discountPercentage = basePremium > 0 ? ((savings / basePremium) * 100).toFixed(1) : 0;

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                              DEVIS D'ASSURANCE                              ║
║                              AssurOnline Platform                            ║
║                        Plateforme d'assurance en ligne                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│                           INFORMATIONS CLIENT                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Nom complet      : ${(quote.customer_name || 'N/A').padEnd(50)} │
│ Adresse email    : ${(quote.customer_email || 'N/A').padEnd(50)} │
│ Téléphone        : ${(quote.customer_phone || 'N/A').padEnd(50)} │
│ Date de naissance: ${quote.customer_birth_date ? new Date(quote.customer_birth_date).toLocaleDateString('fr-FR') : 'N/A'.padEnd(50)} │
│ Profession       : ${'N/A'.padEnd(50)} │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          INFORMATIONS VÉHICULE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Marque           : ${(quote.vehicle_brand || 'N/A').padEnd(50)} │
│ Modèle           : ${(quote.vehicle_model || 'N/A').padEnd(50)} │
│ Année de mise en │ ${(quote.vehicle_year || 'N/A').padEnd(50)} │
│ circulation      :                                                          │
│ Numéro de plaque : ${(quote.vehicle_license || 'N/A').padEnd(50)} │
│ Type de véhicule : ${(quote.type || 'N/A').toUpperCase().padEnd(50)} │
│ Puissance fiscale: ${(quote.vehicle_engine_size || 'N/A').padEnd(50)} │
│ Valeur du véhicule: ${quote.vehicle_value ? Number(quote.vehicle_value).toLocaleString('fr-FR') + ' MAD' : 'N/A'.padEnd(50)} │
│ Couleur          : ${(quote.vehicle_color || 'N/A').padEnd(50)} │
│ Type de carburant: ${(quote.vehicle_fuel_type || 'N/A').padEnd(50)} │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            DÉTAILS DE LA COUVERTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ Type de couverture: ${(quote.coverage_type || 'N/A').toUpperCase().padEnd(50)} │
│ Garanties incluses: ${coverageDetails.padEnd(50)} │
│ Franchise         : ${'Selon conditions générales'.padEnd(50)} │
│ Zone de circulation: ${'Maroc + Europe'.padEnd(50)} │
│ Conducteur principal: ${(quote.customer_name || 'N/A').padEnd(50)} │
│ Conducteurs autorisés: ${'Tous conducteurs autorisés'.padEnd(50)} │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            DÉTAILS FINANCIERS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Prime de base    : ${basePremium.toLocaleString('fr-FR').padEnd(15)} MAD │
│ Réductions       : ${savings.toLocaleString('fr-FR').padEnd(15)} MAD │
│ (${discountPercentage}% d'économie)                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ PRIME FINALE     : ${finalPremium.toLocaleString('fr-FR').padEnd(15)} MAD │
│ Prime mensuelle  : ${Number(quote.monthly_premium || 0).toLocaleString('fr-FR').padEnd(15)} MAD │
│ Frais de dossier : ${'Inclus'.padEnd(15)} MAD │
│ TVA (20%)        : ${(finalPremium * 0.2).toLocaleString('fr-FR').padEnd(15)} MAD │
├─────────────────────────────────────────────────────────────────────────────┤
│ TOTAL TTC        : ${(finalPremium * 1.2).toLocaleString('fr-FR').padEnd(15)} MAD │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              INFORMATIONS DEVIS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Numéro de devis  : ${(quote.quote_number || `QUO-${quote.id}`).padEnd(50)} │
│ Statut           : ${(quote.status || 'pending').toUpperCase().padEnd(50)} │
│ Date de création : ${createdAt} à ${createdTime.padEnd(30)} │
│ Valide jusqu'au  : ${validUntil.padEnd(50)} │
│ Durée du contrat : ${'12 mois'.padEnd(50)} │
│ Paiement         : ${'Mensuel'.padEnd(50)} │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            GARANTIES DÉTAILLÉES                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Responsabilité civile:                                                      │
│ • Dommages aux tiers: ${'Illimité'.padEnd(40)} │
│ • Défense et recours: ${'Inclus'.padEnd(40)} │
│                                                                             │
│ Vol et incendie:                                                            │
│ • Valeur à neuf: ${'12 mois'.padEnd(40)} │
│ • Valeur vénale: ${'Après 12 mois'.padEnd(40)} │
│                                                                             │
│ Bris de glace:                                                              │
│ • Pare-brise: ${'Sans franchise'.padEnd(40)} │
│ • Vitres latérales: ${'Avec franchise'.padEnd(40)} │
│                                                                             │
│ Dépannage:                                                                  │
│ • Remorquage: ${'Jusqu\'à 50km'.padEnd(40)} │
│ • Prise en charge: ${'24h/24, 7j/7'.padEnd(40)} │
└─────────────────────────────────────────────────────────────────────────────┘

${quote.admin_comment ? `
┌─────────────────────────────────────────────────────────────────────────────┐
│                            COMMENTAIRES ADMIN                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ ${quote.admin_comment.padEnd(75)} │
└─────────────────────────────────────────────────────────────────────────────┘
` : ''}

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CONDITIONS GÉNÉRALES                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Ce devis est valable pour une durée de 30 jours à compter de sa date     │
│ • Les conditions peuvent varier selon les documents fournis                 │
│ • Une approbation finale est requise avant la signature du contrat          │
│ • Le contrat prend effet le jour de la signature et du premier paiement     │
│ • Résiliation possible avec préavis de 30 jours                             │
│ • En cas de sinistre, déclaration dans les 5 jours ouvrés                  │
│ • Pour toute question, contactez notre service client au 05XX-XXXXXX        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              MENTIONS LÉGALES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Société: AssurOnline SARL                                                   │
│ Adresse: Casablanca, Maroc                                                  │
│ RC: N/A | Patente: N/A | ICE: N/A                                          │
│ Agrément: En cours d'obtention                                              │
│ Email: contact@assuronline.ma | Web: www.assuronline.ma                     │
└─────────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════════╗
║  Document généré le ${currentDate} à ${currentTime} par AssurOnline        ║
║  Plateforme d'assurance en ligne - www.assuronline.ma                      ║
║  Email: contact@assuronline.ma | Tél: 05XX-XXXXXX                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
`;
};
