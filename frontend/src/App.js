import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import { ThemeProvider } from './shared/context/ThemeContext';
import ProtectedRoute from './shared/routes/ProtectedRoute';
import EnhancedDashboardLayout from './features/dashboard/EnhancedDashboardLayout';

// Layout components
import Header from './app/layout/Header';
import Footer from './app/layout/Footer';
import ScrollToTop from './app/layout/ScrollToTop';

// Public pages
import Home from './app/pages/Home';
import APropos from './app/pages/APropos';
import Contact from './app/pages/Contact';
import EspaceClient from './app/pages/EspaceClient';
import Confirmation from './app/pages/Confirmation';

// Feature-based pages
import AdminDashboard from './features/dashboard/AdminDashboard';
import AdminQuotes from './features/dashboard/AdminQuotes';
import AdminPolicies from './features/dashboard/AdminPolicies';
import AdminPayments from './features/dashboard/AdminPayments';
import AdminClaims from './features/dashboard/AdminClaims';
import AdminUsers from './features/dashboard/AdminUsers';
import AdminSettings from './features/dashboard/AdminSettings';

import ClientDashboard from './features/dashboard/ClientDashboard.jsx';
import ClientPolicies from './features/dashboard/ClientPolicies.jsx';
import ClientPayments from './features/dashboard/ClientPayments.jsx';
import ClientClaims from './features/dashboard/ClientClaims.jsx';
import ClientQuotes from './features/dashboard/ClientQuotes.jsx';

import InsuranceDashboard from './features/insurance/InsuranceDashboard';
import InsuranceDemo from './features/insurance/InsuranceDemo';
import InsuranceIndex from './features/insurance/InsuranceIndex';

import Claims from './features/claims/Claims';
import Devis from './features/quotes/Devis';
import Profile from './app/pages/Profile';
import Settings from './app/pages/Settings';
import Help from './app/pages/Help';

// Styles
import './shared/utils/cssVariables';
import './assets/styles/pages-shared.css';
import './assets/styles/dashboard.css';
import './assets/styles/dashboard-components.css';
import './assets/styles/insurance-dashboard.css';
import './assets/styles/enhanced-dashboard.css';
import './assets/styles/page-transitions.css';

// Lazy loaded pages
const AssuranceAuto = lazy(() => import('./app/pages/AssuranceAuto'));
const AssuranceMoto = lazy(() => import('./app/pages/AssuranceMoto'));

// Helper components
function ConditionalHeader() {
  const location = useLocation();
  const hideHeaderPaths = [
    '/admin/', '/client/', '/insurance/', '/dashboard', 
    '/profile', '/settings', '/help', '/devis', '/claims'
  ];
  
  const shouldHideHeader = hideHeaderPaths.some(path => 
    location.pathname.startsWith(path)
  );
  
  return shouldHideHeader ? null : <Header />;
}

function ConditionalFooter() {
  const location = useLocation();
  const hideFooterPaths = [
    '/admin/', '/client/', '/insurance/', '/dashboard', 
    '/profile', '/settings', '/help'
  ];
  
  const shouldHideFooter = hideFooterPaths.some(path => 
    location.pathname.startsWith(path)
  );
  
  return shouldHideFooter ? null : <Footer />;
}

// Route components
function AdminRoute({ children }) {
  return (
    <ProtectedRoute role="admin">
      <EnhancedDashboardLayout>
        {children}
      </EnhancedDashboardLayout>
    </ProtectedRoute>
  );
}

function ClientRoute({ children }) {
  return (
    <ProtectedRoute role="client">
      <EnhancedDashboardLayout>
        {children}
      </EnhancedDashboardLayout>
    </ProtectedRoute>
  );
}

function ProtectedRouteWrapper({ children }) {
  return (
    <ProtectedRoute>
      <EnhancedDashboardLayout>
        {children}
      </EnhancedDashboardLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router future={{ v7_startTransition: true }}>
          <div className="app-shell">
            <ScrollToTop />
            <ConditionalHeader />
            <main className="app-content">
              <Suspense fallback={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  Chargement...
                </div>
              }>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/assurance-auto" element={<AssuranceAuto />} />
                  <Route path="/assurance-moto" element={<AssuranceMoto />} />
                  <Route path="/a-propos" element={<APropos />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/espace-client" element={<EspaceClient />} />
                  <Route path="/login" element={<EspaceClient />} />
                  <Route path="/confirmation" element={<Confirmation />} />
                  <Route path="/devis" element={<Devis />} />

                  {/* Protected routes */}
                  <Route path="/claims" element={
                    <ProtectedRoute><Claims /></ProtectedRoute>
                  } />

                  {/* Admin routes */}
                  <Route path="/admin/dashboard" element={
                    <AdminRoute><AdminDashboard /></AdminRoute>
                  } />
                  <Route path="/admin/quotes" element={
                    <AdminRoute><AdminQuotes /></AdminRoute>
                  } />
                  <Route path="/admin/policies" element={
                    <AdminRoute><AdminPolicies /></AdminRoute>
                  } />
                  <Route path="/admin/payments" element={
                    <AdminRoute><AdminPayments /></AdminRoute>
                  } />
                  <Route path="/admin/claims" element={
                    <AdminRoute><AdminClaims /></AdminRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminRoute><AdminUsers /></AdminRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <AdminRoute><AdminSettings /></AdminRoute>
                  } />

                  {/* Insurance routes */}
                  <Route path="/insurance" element={
                    <ProtectedRoute role="admin"><InsuranceIndex /></ProtectedRoute>
                  } />
                  <Route path="/insurance/dashboard" element={
                    <AdminRoute><InsuranceDashboard /></AdminRoute>
                  } />
                  <Route path="/insurance/demo" element={
                    <AdminRoute><InsuranceDemo /></AdminRoute>
                  } />

                  {/* Client routes */}
                  <Route path="/client/dashboard" element={
                    <ClientRoute><ClientDashboard /></ClientRoute>
                  } />
                  <Route path="/client/policies" element={
                    <ClientRoute><ClientPolicies /></ClientRoute>
                  } />
                  <Route path="/client/quotes" element={
                    <ClientRoute><ClientQuotes /></ClientRoute>
                  } />
                  <Route path="/client/payments" element={
                    <ClientRoute><ClientPayments /></ClientRoute>
                  } />
                  <Route path="/client/claims" element={
                    <ClientRoute><ClientClaims /></ClientRoute>
                  } />

                  {/* Legacy routes */}
                  <Route path="/dashboard" element={
                    <ClientRoute><ClientDashboard /></ClientRoute>
                  } />

                  {/* User routes */}
                  <Route path="/profile" element={
                    <ProtectedRouteWrapper><Profile /></ProtectedRouteWrapper>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRouteWrapper><Settings /></ProtectedRouteWrapper>
                  } />
                  <Route path="/help" element={
                    <ProtectedRouteWrapper><Help /></ProtectedRouteWrapper>
                  } />
                </Routes>
              </Suspense>
            </main>
            <ConditionalFooter />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;