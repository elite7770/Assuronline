import { ShieldCheck, KeyRound, LockKeyhole } from 'lucide-react';
import AuthCard from './AuthCard';
import { useAuth } from '../../shared/context/AuthContext';
import './AuthCard.css';

export default function AuthPage() {
  const { login, register } = useAuth();

  async function handleLogin({ emailOrUsername, password }) {
    return login(emailOrUsername, password);
  }

  async function handleRegister({ emailOrUsername, password }) {
    // If your API expects first/last name, extend AuthCard or collect later
    return register(emailOrUsername, emailOrUsername, password);
  }

  return (
    <div className="auth-grid">
      <section className="auth-left" aria-label="Why choose us">
        <div className="brand-section">
          <div className="brand-mark">
            <img src="/logo.svg" alt="" aria-hidden="true" />
            <h1>AssurOnline</h1>
          </div>
          <p className="brand-tagline">
            Assurez votre mobilité avec une expérience simple et rapide.
          </p>
        </div>

        <ul className="features">
          <li>
            <span className="icon">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h3>Couverture fiable</h3>
              <p>Des garanties adaptées à votre profil et vos besoins.</p>
            </div>
          </li>
          <li>
            <span className="icon">
              <KeyRound size={18} />
            </span>
            <div>
              <h3>Inscription rapide</h3>
              <p>Créez votre compte et obtenez un devis en quelques minutes.</p>
            </div>
          </li>
          <li>
            <span className="icon">
              <LockKeyhole size={18} />
            </span>
            <div>
              <h3>Données protégées</h3>
              <p>Vos informations sont chiffrées et stockées de manière sécurisée.</p>
            </div>
          </li>
        </ul>

        <div className="security-badge" aria-hidden="true">
          ISO 27001 • TLS 1.3 • RGPD
        </div>
      </section>

      <section className="auth-right">
        <AuthCard
          defaultMode="login"
          logoSrc="/logo.svg"
          appName="AssurOnline"
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </section>
    </div>
  );
}
