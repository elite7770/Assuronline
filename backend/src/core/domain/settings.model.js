import { pool } from '../../infrastructure/database/db.js';

export class SettingsModel {
  // Get user settings by user ID
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM user_settings WHERE user_id = ?',
        [userId]
      );
      
      if (rows.length === 0) {
        // Return default settings if none exist
        return this.getDefaultSettings(userId);
      }
      
      return rows[0];
    } catch (error) {
      console.error('Error finding user settings:', error);
      throw error;
    }
  }

  // Create or update user settings
  static async upsert(userId, settings) {
    try {
      // Check if settings exist
      const existingSettings = await this.findByUserId(userId);
      
      if (existingSettings.id) {
        // Update existing settings
        const updateFields = [];
        const updateValues = [];
        
        Object.keys(settings).forEach(key => {
          if (settings[key] !== undefined) {
            updateFields.push(`${key} = ?`);
            updateValues.push(settings[key]);
          }
        });
        
        if (updateFields.length === 0) {
          return existingSettings;
        }
        
        updateValues.push(userId);
        
        await pool.query(
          `UPDATE user_settings SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
          updateValues
        );
        
        return await this.findByUserId(userId);
      } else {
        // Create new settings
        const fields = ['user_id', ...Object.keys(settings)];
        const values = [userId, ...Object.values(settings)];
        const placeholders = fields.map(() => '?').join(', ');
        
        await pool.query(
          `INSERT INTO user_settings (${fields.join(', ')}) VALUES (${placeholders})`,
          values
        );
        
        return await this.findByUserId(userId);
      }
    } catch (error) {
      console.error('Error upserting user settings:', error);
      throw error;
    }
  }

  // Update specific setting category
  static async updateCategory(userId, category, settings) {
    try {
      const updateFields = [];
      const updateValues = [];
      
      Object.keys(settings).forEach(key => {
        if (settings[key] !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(settings[key]);
        }
      });
      
      if (updateFields.length === 0) {
        return await this.findByUserId(userId);
      }
      
      updateValues.push(userId);
      
      await pool.query(
        `UPDATE user_settings SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
        updateValues
      );
      
      return await this.findByUserId(userId);
    } catch (error) {
      console.error('Error updating settings category:', error);
      throw error;
    }
  }

  // Reset settings to default
  static async resetToDefault(userId) {
    try {
      const defaultSettings = this.getDefaultSettings(userId);
      
      // Remove user_id from the settings object
      const { user_id: _, ...settings } = defaultSettings;
      
      return await this.upsert(userId, settings);
    } catch (error) {
      console.error('Error resetting settings to default:', error);
      throw error;
    }
  }

  // Get default settings
  static getDefaultSettings(userId) {
    return {
      user_id: userId,
      theme: 'auto',
      font_size: 'medium',
      compact_mode: false,
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      marketing_emails: false,
      profile_visibility: 'private',
      data_sharing: false,
      analytics_enabled: true,
      language: 'fr',
      timezone: 'Africa/Casablanca',
      currency: 'MAD',
      date_format: 'DD/MM/YYYY',
      high_contrast: false,
      reduced_motion: false,
      screen_reader: false,
      sound_enabled: true,
      volume: 70
    };
  }

  // Validate settings data
  static validateSettings(settings) {
    const errors = {};
    
    // Theme validation
    if (settings.theme && !['light', 'dark', 'auto'].includes(settings.theme)) {
      errors.theme = 'Theme must be light, dark, or auto';
    }
    
    // Font size validation
    if (settings.font_size && !['small', 'medium', 'large'].includes(settings.font_size)) {
      errors.font_size = 'Font size must be small, medium, or large';
    }
    
    // Profile visibility validation
    if (settings.profile_visibility && !['public', 'private', 'friends'].includes(settings.profile_visibility)) {
      errors.profile_visibility = 'Profile visibility must be public, private, or friends';
    }
    
    // Language validation
    if (settings.language && !['fr', 'en', 'ar'].includes(settings.language)) {
      errors.language = 'Language must be fr, en, or ar';
    }
    
    // Currency validation
    if (settings.currency && !['MAD', 'EUR', 'USD'].includes(settings.currency)) {
      errors.currency = 'Currency must be MAD, EUR, or USD';
    }
    
    // Date format validation
    if (settings.date_format && !['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].includes(settings.date_format)) {
      errors.date_format = 'Date format must be DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD';
    }
    
    // Volume validation
    if (settings.volume !== undefined && (settings.volume < 0 || settings.volume > 100)) {
      errors.volume = 'Volume must be between 0 and 100';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

