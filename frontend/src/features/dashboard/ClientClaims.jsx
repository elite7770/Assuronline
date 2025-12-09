import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, RefreshCw, Plus, Eye, FileText, Download, 
  Calendar, Clock, DollarSign, TrendingUp, Filter, Search, 
  ChevronDown, ChevronUp, CheckCircle, XCircle,
  AlertCircle, Shield, Car, Edit, BarChart3, Building, MapPin
} from 'lucide-react';
import { claimsAPI } from '../../shared/services/api';
import DataTable from '../../shared/components/DataTable';

const ClientClaims = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [sortBy] = useState('created_at');
  const [sortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    claim_type: '',
    date_from: '',
    date_to: '',
    search: '',
    amount_range: ''
  });

  const loadClaims = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await claimsAPI.list();
      const list = Array.isArray(res.data) ? res.data : res.data?.claims || [];
      setClaims(list);
    } catch (err) {
      setError('Failed to load claims');
      console.error('Error loading claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  // Calculate statistics
  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'pending').length,
    approved: claims.filter(c => c.status === 'approved').length,
    rejected: claims.filter(c => c.status === 'rejected').length,
    totalAmount: claims.reduce((sum, c) => sum + (parseFloat(c.estimated_amount) || 0), 0),
    averageAmount: claims.length > 0 ? claims.reduce((sum, c) => sum + (parseFloat(c.estimated_amount) || 0), 0) / claims.length : 0
  };

  const formatCurrency = (value) => Number(value || 0).toLocaleString('fr-MA');
  const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : '-');
  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');
  
  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const map = {
      pending: 'bg-yellow-900 dark:bg-yellow-900 text-yellow-300 dark:text-yellow-300 border-yellow-700 dark:border-yellow-700',
      approved: 'bg-green-900 dark:bg-green-900 text-green-300 dark:text-green-300 border-green-700 dark:border-green-700',
      rejected: 'bg-red-900 dark:bg-red-900 text-red-300 dark:text-red-300 border-red-700 dark:border-red-700',
      in_review: 'bg-blue-900 dark:bg-blue-900 text-blue-300 dark:text-blue-300 border-blue-700 dark:border-blue-700',
      settled: 'bg-purple-900 dark:bg-purple-900 text-purple-300 dark:text-purple-300 border-purple-700 dark:border-purple-700',
    };
    const cls = map[s] || 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300 border-slate-600 dark:border-slate-600';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  const claimTypeBadge = (type) => {
    const t = (type || '').toLowerCase();
    const map = {
      accident: 'bg-red-900 dark:bg-red-900 text-red-300 dark:text-red-300',
      theft: 'bg-purple-900 dark:bg-purple-900 text-purple-300 dark:text-purple-300',
      vandalism: 'bg-orange-900 dark:bg-orange-900 text-orange-300 dark:text-orange-300',
      fire: 'bg-red-900 dark:bg-red-900 text-red-300 dark:text-red-300',
      natural_disaster: 'bg-blue-900 dark:bg-blue-900 text-blue-300 dark:text-blue-300',
    };
    const cls = map[t] || 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300';
    const displayName = t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
        {displayName}
      </span>
    );
  };

  const getClaimTypeIcon = (type) => {
    const t = (type || '').toLowerCase();
    const map = {
      accident: <Car className="h-4 w-4 text-red-400 dark:text-red-400" />,
      theft: <Shield className="h-4 w-4 text-purple-400 dark:text-purple-400" />,
      vandalism: <AlertTriangle className="h-4 w-4 text-orange-400 dark:text-orange-400" />,
      fire: <AlertCircle className="h-4 w-4 text-red-400 dark:text-red-400" />,
      natural_disaster: <Building className="h-4 w-4 text-blue-400 dark:text-blue-400" />,
    };
    return map[t] || <FileText className="h-4 w-4 text-gray-400 dark:text-gray-400" />;
  };

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowClaimModal(true);
  };

  const handleDownloadClaim = (claim) => {
    // Downloading claim:
    // TODO: Implement actual download functionality
  };

  const handleNewClaim = () => {
    navigate('/claims');
  };

  const handleEditClaim = (claim) => {
    if (claim.status === 'pending') {
      // Edit claim:
      // TODO: Implement edit functionality
    }
  };

  // const handleDeleteClaim = (claim) => {
  //   if (claim.status === 'pending') {
  //     if (window.confirm('Are you sure you want to delete this claim?')) {
  //       // Delete claim:
  //       // TODO: Implement delete functionality
  //     }
  //   }
  // };

  // Filter and sort claims
  const filteredClaims = claims.filter(claim => {
    if (filters.status && claim.status !== filters.status) return false;
    if (filters.claim_type && claim.claim_type !== filters.claim_type) return false;
    if (filters.date_from && new Date(claim.created_at) < new Date(filters.date_from)) return false;
    if (filters.date_to && new Date(claim.created_at) > new Date(filters.date_to)) return false;
    if (filters.amount_range) {
      const [min, max] = filters.amount_range.split('-').map(Number);
      const amount = parseFloat(claim.estimated_amount) || 0;
      if (min && amount < min) return false;
      if (max && amount > max) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        claim.claim_number?.toLowerCase().includes(searchLower) ||
        claim.claim_type?.toLowerCase().includes(searchLower) ||
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

  const columns = [
    { 
      header: 'Claim #', 
      accessor: 'claim_number',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-400 dark:text-gray-400" />
          <span className="font-medium text-white dark:text-white">{value || 'N/A'}</span>
        </div>
      )
    },
    { 
      header: 'Type', 
      accessor: 'claim_type',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getClaimTypeIcon(value)}
          {claimTypeBadge(value)}
        </div>
      )
    },
    { 
      header: 'Amount', 
      accessor: 'estimated_amount',
      render: (value) => (
        <div className="text-right">
          <span className="font-semibold text-white dark:text-white">
            {value ? `${formatCurrency(value)} MAD` : 'N/A'}
          </span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (status) => statusBadge(status)
    },
    { 
      header: 'Date', 
      accessor: 'created_at',
      render: (value) => (
        <div className="text-sm">
          <div className="text-white dark:text-white">{formatDate(value)}</div>
          <div className="text-gray-400 dark:text-gray-400">{new Date(value).toLocaleTimeString()}</div>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewClaim(row)}
            className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-300 dark:hover:text-blue-300 hover:bg-blue-900/20 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDownloadClaim(row)}
            className="p-2 text-green-400 dark:text-green-400 hover:text-green-300 dark:hover:text-green-300 hover:bg-green-900/20 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          {row.status === 'pending' && (
            <button
              onClick={() => handleEditClaim(row)}
              className="p-2 text-orange-400 dark:text-orange-400 hover:text-orange-300 dark:hover:text-orange-300 hover:bg-orange-900/20 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const rows = sortedClaims.map((claim) => ({
    id: claim.id,
    claim_number: claim.claim_number || `CLM-${claim.id}`,
    claim_type: claim.claim_type || claim.type,
    estimated_amount: claim.estimated_amount || claim.amount,
    status: claim.status || 'pending',
    created_at: claim.created_at || claim.submission_date,
    ...claim
  }));

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-slate-900 p-6">
        <div className="bg-red-900 dark:bg-red-900 border border-red-700 dark:border-red-700 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-300 dark:text-red-300 mb-2">Error Loading Claims</h3>
          <p className="text-red-400 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadClaims}
            className="bg-red-600 dark:bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900 p-6 space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">My Claims</h1>
            <p className="text-red-100 text-lg">Track and manage your insurance claims</p>
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
              onClick={loadClaims}
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
        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Claims</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-red-900 dark:bg-red-900 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-400 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 dark:text-green-400 mr-1" />
            <span className="text-green-400 dark:text-green-400 font-medium">Données en temps réel</span>
          </div>
        </div>

        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Pending Review</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-900 dark:bg-yellow-900 rounded-full">
              <Clock className="h-6 w-6 text-yellow-400 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400 dark:text-gray-400">Awaiting processing</span>
          </div>
        </div>

        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Approved</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.approved}</p>
            </div>
            <div className="p-3 bg-green-900 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-400 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400 dark:text-green-400 font-medium">Ready for payment</span>
          </div>
        </div>

        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Amount</p>
              <p className="text-3xl font-bold text-white dark:text-white">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className="p-3 bg-blue-900 dark:bg-blue-900 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-400 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400 dark:text-gray-400">MAD claimed</span>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-slate-800 dark:bg-slate-800 rounded-xl shadow-lg border border-slate-700 dark:border-slate-700">
        <div className="p-6 border-b border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search claims..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-300 dark:text-gray-300 border border-slate-600 dark:border-slate-600 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewClaim}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 dark:bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Claim</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="settled">Settled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Type</label>
                <select
                  value={filters.claim_type}
                  onChange={(e) => setFilters(prev => ({ ...prev, claim_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
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
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">From Date</label>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">To Date</label>
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                />
              </div>
            </div>
          )}

          {showFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Claims Table/Grid */}
        <div className="p-6">
          {viewMode === 'table' ? (
            <DataTable
              title=""
              columns={columns}
              rows={rows}
              loading={loading}
              emptyMessage="No Claims Found"
              emptyDescription="You haven't submitted any claims yet. Click 'New Claim' to get started."
              emptyIcon={AlertTriangle}
              searchable={false}
              sortable={true}
            />
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedClaims.map((claim) => (
                <div key={claim.id} className="bg-slate-700 dark:bg-slate-700 rounded-xl shadow-lg border border-slate-600 dark:border-slate-600 p-6 hover:shadow-xl hover:bg-slate-650 dark:hover:bg-slate-650 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white dark:text-white">{claim.claim_number || `CLM-${claim.id}`}</h3>
                      <p className="text-sm text-gray-300 dark:text-gray-300">{formatDateTime(claim.created_at)}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {statusBadge(claim.status)}
                      {claimTypeBadge(claim.claim_type)}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Type</p>
                      <div className="flex items-center space-x-2">
                        {getClaimTypeIcon(claim.claim_type)}
                        <span className="text-sm text-white dark:text-white">{claim.claim_type || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Amount</p>
                      <p className="text-lg font-semibold text-white dark:text-white">
                        {claim.estimated_amount ? `${formatCurrency(claim.estimated_amount)} MAD` : 'TBD'}
                      </p>
                    </div>
                    
                    {claim.incident_description && (
                      <div>
                        <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Description</p>
                        <p className="text-sm text-white dark:text-white overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{claim.incident_description}</p>
                      </div>
                    )}
                    
                    {claim.incident_location && (
                      <div>
                        <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Location</p>
                        <p className="text-sm text-white dark:text-white">{claim.incident_location}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-600 dark:border-slate-600">
                    <button
                      onClick={() => handleViewClaim(claim)}
                      className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-300 dark:hover:text-blue-300 hover:bg-blue-900/20 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadClaim(claim)}
                      className="p-2 text-green-400 dark:text-green-400 hover:text-green-300 dark:hover:text-green-300 hover:bg-green-900/20 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    {claim.status === 'pending' && (
                      <button
                        onClick={() => handleEditClaim(claim)}
                        className="p-2 text-orange-400 dark:text-orange-400 hover:text-orange-300 dark:hover:text-orange-300 hover:bg-orange-900/20 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Claim Details Modal */}
      {showClaimModal && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 dark:border-slate-700">
            <div className="p-6 border-b border-slate-700 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white dark:text-white">Claim Details</h2>
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Claim Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getClaimTypeIcon(selectedClaim.claim_type)}
                  <div>
                    <h3 className="text-lg font-semibold text-white dark:text-white">
                      {selectedClaim.claim_number}
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-400">
                      {claimTypeBadge(selectedClaim.claim_type)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {statusBadge(selectedClaim.status)}
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                    {formatDateTime(selectedClaim.created_at)}
                  </p>
                </div>
              </div>

              {/* Claim Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white dark:text-white mb-3">Incident Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">
                        Date: {formatDate(selectedClaim.incident_date)}
                      </span>
                    </div>
                    {selectedClaim.incident_location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                        <span className="text-sm text-gray-300 dark:text-gray-300">
                          Location: {selectedClaim.incident_location}
                        </span>
                      </div>
                    )}
                    {selectedClaim.estimated_amount && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                        <span className="text-sm text-gray-300 dark:text-gray-300">
                          Amount: {formatCurrency(selectedClaim.estimated_amount)} MAD
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white dark:text-white mb-3">Description</h4>
                  <p className="text-sm text-gray-300 dark:text-gray-300 bg-slate-700 dark:bg-slate-700 p-3 rounded-lg">
                    {selectedClaim.incident_description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700 dark:border-slate-700">
                <button
                  onClick={() => handleDownloadClaim(selectedClaim)}
                  className="flex items-center space-x-2 px-4 py-2 text-green-400 dark:text-green-400 border border-green-600 dark:border-green-600 rounded-lg hover:bg-green-900/20 dark:hover:bg-green-900/20 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                {selectedClaim.status === 'pending' && (
                  <button
                    onClick={() => handleEditClaim(selectedClaim)}
                    className="flex items-center space-x-2 px-4 py-2 text-orange-400 dark:text-orange-400 border border-orange-600 dark:border-orange-600 rounded-lg hover:bg-orange-900/20 dark:hover:bg-orange-900/20 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="px-4 py-2 bg-slate-600 dark:bg-slate-600 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientClaims;