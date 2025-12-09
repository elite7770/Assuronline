import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { profileAPI } from '../../shared/services/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Key,
  Smartphone,
  Monitor,
  LogOut
} from 'lucide-react';

const Profile = () => {
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    date_of_birth: '',
    role: 'client',
    avatar_url: null
  });

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await profileAPI.get();
        const profileData = response.data.data;
        
        // Split name into first and last name for display
        const nameParts = (profileData.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        setFormData({
          first_name: firstName,
          last_name: lastName,
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          city: profileData.city || '',
          postal_code: profileData.postal_code || '',
          date_of_birth: profileData.birth_date || '',
          role: profileData.role || 'client',
          avatar_url: null // Not supported in current schema
        });
        
        setShowTwoFactor(false); // Not supported in current schema
      } catch (error) {
        console.error('Error loading profile:', error);
        setErrors({ general: 'Failed to load profile data' });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.date_of_birth = 'You must be at least 18 years old';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setSuccessMessage('');
    setErrors({});
    
    try {
      // Combine first_name and last_name into name field
      const updateData = {
        ...formData,
        name: `${formData.first_name} ${formData.last_name}`.trim(),
        birth_date: formData.date_of_birth
      };
      
      // Remove fields that don't exist in backend schema
      delete updateData.first_name;
      delete updateData.last_name;
      delete updateData.date_of_birth;
      delete updateData.avatar_url;
      
      await profileAPI.update(updateData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Dispatch event to update user menu
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error.response?.data?.details) {
        setErrors(error.response.data.details);
      } else if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: 'Failed to save profile. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      // Reload the original profile data
      const response = await profileAPI.get();
      const profileData = response.data.data;
      
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        city: profileData.city || '',
        postal_code: profileData.postal_code || '',
        date_of_birth: profileData.date_of_birth || '',
        role: profileData.role || 'client',
        avatar_url: profileData.avatar_url || null
      });
    } catch (error) {
      console.error('Error reloading profile:', error);
    }
    
    setErrors({});
    setIsEditing(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ avatar: 'File size must be less than 5MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors({ avatar: 'Please select an image file' });
        return;
      }
      
      setIsLoading(true);
      setErrors({});
      
      try {
        const response = await profileAPI.uploadAvatar(file);
        setFormData(prev => ({
          ...prev,
          avatar_url: response.data.data.avatar_url
        }));
        setSuccessMessage('Avatar uploaded successfully!');
        
        // Dispatch event to update user menu
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error uploading avatar:', error);
        setErrors({ avatar: 'Failed to upload avatar. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePasswordSave = async () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await profileAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccessMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response?.data?.details) {
        setErrors(error.response.data.details);
      } else if (error.response?.data?.error) {
        setErrors({ password: error.response.data.error });
      } else {
        setErrors({ password: 'Failed to change password. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      await profileAPI.toggleTwoFactor(!showTwoFactor);
      setShowTwoFactor(!showTwoFactor);
      setSuccessMessage(`Two-factor authentication ${!showTwoFactor ? 'enabled' : 'disabled'} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling two-factor authentication:', error);
      setErrors({ twoFactor: 'Failed to update two-factor authentication. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionsToggle = async () => {
    if (!showSessions) {
      setIsLoading(true);
      try {
        const response = await profileAPI.getSessions();
        setSessions(response.data.data || []);
        setShowSessions(true);
      } catch (error) {
        console.error('Error loading sessions:', error);
        setErrors({ sessions: 'Failed to load sessions. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowSessions(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await profileAPI.deleteSession(sessionId);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      setSuccessMessage('Session deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting session:', error);
      setErrors({ sessions: 'Failed to delete session. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Profile Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
            <span className="text-green-800 dark:text-green-200">{successMessage}</span>
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
            <span className="text-red-800 dark:text-red-200">{errors.general}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sticky top-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  {formData.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-slate-700 shadow-lg">
                      {formData.first_name[0] || 'U'}{formData.last_name[0] || 'U'}
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    title="Change avatar"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                
                {errors.avatar && (
                  <p className="text-red-600 dark:text-red-400 text-sm mb-2">{errors.avatar}</p>
                )}

                {/* User Info */}
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {formData.first_name} {formData.last_name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {formData.email}
                </p>

                {/* Role Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  <Shield className="h-4 w-4 mr-1" />
                  {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center transform hover:scale-105 hover:shadow-lg"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center transform hover:scale-105 hover:shadow-lg disabled:transform-none"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center transform hover:scale-105 hover:shadow-lg disabled:transform-none"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={logout}
                      className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors ${
                        errors.first_name 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors ${
                        errors.last_name 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    />
                  </div>
                  {errors.last_name && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.last_name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors ${
                        errors.email 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors ${
                        errors.phone 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors ${
                        errors.date_of_birth 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    />
                  </div>
                  {errors.date_of_birth && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.date_of_birth}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Security Settings
              </h3>

              <div className="space-y-4">
                {/* Change Password */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                        <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">Change Password</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Update your password to keep your account secure</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {showPasswordForm ? 'Cancel' : 'Change'}
                    </button>
                  </div>
                  
                  {showPasswordForm && (
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-700/50">
                      <div className="space-y-4">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type={showPasswords.current ? "text" : "password"}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {errors.currentPassword && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.currentPassword}
                            </p>
                          )}
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {errors.newPassword && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.newPassword}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>

                        {errors.password && (
                          <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.password}
                          </p>
                        )}

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setShowPasswordForm(false)}
                            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handlePasswordSave}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                          >
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              'Save Password'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                      <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleTwoFactorToggle}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {showTwoFactor ? 'Disabling...' : 'Enabling...'}
                      </>
                    ) : (
                      showTwoFactor ? 'Disable' : 'Enable'
                    )}
                  </button>
                </div>

                {/* Login Sessions */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg mr-3">
                      <Monitor className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Login Sessions</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Manage your active login sessions</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSessionsToggle}
                    disabled={isLoading}
                    className="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      showSessions ? 'Hide' : 'View'
                    )}
                  </button>
                </div>

                {/* Sessions List */}
                {showSessions && (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/50">
                    <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Active Sessions</h5>
                    {sessions.length > 0 ? (
                      <div className="space-y-3">
                        {sessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                            <div className="flex items-center">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                                <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">{session.device}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{session.location}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-500">
                                  Last activity: {new Date(session.last_activity).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {session.is_current && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                                  Current
                                </span>
                              )}
                              {!session.is_current && (
                                <button
                                  onClick={() => handleDeleteSession(session.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-sm"
                                >
                                  End Session
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Monitor className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-500 dark:text-slate-400">No active sessions found</p>
                      </div>
                    )}
                    {errors.sessions && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.sessions}
                      </p>
                    )}
                  </div>
                )}

                {/* Two-Factor Error */}
                {errors.twoFactor && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.twoFactor}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
