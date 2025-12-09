import { Link } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  BarChart3, 
  Settings,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const InsuranceIndex = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="h-4 w-4" />
            New Insurance Management System
          </div>
          <h1 className="text-5xl font-bold text-text-primary mb-6">
            Professional Insurance Dashboard
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            A comprehensive, modern insurance management system with unified theme, 
            industry-specific features, and professional design tailored for insurance workflows.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">KPI Cards</h3>
            <p className="text-text-secondary mb-6">
              Professional metric cards with trends, icons, and industry-specific styling for quotes, policies, revenue, and claims.
            </p>
            <div className="flex items-center text-primary-600 font-medium">
              <CheckCircle className="h-4 w-4 mr-2" />
              Real-time metrics
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="w-12 h-12 bg-success-100 text-success-600 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Analytics Charts</h3>
            <p className="text-text-secondary mb-6">
              Interactive charts with Recharts integration for revenue trends, policy growth, and claims distribution.
            </p>
            <div className="flex items-center text-success-600 font-medium">
              <CheckCircle className="h-4 w-4 mr-2" />
              Interactive visualizations
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="w-12 h-12 bg-warning-100 text-warning-600 rounded-xl flex items-center justify-center mb-6">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Data Tables</h3>
            <p className="text-text-secondary mb-6">
              Advanced tables with filtering, sorting, pagination, and insurance-specific status badges.
            </p>
            <div className="flex items-center text-warning-600 font-medium">
              <CheckCircle className="h-4 w-4 mr-2" />
              Full CRUD operations
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="w-12 h-12 bg-danger-100 text-danger-600 rounded-xl flex items-center justify-center mb-6">
              <Settings className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Forms & Modals</h3>
            <p className="text-text-secondary mb-6">
              Comprehensive forms with validation, file uploads, and professional modals for insurance workflows.
            </p>
            <div className="flex items-center text-danger-600 font-medium">
              <CheckCircle className="h-4 w-4 mr-2" />
              Industry-specific fields
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Unified Theme</h3>
            <p className="text-text-secondary mb-6">
              Consistent design system with insurance industry colors, typography, and professional styling.
            </p>
            <div className="flex items-center text-primary-600 font-medium">
              <CheckCircle className="h-4 w-4 mr-2" />
              Cohesive design
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="w-12 h-12 bg-success-100 text-success-600 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Responsive Design</h3>
            <p className="text-text-secondary mb-6">
              Mobile-first design that works perfectly on all devices with accessibility compliance.
            </p>
            <div className="flex items-center text-success-600 font-medium">
              <CheckCircle className="h-4 w-4 mr-2" />
              WCAG AA compliant
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/insurance/dashboard"
              className="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-card hover:shadow-card-hover"
            >
              <Shield className="h-5 w-5" />
              View Insurance Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <Link
              to="/insurance/demo"
              className="inline-flex items-center gap-3 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-card hover:shadow-card-hover border border-primary-200"
            >
              <FileText className="h-5 w-5" />
              Component Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Color Palette Preview */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-card">
          <h3 className="text-2xl font-semibold text-text-primary mb-6 text-center">Insurance Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-xl mx-auto mb-3"></div>
              <h4 className="font-semibold text-text-primary">Primary Blue</h4>
              <p className="text-sm text-text-secondary">#1E40AF</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-success-500 rounded-xl mx-auto mb-3"></div>
              <h4 className="font-semibold text-text-primary">Success Green</h4>
              <p className="text-sm text-text-secondary">#059669</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-warning-500 rounded-xl mx-auto mb-3"></div>
              <h4 className="font-semibold text-text-primary">Warning Amber</h4>
              <p className="text-sm text-text-secondary">#D97706</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-danger-500 rounded-xl mx-auto mb-3"></div>
              <h4 className="font-semibold text-text-primary">Danger Red</h4>
              <p className="text-sm text-text-secondary">#DC2626</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceIndex;
