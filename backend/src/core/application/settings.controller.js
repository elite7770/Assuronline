import { pool as db } from '../../infrastructure/database/db.js';

/**
 * Get user settings
 */
export const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user settings from database using MySQL2 syntax
    const [rows] = await db.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      // Return default settings if none exist
      return res.json({
        success: true,
        data: getDefaultSettings()
      });
    }
    
    const settings = rows[0];
    
    res.json({
      success: true,
      data: {
        // Appearance
        theme: settings.theme || 'light',
        font_size: settings.font_size || 'medium',
        compact_mode: settings.compact_mode || false,
        
        // Notifications
        email_notifications: settings.email_notifications || true,
        push_notifications: settings.push_notifications || true,
        sms_notifications: settings.sms_notifications || false,
        marketing_emails: settings.marketing_emails || false,
        
        // Privacy
        profile_visibility: settings.profile_visibility || 'private',
        data_sharing: settings.data_sharing || false,
        analytics_enabled: settings.analytics_enabled || true,
        
        // Language & Region
        language: settings.language || 'fr',
        timezone: settings.timezone || 'Africa/Casablanca',
        currency: settings.currency || 'MAD',
        date_format: settings.date_format || 'DD/MM/YYYY',
        
        // Accessibility
        high_contrast: settings.high_contrast || false,
        reduced_motion: settings.reduced_motion || false,
        screen_reader: settings.screen_reader || false,
        
        // Sound
        sound_enabled: settings.sound_enabled || true,
        volume: settings.volume || 70
      }
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get settings'
    });
  }
};

/**
 * Update user settings
 */
export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settingsData = req.body;
    
    // Validate input - at least one field must be provided
    const allowedFields = [
      'theme', 'font_size', 'compact_mode',
      'email_notifications', 'push_notifications', 'sms_notifications', 'marketing_emails',
      'profile_visibility', 'data_sharing', 'analytics_enabled',
      'language', 'timezone', 'currency', 'date_format',
      'high_contrast', 'reduced_motion', 'screen_reader',
      'sound_enabled', 'volume'
    ];
    
    const hasValidField = allowedFields.some(field => settingsData.hasOwnProperty(field));
    if (!hasValidField) {
      return res.status(400).json({
        success: false,
        message: 'At least one valid setting must be provided'
      });
    }
    
    // Check if settings exist
    const [existingRows] = await db.execute(
      'SELECT id FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    const updateData = {
      ...settingsData,
      updated_at: new Date()
    };
    
    if (existingRows.length > 0) {
      // Update existing settings
      const updateFields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const updateValues = Object.values(updateData);
      updateValues.push(userId);
      
      await db.execute(
        `UPDATE user_settings SET ${updateFields} WHERE user_id = ?`,
        updateValues
      );
    } else {
      // Create new settings
      const insertData = {
        user_id: userId,
        ...updateData,
        created_at: new Date()
      };
      
      const insertFields = Object.keys(insertData).join(', ');
      const insertValues = Object.values(insertData);
      const placeholders = Object.keys(insertData).map(() => '?').join(', ');
      
      await db.execute(
        `INSERT INTO user_settings (${insertFields}) VALUES (${placeholders})`,
        insertValues
      );
    }
    
    // Get updated settings
    const [updatedRows] = await db.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [userId]
    );
    const updatedSettings = updatedRows[0];
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        // Appearance
        theme: updatedSettings.theme || 'light',
        font_size: updatedSettings.font_size || 'medium',
        compact_mode: updatedSettings.compact_mode || false,
        
        // Notifications
        email_notifications: updatedSettings.email_notifications || true,
        push_notifications: updatedSettings.push_notifications || true,
        sms_notifications: updatedSettings.sms_notifications || false,
        marketing_emails: updatedSettings.marketing_emails || false,
        
        // Privacy
        profile_visibility: updatedSettings.profile_visibility || 'private',
        data_sharing: updatedSettings.data_sharing || false,
        analytics_enabled: updatedSettings.analytics_enabled || true,
        
        // Language & Region
        language: updatedSettings.language || 'fr',
        timezone: updatedSettings.timezone || 'Africa/Casablanca',
        currency: updatedSettings.currency || 'MAD',
        date_format: updatedSettings.date_format || 'DD/MM/YYYY',
        
        // Accessibility
        high_contrast: updatedSettings.high_contrast || false,
        reduced_motion: updatedSettings.reduced_motion || false,
        screen_reader: updatedSettings.screen_reader || false,
        
        // Sound
        sound_enabled: updatedSettings.sound_enabled || true,
        volume: updatedSettings.volume || 70
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

/**
 * Update specific category of settings
 */
export const updateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.params;
    const categoryData = req.body;
    
    // Validate category
    const validCategories = ['notifications', 'preferences', 'privacy'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of: notifications, preferences, privacy'
      });
    }
    
    // Get existing settings
    const [existingRows] = await db.execute(
      'SELECT id FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    if (existingRows.length === 0) {
      // Create new settings with default values
      const defaultSettings = getDefaultSettings();
      const newSettings = {
        user_id: userId,
        theme: defaultSettings.theme,
        language: defaultSettings.language,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Update the specific category
      newSettings[category] = JSON.stringify(categoryData);
      
      const insertFields = Object.keys(newSettings).join(', ');
      const insertValues = Object.values(newSettings);
      const placeholders = Object.keys(newSettings).map(() => '?').join(', ');
      
      await db.execute(
        `INSERT INTO user_settings (${insertFields}) VALUES (${placeholders})`,
        insertValues
      );
    } else {
      // Update existing category
      const updateData = {
        [category]: JSON.stringify(categoryData),
        updated_at: new Date()
      };
      
      const updateFields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const updateValues = Object.values(updateData);
      updateValues.push(userId);
      
      await db.execute(
        `UPDATE user_settings SET ${updateFields} WHERE user_id = ?`,
        updateValues
      );
    }
    
    res.json({
      success: true,
      message: `${category} settings updated successfully`,
      data: categoryData
    });
  } catch (error) {
    console.error('Error updating category settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category settings'
    });
  }
};

/**
 * Reset settings to default
 */
export const resetSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const defaultSettings = getDefaultSettings();
    
    const settingsData = {
      user_id: userId,
      theme: defaultSettings.theme,
      font_size: defaultSettings.font_size,
      compact_mode: defaultSettings.compact_mode,
      email_notifications: defaultSettings.email_notifications,
      push_notifications: defaultSettings.push_notifications,
      sms_notifications: defaultSettings.sms_notifications,
      marketing_emails: defaultSettings.marketing_emails,
      profile_visibility: defaultSettings.profile_visibility,
      data_sharing: defaultSettings.data_sharing,
      analytics_enabled: defaultSettings.analytics_enabled,
      language: defaultSettings.language,
      timezone: defaultSettings.timezone,
      currency: defaultSettings.currency,
      date_format: defaultSettings.date_format,
      high_contrast: defaultSettings.high_contrast,
      reduced_motion: defaultSettings.reduced_motion,
      screen_reader: defaultSettings.screen_reader,
      sound_enabled: defaultSettings.sound_enabled,
      volume: defaultSettings.volume,
      updated_at: new Date()
    };
    
    // Check if settings exist
    const [existingRows] = await db.execute(
      'SELECT id FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    if (existingRows.length > 0) {
      // Update existing settings
      const updateFields = Object.keys(settingsData).map(key => `${key} = ?`).join(', ');
      const updateValues = Object.values(settingsData);
      updateValues.push(userId);
      
      await db.execute(
        `UPDATE user_settings SET ${updateFields} WHERE user_id = ?`,
        updateValues
      );
    } else {
      // Create new settings
      settingsData.created_at = new Date();
      
      const insertFields = Object.keys(settingsData).join(', ');
      const insertValues = Object.values(settingsData);
      const placeholders = Object.keys(settingsData).map(() => '?').join(', ');
      
      await db.execute(
        `INSERT INTO user_settings (${insertFields}) VALUES (${placeholders})`,
        insertValues
      );
    }
    
    res.json({
      success: true,
      message: 'Settings reset to default successfully',
      data: defaultSettings
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings'
    });
  }
};

/**
 * Get default settings
 */
export const getDefaultSettings = () => {
  return {
    // Appearance
    theme: 'light',
    font_size: 'medium',
    compact_mode: false,
    
    // Notifications
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    marketing_emails: false,
    
    // Privacy
      profile_visibility: 'private',
    data_sharing: false,
    analytics_enabled: true,
    
    // Language & Region
    language: 'fr',
    timezone: 'Africa/Casablanca',
    currency: 'MAD',
    date_format: 'DD/MM/YYYY',
    
    // Accessibility
    high_contrast: false,
    reduced_motion: false,
    screen_reader: false,
    
    // Sound
    sound_enabled: true,
    volume: 70
  };
};
