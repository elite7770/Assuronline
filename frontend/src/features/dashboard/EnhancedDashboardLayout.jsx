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

// Enhanced navigation configuration - now functions that accept counts
const getAdminNavigation = (counts) => [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, badge: null },
  { name: 'Devis', href: '/admin/quotes', icon: FileText, badge: counts.quotes > 0 ? counts.quotes.toString() : null },
  { name: 'Policies', href: '/admin/policies', icon: Shield, badge: counts.policies > 0 ? counts.policies.toString() : null },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard, badge: counts.payments > 0 ? counts.payments.toString() : null },
  { name: 'Claims', href: '/admin/claims', icon: AlertTriangle, badge: counts.claims > 0 ? counts.claims.toString() : null },
  { name: 'Users', href: '/admin/users', icon: Users, badge: counts.users > 0 ? counts.users.toString() : null },
  { name: 'Settings', href: '/admin/settings', icon: Settings, badge: null },
];

const getClientNavigation = (counts) => [
  { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard, badge: null },
  { name: 'My Devis', href: '/client/quotes', icon: FileText, badge: counts.quotes > 0 ? counts.quotes.toString() : null },
  { name: 'My Policies', href: '/client/policies', icon: Shield, badge: counts.policies > 0 ? counts.policies.toString() : null },
  { name: 'My Payments', href: '/client/payments', icon: CreditCard, badge: counts.payments > 0 ? counts.payments.toString() : null },
  { name: 'My Claims', href: '/client/claims', icon: AlertTriangle, badge: counts.claims > 0 ? counts.claims.toString() : null },
];

const EnhancedDashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [counts, setCounts] = useState({
    quotes: 0,
    policies: 0,
    payments: 0,
    claims: 0,
    users: 0,
  });
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  const isAdmin = location.pathname.startsWith('/admin');
  const navigation = isAdmin ? getAdminNavigation(counts) : getClientNavigation(counts);

  // Load user profile data
  const loadUserData = async () => {
    try {
      setIsLoadingUser(true);
      const [profileResponse, notificationsResponse] = await Promise.all([
        profileAPI.get(),
        notificationsAPI.list().catch(() => ({ data: [] })) // Gracefully handle if notifications API fails
      ]);

      setUserData(profileResponse.data.data);
      setNotifications(notificationsResponse.data || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to auth context user data
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

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  // Load counts data
  const loadCounts = async () => {
    try {
      if (isAdmin) {
        // Admin: fetch all counts
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
        // Client: fetch own counts
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

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      loadUserData();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  // Load counts when user or location changes
  useEffect(() => {
    if (user) {
      loadCounts();
    }
  }, [user, location.pathname]);

  // Listen for data changes to refresh counts
  useEffect(() => {
    const handleDataUpdate = () => {
      loadCounts();
    };

    window.addEventListener('dataUpdated', handleDataUpdate);
    return () => window.removeEventListener('dataUpdated', handleDataUpdate);
  }, [isAdmin]);

  const handleLogout = () => {
    logout();
  };

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
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            document.querySelector('.enhanced-search-input')?.focus();
            break;
          case '/':
            event.preventDefault();
            setSidebarOpen(!sidebarOpen);
            break;
          default:
            // No action for other keys
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="enhanced-dashboard-root">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="enhanced-sidebar">
          {/* Mobile sidebar header */}
          <div className="enhanced-sidebar-header">
            <div className="enhanced-logo">
              <div className="enhanced-logo-icon">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="enhanced-logo-text">AssurOnline</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="enhanced-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="enhanced-nav">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`enhanced-nav-link ${isActive ? 'enhanced-nav-link--active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="enhanced-nav-icon" />
                  <span className="enhanced-nav-text">{item.name}</span>
                  {item.badge && (
                    <span className="enhanced-nav-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>

        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="enhanced-sidebar">
          {/* Desktop sidebar header */}
          <div className="enhanced-sidebar-header">
            <div className="enhanced-logo">
              <div className="enhanced-logo-icon">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="enhanced-logo-text">AssurOnline</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="enhanced-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="enhanced-nav">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`enhanced-nav-link ${isActive ? 'enhanced-nav-link--active' : ''}`}
                >
                  <item.icon className="enhanced-nav-icon" />
                  <span className="enhanced-nav-text">{item.name}</span>
                  {item.badge && (
                    <span className="enhanced-nav-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>

        </div>
      </div>

      {/* Main content area */}
      <div className="">
        {/* Enhanced header */}
        <header className="enhanced-header">
          <div className="enhanced-header-content">
            {/* Left section */}
            <div className="enhanced-header-left">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="enhanced-mobile-menu-btn"
                title="Open sidebar (Ctrl+/)"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Breadcrumbs */}
              <nav className="enhanced-breadcrumbs">
                <Link to={isAdmin ? '/admin/dashboard' : '/client/dashboard'} className="enhanced-breadcrumb-dashboard">
                  Dashboard
                </Link>
                {location.pathname !== (isAdmin ? '/admin/dashboard' : '/client/dashboard') && (
                  <>
                    <span className="enhanced-breadcrumb-separator">/</span>
                    <span className="enhanced-breadcrumb-current">
                      {location.pathname.split('/').pop()?.replace('-', ' ') || 'Page'}
                    </span>
                  </>
                )}
              </nav>
            </div>

            {/* Center section - Search */}
            <div className="enhanced-search-container">
              <Search className="enhanced-search-icon" />
              <input
                type="text"
                placeholder="Rechercher polices, utilisateurs... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`enhanced-search-input ${searchFocused ? 'enhanced-search-input--focused' : ''}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="enhanced-search-clear"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Right section - Actions */}
            <div className="enhanced-header-actions">
              {/* Quick actions */}
              <div className="enhanced-quick-actions">
                <Link
                  to="/"
                  className="enhanced-action-btn enhanced-home-btn"
                  title="Retour à l'accueil"
                >
                  <Home className="h-5 w-5" />
                  <span className="enhanced-home-text">Accueil</span>
                </Link>

                <button
                  onClick={toggleFullscreen}
                  className="enhanced-action-btn"
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
              </div>

              {/* Notifications dropdown */}
              <div className="enhanced-notifications-container" ref={notificationsRef}>
                <button
                  className="enhanced-action-btn enhanced-notification-btn"
                  title="Notifications"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="enhanced-notification-badge">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="enhanced-notifications-dropdown">
                    <div className="enhanced-notifications-header">
                      <h3>Notifications</h3>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="enhanced-notifications-close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="enhanced-notifications-list">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification, index) => (
                          <div key={notification.id || index} className="enhanced-notification-item">
                            <div className="enhanced-notification-icon">
                              {notification.type === 'warning' ? (
                                <AlertTriangle className="h-4 w-4" />
                              ) : (
                                <Bell className="h-4 w-4" />
                              )}
                            </div>
                            <div className="enhanced-notification-content">
                              <p>{notification.title || notification.message}</p>
                              <span>
                                {notification.created_at
                                  ? new Date(notification.created_at).toLocaleDateString()
                                  : 'Recently'
                                }
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="enhanced-notification-item">
                          <div className="enhanced-notification-content">
                            <p className="text-slate-500 dark:text-slate-400">No notifications</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User menu dropdown */}
              <div className="enhanced-user-menu" ref={userMenuRef}>
                <button
                  className="enhanced-user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  disabled={isLoadingUser}
                >
                  <div className="enhanced-user-menu-avatar">
                    {isLoadingUser ? (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                    ) : userData?.avatar_url ? (
                      <img
                        src={userData.avatar_url}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="enhanced-user-menu-initials">
                        {userData?.first_name?.[0] || 'U'}{userData?.last_name?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="enhanced-user-menu-info">
                    <span className="enhanced-user-menu-name">
                      {isLoadingUser ? (
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      ) : (
                        `${userData?.first_name || 'User'} ${userData?.last_name || ''}`
                      )}
                    </span>
                    <span className="enhanced-user-menu-role">
                      {isLoadingUser ? (
                        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      ) : (
                        userData?.role || 'client'
                      )}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="enhanced-user-dropdown">
                    <div className="enhanced-user-dropdown-header">
                      <div className="enhanced-user-dropdown-avatar">
                        {userData?.avatar_url ? (
                          <img
                            src={userData.avatar_url}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="enhanced-user-dropdown-initials">
                            {userData?.first_name?.[0] || 'U'}{userData?.last_name?.[0] || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="enhanced-user-dropdown-info">
                        <p className="enhanced-user-dropdown-name">
                          {userData?.first_name || 'User'} {userData?.last_name || ''}
                        </p>
                        <p className="enhanced-user-dropdown-email">
                          {userData?.email || ''}
                        </p>
                      </div>
                    </div>
                    <div className="enhanced-user-dropdown-menu">
                      <Link to="/profile" className="enhanced-user-dropdown-item">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link to="/settings" className="enhanced-user-dropdown-item">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <Link to="/help" className="enhanced-user-dropdown-item">
                        <HelpCircle className="h-4 w-4" />
                        Help & Support
                      </Link>
                      <div className="enhanced-user-dropdown-divider" />
                      <button
                        onClick={handleLogout}
                        className="enhanced-user-dropdown-item enhanced-user-dropdown-logout"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>


        {/* Main content */}
        <main className="enhanced-main-content">
          <div className="enhanced-content-container">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnhancedDashboardLayout;


