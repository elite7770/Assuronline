import { useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

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

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        setMessage('Connexion réussie ! Redirection...');
        setTimeout(() => {
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
    <div className="w-full max-w-md mx-auto">
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
        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Mail size={16} className="text-blue-500" />
            Adresse email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-blue-500'
              }`}
            placeholder="votre@email.com"
            disabled={isLoading}
          />
          {errors.email && (
            <div className="flex items-center gap-1 text-xs text-red-400 mt-1">
              <AlertCircle size={12} />
              {errors.email}
            </div>
          )}
        </div>

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
              placeholder="Votre mot de passe"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <div className="flex items-center gap-1 text-xs text-red-400 mt-1">
              <AlertCircle size={12} />
              {errors.password}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            onClick={() => setMessage('Fonctionnalité à venir : réinitialisation par email')}
            disabled={isLoading}
          >
            Mot de passe oublié ?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              <Lock size={18} />
              Se connecter
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
