import { pool } from '../../infrastructure/database/db.js';
import { generateId } from '../../shared/utils/id.js';

/**
 * Create a new quote
 */
export async function createQuote(quoteData) {
  const {
    user_id,
    vehicle_id,
  type,
    coverage_type,
    coverage_options,
    base_premium,
    risk_factors,
    final_premium,
    monthly_premium,
    valid_until,
    status = 'pending',
    calculation_details,
    customer_preferences,
    is_urgent = false,
    priority = 'normal'
  } = quoteData;

  const quote_number = `QUO-${new Date().getFullYear()}-${generateId(6)}`;

  const query = `
    INSERT INTO quotes (
      user_id, vehicle_id, quote_number, type, coverage_type, coverage_options,
      base_premium, risk_factors, final_premium, monthly_premium, valid_until,
      status, calculation_details, customer_preferences, is_urgent, priority
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user_id,
    vehicle_id,
    quote_number,
      type,
    coverage_type,
    coverage_options ? JSON.stringify(coverage_options) : null,
    base_premium,
    risk_factors ? JSON.stringify(risk_factors) : null,
    final_premium,
    monthly_premium,
    valid_until,
    status,
    calculation_details ? JSON.stringify(calculation_details) : null,
    customer_preferences ? JSON.stringify(customer_preferences) : null,
    is_urgent,
    priority
  ];

  try {
    const [result] = await pool.execute(query, values);
    return await findQuoteById(result.insertId);
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
}

/**
 * Find quote by ID
 */
export async function findQuoteById(quoteId) {
  const query = `
    SELECT 
      q.*,
      u.name as user_name, u.email as user_email,
      v.brand as vehicle_brand_name, v.model as vehicle_model_name
    FROM quotes q
    LEFT JOIN users u ON q.user_id = u.id
    LEFT JOIN vehicles v ON q.vehicle_id = v.id
    WHERE q.id = ?
  `;

  try {
    const [rows] = await pool.execute(query, [quoteId]);
    if (rows.length === 0) return null;

    const quote = rows[0];
    // Parse JSON fields
    quote.coverage_options = quote.coverage_options ? JSON.parse(quote.coverage_options) : {};
    quote.risk_factors = quote.risk_factors ? JSON.parse(quote.risk_factors) : {};

    return quote;
  } catch (error) {
    console.error('Error finding quote by ID:', error);
    throw error;
  }
}

/**
 * Find quote by quote number
 */
export async function findQuoteByNumber(quoteNumber) {
  const query = `
    SELECT 
      q.*,
      u.first_name, u.last_name, u.email as user_email,
      v.brand as vehicle_brand_name, v.model as vehicle_model_name
    FROM quotes q
    LEFT JOIN users u ON q.user_id = u.id
    LEFT JOIN vehicles v ON q.vehicle_id = v.id
    WHERE q.quote_number = ?
  `;

  try {
    const [rows] = await pool.execute(query, [quoteNumber]);
    if (rows.length === 0) return null;

    const quote = rows[0];
    // Parse JSON fields
    quote.coverage_options = quote.coverage_options ? JSON.parse(quote.coverage_options) : {};
    quote.risk_factors = quote.risk_factors ? JSON.parse(quote.risk_factors) : {};

    return quote;
  } catch (error) {
    console.error('Error finding quote by number:', error);
    throw error;
  }
}

/**
 * List quotes for a user
 */
export async function listUserQuotes(userId, filters = {}) {
  const { status, type, coverageType, page = 1, limit = 20 } = filters;
  
  let query = `
    SELECT 
      q.*,
      u.name as user_name, u.email as user_email,
      v.brand as vehicle_brand_name, v.model as vehicle_model_name
    FROM quotes q
    LEFT JOIN users u ON q.user_id = u.id
    LEFT JOIN vehicles v ON q.vehicle_id = v.id
    WHERE q.user_id = ?
  `;

  const values = [userId];

  // Add filters
  if (status) {
    query += ' AND q.status = ?';
    values.push(status);
  }
  if (type) {
    query += ' AND q.type = ?';
    values.push(type);
  }
  if (coverageType) {
    query += ' AND q.coverage_type = ?';
    values.push(coverageType);
  }

  // Add ordering and pagination
  query += ' ORDER BY q.created_at DESC';
  query += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

  try {
    const [rows] = await pool.execute(query, values);
    
    // Parse JSON fields for each quote
    const quotes = rows.map(quote => ({
      ...quote,
      coverage_options: quote.coverage_options ? JSON.parse(quote.coverage_options) : {},
      risk_factors: quote.risk_factors ? JSON.parse(quote.risk_factors) : {},
    }));

    return quotes;
  } catch (error) {
    console.error('Error listing user quotes:', error);
    throw error;
  }
}

/**
 * List all quotes (admin)
 */
export async function listAllQuotes(filters = {}) {
  const { status, type, coverageType, dateFrom, dateTo, page = 1, limit = 20 } = filters;
  
  let query = `
    SELECT 
      q.*,
      u.name as customer_name, u.email as customer_email,
      v.brand as vehicle_brand_name, v.model as vehicle_model_name
    FROM quotes q
    LEFT JOIN users u ON q.user_id = u.id
    LEFT JOIN vehicles v ON q.vehicle_id = v.id
    WHERE 1=1
  `;

  const values = [];

  // Add filters
  if (status) {
    query += ' AND q.status = ?';
    values.push(status);
  }
  if (type) {
    query += ' AND q.type = ?';
    values.push(type);
  }
  if (coverageType) {
    query += ' AND q.coverage_type = ?';
    values.push(coverageType);
  }
  if (dateFrom) {
    query += ' AND q.created_at >= ?';
    values.push(dateFrom);
  }
  if (dateTo) {
    query += ' AND q.created_at <= ?';
    values.push(dateTo);
  }

  // Add ordering and pagination
  query += ' ORDER BY q.created_at DESC';
  query += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

  try {
    const [rows] = await pool.execute(query, values);
    
    // Parse JSON fields for each quote and add vehicle info from calculation_details
    const quotes = rows.map(quote => {
      let vehicleInfo = {};
      if (quote.calculation_details) {
        try {
          const details = JSON.parse(quote.calculation_details);
          vehicleInfo = {
            vehicle_model: details.vehicleModel || quote.vehicle_model_name || 'N/A',
            vehicle_brand: details.vehicleBrand || quote.vehicle_brand_name || 'N/A',
            vehicle_year: details.vehicleYear || 'N/A',
            vehicle_value: details.vehicleValue || 'N/A'
          };
        } catch (_e) {
          vehicleInfo = {
            vehicle_model: quote.vehicle_model_name || 'N/A',
            vehicle_brand: quote.vehicle_brand_name || 'N/A'
          };
        }
      } else {
        vehicleInfo = {
          vehicle_model: quote.vehicle_model_name || 'N/A',
          vehicle_brand: quote.vehicle_brand_name || 'N/A'
        };
      }

      return {
      ...quote,
        ...vehicleInfo,
      coverage_options: quote.coverage_options ? JSON.parse(quote.coverage_options) : {},
      risk_factors: quote.risk_factors ? JSON.parse(quote.risk_factors) : {},
      };
    });

    return quotes;
  } catch (error) {
    console.error('Error listing all quotes:', error);
    throw error;
  }
}

/**
 * Update quote status
 */
export async function updateQuoteStatus(quoteId, status, adminComment = null) {
  const query = `
    UPDATE quotes 
    SET status = ?, admin_comment = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  try {
    const [result] = await pool.execute(query, [status, adminComment, quoteId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating quote status:', error);
    throw error;
  }
}

/**
 * Get quote statistics
 */
export async function getQuoteStatistics() {
  const queries = [
    'SELECT COUNT(*) as total FROM quotes',
    'SELECT COUNT(*) as pending FROM quotes WHERE status = "pending"',
    'SELECT COUNT(*) as approved FROM quotes WHERE status = "approved"',
    'SELECT COUNT(*) as rejected FROM quotes WHERE status = "rejected"',
    'SELECT COUNT(*) as expired FROM quotes WHERE status = "expired"',
    'SELECT AVG(final_premium) as avg_premium FROM quotes WHERE status = "approved"',
    'SELECT SUM(final_premium) as total_premium FROM quotes WHERE status = "approved"',
  ];

  try {
    const results = await Promise.all(
      queries.map(query => pool.execute(query))
    );

    return {
      total: results[0][0][0].total,
      pending: results[1][0][0].pending,
      approved: results[2][0][0].approved,
      rejected: results[3][0][0].rejected,
      expired: results[4][0][0].expired,
      avgPremium: results[5][0][0].avg_premium || 0,
      totalPremium: results[6][0][0].total_premium || 0,
    };
  } catch (error) {
    console.error('Error getting quote statistics:', error);
    throw error;
  }
}

/**
 * Get quotes by date range
 */
export async function getQuotesByDateRange(startDate, endDate) {
  const query = `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count,
      AVG(final_premium) as avg_premium,
      SUM(final_premium) as total_premium
    FROM quotes 
    WHERE created_at BETWEEN ? AND ?
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  try {
    const [rows] = await pool.execute(query, [startDate, endDate]);
  return rows;
  } catch (error) {
    console.error('Error getting quotes by date range:', error);
    throw error;
  }
}

/**
 * Delete quote
 */
export async function deleteQuote(quoteId) {
  const query = 'DELETE FROM quotes WHERE id = ?';

  try {
    const [result] = await pool.execute(query, [quoteId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
}
