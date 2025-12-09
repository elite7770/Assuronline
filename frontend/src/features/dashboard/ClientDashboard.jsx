import { useEffect, useState } from 'react';
import {
  Shield,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import KPICard from '../../shared/components/KPICard';
import ChartCard from '../../shared/components/ChartCard';
import DataTable from '../../shared/components/DataTable';
import ActivityFeed from '../../shared/components/ActivityFeed';
import { dashboardAPI } from '../../shared/services/api';
import { useNavigate } from 'react-router-dom';
import QuotesList from '../../features/quotes/QuotesList';

const ClientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardAPI.getClientData();
      setData(res.data);
    } catch (err) {
      console.error('Client dashboard fetch error:', err);
      setError('Failed to load your dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* KPI Cards */}
      <div className="dashboard-kpi-grid">
        <KPICard
          title="Active Policies"
          value={data?.kpis?.activePolicies || 0}
          icon={Shield}
          gradient="success"
        />
        <KPICard
          title="Devis en Attente"
          value={data?.kpis?.pendingDevis || 0}
          icon={FileText}
          gradient="primary"
        />
        <KPICard
          title="Total Paid"
          value={`${Number(data?.kpis?.totalPaid || 0).toLocaleString()} MAD`}
          icon={CreditCard}
          gradient="warning"
        />
        <KPICard
          title="Active Claims"
          value={data?.kpis?.activeClaims || 0}
          icon={AlertTriangle}
          gradient="info"
        />
      </div>

      {/* Quick Actions */}
      <div className="card hover-lift">
        <div className="p-6">
          <div className="dashboard-section-title">
            <div className="dashboard-section-icon dashboard-section-icon--green">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="dashboard-section-title-text">Quick Actions</h3>
          </div>
          <div className="dashboard-content-area">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/devis')}
                className="dashboard-quick-action dashboard-quick-action--blue hover:scale-105 transition-transform"
              >
                <Plus className="dashboard-quick-action-icon" />
                <span>Nouveau Devis</span>
              </button>
              <button 
                onClick={() => navigate('/client/claims')}
                className="dashboard-quick-action dashboard-quick-action--green hover:scale-105 transition-transform"
              >
                <AlertTriangle className="dashboard-quick-action-icon" />
                <span>File a Claim</span>
              </button>
              <button 
                onClick={() => navigate('/client/payments')}
                className="dashboard-quick-action dashboard-quick-action--amber hover:scale-105 transition-transform"
              >
                <CreditCard className="dashboard-quick-action-icon" />
                <span>Make Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Quotes */}
      <div className="card hover-lift">
        <div className="p-6">
          <div className="dashboard-section-title">
            <div className="dashboard-section-icon dashboard-section-icon--blue">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="dashboard-section-title-text">Mes Devis Récents</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Gérez vos devis d'assurance
              </p>
            </div>
          </div>
          
          <div className="dashboard-content-area">
            <QuotesList limit={3} showActions={true} />
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/client/quotes')}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover:scale-105"
              >
                <span>Voir tous mes devis</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard
        title="Financial Health Score"
        chartType="gauge"
        subtitle="Your overall financial wellness indicator"
        isEmpty={!data?.analytics?.financialHealth}
        emptyMessage="No Financial Data"
        emptyDescription="Your financial health score will appear here once we analyze your data"
          className="lg:col-span-1"
      >
        {data?.analytics?.financialHealth && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                      r="35"
                    stroke="currentColor"
                      strokeWidth="6"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                      r="35"
                    stroke="currentColor"
                      strokeWidth="6"
                    fill="none"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - data.analytics.financialHealth.score / 100)}`}
                    className="text-green-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.analytics.financialHealth.score}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">/ 100</div>
                    </div>
                  </div>
                </div>
                <div className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                {data.analytics.financialHealth.level}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {data.analytics.financialHealth.description}
              </div>
            </div>
          </div>
        )}
      </ChartCard>

        {/* Policy Documents */}
        <div className="card hover-lift">
          <div className="p-6">
            <div className="dashboard-section-title">
              <div className="dashboard-section-icon dashboard-section-icon--blue">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="dashboard-section-title-text">Policy Documents</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage and download your insurance documents
                </p>
              </div>
            </div>
            
            <div className="dashboard-content-area">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (data?.lists?.documents || []).length === 0 ? (
                <div className="dashboard-table-empty-state">
                  <div className="dashboard-table-empty-icon">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="dashboard-table-empty-title">No Documents Available</h3>
                  <p className="dashboard-table-empty-description">
                    Your policy documents will appear here once they are generated
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(data?.lists?.documents || []).map((document, index) => (
                    <div 
                      key={document.id || index}
                      className="group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {document.name || document.filename || `Document ${index + 1}`}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {document.type || 'Policy Document'} • {new Date(document.created_at || document.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                            document.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            document.status === 'expired' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            document.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {document.status || 'active'}
                          </span>
                          
                          <div className="flex items-center space-x-1">
                            <button 
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                              title="View Document"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                              title="Download Document"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(data?.lists?.documents || []).length > 3 && (
                    <div className="text-center pt-4">
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                        View All Documents ({data?.lists?.documents?.length || 0})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tables + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <div className="card hover-lift">
            <div className="p-6">
              <div className="dashboard-section-title">
                <div className="dashboard-section-icon dashboard-section-icon--green">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="dashboard-section-title-text">My Policies</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage your active insurance policies
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
                ) : (data?.lists?.recentPolicies || []).length === 0 ? (
                  <div className="dashboard-table-empty-state">
                    <div className="dashboard-table-empty-icon">
                      <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="dashboard-table-empty-title">No Active Policies</h3>
                    <p className="dashboard-table-empty-description">
                      Your policies will appear here once you purchase insurance coverage
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(data?.lists?.recentPolicies || []).map((policy, index) => (
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
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Effective Date</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {new Date(policy.start_date || policy.effective_date).toLocaleDateString()}
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
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
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
                            <button 
                              className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                              title="Download Policy"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {(data?.lists?.recentPolicies || []).length > 3 && (
                      <div className="text-center pt-4">
                        <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition-colors duration-200">
                          View All Policies ({(data?.lists?.recentPolicies || []).length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card hover-lift">
            <div className="p-6">
              <div className="dashboard-section-title">
                <div className="dashboard-section-icon dashboard-section-icon--amber">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="dashboard-section-title-text">Recent Claims</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Track and manage your insurance claims
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
                ) : (data?.lists?.recentClaims || []).length === 0 ? (
                  <div className="dashboard-table-empty-state">
                    <div className="dashboard-table-empty-icon">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="dashboard-table-empty-title">No Claims Submitted</h3>
                    <p className="dashboard-table-empty-description">
                      Your claims will appear here once you submit them
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(data?.lists?.recentClaims || []).map((claim, index) => (
                      <div 
                        key={claim.id || index}
                        className="group p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                  {claim.claim_number || `CLM-${claim.id}`}
                                </h4>
                                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                  claim.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                  claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  claim.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                  claim.status === 'under_review' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {claim.status?.replace('_', ' ') || 'pending'}
                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Claim Type</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {claim.type || 'General'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {claim.amount ? `${Number(claim.amount).toLocaleString()} MAD` : 'TBD'}
                                  </p>
                                </div>
                              </div>
                              {claim.description && (
                                <div className="mt-3">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                    {claim.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button 
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                              title="View Claim Details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                              title="Track Claim Status"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                              </svg>
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                              title="Download Claim Documents"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {(data?.lists?.recentClaims || []).length > 3 && (
                      <div className="text-center pt-4">
                        <button className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium transition-colors duration-200">
                          View All Claims ({(data?.lists?.recentClaims || []).length})
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
            title="Your Recent Activity"
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
    </div>
  );
};

export default ClientDashboard;
