import { useEffect, useState } from 'react';
import {
  Shield,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Plus,
  ChevronRight,
} from 'lucide-react';
import KPICard from '../../shared/components/KPICard';
import ChartCard from '../../shared/components/ChartCard';
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
      setError('Impossible de charger vos données. Veuillez réessayer.');
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
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-red-400" />
          </div>
          <p className="text-slate-400 text-sm">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96 p-6">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 text-center max-w-md w-full">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Erreur de chargement</h3>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Polices Actives"
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
          title="Total Payé"
          value={`${Number(data?.kpis?.totalPaid || 0).toLocaleString()} MAD`}
          icon={CreditCard}
          gradient="warning"
        />
        <KPICard
          title="Sinistres Actifs"
          value={data?.kpis?.activeClaims || 0}
          icon={AlertTriangle}
          gradient="info"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-white font-semibold text-sm">Actions Rapides</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/devis')}
              className="group flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Plus className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">Nouveau Devis</p>
                <p className="text-slate-500 text-xs">Demander un devis</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600 ml-auto group-hover:text-blue-400 transition-colors" />
            </button>
            <button
              onClick={() => navigate('/client/claims')}
              className="group flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 hover:border-amber-500/40 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">Déclarer Sinistre</p>
                <p className="text-slate-500 text-xs">Soumettre une réclamation</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600 ml-auto group-hover:text-amber-400 transition-colors" />
            </button>
            <button
              onClick={() => navigate('/client/payments')}
              className="group flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">Effectuer Paiement</p>
                <p className="text-slate-500 text-xs">Payer votre prime</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600 ml-auto group-hover:text-purple-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Quotes */}
      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Mes Devis Récents</h3>
              <p className="text-slate-500 text-xs mt-0.5">Gérez vos devis d'assurance</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <QuotesList limit={3} showActions={true} />
          <div className="mt-5 text-center">
            <button
              onClick={() => navigate('/client/quotes')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors duration-200"
            >
              <span>Voir tous mes devis</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Financial Health + Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Score de Santé Financière"
          chartType="gauge"
          subtitle="Indicateur de votre bien-être financier global"
          isEmpty={!data?.analytics?.financialHealth}
          emptyMessage="Aucune donnée financière"
          emptyDescription="Votre score apparaîtra ici une fois vos données analysées"
        >
          {data?.analytics?.financialHealth && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="relative w-36 h-36 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="35" stroke="#1e293b" strokeWidth="6" fill="none" />
                    <circle
                      cx="50" cy="50" r="35"
                      stroke="#10b981"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - data.analytics.financialHealth.score / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{data.analytics.financialHealth.score}</div>
                      <div className="text-xs text-slate-500">/ 100</div>
                    </div>
                  </div>
                </div>
                <div className="text-base font-semibold text-white mb-1">{data.analytics.financialHealth.level}</div>
                <div className="text-sm text-slate-400">{data.analytics.financialHealth.description}</div>
              </div>
            </div>
          )}
        </ChartCard>

        {/* Policy Documents */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Documents de Police</h3>
              <p className="text-slate-500 text-xs mt-0.5">Gérez et téléchargez vos documents</p>
            </div>
          </div>
          <div className="p-5">
            {(data?.lists?.documents || []).length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-slate-500" />
                </div>
                <h3 className="text-slate-400 font-medium text-sm">Aucun document disponible</h3>
                <p className="text-slate-600 text-xs mt-1">Vos documents apparaîtront ici une fois générés</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(data?.lists?.documents || []).map((document, index) => (
                  <div
                    key={document.id || index}
                    className="flex items-center gap-3 p-3 bg-slate-700/30 border border-slate-600/40 rounded-xl hover:border-blue-500/30 transition-all duration-200"
                  >
                    <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        {document.name || document.filename || `Document ${index + 1}`}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {document.type || 'Police'} • {new Date(document.created_at || document.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${document.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        document.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                          'bg-slate-600 text-slate-300'
                      }`}>
                      {document.status || 'active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Policies + Claims + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 space-y-4">
          {/* My Policies */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Shield className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Mes Polices</h3>
                <p className="text-slate-500 text-xs mt-0.5">Gérez vos polices d'assurance actives</p>
              </div>
            </div>
            <div className="p-5">
              {(data?.lists?.recentPolicies || []).length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-slate-400 font-medium text-sm">Aucune police active</h3>
                  <p className="text-slate-600 text-xs mt-1">Vos polices apparaîtront ici une fois souscrites</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(data?.lists?.recentPolicies || []).map((policy, index) => (
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
                              <div><p className="text-xs text-slate-500">Date d'effet</p><p className="text-xs font-medium text-slate-300">{new Date(policy.start_date || policy.effective_date).toLocaleDateString()}</p></div>
                              <div><p className="text-xs text-slate-500">Prime</p><p className="text-xs font-medium text-slate-300">{Number(policy.premium || 0).toLocaleString()} MAD</p></div>
                            </div>
                          </div>
                        </div>
                        <button className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all ml-3" title="Voir">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Claims */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Sinistres Récents</h3>
                <p className="text-slate-500 text-xs mt-0.5">Suivez et gérez vos réclamations</p>
              </div>
            </div>
            <div className="p-5">
              {(data?.lists?.recentClaims || []).length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-slate-400 font-medium text-sm">Aucun sinistre déclaré</h3>
                  <p className="text-slate-600 text-xs mt-1">Vos sinistres apparaîtront ici une fois soumis</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(data?.lists?.recentClaims || []).map((claim, index) => (
                    <div
                      key={claim.id || index}
                      className="group p-4 bg-slate-700/30 border border-slate-600/40 rounded-xl hover:border-amber-500/40 hover:bg-slate-700/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-white">{claim.claim_number || `CLM-${claim.id}`}</h4>
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${claim.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                  claim.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                    claim.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                      claim.status === 'under_review' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-slate-600 text-slate-300'
                                }`}>{claim.status?.replace('_', ' ') || 'pending'}</span>
                            </div>
                            <div className="flex gap-4">
                              <div><p className="text-xs text-slate-500">Type</p><p className="text-xs font-medium text-slate-300">{claim.type || 'Général'}</p></div>
                              <div><p className="text-xs text-slate-500">Montant</p><p className="text-xs font-medium text-slate-300">{claim.amount ? `${Number(claim.amount).toLocaleString()} MAD` : 'TBD'}</p></div>
                            </div>
                          </div>
                        </div>
                        <button className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all ml-3" title="Voir">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ActivityFeed
            title="Activité Récente"
            items={(data?.activity || []).map((a) => ({
              actor: a.actor,
              action: a.action,
              time: a.time,
              color: a.color,
            }))}
            loading={false}
            emptyMessage="Aucune activité récente"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
