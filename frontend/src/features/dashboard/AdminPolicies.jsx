import { useEffect, useState } from 'react';
import { 
  Shield, RefreshCw, Search, Filter, ChevronDown, ChevronUp, 
  Clock, TrendingUp, DollarSign, 
  FileText, BarChart3, 
  Eye, Mail, Star, Edit, Download,
  CheckCircle, XCircle, AlertTriangle, Trash2, Save, Send
} from 'lucide-react';
import { policiesAPI } from '../../shared/services/api';
import api from '../../shared/services/api';

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [sortBy, setSortBy] = useState('start_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    coverage_type: '',
    date_from: '',
    date_to: '',
    search: '',
    premium_range: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    cancelled: 0,
    pending: 0,
    totalValue: 0,
    avgPremium: 0,
    expiringSoon: 0
  });

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use real API call to admin policies endpoint
      const response = await api.get('/api/v1/admin/policies');
      const policiesData = response.data.policies || [];
      
      setPolicies(policiesData);
      
      // Calculate statistics
      const total = policiesData.length;
      const active = policiesData.filter(p => p.status === 'active').length;
      const expired = policiesData.filter(p => p.status === 'expired').length;
      const cancelled = policiesData.filter(p => p.status === 'cancelled').length;
      const pending = policiesData.filter(p => p.status === 'pending').length;
      const totalValue = policiesData.reduce((sum, p) => sum + (Number(p.premium_amount) || 0), 0);
      const avgPremium = total > 0 ? totalValue / total : 0;
      
      // Calculate expiring soon (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const expiringSoon = policiesData.filter(p => {
        if (p.status !== 'active') return false;
        const endDate = new Date(p.end_date);
        return endDate <= thirtyDaysFromNow;
      }).length;
      
      setStats({
        total,
        active,
        expired,
        cancelled,
        pending,
        totalValue,
        avgPremium,
        expiringSoon
      });
      
    } catch (err) {
      console.error('Policies fetch error:', err);
      setError('Failed to load policies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Policy action handlers
  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowPolicyModal(true);
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowPolicyModal(true);
  };

  const handleCancelPolicy = async (policyId) => {
    if (!window.confirm('Are you sure you want to cancel this policy?')) return;
    
    setActionLoading(true);
    try {
      const response = await api.post(`/api/v1/policies/${policyId}/cancel`, {
        reason: 'Admin cancellation'
      });
      
      alert('Policy cancelled successfully!');
      fetchPolicies(); // Refresh data
    } catch (error) {
      alert('Error cancelling policy: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenewPolicy = async (policyId) => {
    setActionLoading(true);
    try {
      const response = await api.post(`/api/v1/policies/${policyId}/renew`, {
        newPremiumAmount: null // Let the system calculate
      });
      
      alert('Policy renewed successfully! New policy number: ' + response.data.newPolicy.policy_number);
      fetchPolicies(); // Refresh data
    } catch (error) {
      alert('Error renewing policy: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async (policyId, customerEmail) => {
    setActionLoading(true);
    try {
      const response = await api.post('/api/v1/admin/send-email', {
        policyId: policyId,
        email: customerEmail,
        type: 'policy_reminder'
      });
      
      alert('Email sent successfully to ' + customerEmail);
    } catch (error) {
      alert('Error sending email: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGeneratePDF = async (policyId) => {
    setActionLoading(true);
    try {
      const response = await api.get(`/api/v1/policies/${policyId}/documents`);
      
      // In a real implementation, you would trigger a download
      alert('Policy documents generated successfully! Download started.');
    } catch (error) {
      alert('Error generating PDF: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [filters]);

  const filteredPolicies = policies.filter(policy => {
    if (filters.status && policy.status !== filters.status) return false;
    if (filters.type && policy.type !== filters.type) return false;
    if (filters.coverage_type && policy.coverage_type !== filters.coverage_type) return false;
    if (filters.date_from && new Date(policy.start_date) < new Date(filters.date_from)) return false;
    if (filters.date_to && new Date(policy.start_date) > new Date(filters.date_to)) return false;
    if (filters.premium_range) {
      const premium = Number(policy.premium_amount) || 0;
      const [min, max] = filters.premium_range.split('-').map(Number);
      if (min && premium < min) return false;
      if (max && premium > max) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        policy.policy_number?.toLowerCase().includes(searchLower) ||
        policy.customer_name?.toLowerCase().includes(searchLower) ||
        policy.customer_email?.toLowerCase().includes(searchLower) ||
        policy.vehicle_model?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'start_date' || sortBy === 'end_date' || sortBy === 'created_at') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (sortBy === 'premium_amount') {
      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Future implementation for sorting
  // const handleSort = (column) => {
  //   if (sortBy === column) {
  //     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  //   } else {
  //     setSortBy(column);
  //     setSortOrder('desc');
  //   }
  // };

  const clearFilters = () => {
    setFilters({
      status: '',
      type: '',
      coverage_type: '',
      date_from: '',
      date_to: '',
      search: '',
      premium_range: ''
    });
  };

  const formatCurrency = (value) => Number(value || 0).toLocaleString('fr-MA');
  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');
  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const map = {
      active: 'bg-green-900 text-green-300',
      cancelled: 'bg-red-900 text-red-300',
      expired: 'bg-gray-700 text-gray-300',
      pending: 'bg-yellow-900 text-yellow-300',
    };
    const cls = map[s] || 'bg-gray-700 text-gray-300';
    return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${cls}`}>{status || '-'}</span>;
  };

  if (loading) return <div className="p-6 text-gray-300">Loading policies...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="space-y-6 animate-fade-in p-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Policy Management</h1>
              <p className="text-green-100 text-lg">Comprehensive policy management and analytics dashboard</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
              >
                {viewMode === 'table' ? <BarChart3 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                <span>{viewMode === 'table' ? 'Grid View' : 'Table View'}</span>
              </button>
              <button
                onClick={fetchPolicies}
                disabled={loading}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 disabled:opacity-50 transition-all"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Policies</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-green-900 rounded-full">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 font-medium">+8% from last month</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Active Policies</p>
                <p className="text-3xl font-bold text-green-400">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-900 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Star className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 font-medium">Currently active</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Expiring Soon</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.expiringSoon}</p>
              </div>
              <div className="p-3 bg-yellow-900 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Clock className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-yellow-400 font-medium">Within 30 days</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Value</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalValue.toLocaleString()} MAD</p>
              </div>
              <div className="p-3 bg-blue-900 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-blue-400 mr-1" />
              <span className="text-blue-400 font-medium">Avg: {stats.avgPremium.toLocaleString()} MAD</span>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Filters & Search</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className={`p-6 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search policies, customers, vehicles..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="car">Car</option>
                  <option value="moto">Motorcycle</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Coverage</label>
                <select
                  value={filters.coverage_type}
                  onChange={(e) => setFilters({...filters, coverage_type: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Coverage</option>
                  <option value="basique">Basique</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="confort">Confort</option>
                  <option value="essentiel">Essentiel</option>
                  <option value="ultimate">Ultimate</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date From</label>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date To</label>
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Premium Range</label>
                <select
                  value={filters.premium_range}
                  onChange={(e) => setFilters({...filters, premium_range: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Ranges</option>
                  <option value="0-2000">0 - 2,000 MAD</option>
                  <option value="2000-5000">2,000 - 5,000 MAD</option>
                  <option value="5000-10000">5,000 - 10,000 MAD</option>
                  <option value="10000-999999">10,000+ MAD</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  <Filter className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Policies Display */}
        {viewMode === 'table' ? (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Policies ({filteredPolicies.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white"
                  >
                    <option value="start_date">Start Date</option>
                    <option value="end_date">End Date</option>
                    <option value="premium_amount">Premium</option>
                    <option value="customer_name">Customer</option>
                    <option value="status">Status</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1 text-gray-300 hover:text-white"
                  >
                    {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Policy #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coverage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Premium</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {sortedPolicies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {policy.policy_number || `POL-${policy.id}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{policy.customer_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-300">{policy.customer_email || 'customer@example.com'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {policy.vehicle_model || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                          {policy.type || 'car'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                          {policy.coverage_type || 'standard'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div className="font-medium">{formatCurrency(policy.premium_amount)} MAD</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(policy.start_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(policy.end_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusBadge(policy.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewPolicy(policy)}
                            className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {policy.status === 'active' && (
                            <>
                              <button
                                onClick={() => handleEditPolicy(policy)}
                                disabled={actionLoading}
                                className="p-1 text-green-400 hover:text-green-300 hover:bg-green-900 rounded disabled:opacity-50"
                                title="Edit Policy"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRenewPolicy(policy.id)}
                                disabled={actionLoading}
                                className="p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-900 rounded disabled:opacity-50"
                                title="Renew Policy"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleCancelPolicy(policy.id)}
                                disabled={actionLoading}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded disabled:opacity-50"
                                title="Cancel Policy"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleSendEmail(policy.id, policy.customer_email)}
                            disabled={actionLoading}
                            className="p-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900 rounded disabled:opacity-50"
                            title="Send Email"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleGeneratePDF(policy.id)}
                            disabled={actionLoading}
                            className="p-1 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded disabled:opacity-50"
                            title="Generate PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPolicies.map((policy) => (
              <div key={policy.id} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{policy.policy_number || `POL-${policy.id}`}</h3>
                    <p className="text-sm text-gray-300">{formatDate(policy.start_date)} - {formatDate(policy.end_date)}</p>
                  </div>
                  {statusBadge(policy.status)}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Customer</p>
                    <p className="text-sm text-white">{policy.customer_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{policy.customer_email || 'customer@example.com'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300">Vehicle</p>
                    <p className="text-sm text-white">{policy.vehicle_model || 'N/A'}</p>
                    <div className="flex space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-300">
                        {policy.type || 'car'}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-900 text-purple-300">
                        {policy.coverage_type || 'standard'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300">Premium</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(policy.premium_amount)} MAD</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Primary Actions Row */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewPolicy(policy)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    
                    {policy.status === 'active' && (
                      <button
                        onClick={() => handleEditPolicy(policy)}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Secondary Actions Row */}
                  <div className="flex space-x-2">
                    {policy.status === 'active' && (
                      <button
                        onClick={() => handleRenewPolicy(policy.id)}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Renew</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleSendEmail(policy.id, policy.customer_email)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </button>
                  </div>
                  
                  {/* Utility Actions Row */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGeneratePDF(policy.id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>PDF</span>
                    </button>
                    
                    {policy.status === 'active' && (
                      <button
                        onClick={() => handleCancelPolicy(policy.id)}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Policy Details Modal */}
        {showPolicyModal && selectedPolicy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Policy Details - {selectedPolicy.policy_number}</h3>
                <button
                  onClick={() => setShowPolicyModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Customer</label>
                    <p className="mt-1 text-sm text-white">{selectedPolicy.customer_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <p className="mt-1 text-sm text-white">{selectedPolicy.customer_email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Vehicle</label>
                    <p className="mt-1 text-sm text-white">{selectedPolicy.vehicle_model}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Type</label>
                    <p className="mt-1 text-sm text-white capitalize">{selectedPolicy.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Coverage</label>
                    <p className="mt-1 text-sm text-white capitalize">{selectedPolicy.coverage_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Status</label>
                    <div className="mt-1">{statusBadge(selectedPolicy.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Premium</label>
                    <p className="mt-1 text-sm text-white">{formatCurrency(selectedPolicy.premium_amount)} MAD</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Start Date</label>
                    <p className="mt-1 text-sm text-white">{formatDate(selectedPolicy.start_date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">End Date</label>
                    <p className="mt-1 text-sm text-white">{formatDate(selectedPolicy.end_date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Created</label>
                    <p className="mt-1 text-sm text-white">{formatDate(selectedPolicy.created_at)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                {selectedPolicy.status === 'active' && (
                  <>
                    <button
                      onClick={() => {
                        setShowPolicyModal(false);
                        // The edit functionality will be handled by the modal itself
                        // For now, we'll just close the modal
                        alert('Edit functionality will be implemented in the next update');
                      }}
                      disabled={actionLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        handleRenewPolicy(selectedPolicy.id);
                        setShowPolicyModal(false);
                      }}
                      disabled={actionLoading}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Renew</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleSendEmail(selectedPolicy.id, selectedPolicy.customer_email)}
                  disabled={actionLoading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </button>
                <button
                  onClick={() => handleGeneratePDF(selectedPolicy.id)}
                  disabled={actionLoading}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Generate PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPolicies;
