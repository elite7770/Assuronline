import { useState, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, Lock, FileText, CreditCard, Bell, CheckCircle } from 'lucide-react';
import LoginForm from '../../features/auth/LoginForm';
import RegisterForm from '../../features/auth/RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';

function EspaceClient() {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      const searchParams = new URLSearchParams(location.search);
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo);
    }
  }, [currentUser, navigate, location.search]);

  if (currentUser) {
    return null;
  }

  const features = [
    { icon: <Shield className="w-6 h-6" />, title: 'Assurance Auto & Moto', desc: 'Tarifs compétitifs adaptés au Maroc' },
    { icon: <FileText className="w-6 h-6" />, title: 'Devis en 2 minutes', desc: 'Obtenez votre devis instantanément' },
    { icon: <CreditCard className="w-6 h-6" />, title: 'Paiement en MAD', desc: 'Réglez vos primes en dirhams' },
    { icon: <Bell className="w-6 h-6" />, title: 'Support 24/7', desc: 'Assistance en français disponible' },
  ];

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900/90 z-10" />
        <img
          src="/images/auth-bg.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
          onError={(e) => e.target.style.display = 'none'}
        />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 relative z-10 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden min-h-[700px]">

        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">AssurOnline</h1>
                <p className="text-blue-200 text-sm font-medium">Votre assurance, simplifiée</p>
              </div>
            </div>
            <p className="mt-8 text-xl text-slate-300 leading-relaxed font-light">
              Rejoignez plus de <span className="text-white font-semibold">15,000 clients satisfaits</span> au Maroc et profitez d'une protection optimale.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 relative z-10 mt-12">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-colors"
              >
                <div className="text-blue-400 mt-1">{feature.icon}</div>
                <div>
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400 mt-12 pt-8 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>15,000+ Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>98% Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication Forms */}
        <div className="flex flex-col justify-center p-8 lg:p-12 h-full overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Accédez à votre espace</h2>
              <p className="text-slate-400">Gérez vos contrats en toute simplicité</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl mb-8 border border-slate-700/50">
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${isLogin
                    ? 'bg-slate-700 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                onClick={() => setIsLogin(true)}
              >
                <Lock className="w-4 h-4" />
                Connexion
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${!isLogin
                    ? 'bg-slate-700 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                onClick={() => setIsLogin(false)}
              >
                <User className="w-4 h-4" />
                Inscription
              </button>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isLogin ? (
                  <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                ) : (
                  <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <Lock className="w-3 h-3" />
                Connexion sécurisée SSL 256-bit
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EspaceClient;
