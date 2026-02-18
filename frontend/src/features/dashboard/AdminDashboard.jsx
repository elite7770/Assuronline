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
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-red-400" />
          </div>
          <p className="text-slate-400 text-sm">
            {retryCount > 0 ? `Nouvelle tentative... (${retryCount + 1})` : 'Chargement du tableau de bord...'}
          </p>
          {retryCount > 0 && (
            <p className="text-xs text-slate-600">Gestion du rate limiting avec backoff exponentiel</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    const isRateLimited = error.includes('Too many requests');
    const isAuthError = error.includes('Authentication required') || error.includes('Access denied');
    return (
      <div className="flex items-center justify-center min-h-96 p-6">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 text-center max-w-md w-full">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isRateLimited ? 'bg-amber-500/20' : isAuthError ? 'bg-orange-500/20' : 'bg-red-500/20'
            }`}>
            <AlertTriangle className={`h-7 w-7 ${isRateLimited ? 'text-amber-400' : isAuthError ? 'text-orange-400' : 'text-red-400'
              }`} />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">
            {isRateLimited ? 'Trop de requêtes' : isAuthError ? 'Erreur d\'authentification' : 'Erreur de chargement'}
          </h3>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => fetchDashboardData()}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Réessayer
            </button>
            {isRateLimited && (
              <button
                onClick={() => setTimeout(() => fetchDashboardData(), 30000)}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Attendre 30s
              </button>
            )}
            {isAuthError && (
              <button
                onClick={() => window.location.href = '/login'}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Se connecter
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
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <EnhancedKPICard
          title="Total Devis"
          value={totalDevis.toLocaleString()}
          change={{ value: 12.5, type: 'increase', period: 'vs last month' }}
          icon={FileText}
          gradient="primary"
          miniChart={true}
          trendData={[120, 135, 148, 162, 175, 189, 201, 215, 228, 245, 267, 289]}
          formatValue={(val) => val}
          onClick={() => { }}
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
          onClick={() => { }}
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
          onClick={() => { }}
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
          onClick={() => { }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tickFormatter={(value) => `${value / 1000}K`} stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} MAD`, 'Revenus']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9',
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
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [value, 'Polices']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9',
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
          title="Sinistres par Type"
          chartType="pie"
          subtitle="Répartition par type de sinistre"
          isEmpty={!claimsStats || claimsStats.length === 0}
          emptyMessage="Aucune donnée de sinistre"
          emptyDescription="Les données apparaîtront ici une fois les sinistres soumis"
          contentHeight="h-72"
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
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="Taux de Conversion"
          chartType="bar"
          subtitle="Performance de conversion devis → police"
          contentHeight="h-auto"
        >
          <div className="flex flex-col items-center justify-center h-full gap-4 py-2">
            {/* Circular gauge */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background track */}
                <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="8" fill="none" />
                {/* Progress arc */}
                <circle
                  cx="50" cy="50" r="38"
                  stroke={Number(conversionRate) >= 80 ? '#10b981' : Number(conversionRate) >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - Math.min(Number(conversionRate), 100) / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${Number(conversionRate) >= 80 ? 'text-emerald-400' : Number(conversionRate) >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {conversionRate}%
                </span>
                <span className="text-slate-500 text-xs mt-0.5">taux</span>
              </div>
            </div>

            {/* Breakdown stats */}
            <div className="w-full grid grid-cols-2 gap-2 px-2">
              <div className="bg-slate-700/40 rounded-xl p-3 text-center">
                <p className="text-slate-500 text-xs mb-1">Devis</p>
                <p className="text-white font-bold text-lg">{totalDevis.toLocaleString()}</p>
              </div>
              <div className="bg-slate-700/40 rounded-xl p-3 text-center">
                <p className="text-slate-500 text-xs mb-1">Polices</p>
                <p className="text-white font-bold text-lg">{totalPolicies.toLocaleString()}</p>
              </div>
            </div>

            {/* Progress bar + trend */}
            <div className="w-full px-2 space-y-2">
              <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${Number(conversionRate) >= 80 ? 'bg-emerald-500' : Number(conversionRate) >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(Number(conversionRate), 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">0%</span>
                <div className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">+5.2% ce mois</span>
                </div>
                <span className="text-slate-500 text-xs">100%</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Tables + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 space-y-4">
          {/* Recent Quotes */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Devis Récents</h3>
                <p className="text-slate-500 text-xs mt-0.5">Gérer et examiner les devis d'assurance</p>
              </div>
            </div>
            <div className="p-5">

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
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-slate-500" />
                    </div>
                    <h3 className="text-slate-400 font-medium text-sm">Aucun devis récent</h3>
                    <p className="text-slate-600 text-xs mt-1">Les nouveaux devis apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(data?.tables?.recentQuotes || []).map((quote, index) => (
                      <div
                        key={quote.id || index}
                        className="group p-4 bg-slate-700/30 border border-slate-600/40 rounded-xl hover:border-blue-500/40 hover:bg-slate-700/50 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-sm font-semibold text-white">
                                  {quote.devis_number || `QUO-${quote.id}`}
                                </h4>
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${quote.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                  quote.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                    quote.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                      'bg-slate-600 text-slate-300'
                                  }`}>
                                  {quote.status || 'pending'}
                                </span>
                              </div>
                              <div className="flex gap-4 mt-2">
                                <div>
                                  <p className="text-xs text-slate-500 mb-0.5">Client</p>
                                  <p className="text-xs font-medium text-slate-300">{quote.customer || 'Inconnu'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 mb-0.5">Prime</p>
                                  <p className="text-xs font-medium text-slate-300">{Number(quote.final_premium || 0).toLocaleString()} MAD</p>
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
                      <div className="text-center pt-3">
                        <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                          Voir tous les devis ({(data?.tables?.recentQuotes || []).length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Policies */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Shield className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Polices Récentes</h3>
                <p className="text-slate-500 text-xs mt-0.5">Surveiller les polices d'assurance actives</p>
              </div>
            </div>
            <div className="p-5">

              <div>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-slate-700/40 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                ) : (data?.tables?.recentPolicies || []).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-slate-500" />
                    </div>
                    <h3 className="text-slate-400 font-medium text-sm">Aucune police récente</h3>
                    <p className="text-slate-600 text-xs mt-1">Les nouvelles polices apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(data?.tables?.recentPolicies || []).map((policy, index) => (
                      <div
                        key={policy.id || index}
                        className="group p-4 bg-slate-700/30 border border-slate-600/40 rounded-xl hover:border-emerald-500/40 hover:bg-slate-700/50 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Shield className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-white">{policy.policy_number || `POL-${policy.id}`}</h4>
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${policy.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                  policy.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                                    policy.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                      'bg-slate-600 text-slate-300'
                                  }`}>{policy.status || 'pending'}</span>
                              </div>
                              <div className="flex gap-4">
                                <div><p className="text-xs text-slate-500">Client</p><p className="text-xs font-medium text-slate-300">{policy.customer_name || 'Inconnu'}</p></div>
                                <div><p className="text-xs text-slate-500">Prime</p><p className="text-xs font-medium text-slate-300">{Number(policy.premium || 0).toLocaleString()} MAD</p></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-3">
                            <button className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all" title="Voir">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {(data?.tables?.recentPolicies || []).length > 3 && (
                      <div className="text-center pt-3">
                        <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                          Voir toutes les polices ({(data?.tables?.recentPolicies || []).length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-white font-semibold text-lg">Détails du Devis — {selectedQuote.devis_number}</h3>
              <button onClick={() => setShowQuoteModal(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/40 rounded-xl p-3">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Client</label>
                  <p className="text-sm text-white font-medium">{selectedQuote.customer}</p>
                </div>
                <div className="bg-slate-700/40 rounded-xl p-3">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                  <p className="text-sm text-white font-medium">{selectedQuote.customer_email}</p>
                </div>
                <div className="bg-slate-700/40 rounded-xl p-3">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Véhicule</label>
                  <p className="text-sm text-white font-medium">{selectedQuote.vehicle}</p>
                </div>
                <div className="bg-slate-700/40 rounded-xl p-3">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Statut</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedQuote.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedQuote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedQuote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {selectedQuote.status}
                  </span>
                </div>
                <div className="bg-slate-700/40 rounded-xl p-3">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Prime Finale</label>
                  <p className="text-sm text-white font-medium">{Number(selectedQuote.final_premium || 0).toLocaleString()} MAD</p>
                </div>
                <div className="bg-slate-700/40 rounded-xl p-3">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Prime Mensuelle</label>
                  <p className="text-sm text-white font-medium">{Number(selectedQuote.monthly_premium || 0).toLocaleString()} MAD</p>
                </div>
              </div>

              {selectedQuote.admin_comment && (
                <div className="bg-slate-700/40 rounded-xl p-3">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Commentaire Admin</label>
                  <p className="text-sm text-slate-300">{selectedQuote.admin_comment}</p>
                </div>
              )}

              {selectedQuote.calculation_details && (
                <div className="bg-slate-700/40 rounded-xl p-3">
                  <label className="block text-xs font-medium text-slate-400 mb-2">Détails de Calcul</label>
                  <div className="text-xs text-slate-300 font-mono overflow-auto max-h-32">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(selectedQuote.calculation_details), null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-5 border-t border-slate-700/50">
              {selectedQuote.status === 'pending' && (
                <>
                  <button
                    onClick={() => { handleApproveQuote(selectedQuote.id); setShowQuoteModal(false); }}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approuver</span>
                  </button>
                  <button
                    onClick={() => { handleRejectQuote(selectedQuote.id); setShowQuoteModal(false); }}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Rejeter</span>
                  </button>
                </>
              )}
              <button
                onClick={() => handleSendEmail(selectedQuote.id, selectedQuote.customer_email)}
                disabled={actionLoading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Envoyer Email</span>
              </button>
              <button
                onClick={() => handleGeneratePDF(selectedQuote.id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
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

export default AdminDashboard;
