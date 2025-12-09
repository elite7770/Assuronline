import { useEffect, useState } from 'react';
import { 
  CreditCard, RefreshCw, Download, Eye, CheckCircle, XCircle,
  Calendar, Clock, DollarSign, TrendingUp, Filter, Search, 
  ChevronDown, ChevronUp, AlertCircle, Shield,
  BarChart3, FileText, Receipt,
  Banknote, Wallet
} from 'lucide-react';
import { paymentsAPI } from '../../shared/services/api';
import DataTable from '../../shared/components/DataTable';

const ClientPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [sortBy] = useState('created_at');
  const [sortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    payment_type: '',
    payment_method: '',
    date_from: '',
    date_to: '',
    search: '',
    amount_range: ''
  });

  const loadPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await paymentsAPI.list();
      const list = Array.isArray(res.data) ? res.data : res.data?.payments || [];
      setPayments(list);
    } catch (err) {
      setError('Failed to load payments');
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Calculate statistics
  const stats = {
    total: payments.length,
    paid: payments.filter(p => p.status === 'paid').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
    paidAmount: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
    averageAmount: payments.length > 0 ? payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0) / payments.length : 0
  };

  const formatCurrency = (value) => Number(value || 0).toLocaleString('fr-MA');
  const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : '-');
  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');
  
  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const map = {
      paid: 'bg-green-900 dark:bg-green-900 text-green-300 dark:text-green-300 border-green-700 dark:border-green-700',
      pending: 'bg-yellow-900 dark:bg-yellow-900 text-yellow-300 dark:text-yellow-300 border-yellow-700 dark:border-yellow-700',
      failed: 'bg-red-900 dark:bg-red-900 text-red-300 dark:text-red-300 border-red-700 dark:border-red-700',
      cancelled: 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300 border-slate-600 dark:border-slate-600',
    };
    const cls = map[s] || 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300 border-slate-600 dark:border-slate-600';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  const paymentTypeBadge = (type) => {
    const t = (type || '').toLowerCase();
    const map = {
      premium: 'bg-blue-900 dark:bg-blue-900 text-blue-300 dark:text-blue-300',
      claim_settlement: 'bg-green-900 dark:bg-green-900 text-green-300 dark:text-green-300',
      refund: 'bg-purple-900 dark:bg-purple-900 text-purple-300 dark:text-purple-300',
      penalty: 'bg-red-900 dark:bg-red-900 text-red-300 dark:text-red-300',
    };
    const cls = map[t] || 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300';
    const displayName = t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
        {displayName}
      </span>
    );
  };

  const paymentMethodBadge = (method) => {
    const m = (method || '').toLowerCase();
    const map = {
      card: { icon: <CreditCard className="h-3 w-3 text-blue-400 dark:text-blue-400" />, color: 'bg-blue-900 dark:bg-blue-900 text-blue-300 dark:text-blue-300' },
      bank_transfer: { icon: <Banknote className="h-3 w-3 text-green-400 dark:text-green-400" />, color: 'bg-green-900 dark:bg-green-900 text-green-300 dark:text-green-300' },
      cash: { icon: <Wallet className="h-3 w-3 text-yellow-400 dark:text-yellow-400" />, color: 'bg-yellow-900 dark:bg-yellow-900 text-yellow-300 dark:text-yellow-300' },
      check: { icon: <FileText className="h-3 w-3 text-purple-400 dark:text-purple-400" />, color: 'bg-purple-900 dark:bg-purple-900 text-purple-300 dark:text-purple-300' },
    };
    const config = map[m] || { icon: <CreditCard className="h-3 w-3 text-gray-400 dark:text-gray-400" />, color: 'bg-slate-700 dark:bg-slate-700 text-gray-300 dark:text-gray-300' };
    const displayName = m.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1">{displayName}</span>
      </span>
    );
  };

  const getPaymentTypeIcon = (type) => {
    const t = (type || '').toLowerCase();
    const map = {
      premium: <Shield className="h-4 w-4 text-blue-400 dark:text-blue-400" />,
      claim_settlement: <CheckCircle className="h-4 w-4 text-green-400 dark:text-green-400" />,
      refund: <RefreshCw className="h-4 w-4 text-purple-400 dark:text-purple-400" />,
      penalty: <AlertCircle className="h-4 w-4 text-red-400 dark:text-red-400" />,
    };
    return map[t] || <CreditCard className="h-4 w-4 text-gray-400 dark:text-gray-400" />;
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const handleDownloadInvoice = (payment) => {
    // Downloading invoice for payment:
    // TODO: Implement actual invoice download functionality
    // paymentsAPI.invoice(payment.id)
  };

  const handleDownloadReceipt = (payment) => {
    // Downloading receipt for payment:
    // TODO: Implement actual receipt download functionality
  };

  const handleRetryPayment = (payment) => {
    if (payment.status === 'failed') {
      // Retrying payment:
      // TODO: Implement payment retry functionality
    }
  };

  // Filter and sort payments
  const filteredPayments = payments.filter(payment => {
    if (filters.status && payment.status !== filters.status) return false;
    if (filters.payment_type && payment.payment_type !== filters.payment_type) return false;
    if (filters.payment_method && payment.payment_method !== filters.payment_method) return false;
    if (filters.date_from && new Date(payment.created_at) < new Date(filters.date_from)) return false;
    if (filters.date_to && new Date(payment.created_at) > new Date(filters.date_to)) return false;
    if (filters.amount_range) {
      const [min, max] = filters.amount_range.split('-').map(Number);
      const amount = parseFloat(payment.amount) || 0;
      if (min && amount < min) return false;
      if (max && amount > max) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        payment.transaction_id?.toLowerCase().includes(searchLower) ||
        payment.payment_type?.toLowerCase().includes(searchLower) ||
        payment.payment_method?.toLowerCase().includes(searchLower) ||
        payment.amount?.toString().includes(searchLower)
      );
    }
    return true;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'created_at' || sortBy === 'paid_date' || sortBy === 'due_date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (sortBy === 'amount') {
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
      payment_type: '',
      payment_method: '',
      date_from: '',
      date_to: '',
      search: '',
      amount_range: ''
    });
  };

  const columns = [
    { 
      header: 'Payment #', 
      accessor: 'transaction_id',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-gray-400 dark:text-gray-400" />
          <span className="font-medium text-white dark:text-white">
            {value || `PAY-${row.id}`}
          </span>
        </div>
      )
    },
    { 
      header: 'Type', 
      accessor: 'payment_type',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getPaymentTypeIcon(value)}
          {paymentTypeBadge(value)}
        </div>
      )
    },
    { 
      header: 'Amount', 
      accessor: 'amount',
      render: (value) => (
        <div className="text-right">
          <span className="font-semibold text-white dark:text-white">
            {value ? `${formatCurrency(value)} MAD` : 'N/A'}
          </span>
        </div>
      )
    },
    { 
      header: 'Method', 
      accessor: 'payment_method',
      render: (value) => paymentMethodBadge(value)
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
            onClick={() => handleViewPayment(row)}
            className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-300 dark:hover:text-blue-300 hover:bg-blue-900/20 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.status === 'paid' && (
            <button
              onClick={() => handleDownloadInvoice(row)}
              className="p-2 text-green-400 dark:text-green-400 hover:text-green-300 dark:hover:text-green-300 hover:bg-green-900/20 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Download Invoice"
            >
              <Receipt className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleDownloadReceipt(row)}
            className="p-2 text-purple-400 dark:text-purple-400 hover:text-purple-300 dark:hover:text-purple-300 hover:bg-purple-900/20 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            title="Download Receipt"
          >
            <Download className="h-4 w-4" />
          </button>
          {row.status === 'failed' && (
            <button
              onClick={() => handleRetryPayment(row)}
              className="p-2 text-orange-400 dark:text-orange-400 hover:text-orange-300 dark:hover:text-orange-300 hover:bg-orange-900/20 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
              title="Retry Payment"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const rows = sortedPayments.map((payment) => ({
    id: payment.id,
    transaction_id: payment.transaction_id || `PAY-${payment.id}`,
    payment_type: payment.payment_type || 'premium',
    amount: payment.amount || payment.total_amount,
    payment_method: payment.payment_method || payment.method,
    status: payment.status || 'pending',
    created_at: payment.created_at || payment.payment_date,
    paid_date: payment.paid_date,
    due_date: payment.due_date,
    ...payment
  }));

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-slate-900 p-6">
        <div className="bg-red-900 dark:bg-red-900 border border-red-700 dark:border-red-700 rounded-lg p-6 text-center">
          <CreditCard className="h-12 w-12 text-red-400 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-300 dark:text-red-300 mb-2">Error Loading Payments</h3>
          <p className="text-red-400 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadPayments}
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
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">My Payments</h1>
            <p className="text-green-100 text-lg">Track your payment history and download receipts</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
            >
              {viewMode === 'table' ? <BarChart3 className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
              <span>{viewMode === 'table' ? 'Grid View' : 'Table View'}</span>
            </button>
            <button
              onClick={loadPayments}
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
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Payments</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-green-900 dark:bg-green-900 rounded-full">
              <CreditCard className="h-6 w-6 text-green-400 dark:text-green-400" />
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
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Paid</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.paid}</p>
            </div>
            <div className="p-3 bg-green-900 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-400 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400 dark:text-green-400 font-medium">Successfully processed</span>
          </div>
        </div>

        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Pending</p>
              <p className="text-3xl font-bold text-white dark:text-white">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-900 dark:bg-yellow-900 rounded-full">
              <Clock className="h-6 w-6 text-yellow-400 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-yellow-400 dark:text-yellow-400 font-medium">Awaiting processing</span>
          </div>
        </div>

        <div className="bg-slate-800 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Paid</p>
              <p className="text-3xl font-bold text-white dark:text-white">{formatCurrency(stats.paidAmount)}</p>
            </div>
            <div className="p-3 bg-blue-900 dark:bg-blue-900 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-400 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400 dark:text-gray-400">MAD paid</span>
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
                  placeholder="Search payments..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
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
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Type</label>
                <select
                  value={filters.payment_type}
                  onChange={(e) => setFilters(prev => ({ ...prev, payment_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="premium">Premium</option>
                  <option value="claim_settlement">Claim Settlement</option>
                  <option value="refund">Refund</option>
                  <option value="penalty">Penalty</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Method</label>
                <select
                  value={filters.payment_method}
                  onChange={(e) => setFilters(prev => ({ ...prev, payment_method: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                >
                  <option value="">All Methods</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">From Date</label>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
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

        {/* Payments Table/Grid */}
        <div className="p-6">
          {viewMode === 'table' ? (
            <DataTable
              title=""
              columns={columns}
              rows={rows}
              loading={loading}
              emptyMessage="No Payments Found"
              emptyDescription="You haven't made any payments yet. Your payment history will appear here."
              emptyIcon={CreditCard}
              searchable={false}
              sortable={true}
            />
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPayments.map((payment) => (
                <div key={payment.id} className="bg-slate-700 dark:bg-slate-700 rounded-xl shadow-lg border border-slate-600 dark:border-slate-600 p-6 hover:shadow-xl hover:bg-slate-650 dark:hover:bg-slate-650 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white dark:text-white">{payment.transaction_id || `PAY-${payment.id}`}</h3>
                      <p className="text-sm text-gray-300 dark:text-gray-300">{formatDateTime(payment.created_at)}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {statusBadge(payment.status)}
                      {paymentTypeBadge(payment.payment_type)}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Amount</p>
                      <p className="text-lg font-semibold text-white dark:text-white">
                        {payment.amount ? `${formatCurrency(payment.amount)} MAD` : 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Payment Method</p>
                      <div className="mt-1">{paymentMethodBadge(payment.payment_method)}</div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Type</p>
                      <div className="flex items-center space-x-2">
                        {getPaymentTypeIcon(payment.payment_type)}
                        <span className="text-sm text-white dark:text-white">{payment.payment_type || 'N/A'}</span>
                      </div>
                    </div>
                    
                    {payment.paid_date && (
                      <div>
                        <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Paid Date</p>
                        <p className="text-sm text-white dark:text-white">{formatDateTime(payment.paid_date)}</p>
                      </div>
                    )}
                    
                    {payment.due_date && (
                      <div>
                        <p className="text-sm font-medium text-gray-300 dark:text-gray-300">Due Date</p>
                        <p className="text-sm text-white dark:text-white">{formatDate(payment.due_date)}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-600 dark:border-slate-600">
                    <button
                      onClick={() => handleViewPayment(payment)}
                      className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-300 dark:hover:text-blue-300 hover:bg-blue-900/20 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {payment.status === 'paid' && (
                      <button
                        onClick={() => handleDownloadInvoice(payment)}
                        className="p-2 text-green-400 dark:text-green-400 hover:text-green-300 dark:hover:text-green-300 hover:bg-green-900/20 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Download Invoice"
                      >
                        <Receipt className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadReceipt(payment)}
                      className="p-2 text-purple-400 dark:text-purple-400 hover:text-purple-300 dark:hover:text-purple-300 hover:bg-purple-900/20 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                      title="Download Receipt"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    {payment.status === 'failed' && (
                      <button
                        onClick={() => handleRetryPayment(payment)}
                        className="p-2 text-orange-400 dark:text-orange-400 hover:text-orange-300 dark:hover:text-orange-300 hover:bg-orange-900/20 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        title="Retry Payment"
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

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 dark:border-slate-700">
            <div className="p-6 border-b border-slate-700 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white dark:text-white">Payment Details</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Payment Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getPaymentTypeIcon(selectedPayment.payment_type)}
                  <div>
                    <h3 className="text-lg font-semibold text-white dark:text-white">
                      {selectedPayment.transaction_id || `PAY-${selectedPayment.id}`}
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-400">
                      {paymentTypeBadge(selectedPayment.payment_type)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {statusBadge(selectedPayment.status)}
                  <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                    {formatDateTime(selectedPayment.created_at)}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white dark:text-white mb-3">Payment Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">
                        Amount: {formatCurrency(selectedPayment.amount)} MAD
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">
                        Method: {paymentMethodBadge(selectedPayment.payment_method)}
                      </span>
                    </div>
                    {selectedPayment.paid_date && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                        <span className="text-sm text-gray-300 dark:text-gray-300">
                          Paid: {formatDateTime(selectedPayment.paid_date)}
                        </span>
                      </div>
                    )}
                    {selectedPayment.due_date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                        <span className="text-sm text-gray-300 dark:text-gray-300">
                          Due: {formatDate(selectedPayment.due_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white dark:text-white mb-3">Transaction Info</h4>
                  <div className="space-y-2">
                    {selectedPayment.transaction_id && (
                      <div className="text-sm">
                        <span className="text-gray-400 dark:text-gray-400">Transaction ID:</span>
                        <span className="ml-2 font-mono text-white dark:text-white">{selectedPayment.transaction_id}</span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="text-gray-400 dark:text-gray-400">Payment ID:</span>
                      <span className="ml-2 font-mono text-white dark:text-white">{selectedPayment.id}</span>
                    </div>
                    {selectedPayment.gateway_response && (
                      <div className="text-sm">
                        <span className="text-gray-400 dark:text-gray-400">Gateway:</span>
                        <span className="ml-2 text-white dark:text-white">Processed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700 dark:border-slate-700">
                {selectedPayment.status === 'paid' && (
                  <button
                    onClick={() => handleDownloadInvoice(selectedPayment)}
                    className="flex items-center space-x-2 px-4 py-2 text-green-400 dark:text-green-400 border border-green-600 dark:border-green-600 rounded-lg hover:bg-green-900/20 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <Receipt className="h-4 w-4" />
                    <span>Invoice</span>
                  </button>
                )}
                <button
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                  className="flex items-center space-x-2 px-4 py-2 text-purple-400 dark:text-purple-400 border border-purple-600 dark:border-purple-600 rounded-lg hover:bg-purple-900/20 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Receipt</span>
                </button>
                {selectedPayment.status === 'failed' && (
                  <button
                    onClick={() => handleRetryPayment(selectedPayment)}
                    className="flex items-center space-x-2 px-4 py-2 text-orange-400 dark:text-orange-400 border border-orange-600 dark:border-orange-600 rounded-lg hover:bg-orange-900/20 dark:hover:bg-orange-900/20 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Retry</span>
                  </button>
                )}
                <button
                  onClick={() => setShowPaymentModal(false)}
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

export default ClientPayments;