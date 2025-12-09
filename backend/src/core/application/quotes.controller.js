import {
  createQuote,
  findQuoteById,
  findQuoteByNumber,
  listUserQuotes,
  listAllQuotes,
  updateQuoteStatus,
  getQuoteStatistics,
  deleteQuote,
} from '../../core/domain/quotes.model.js';
import { insertPolicy } from '../../core/domain/policies.model.js';
import { createNotification } from '../../core/domain/notifications.model.js';
import { generatePolicyNumber } from '../../shared/utils/id.js';
import { pricingService } from '../../infrastructure/external/pricing.service.js';
import { sendQuoteEmail } from '../../features/email/email.controller.js';

/**
 * Get quote estimate (public endpoint)
 */
export async function getQuoteEstimate(req, res) {
  try {
    const {
      type,
      coverage,
      vehicleValue,
      vehicleBrand,
      vehicleModel,
    } = req.body;

    // Validate required fields
    if (!type || !coverage) {
      return res.status(400).json({
        message: 'Type and coverage are required',
        errors: ['Type and coverage are required'],
      });
    }

    // Validate quote data
    const validation = pricingService.validateQuoteData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Invalid quote data',
        errors: validation.errors,
      });
    }

    // Calculate premium
    const premiumData = pricingService.calculatePremium(req.body);

    // Get available brands and models
    const availableBrands = pricingService.getVehicleBrands(type);
    const availableModels = vehicleBrand ? pricingService.getVehicleModels(vehicleBrand, type) : [];

    // Get average vehicle value if not provided
    const estimatedValue = vehicleValue || pricingService.getAverageVehicleValue(vehicleBrand, vehicleModel, type);

    res.json({
      success: true,
      data: {
        premium: premiumData,
        estimatedValue,
        availableBrands,
        availableModels,
        cities: pricingService.getMoroccanCities(),
        coverageDetails: pricingService.getCoverageDetails(type, coverage),
      },
    });
  } catch (error) {
    console.error('Error getting quote estimate:', error);
    res.status(500).json({
      message: 'Error calculating quote estimate',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Create a new quote (authenticated or unauthenticated)
 */
export async function createNewQuote(req, res) {
  try {
    // Creating new quote for user (authenticated or unauthenticated)
    const userId = req.user?.id || null; // Handle unauthenticated users
    const {
      type,
      coverage_type,
      driverAge,
      vehicleAge,
      vehicleValue,
      city,
      drivingExperience,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehicleLicensePlate,
      vehicleFuelType,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerPostalCode,
    } = req.body;

    // Validate required fields
    if (!type || !coverage_type) {
      return res.status(400).json({
        message: 'Type and coverage type are required',
        errors: ['Type and coverage type are required'],
      });
    }

    // For unauthenticated users, require customer information
    if (!userId && (!customerName || !customerEmail)) {
      return res.status(400).json({
        message: 'Customer name and email are required for unauthenticated users',
        errors: ['Customer name and email are required'],
      });
    }

    // Calculate premium using pricing service
    // Calculating premium with data
    
    const premiumData = pricingService.calculatePremium({
      type,
      coverage: coverage_type,
      driverAge,
      vehicleAge,
      vehicleValue,
      city,
      drivingExperience,
      vehicleBrand,
      vehicleModel,
    });

    // Premium calculated

    // Set valid until date (30 days from now)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    // Prepare quote data
    const quoteData = {
      user_id: userId,
      vehicle_id: null, // Will be set if vehicle is registered
      type,
      coverage_type,
      coverage_options: premiumData.coverageDetails.coverages,
      base_premium: premiumData.baseRate,
      risk_factors: premiumData.breakdown,
      final_premium: premiumData.annualPremium,
      monthly_premium: premiumData.monthlyPremium,
      valid_until: validUntil.toISOString().split('T')[0],
      status: 'pending',
      calculation_details: {
        driverAge,
        vehicleAge,
        vehicleValue,
        city,
        drivingExperience,
        vehicleBrand,
        vehicleModel,
        vehicleYear,
        vehicleLicensePlate,
        vehicleFuelType,
        customerName: customerName || (req.user ? req.user.first_name + ' ' + req.user.last_name : ''),
        customerEmail: customerEmail || (req.user ? req.user.email : ''),
        customerPhone: customerPhone || (req.user ? req.user.phone : ''),
        customerAddress: customerAddress,
        customerCity: customerCity || city,
        customerPostalCode: customerPostalCode,
      },
      customer_preferences: {
        preferredContactMethod: 'email',
        urgency: 'normal'
      },
      is_urgent: false,
      priority: 'normal'
    };

    // Create quote
    // Quote data prepared
    const quote = await createQuote(quoteData);
    // Quote created successfully

    // Send email notification
    try {
      const customerEmail = quote.calculation_details?.customerEmail || (req.user ? req.user.email : '');
      const customerName = quote.calculation_details?.customerName || (req.user ? req.user.first_name + ' ' + req.user.last_name : '');
      
      if (customerEmail) {
        await sendQuoteEmail({
          to: customerEmail,
          quoteNumber: quote.quote_number,
          customerName: customerName,
          premium: quote.final_premium,
          validUntil: quote.valid_until,
        });
      }
    } catch (emailError) {
      console.error('Error sending quote email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Quote created successfully',
      data: {
        quote,
        premium: premiumData,
      },
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      message: 'Error creating quote',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get user's quotes
 */
export async function getUserQuotes(req, res) {
  try {
    const userId = req.user.id;
    const filters = req.query;

    const quotes = await listUserQuotes(userId, filters);

    res.json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    console.error('Error getting user quotes:', error);
    res.status(500).json({
      message: 'Error retrieving quotes',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get quote by ID
 */
export async function getQuoteById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const quote = await findQuoteById(id);
    if (!quote) {
      return res.status(404).json({
        message: 'Quote not found',
      });
    }

    // Check access permissions
    if (userRole !== 'admin' && quote.user_id !== userId) {
      return res.status(403).json({
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error('Error getting quote by ID:', error);
    res.status(500).json({
      message: 'Error retrieving quote',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get quote by quote number
 */
export async function getQuoteByNumber(req, res) {
  try {
    const { quoteNumber } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const quote = await findQuoteByNumber(quoteNumber);
    if (!quote) {
      return res.status(404).json({
        message: 'Quote not found',
      });
    }

    // Check access permissions
    if (userRole !== 'admin' && quote.user_id !== userId) {
      return res.status(403).json({
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error('Error getting quote by number:', error);
    res.status(500).json({
      message: 'Error retrieving quote',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Update quote status (admin only)
 */
export async function updateQuote(req, res) {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin role required.',
      });
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'expired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        errors: [`Status must be one of: ${validStatuses.join(', ')}`],
      });
    }

    const success = await updateQuoteStatus(id, status, adminComment);
    if (!success) {
      return res.status(404).json({
        message: 'Quote not found',
      });
    }

    const updatedQuote = await findQuoteById(id);

    // If quote is approved, automatically create a policy
    if (status === 'approved') {
      try {
        // Generate policy number
        const policyNumber = generatePolicyNumber();
        
        // Calculate policy dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        
        // Calculate next payment date (annually by default)
        const nextPaymentDate = new Date(startDate);
        nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);

        // Create policy from approved quote
        const policyId = await insertPolicy({
          userId: updatedQuote.user_id,
          vehicleId: updatedQuote.vehicle_id,
          quoteId: updatedQuote.id,
          policyNumber,
          type: updatedQuote.type,
          coverageType: updatedQuote.coverage_type,
          coverageDetails: updatedQuote.coverage_options || {},
          premiumAmount: updatedQuote.final_premium,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          status: 'active',
          paymentFrequency: 'annually',
          nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
          autoRenewal: true,
        });

        // Send notification to customer about policy creation
        if (updatedQuote.user_id) {
          await createNotification({
            userId: updatedQuote.user_id,
            title: "Police d'assurance créée",
            message: `Votre police ${policyNumber} a été créée automatiquement suite à l'approbation de votre devis.`,
            type: 'success',
          });
        }

        console.log(`Policy ${policyNumber} created automatically for approved quote ${updatedQuote.quote_number}`);
      } catch (policyError) {
        console.error('Error creating policy from approved quote:', policyError);
        // Don't fail the quote approval if policy creation fails
        // The quote is still approved, but policy creation failed
      }
    }

    // Send email notification for status changes
    try {
      if (status === 'approved' || status === 'rejected') {
        // Create a mock request object for the email function
        const mockReq = {
          params: { quoteId: id },
          user: { id: req.user.id, role: req.user.role }
        };
        const mockRes = {
          json: (data) => console.log('Email notification result:', data)
        };
        
        await sendQuoteEmail(mockReq, mockRes);
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the main operation if email fails
    }

    res.json({
      success: true,
      message: 'Quote status updated successfully',
      data: updatedQuote,
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({
      message: 'Error updating quote',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get all quotes (admin only)
 */
export async function getAllQuotes(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin role required.',
      });
    }

    const filters = req.query;
    const quotes = await listAllQuotes(filters);

    res.json({
      success: true,
      quotes: quotes,
    });
  } catch (error) {
    console.error('Error getting all quotes:', error);
    res.status(500).json({
      message: 'Error retrieving quotes',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get quote statistics (admin only)
 */
export async function getQuoteStats(req, res) {
  try {
    const userRole = req.user.role;

    // Check admin access
    if (userRole !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin role required.',
      });
    }

    const stats = await getQuoteStatistics();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting quote statistics:', error);
    res.status(500).json({
      message: 'Error retrieving quote statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Delete quote
 */
export async function deleteQuoteById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if quote exists and user has access
    const quote = await findQuoteById(id);
    if (!quote) {
      return res.status(404).json({
        message: 'Quote not found',
      });
    }

    // Check access permissions
    if (userRole !== 'admin' && quote.user_id !== userId) {
      return res.status(403).json({
        message: 'Access denied',
      });
    }

    const success = await deleteQuote(id);
    if (!success) {
      return res.status(500).json({
        message: 'Error deleting quote',
      });
    }

    res.json({
      success: true,
      message: 'Quote deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({
      message: 'Error deleting quote',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get available vehicle brands
 */
export async function getVehicleBrands(req, res) {
  try {
    const { type } = req.params;
    const brands = pricingService.getVehicleBrands(type);

    res.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error('Error getting vehicle brands:', error);
    res.status(500).json({
      message: 'Error retrieving vehicle brands',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get available vehicle models
 */
export async function getVehicleModels(req, res) {
  try {
    const { type, brand } = req.params;
    const models = pricingService.getVehicleModels(brand, type);

    res.json({
      success: true,
      data: models,
    });
  } catch (error) {
    console.error('Error getting vehicle models:', error);
    res.status(500).json({
      message: 'Error retrieving vehicle models',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}

/**
 * Get Moroccan cities
 */
export async function getMoroccanCities(req, res) {
  try {
    const cities = pricingService.getMoroccanCities();

    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error('Error getting Moroccan cities:', error);
    res.status(500).json({
      message: 'Error retrieving cities',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}
