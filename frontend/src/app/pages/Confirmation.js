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
import '../../assets/styles/confirmation.css';

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
    <main className="confirmation-page" role="main" aria-labelledby="confirmation-title">
      <div className="confirmation-card">
        <div className="success-header">
          <div className="success-icon-wrap">
            <CheckCircle size={64} className="success-icon" />
          </div>
          <h1 id="confirmation-title">Devis envoyé avec succès !</h1>
          <p className="success-message">
            Votre demande de devis a été transmise à nos experts. Nous vous répondrons dans les plus
            brefs délais.
          </p>
          <div className="reference-badge" aria-label="Référence de la demande">
            Référence: {reference}
          </div>
          {formData?.email && (
            <p className="success-sub">
              Un accusé a été envoyé à <strong>{formData.email}</strong>.
            </p>
          )}
        </div>

        {formData && (
          <>
            <div className="summary-highlight">
              <div className="vehicle-badge">
                {formData.vehiculeType === 'auto' ? <Car size={18} /> : <Bike size={18} />}
                <span>
                  {formData.vehiculeType === 'auto' ? 'Voiture' : 'Moto'} {formData.marque}{' '}
                  {formData.modele}
                </span>
              </div>
              {typeof premium === 'number' && (
                <div className="price-pill" aria-label="Prix estimé">
                  <span className="currency" aria-hidden>
                    MAD
                  </span>
                  <span className="amount" aria-live="polite">
                    {premium}
                  </span>
                  <span className="period" aria-hidden>
                    /an
                  </span>
                </div>
              )}
            </div>
            <div className="quote-summary" role="region" aria-labelledby="quote-summary-title">
              <h2 id="quote-summary-title">Récapitulatif de votre demande</h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <Shield size={20} />
                  <span>
                    <strong>Véhicule :</strong>{' '}
                    {formData.vehiculeType === 'auto' ? 'Voiture' : 'Moto'} {formData.marque}{' '}
                    {formData.modele}
                  </span>
                </div>
                {typeof premium === 'number' && (
                  <div className="summary-item">
                    <FileText size={20} />
                    <span>
                      <strong>Prix estimé :</strong> {premium} MAD/an
                    </span>
                  </div>
                )}
                <div className="summary-item">
                  <Mail size={20} />
                  <span>
                    <strong>Contact :</strong> {formData.email}
                  </span>
                </div>
              </div>
              {selectedCoverages().length > 0 && (
                <div className="coverage-badges" aria-label="Garanties sélectionnées">
                  {selectedCoverages().map((c) => (
                    <span
                      key={c}
                      className={`coverage-badge ${c === 'Tous Risques' || c === 'Assistance 0km' ? 'accent' : ''}`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="next-steps" role="region" aria-labelledby="next-steps-title">
          <h2 id="next-steps-title">Prochaines étapes</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Analyse de votre dossier</h3>
                <p>Nos experts analysent votre profil et vos besoins</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Devis personnalisé</h3>
                <p>Vous recevez une offre sur mesure sous 24h</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Signature du contrat</h3>
                <p>Validation et mise en place de votre assurance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-info" role="region" aria-labelledby="contact-title">
          <h2 id="contact-title">Besoin d'aide ?</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <Phone size={24} />
              <div>
                <h3>Par téléphone</h3>
                <p>
                  <a href="tel:+212522987654">+212 5 22 98 76 54</a>
                </p>
                <span className="contact-hours">Lun-Ven: 8h-18h</span>
              </div>
            </div>
            <div className="contact-item">
              <Mail size={24} />
              <div>
                <h3>Par email</h3>
                <p>
                  <a href="mailto:devis@assurance-maroc.ma">devis@assurance-maroc.ma</a>
                </p>
                <span className="contact-hours">Réponse sous 2h</span>
              </div>
            </div>
            <div className="contact-item">
              <Clock size={24} />
              <div>
                <h3>En ligne</h3>
                <p>Chat en direct disponible</p>
                <span className="contact-hours">24h/24</span>
              </div>
            </div>
          </div>
        </div>

        <div className="additional-services" role="region" aria-labelledby="services-title">
          <h2 id="services-title">Services complémentaires</h2>
          <div className="services-grid">
            <Link to="/assurance-auto" className="service-card">
              <Car size={32} />
              <h3>Assurance Auto</h3>
              <p>Protection complète pour votre véhicule</p>
            </Link>
            <Link to="/assurance-moto" className="service-card">
              <Bike size={32} />
              <h3>Assurance Moto</h3>
              <p>Garanties adaptées aux motocyclistes</p>
            </Link>
            <Link to="/contact" className="service-card">
              <Phone size={32} />
              <h3>Conseil personnalisé</h3>
              <p>Accompagnement sur mesure</p>
            </Link>
          </div>
        </div>

        <div
          className="action-buttons"
          role="group"
          aria-label="Actions de la page de confirmation"
        >
          <button
            type="button"
            className="download-summary-button"
            title="Télécharger un PDF imprimable"
            onClick={handlePrint}
          >
            <Download size={18} /> Télécharger le PDF
          </button>
          <button
            type="button"
            className="share-button"
            title="Partager ce récapitulatif"
            onClick={handleShare}
          >
            <Share2 size={18} /> Partager
          </button>
          <Link to="/" className="return-button" title="Retourner à l'accueil">
            Retour à l'accueil
          </Link>
          <Link to="/contact" className="new-quote-button" title="Nous contacter">
            Nous contacter
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Confirmation;
