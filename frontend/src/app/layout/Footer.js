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
      className={`rounded-2xl p-8 mb-12 ${variant === 'bottom' ? 'bg-slate-800' : 'bg-gradient-to-br from-blue-600 to-indigo-700'
        }`}
    >
      <p className="text-white text-lg mb-6 text-center max-w-2xl mx-auto">
        Inscrivez-vous à notre newsletter pour recevoir nos conseils et offres exclusives.
      </p>
      <form className="max-w-md mx-auto flex gap-2" onSubmit={onSubmit} noValidate>
        <label htmlFor="newsletterEmail" className="sr-only">
          Adresse email
        </label>
        <input
          id="newsletterEmail"
          type="email"
          className={`flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm ${status === 'error' ? 'border-red-400 ring-1 ring-red-400' : ''
            }`}
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
          className="px-6 py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
          disabled={status === 'loading' || status === 'success'}
          aria-busy={status === 'loading'}
        >
          {status === 'loading' ? '...' : status === 'success' ? '✓' : 'S’abonner'}
        </button>
      </form>
      <div id="newsletterHelp" className="text-center text-blue-200 text-xs mt-4">
        Nous respectons votre vie privée. Désinscription en un clic.
      </div>
      {message && (
        <div
          id="newsletterMessage"
          className={`text-center mt-3 text-sm font-medium ${status === 'error' ? 'text-red-300' : 'text-emerald-300'
            }`}
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
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">AssurOnline</h2>
          <p className="text-slate-400">Protégez ce qui compte le plus — votre mobilité, notre expertise.</p>
        </div>

        {/* Newsletter CTA placed consistently before footer links */}
        <NewsletterCTA variant="middle" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-800 pt-12">
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-6">Nos Offres</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/assurance-auto" className="hover:text-blue-400 transition-colors" aria-label="Aller vers Assurance Auto">
                  Assurance Auto
                </Link>
              </li>
              <li>
                <Link to="/assurance-moto" className="hover:text-blue-400 transition-colors" aria-label="Aller vers Assurance Moto">
                  Assurance Moto
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors" aria-label="Nous contacter">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-6">Informations</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/a-propos" className="hover:text-blue-400 transition-colors" aria-label="À propos">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors" aria-label="Contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/espace-client" className="hover:text-blue-400 transition-colors" aria-label="Espace client">
                  Espace client
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-6">Suivez-nous</h4>
            <ul className="flex justify-center md:justify-start gap-6">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
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
                  className="hover:text-blue-400 transition-colors"
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
                  className="hover:text-blue-400 transition-colors"
                  aria-label="Ouvrir LinkedIn dans un nouvel onglet"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
        <p>&copy; 2025 AssurOnline. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
