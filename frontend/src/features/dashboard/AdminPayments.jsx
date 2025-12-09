import { useEffect, useState } from 'react';
import { 
  CreditCard, RefreshCw, Search, Filter, ChevronDown, ChevronUp, 
  Clock, TrendingUp, DollarSign, AlertCircle, 
  FileText, BarChart3, 
  Eye, Mail, Star,
  CheckCircle, XCircle, Receipt, 
  ArrowDownRight
} from 'lucide-react';
import { paymentsAPI } from '../../shared/services/api';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    payment_method: '',
    date_from: '',
    date_to: '',
    search: '',
    amount_range: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    failed: 0,
    overdue: 0,
    totalAmount: 0,
    avgAmount: 0,
    monthlyRevenue: 0
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Always use real API data
      const res = await paymentsAPI.listAll();
      const paymentsData = Array.isArray(res.data) ? res.data : res.data?.payments || [];
      
      setPayments(paymentsData);
      
      // Calculate statistics
      const total = paymentsData.length;
      const paid = paymentsData.filter(p => p.status === 'paid').length;
      const pending = paymentsData.filter(p => p.status === 'pending').length;
      const failed = paymentsData.filter(p => p.status === 'failed').length;
      const overdue = paymentsData.filter(p => p.status === 'overdue').length;
      const totalAmount = paymentsData.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const avgAmount = total > 0 ? totalAmount / total : 0;
      
      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = paymentsData.filter(p => {
        if (p.status !== 'paid' || !p.paid_date) return false;
        const paymentDate = new Date(p.paid_date);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      }).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      
      setStats({
        total,
        paid,
        pending,
        failed,
        overdue,
        totalAmount,
        avgAmount,
        monthlyRevenue
      });
      
    } catch (err) {
      console.error('Payments fetch error:', err);
      setError('Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Payment action handlers
  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async (paymentId) => {
    setActionLoading(true);
    try {
      // Call real API to process payment
      const response = await paymentsAPI.updateStatus(paymentId, 'paid');
      console.log('Process payment response:', response);
      alert('Payment processed successfully!');
      fetchPayments(); // Refresh data
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefundPayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to refund this payment?')) return;
    
    setActionLoading(true);
    try {
      // Call real API to refund payment
      const response = await paymentsAPI.updateStatus(paymentId, 'refunded');
      console.log('Refund payment response:', response);
      alert('Payment refunded successfully!');
      fetchPayments(); // Refresh data
    } catch (error) {
      console.error('Error refunding payment:', error);
      alert('Error refunding payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetryPayment = async (paymentId) => {
    setActionLoading(true);
    try {
      // Call real API to retry payment
      const response = await paymentsAPI.retryPayment(paymentId);
      console.log('Retry payment response:', response);
      alert('Payment retry initiated! Customer will be notified.');
      fetchPayments(); // Refresh data
    } catch (error) {
      console.error('Error retrying payment:', error);
      alert('Error retrying payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async (paymentId, customerEmail) => {
    if (!customerEmail) {
      alert('No email address available for this customer.');
      return;
    }

    setActionLoading(true);
    try {
      // Call real API to send email
      const response = await paymentsAPI.sendEmail(paymentId, customerEmail);
      console.log('Send email response:', response);
      alert('Email sent successfully to ' + customerEmail);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateReceipt = async (paymentId) => {
    setActionLoading(true);
    try {
      // Call real API to generate receipt
      const response = await paymentsAPI.generateReceipt(paymentId);
      console.log('Generate receipt response:', response);
      
      // If response contains a download URL, open it
      if (response.data?.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
        alert('Receipt generated successfully! Download started.');
      } else {
        alert('Receipt generated successfully!');
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Error generating receipt: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const filteredPayments = payments.filter(payment => {
    if (filters.status && payment.status !== filters.status) return false;
    if (filters.payment_method && payment.payment_method !== filters.payment_method) return false;
    if (filters.date_from && new Date(payment.created_at) < new Date(filters.date_from)) return false;
    if (filters.date_to && new Date(payment.created_at) > new Date(filters.date_to)) return false;
    if (filters.amount_range) {
      const amount = Number(payment.amount) || 0;
      const [min, max] = filters.amount_range.split('-').map(Number);
      if (min && amount < min) return false;
      if (max && amount > max) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        payment.transaction_id?.toLowerCase().includes(searchLower) ||
        payment.customer_name?.toLowerCase().includes(searchLower) ||
        payment.customer_email?.toLowerCase().includes(searchLower) ||
        payment.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'created_at' || sortBy === 'paid_date') {
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
      payment_method: '',
      date_from: '',
      date_to: '',
      search: '',
      amount_range: ''
    });
  };

  const formatCurrency = (value) => Number(value || 0).toLocaleString('fr-MA');
  const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : '-');
  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const map = {
      paid: 'bg-green-900 text-green-300',
      pending: 'bg-yellow-900 text-yellow-300',
      failed: 'bg-red-900 text-red-300',
      overdue: 'bg-red-900 text-red-300',
      refunded: 'bg-purple-900 text-purple-300',
    };
    const cls = map[s] || 'bg-gray-700 text-gray-300';
    return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${cls}`}>{status || '-'}</span>;
  };

  const paymentMethodBadge = (method) => {
    const m = (method || '').toLowerCase();
    const map = {
      credit_card: 'bg-blue-900 text-blue-300',
      bank_transfer: 'bg-purple-900 text-purple-300',
      cash: 'bg-green-900 text-green-300',
      check: 'bg-orange-900 text-orange-300',
    };
    const cls = map[m] || 'bg-gray-700 text-gray-300';
    const displayName = m.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${cls}`}>{displayName}</span>;
  };

  if (loading) return <div className="p-6 text-white">Loading payments...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="space-y-6 animate-fade-in p-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Payment Management</h1>
            <p className="text-yellow-100 text-lg">Comprehensive payment tracking and financial analytics</p>
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
              onClick={fetchPayments}
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
              <p className="text-sm font-medium text-gray-300">Total Payments</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-yellow-900 rounded-full">
              <CreditCard className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400 font-medium">+15% from last month</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Paid Amount</p>
              <p className="text-3xl font-bold text-green-400">{stats.paid}</p>
            </div>
            <div className="p-3 bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Star className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400 font-medium">Successfully processed</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-900 rounded-full">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-yellow-400 font-medium">Awaiting processing</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Total Revenue</p>
              <p className="text-3xl font-bold text-orange-400">{stats.totalAmount.toLocaleString()} MAD</p>
            </div>
            <div className="p-3 bg-orange-900 rounded-full">
              <DollarSign className="h-6 w-6 text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-orange-400 mr-1" />
            <span className="text-orange-400 font-medium">Avg: {stats.avgAmount.toLocaleString()} MAD</span>
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
                  placeholder="Search payments, customers, transactions..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="overdue">Overdue</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
              <select
                value={filters.payment_method}
                onChange={(e) => setFilters({...filters, payment_method: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Methods</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount Range</label>
              <select
                value={filters.amount_range}
                onChange={(e) => setFilters({...filters, amount_range: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Ranges</option>
                <option value="0-1000">0 - 1,000 MAD</option>
                <option value="1000-5000">1,000 - 5,000 MAD</option>
                <option value="5000-10000">5,000 - 10,000 MAD</option>
                <option value="10000-999999">10,000+ MAD</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date From</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date To</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
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

      {/* Payments Display */}
      {viewMode === 'table' ? (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Payments ({filteredPayments.length})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white"
                >
                  <option value="created_at">Date</option>
                  <option value="amount">Amount</option>
                  <option value="customer_name">Customer</option>
                  <option value="status">Status</option>
                  <option value="paid_date">Paid Date</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Paid Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {sortedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {payment.transaction_id || `TXN-${payment.id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{payment.customer_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-300">{payment.customer_email || 'customer@example.com'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div className="font-medium">{formatCurrency(payment.amount)} MAD</div>
                      <div className="text-xs text-gray-300">{payment.description || 'Payment'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {paymentMethodBadge(payment.payment_method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {payment.paid_date ? formatDateTime(payment.paid_date) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDateTime(payment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPayment(payment)}
                          className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => handleProcessPayment(payment.id)}
                            disabled={actionLoading}
                            className="p-1 text-green-400 hover:text-green-300 hover:bg-green-900 rounded disabled:opacity-50"
                            title="Process Payment"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {payment.status === 'failed' && (
                          <button
                            onClick={() => handleRetryPayment(payment.id)}
                            disabled={actionLoading}
                            className="p-1 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900 rounded disabled:opacity-50"
                            title="Retry Payment"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        {payment.status === 'paid' && (
                          <button
                            onClick={() => handleRefundPayment(payment.id)}
                            disabled={actionLoading}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded disabled:opacity-50"
                            title="Refund Payment"
                          >
                            <ArrowDownRight className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleSendEmail(payment.id, payment.customer_email)}
                          disabled={actionLoading}
                          className="p-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900 rounded disabled:opacity-50"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleGenerateReceipt(payment.id)}
                          disabled={actionLoading}
                          className="p-1 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded disabled:opacity-50"
                          title="Generate Receipt"
                        >
                          <Receipt className="h-4 w-4" />
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
          {sortedPayments.map((payment) => (
            <div key={payment.id} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:bg-gray-750 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{payment.transaction_id || `TXN-${payment.id}`}</h3>
                  <p className="text-sm text-gray-300">{formatDateTime(payment.created_at)}</p>
                </div>
                {statusBadge(payment.status)}
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-300">Customer</p>
                  <p className="text-sm text-white">{payment.customer_name || 'Unknown'}</p>
                  <p className="text-xs text-gray-400">{payment.customer_email || 'customer@example.com'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-300">Amount</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(payment.amount)} MAD</p>
                  <p className="text-xs text-gray-400">{payment.description || 'Payment'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-300">Payment Method</p>
                  <div className="mt-1">{paymentMethodBadge(payment.payment_method)}</div>
                </div>
                
                {payment.paid_date && (
                  <div>
                    <p className="text-sm font-medium text-gray-300">Paid Date</p>
                    <p className="text-sm text-white">{formatDateTime(payment.paid_date)}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {/* Primary Actions Row */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewPayment(payment)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => handleProcessPayment(payment.id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Process</span>
                    </button>
                  )}
                  
                  {payment.status === 'failed' && (
                    <button
                      onClick={() => handleRetryPayment(payment.id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Retry</span>
                    </button>
                  )}
                  
                  {payment.status === 'paid' && (
                    <button
                      onClick={() => handleRefundPayment(payment.id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <ArrowDownRight className="h-4 w-4" />
                      <span>Refund</span>
                    </button>
                  )}
                </div>
                
                {/* Secondary Actions Row */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSendEmail(payment.id, payment.customer_email)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </button>
                  
                  <button
                    onClick={() => handleGenerateReceipt(payment.id)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    <Receipt className="h-4 w-4" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Payment Details - {selectedPayment.transaction_id}</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Customer</label>
                  <p className="mt-1 text-sm text-white">{selectedPayment.customer_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <p className="mt-1 text-sm text-white">{selectedPayment.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Amount</label>
                  <p className="mt-1 text-sm text-white">{formatCurrency(selectedPayment.amount)} MAD</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Payment Method</label>
                  <div className="mt-1">{paymentMethodBadge(selectedPayment.payment_method)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Status</label>
                  <div className="mt-1">{statusBadge(selectedPayment.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Created</label>
                  <p className="mt-1 text-sm text-white">{formatDateTime(selectedPayment.created_at)}</p>
                </div>
                {selectedPayment.paid_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Paid Date</label>
                    <p className="mt-1 text-sm text-white">{formatDateTime(selectedPayment.paid_date)}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300">Description</label>
                  <p className="mt-1 text-sm text-white">{selectedPayment.description || 'Payment'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              {selectedPayment.status === 'pending' && (
                <button
                  onClick={() => {
                    handleProcessPayment(selectedPayment.id);
                    setShowPaymentModal(false);
                  }}
                  disabled={actionLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Process Payment</span>
                </button>
              )}
              {selectedPayment.status === 'failed' && (
                <button
                  onClick={() => {
                    handleRetryPayment(selectedPayment.id);
                    setShowPaymentModal(false);
                  }}
                  disabled={actionLoading}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Retry Payment</span>
                </button>
              )}
              {selectedPayment.status === 'paid' && (
                <button
                  onClick={() => {
                    handleRefundPayment(selectedPayment.id);
                    setShowPaymentModal(false);
                  }}
                  disabled={actionLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <ArrowDownRight className="h-4 w-4" />
                  <span>Refund Payment</span>
                </button>
              )}
              <button
                onClick={() => handleSendEmail(selectedPayment.id, selectedPayment.customer_email)}
                disabled={actionLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </button>
              <button
                onClick={() => handleGenerateReceipt(selectedPayment.id)}
                disabled={actionLoading}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Receipt className="h-4 w-4" />
                <span>Generate Receipt</span>
              </button>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
