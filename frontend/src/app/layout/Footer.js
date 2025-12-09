import '../../assets/styles/footer.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function NewsletterCTA({ variant }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const validateEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Veuillez saisir une adresse email valide.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      // Simulate async subscribe; replace with real API call if available
      await new Promise((r) => setTimeout(r, 600));
      setStatus('success');
      setMessage('Merci ! Vous êtes bien inscrit(e) à notre newsletter.');
    } catch {
      setStatus('error');
      setMessage('Une erreur est survenue. Merci de réessayer.');
    }
  };

  return (
    <div
      className={`footer-cta footer-cta--${variant} ${variant === 'bottom' ? 'footer-cta--compact' : ''}`}
    >
      <p>Inscrivez-vous à notre newsletter pour recevoir nos conseils et offres exclusives.</p>
      <form className="footer-cta__form" onSubmit={onSubmit} noValidate>
        <label htmlFor="newsletterEmail" className="sr-only">
          Adresse email
        </label>
        <input
          id="newsletterEmail"
          type="email"
          className={`footer-cta__input ${status === 'error' ? 'is-error' : ''}`}
          placeholder="Votre email"
          aria-label="Adresse email pour la newsletter"
          aria-invalid={status === 'error'}
          aria-describedby="newsletterHelp newsletterMessage"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading' || status === 'success'}
          required
        />
        <button
          type="submit"
          className="footer-cta__button"
          disabled={status === 'loading' || status === 'success'}
          aria-busy={status === 'loading'}
        >
          {status === 'loading' ? 'Envoi…' : status === 'success' ? 'Inscrit' : 'S’abonner'}
        </button>
      </form>
      <div id="newsletterHelp" className="footer-cta__help">
        Nous respectons votre vie privée. Désinscription en un clic.
      </div>
      {message && (
        <div
          id="newsletterMessage"
          className={`footer-cta__message ${status}`}
          role={status === 'error' ? 'alert' : undefined}
          aria-live={status === 'error' ? 'assertive' : 'polite'}
        >
          {message}
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wrapper">
        <div className="footer-branding">
          <h2>AssurOnline</h2>
          <p>Protégez ce qui compte le plus — votre mobilité, notre expertise.</p>
        </div>

        {/* Newsletter CTA placed consistently before footer links */}
        <NewsletterCTA variant="middle" />

        <div className="footer-nav">
          <div className="footer-section">
            <h4>Nos Offres</h4>
            <ul>
              <li>
                <Link to="/assurance-auto" aria-label="Aller vers Assurance Auto">
                  Assurance Auto
                </Link>
              </li>
              <li>
                <Link to="/assurance-moto" aria-label="Aller vers Assurance Moto">
                  Assurance Moto
                </Link>
              </li>
              <li>
                <Link to="/contact" aria-label="Nous contacter">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Informations</h4>
            <ul>
              <li>
                <Link to="/a-propos" aria-label="À propos">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" aria-label="Contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/espace-client" aria-label="Espace client">
                  Espace client
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Suivez-nous</h4>
            <ul className="social-links">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ouvrir Facebook dans un nouvel onglet"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ouvrir Twitter dans un nouvel onglet"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ouvrir LinkedIn dans un nouvel onglet"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 AssurOnline. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
