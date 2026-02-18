import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import {
  Home,
  User,
  LogOut,
  Shield,
  FileText,
  AlertTriangle
} from 'lucide-react';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pages where the header is always on a dark background
  const isDarkPage = ['/espace-client', '/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 20);
      const delta = y - (lastYRef.current || 0);
      if (Math.abs(delta) > 8) {
        setHidden(delta > 0 && y > 80);
        lastYRef.current = y;
      }
    };

    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${isActive
      ? 'text-blue-600'
      : isDarkPage && !scrolled
        ? 'text-slate-200 hover:text-white'
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${scrolled
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm h-16'
        : 'bg-transparent h-20'
        } ${hidden
          ? '-translate-y-full opacity-0'
          : 'translate-y-0 opacity-100'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          AssurOnline
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Accueil
          </NavLink>
          <NavLink to="/assurance-auto" className={navLinkClass}>
            Assurance Auto
          </NavLink>
          <NavLink to="/assurance-moto" className={navLinkClass}>
            Assurance Moto
          </NavLink>
          <NavLink to="/a-propos" className={navLinkClass}>
            À Propos
          </NavLink>
          <NavLink to="/devis" className={navLinkClass}>
            Devis
          </NavLink>
          {currentUser && (
            <NavLink to="/claims" className={navLinkClass}>
              Sinistres
            </NavLink>
          )}
          {!currentUser ? (
            <NavLink
              to="/espace-client"
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              s’Identifier
            </NavLink>
          ) : (
            <div className="relative user-menu-container">
              <button
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={toggleUserMenu}
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {currentUser.name?.charAt(0) || 'U'}
                </span>
                <span className={`text-sm font-medium ${isDarkPage && !scrolled ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                  {currentUser.name?.split(' ')[0] || 'Utilisateur'}
                </span>
                <span className={`text-xs transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''} ${isDarkPage && !scrolled ? 'text-slate-300' : 'text-slate-400'}`}>▼</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  {currentUser?.role === 'admin' ? (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Shield className="w-4 h-4 text-blue-500" />
                      Dashboard Admin
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 text-blue-500" />
                      Mon Dashboard
                    </Link>
                  )}
                  <Link to="/devis" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50" onClick={() => setShowUserMenu(false)}>
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Mes Devis
                  </Link>
                  <Link to="/claims" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50" onClick={() => setShowUserMenu(false)}>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Mes Sinistres
                  </Link>
                  <Link to="/" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50" onClick={() => setShowUserMenu(false)}>
                    <Home className="w-4 h-4 text-slate-400" />
                    Accueil
                  </Link>
                  <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
