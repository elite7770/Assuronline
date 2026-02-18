import { useState, useEffect } from 'react';
import { useTheme } from '../../shared/context/ThemeContext';
import { settingsAPI } from '../../shared/services/api';
import {
  Palette,
  Bell,
  Globe,
  Shield,
  Monitor,
  Moon,
  Sun,
  Volume2,
  Eye,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    // Appearance
    theme: theme,
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
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState(null);

  // Load settings from backend
  useEffect(() => {
    loadSettings();
  }, []);

  // Sync theme context with settings
  useEffect(() => {
    if (settings.theme && settings.theme !== theme) {
      console.log('Syncing theme context with settings:', settings.theme);
      setTheme(settings.theme);
    }
  }, [settings.theme, theme, setTheme]);

  // Apply font size and compact mode classes to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing font size classes
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');

    // Add current font size class
    if (settings.font_size) {
      root.classList.add(`font-size-${settings.font_size}`);
    }

    // Apply compact mode
    if (settings.compact_mode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }

    // Cleanup on unmount
    return () => {
      root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'compact-mode');
    };
  }, [settings.font_size, settings.compact_mode]);

  // Check for changes
  useEffect(() => {
    if (originalSettings) {
      const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      setHasChanges(hasChanges);
    }
  }, [settings, originalSettings]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsAPI.get();
      const loadedSettings = response.data.data;

      setSettings(loadedSettings);
      setOriginalSettings(loadedSettings);

      // Apply theme from backend settings
      if (loadedSettings.theme && loadedSettings.theme !== theme) {
        setTheme(loadedSettings.theme);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setErrorMessage('Failed to load settings. Using default values.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Clear messages when user makes changes
    setSuccessMessage('');
    setErrorMessage('');

    // Special handling for theme changes
    if (key === 'theme') {
      console.log('🎨 Theme changing to:', value);
      console.log('🎨 Current theme context:', theme);
      // Apply theme immediately
      setTheme(value);
      console.log('🎨 Theme set, new value should be:', value);
      // Auto-save theme changes
      setTimeout(() => {
        handleAutoSave(key, value);
      }, 100);
    }

    // Auto-save certain settings immediately
    const autoSaveSettings = ['font_size', 'compact_mode', 'high_contrast', 'reduced_motion'];
    if (autoSaveSettings.includes(key)) {
      // Debounce auto-save to avoid too many API calls
      setTimeout(() => {
        handleAutoSave(key, value);
      }, 500);
    }
  };

  const handleAutoSave = async (key, value) => {
    try {
      await settingsAPI.update({ [key]: value });
      // Update original settings to reflect the change
      setOriginalSettings(prev => ({
        ...prev,
        [key]: value
      }));
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Don't show error for auto-save failures
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');

      // Validate settings before saving
      const validationErrors = validateSettings(settings);
      if (validationErrors.length > 0) {
        setErrorMessage(`Validation errors: ${validationErrors.join(', ')}`);
        return;
      }

      const response = await settingsAPI.update(settings);

      if (response.data.success) {
        setOriginalSettings({ ...settings });
        setHasChanges(false);
        setSuccessMessage('Settings saved successfully!');

        // Apply theme change immediately if it changed
        if (settings.theme !== theme) {
          setTheme(settings.theme);
        }

        // Apply font size and compact mode immediately
        applySettingsToDOM(settings);

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save settings. Please try again.';
      setErrorMessage(errorMessage);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const validateSettings = (settings) => {
    const errors = [];

    // Validate volume range
    if (settings.volume < 0 || settings.volume > 100) {
      errors.push('Volume must be between 0 and 100');
    }

    // Validate theme
    if (!['light', 'dark', 'auto'].includes(settings.theme)) {
      errors.push('Invalid theme selection');
    }

    // Validate font size
    if (!['small', 'medium', 'large'].includes(settings.font_size)) {
      errors.push('Invalid font size selection');
    }

    // Validate language
    if (!['fr', 'en', 'ar'].includes(settings.language)) {
      errors.push('Invalid language selection');
    }

    // Validate currency
    if (!['MAD', 'EUR', 'USD'].includes(settings.currency)) {
      errors.push('Invalid currency selection');
    }

    return errors;
  };

  const applySettingsToDOM = (settings) => {
    const root = document.documentElement;

    // Remove existing font size classes
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');

    // Add current font size class
    if (settings.font_size) {
      root.classList.add(`font-size-${settings.font_size}`);
    }

    // Apply compact mode
    if (settings.compact_mode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }

    // Apply high contrast
    if (settings.high_contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (settings.reduced_motion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      try {
        setIsSaving(true);
        setErrorMessage('');

        const response = await settingsAPI.reset();

        if (response.data.success) {
          const defaultSettings = response.data.data;

          setSettings(defaultSettings);
          setOriginalSettings(defaultSettings);
          setHasChanges(false);
          setSuccessMessage('Settings reset to default successfully!');

          // Apply theme change immediately
          if (defaultSettings.theme !== theme) {
            setTheme(defaultSettings.theme);
          }

          // Apply all settings to DOM
          applySettingsToDOM(defaultSettings);

          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          throw new Error(response.data.message || 'Failed to reset settings');
        }
      } catch (error) {
        console.error('Error resetting settings:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to reset settings. Please try again.';
        setErrorMessage(errorMessage);
        setTimeout(() => setErrorMessage(''), 5000);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const SettingCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );

  const SelectOption = ({ label, value, options, onChange, description }) => (
    <div className="py-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{description}</p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Customize your application preferences and account settings
          </p>
        </div>


        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <p className="text-green-800 dark:text-green-200">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-slate-600 dark:text-slate-400">Loading settings...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Appearance Settings */}
              <SettingCard title="Appearance" icon={Palette}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                        className={`p-3 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${settings.theme === 'light'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-md'
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        <span className="font-medium">Light</span>
                      </button>
                      <button
                        onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                        className={`p-3 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${settings.theme === 'dark'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-md'
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        <span className="font-medium">Dark</span>
                      </button>
                      <button
                        onClick={() => handleSettingChange('appearance', 'theme', 'auto')}
                        className={`p-3 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${settings.theme === 'auto'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-md'
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        <span className="font-medium">Auto</span>
                      </button>
                    </div>

                    {/* Theme Status Indicator */}
                    <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Current theme: <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">{settings.theme}</span>
                        {settings.theme === 'auto' && (
                          <span className="ml-2 text-xs">
                            (System: {window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <SelectOption
                    label="Font Size"
                    value={settings.font_size}
                    options={[
                      { value: 'small', label: 'Small' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'large', label: 'Large' }
                    ]}
                    onChange={(value) => handleSettingChange('appearance', 'font_size', value)}
                    description="Adjust the text size throughout the application"
                  />

                  <ToggleSwitch
                    enabled={settings.compact_mode}
                    onChange={(value) => handleSettingChange('appearance', 'compact_mode', value)}
                    label="Compact Mode"
                    description="Reduce spacing and padding for a more compact interface"
                  />
                </div>
              </SettingCard>

              {/* Notifications Settings */}
              <SettingCard title="Notifications" icon={Bell}>
                <div className="space-y-4">
                  <ToggleSwitch
                    enabled={settings.email_notifications}
                    onChange={(value) => handleSettingChange('notifications', 'email_notifications', value)}
                    label="Email Notifications"
                    description="Receive important updates via email"
                  />

                  <ToggleSwitch
                    enabled={settings.push_notifications}
                    onChange={(value) => handleSettingChange('notifications', 'push_notifications', value)}
                    label="Push Notifications"
                    description="Get real-time notifications in your browser"
                  />

                  <ToggleSwitch
                    enabled={settings.sms_notifications}
                    onChange={(value) => handleSettingChange('notifications', 'sms_notifications', value)}
                    label="SMS Notifications"
                    description="Receive critical alerts via SMS"
                  />

                  <ToggleSwitch
                    enabled={settings.marketing_emails}
                    onChange={(value) => handleSettingChange('notifications', 'marketing_emails', value)}
                    label="Marketing Emails"
                    description="Receive promotional content and updates"
                  />
                </div>
              </SettingCard>

              {/* Privacy Settings */}
              <SettingCard title="Privacy & Security" icon={Shield}>
                <div className="space-y-4">
                  <SelectOption
                    label="Profile Visibility"
                    value={settings.profile_visibility}
                    options={[
                      { value: 'public', label: 'Public' },
                      { value: 'private', label: 'Private' },
                      { value: 'friends', label: 'Friends Only' }
                    ]}
                    onChange={(value) => handleSettingChange('privacy', 'profile_visibility', value)}
                    description="Control who can see your profile information"
                  />

                  <ToggleSwitch
                    enabled={settings.data_sharing}
                    onChange={(value) => handleSettingChange('privacy', 'data_sharing', value)}
                    label="Data Sharing"
                    description="Allow sharing of anonymized data for research"
                  />

                  <ToggleSwitch
                    enabled={settings.analytics_enabled}
                    onChange={(value) => handleSettingChange('privacy', 'analytics_enabled', value)}
                    label="Analytics"
                    description="Help improve the application by sharing usage data"
                  />
                </div>
              </SettingCard>

              {/* Language & Region */}
              <SettingCard title="Language & Region" icon={Globe}>
                <div className="space-y-4">
                  <SelectOption
                    label="Language"
                    value={settings.language}
                    options={[
                      { value: 'fr', label: 'Français' },
                      { value: 'en', label: 'English' },
                      { value: 'ar', label: 'العربية' }
                    ]}
                    onChange={(value) => handleSettingChange('language', 'language', value)}
                  />

                  <SelectOption
                    label="Timezone"
                    value={settings.timezone}
                    options={[
                      { value: 'Africa/Casablanca', label: 'Casablanca (GMT+1)' },
                      { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
                      { value: 'UTC', label: 'UTC (GMT+0)' }
                    ]}
                    onChange={(value) => handleSettingChange('language', 'timezone', value)}
                  />

                  <SelectOption
                    label="Currency"
                    value={settings.currency}
                    options={[
                      { value: 'MAD', label: 'Moroccan Dirham (MAD)' },
                      { value: 'EUR', label: 'Euro (EUR)' },
                      { value: 'USD', label: 'US Dollar (USD)' }
                    ]}
                    onChange={(value) => handleSettingChange('language', 'currency', value)}
                  />

                  <SelectOption
                    label="Date Format"
                    value={settings.date_format}
                    options={[
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                    ]}
                    onChange={(value) => handleSettingChange('language', 'date_format', value)}
                  />
                </div>
              </SettingCard>

              {/* Accessibility */}
              <SettingCard title="Accessibility" icon={Eye}>
                <div className="space-y-4">
                  <ToggleSwitch
                    enabled={settings.high_contrast}
                    onChange={(value) => handleSettingChange('accessibility', 'high_contrast', value)}
                    label="High Contrast"
                    description="Increase contrast for better visibility"
                  />

                  <ToggleSwitch
                    enabled={settings.reduced_motion}
                    onChange={(value) => handleSettingChange('accessibility', 'reduced_motion', value)}
                    label="Reduce Motion"
                    description="Minimize animations and transitions"
                  />

                  <ToggleSwitch
                    enabled={settings.screen_reader}
                    onChange={(value) => handleSettingChange('accessibility', 'screen_reader', value)}
                    label="Screen Reader Support"
                    description="Optimize interface for screen readers"
                  />
                </div>
              </SettingCard>

              {/* Sound Settings */}
              <SettingCard title="Sound" icon={Volume2}>
                <div className="space-y-4">
                  <ToggleSwitch
                    enabled={settings.sound_enabled}
                    onChange={(value) => handleSettingChange('sound', 'sound_enabled', value)}
                    label="Enable Sounds"
                    description="Play notification sounds"
                  />

                  {settings.sound_enabled && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Volume: {settings.volume}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.volume}
                        onChange={(e) => handleSettingChange('sound', 'volume', parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </SettingCard>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600 mr-2"></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </>
                )}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
