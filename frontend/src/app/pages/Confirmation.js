import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircle,
  Phone,
  Mail,
  Clock,
  Shield,
  FileText,
  Car,
  Bike,
  Download,
  Share2,
} from 'lucide-react';
// import '../../assets/styles/confirmation.css'; // Removed

function Confirmation() {
  const location = useLocation();
  const { formData, premium } = location.state || {};
  const reference = useMemo(() => `DEVIS-${Date.now().toString().slice(-6)}`, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'Demande de devis - AssurOnline',
        text: "Voici le récapitulatif de ma demande de devis d'assurance.",
        url: window.location.href,
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        alert('Lien copié dans le presse-papiers');
      }
    } catch {
      alert('Partage non disponible sur cet appareil.');
    }
  };

  const selectedCoverages = () => {
    if (!formData) return [];
    const mapping = [
      { key: 'garantieVol', label: 'Vol' },
      { key: 'garantieBris', label: 'Bris de glace' },
      { key: 'garantieTousRisques', label: 'Tous Risques' },
      { key: 'garantieAssistance', label: 'Assistance 0km' },
      { key: 'garantieDefense', label: 'Défense pénale' },
    ];
    return mapping.filter((m) => !!formData[m.key]).map((m) => m.label);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8" role="main" aria-labelledby="confirmation-title">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">

        {/* Header */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 text-center border-b border-emerald-100 dark:border-emerald-900/30">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 id="confirmation-title" className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Devis envoyé avec succès !</h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto text-lg mb-6">
            Votre demande de devis a été transmise à nos experts. Nous vous répondrons dans les plus brefs délais.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono text-sm font-medium shadow-sm" aria-label="Référence de la demande">
            Référence: {reference}
          </div>
          {formData?.email && (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Un accusé a été envoyé à <strong className="font-semibold text-slate-700 dark:text-slate-200">{formData.email}</strong>.
            </p>
          )}
        </div>

        <div className="p-8">
          {formData && (
            <>
              {/* Summary Highlight */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-blue-600 dark:text-blue-400">
                    {formData.vehiculeType === 'auto' ? <Car size={24} /> : <Bike size={24} />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Véhicule</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {formData.marque} {formData.modele}
                    </div>
                  </div>
                </div>
                {typeof premium === 'number' && (
                  <div className="text-right bg-white dark:bg-slate-800 px-6 py-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700" aria-label="Prix estimé">
                    <span className="block text-xs text-slate-500 mb-1" aria-hidden>Estimation</span>
                    <div className="flex items-baseline gap-1 text-slate-900 dark:text-white">
                      <span className="text-2xl font-bold" aria-live="polite">{premium}</span>
                      <span className="text-sm font-medium text-slate-500">MAD/an</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Summary */}
              <div className="mb-12" role="region" aria-labelledby="quote-summary-title">
                <h2 id="quote-summary-title" className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Récapitulatif
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-300 text-sm">
                      {formData.email}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-300 text-sm">
                      {formData.vehiculeType === 'auto' ? 'Assurance Auto' : 'Assurance Moto'}
                    </span>
                  </div>
                </div>

                {selectedCoverages().length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Garanties incluses :</h3>
                    <div className="flex flex-wrap gap-2" aria-label="Garanties sélectionnées">
                      {selectedCoverages().map((c) => (
                        <span
                          key={c}
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${c === 'Tous Risques' || c === 'Assistance 0km'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Next Steps */}
          <div className="mb-12" role="region" aria-labelledby="next-steps-title">
            <h2 id="next-steps-title" className="text-xl font-bold text-slate-900 dark:text-white mb-6">Prochaines étapes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                { title: "Analyse", desc: "Nos experts étudient votre dossier" },
                { title: "Offre", desc: "Proposition sur mesure sous 24h" },
                { title: "Signature", desc: "Validation et assurance active" }
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mb-4 shadow-lg ring-4 ring-white dark:ring-slate-800">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                </div>
              ))}
              {/* Connector Line */}
              <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block z-0" />
            </div>
          </div>

          {/* Contact & Support */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Phone, title: "Par téléphone", link: "tel:+212522987654", linkText: "+212 5 22 98 76 54", extra: "Lun-Ven: 8h-18h" },
              { icon: Mail, title: "Par email", link: "mailto:devis@assurance-maroc.ma", linkText: "devis@assurance-maroc.ma", extra: "Réponse sous 2h" },
              { icon: Clock, title: "En ligne", link: "#", linkText: "Chat en direct", extra: "24h/24" },
            ].map((contact, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-white hover:shadow-md transition-all text-center border border-slate-100 dark:border-slate-700">
                <contact.icon className="w-6 h-6 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{contact.title}</h3>
                <a href={contact.link} className="text-sm text-blue-600 hover:underline block mb-1">{contact.linkText}</a>
                <span className="text-xs text-slate-400">{contact.extra}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
              onClick={handlePrint}
            >
              <Download size={18} /> Télécharger PDF
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
              onClick={handleShare}
            >
              <Share2 size={18} /> Partager
            </button>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Confirmation;
