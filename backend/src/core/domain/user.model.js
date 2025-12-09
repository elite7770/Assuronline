import { pool as db } from '../../infrastructure/database/db.js';

export class UserModel {
  // Get user by ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT id, name, email, phone, address, city, postal_code, birth_date, driving_license_number, license_issue_date, last_login, status, role, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Get user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute(
        'SELECT id, name, email, phone, address, city, postal_code, birth_date, driving_license_number, license_issue_date, last_login, status, role, created_at, updated_at FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Get user with password for authentication
  static async findByEmailWithPassword(email) {
    try {
      const [rows] = await db.execute(
        'SELECT id, name, email, phone, address, city, postal_code, birth_date, driving_license_number, license_issue_date, last_login, status, role, password_hash, created_at, updated_at FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email with password:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(id, profileData) {
    try {
      const {
        name,
        email,
        phone,
        address,
        city,
        postal_code,
        birth_date,
        driving_license_number,
        license_issue_date
      } = profileData;

      // Check if email is being changed and if it's already taken
      if (email) {
        const [existingUsers] = await db.execute(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, id]
        );
        if (existingUsers.length > 0) {
          throw new Error('Email already exists');
        }
      }

      const updateFields = [];
      const updateValues = [];

      if (name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (email !== undefined) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }
      if (phone !== undefined) {
        updateFields.push('phone = ?');
        updateValues.push(phone);
      }
      if (address !== undefined) {
        updateFields.push('address = ?');
        updateValues.push(address);
      }
      if (city !== undefined) {
        updateFields.push('city = ?');
        updateValues.push(city);
      }
      if (postal_code !== undefined) {
        updateFields.push('postal_code = ?');
        updateValues.push(postal_code);
      }
      if (birth_date !== undefined) {
        updateFields.push('birth_date = ?');
        updateValues.push(birth_date);
      }
      if (driving_license_number !== undefined) {
        updateFields.push('driving_license_number = ?');
        updateValues.push(driving_license_number);
      }
      if (license_issue_date !== undefined) {
        updateFields.push('license_issue_date = ?');
        updateValues.push(license_issue_date);
      }

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(id);

      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      const [result] = await db.execute(query, updateValues);

      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }

      return await this.findById(id);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Update password
  static async updatePassword(id, newPasswordHash) {
    try {
      const [result] = await db.execute(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newPasswordHash, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }

      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  // Update last login
  static async updateLastLogin(id) {
    try {
      await db.execute(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  // Toggle two-factor authentication (not supported in current schema)
  static async toggleTwoFactor(id, enabled) {
    try {
      // Note: two_factor_enabled column doesn't exist in current database schema
      // This method is kept for API compatibility but doesn't perform any database operation
      // Two-factor authentication toggle requested (not implemented)
      return true;
    } catch (error) {
      console.error('Error toggling two-factor authentication:', error);
      throw error;
    }
  }

  // Get user sessions (for future implementation)
  static async getSessions(_id) {
    try {
      // For now, return mock data with current session
      // In a real implementation, this would query a sessions table
      const currentSession = {
        id: 1,
        device: 'Chrome on Windows',
        location: 'Casablanca, Morocco',
        ip_address: '192.168.1.1',
        last_activity: new Date(),
        is_current: true,
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      };

      // Add some historical sessions
      const historicalSessions = [
        {
          id: 2,
          device: 'Safari on iPhone',
          location: 'Rabat, Morocco',
          ip_address: '192.168.1.2',
          last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          is_current: false,
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
        },
        {
          id: 3,
          device: 'Firefox on Mac',
          location: 'Marrakech, Morocco',
          ip_address: '192.168.1.3',
          last_activity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          is_current: false,
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15) Gecko/20100101 Firefox/91.0'
        }
      ];

      return [currentSession, ...historicalSessions];
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw error;
    }
  }

  // Delete user session (for future implementation)
  static async deleteSession(userId, sessionId) {
    try {
      // This would typically delete from a sessions table
      // For now, just simulate successful deletion
      // Deleting session
      
      // In a real implementation, you would:
      // 1. Verify the session belongs to the user
      // 2. Delete the session from the sessions table
      // 3. Optionally invalidate the session token
      
      return true;
    } catch (error) {
      console.error('Error deleting user session:', error);
      throw error;
    }
  }

  // Admin functions - Get all users with pagination and filtering
  static async getAllUsers(filters = {}) {
    const { 
      status, 
      role, 
      date_from, 
      date_to, 
      search, 
      page = 1, 
      limit = 20 
    } = filters;
    
    let query = `
      SELECT 
        id, name, email, role, status, created_at, last_login,
        phone, address, city, postal_code, birth_date, driving_license_number,
        license_issue_date
      FROM users 
      WHERE 1=1
    `;

    const values = [];

    // Add filters
    if (status) {
      query += ' AND status = ?';
      values.push(status);
    }
    if (role) {
      query += ' AND role = ?';
      values.push(role);
    }
    if (date_from) {
      query += ' AND created_at >= ?';
      values.push(date_from);
    }
    if (date_to) {
      query += ' AND created_at <= ?';
      values.push(date_to);
    }
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR city LIKE ? OR address LIKE ?)';
      const searchPattern = `%${search}%`;
      values.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Add ordering and pagination
    query += ' ORDER BY created_at DESC';
    query += ' LIMIT ? OFFSET ?';
    values.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    try {
      const [rows] = await db.execute(query, values);
      return rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStatistics() {
    try {
      const [totalRows] = await db.execute('SELECT COUNT(*) as total FROM users');
      const [activeRows] = await db.execute('SELECT COUNT(*) as active FROM users WHERE status = "active"');
      const [suspendedRows] = await db.execute('SELECT COUNT(*) as suspended FROM users WHERE status = "suspended"');
      const [pendingRows] = await db.execute('SELECT COUNT(*) as pending FROM users WHERE status = "pending"');
      const [adminRows] = await db.execute('SELECT COUNT(*) as admins FROM users WHERE role = "admin"');
      const [clientRows] = await db.execute('SELECT COUNT(*) as clients FROM users WHERE role = "client"');
      
      // New users this month
      const [newThisMonthRows] = await db.execute(`
        SELECT COUNT(*) as newThisMonth 
        FROM users 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
      `);
      
      // Users who logged in today
      const [lastLoginTodayRows] = await db.execute(`
        SELECT COUNT(*) as lastLoginToday 
        FROM users 
        WHERE last_login >= CURDATE()
      `);

      return {
        total: totalRows[0].total,
        active: activeRows[0].active,
        suspended: suspendedRows[0].suspended,
        pending: pendingRows[0].pending,
        admins: adminRows[0].admins,
        clients: clientRows[0].clients,
        newThisMonth: newThisMonthRows[0].newThisMonth,
        lastLoginToday: lastLoginTodayRows[0].lastLoginToday
      };
    } catch (error) {
      console.error('Error getting user statistics:', error);
      throw error;
    }
  }

  // Update user status
  static async updateUserStatus(userId, status) {
    try {
      const [result] = await db.execute(
        'UPDATE users SET status = ? WHERE id = ?',
        [status, userId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }
      
      return { success: true, message: 'User status updated successfully' };
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(userId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM users WHERE id = ?',
        [userId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }
      
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

// Export individual functions for backward compatibility
export const getAllUsers = UserModel.getAllUsers;
export const getUserStatistics = UserModel.getUserStatistics;
export const updateUserStatus = UserModel.updateUserStatus;
export const getUserById = UserModel.findById;
export const deleteUser = UserModel.deleteUser;