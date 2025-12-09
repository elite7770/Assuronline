import { useEffect, useState } from 'react';
import { 
  Shield, RefreshCw, Download, Eye, CheckCircle, XCircle,
  Calendar, DollarSign, TrendingUp, Filter, Search, 
  ChevronDown, ChevronUp, AlertCircle, Car, Bike, Home, Building,
  FileText, BarChart3
} from 'lucide-react';
import { policiesAPI } from '../../shared/services/api';
import DataTable from '../../shared/components/DataTable';

const ClientPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [sortBy] = useState('created_at');
  const [sortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    vehicle_type: '',
    date_from: '',
    date_to: '',
    search: '',
    premium_range: ''
  });

  const loadPolicies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await policiesAPI.list();
      const list = Array.isArray(res.data) ? res.data : res.data?.policies || [];
      setPolicies(list);
    } catch (err) {
      setError('Failed to load policies');
      console.error('Error loading policies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  // Calculate statistics
  const stats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    expired: policies.filter(p => p.status === 'expired').length,
    pending: policies.filter(p => p.status === 'pending').length,
    totalPremium: policies.reduce((sum, p) => sum + (parseFloat(p.premium_amount) || 0), 0),
    averagePremium: policies.length > 0 ? policies.reduce((sum, p) => sum + (parseFloat(p.premium_amount) || 0), 0) / policies.length : 0
  };

  const formatCurrency = (value) => Number(value || 0).toLocaleString('fr-MA');
  const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : '-');
  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');
  
  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const map = {
      active: 'bg-green-900 dark:bg-green-900 text-green-300 dark:text-green-300 border-green-700 dark:border-green-700',
      expired: 'bg-red-900 dark:bg-red-900 text-red-300 dark:text-red-300 border-red-700 dark:border-red-700',
      pending: 'bg-yellow-900 dark:bg-yellow-900 text-yellow-300 dark:text-yellow-300 border-yellow-700 dark:border-yellow-700',
      cancelled: 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300 border-slate-600 dark:border-slate-600',
    };
    const cls = map[s] || 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300 border-slate-600 dark:border-slate-600';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  const vehicleTypeBadge = (type) => {
    const t = (type || '').toLowerCase();
    const map = {
      auto: { icon: <Car className="h-3 w-3 text-blue-400 dark:text-blue-400" />, color: 'bg-blue-900 dark:bg-blue-900 text-blue-300 dark:text-blue-300' },
      moto: { icon: <Bike className="h-3 w-3 text-purple-400 dark:text-purple-400" />, color: 'bg-purple-900 dark:bg-purple-900 text-purple-300 dark:text-purple-300' },
      home: { icon: <Home className="h-3 w-3 text-green-400 dark:text-green-400" />, color: 'bg-green-900 dark:bg-green-900 text-green-300 dark:text-green-300' },
      business: { icon: <Building className="h-3 w-3 text-orange-400 dark:text-orange-400" />, color: 'bg-orange-900 dark:bg-orange-900 text-orange-300 dark:text-orange-300' },
    };
    const config = map[t] || { icon: <Car className="h-3 w-3 text-gray-400 dark:text-gray-400" />, color: 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300' };
    const displayName = t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1">{displayName}</span>
      </span>
    );
  };

  const getVehicleTypeIcon = (type) => {
    const t = (type || '').toLowerCase();
    const map = {
      auto: <Car className="h-4 w-4 text-blue-400 dark:text-blue-400" />,
      moto: <Bike className="h-4 w-4 text-purple-400 dark:text-purple-400" />,
      home: <Home className="h-4 w-4 text-green-400 dark:text-green-400" />,
      business: <Building className="h-4 w-4 text-orange-400 dark:text-orange-400" />,
    };
    return map[t] || <Car className="h-4 w-4 text-gray-400 dark:text-gray-400" />;
  };

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowPolicyModal(true);
  };

  const handleDownloadPolicy = (policy) => {
    // Downloading policy:
    // TODO: Implement actual policy download functionality
  };

  const handleDownloadCertificate = (policy) => {
    // Downloading certificate for policy:
    // TODO: Implement actual certificate download functionality
  };

  const handleRenewPolicy = (policy) => {
    if (policy.status === 'expired' || policy.status === 'active') {
      // Renew policy:
      // TODO: Implement policy renewal functionality
    }
  };

  // Filter and sort policies
  const filteredPolicies = policies.filter(policy => {
    if (filters.status && policy.status !== filters.status) return false;
    if (filters.vehicle_type && policy.vehicle_type !== filters.vehicle_type) return false;
    if (filters.date_from && new Date(policy.start_date) < new Date(filters.date_from)) return false;
    if (filters.date_to && new Date(policy.start_date) > new Date(filters.date_to)) return false;
    if (filters.premium_range) {
      const [min, max] = filters.premium_range.split('-').map(Number);
      const premium = parseFloat(policy.premium_amount) || 0;
      if (min && premium < min) return false;
      if (max && premium > max) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        policy.policy_number?.toLowerCase().includes(searchLower) ||
        policy.vehicle_model?.toLowerCase().includes(searchLower) ||
        policy.vehicle_brand?.toLowerCase().includes(searchLower) ||
        policy.vehicle_type?.toLowerCase().includes(searchLower) ||
        policy.premium_amount?.toString().includes(searchLower)
      );
    }
    return true;
  });

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'created_at' || sortBy === 'start_date' || sortBy === 'end_date') {
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

  const clearFilters = () => {
    setFilters({
      status: '',
      vehicle_type: '',
      date_from: '',
      date_to: '',
      search: '',
      premium_range: ''
    });
  };

  const columns = [
    { 
      header: 'Policy #', 
      accessor: 'policy_number',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-gray-400 dark:text-gray-400" />
          <span className="font-medium text-white dark:text-white">
            {value || `POL-${row.id}`}
          </span>
        </div>
      )
    },
    { 
      header: 'Vehicle', 
      accessor: 'vehicle_model',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          {getVehicleTypeIcon(row.vehicle_type)}
          <div>
            <div className="font-medium text-white dark:text-white">
              {row.vehicle_brand} {value}
            </div>
            {vehicleTypeBadge(row.vehicle_type)}
          </div>
        </div>
      )
    },
    { 
      header: 'Premium', 
      accessor: 'premium_amount',
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
      header: 'Period', 
      accessor: 'start_date',
      render: (value, row) => (
        <div className="text-sm">
          <div className="text-white dark:text-white">
            {formatDate(value)} - {formatDate(row.end_date)}
          </div>
          <div className="text-gray-400 dark:text-gray-400">
            {row.status === 'active' ? 'Active' : row.status}
          </div>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewPolicy(row)}
            className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-300 dark:hover:text-blue-300 hover:bg-blue-900 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDownloadPolicy(row)}
            className="p-2 text-green-400 dark:text-green-400 hover:text-green-300 dark:hover:text-green-300 hover:bg-green-900 dark:hover:bg-green-900 rounded-lg transition-colors"
            title="Download Policy"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDownloadCertificate(row)}
            className="p-2 text-purple-400 dark:text-purple-400 hover:text-purple-300 dark:hover:text-purple-300 hover:bg-purple-900 dark:hover:bg-purple-900 rounded-lg transition-colors"
            title="Download Certificate"
          >
            <FileText className="h-4 w-4" />
          </button>
          {(row.status === 'expired' || row.status === 'active') && (
            <button
              onClick={() => handleRenewPolicy(row)}
              className="p-2 text-orange-400 dark:text-orange-400 hover:text-orange-300 dark:hover:text-orange-300 hover:bg-orange-900 dark:hover:bg-orange-900 rounded-lg transition-colors"
              title="Renew Policy"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const rows = sortedPolicies.map((policy) => ({
    id: policy.id,
    policy_number: policy.policy_number || `POL-${policy.id}`,
    vehicle_model: policy.vehicle_model || policy.vehicle?.model,
    vehicle_brand: policy.vehicle_brand || policy.vehicle?.brand,
    vehicle_type: policy.vehicle_type || policy.vehicle?.type,
    premium_amount: policy.premium_amount || policy.amount,
    status: policy.status || 'active',
    start_date: policy.start_date || policy.startDate,
    end_date: policy.end_date || policy.endDate,
    created_at: policy.created_at,
    ...policy
  }));

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-slate-900 p-6">
        <div className="bg-red-900 dark:bg-red-900 border border-red-700 dark:border-red-700 rounded-lg p-6 text-center">
          <Shield className="h-12 w-12 text-red-400 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-300 dark:text-red-300 mb-2">Error Loading Policies</h3>
          <p className="text-red-400 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadPolicies}
            className="bg-red-600 dark:bg-red-600 text-white dark:text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-700 transition-colors"
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">My Policies</h1>
            <p className="text-blue-100 text-lg">Manage your insurance policies and coverage</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
            >
              {viewMode === 'table' ? <BarChart3 className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
              <span>{viewMode === 'table' ? 'Grid View' : 'Table View'}</span>
            </button>
            <button
              onClick={loadPolicies}
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
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Policies</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-900 dark:bg-blue-900 rounded-full">
              <Shield className="h-6 w-6 text-blue-400 dark:text-blue-400" />
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
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Active</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-900 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-400 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400 dark:text-green-400 font-medium">Currently protected</span>
          </div>
        </div>

        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Expired</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.expired}</p>
            </div>
            <div className="p-3 bg-red-900 dark:bg-red-900 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-400 dark:text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-400 dark:text-red-400 font-medium">Need renewal</span>
          </div>
        </div>

        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Premium</p>
              <p className="text-3xl font-bold text-white dark:text-white">{formatCurrency(stats.totalPremium)}</p>
            </div>
            <div className="p-3 bg-purple-900 dark:bg-purple-900 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-400 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400 dark:text-gray-400">MAD per year</span>
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
                  placeholder="Search policies..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
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
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Vehicle Type</label>
                <select
                  value={filters.vehicle_type}
                  onChange={(e) => setFilters(prev => ({ ...prev, vehicle_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="auto">Auto</option>
                  <option value="moto">Moto</option>
                  <option value="home">Home</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">From Date</label>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">To Date</label>
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
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

        {/* Policies Table/Grid */}
        <div className="p-6">
          {viewMode === 'table' ? (
            <DataTable
              title=""
              columns={columns}
              rows={rows}
              loading={loading}
              emptyMessage="No Policies Found"
              emptyDescription="Vous n'avez pas encore de polices actives. Créez un devis pour commencer."
              emptyIcon={Shield}
              searchable={false}
              sortable={true}
            />
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPolicies.map((policy) => (
                <div key={policy.id} className="bg-slate-700 dark:bg-slate-700 rounded-xl shadow-lg border border-slate-600 dark:border-slate-600 p-6 hover:shadow-xl hover:bg-slate-650 dark:hover:bg-slate-650 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white dark:text-white">{policy.policy_number || `POL-${policy.id}`}</h3>
                      <p className="text-sm text-gray-300 dark:text-gray-300">{formatDate(policy.start_date)} - {formatDate(policy.end_date)}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {statusBadge(policy.status)}
                      {vehicleTypeBadge(policy.vehicle_type)}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Vehicle</p>
                      <div className="flex items-center space-x-2">
                        {getVehicleTypeIcon(policy.vehicle_type)}
                        <span className="text-sm text-white dark:text-white">{policy.vehicle_brand} {policy.vehicle_model}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Premium</p>
                      <p className="text-lg font-semibold text-white dark:text-white">
                        {policy.premium_amount ? `${formatCurrency(policy.premium_amount)} MAD` : 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Type</p>
                      <p className="text-sm text-white dark:text-white">{policy.vehicle_type || 'Auto'}</p>
                    </div>
                    
                    {policy.coverage_type && (
                      <div>
                        <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Coverage</p>
                        <p className="text-sm text-white dark:text-white">{policy.coverage_type}</p>
                      </div>
                    )}
                    
                    {policy.deductible && (
                      <div>
                        <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Deductible</p>
                        <p className="text-sm text-white dark:text-white">{formatCurrency(policy.deductible)} MAD</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-600 dark:border-slate-600">
                    <button
                      onClick={() => handleViewPolicy(policy)}
                      className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-300 dark:hover:text-blue-300 hover:bg-blue-900/20 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadPolicy(policy)}
                      className="p-2 text-green-400 dark:text-green-400 hover:text-green-300 dark:hover:text-green-300 hover:bg-green-900/20 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Download Policy"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadCertificate(policy)}
                      className="p-2 text-purple-400 dark:text-purple-400 hover:text-purple-300 dark:hover:text-purple-300 hover:bg-purple-900/20 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                      title="Download Certificate"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    {(policy.status === 'expired' || policy.status === 'active') && (
                      <button
                        onClick={() => handleRenewPolicy(policy)}
                        className="p-2 text-orange-400 dark:text-orange-400 hover:text-orange-300 dark:hover:text-orange-300 hover:bg-orange-900/20 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        title="Renew Policy"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Policy Details Modal */}
      {showPolicyModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 dark:border-slate-700">
            <div className="p-6 border-b border-slate-700 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white dark:text-white">Policy Details</h2>
                <button
                  onClick={() => setShowPolicyModal(false)}
                  className="p-2 text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Policy Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getVehicleTypeIcon(selectedPolicy.vehicle_type)}
                  <div>
                    <h3 className="text-lg font-semibold text-white dark:text-white">
                      {selectedPolicy.policy_number || `POL-${selectedPolicy.id}`}
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-400">
                      {vehicleTypeBadge(selectedPolicy.vehicle_type)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {statusBadge(selectedPolicy.status)}
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                    {formatDateTime(selectedPolicy.created_at)}
                  </p>
                </div>
              </div>

              {/* Policy Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white dark:text-white mb-3">Vehicle Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">
                        {selectedPolicy.vehicle_brand} {selectedPolicy.vehicle_model}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">
                        Premium: {formatCurrency(selectedPolicy.premium_amount)} MAD
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">
                        Period: {formatDate(selectedPolicy.start_date)} - {formatDate(selectedPolicy.end_date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white dark:text-white mb-3">Coverage Details</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-400 dark:text-gray-400">Policy Type:</span>
                      <span className="ml-2 text-white dark:text-white">{selectedPolicy.vehicle_type || 'Auto'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400 dark:text-gray-400">Coverage:</span>
                      <span className="ml-2 text-white dark:text-white">{selectedPolicy.coverage_type || 'Standard'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400 dark:text-gray-400">Deductible:</span>
                      <span className="ml-2 text-white dark:text-white">{selectedPolicy.deductible ? `${formatCurrency(selectedPolicy.deductible)} MAD` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700 dark:border-slate-700">
                <button
                  onClick={() => handleDownloadPolicy(selectedPolicy)}
                  className="flex items-center space-x-2 px-4 py-2 text-green-400 dark:text-green-400 border border-green-600 dark:border-green-600 rounded-lg hover:bg-green-900 dark:hover:bg-green-900 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Policy</span>
                </button>
                <button
                  onClick={() => handleDownloadCertificate(selectedPolicy)}
                  className="flex items-center space-x-2 px-4 py-2 text-purple-400 dark:text-purple-400 border border-purple-600 dark:border-purple-600 rounded-lg hover:bg-purple-900 dark:hover:bg-purple-900 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Certificate</span>
                </button>
                {(selectedPolicy.status === 'expired' || selectedPolicy.status === 'active') && (
                  <button
                    onClick={() => handleRenewPolicy(selectedPolicy)}
                    className="flex items-center space-x-2 px-4 py-2 text-orange-400 dark:text-orange-400 border border-orange-600 dark:border-orange-600 rounded-lg hover:bg-orange-900 dark:hover:bg-orange-900 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Renew</span>
                  </button>
                )}
                <button
                  onClick={() => setShowPolicyModal(false)}
                  className="px-4 py-2 bg-slate-600 dark:bg-slate-600 text-white dark:text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
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

export default ClientPolicies;