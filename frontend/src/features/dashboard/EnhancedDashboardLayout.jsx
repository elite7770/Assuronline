import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Shield,
  CreditCard,
  AlertTriangle,
  Users,
  Settings,
  Menu,
  X,
  Car,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Home,
  User,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { useTheme } from '../../shared/context/ThemeContext';
import {
  profileAPI,
  notificationsAPI,
  quotesAPI,
  policiesAPI,
  paymentsAPI,
  claimsAPI,
  adminUsersAPI
} from '../../shared/services/api';

const getAdminNavigation = (counts) => [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, badge: null },
  { name: 'Devis', href: '/admin/quotes', icon: FileText, badge: counts.quotes > 0 ? counts.quotes.toString() : null },
  { name: 'Polices', href: '/admin/policies', icon: Shield, badge: counts.policies > 0 ? counts.policies.toString() : null },
  { name: 'Paiements', href: '/admin/payments', icon: CreditCard, badge: counts.payments > 0 ? counts.payments.toString() : null },
  { name: 'Sinistres', href: '/admin/claims', icon: AlertTriangle, badge: counts.claims > 0 ? counts.claims.toString() : null },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users, badge: counts.users > 0 ? counts.users.toString() : null },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings, badge: null },
];

const getClientNavigation = (counts) => [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard, badge: null },
  { name: 'Mes Devis', href: '/client/quotes', icon: FileText, badge: counts.quotes > 0 ? counts.quotes.toString() : null },
  { name: 'Mes Polices', href: '/client/policies', icon: Shield, badge: counts.policies > 0 ? counts.policies.toString() : null },
  { name: 'Paiements', href: '/client/payments', icon: CreditCard, badge: counts.payments > 0 ? counts.payments.toString() : null },
  { name: 'Sinistres', href: '/client/claims', icon: AlertTriangle, badge: counts.claims > 0 ? counts.claims.toString() : null },
];

const EnhancedDashboardLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [counts, setCounts] = useState({ quotes: 0, policies: 0, payments: 0, claims: 0, users: 0 });

  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  const isAdmin = location.pathname.startsWith('/admin');
  const navigation = isAdmin ? getAdminNavigation(counts) : getClientNavigation(counts);

  const loadUserData = async () => {
    try {
      setIsLoadingUser(true);
      const [profileResponse, notificationsResponse] = await Promise.all([
        profileAPI.get(),
        notificationsAPI.list().catch(() => ({ data: [] }))
      ]);
      setUserData(profileResponse.data.data);
      setNotifications(notificationsResponse.data || []);
    } catch (error) {
      setUserData({
        first_name: user?.name?.split(' ')[0] || 'User',
        last_name: user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        role: user?.role || 'client',
        avatar_url: null
      });
    } finally {
      setIsLoadingUser(false);
    }
  };

  const lastCountsFetch = useRef(0);

  useEffect(() => { if (user) loadUserData(); }, [user]);

  const loadCounts = async () => {
    try {
      if (isAdmin) {
        const [quotesRes, policiesRes, paymentsRes, claimsRes, usersRes] = await Promise.all([
          quotesAPI.getAll().catch(() => ({ data: [] })),
          policiesAPI.listAdmin().catch(() => ({ data: [] })),
          paymentsAPI.listAll().catch(() => ({ data: [] })),
          claimsAPI.listAll().catch(() => ({ data: [] })),
          adminUsersAPI.list().catch(() => ({ data: [] })),
        ]);
        setCounts({
          quotes: Array.isArray(quotesRes.data) ? quotesRes.data.length : (quotesRes.data?.data?.length || 0),
          policies: Array.isArray(policiesRes.data) ? policiesRes.data.length : (policiesRes.data?.data?.length || 0),
          payments: Array.isArray(paymentsRes.data) ? paymentsRes.data.length : (paymentsRes.data?.data?.length || 0),
          claims: Array.isArray(claimsRes.data) ? claimsRes.data.length : (claimsRes.data?.data?.length || 0),
          users: Array.isArray(usersRes.data) ? usersRes.data.length : (usersRes.data?.data?.length || 0),
        });
      } else {
        const [quotesRes, policiesRes, paymentsRes, claimsRes] = await Promise.all([
          quotesAPI.getMyQuotes().catch(() => ({ data: [] })),
          policiesAPI.list().catch(() => ({ data: [] })),
          paymentsAPI.list().catch(() => ({ data: [] })),
          claimsAPI.list().catch(() => ({ data: [] })),
        ]);
        setCounts({
          quotes: Array.isArray(quotesRes.data) ? quotesRes.data.length : (quotesRes.data?.data?.length || 0),
          policies: Array.isArray(policiesRes.data) ? policiesRes.data.length : (policiesRes.data?.data?.length || 0),
          payments: Array.isArray(paymentsRes.data) ? paymentsRes.data.length : (paymentsRes.data?.data?.length || 0),
          claims: Array.isArray(claimsRes.data) ? claimsRes.data.length : (claimsRes.data?.data?.length || 0),
          users: 0,
        });
      }
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  };

  useEffect(() => {
    if (user) loadCounts();
    // Only re-fetch counts on mount, not on every route change
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleDataUpdate = () => {
      // Throttle: only re-fetch counts if last fetch was >30s ago
      const now = Date.now();
      if (now - lastCountsFetch.current > 30_000) {
        lastCountsFetch.current = now;
        loadCounts();
      }
    };
    window.addEventListener('dataUpdated', handleDataUpdate);
    return () => window.removeEventListener('dataUpdated', handleDataUpdate);
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleProfileUpdate = () => loadUserData();
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => logout();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setUserMenuOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'k') { event.preventDefault(); document.querySelector('.dashboard-search-input')?.focus(); }
        if (event.key === '/') { event.preventDefault(); setMobileSidebarOpen(v => !v); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileSidebarOpen(false); }, [location.pathname]);

  const currentPageName = navigation.find(n => n.href === location.pathname)?.name || '';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20 flex-shrink-0">
          <Car className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-lg leading-none">AssurOnline</span>
          <p className="text-slate-500 text-xs mt-0.5">{isAdmin ? 'Administration' : 'Espace Client'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          {isAdmin ? 'Gestion' : 'Navigation'}
        </p>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
            >
              <item.icon className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? 'text-red-400' : 'text-slate-500 group-hover:text-slate-300'}`} style={{ width: '1.125rem', height: '1.125rem' }} />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-red-500/30 text-red-300' : 'bg-slate-600 text-slate-300'
                  }`}>
                  {item.badge}
                </span>
              )}
              {isActive && <div className="w-1 h-1 rounded-full bg-red-400" />}
            </Link>
          );
        })}
      </nav>


    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ── Mobile sidebar overlay ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Mobile sidebar (slide-in) ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-700/60 transform transition-transform duration-300 ease-in-out lg:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Desktop persistent sidebar ── */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 border-r border-slate-700/60 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">

        {/* ── Header ── */}
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-sm">
          <div className="flex items-center gap-4 px-4 sm:px-6 h-14">

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-sm">
              <Link
                to={isAdmin ? '/admin/dashboard' : '/client/dashboard'}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                Dashboard
              </Link>
              {currentPageName && currentPageName !== 'Dashboard' && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                  <span className="text-slate-300 font-medium">{currentPageName}</span>
                </>
              )}
            </nav>

            {/* Search */}
            <div className={`flex-1 max-w-md relative transition-all duration-200 ${searchFocused ? 'max-w-lg' : ''}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="dashboard-search-input w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 text-white text-sm rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Home link */}
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg text-sm transition-all duration-200"
                title="Retour à l'accueil"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Accueil</span>
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-all duration-200"
                title="Changer le thème"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-all duration-200"
                title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-all duration-200"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/60">
                      <h3 className="text-white font-semibold text-sm">Notifications</h3>
                      <button onClick={() => setNotificationsOpen(false)} className="text-slate-500 hover:text-white">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((n, i) => (
                          <div key={n.id || i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-700/40 transition-colors border-b border-slate-700/30 last:border-0">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Bell className="h-3.5 w-3.5 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-slate-200 text-sm">{n.title || n.message}</p>
                              <p className="text-slate-500 text-xs mt-0.5">
                                {n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Récemment'}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Bell className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                          <p className="text-slate-500 text-sm">Aucune notification</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  disabled={isLoadingUser}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-slate-700/60 rounded-xl transition-all duration-200 ml-1"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {isLoadingUser ? '…' : `${userData?.first_name?.[0] || 'U'}${userData?.last_name?.[0] || ''}`}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-white text-xs font-medium leading-none">
                      {isLoadingUser ? '...' : `${userData?.first_name || 'User'}`}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{userData?.role || 'client'}</p>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-700/60">
                      <p className="text-white text-sm font-semibold">{userData?.first_name} {userData?.last_name}</p>
                      <p className="text-slate-500 text-xs mt-0.5 truncate">{userData?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700/60 text-sm transition-colors">
                        <User className="h-4 w-4" /> Profil
                      </Link>
                      <Link to="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700/60 text-sm transition-colors">
                        <Settings className="h-4 w-4" /> Paramètres
                      </Link>
                      <Link to="/help" className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700/60 text-sm transition-colors">
                        <HelpCircle className="h-4 w-4" /> Aide
                      </Link>
                    </div>
                    <div className="border-t border-slate-700/60 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default EnhancedDashboardLayout;
