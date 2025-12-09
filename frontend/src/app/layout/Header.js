import { NavLink, useNavigate, Link } from 'react-router-dom';
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
import '../../assets/styles/header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}>
      <div className="header-container">
        <Link to="/" className="site-logo">
          AssurOnline
        </Link>
        <nav className="site-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Accueil
          </NavLink>
          <NavLink to="/assurance-auto" className={({ isActive }) => (isActive ? 'active' : '')}>
            Assurance Auto
          </NavLink>
          <NavLink to="/assurance-moto" className={({ isActive }) => (isActive ? 'active' : '')}>
            Assurance Moto
          </NavLink>
          <NavLink to="/a-propos" className={({ isActive }) => (isActive ? 'active' : '')}>
            À Propos
          </NavLink>
          <NavLink to="/devis" className={({ isActive }) => (isActive ? 'active' : '')}>
            Devis
          </NavLink>
          {currentUser && (
            <NavLink to="/claims" className={({ isActive }) => (isActive ? 'active' : '')}>
              Sinistres
            </NavLink>
          )}
          {!currentUser ? (
            <NavLink to="/espace-client" className={({ isActive }) => (isActive ? 'active' : '')}>
              s’Identifier
            </NavLink>
          ) : (
            <div className="user-menu-container">
              <button className="user-menu-button" onClick={toggleUserMenu}>
                <span className="user-avatar-small">{currentUser.name?.charAt(0) || 'U'}</span>
                <span className="user-name">
                  {currentUser.name?.split(' ')[0] || 'Utilisateur'}
                </span>
                <span className="dropdown-arrow">▼</span>
              </button>
              {showUserMenu && (
                <div className="user-menu">
                  {currentUser?.role === 'admin' ? (
                    <Link
                      to="/admin/dashboard"
                      className="menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Dashboard Admin
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Mon Dashboard
                    </Link>
                  )}
                  <Link to="/devis" className="menu-item" onClick={() => setShowUserMenu(false)}>
                    <FileText className="w-4 h-4" />
                    Mes Devis
                  </Link>
                  <Link to="/claims" className="menu-item" onClick={() => setShowUserMenu(false)}>
                    <AlertTriangle className="w-4 h-4" />
                    Mes Sinistres
                  </Link>
                  <Link to="/" className="menu-item" onClick={() => setShowUserMenu(false)}>
                    <Home className="w-4 h-4" />
                    Accueil
                  </Link>
                  <button onClick={handleLogout} className="logout-menu-item">
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
