import { documentService } from '../../infrastructure/external/document.service.js';
import { findPolicyById, findPolicyByNumber } from '../../core/domain/policies.model.js';
import { findQuoteById } from '../../core/domain/quotes.model.js';
import { getPaymentById } from '../../core/domain/payments.model.js';
import {
  createFileRecord,
  getFileById,
  getFilesByUser,
  deleteFileRecord,
} from '../../core/domain/file_storage.model.js';

/**
 * Generate Policy Document
 */
export async function generatePolicyDocument(req, res) {
  try {
    const { policyId, policyNumber } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find policy
    let policy;
    if (policyId) {
      policy = await findPolicyById(policyId);
    } else if (policyNumber) {
      policy = await findPolicyByNumber(policyNumber);
    } else {
      return res.status(400).json({ message: 'Policy ID or number required' });
    }

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Check access permissions
    if (userRole !== 'admin' && policy.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Prepare policy data for document generation
    const policyData = {
      policyNumber: policy.policy_number,
      type: policy.type,
      coverageType: policy.coverage_type,
      startDate: policy.start_date,
      endDate: policy.end_date,
      status: policy.status,
      premiumAmount: policy.premium,
      paymentFrequency: policy.payment_frequency,
      nextPaymentDate: policy.next_payment_date,
      autoRenewal: policy.auto_renewal,
      customerName: policy.customer_name,
      customerEmail: policy.customer_email,
      customerPhone: policy.customer_phone,
      customerAddress: policy.customer_address,
      customerCity: policy.customer_city,
      customerPostalCode: policy.customer_postal_code,
      vehicleBrand: policy.brand,
      vehicleModel: policy.model,
      vehicleYear: policy.year,
      vehicleLicensePlate: policy.license_plate,
      vehicleValue: policy.vehicle_value,
      vehicleFuelType: policy.fuel_type,
    };

    // Generate document
    const documentResult = await documentService.generatePolicyDocument(policyData);

    // Save file record to database
    const fileRecord = await createFileRecord({
      userId: userId,
      fileName: documentResult.fileName,
      originalName: `Police_${policy.policy_number}.pdf`,
      filePath: documentResult.filePath,
      fileSize: documentResult.fileSize,
      mimeType: 'application/pdf',
      fileType: 'document',
      relatedTable: 'policies',
      relatedId: policy.id,
    });

    res.json({
      success: true,
      message: 'Policy document generated successfully',
      document: {
        id: fileRecord.id,
        fileName: documentResult.fileName,
        originalName: fileRecord.original_name,
        fileSize: documentResult.fileSize,
        downloadUrl: `/api/documents/download/${fileRecord.id}`,
        createdAt: fileRecord.created_at,
      },
    });
  } catch (error) {
    console.error('Error generating policy document:', error);
    res.status(500).json({
      message: 'Error generating policy document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Generate Invoice Document
 */
export async function generateInvoiceDocument(req, res) {
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

    // Prepare invoice data for document generation
    const invoiceData = {
      invoiceNumber: `INV-${payment.id.toString().padStart(6, '0')}`,
      issueDate: payment.created_at,
      dueDate: payment.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: payment.status,
      amount: payment.amount,
      paymentMethod: payment.payment_method,
      paidDate: payment.paid_date,
      transactionId: payment.transaction_id,
      customerName: payment.customer_name,
      customerEmail: payment.customer_email,
      policyNumber: payment.policy_number,
      policyType: payment.policy_type,
      coverageType: payment.coverage_type,
      type: payment.policy_type,
      coverageType: payment.coverage_type,
      items: [
        {
          description: `Prime d'assurance ${payment.policy_type === 'car' ? 'Automobile' : 'Moto'} - ${payment.coverage_type}`,
          quantity: 1,
          unitPrice: payment.amount,
          total: payment.amount,
        },
      ],
    };

    // Generate document
    const documentResult = await documentService.generateInvoiceDocument(invoiceData);

    // Save file record to database
    const fileRecord = await createFileRecord({
      userId: userId,
      fileName: documentResult.fileName,
      originalName: `Facture_${invoiceData.invoiceNumber}.pdf`,
      filePath: documentResult.filePath,
      fileSize: documentResult.fileSize,
      mimeType: 'application/pdf',
      fileType: 'document',
      relatedTable: 'payments',
      relatedId: payment.id,
    });

    res.json({
      success: true,
      message: 'Invoice document generated successfully',
      document: {
        id: fileRecord.id,
        fileName: documentResult.fileName,
        originalName: fileRecord.original_name,
        fileSize: documentResult.fileSize,
        downloadUrl: `/api/documents/download/${fileRecord.id}`,
        createdAt: fileRecord.created_at,
      },
    });
  } catch (error) {
    console.error('Error generating invoice document:', error);
    res.status(500).json({
      message: 'Error generating invoice document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Generate Quote Document
 */
export async function generateQuoteDocument(req, res) {
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

    // Prepare quote data for document generation
    const quoteData = {
      quoteNumber: quote.quote_number,
      type: quote.type,
      coverageType: quote.coverage_type,
      createdAt: quote.created_at,
      validUntil: quote.valid_until,
      status: quote.status,
      basePremium: quote.base_premium,
      finalPremium: quote.final_premium,
      monthlyPremium: quote.monthly_premium,
      riskFactors: quote.risk_factors ? JSON.parse(quote.risk_factors) : {},
      customerName: quote.customer_name,
      customerEmail: quote.customer_email,
      customerPhone: quote.customer_phone,
      customerAddress: quote.customer_address,
      customerCity: quote.customer_city,
      customerPostalCode: quote.customer_postal_code,
      vehicleBrand: quote.vehicle_brand,
      vehicleModel: quote.vehicle_model,
      vehicleYear: quote.vehicle_year,
      vehicleLicensePlate: quote.vehicle_license_plate,
      vehicleValue: quote.vehicle_value,
      vehicleFuelType: quote.vehicle_fuel_type,
    };

    // Generate document
    const documentResult = await documentService.generateQuoteDocument(quoteData);

    // Save file record to database
    const fileRecord = await createFileRecord({
      userId: userId,
      fileName: documentResult.fileName,
      originalName: `Devis_${quote.quote_number}.pdf`,
      filePath: documentResult.filePath,
      fileSize: documentResult.fileSize,
      mimeType: 'application/pdf',
      fileType: 'document',
      relatedTable: 'quotes',
      relatedId: quote.id,
    });

    res.json({
      success: true,
      message: 'Quote document generated successfully',
      document: {
        id: fileRecord.id,
        fileName: documentResult.fileName,
        originalName: fileRecord.original_name,
        fileSize: documentResult.fileSize,
        downloadUrl: `/api/documents/download/${fileRecord.id}`,
        createdAt: fileRecord.created_at,
      },
    });
  } catch (error) {
    console.error('Error generating quote document:', error);
    res.status(500).json({
      message: 'Error generating quote document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Download Document
 */
export async function downloadDocument(req, res) {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find file record
    const fileRecord = await getFileById(fileId);
    if (!fileRecord) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check access permissions
    if (userRole !== 'admin' && fileRecord.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if file exists
    const fs = await import('fs');
    if (!fs.existsSync(fileRecord.file_path)) {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', fileRecord.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.original_name}"`);
    res.setHeader('Content-Length', fileRecord.file_size);

    // Stream file to response
    const fileStream = fs.createReadStream(fileRecord.file_path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({
      message: 'Error downloading document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * List User Documents
 */
export async function listUserDocuments(req, res) {
  try {
    const userId = req.user.id;
    const { type, relatedTable, relatedId } = req.query;

    // Build query conditions
    let conditions = ['user_id = ?'];
    let params = [userId];

    if (type) {
      conditions.push('file_type = ?');
      params.push(type);
    }

    if (relatedTable) {
      conditions.push('related_table = ?');
      params.push(relatedTable);
    }

    if (relatedId) {
      conditions.push('related_id = ?');
      params.push(relatedId);
    }

    const documents = await getFilesByUser(userId, {
      type,
      relatedTable,
      relatedId,
    });

    res.json({
      success: true,
      documents: documents.map((doc) => ({
        id: doc.id,
        fileName: doc.file_name,
        originalName: doc.original_name,
        fileSize: doc.file_size,
        mimeType: doc.mime_type,
        fileType: doc.file_type,
        relatedTable: doc.related_table,
        relatedId: doc.related_id,
        downloadUrl: `/api/documents/download/${doc.id}`,
        createdAt: doc.created_at,
      })),
    });
  } catch (error) {
    console.error('Error listing documents:', error);
    res.status(500).json({
      message: 'Error listing documents',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Delete Document
 */
export async function deleteDocument(req, res) {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find file record
    const fileRecord = await getFileById(fileId);
    if (!fileRecord) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check access permissions
    if (userRole !== 'admin' && fileRecord.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete file from disk
    const fs = await import('fs');
    if (fs.existsSync(fileRecord.file_path)) {
      fs.unlinkSync(fileRecord.file_path);
    }

    // Delete file record from database
    await deleteFileRecord(fileId);

    res.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      message: 'Error deleting document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}
