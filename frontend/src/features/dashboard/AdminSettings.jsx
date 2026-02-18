import { useEffect, useState, useCallback } from 'react';
import {
  Settings, Save, RotateCcw, AlertCircle, CheckCircle,
  Mail, Eye, EyeOff, Loader2
} from 'lucide-react';
import { settingsAPI } from '../../shared/services/api';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({
    // System Settings
    system: {
      maintenance_mode: false,
      registration_enabled: true,
      email_verification_required: true,
      max_file_size: 10,
      session_timeout: 30,
      backup_frequency: 'daily',
      log_level: 'info',
      debug_mode: false
    },
    // Email Settings
    email: {
      enabled: true,
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_secure: false,
      smtp_user: '',
      smtp_password: '',
      from_email: 'noreply@assuronline.ma',
      from_name: 'AssurOnline',
      reply_to: 'support@assuronline.ma'
    },
    // Security Settings
    security: {
      password_min_length: 8,
      password_require_special: true,
      password_require_numbers: true,
      password_require_uppercase: true,
      max_login_attempts: 5,
      lockout_duration: 15,
      two_factor_enabled: false,
      session_timeout: 30,
      ip_whitelist: '',
      allowed_domains: ''
    },
    // Business Settings
    business: {
      company_name: 'AssurOnline',
      company_email: 'contact@assuronline.ma',
      company_phone: '+212 5XX XXX XXX',
      company_address: 'Avenue Mohammed V, Casablanca, Maroc',
      company_logo: '',
      currency: 'MAD',
      timezone: 'Africa/Casablanca',
      language: 'fr',
      date_format: 'DD/MM/YYYY'
    },
    // Pricing Settings
    pricing: {
      base_rate_auto: 2500,
      base_rate_moto: 1200,
      tax_rate: 0.2,
      discount_annual: 0.05,
      discount_quarterly: 0.02,
      commission_rate: 0.1,
      minimum_premium: 500,
      maximum_premium: 50000
    },
    // Notification Settings
    notifications: {
      email_enabled: true,
      sms_enabled: false,
      push_enabled: false,
      quote_created: true,
      quote_approved: true,
      quote_rejected: true,
      policy_created: true,
      payment_received: true,
      claim_filed: true,
      claim_processed: true
    }
  });
  const [activeTab, setActiveTab] = useState('system');
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'system', name: 'System', icon: Settings, color: 'blue' },
    { id: 'email', name: 'Email', icon: Mail, color: 'green' },
    { id: 'security', name: 'Security', icon: Settings, color: 'red' },
    { id: 'business', name: 'Business', icon: Settings, color: 'purple' },
    { id: 'pricing', name: 'Pricing', icon: Settings, color: 'yellow' },
    { id: 'notifications', name: 'Notifications', icon: Settings, color: 'indigo' }
  ];

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Use settingsAPI
      const response = await settingsAPI.get();

      if (response.data) {
        setSettings(response.data.settings || settings);
      } else {
        throw new Error('Failed to fetch settings');
      }

    } catch (err) {
      console.error('Settings fetch error:', err);
      setError('Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Use settingsAPI
      await settingsAPI.update(settings);

      setSuccess('Settings saved successfully!');
      setHasChanges(false);

      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save settings. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      try {
        setSaving(true);
        setError('');
        setSuccess('');

        // Use settingsAPI
        const response = await settingsAPI.reset();

        if (response.data) {
          setSettings(response.data.settings || settings);
          setSuccess('Settings reset to default!');
          setHasChanges(false);
        } else {
          throw new Error('Failed to reset settings');
        }

        setTimeout(() => setSuccess(''), 3000);

      } catch (err) {
        console.error('Reset error:', err);
        setError('Failed to reset settings. Please try again.');
        setTimeout(() => setError(''), 5000);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleInputChange = (category, key, event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    handleSettingChange(category, key, value);
  };

  const handleNumberChange = (category, key, event) => {
    const value = parseFloat(event.target.value) || 0;
    handleSettingChange(category, key, value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Settings</h1>
            <p className="text-purple-100 text-lg">Configure system-wide settings and preferences</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              disabled={saving}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 disabled:opacity-50 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-900 border border-green-700 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
          <p className="text-green-300">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-300 mr-2" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                      ? `border-${tab.color}-400 text-${tab.color}-300`
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-900 rounded-lg mr-4">
                    <Settings className="h-6 w-6 text-blue-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">System Configuration</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-white">Maintenance Mode</label>
                      <p className="text-sm text-gray-300 mt-1">Enable maintenance mode to restrict access to the system</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.system.maintenance_mode ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      onClick={() => handleSettingChange('system', 'maintenance_mode', !settings.system.maintenance_mode)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.system.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-white">User Registration</label>
                      <p className="text-sm text-gray-300 mt-1">Allow new users to register accounts</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.system.registration_enabled ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      onClick={() => handleSettingChange('system', 'registration_enabled', !settings.system.registration_enabled)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.system.registration_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-white">Email Verification Required</label>
                      <p className="text-sm text-gray-300 mt-1">Require email verification for new accounts</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.system.email_verification_required ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      onClick={() => handleSettingChange('system', 'email_verification_required', !settings.system.email_verification_required)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.system.email_verification_required ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Max File Size (MB)</label>
                      <input
                        type="number"
                        value={settings.system.max_file_size}
                        onChange={(e) => handleNumberChange('system', 'max_file_size', e)}
                        min="1"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      />
                      <p className="text-sm text-gray-300">Maximum file size for uploads</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.system.session_timeout}
                        onChange={(e) => handleNumberChange('system', 'session_timeout', e)}
                        min="5"
                        max="480"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      />
                      <p className="text-sm text-gray-300">User session timeout duration</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Backup Frequency</label>
                      <select
                        value={settings.system.backup_frequency}
                        onChange={(e) => handleSettingChange('system', 'backup_frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      <p className="text-sm text-gray-300">How often to backup system data</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Log Level</label>
                      <select
                        value={settings.system.log_level}
                        onChange={(e) => handleSettingChange('system', 'log_level', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                      >
                        <option value="debug">Debug</option>
                        <option value="info">Info</option>
                        <option value="warn">Warning</option>
                        <option value="error">Error</option>
                      </select>
                      <p className="text-sm text-gray-300">System logging level</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-white">Debug Mode</label>
                      <p className="text-sm text-gray-300 mt-1">Enable debug mode for development</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.system.debug_mode ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      onClick={() => handleSettingChange('system', 'debug_mode', !settings.system.debug_mode)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.system.debug_mode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-green-900 rounded-lg mr-4">
                    <Mail className="h-6 w-6 text-green-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Email Configuration</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-white">Enable Email</label>
                      <p className="text-sm text-gray-300 mt-1">Enable email notifications and communications</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.email.enabled ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      onClick={() => handleSettingChange('email', 'enabled', !settings.email.enabled)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.email.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">SMTP Host</label>
                      <input
                        type="text"
                        value={settings.email.smtp_host}
                        onChange={(e) => handleInputChange('email', 'smtp_host', e)}
                        placeholder="smtp.gmail.com"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      />
                      <p className="text-sm text-gray-300">SMTP server hostname</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">SMTP Port</label>
                      <input
                        type="number"
                        value={settings.email.smtp_port}
                        onChange={(e) => handleNumberChange('email', 'smtp_port', e)}
                        min="1"
                        max="65535"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      />
                      <p className="text-sm text-gray-300">SMTP server port</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">SMTP Username</label>
                      <input
                        type="email"
                        value={settings.email.smtp_user}
                        onChange={(e) => handleInputChange('email', 'smtp_user', e)}
                        placeholder="admin@assuronline.ma"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      />
                      <p className="text-sm text-gray-300">SMTP authentication username</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">SMTP Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={settings.email.smtp_password}
                          onChange={(e) => handleInputChange('email', 'smtp_password', e)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-300">SMTP authentication password</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">From Email</label>
                      <input
                        type="email"
                        value={settings.email.from_email}
                        onChange={(e) => handleInputChange('email', 'from_email', e)}
                        placeholder="noreply@assuronline.ma"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      />
                      <p className="text-sm text-gray-300">Default sender email address</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">From Name</label>
                      <input
                        type="text"
                        value={settings.email.from_name}
                        onChange={(e) => handleInputChange('email', 'from_name', e)}
                        placeholder="AssurOnline"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      />
                      <p className="text-sm text-gray-300">Default sender name</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">Reply To Email</label>
                    <input
                      type="email"
                      value={settings.email.reply_to}
                      onChange={(e) => handleInputChange('email', 'reply_to', e)}
                      placeholder="support@assuronline.ma"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                    />
                    <p className="text-sm text-gray-300">Email address for replies</p>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-white">Use SSL/TLS</label>
                      <p className="text-sm text-gray-300 mt-1">Enable secure connection for SMTP</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.email.smtp_secure ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      onClick={() => handleSettingChange('email', 'smtp_secure', !settings.email.smtp_secure)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.email.smtp_secure ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-red-900 rounded-lg mr-4">
                    <Settings className="h-6 w-6 text-red-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Security Configuration</h3>
                </div>
                <div className="space-y-6">
                  {/* Password Requirements */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Password Requirements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Minimum Password Length</label>
                        <input
                          type="number"
                          min="6"
                          max="32"
                          value={settings.security.password_min_length}
                          onChange={(e) => handleNumberChange('security', 'password_min_length', e)}
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Minimum characters required (6-32)</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-white">Require Special Characters</label>
                            <p className="text-sm text-gray-300">Must include !@#$%^&*()</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSettingChange('security', 'password_require_special', !settings.security.password_require_special)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.password_require_special ? 'bg-red-600' : 'bg-gray-600'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security.password_require_special ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-white">Require Numbers</label>
                            <p className="text-sm text-gray-300">Must include 0-9</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSettingChange('security', 'password_require_numbers', !settings.security.password_require_numbers)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.password_require_numbers ? 'bg-red-600' : 'bg-gray-600'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security.password_require_numbers ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-white">Require Uppercase</label>
                            <p className="text-sm text-gray-300">Must include A-Z</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSettingChange('security', 'password_require_uppercase', !settings.security.password_require_uppercase)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.password_require_uppercase ? 'bg-red-600' : 'bg-gray-600'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security.password_require_uppercase ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Login Security */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Login Security</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Max Login Attempts</label>
                        <input
                          type="number"
                          min="3"
                          max="10"
                          value={settings.security.max_login_attempts}
                          onChange={(e) => handleNumberChange('security', 'max_login_attempts', e)}
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Failed attempts before lockout (3-10)</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Lockout Duration (minutes)</label>
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={settings.security.lockout_duration}
                          onChange={(e) => handleNumberChange('security', 'lockout_duration', e)}
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Account lockout duration (5-60 minutes)</p>
                      </div>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-white">Enable 2FA</label>
                        <p className="text-sm text-gray-300">Require additional verification for login</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSettingChange('security', 'two_factor_enabled', !settings.security.two_factor_enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.two_factor_enabled ? 'bg-red-600' : 'bg-gray-600'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security.two_factor_enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* IP Whitelist */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Access Control</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">IP Whitelist</label>
                        <textarea
                          value={settings.security.ip_whitelist}
                          onChange={(e) => handleInputChange('security', 'ip_whitelist', e)}
                          placeholder="192.168.1.1, 10.0.0.1"
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Comma-separated IP addresses (leave empty for no restriction)</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Allowed Domains</label>
                        <textarea
                          value={settings.security.allowed_domains}
                          onChange={(e) => handleInputChange('security', 'allowed_domains', e)}
                          placeholder="company.com, partner.com"
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Comma-separated email domains (leave empty for no restriction)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Settings */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-purple-900 rounded-lg mr-4">
                    <Settings className="h-6 w-6 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Business Configuration</h3>
                </div>
                <div className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Company Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Company Name</label>
                        <input
                          type="text"
                          value={settings.business.company_name}
                          onChange={(e) => handleInputChange('business', 'company_name', e)}
                          placeholder="AssurOnline"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Official company name</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Company Email</label>
                        <input
                          type="email"
                          value={settings.business.company_email}
                          onChange={(e) => handleInputChange('business', 'company_email', e)}
                          placeholder="contact@assuronline.ma"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Primary business email address</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Company Phone</label>
                        <input
                          type="tel"
                          value={settings.business.company_phone}
                          onChange={(e) => handleInputChange('business', 'company_phone', e)}
                          placeholder="+212 5XX XXX XXX"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Business contact phone number</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Company Address</label>
                        <textarea
                          value={settings.business.company_address}
                          onChange={(e) => handleInputChange('business', 'company_address', e)}
                          placeholder="Avenue Mohammed V, Casablanca, Maroc"
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Full business address</p>
                      </div>
                    </div>
                  </div>

                  {/* Branding & Identity */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Branding & Identity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Company Logo URL</label>
                        <input
                          type="url"
                          value={settings.business.company_logo}
                          onChange={(e) => handleInputChange('business', 'company_logo', e)}
                          placeholder="https://example.com/logo.png"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">URL to company logo image</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Currency</label>
                        <select
                          value={settings.business.currency}
                          onChange={(e) => handleInputChange('business', 'currency', e)}
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                        >
                          <option value="MAD">MAD (Moroccan Dirham)</option>
                          <option value="EUR">EUR (Euro)</option>
                          <option value="USD">USD (US Dollar)</option>
                          <option value="GBP">GBP (British Pound)</option>
                        </select>
                        <p className="text-sm text-gray-300">Default currency for pricing</p>
                      </div>
                    </div>
                  </div>

                  {/* Localization */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Localization</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Timezone</label>
                        <select
                          value={settings.business.timezone}
                          onChange={(e) => handleInputChange('business', 'timezone', e)}
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                        >
                          <option value="Africa/Casablanca">Africa/Casablanca</option>
                          <option value="Europe/Paris">Europe/Paris</option>
                          <option value="Europe/London">Europe/London</option>
                          <option value="America/New_York">America/New_York</option>
                          <option value="UTC">UTC</option>
                        </select>
                        <p className="text-sm text-gray-300">Business timezone</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Language</label>
                        <select
                          value={settings.business.language}
                          onChange={(e) => handleInputChange('business', 'language', e)}
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="ar">العربية</option>
                          <option value="es">Español</option>
                        </select>
                        <p className="text-sm text-gray-300">Default system language</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Date Format</label>
                        <select
                          value={settings.business.date_format}
                          onChange={(e) => handleInputChange('business', 'date_format', e)}
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                        </select>
                        <p className="text-sm text-gray-300">Date display format</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Business Hours</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Opening Time</label>
                        <input
                          type="time"
                          value="09:00"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                        />
                        <p className="text-sm text-gray-300">Business opening time</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Closing Time</label>
                        <input
                          type="time"
                          value="18:00"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                        />
                        <p className="text-sm text-gray-300">Business closing time</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Support Email</label>
                        <input
                          type="email"
                          placeholder="support@assuronline.ma"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Customer support email</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Sales Email</label>
                        <input
                          type="email"
                          placeholder="sales@assuronline.ma"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Sales inquiries email</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Settings */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-yellow-900 rounded-lg mr-4">
                    <Settings className="h-6 w-6 text-yellow-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Pricing Configuration</h3>
                </div>
                <div className="space-y-6">
                  {/* Base Rates */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Base Insurance Rates</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Auto Insurance Base Rate</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">MAD</span>
                          <input
                            type="number"
                            min="500"
                            max="50000"
                            value={settings.pricing.base_rate_auto}
                            onChange={(e) => handleNumberChange('pricing', 'base_rate_auto', e)}
                            className="w-full pl-12 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                        <p className="text-sm text-gray-300">Base premium for auto insurance (500-50,000 MAD)</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Motorcycle Insurance Base Rate</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">MAD</span>
                          <input
                            type="number"
                            min="200"
                            max="25000"
                            value={settings.pricing.base_rate_moto}
                            onChange={(e) => handleNumberChange('pricing', 'base_rate_moto', e)}
                            className="w-full pl-12 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                        <p className="text-sm text-gray-300">Base premium for motorcycle insurance (200-25,000 MAD)</p>
                      </div>
                    </div>
                  </div>

                  {/* Tax & Fees */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Taxes & Fees</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Tax Rate (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            step="0.1"
                            value={settings.pricing.tax_rate * 100}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) / 100;
                              handleNumberChange('pricing', 'tax_rate', { target: { value: value.toString() } });
                            }}
                            className="w-full pr-8 pl-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                        </div>
                        <p className="text-sm text-gray-300">Tax rate applied to premiums (0-50%)</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Commission Rate (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            step="0.1"
                            value={settings.pricing.commission_rate * 100}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) / 100;
                              handleNumberChange('pricing', 'commission_rate', { target: { value: value.toString() } });
                            }}
                            className="w-full pr-8 pl-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                        </div>
                        <p className="text-sm text-gray-300">Agent commission rate (0-30%)</p>
                      </div>
                    </div>
                  </div>

                  {/* Discounts */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Discounts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Annual Payment Discount (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            value={settings.pricing.discount_annual * 100}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) / 100;
                              handleNumberChange('pricing', 'discount_annual', { target: { value: value.toString() } });
                            }}
                            className="w-full pr-8 pl-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                        </div>
                        <p className="text-sm text-gray-300">Discount for annual payment (0-20%)</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Quarterly Payment Discount (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={settings.pricing.discount_quarterly * 100}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) / 100;
                              handleNumberChange('pricing', 'discount_quarterly', { target: { value: value.toString() } });
                            }}
                            className="w-full pr-8 pl-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                        </div>
                        <p className="text-sm text-gray-300">Discount for quarterly payment (0-10%)</p>
                      </div>
                    </div>
                  </div>

                  {/* Premium Limits */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Premium Limits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Minimum Premium</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">MAD</span>
                          <input
                            type="number"
                            min="100"
                            max="10000"
                            value={settings.pricing.minimum_premium}
                            onChange={(e) => handleNumberChange('pricing', 'minimum_premium', e)}
                            className="w-full pl-12 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                        <p className="text-sm text-gray-300">Minimum premium amount (100-10,000 MAD)</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Maximum Premium</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">MAD</span>
                          <input
                            type="number"
                            min="10000"
                            max="1000000"
                            value={settings.pricing.maximum_premium}
                            onChange={(e) => handleNumberChange('pricing', 'maximum_premium', e)}
                            className="w-full pl-12 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                        <p className="text-sm text-gray-300">Maximum premium amount (10,000-1,000,000 MAD)</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Risk Factors</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Age Factor (18-25)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1.0"
                            max="3.0"
                            step="0.1"
                            value="1.5"
                            className="w-full pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                        <p className="text-sm text-gray-300">Multiplier for young drivers (1.0-3.0x)</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Experience Factor (0-2 years)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1.0"
                            max="2.5"
                            step="0.1"
                            value="1.3"
                            className="w-full pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                        <p className="text-sm text-gray-300">Multiplier for new drivers (1.0-2.5x)</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Terms */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Payment Terms</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Grace Period (days)</label>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value="7"
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-300">Payment grace period (0-30 days)</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Late Fee (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value="2.5"
                            className="w-full pr-8 pl-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                        </div>
                        <p className="text-sm text-gray-300">Late payment fee (0-10%)</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Installment Fee (MAD)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">MAD</span>
                          <input
                            type="number"
                            min="0"
                            max="500"
                            value="50"
                            className="w-full pl-12 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white placeholder-gray-400"
                          />
                        </div>
                        <p className="text-sm text-gray-300">Fee for installment payments (0-500 MAD)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-indigo-900 rounded-lg mr-4">
                    <Settings className="h-6 w-6 text-indigo-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Notification Configuration</h3>
                </div>
                <div className="space-y-6">
                  {/* Notification Channels */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Notification Channels</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">Email Notifications</label>
                          <p className="text-sm text-gray-300">Send notifications via email</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingChange('notifications', 'email_enabled', !settings.notifications.email_enabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.email_enabled ? 'bg-indigo-600' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.email_enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">SMS Notifications</label>
                          <p className="text-sm text-gray-300">Send notifications via SMS</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingChange('notifications', 'sms_enabled', !settings.notifications.sms_enabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.sms_enabled ? 'bg-indigo-600' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.sms_enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">Push Notifications</label>
                          <p className="text-sm text-gray-300">Send browser push notifications</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingChange('notifications', 'push_enabled', !settings.notifications.push_enabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.push_enabled ? 'bg-indigo-600' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.push_enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quote Notifications */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Quote Notifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">Quote Created</label>
                          <p className="text-sm text-gray-300">Notify when a new quote is created</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingChange('notifications', 'quote_created', !settings.notifications.quote_created)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.quote_created ? 'bg-indigo-600' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.quote_created ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">Quote Approved</label>
                          <p className="text-sm text-gray-300">Notify when a quote is approved</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingChange('notifications', 'quote_approved', !settings.notifications.quote_approved)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.quote_approved ? 'bg-indigo-600' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.quote_approved ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">Quote Rejected</label>
                          <p className="text-sm text-gray-300">Notify when a quote is rejected</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingChange('notifications', 'quote_rejected', !settings.notifications.quote_rejected)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.quote_rejected ? 'bg-indigo-600' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.quote_rejected ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Policy Notifications */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Policy Notifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">Policy Created</label>
                          <p className="text-sm text-gray-300">Notify when a new policy is created</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingChange('notifications', 'policy_created', !settings.notifications.policy_created)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.policy_created ? 'bg-indigo-600' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.policy_created ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">Payment Received</label>
                          <p className="text-sm text-gray-300">Notify when payment is received</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingChange('notifications', 'payment_received', !settings.notifications.payment_received)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.payment_received ? 'bg-indigo-600' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.payment_received ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Claims Notifications */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Claims Notifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">Claim Filed</label>
                          <p className="text-sm text-gray-300">Notify when a new claim is filed</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingChange('notifications', 'claim_filed', !settings.notifications.claim_filed)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.claim_filed ? 'bg-indigo-600' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.claim_filed ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">Claim Processed</label>
                          <p className="text-sm text-gray-300">Notify when a claim is processed</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSettingChange('notifications', 'claim_processed', !settings.notifications.claim_processed)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.claim_processed ? 'bg-indigo-600' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.claim_processed ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'system' && activeTab !== 'email' && activeTab !== 'security' && activeTab !== 'business' && activeTab !== 'pricing' && activeTab !== 'notifications' && (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">{tabs.find(t => t.id === activeTab)?.name} Settings</h3>
              <p className="text-gray-300">Configuration options for {tabs.find(t => t.id === activeTab)?.name.toLowerCase()} will be available here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
