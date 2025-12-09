import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('🔐 Attempting login for:', email);
      console.log('🔐 Password provided:', password ? 'Yes' : 'No');


      // Try API login for other accounts
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      console.log('✅ API Login successful, user data:', userData);
      console.log('🔑 Token received:', token ? 'Yes' : 'No');
      console.log('🔑 Token preview:', token ? token.substring(0, 50) + '...' : 'None');
      console.log('👤 User role:', userData?.role);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      console.log('💾 User data saved to localStorage and state');
      return { success: true, user: userData };
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Email ou mot de passe incorrect';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      await authAPI.register({ name, email, password });

      // Auto-login after successful registration
      return await login(email, password);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    currentUser: user, // alias for components expecting currentUser
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
    // updater helpers expected by some components
    updateUser: (partial) => setUser((prev) => ({ ...(prev || {}), ...(partial || {}) })),
    addDocument: (doc) =>
      setUser((prev) => ({
        ...(prev || {}),
        documents: [doc, ...((prev && prev.documents) || [])],
      })),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
