import { useState, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, Lock, FileText, CreditCard, Bell } from 'lucide-react';
import LoginForm from '../../features/auth/LoginForm';
import RegisterForm from '../../features/auth/RegisterForm';
import '../../assets/styles/espace-client.css';

function EspaceClient() {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already logged in, redirect to home or redirect URL
  useEffect(() => {
    if (currentUser) {
      // Get redirect URL from query parameters, default to home
      const searchParams = new URLSearchParams(location.search);
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo);
    }
  }, [currentUser, navigate, location.search]);

  // If user is already logged in, don't render the component
  if (currentUser) {
    return null;
  }

  return (
    <main className="espace-client-page">
      {/* Background Video/Image */}
      <div className="auth-background">
        <div className="background-overlay"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          {/* Left Side - Branding & Features */}
          <div className="auth-left">
            <div className="brand-section">
              <div className="logo-container">
                <div className="logo-icon">
                  <Shield size={40} />
                </div>
                <div className="brand-text">
                  <h1>AssurOnline</h1>
                  <span className="brand-tagline">Votre assurance, simplifiée</span>
                </div>
              </div>
              <p className="brand-subtitle">Rejoignez plus de 15,000 clients satisfaits au Maroc</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield size={24} />
                </div>
                <div className="feature-content">
                  <h3>Assurance Auto & Moto</h3>
                  <p>Tarifs compétitifs adaptés au marché marocain</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FileText size={24} />
                </div>
                <div className="feature-content">
                  <h3>Devis en 2 minutes</h3>
                  <p>Obtenez votre devis personnalisé instantanément</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <CreditCard size={24} />
                </div>
                <div className="feature-content">
                  <h3>Paiement en MAD</h3>
                  <p>Réglez vos primes en dirhams marocains</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Bell size={24} />
                </div>
                <div className="feature-content">
                  <h3>Support 24/7</h3>
                  <p>Assistance en français disponible</p>
                </div>
              </div>
            </div>

            <div className="trust-indicators">
              <div className="trust-item">
                <div className="trust-number">15,000+</div>
                <div className="trust-label">Clients</div>
              </div>
              <div className="trust-item">
                <div className="trust-number">98%</div>
                <div className="trust-label">Satisfaction</div>
              </div>
              <div className="trust-item">
                <div className="trust-number">24/7</div>
                <div className="trust-label">Support</div>
              </div>
            </div>
          </div>

          {/* Right Side - Authentication Forms */}
          <div className="auth-right">
            <div className="auth-header">
              <h2>Accédez à votre espace</h2>
              <p>Connectez-vous ou créez votre compte</p>
            </div>

            {/* Tab Navigation */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                <Lock size={18} />
                <span>Connexion</span>
              </button>
              <button
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                <User size={18} />
                <span>Inscription</span>
              </button>
            </div>

            {/* Form Content */}
            <div className="form-container">
              {isLogin ? (
                <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
              )}
            </div>

            <div className="security-footer">
              <div className="security-badge">
                <Lock size={14} />
                <span>Connexion sécurisée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EspaceClient;
