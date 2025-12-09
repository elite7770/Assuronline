import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Adding token to request:
  } else {
    // No token available for request:
  }
  return config;
});

// Gracefully handle 404s and network errors from the API for GETs so UI doesn't crash
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const method = (error?.config?.method || '').toLowerCase();
    const url = error?.config?.url || '';
    // Handle missing backend endpoints (404) for GETs
    if (status === 404 && method === 'get') {
      const isList = /\/([a-z0-9_-]+)(\?.*)?$/i.test(url) && /s(\?.*)?$/.test(url);
      return Promise.resolve({
        data: isList ? [] : null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      });
    }
    // Handle network errors (no response) for GETs by returning empty data
    if (!error.response && method === 'get') {
      const isList = /\/([a-z0-9_-]+)(\?.*)?$/i.test(url) && /s(\?.*)?$/.test(url);
      return Promise.resolve({
        data: isList ? [] : null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      });
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData) => api.post('/api/v1/auth/register', userData),
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  me: () => api.get('/api/v1/auth/me'),
};

// Profile API functions
export const profileAPI = {
  get: () => api.get('/api/v1/profile'),
  update: (data) => api.put('/api/v1/profile', data),
  changePassword: (data) => api.post('/api/v1/profile/change-password', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/api/v1/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  toggleTwoFactor: (enabled) => api.put('/api/v1/profile/two-factor', { enabled }),
  getSessions: () => api.get('/api/v1/profile/sessions'),
  deleteSession: (sessionId) => api.delete(`/api/v1/profile/sessions/${sessionId}`),
};

// Settings API functions
export const settingsAPI = {
  get: () => api.get('/api/v1/settings'),
  update: (data) => api.put('/api/v1/settings', data),
  updateCategory: (category, data) => api.put(`/api/v1/settings/${category}`, data),
  reset: () => api.post('/api/v1/settings/reset'),
  getDefault: () => api.get('/api/v1/settings/default'),
};

// Admin: users
export const adminUsersAPI = {
  list: () => api.get('/api/v1/admin/customers'),
  setStatus: (id, status) => api.patch(`/api/v1/admin/users/${id}/status`, { status }),
  getById: (id) => api.get(`/api/v1/admin/users/${id}`),
  delete: (id) => api.delete(`/api/v1/admin/users/${id}`),
};

// Policies
export const policiesAPI = {
  list: () => api.get('/api/v1/policies'),
  create: (data) => api.post('/api/v1/policies', data),
  get: (id) => api.get(`/api/v1/policies/${id}`),
  update: (id, data) => api.patch(`/api/v1/policies/${id}`, data),
  // Admin methods
  listAdmin: () => api.get('/api/v1/admin/policies'),
  remove: (id) => api.delete(`/api/v1/policies/${id}`), // admin
  subscribe: (payload) => api.post('/api/v1/policies/subscribe', payload), // client
  listByUser: (userId) => api.get(`/api/v1/policies/user/${userId}`),
};

// Claims
export const claimsAPI = {
  // client
  create: (data) => api.post('/api/v1/claims', data),
  edit: (id, data) => api.patch(`/api/v1/claims/${id}`, data),
  update: (id, data) => api.patch(`/api/v1/claims/${id}`, data), // Alias for edit
  list: () => api.get('/api/v1/claims'), // Client: list own claims
  listMine: () => api.get('/api/v1/claims'), // Alias for compatibility
  get: (id) => api.get(`/api/v1/claims/${id}`),
  // admin
  listAll: () => api.get('/api/v1/admin/claims'),
  review: (id) => api.post(`/api/v1/claims/admin/${id}/review`),
  approve: (id) => api.post(`/api/v1/claims/admin/${id}/approve`),
  reject: (id) => api.post(`/api/v1/claims/admin/${id}/reject`),
  settle: (id, amount) => api.post(`/api/v1/claims/admin/${id}/settle`, { amount }),
};

// Payments / Invoices
export const paymentsAPI = {
  // client
  create: (payload) => api.post('/api/v1/payments', payload), // Create payment intent
  createIntent: (payload) => api.post('/api/v1/payments', payload), // Alias for compatibility
  list: () => api.get('/api/v1/payments'), // Client: list own payments
  get: (id) => api.get(`/api/v1/payments/${id}`),
  confirm: (id, transaction_ref) => api.post(`/api/v1/payments/${id}/confirm`, { transaction_ref }),
  invoice: (id) => api.get(`/api/v1/payments/${id}/invoice`),
  getInvoice: (id) => api.get(`/api/v1/payments/${id}/invoice`), // Alias for invoice
  // admin
  listAll: () => api.get('/api/v1/admin/payments'), // Admin: list all payments
  updateStatus: (id, status) => api.patch(`/api/v1/payments/${id}`, { status }), // Admin: update payment status
  adminUpdate: (id, status) => api.patch(`/api/v1/payments/admin/${id}`, { status }), // Alias for compatibility
};


export default api;

// Dashboard API functions
export const dashboardAPI = {
  // Admin dashboard overview
  getAdminOverview: () => api.get('/api/v1/admin/dashboard'),
  // Client dashboard data
  getClientData: () => api.get('/api/v1/dashboard/me'),
};

// Backward-compatible aliases and additional APIs expected by UI components
// Policies alias with convenience methods
export const policyAPI = {
  // List all policies (admin)
  getAll: () => api.get('/api/v1/admin/policies'),
  // Create policy (admin/client depending on backend rules)
  create: (data) => api.post('/api/v1/policies', data),
};

// Claims alias with convenience methods
export const claimAPI = {
  // List all claims (admin). If endpoint not available, interceptor will return [] for 404.
  getAll: () => api.get('/api/v1/admin/claims'),
};

// Invoices API. If endpoint not available, interceptor will return [] for 404.
export const invoicesAPI = {
  list: () => api.get('/api/v1/payments/invoices'),
};

// Notifications API. Gracefully handles 404 → [] via interceptor.
export const notificationsAPI = {
  list: () => api.get('/api/v1/notifications'),
  markAsRead: (id) => api.post(`/api/v1/notifications/${id}/read`),
  markRead: (id) => api.post(`/api/v1/notifications/${id}/read`), // Alias for compatibility
  broadcast: (data) => api.post('/api/v1/notifications/admin/broadcast', data),
  listAll: () => api.get('/api/v1/notifications/admin/all'), // For admin to see all notifications
};

// Vehicles API used by quote flow
export const vehiclesAPI = {
  create: (data) => api.post('/api/v1/vehicles', data),
};

// Quotes API functions
export const quotesAPI = {
  // Public endpoints (no auth required)
  getEstimate: (data) => api.post('/api/v1/quotes/estimate', data),
  getBrands: (type) => api.get(`/api/v1/quotes/brands/${type}`),
  getModels: (type, brand) => api.get(`/api/v1/quotes/models/${type}/${brand}`),
  getCities: () => api.get('/api/v1/quotes/cities'),
  createPublic: (data) => api.post('/api/v1/quotes/create-public', data), // Public quote creation
  
  // Authenticated endpoints
  create: (data) => api.post('/api/v1/quotes/create', data),
  getMyQuotes: (filters = {}) => api.get('/api/v1/quotes/my-quotes', { params: filters }),
  getById: (id) => api.get(`/api/v1/quotes/${id}`),
  getByNumber: (quoteNumber) => api.get(`/api/v1/quotes/number/${quoteNumber}`),
  delete: (id) => api.delete(`/api/v1/quotes/${id}`),
  
  // Admin endpoints
  getAll: (filters = {}) => api.get('/api/v1/quotes/admin/all', { params: filters }),
  getStats: () => api.get('/api/v1/quotes/admin/stats'),
  updateStatus: (id, status, adminComment) => api.put(`/api/v1/quotes/admin/${id}`, { status, adminComment }),
  
  // Email and PDF endpoints
  sendEmail: (quoteId, emailType = 'status_update') => api.post(`/api/v1/email/quotes/${quoteId}/send`, { emailType }),
  generatePDF: (quoteId) => api.get(`/api/v1/pdf/quotes/${quoteId}/pdf`, { responseType: 'blob' }),
};
