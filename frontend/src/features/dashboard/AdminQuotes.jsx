import { useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, Mail, Download, Eye, Search, Filter, RefreshCw, 
  Clock, TrendingUp, DollarSign, AlertCircle, 
  ChevronDown, ChevronUp, FileText, Star,
  BarChart3
} from 'lucide-react';
import { quotesAPI } from '../../shared/services/api';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [sortBy, setSortBy] = useState('created_at');
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
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0,
    totalValue: 0,
    avgPremium: 0
  });

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching quotes from API with filters:', filters);
        const response = await quotesAPI.getAll(filters);
      console.log('API response:', response);
      
      // Extract quotes data from response
      const quotesData = response.data?.quotes || response.quotes || [];
      console.log('Quotes data from database:', quotesData);
      
      setQuotes(quotesData);
      
      // Calculate statistics
      const total = quotesData.length;
      const pending = quotesData.filter(q => q.status === 'pending').length;
      const approved = quotesData.filter(q => q.status === 'approved').length;
      const rejected = quotesData.filter(q => q.status === 'rejected').length;
      const expired = quotesData.filter(q => q.status === 'expired').length;
      const totalValue = quotesData.reduce((sum, q) => sum + (Number(q.final_premium) || 0), 0);
      const avgPremium = total > 0 ? totalValue / total : 0;
      
      setStats({
        total,
        pending,
        approved,
        rejected,
        expired,
        totalValue,
        avgPremium
      });
      
    } catch (err) {
      console.error('Quotes fetch error:', err);
      setError('Failed to load quotes from database. Please check your connection and try again.');
      setQuotes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Quote action handlers
  const handleViewQuote = (quote) => {
    setSelectedQuote(quote);
    setShowQuoteModal(true);
  };

  const handleApproveQuote = async (quoteId) => {
    setActionLoading(true);
    try {
      console.log('Approving quote:', quoteId);
      // Call real API to approve quote
      const response = await quotesAPI.updateStatus(quoteId, 'approved', 'Quote approved by admin');
      console.log('Approve response:', response);
      alert('Quote approved successfully! Email sent to customer.');
      fetchQuotes(); // Refresh data from database
    } catch (error) {
      console.error('Error approving quote:', error);
      alert('Error approving quote: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectQuote = async (quoteId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setActionLoading(true);
    try {
      console.log('Rejecting quote:', quoteId, 'with reason:', reason);
      // Call real API to reject quote
      const response = await quotesAPI.updateStatus(quoteId, 'rejected', reason);
      console.log('Reject response:', response);
      alert('Quote rejected. Email sent to customer with reason.');
      fetchQuotes(); // Refresh data from database
    } catch (error) {
      console.error('Error rejecting quote:', error);
      alert('Error rejecting quote: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async (quoteId, customerEmail) => {
    if (!customerEmail) {
      alert('Aucune adresse email disponible pour ce client.');
      return;
    }

    setActionLoading(true);
    try {
      console.log('Sending email for quote:', quoteId, 'to:', customerEmail);
      
      // Call real API to send email
      const response = await quotesAPI.sendEmail(quoteId, 'status_update');
      console.log('Email API response:', response);
      
      // Show success message with email details
      alert(`✅ Email envoyé avec succès!\n\nDestinataire: ${response.data.recipient}\nSujet: ${response.data.subject}\nDevis: ${response.data.quoteNumber}\n\nL'email a été envoyé au client avec les détails du devis.`);
      
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert('❌ Erreur lors de l\'envoi de l\'email: ' + errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGeneratePDF = async (quoteId) => {
    setActionLoading(true);
    try {
      console.log('Generating PDF for quote:', quoteId);
      
      // Call real API to generate PDF
      const response = await quotesAPI.generatePDF(quoteId);
      console.log('PDF API response:', response);
      
      // Create blob from response data
      const blob = new Blob([response.data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from response headers or create a descriptive one
      const contentDisposition = response.headers['content-disposition'];
      let filename = `Devis_${quoteId}_${Date.now()}.txt`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      alert(`✅ PDF généré avec succès!\n\nFichier: ${filename}\n\nLe document PDF complet a été téléchargé avec tous les détails du devis.`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert('❌ Erreur lors de la génération du PDF: ' + errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredQuotes = quotes.filter(quote => {
    if (filters.status && quote.status !== filters.status) return false;
    if (filters.type && quote.type !== filters.type) return false;
    if (filters.coverage_type && quote.coverage_type !== filters.coverage_type) return false;
    if (filters.date_from && new Date(quote.created_at) < new Date(filters.date_from)) return false;
    if (filters.date_to && new Date(quote.created_at) > new Date(filters.date_to)) return false;
    if (filters.premium_range) {
      const premium = Number(quote.final_premium) || 0;
      const [min, max] = filters.premium_range.split('-').map(Number);
      if (min && premium < min) return false;
      if (max && premium > max) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        quote.quote_number?.toLowerCase().includes(searchLower) ||
        quote.customer_name?.toLowerCase().includes(searchLower) ||
        quote.customer_email?.toLowerCase().includes(searchLower) ||
        quote.vehicle_model?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'created_at') {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white space-y-6 animate-fade-in p-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quote Management</h1>
            <p className="text-blue-100 text-lg">Comprehensive quote management and analytics dashboard</p>
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
              onClick={fetchQuotes}
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
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Total Quotes</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-900 rounded-full">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400 font-medium">+12% from last month</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-900 rounded-full">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-yellow-400 font-medium">Requires attention</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Approved</p>
              <p className="text-3xl font-bold text-green-400">{stats.approved}</p>
            </div>
            <div className="p-3 bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Star className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400 font-medium">Ready for policy</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Total Value</p>
              <p className="text-3xl font-bold text-purple-400">{stats.totalValue.toLocaleString()} MAD</p>
            </div>
            <div className="p-3 bg-purple-900 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-purple-400 mr-1" />
            <span className="text-purple-400 font-medium">Avg: {stats.avgPremium.toLocaleString()} MAD</span>
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
                  placeholder="Search quotes, customers, vehicles..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10 w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Date From</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date To</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Premium Range</label>
              <select
                value={filters.premium_range}
                onChange={(e) => setFilters({...filters, premium_range: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full flex items-center justify-center space-x-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes Display */}
      {viewMode === 'table' ? (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Quotes ({filteredQuotes.length})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1 text-sm"
                >
                  <option value="created_at">Date</option>
                  <option value="final_premium">Premium</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quote #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coverage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Premium</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {sortedQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {quote.quote_number || `QUO-${quote.id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{quote.customer_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-300">{quote.customer_email || 'customer@example.com'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {quote.vehicle_model || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                        {quote.type || 'car'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                        {quote.coverage_type || 'standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div>
                        <div className="font-medium">{Number(quote.final_premium || 0).toLocaleString()} MAD</div>
                        <div className="text-xs text-gray-300">{Number(quote.monthly_premium || 0).toLocaleString()}/mo</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        quote.status === 'approved' ? 'bg-green-900 text-green-300' :
                        quote.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                        quote.status === 'rejected' ? 'bg-red-900 text-red-300' :
                        quote.status === 'expired' ? 'bg-gray-700 text-gray-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {quote.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewQuote(quote)}
                          className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {quote.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveQuote(quote.id)}
                              disabled={actionLoading}
                              className="p-1 text-green-400 hover:text-green-300 hover:bg-green-900 rounded disabled:opacity-50"
                              title="Approve Quote"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRejectQuote(quote.id)}
                              disabled={actionLoading}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded disabled:opacity-50"
                              title="Reject Quote"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleSendEmail(quote.id, quote.customer_email)}
                          disabled={actionLoading}
                          className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900 rounded-lg disabled:opacity-50 transition-all duration-200 hover:scale-105"
                          title={`Envoyer un email à ${quote.customer_email || 'le client'}`}
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleGeneratePDF(quote.id)}
                          disabled={actionLoading}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded-lg disabled:opacity-50 transition-all duration-200 hover:scale-105"
                          title="Générer un PDF du devis"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {sortedQuotes.map((quote) => (
            <div key={quote.id} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4 lg:p-6 hover:shadow-xl hover:bg-gray-750 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{quote.quote_number || `QUO-${quote.id}`}</h3>
                  <p className="text-sm text-gray-300">{new Date(quote.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  quote.status === 'approved' ? 'bg-green-900 text-green-300' :
                  quote.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                  quote.status === 'rejected' ? 'bg-red-900 text-red-300' :
                  quote.status === 'expired' ? 'bg-gray-700 text-gray-300' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {quote.status || 'pending'}
                </span>
              </div>
              
              <div className="space-y-3 mb-4 flex-1">
                <div>
                  <p className="text-sm font-medium text-gray-300">Customer</p>
                  <p className="text-sm text-white">{quote.customer_name || 'Unknown'}</p>
                  <p className="text-xs text-gray-400">{quote.customer_email || 'customer@example.com'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-300">Vehicle</p>
                  <p className="text-sm text-white">{quote.vehicle_model || 'N/A'}</p>
                  <div className="flex space-x-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-300">
                      {quote.type || 'car'}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-900 text-purple-300">
                      {quote.coverage_type || 'standard'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-300">Premium</p>
                  <p className="text-lg font-semibold text-white">{Number(quote.final_premium || 0).toLocaleString()} MAD</p>
                  <p className="text-xs text-gray-400">{Number(quote.monthly_premium || 0).toLocaleString()} MAD/month</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                {/* Primary Action - Always visible */}
                <div className="mb-3">
                  <button
                    onClick={() => handleViewQuote(quote)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
                
                {/* Status Actions - Only show for pending quotes */}
                {quote.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={() => handleApproveQuote(quote.id)}
                      disabled={actionLoading}
                      className="flex items-center justify-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectQuote(quote.id)}
                      disabled={actionLoading}
                      className="flex items-center justify-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
                
                {/* Utility Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSendEmail(quote.id, quote.customer_email)}
                    disabled={actionLoading}
                    className="flex items-center justify-center space-x-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    title={`Envoyer un email à ${quote.customer_email || 'le client'}`}
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </button>
                  <button
                    onClick={() => handleGeneratePDF(quote.id)}
                    disabled={actionLoading}
                    className="flex items-center justify-center space-x-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    title="Générer un PDF du devis"
                  >
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote Details Modal */}
      {showQuoteModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Quote Details - {selectedQuote.quote_number}</h3>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Customer</label>
                  <p className="mt-1 text-sm text-white">{selectedQuote.customer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <p className="mt-1 text-sm text-white">{selectedQuote.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Vehicle</label>
                  <p className="mt-1 text-sm text-white">{selectedQuote.vehicle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Type</label>
                  <p className="mt-1 text-sm text-white capitalize">{selectedQuote.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Coverage</label>
                  <p className="mt-1 text-sm text-white capitalize">{selectedQuote.coverage_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedQuote.status === 'approved' ? 'bg-green-900 text-green-300' :
                    selectedQuote.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                    selectedQuote.status === 'rejected' ? 'bg-red-900 text-red-300' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {selectedQuote.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Final Premium</label>
                  <p className="mt-1 text-sm text-white">{Number(selectedQuote.final_premium || 0).toLocaleString()} MAD</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Monthly Premium</label>
                  <p className="mt-1 text-sm text-white">{Number(selectedQuote.monthly_premium || 0).toLocaleString()} MAD</p>
                </div>
              </div>
              
              {selectedQuote.admin_comment && (
                <div>
                  <label className="block text-sm font-medium text-gray-300">Admin Comment</label>
                  <p className="mt-1 text-sm text-white bg-gray-700 p-3 rounded">{selectedQuote.admin_comment}</p>
                </div>
              )}
              
              {selectedQuote.calculation_details && (
                <div>
                  <label className="block text-sm font-medium text-gray-300">Calculation Details</label>
                  <div className="mt-1 text-sm text-white bg-gray-700 p-3 rounded">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(selectedQuote.calculation_details), null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              {selectedQuote.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApproveQuote(selectedQuote.id);
                      setShowQuoteModal(false);
                    }}
                    disabled={actionLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => {
                      handleRejectQuote(selectedQuote.id);
                      setShowQuoteModal(false);
                    }}
                    disabled={actionLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </>
              )}
              <button
                onClick={() => handleSendEmail(selectedQuote.id, selectedQuote.customer_email)}
                disabled={actionLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 hover:scale-105"
              >
                <Mail className="h-4 w-4" />
                <span>Envoyer Email</span>
              </button>
              <button
                onClick={() => handleGeneratePDF(selectedQuote.id)}
                disabled={actionLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span>Générer PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;
