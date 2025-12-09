import { useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import '../../assets/styles/auth-forms.css';

function LoginForm({ onSwitchToRegister: _onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    // Login form submitted

    try {
      const result = await login(formData.email, formData.password);
      // Login result
      if (result.success) {
        setMessage('Connexion réussie ! Redirection...');
        setTimeout(() => {
          // Get redirect URL from query parameters, default to home
          const searchParams = new URLSearchParams(location.search);
          const redirectTo = searchParams.get('redirect') || '/';
          navigate(redirectTo);
        }, 1000);
      } else {
        setMessage(result.error || 'Email ou mot de passe incorrect');
      }
    } catch {
      setMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      {message && (
        <div className={message.includes('réussie') ? 'success-message' : 'error-message-global'}>
          {message.includes('réussie') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">
            <Mail size={16} />
            Adresse email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="votre@email.com"
            disabled={isLoading}
          />
          {errors.email && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <Lock size={16} />
            Mot de passe
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Votre mot de passe"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
              }}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errors.password}
            </div>
          )}
        </div>

        <div className="form-options">
          <button
            type="button"
            className="forgot-password-button"
            onClick={() => setMessage('Fonctionnalité à venir : réinitialisation par email')}
            disabled={isLoading}
          >
            Mot de passe oublié ?
          </button>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              Connexion en cours...
            </div>
          ) : (
            <>
              <Lock size={20} />
              Se connecter
            </>
          )}
        </button>
      </form>

      {/* Demo accounts section removed per request */}
    </div>
  );
}

export default LoginForm;
