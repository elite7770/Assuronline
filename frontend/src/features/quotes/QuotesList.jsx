import { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Eye,
  Download,
  Trash2
} from 'lucide-react';
import { quotesAPI } from '../../shared/services/api.js';

const QuotesList = ({ limit = 5, showActions = true }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await quotesAPI.getMyQuotes({ limit });
      setQuotes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setError('Erreur lors du chargement des devis');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      case 'expired':
        return 'Expiré';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColorDark = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600/20 text-green-400 border border-green-500/30';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30';
      case 'rejected':
        return 'bg-red-600/20 text-red-400 border border-red-500/30';
      case 'expired':
        return 'bg-gray-600/20 text-gray-400 border border-gray-500/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(limit)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 h-24 rounded-xl border border-slate-700"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-700 rounded-xl p-6">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 text-lg font-medium">{error}</p>
          <button
            onClick={fetchQuotes}
            className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-8">
          <div className="p-4 bg-blue-600/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-10 w-10 text-blue-400" />
          </div>
          <p className="text-slate-300 text-lg font-medium mb-2">Aucun devis trouvé</p>
          <p className="text-sm text-slate-400">
            Créez votre premier devis d'assurance
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div key={quote.id} className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {quote.quote_number}
                  </h3>
                  <p className="text-sm text-slate-300">
                    {quote.type === 'car' ? '🚗 Voiture' : '🏍️ Moto'} - {quote.coverage_type}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-slate-300">
                <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-medium">{formatDate(quote.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-2 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="text-white font-medium">{formatCurrency(quote.final_premium)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColorDark(quote.status)}`}>
                {getStatusIcon(quote.status)}
                <span className="ml-2">{getStatusText(quote.status)}</span>
              </span>
              
              {showActions && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {/* View quote details */}}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-600/20 rounded-lg transition-all duration-200"
                    title="Voir les détails"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  
                  {quote.status === 'approved' && (
                    <button
                      onClick={() => {/* Download quote */}}
                      className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-600/20 rounded-lg transition-all duration-200"
                      title="Télécharger"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                  
                  {quote.status === 'pending' && (
                    <button
                      onClick={() => {/* Delete quote */}}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-600/20 rounded-lg transition-all duration-200"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {quote.valid_until && (
            <div className="mt-4 pt-4 border-t border-slate-600">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <p className="text-sm text-slate-300">
                  Valide jusqu'au <span className="text-white font-medium">{formatDate(quote.valid_until)}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuotesList;
