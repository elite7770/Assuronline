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

  // Helper to render input field
  const renderInput = (id, label, icon, type = 'text', placeholder, colSpan = 1) => (
    <div className={`space-y-2 ${colSpan > 1 ? `md:col-span-${colSpan}` : ''}`}>
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-slate-300">
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={id}
          value={formData[id]}
          onChange={handleChange}
          className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 ${errors[id] ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-blue-500'
            }`}
          placeholder={placeholder}
          disabled={isLoading}
        />
        {errors[id] && (
          <div className="flex items-center gap-1 text-xs text-red-400 mt-1 absolute -bottom-6 left-0 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={12} />
            {errors[id]}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${message.includes('réussie')
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
          {message.includes('réussie') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput('firstName', 'Prénom', <User size={16} className="text-blue-500" />, 'text', 'Votre prénom')}
          {renderInput('lastName', 'Nom de famille', <User size={16} className="text-blue-500" />, 'text', 'Votre nom')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput('email', 'Adresse email', <Mail size={16} className="text-blue-500" />, 'email', 'votre@email.com')}
          {renderInput('phone', 'Téléphone', <Phone size={16} className="text-blue-500" />, 'tel', '+212 6...')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Lock size={16} className="text-blue-500" />
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 pr-10 ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-blue-500'
                  }`}
                placeholder="8+ caractères"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-1 text-xs text-red-400 mt-1 absolute -bottom-6 left-0 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={12} />
                {errors.password}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Lock size={16} className="text-blue-500" />
              Confirmation
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 pr-10 ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-blue-500'
                  }`}
                placeholder="Répétez le mot de passe"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-1 text-xs text-red-400 mt-1 absolute -bottom-6 left-0 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={12} />
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 pt-2 border-t border-slate-800">
          {renderInput('address', 'Adresse', <MapPin size={16} className="text-blue-500" />, 'text', 'Votre adresse complète')}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('postalCode', 'Code postal', <MapPin size={16} className="text-blue-500" />, 'text', '20000')}
            {renderInput('city', 'Ville', <MapPin size={16} className="text-blue-500" />, 'text', 'Casablanca')}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
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
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Inscription en cours...
            </>
          ) : (
            <>
              <User size={18} />
              Créer mon compte
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
