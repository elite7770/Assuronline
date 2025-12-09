import { useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Phone,
  MapPin,
} from 'lucide-react';
// REFACTORED: Added missing AuthForms.css import for consistent styling
import '../../assets/styles/auth-forms.css';

function RegisterForm({ onSwitchToLogin: _onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    postalCode: '',
    city: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { register } = useAuth();

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom de famille est requis';
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.phone) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^(\+212|0)[5-7][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Le numéro de téléphone marocain n'est pas valide";
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
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

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const result = await register(fullName, formData.email, formData.password);

      if (result.success) {
        setMessage('Inscription réussie ! Connexion automatique...');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage(result.error || "Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } catch {
      setMessage("Erreur lors de l'inscription. Veuillez réessayer.");
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
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              <User size={16} />
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
              placeholder="Votre prénom"
              disabled={isLoading}
            />
            {errors.firstName && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.firstName}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              <User size={16} />
              Nom de famille
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
              placeholder="Votre nom"
              disabled={isLoading}
            />
            {errors.lastName && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

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
          <label htmlFor="phone">
            <Phone size={16} />
            Numéro de téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
            placeholder="+212 6 12 34 56 78"
            disabled={isLoading}
          />
          {errors.phone && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errors.phone}
            </div>
          )}
        </div>

        <div className="form-row">
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

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <Lock size={16} />
              Confirmer le mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirmez votre mot de passe"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">
            <MapPin size={16} />
            Adresse
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            placeholder="Votre adresse complète"
            disabled={isLoading}
          />
          {errors.address && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errors.address}
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="postalCode">
              <MapPin size={16} />
              Code postal
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={errors.postalCode ? 'error' : ''}
              placeholder="20000"
              disabled={isLoading}
            />
            {errors.postalCode && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.postalCode}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="city">
              <MapPin size={16} />
              Ville
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? 'error' : ''}
              placeholder="Casablanca"
              disabled={isLoading}
            />
            {errors.city && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.city}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={
            isLoading ||
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.phone ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.address ||
            !formData.postalCode ||
            !formData.city
          }
        >
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              Inscription en cours...
            </div>
          ) : (
            <>
              <User size={20} />
              Créer mon compte
            </>
          )}
        </button>
      </form>

      {/* Removed security/confidentiality footer per request */}
    </div>
  );
}

export default RegisterForm;
