import { useEffect, useState } from 'react';
import { 
  AlertTriangle, RefreshCw, Search, Filter, ChevronDown, ChevronUp, 
  Clock, TrendingUp, DollarSign, AlertCircle, 
  FileText, BarChart3, 
  Eye, Mail, Flag,
  CheckCircle, XCircle, 
  Shield, Award, MapPin
} from 'lucide-react';
import { claimsAPI } from '../../shared/services/api';

const AdminClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    claim_type: '',
    date_from: '',
    date_to: '',
    search: '',
    amount_range: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    settled: 0,
    totalAmount: 0,
    avgAmount: 0,
    urgentClaims: 0
  });

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Always use real API data
      const res = await claimsAPI.listAll();
      const claimsData = Array.isArray(res.data) ? res.data : res.data?.claims || [];
      
      setClaims(claimsData);
      
      // Calculate statistics
      const total = claimsData.length;
      const pending = claimsData.filter(c => c.status === 'pending').length;
      const approved = claimsData.filter(c => c.status === 'approved').length;
      const rejected = claimsData.filter(c => c.status === 'rejected').length;
      const settled = claimsData.filter(c => c.status === 'settled').length;
      const totalAmount = claimsData.reduce((sum, c) => sum + (Number(c.estimated_amount) || 0), 0);
      const avgAmount = total > 0 ? totalAmount / total : 0;
      
      // Calculate urgent claims (high priority or recent)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const urgentClaims = claimsData.filter(c => {
        const isHighPriority = c.priority === 'urgent' || c.priority === 'high';
        const isRecent = new Date(c.created_at) > sevenDaysAgo;
        return isHighPriority || isRecent;
      }).length;
      
      setStats({
        total,
        pending,
        approved,
        rejected,
        settled,
        totalAmount,
        avgAmount,
        urgentClaims
      });
      
    } catch (err) {
      console.error('Claims fetch error:', err);
      setError('Failed to load claims. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Claim action handlers
  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowClaimModal(true);
  };

  const handleApproveClaim = async (claimId) => {
    setActionLoading(true);
    try {
      // Call real API to approve claim
      const response = await claimsAPI.updateStatus(claimId, 'approved');
      console.log('Approve claim response:', response);
      alert('Claim approved successfully!');
      fetchClaims(); // Refresh data
    } catch (error) {
      console.error('Error approving claim:', error);
      alert('Error approving claim: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClaim = async (claimId) => {
    if (!window.confirm('Are you sure you want to reject this claim?')) return;
    
    setActionLoading(true);
    try {
      // Call real API to reject claim
      const response = await claimsAPI.updateStatus(claimId, 'rejected');
      console.log('Reject claim response:', response);
      alert('Claim rejected successfully!');
      fetchClaims(); // Refresh data
    } catch (error) {
      console.error('Error rejecting claim:', error);
      alert('Error rejecting claim: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSettleClaim = async (claimId) => {
    setActionLoading(true);
    try {
      // Call real API to settle claim
      const response = await claimsAPI.updateStatus(claimId, 'settled');
      console.log('Settle claim response:', response);
      alert('Claim settled successfully! Payment processed.');
      fetchClaims(); // Refresh data
    } catch (error) {
      console.error('Error settling claim:', error);
      alert('Error settling claim: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignInvestigator = async (claimId) => {
    setActionLoading(true);
    try {
      // Call real API to assign investigator
      const response = await claimsAPI.assignInvestigator(claimId);
      console.log('Assign investigator response:', response);
      alert('Investigator assigned successfully!');
      fetchClaims(); // Refresh data
    } catch (error) {
      console.error('Error assigning investigator:', error);
      alert('Error assigning investigator: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async (claimId, customerEmail) => {
    setActionLoading(true);
    try {
      // Call real API to send email
      const response = await claimsAPI.sendEmail(claimId, customerEmail);
      console.log('Send email response:', response);
      alert('Email sent successfully to ' + customerEmail);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateReport = async (claimId) => {
    setActionLoading(true);
    try {
      // Call real API to generate report
      const response = await claimsAPI.generateReport(claimId);
      console.log('Generate report response:', response);
      
      // If response contains download URL, open it
      if (response.data?.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
        alert('Claim report generated successfully! Download started.');
      } else {
        alert('Claim report generated successfully!');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [filters]);

  const filteredClaims = claims.filter(claim => {
    if (filters.status && claim.status !== filters.status) return false;
    if (filters.claim_type && claim.claim_type !== filters.claim_type) return false;
    if (filters.date_from && new Date(claim.created_at) < new Date(filters.date_from)) return false;
    if (filters.date_to && new Date(claim.created_at) > new Date(filters.date_to)) return false;
    if (filters.amount_range) {
      const amount = Number(claim.estimated_amount) || 0;
      const [min, max] = filters.amount_range.split('-').map(Number);
      if (min && amount < min) return false;
      if (max && amount > max) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        claim.claim_number?.toLowerCase().includes(searchLower) ||
        claim.customer_name?.toLowerCase().includes(searchLower) ||
        claim.customer_email?.toLowerCase().includes(searchLower) ||
        claim.incident_description?.toLowerCase().includes(searchLower) ||
        claim.incident_location?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'created_at' || sortBy === 'incident_date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (sortBy === 'estimated_amount') {
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
      claim_type: '',
      date_from: '',
      date_to: '',
      search: '',
      amount_range: ''
    });
  };

  const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : '-');
  const formatCurrency = (value) => Number(value || 0).toLocaleString('fr-MA');
  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const map = {
      pending: 'bg-yellow-900 text-yellow-300',
      approved: 'bg-green-900 text-green-300',
      rejected: 'bg-red-900 text-red-300',
      settled: 'bg-blue-900 text-blue-300',
    };
    const cls = map[s] || 'bg-gray-900 text-gray-300';
    return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${cls}`}>{status || '-'}</span>;
  };

  const claimTypeBadge = (type) => {
    const t = (type || '').toLowerCase();
    const map = {
      accident: 'bg-red-900 text-red-300',
      theft: 'bg-purple-900 text-purple-300',
      vandalism: 'bg-orange-900 text-orange-300',
      fire: 'bg-red-900 text-red-300',
      natural_disaster: 'bg-blue-900 text-blue-300',
    };
    const cls = map[t] || 'bg-gray-900 text-gray-300';
    const displayName = t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${cls}`}>{displayName}</span>;
  };

  const priorityBadge = (priority) => {
    const p = (priority || '').toLowerCase();
    const map = {
      urgent: 'bg-red-900 text-red-300',
      high: 'bg-orange-900 text-orange-300',
      medium: 'bg-yellow-900 text-yellow-300',
      low: 'bg-green-900 text-green-300',
    };
    const cls = map[p] || 'bg-gray-900 text-gray-300';
    return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${cls}`}>{priority || 'Medium'}</span>;
  };

  if (loading) return <div className="p-6 text-white">Loading claims...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white space-y-6 animate-fade-in p-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Claims Management</h1>
            <p className="text-red-100 text-lg">Comprehensive claims processing and investigation dashboard</p>
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
              onClick={fetchClaims}
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
              <p className="text-sm font-medium text-gray-300">Total Claims</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-red-900 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400 font-medium">+18% from last month</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-900 rounded-full">
              <Clock className="h-6 w-6 text-yellow-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-yellow-400 font-medium">Requires attention</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Urgent Claims</p>
              <p className="text-3xl font-bold text-red-400">{stats.urgentClaims}</p>
            </div>
            <div className="p-3 bg-red-900 rounded-full">
              <Flag className="h-6 w-6 text-red-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <AlertTriangle className="h-4 w-4 text-red-400 mr-1" />
            <span className="text-red-400 font-medium">High priority</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Total Amount</p>
              <p className="text-3xl font-bold text-pink-400">{stats.totalAmount.toLocaleString()} MAD</p>
            </div>
            <div className="p-3 bg-pink-900 rounded-full">
              <DollarSign className="h-6 w-6 text-pink-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-pink-400 mr-1" />
            <span className="text-pink-400 font-medium">Avg: {stats.avgAmount.toLocaleString()} MAD</span>
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
                  placeholder="Search claims, customers, incidents..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10 w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="settled">Settled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Claim Type</label>
              <select
                value={filters.claim_type}
                onChange={(e) => setFilters({...filters, claim_type: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="accident">Accident</option>
                <option value="theft">Theft</option>
                <option value="vandalism">Vandalism</option>
                <option value="fire">Fire</option>
                <option value="natural_disaster">Natural Disaster</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount Range</label>
              <select
                value={filters.amount_range}
                onChange={(e) => setFilters({...filters, amount_range: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Ranges</option>
                <option value="0-5000">0 - 5,000 MAD</option>
                <option value="5000-15000">5,000 - 15,000 MAD</option>
                <option value="15000-30000">15,000 - 30,000 MAD</option>
                <option value="30000-999999">30,000+ MAD</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date From</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date To</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
        <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
        >
                <Filter className="h-4 w-4" />
                <span>Clear All</span>
        </button>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Display */}
      {viewMode === 'table' ? (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Claims ({filteredClaims.length})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1 text-sm"
                >
                  <option value="created_at">Date</option>
                  <option value="estimated_amount">Amount</option>
                  <option value="customer_name">Customer</option>
                  <option value="status">Status</option>
                  <option value="incident_date">Incident Date</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Claim #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Incident Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {sortedClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {claim.claim_number || `CLM-${claim.id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{claim.customer_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-300">{claim.customer_email || 'customer@example.com'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {claimTypeBadge(claim.claim_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div className="font-medium">{formatCurrency(claim.estimated_amount)} MAD</div>
                      <div className="text-xs text-gray-300">{claim.incident_description?.substring(0, 30)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(claim.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {priorityBadge(claim.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDateTime(claim.incident_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewClaim(claim)}
                          className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {claim.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveClaim(claim.id)}
                              disabled={actionLoading}
                              className="p-1 text-green-400 hover:text-green-300 hover:bg-green-900 rounded disabled:opacity-50"
                              title="Approve Claim"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRejectClaim(claim.id)}
                              disabled={actionLoading}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded disabled:opacity-50"
                              title="Reject Claim"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAssignInvestigator(claim.id)}
                              disabled={actionLoading}
                              className="p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-900 rounded disabled:opacity-50"
                              title="Assign Investigator"
                            >
                              <Shield className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {claim.status === 'approved' && (
                          <button
                            onClick={() => handleSettleClaim(claim.id)}
                            disabled={actionLoading}
                            className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded disabled:opacity-50"
                            title="Settle Claim"
                          >
                            <Award className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleSendEmail(claim.id, claim.customer_email)}
                          disabled={actionLoading}
                          className="p-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900 rounded disabled:opacity-50"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleGenerateReport(claim.id)}
                          disabled={actionLoading}
                          className="p-1 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded disabled:opacity-50"
                          title="Generate Report"
                        >
                          <FileText className="h-4 w-4" />
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
          {sortedClaims.map((claim) => (
            <div key={claim.id} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:bg-gray-750 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{claim.claim_number || `CLM-${claim.id}`}</h3>
                  <p className="text-sm text-gray-300">{formatDateTime(claim.created_at)}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  {statusBadge(claim.status)}
                  {priorityBadge(claim.priority)}
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-300">Customer</p>
                  <p className="text-sm text-white">{claim.customer_name || 'Unknown'}</p>
                  <p className="text-xs text-gray-400">{claim.customer_email || 'customer@example.com'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-300">Claim Type</p>
                  <div className="mt-1">{claimTypeBadge(claim.claim_type)}</div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-300">Estimated Amount</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(claim.estimated_amount)} MAD</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-300">Incident Description</p>
                  <p className="text-sm text-white">{claim.incident_description || 'No description'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-300">Location</p>
                  <p className="text-sm text-white flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {claim.incident_location || 'Not specified'}
                  </p>
                </div>
              </div>
              
              {/* Primary Actions Row */}
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={() => handleViewClaim(claim)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                
                {claim.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApproveClaim(claim.id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectClaim(claim.id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}
                
                {claim.status === 'approved' && (
                  <button
                    onClick={() => handleSettleClaim(claim.id)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Award className="h-4 w-4" />
                    <span>Settle</span>
                  </button>
                )}
              </div>
              
              {/* Secondary Actions Row */}
              <div className="flex space-x-2">
                {claim.status === 'pending' && (
                  <button
                    onClick={() => handleAssignInvestigator(claim.id)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Assign</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleSendEmail(claim.id, claim.customer_email)}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                
                <button
                  onClick={() => handleGenerateReport(claim.id)}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Claim Details Modal */}
      {showClaimModal && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Claim Details - {selectedClaim.claim_number}</h3>
              <button
                onClick={() => setShowClaimModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Customer</label>
                  <p className="mt-1 text-sm text-white">{selectedClaim.customer_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <p className="mt-1 text-sm text-white">{selectedClaim.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Claim Type</label>
                  <div className="mt-1">{claimTypeBadge(selectedClaim.claim_type)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Status</label>
                  <div className="mt-1">{statusBadge(selectedClaim.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Priority</label>
                  <div className="mt-1">{priorityBadge(selectedClaim.priority)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Estimated Amount</label>
                  <p className="mt-1 text-sm text-white">{formatCurrency(selectedClaim.estimated_amount)} MAD</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Incident Date</label>
                  <p className="mt-1 text-sm text-white">{formatDateTime(selectedClaim.incident_date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Created</label>
                  <p className="mt-1 text-sm text-white">{formatDateTime(selectedClaim.created_at)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300">Incident Description</label>
                <p className="mt-1 text-sm text-white bg-gray-700 p-3 rounded-lg">{selectedClaim.incident_description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300">Incident Location</label>
                <p className="mt-1 text-sm text-white flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedClaim.incident_location || 'Not specified'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              {selectedClaim.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApproveClaim(selectedClaim.id);
                      setShowClaimModal(false);
                    }}
                    disabled={actionLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => {
                      handleRejectClaim(selectedClaim.id);
                      setShowClaimModal(false);
                    }}
                    disabled={actionLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => {
                      handleAssignInvestigator(selectedClaim.id);
                      setShowClaimModal(false);
                    }}
                    disabled={actionLoading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Assign Investigator</span>
                  </button>
                </>
              )}
              {selectedClaim.status === 'approved' && (
                <button
                  onClick={() => {
                    handleSettleClaim(selectedClaim.id);
                    setShowClaimModal(false);
                  }}
                  disabled={actionLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Award className="h-4 w-4" />
                  <span>Settle Claim</span>
                </button>
              )}
              <button
                onClick={() => handleSendEmail(selectedClaim.id, selectedClaim.customer_email)}
                disabled={actionLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </button>
              <button
                onClick={() => handleGenerateReport(selectedClaim.id)}
                disabled={actionLoading}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </button>
            </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminClaims;
