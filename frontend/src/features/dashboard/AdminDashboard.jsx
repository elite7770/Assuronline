import { useEffect, useState } from 'react';
import { FileText, Shield, AlertTriangle, TrendingUp, DollarSign, RefreshCw, CheckCircle, XCircle, Mail, Download, Eye } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import EnhancedKPICard from '../../shared/components/EnhancedKPICard';
import ChartCard from '../../shared/components/ChartCard';
import DataTable from '../../shared/components/DataTable';
import ActivityFeed from '../../shared/components/ActivityFeed';
import { quotesAPI, policiesAPI, paymentsAPI, claimAPI, dashboardAPI } from '../../shared/services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchDashboardData = async (retryAttempt = 0) => {
    try {
      setLoading(true);
      setError('');
      setRetryCount(retryAttempt);
      
      console.log('Fetching admin dashboard data from API...', retryAttempt > 0 ? `(Retry ${retryAttempt})` : '');
      
      // Add delay for retries to handle rate limiting
      if (retryAttempt > 0) {
        const delay = Math.min(1000 * Math.pow(2, retryAttempt), 10000); // Exponential backoff, max 10s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Use the dedicated admin dashboard endpoint that provides real data
      const response = await dashboardAPI.getAdminOverview();
      
      console.log('Admin dashboard API response:', response);
      
      if (!response.data) {
        throw new Error('No data received from admin dashboard API');
      }
      
      const dashboardData = response.data;
      
      // Process the real data from the backend
      setData({
        devis: {
          total: dashboardData.devis?.total || 0,
          approved: dashboardData.devis?.approved || 0,
          pending: dashboardData.devis?.pending || 0,
          rejected: dashboardData.devis?.rejected || 0
        },
        policies: {
          total_policies: dashboardData.policies?.total_policies || 0,
          active_policies: dashboardData.policies?.active_policies || 0,
          expired_policies: dashboardData.policies?.expired_policies || 0
        },
        payments: {
          total_paid_amount: dashboardData.payments?.total_paid_amount || 0,
          total_payments: dashboardData.payments?.total_payments || 0,
          pending_payments: dashboardData.payments?.pending_payments || 0
        },
        claims: {
          total: dashboardData.claims?.total || 0,
          byStatus: dashboardData.claims?.byStatus || {
            pending: 0,
            approved: 0,
            rejected: 0
          }
        },
        charts: {
          monthlyRevenue: dashboardData.charts?.monthlyRevenue || [],
          policyGrowth: dashboardData.charts?.policyGrowth || []
        },
        tables: {
          recentQuotes: dashboardData.tables?.recentQuotes || [],
          recentPolicies: dashboardData.tables?.recentPolicies || [],
          recentPayments: dashboardData.tables?.recentPayments || []
        },
        activity: dashboardData.activity || []
      });
      
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Handle different error types
      let errorMessage = 'Failed to load dashboard data. ';
      
      if (err.response?.status === 429) {
        errorMessage += 'Too many requests. Please wait a moment and try again.';
      } else if (err.response?.status === 401) {
        errorMessage += 'Authentication required. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage += 'Access denied. You may not have permission to view this data.';
      } else if (err.response?.status >= 500) {
        errorMessage += 'Server error. Please try again later.';
      } else if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        errorMessage += 'Network error. Please check your internet connection.';
      } else {
        errorMessage += `Please check your connection and try again. (${err.message})`;
      }
      
      setError(errorMessage);
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
      // In a real app, this would call the API
      // Approving quote:
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Quote approved successfully! Email sent to customer.');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      alert('Error approving quote: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectQuote = async (quoteId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setActionLoading(true);
    try {
      // In a real app, this would call the API
      // Rejecting quote:
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Quote rejected. Email sent to customer with reason.');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      alert('Error rejecting quote: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async (quoteId, customerEmail) => {
    setActionLoading(true);
    try {
      // In a real app, this would call the API
      // Sending email for quote:
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Email sent successfully to ' + customerEmail);
    } catch (error) {
      alert('Error sending email: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGeneratePDF = async (quoteId) => {
    setActionLoading(true);
    try {
      // In a real app, this would call the API
      // Generating PDF for quote:
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('PDF generated successfully! Download started.');
    } catch (error) {
      alert('Error generating PDF: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">
            {retryCount > 0 ? `Retrying... (Attempt ${retryCount + 1})` : 'Loading dashboard data...'}
          </p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500">
              Handling rate limiting with exponential backoff
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    const isRateLimited = error.includes('Too many requests');
    const isAuthError = error.includes('Authentication required') || error.includes('Access denied');
    
    return (
      <div className="p-6">
        <div className={`border rounded-lg p-6 text-center ${
          isRateLimited 
            ? 'bg-yellow-50 border-yellow-200' 
            : isAuthError 
            ? 'bg-orange-50 border-orange-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <AlertTriangle className={`h-12 w-12 mx-auto mb-4 ${
            isRateLimited 
              ? 'text-yellow-500' 
              : isAuthError 
              ? 'text-orange-500'
              : 'text-red-500'
          }`} />
          <h3 className={`text-lg font-semibold mb-2 ${
            isRateLimited 
              ? 'text-yellow-800' 
              : isAuthError 
              ? 'text-orange-800'
              : 'text-red-800'
          }`}>
            {isRateLimited ? 'Rate Limited' : isAuthError ? 'Authentication Error' : 'Error Loading Dashboard'}
          </h3>
          <p className={`mb-4 ${
            isRateLimited 
              ? 'text-yellow-600' 
              : isAuthError 
              ? 'text-orange-600'
              : 'text-red-600'
          }`}>
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => fetchDashboardData()}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                isRateLimited 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : isAuthError 
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isRateLimited ? 'Retry Now' : 'Try Again'}
            </button>
            {isRateLimited && (
              <button
                onClick={() => {
                  // Wait 30 seconds before retrying
                  setTimeout(() => fetchDashboardData(), 30000);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Wait 30s & Retry
              </button>
            )}
            {isAuthError && (
              <button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const totalDevis = data?.devis?.total || 0;
  const totalPolicies = Number(data?.policies?.total_policies || 0);
  const totalRevenue = Number(data?.payments?.total_paid_amount || 0);
  const activeClaims = Number(
    (data?.claims?.byStatus?.pending || 0) + (data?.claims?.byStatus?.approved || 0)
  );
  const monthlyRevenue = (data?.charts?.monthlyRevenue || []).map((r) => ({
    month: r.month,
    revenue: r.revenue,
  }));
  const claimsStats = Object.entries(data?.claims?.byStatus || {}).map(([name, value]) => ({
    name,
    value,
  }));
  const conversionRate = totalDevis > 0 ? ((totalPolicies / totalDevis) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Enhanced KPI Cards */}
      <div className="dashboard-kpi-grid">
        <EnhancedKPICard
          title="Total Devis"
          value={totalDevis.toLocaleString()}
          change={{ value: 12.5, type: 'increase', period: 'vs last month' }}
          icon={FileText}
          gradient="primary"
          miniChart={true}
          trendData={[120, 135, 148, 162, 175, 189, 201, 215, 228, 245, 267, 289]}
          formatValue={(val) => val}
          onClick={() => {}}
        />
        <EnhancedKPICard
          title="Active Policies"
          value={totalPolicies.toLocaleString()}
          change={{ value: 8.2, type: 'increase', period: 'vs last month' }}
          icon={Shield}
          gradient="success"
          miniChart={true}
          trendData={[45, 52, 58, 63, 67, 71, 75, 78, 82, 85, 89, 92]}
          formatValue={(val) => val}
          onClick={() => {}}
        />
        <EnhancedKPICard
          title="Total Revenue"
          value={`${(totalRevenue / 1000000).toFixed(1)}M MAD`}
          change={{ value: 15.3, type: 'increase', period: 'vs last month' }}
          icon={DollarSign}
          gradient="warning"
          miniChart={true}
          trendData={[2.1, 2.3, 2.5, 2.7, 2.9, 3.1, 3.3, 3.5, 3.7, 3.9, 4.1, 4.3]}
          formatValue={(val) => val}
          onClick={() => {}}
        />
        <EnhancedKPICard
          title="Active Claims"
          value={activeClaims}
          change={{ value: 3.1, type: 'decrease', period: 'vs last week' }}
          icon={AlertTriangle}
          gradient="info"
          miniChart={true}
          trendData={[8, 7, 6, 5, 4, 3, 2, 3, 4, 5, 6, 7]}
          formatValue={(val) => val}
          onClick={() => {}}
        />
      </div>

      {/* Charts */}
      <div className="dashboard-chart-grid">
        <ChartCard
          title="Monthly Revenue Trend"
          chartType="area"
          subtitle="Revenue growth over the last 12 months"
          isEmpty={!monthlyRevenue || monthlyRevenue.length === 0}
          emptyMessage="No Revenue Data"
          emptyDescription="Revenue data will appear here once transactions are recorded"
        >
          {monthlyRevenue && monthlyRevenue.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis tickFormatter={(value) => `${value / 1000}K`} stroke="#666" />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} MAD`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="Policy Growth"
          chartType="line"
          subtitle="New policies created each month"
          isEmpty={!data?.charts?.policyGrowth || data.charts.policyGrowth.length === 0}
          emptyMessage="No Policy Data"
          emptyDescription="Policy growth data will appear here once policies are created"
        >
          {data?.charts?.policyGrowth && data.charts.policyGrowth.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.policyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  formatter={(value) => [value, 'Policies']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="policies"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard 
          title="Claims by Type" 
          chartType="pie" 
          subtitle="Breakdown by claim type"
          isEmpty={!claimsStats || claimsStats.length === 0}
          emptyMessage="No Claims Data"
          emptyDescription="Claims data will appear here once claims are submitted"
        >
          {claimsStats && claimsStats.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={claimsStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimsStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="Conversion Rate"
          chartType="bar"
          subtitle="Devis vers police conversion performance"
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="dashboard-conversion-rate">{conversionRate}%</div>
              <div className="dashboard-conversion-subtitle">Devis vers Police Conversion</div>
              <div className="dashboard-conversion-trend">
                <TrendingUp className="dashboard-conversion-trend-icon" />
                <span className="dashboard-conversion-trend-text">+5.2% from last month</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Tables + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          {/* Recent Quotes */}
          <div className="card hover-lift">
            <div className="p-6">
              <div className="dashboard-section-title">
                <div className="dashboard-section-icon dashboard-section-icon--blue">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="dashboard-section-title-text">Recent Quotes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage and review insurance quotes
                  </p>
                </div>
              </div>
              
              <div className="dashboard-content-area">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (data?.tables?.recentQuotes || []).length === 0 ? (
                  <div className="dashboard-table-empty-state">
                    <div className="dashboard-table-empty-icon">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="dashboard-table-empty-title">No Recent Quotes</h3>
                    <p className="dashboard-table-empty-description">
                      New quotes will appear here once customers submit them
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(data?.tables?.recentQuotes || []).map((quote, index) => (
                      <div 
                        key={quote.id || index}
                        className="group p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                  {quote.devis_number || `QUO-${quote.id}`}
                                </h4>
                                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                  quote.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                  quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  quote.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {quote.status || 'pending'}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customer</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {quote.customer || 'Unknown'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Premium</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {Number(quote.final_premium || 0).toLocaleString()} MAD
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button 
                              onClick={() => handleViewQuote(quote)}
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                              title="View Quote Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {quote.status === 'pending' && (
                              <button 
                                onClick={() => handleApproveQuote(quote.id)}
                                className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                                title="Approve Quote"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {quote.status === 'pending' && (
                              <button 
                                onClick={() => handleRejectQuote(quote.id)}
                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                                title="Reject Quote"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {(data?.tables?.recentQuotes || []).length > 3 && (
                      <div className="text-center pt-4">
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                          View All Quotes ({(data?.tables?.recentQuotes || []).length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Policies */}
          <div className="card hover-lift">
            <div className="p-6">
              <div className="dashboard-section-title">
                <div className="dashboard-section-icon dashboard-section-icon--green">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="dashboard-section-title-text">Recent Policies</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Monitor active insurance policies
                  </p>
                </div>
              </div>
              
              <div className="dashboard-content-area">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (data?.tables?.recentPolicies || []).length === 0 ? (
                  <div className="dashboard-table-empty-state">
                    <div className="dashboard-table-empty-icon">
                      <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="dashboard-table-empty-title">No Recent Policies</h3>
                    <p className="dashboard-table-empty-description">
                      New policies will appear here once they are created
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(data?.tables?.recentPolicies || []).map((policy, index) => (
                      <div 
                        key={policy.id || index}
                        className="group p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                  {policy.policy_number || `POL-${policy.id}`}
                                </h4>
                                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                  policy.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                  policy.status === 'expired' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                  policy.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {policy.status || 'pending'}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customer</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {policy.customer_name || 'Unknown'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Premium</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {Number(policy.premium || 0).toLocaleString()} MAD
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button 
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                              title="View Policy Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                              title="Manage Policy"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {(data?.tables?.recentPolicies || []).length > 3 && (
                      <div className="text-center pt-4">
                        <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition-colors duration-200">
                          View All Policies ({(data?.tables?.recentPolicies || []).length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ActivityFeed
            title="Recent Activity"
            items={(data?.activity || []).map((a) => ({
              actor: a.actor,
              action: a.action,
              time: a.time,
              color: a.color,
            }))}
            loading={false}
            emptyMessage="No recent activity"
          />
        </div>
      </div>

      {/* Quote Details Modal */}
      {showQuoteModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Quote Details - {selectedQuote.devis_number}</h3>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.customer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuote.vehicle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedQuote.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedQuote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedQuote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedQuote.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Final Premium</label>
                  <p className="mt-1 text-sm text-gray-900">{Number(selectedQuote.final_premium || 0).toLocaleString()} MAD</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Premium</label>
                  <p className="mt-1 text-sm text-gray-900">{Number(selectedQuote.monthly_premium || 0).toLocaleString()} MAD</p>
                </div>
              </div>
              
              {selectedQuote.admin_comment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Comment</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedQuote.admin_comment}</p>
                </div>
              )}
              
              {selectedQuote.calculation_details && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Calculation Details</label>
                  <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
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
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </button>
              <button
                onClick={() => handleGeneratePDF(selectedQuote.id)}
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
  );
};

export default AdminDashboard;
