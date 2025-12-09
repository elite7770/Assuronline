import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Filter,
  ChevronDown,
  ChevronUp,
  Car,
  Bike,
  BarChart3,
  Download
} from 'lucide-react';
import { quotesAPI } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';
import DataTable from '../../shared/components/DataTable';

const ClientQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [sortBy] = useState('created_at');
  const [sortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    date_from: '',
    date_to: '',
    search: '',
    premium_range: ''
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const loadQuotes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await quotesAPI.getMyQuotes({
        status: filters.status || undefined,
        type: filters.type || undefined,
        search: filters.search || undefined,
      });
      
      // Ensure quotes is always an array
      let quotesData = [];
      if (res.data) {
        if (Array.isArray(res.data)) {
          quotesData = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          quotesData = res.data.data;
        } else if (res.data.quotes && Array.isArray(res.data.quotes)) {
          quotesData = res.data.quotes;
        }
      }
      
      setQuotes(quotesData);
    } catch (err) {
      setError('Failed to load quotes');
      console.error('Error loading quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadQuotes();
    }
  }, [user, filters]);

  // Calculate statistics
  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    approved: quotes.filter(q => q.status === 'approved').length,
    rejected: quotes.filter(q => q.status === 'rejected').length,
    draft: quotes.filter(q => q.status === 'draft').length,
    totalPremium: quotes.reduce((sum, q) => sum + (parseFloat(q.final_premium) || 0), 0),
    averagePremium: quotes.length > 0 ? quotes.reduce((sum, q) => sum + (parseFloat(q.final_premium) || 0), 0) / quotes.length : 0
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'draft':
        return <Edit className="w-4 h-4 text-gray-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: 'Brouillon', class: 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300' },
      pending: { label: 'En Attente', class: 'bg-yellow-900 dark:bg-yellow-900 text-yellow-300 dark:text-yellow-300' },
      approved: { label: 'Approuvé', class: 'bg-green-900 dark:bg-green-900 text-green-300 dark:text-green-300' },
      rejected: { label: 'Rejeté', class: 'bg-red-900 dark:bg-red-900 text-red-300 dark:text-red-300' },
      expired: { label: 'Expiré', class: 'bg-orange-900 dark:bg-orange-900 text-orange-300 dark:text-orange-300' },
    };
    
    const statusInfo = statusMap[status] || { label: status, class: 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300' };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.class}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{statusInfo.label}</span>
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewQuote = (quote) => {
    setSelectedQuote(quote);
    setShowQuoteModal(true);
  };

  const handleEditQuote = (quoteId) => {
    navigate(`/client/quotes/${quoteId}/edit`);
  };

  const handleDeleteQuote = async (quoteId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      try {
        await quotesAPI.delete(quoteId);
        setQuotes((Array.isArray(quotes) ? quotes : []).filter(q => q.id !== quoteId));
      } catch (err) {
        console.error('Error deleting quote:', err);
        setError('Erreur lors de la suppression du devis');
      }
    }
  };

  const handleDownloadQuote = (quote) => {
    // Downloading quote:
    // TODO: Implement actual download functionality
  };

  // Filter and sort quotes
  const filteredQuotes = quotes.filter(quote => {
    if (filters.status && quote.status !== filters.status) return false;
    if (filters.type && quote.type !== filters.type) return false;
    if (filters.date_from && new Date(quote.created_at) < new Date(filters.date_from)) return false;
    if (filters.date_to && new Date(quote.created_at) > new Date(filters.date_to)) return false;
    if (filters.premium_range) {
      const [min, max] = filters.premium_range.split('-').map(Number);
      const premium = parseFloat(quote.final_premium) || 0;
      if (min && premium < min) return false;
      if (max && premium > max) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        quote.quote_number?.toLowerCase().includes(searchLower) ||
        quote.type?.toLowerCase().includes(searchLower) ||
        quote.coverage_type?.toLowerCase().includes(searchLower) ||
        quote.final_premium?.toString().includes(searchLower)
      );
    }
    return true;
  });

  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'created_at' || sortBy === 'updated_at') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (sortBy === 'final_premium') {
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
      type: '',
      date_from: '',
      date_to: '',
      search: '',
      premium_range: ''
    });
  };

  const columns = [
    { 
      header: 'Quote #', 
      accessor: 'quote_number',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-400 dark:text-gray-400" />
          <span className="font-medium text-white dark:text-white">
            {value || 'N/A'}
          </span>
        </div>
      )
    },
    { 
      header: 'Type', 
      accessor: 'type',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {value === 'car' ? <Car className="h-4 w-4 text-blue-400 dark:text-blue-400" /> : <Bike className="h-4 w-4 text-blue-400 dark:text-blue-400" />}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 dark:bg-blue-900 text-blue-300 dark:text-blue-300">
            {value === 'car' ? 'Auto' : 'Moto'}
          </span>
        </div>
      )
    },
    { 
      header: 'Coverage', 
      accessor: 'coverage_type',
      render: (value) => (
        <div className="text-sm text-white dark:text-white">
          {value || 'Standard'}
        </div>
      )
    },
    { 
      header: 'Premium', 
      accessor: 'final_premium',
      render: (value) => (
        <div className="text-right">
          <span className="font-semibold text-white dark:text-white">
            {value ? formatCurrency(value) : 'TBD'}
          </span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (status) => getStatusBadge(status)
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
            onClick={() => handleViewQuote(row)}
            className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-300 dark:hover:text-blue-300 hover:bg-blue-900 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDownloadQuote(row)}
            className="p-2 text-green-400 dark:text-green-400 hover:text-green-300 dark:hover:text-green-300 hover:bg-green-900 dark:hover:bg-green-900 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          {row.status === 'draft' && (
            <button
              onClick={() => handleEditQuote(row.id)}
              className="p-2 text-orange-400 dark:text-orange-400 hover:text-orange-300 dark:hover:text-orange-300 hover:bg-orange-900 dark:hover:bg-orange-900 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {row.status === 'draft' && (
            <button
              onClick={() => handleDeleteQuote(row.id)}
              className="p-2 text-red-400 dark:text-red-400 hover:text-red-300 dark:hover:text-red-300 hover:bg-red-900 dark:hover:bg-red-900 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const rows = sortedQuotes.map((quote) => ({
    id: quote.id,
    quote_number: quote.quote_number || `QUO-${quote.id}`,
    type: quote.type,
    coverage_type: quote.coverage_type,
    final_premium: quote.final_premium,
    status: quote.status || 'draft',
    created_at: quote.created_at,
    ...quote
  }));

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-slate-900 p-6">
        <div className="bg-red-900 dark:bg-red-900 border border-red-700 dark:border-red-700 rounded-lg p-6 text-center">
          <FileText className="h-12 w-12 text-red-400 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-300 dark:text-red-300 mb-2">Error Loading Quotes</h3>
          <p className="text-red-400 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadQuotes}
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
            <h1 className="text-3xl font-bold mb-2 text-white">Mes Devis</h1>
            <p className="text-blue-100 text-lg">Gérez vos devis d'assurance</p>
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
              onClick={loadQuotes}
              disabled={loading}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => navigate('/devis')}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau Devis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Devis</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-900 dark:bg-blue-900 rounded-full">
              <FileText className="h-6 w-6 text-blue-400 dark:text-blue-400" />
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
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">En Attente</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-900 dark:bg-yellow-900 rounded-full">
              <Clock className="h-6 w-6 text-yellow-400 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-yellow-400 dark:text-yellow-400 font-medium">En cours de traitement</span>
          </div>
        </div>

        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Approuvés</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.approved}</p>
            </div>
            <div className="p-3 bg-green-900 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-400 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400 dark:text-green-400 font-medium">Prêts pour la police</span>
          </div>
        </div>

        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Prime Moyenne</p>
              <p className="text-3xl font-bold text-white dark:text-white">{formatCurrency(stats.averagePremium)}</p>
            </div>
            <div className="p-3 bg-purple-900 dark:bg-purple-900 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-400 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400 dark:text-gray-400">MAD par devis</span>
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
                  placeholder="Rechercher des devis..."
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
                <span>Filtres</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                >
                  <option value="">Tous les statuts</option>
                  <option value="draft">Brouillon</option>
                  <option value="pending">En Attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                  <option value="expired">Expiré</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                >
                  <option value="">Tous les types</option>
                  <option value="car">Auto</option>
                  <option value="motorcycle">Moto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Date de début</label>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Date de fin</label>
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
                Effacer les filtres
              </button>
            </div>
          )}
        </div>

        {/* Quotes Table/Grid */}
        <div className="p-6">
          {viewMode === 'table' ? (
            <DataTable
              title=""
              columns={columns}
              rows={rows}
              loading={loading}
              emptyMessage="Aucun Devis Trouvé"
              emptyDescription="Vous n'avez pas encore créé de devis. Cliquez sur 'Nouveau Devis' pour commencer."
              emptyIcon={FileText}
              searchable={false}
              sortable={true}
            />
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedQuotes.map((quote) => (
                <div key={quote.id} className="bg-slate-700 dark:bg-slate-700 rounded-xl shadow-lg border border-slate-600 dark:border-slate-600 p-6 hover:shadow-xl hover:bg-slate-650 dark:hover:bg-slate-650 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white dark:text-white">{quote.quote_number || `QUO-${quote.id}`}</h3>
                      <p className="text-sm text-gray-300 dark:text-gray-300">{formatDate(quote.created_at)}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {getStatusBadge(quote.status)}
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 dark:bg-blue-900 text-blue-300 dark:text-blue-300">
                        {quote.type === 'car' ? <Car className="h-3 w-3 mr-1" /> : <Bike className="h-3 w-3 mr-1" />}
                        {quote.type === 'car' ? 'Auto' : 'Moto'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Type</p>
                      <div className="flex items-center space-x-2">
                        {quote.type === 'car' ? <Car className="h-4 w-4 text-blue-400 dark:text-blue-400" /> : <Bike className="h-4 w-4 text-blue-400 dark:text-blue-400" />}
                        <span className="text-sm text-white dark:text-white">{quote.type === 'car' ? 'Auto' : 'Moto'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Coverage</p>
                      <p className="text-sm text-white dark:text-white">{quote.coverage_type || 'Standard'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Premium</p>
                      <p className="text-lg font-semibold text-white dark:text-white">
                        {quote.final_premium ? formatCurrency(quote.final_premium) : 'TBD'}
                      </p>
                    </div>
                    
                    {quote.vehicle_brand && (
                      <div>
                        <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Vehicle</p>
                        <p className="text-sm text-white dark:text-white">{quote.vehicle_brand} {quote.vehicle_model}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-600 dark:border-slate-600">
                    <button
                      onClick={() => handleViewQuote(quote)}
                      className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-300 dark:hover:text-blue-300 hover:bg-blue-900/20 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadQuote(quote)}
                      className="p-2 text-green-400 dark:text-green-400 hover:text-green-300 dark:hover:text-green-300 hover:bg-green-900/20 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    {quote.status === 'draft' && (
                      <button
                        onClick={() => handleEditQuote(quote.id)}
                        className="p-2 text-orange-400 dark:text-orange-400 hover:text-orange-300 dark:hover:text-orange-300 hover:bg-orange-900/20 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {quote.status === 'draft' && (
                      <button
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="p-2 text-red-400 dark:text-red-400 hover:text-red-300 dark:hover:text-red-300 hover:bg-red-900/20 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quote Details Modal */}
      {showQuoteModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 dark:border-slate-700">
            <div className="p-6 border-b border-slate-700 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white dark:text-white">Détails du Devis</h2>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="p-2 text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Quote Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedQuote.type === 'car' ? <Car className="h-6 w-6 text-blue-400 dark:text-blue-400" /> : <Bike className="h-6 w-6 text-blue-400 dark:text-blue-400" />}
                  <div>
                    <h3 className="text-lg font-semibold text-white dark:text-white">
                      {selectedQuote.quote_number || `QUO-${selectedQuote.id}`}
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-400">
                      {selectedQuote.type === 'car' ? 'Auto' : 'Moto'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedQuote.status)}
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                    {formatDate(selectedQuote.created_at)}
                  </p>
                </div>
              </div>

              {/* Quote Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white dark:text-white mb-3">Détails du Devis</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">
                        Prime: {selectedQuote.final_premium ? formatCurrency(selectedQuote.final_premium) : 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">
                        Couverture: {selectedQuote.coverage_type || 'Standard'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white dark:text-white mb-3">Informations</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-400 dark:text-gray-400">Type:</span>
                      <span className="ml-2 text-white dark:text-white">{selectedQuote.type === 'car' ? 'Auto' : 'Moto'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400 dark:text-gray-400">Statut:</span>
                      <span className="ml-2 text-white dark:text-white">{selectedQuote.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700 dark:border-slate-700">
                <button
                  onClick={() => handleDownloadQuote(selectedQuote)}
                  className="flex items-center space-x-2 px-4 py-2 text-green-400 dark:text-green-400 border border-green-600 dark:border-green-600 rounded-lg hover:bg-green-900 dark:hover:bg-green-900 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Télécharger</span>
                </button>
                {selectedQuote.status === 'draft' && (
                  <button
                    onClick={() => handleEditQuote(selectedQuote.id)}
                    className="flex items-center space-x-2 px-4 py-2 text-orange-400 dark:text-orange-400 border border-orange-600 dark:border-orange-600 rounded-lg hover:bg-orange-900 dark:hover:bg-orange-900 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </button>
                )}
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="px-4 py-2 bg-slate-600 dark:bg-slate-600 text-white dark:text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientQuotes;
