import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Bike,
  Calculator,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Info,
  Shield,
  User,
  Save,
  Star,
  ChevronRight,
  ChevronLeft,
  X,
  Bookmark,
  Settings,
  HelpCircle,
  Lightbulb,
  Percent,
  TrendingUp,
  Heart,
  Zap,
  Award,
  Sparkles
} from 'lucide-react';
import { quotesAPI } from '../../shared/services/api.js';
import { useAuth } from '../../shared/context/AuthContext.js';

// Fallback data functions
const getFallbackBrands = (type) => {
  if (type === 'car') {
    return ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Nissan', 'Hyundai', 'Kia'];
  } else if (type === 'moto') {
    return ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'Ducati', 'BMW', 'KTM', 'Triumph', 'Harley-Davidson', 'Aprilia'];
  }
  return [];
};

const getFallbackModels = (type, brand) => {
  const carModels = {
    'Toyota': ['Corolla', 'Camry', 'RAV4', 'Prius', 'Highlander'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit'],
    'Ford': ['Focus', 'Fiesta', 'Mustang', 'Explorer', 'Escape'],
    'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'i3'],
    'Mercedes': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE'],
    'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q7'],
    'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Jetta', 'Atlas'],
    'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Leaf'],
    'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona'],
    'Kia': ['Forte', 'Optima', 'Sportage', 'Sorento', 'Soul']
  };

  const motoModels = {
    'Honda': ['CBR600RR', 'CBR1000RR', 'CB650R', 'CRF250L', 'Gold Wing'],
    'Yamaha': ['YZF-R6', 'YZF-R1', 'MT-07', 'WR250R', 'FJR1300'],
    'Kawasaki': ['Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Versys 650', 'Z900'],
    'Suzuki': ['GSX-R600', 'GSX-R1000', 'SV650', 'V-Strom 650', 'Hayabusa'],
    'Ducati': ['Panigale V2', 'Panigale V4', 'Monster 821', 'Multistrada 950', 'Diavel'],
    'BMW': ['S1000RR', 'R1250GS', 'F850GS', 'K1600GT', 'C650GT'],
    'KTM': ['Duke 390', 'Duke 790', 'RC 390', 'Adventure 790', 'Super Duke R'],
    'Triumph': ['Street Triple', 'Speed Triple', 'Tiger 800', 'Bonneville', 'Rocket 3'],
    'Harley-Davidson': ['Sportster', 'Softail', 'Touring', 'Street', 'LiveWire'],
    'Aprilia': ['RSV4', 'Tuono V4', 'Shiver 900', 'Dorsoduro 900', 'Caponord']
  };

  if (type === 'car') {
    return carModels[brand] || ['Model 1', 'Model 2', 'Model 3'];
  } else if (type === 'moto') {
    return motoModels[brand] || ['Model 1', 'Model 2', 'Model 3'];
  }
  return [];
};

const getFallbackCities = () => {
  return {
    'Casablanca': { name: 'Casablanca', risk_factor: 1.2 },
    'Rabat': { name: 'Rabat', risk_factor: 1.0 },
    'Marrakech': { name: 'Marrakech', risk_factor: 1.1 },
    'Fès': { name: 'Fès', risk_factor: 1.0 },
    'Agadir': { name: 'Agadir', risk_factor: 0.9 },
    'Tanger': { name: 'Tanger', risk_factor: 1.1 },
    'Meknès': { name: 'Meknès', risk_factor: 1.0 },
    'Oujda': { name: 'Oujda', risk_factor: 0.9 },
    'Kenitra': { name: 'Kenitra', risk_factor: 1.0 },
    'Tétouan': { name: 'Tétouan', risk_factor: 1.0 }
  };
};

const generateFallbackEstimate = (formData) => {
  // Generate a basic estimate based on form data
  const basePremium = formData.type === 'car' ? 5000 : 2000;
  const coverageMultiplier = formData.coverage_type === 'premium' ? 1.5 : formData.coverage_type === 'standard' ? 1.2 : 1.0;
  const ageFactor = formData.driverAge < 25 ? 1.5 : formData.driverAge > 65 ? 1.3 : 1.0;
  const experienceFactor = formData.drivingExperience < 2 ? 1.3 : formData.drivingExperience > 10 ? 0.9 : 1.0;
  const vehicleAgeFactor = formData.vehicleAge > 10 ? 1.2 : formData.vehicleAge < 3 ? 0.9 : 1.0;

  const annualPremium = Math.round(basePremium * coverageMultiplier * ageFactor * experienceFactor * vehicleAgeFactor);
  const monthlyPremium = Math.round(annualPremium / 12);
  const savings = Math.round(annualPremium * 0.1);

  return {
    premium: {
      annualPremium,
      monthlyPremium,
      savings: {
        annual: savings,
        monthly: Math.round(savings / 12)
      },
      breakdown: {
        ageFactor: ageFactor.toFixed(2),
        vehicleAgeFactor: vehicleAgeFactor.toFixed(2),
        valueFactor: '1.00',
        cityFactor: '1.00',
        experienceFactor: experienceFactor.toFixed(2),
        brandFactor: '1.00'
      }
    },
    coverageDetails: {
      coverages: formData.coverage_type === 'premium'
        ? ['RC Obligatoire', 'Vol', 'Incendie', 'Bris de glace', 'Tous risques', 'Assistance 24/7']
        : formData.coverage_type === 'standard'
          ? ['RC Obligatoire', 'Vol', 'Incendie', 'Bris de glace']
          : ['RC Obligatoire', 'Protection juridique']
    },
    estimatedValue: formData.vehicleValue || (formData.type === 'car' ? 150000 : 50000)
  };
};

const Devis = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [cities, setCities] = useState({});

  // Enhanced UI states
  const [showComparison, setShowComparison] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [showTips, setShowTips] = useState(true);
  // Enhanced UI states for future implementation
  // const [favorites, setFavorites] = useState([]);
  // const [recentSearches, setRecentSearches] = useState([]);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  // const [selectedAddOns, setSelectedAddOns] = useState([]);
  // const [preferences, setPreferences] = useState({
  //   preferredContactMethod: 'email',
  //   urgency: 'normal',
  //   reminderEnabled: true,
  //   newsletterSubscription: false
  // });

  const [formData, setFormData] = useState({
    // Vehicle type
    type: 'car',

    // Coverage
    coverage_type: 'basique',

    // Driver info
    driverAge: user?.age || 30,
    drivingExperience: 5,

    // Vehicle info
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    vehicleValue: '',
    vehicleAge: 5,
    vehicleLicensePlate: '',
    vehicleFuelType: 'essence',

    // Location
    city: 'Casablanca',

    // Customer info
    customerName: user ? (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.name || '') : '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    customerAddress: '',
    customerCity: 'Casablanca',
    customerPostalCode: '',
  });

  // All useEffect hooks must be called before any conditional returns
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login?redirect=/devis', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated && !loading) {
      loadInitialData();
    } else if (isAuthenticated && !loading && brands.length === 0) {
      // Set fallback data immediately if no data is loaded
      setBrands(getFallbackBrands(formData.type));
      setCities(getFallbackCities());
    }
  }, [isAuthenticated, loading]);

  // Load brands when type changes
  useEffect(() => {
    if (isAuthenticated && !loading && formData.type) {
      loadBrands(formData.type);
    }
  }, [isAuthenticated, loading, formData.type]);

  // Load models when brand changes
  useEffect(() => {
    if (isAuthenticated && !loading && formData.type && formData.vehicleBrand) {
      loadModels(formData.type, formData.vehicleBrand);
    }
  }, [isAuthenticated, loading, formData.type, formData.vehicleBrand]);

  // Auto-calculate estimate when relevant fields change
  useEffect(() => {
    if (isAuthenticated && !loading && formData.type && formData.coverage_type && formData.vehicleBrand && formData.vehicleModel) {
      calculateEstimate();
    }
  }, [isAuthenticated, loading, formData.type, formData.coverage_type, formData.vehicleBrand, formData.vehicleModel, formData.driverAge, formData.vehicleAge, formData.city, formData.drivingExperience]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    console.log('Devis: User not authenticated, redirecting to login');
    return null;
  }

  console.log('Devis: Rendering component', {
    isAuthenticated,
    loading,
    brandsCount: brands.length,
    citiesCount: Object.keys(cities).length,
    currentStep
  });

  const loadInitialData = async () => {
    try {
      const [brandsRes, citiesRes] = await Promise.all([
        quotesAPI.getBrands(formData.type).catch(() => ({ data: { data: getFallbackBrands(formData.type) } })),
        quotesAPI.getCities().catch(() => ({ data: { data: getFallbackCities() } }))
      ]);

      setBrands(brandsRes.data.data || []);
      setCities(citiesRes.data.data || {});
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Set fallback data
      setBrands(getFallbackBrands(formData.type));
      setCities(getFallbackCities());
    }
  };

  const loadBrands = async (type) => {
    try {
      const response = await quotesAPI.getBrands(type);
      setBrands(response.data.data || []);
      setModels([]);
      setFormData(prev => ({ ...prev, vehicleBrand: '', vehicleModel: '' }));
    } catch (error) {
      console.error('Error loading brands:', error);
      // Set fallback brands
      setBrands(getFallbackBrands(type));
      setModels([]);
      setFormData(prev => ({ ...prev, vehicleBrand: '', vehicleModel: '' }));
    }
  };

  const loadModels = async (type, brand) => {
    try {
      const response = await quotesAPI.getModels(type, brand);
      setModels(response.data.data || []);
      setFormData(prev => ({ ...prev, vehicleModel: '' }));
    } catch (error) {
      console.error('Error loading models:', error);
      // Set fallback models
      setModels(getFallbackModels(type, brand));
      setFormData(prev => ({ ...prev, vehicleModel: '' }));
    }
  };

  const calculateEstimate = async () => {
    if (!formData.type || !formData.coverage_type || !formData.vehicleBrand || !formData.vehicleModel) {
      return;
    }

    setEstimateLoading(true);
    try {
      const response = await quotesAPI.getEstimate({
        type: formData.type,
        coverage: formData.coverage_type,
        driverAge: formData.driverAge,
        vehicleAge: formData.vehicleAge,
        vehicleValue: formData.vehicleValue,
        city: formData.city,
        drivingExperience: formData.drivingExperience,
        vehicleBrand: formData.vehicleBrand,
        vehicleModel: formData.vehicleModel,
      });

      setEstimate(response.data.data);

      // Auto-fill vehicle value if not provided
      if (!formData.vehicleValue && response.data.data.estimatedValue) {
        setFormData(prev => ({ ...prev, vehicleValue: response.data.data.estimatedValue }));
      }
    } catch (error) {
      console.error('Error calculating estimate:', error);
      // Generate a fallback estimate
      const fallbackEstimate = generateFallbackEstimate(formData);
      setEstimate(fallbackEstimate);
    } finally {
      setEstimateLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleNext = () => {
    if (currentStep === 1 && (!formData.type || !formData.coverage_type)) {
      setError('Veuillez sélectionner le type de véhicule et la couverture');
      return;
    }
    if (currentStep === 2 && (!formData.vehicleBrand || !formData.vehicleModel)) {
      setError('Veuillez sélectionner la marque et le modèle du véhicule');
      return;
    }
    if (currentStep === 3 && !estimate) {
      setError('Veuillez attendre le calcul de l\'estimation');
      return;
    }
    // For unauthenticated users, validate customer information on step 4
    if (currentStep === 4 && !isAuthenticated && (!formData.customerName || !formData.customerEmail)) {
      setError('Veuillez remplir votre nom et email pour continuer');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    setError('');

    try {
      // Use public endpoint for unauthenticated users, authenticated endpoint for logged-in users
      const apiCall = isAuthenticated ? quotesAPI.create : quotesAPI.createPublic;
      await apiCall(formData);
      setSuccess('Devis créé avec succès !');

      // Redirect based on authentication status
      setTimeout(() => {
        if (isAuthenticated) {
          navigate('/client/dashboard');
        } else {
          navigate('/confirmation');
        }
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création du devis');
    } finally {
      setFormLoading(false);
    }
  };

  // Enhanced helper functions
  const saveDraft = () => {
    const draft = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      formData: { ...formData },
      estimate: estimate,
      step: currentStep
    };
    setSavedDrafts(prev => [draft, ...prev.slice(0, 4)]); // Keep only 5 drafts
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  // Future implementation functions
  // const loadDraft = (draft) => {
  //   setFormData(draft.formData);
  //   setEstimate(draft.estimate);
  //   setCurrentStep(draft.step);
  // };

  // const toggleFavorite = (item) => {
  //   setFavorites(prev => 
  //     prev.includes(item) 
  //       ? prev.filter(fav => fav !== item)
  //       : [...prev, item]
  //   );
  // };

  // const addToRecentSearches = (search) => {
  //   setRecentSearches(prev => 
  //     [search, ...prev.filter(item => item !== search)].slice(0, 5)
  //   );
  // };

  // const toggleAddOn = (addOn) => {
  //   setSelectedAddOns(prev => 
  //     prev.includes(addOn) 
  //       ? prev.filter(item => item !== addOn)
  //       : [...prev, addOn]
  //   );
  // };

  const getStepProgress = () => {
    return ((currentStep - 1) / 3) * 100;
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <Shield className="h-5 w-5" />;
      case 2: return <Car className="h-5 w-5" />;
      case 3: return <Calculator className="h-5 w-5" />;
      case 4: return <User className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  const coverageTypes = {
    car: [
      { value: 'basique', label: 'Basique', description: 'RC Obligatoire + Protection juridique' },
      { value: 'standard', label: 'Standard', description: 'RC + Vol + Incendie + Bris de glace' },
      { value: 'premium', label: 'Premium', description: 'Tous risques + Assistance + Véhicule de remplacement' }
    ],
    moto: [
      { value: 'essentiel', label: 'Essentiel', description: 'RC Obligatoire + Protection juridique' },
      { value: 'confort', label: 'Confort', description: 'RC + Vol + Incendie + Équipements' },
      { value: 'ultimate', label: 'Ultimate', description: 'Tous risques + Assistance + Moto de prêt' }
    ]
  };

  const fuelTypes = [
    { value: 'essence', label: 'Essence' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybride', label: 'Hybride' },
    { value: 'electrique', label: 'Électrique' }
  ];

  const inputClass = "w-full px-4 py-3 bg-slate-800/80 border border-slate-600/60 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-500 hover:border-slate-500";
  const labelClass = "block text-sm font-semibold text-slate-300 mb-2";
  const sectionCardClass = "bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6";

  const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen bg-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 pointer-events-none" />
      {/* Enhanced Header with Navigation */}
      <div className="relative z-50 sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Retour</span>
              </button>

              <div className="h-6 w-px bg-slate-600"></div>

              {/* Page Info */}
              <div>
                <h1 className="text-2xl font-bold text-white dark:text-white">Créer un Devis d'Assurance</h1>
                <p className="text-sm text-slate-300 dark:text-slate-300">Obtenez une estimation personnalisée en quelques étapes</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={saveDraft}
                className="group flex items-center px-4 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Sauvegarder</span>
                {isDraftSaved && (
                  <CheckCircle className="h-4 w-4 ml-2 text-green-400" />
                )}
              </button>

              <button
                onClick={() => setShowTips(!showTips)}
                className="group flex items-center px-4 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all duration-300"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Conseils</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {/* Enhanced Tips Section */}
        {showTips && (
          <div className="mb-8 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">💡 Conseils pour obtenir le meilleur prix</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>Comparez plusieurs formules</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span>Vérifiez votre bonus-malus</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-purple-400" />
                    <span>Profitez des remises fidélité</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowTips(false)}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Progress Steps */}
        <div className="mb-8">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700/50 p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Progression</span>
                <span className="text-sm font-medium text-blue-400">{Math.round(getStepProgress())}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getStepProgress()}%` }}
                ></div>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform ${currentStep >= step
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110'
                        : currentStep === step
                          ? 'bg-slate-700 text-blue-400 border-2 border-blue-500'
                          : 'bg-slate-600 text-slate-400'
                      }`}>
                      {currentStep > step ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        getStepIcon(step)
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium text-center transition-colors duration-300 ${currentStep >= step ? 'text-blue-400' : 'text-slate-400'
                      }`}>
                      {step === 1 && 'Type & Couverture'}
                      {step === 2 && 'Véhicule'}
                      {step === 3 && 'Estimation'}
                      {step === 4 && 'Informations'}
                    </span>
                  </div>
                  {step < 4 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${currentStep > step
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                        : 'bg-slate-600'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
            <span className="text-green-300">{success}</span>
          </div>
        )}

        {/* Enhanced Form Steps */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-800 px-6 py-5 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  {getStepIcon(currentStep)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {currentStep === 1 && 'Type de véhicule et couverture'}
                    {currentStep === 2 && 'Informations du véhicule'}
                    {currentStep === 3 && 'Estimation de votre prime'}
                    {currentStep === 4 && 'Vos informations personnelles'}
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {currentStep === 1 && 'Sélectionnez le type de véhicule et la formule d\'assurance'}
                    {currentStep === 2 && 'Renseignez les détails de votre véhicule'}
                    {currentStep === 3 && 'Consultez votre estimation personnalisée'}
                    {currentStep === 4 && 'Finalisez votre demande de devis'}
                  </p>
                </div>
              </div>

              {/* Step Actions */}
              <div className="flex items-center space-x-2">
                {currentStep === 3 && estimate && (
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center px-3 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded-lg transition-all duration-300"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Comparer
                  </button>
                )}

                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-300"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Options
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {/* Enhanced Step 1: Vehicle Type & Coverage */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    {/* Vehicle Type Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-lg font-semibold text-white">
                          Type de véhicule
                        </label>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Info className="h-4 w-4" />
                          <span>Choisissez le type de véhicule à assurer</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                          type="button"
                          onClick={() => handleInputChange('type', 'car')}
                          className={`group relative p-8 border-2 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${formData.type === 'car'
                              ? 'border-blue-500 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-indigo-900/30 shadow-lg'
                              : 'border-slate-600 hover:border-blue-400 hover:bg-slate-700/50'
                            }`}
                        >
                          {/* Selection Indicator */}
                          {formData.type === 'car' && (
                            <div className="absolute top-4 right-4">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}

                          <div className={`p-4 rounded-xl w-fit mb-4 transition-all duration-300 ${formData.type === 'car'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg'
                              : 'bg-slate-600 group-hover:bg-blue-500'
                            }`}>
                            <Car className={`h-10 w-10 transition-all duration-300 ${formData.type === 'car' ? 'text-white' : 'text-slate-300 group-hover:text-white'
                              }`} />
                          </div>

                          <div className="space-y-2">
                            <h3 className={`font-bold text-xl transition-colors ${formData.type === 'car' ? 'text-blue-300' : 'text-white'
                              }`}>Voiture</h3>
                            <p className={`text-sm transition-colors ${formData.type === 'car' ? 'text-blue-200' : 'text-slate-300'
                              }`}>Assurance automobile complète</p>
                            <div className="flex items-center space-x-4 text-xs text-slate-400">
                              <span className="flex items-center">
                                <Shield className="h-3 w-3 mr-1" />
                                Protection complète
                              </span>
                              <span className="flex items-center">
                                <Heart className="h-3 w-3 mr-1" />
                                Assistance 24/7
                              </span>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInputChange('type', 'moto')}
                          className={`group relative p-8 border-2 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${formData.type === 'moto'
                              ? 'border-blue-500 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-indigo-900/30 shadow-lg'
                              : 'border-slate-600 hover:border-blue-400 hover:bg-slate-700/50'
                            }`}
                        >
                          {/* Selection Indicator */}
                          {formData.type === 'moto' && (
                            <div className="absolute top-4 right-4">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}

                          <div className={`p-4 rounded-xl w-fit mb-4 transition-all duration-300 ${formData.type === 'moto'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg'
                              : 'bg-slate-600 group-hover:bg-blue-500'
                            }`}>
                            <Bike className={`h-10 w-10 transition-all duration-300 ${formData.type === 'moto' ? 'text-white' : 'text-slate-300 group-hover:text-white'
                              }`} />
                          </div>

                          <div className="space-y-2">
                            <h3 className={`font-bold text-xl transition-colors ${formData.type === 'moto' ? 'text-blue-300' : 'text-white'
                              }`}>Moto</h3>
                            <p className={`text-sm transition-colors ${formData.type === 'moto' ? 'text-blue-200' : 'text-slate-300'
                              }`}>Assurance moto spécialisée</p>
                            <div className="flex items-center space-x-4 text-xs text-slate-400">
                              <span className="flex items-center">
                                <Zap className="h-3 w-3 mr-1" />
                                Couverture étendue
                              </span>
                              <span className="flex items-center">
                                <Award className="h-3 w-3 mr-1" />
                                Équipements protégés
                              </span>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Coverage Type Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <label className="text-lg font-semibold text-white">
                          Formule d'assurance
                        </label>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Star className="h-4 w-4" />
                          <span>Choisissez votre niveau de protection</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {coverageTypes[formData.type]?.map((coverage, index) => (
                          <button
                            key={coverage.value}
                            type="button"
                            onClick={() => handleInputChange('coverage_type', coverage.value)}
                            className={`group relative p-6 border-2 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${formData.coverage_type === coverage.value
                                ? 'border-blue-500 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-indigo-900/30 shadow-lg'
                                : 'border-slate-600 hover:border-blue-400 hover:bg-slate-700/50'
                              }`}
                          >
                            {/* Selection Indicator */}
                            {formData.coverage_type === coverage.value && (
                              <div className="absolute top-4 right-4">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}

                            {/* Popular Badge */}
                            {index === 1 && (
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                  <Sparkles className="h-3 w-3 inline mr-1" />
                                  Populaire
                                </div>
                              </div>
                            )}

                            {/* Coverage Icon */}
                            <div className={`p-4 rounded-xl w-fit mb-4 transition-all duration-300 ${formData.coverage_type === coverage.value
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg'
                                : 'bg-slate-600 group-hover:bg-blue-500'
                              }`}>
                              <Shield className={`h-8 w-8 transition-all duration-300 ${formData.coverage_type === coverage.value
                                  ? 'text-white'
                                  : 'text-slate-300 group-hover:text-white'
                                }`} />
                            </div>

                            <div className="space-y-3">
                              <div>
                                <h3 className={`font-bold text-xl transition-colors ${formData.coverage_type === coverage.value ? 'text-blue-300' : 'text-white'
                                  }`}>{coverage.label}</h3>
                                <p className={`text-sm transition-colors ${formData.coverage_type === coverage.value ? 'text-blue-200' : 'text-slate-300'
                                  }`}>{coverage.description}</p>
                              </div>

                              {/* Coverage Features */}
                              <div className="space-y-2">
                                {coverage.value === 'basique' && (
                                  <div className="space-y-1 text-xs text-slate-400">
                                    <div className="flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                      <span>RC Obligatoire</span>
                                    </div>
                                    <div className="flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                      <span>Protection juridique</span>
                                    </div>
                                  </div>
                                )}
                                {coverage.value === 'standard' && (
                                  <div className="space-y-1 text-xs text-slate-400">
                                    <div className="flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                      <span>Vol & Incendie</span>
                                    </div>
                                    <div className="flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                      <span>Bris de glace</span>
                                    </div>
                                  </div>
                                )}
                                {coverage.value === 'premium' && (
                                  <div className="space-y-1 text-xs text-slate-400">
                                    <div className="flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                      <span>Tous risques</span>
                                    </div>
                                    <div className="flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                      <span>Assistance 24/7</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Vehicle Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* Vehicle Details Card */}
                    <div className={sectionCardClass}>
                      <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                        <Car className="h-5 w-5 text-blue-400" />
                        Détails du véhicule
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>Marque *</label>
                          <select
                            value={formData.vehicleBrand}
                            onChange={(e) => handleInputChange('vehicleBrand', e.target.value)}
                            className={inputClass}
                          >
                            <option value="">Sélectionner une marque</option>
                            {brands.map((brand) => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Modèle *</label>
                          <select
                            value={formData.vehicleModel}
                            onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                            className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                            disabled={!formData.vehicleBrand}
                          >
                            <option value="">Sélectionner un modèle</option>
                            {models.map((model) => (
                              <option key={model} value={model}>{model}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Année</label>
                          <input
                            type="number"
                            value={formData.vehicleYear}
                            onChange={(e) => handleInputChange('vehicleYear', parseInt(e.target.value))}
                            min="1990"
                            max={new Date().getFullYear()}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Valeur du véhicule (MAD)</label>
                          <input
                            type="number"
                            value={formData.vehicleValue}
                            onChange={(e) => handleInputChange('vehicleValue', parseInt(e.target.value))}
                            placeholder="Ex: 150 000"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Plaque d'immatriculation</label>
                          <input
                            type="text"
                            value={formData.vehicleLicensePlate}
                            onChange={(e) => handleInputChange('vehicleLicensePlate', e.target.value.toUpperCase())}
                            placeholder="Ex: A1234BC"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Type de carburant</label>
                          <select
                            value={formData.vehicleFuelType}
                            onChange={(e) => handleInputChange('vehicleFuelType', e.target.value)}
                            className={inputClass}
                          >
                            {fuelTypes.map((fuel) => (
                              <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Driver Info Card */}
                    <div className={sectionCardClass}>
                      <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                        <User className="h-5 w-5 text-violet-400" />
                        Informations du conducteur
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>Âge du conducteur</label>
                          <input
                            type="number"
                            value={formData.driverAge}
                            onChange={(e) => handleInputChange('driverAge', parseInt(e.target.value))}
                            min="18" max="80"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Années d'expérience de conduite</label>
                          <input
                            type="number"
                            value={formData.drivingExperience}
                            onChange={(e) => handleInputChange('drivingExperience', parseInt(e.target.value))}
                            min="0" max="50"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location Card */}
                    <div className={sectionCardClass}>
                      <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                        <Info className="h-5 w-5 text-emerald-400" />
                        Localisation
                      </h3>
                      <div className="max-w-sm">
                        <label className={labelClass}>Ville</label>
                        <select
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={inputClass}
                        >
                          {Object.keys(cities).map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Estimate */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 text-white">Estimation de votre prime</h2>

                    {estimateLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        <span className="ml-3 text-white">Calcul en cours...</span>
                      </div>
                    ) : estimate ? (
                      <div className="space-y-6">
                        {/* Premium Summary - Enhanced Design */}
                        <div className="bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-indigo-900/90 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 shadow-2xl">
                          <div className="flex items-center mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl mr-4">
                              <Calculator className="h-8 w-8 text-blue-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Résumé de votre prime</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                              <div className="text-3xl font-bold text-blue-200 mb-2">
                                {estimate.premium.annualPremium.toLocaleString()} MAD
                              </div>
                              <div className="text-sm text-blue-300 font-medium">Prime annuelle</div>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                              <div className="text-3xl font-bold text-green-300 mb-2">
                                {estimate.premium.monthlyPremium.toLocaleString()} MAD
                              </div>
                              <div className="text-sm text-green-400 font-medium">Prime mensuelle</div>
                            </div>
                            <div className="text-center bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
                              <div className="text-3xl font-bold text-green-200 mb-2">
                                {estimate.premium.savings.annual.toLocaleString()} MAD
                              </div>
                              <div className="text-sm text-green-300 font-medium">Économie annuelle</div>
                            </div>
                          </div>
                        </div>

                        {/* Coverage Details - Enhanced Design */}
                        <div className="bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-600/90 backdrop-blur-sm border border-slate-500/30 rounded-2xl p-8 shadow-xl">
                          <div className="flex items-center mb-6">
                            <div className="p-3 bg-green-500/20 rounded-xl mr-4">
                              <Shield className="h-8 w-8 text-green-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Détails de la couverture</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {estimate.coverageDetails.coverages.map((coverage, index) => (
                              <div key={index} className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                                <span className="text-white font-medium">{coverage}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Risk Factors - Enhanced Design */}
                        <div className="bg-gradient-to-br from-amber-900/90 via-orange-800/80 to-yellow-700/90 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-8 shadow-xl">
                          <div className="flex items-center mb-6">
                            <div className="p-3 bg-amber-500/20 rounded-xl mr-4">
                              <TrendingUp className="h-8 w-8 text-amber-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Facteurs de risque</h3>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                              <div className="flex justify-between items-center">
                                <span className="text-amber-200 font-medium">Âge:</span>
                                <span className="text-white font-bold text-lg">x{estimate.premium.breakdown.ageFactor}</span>
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                              <div className="flex justify-between items-center">
                                <span className="text-amber-200 font-medium">Véhicule:</span>
                                <span className="text-white font-bold text-lg">x{estimate.premium.breakdown.vehicleAgeFactor}</span>
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                              <div className="flex justify-between items-center">
                                <span className="text-amber-200 font-medium">Valeur:</span>
                                <span className="text-white font-bold text-lg">x{estimate.premium.breakdown.valueFactor}</span>
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                              <div className="flex justify-between items-center">
                                <span className="text-amber-200 font-medium">Ville:</span>
                                <span className="text-white font-bold text-lg">x{estimate.premium.breakdown.cityFactor}</span>
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                              <div className="flex justify-between items-center">
                                <span className="text-amber-200 font-medium">Expérience:</span>
                                <span className="text-white font-bold text-lg">x{estimate.premium.breakdown.experienceFactor}</span>
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                              <div className="flex justify-between items-center">
                                <span className="text-amber-200 font-medium">Marque:</span>
                                <span className="text-white font-bold text-lg">x{estimate.premium.breakdown.brandFactor}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Important Note - Enhanced Design */}
                        <div className="bg-gradient-to-br from-blue-900/90 via-indigo-800/80 to-purple-700/90 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6 shadow-xl">
                          <div className="flex items-start">
                            <div className="p-2 bg-blue-500/20 rounded-lg mr-4 mt-1">
                              <Info className="h-6 w-6 text-blue-300" />
                            </div>
                            <div className="text-white">
                              <p className="font-bold text-lg mb-2 text-blue-200">Note importante</p>
                              <p className="text-blue-100 leading-relaxed">Cette estimation est basée sur les informations fournies. Le prix final peut varier selon l'évaluation complète de votre dossier.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-white">Veuillez remplir les informations du véhicule pour obtenir une estimation</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Customer Information */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {/* Contact Info Card */}
                    <div className={sectionCardClass}>
                      <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-400" />
                        Informations de contact
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>Nom complet *</label>
                          <input
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                            className={inputClass}
                            placeholder="Votre nom complet"
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Email *</label>
                          <input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                            className={inputClass}
                            placeholder="votre@email.com"
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Téléphone *</label>
                          <input
                            type="tel"
                            value={formData.customerPhone}
                            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                            className={inputClass}
                            placeholder="+212 6XX XXX XXX"
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Code postal</label>
                          <input
                            type="text"
                            value={formData.customerPostalCode}
                            onChange={(e) => handleInputChange('customerPostalCode', e.target.value)}
                            className={inputClass}
                            placeholder="Ex: 20000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Card */}
                    <div className={sectionCardClass}>
                      <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                        <Info className="h-5 w-5 text-emerald-400" />
                        Adresse
                      </h3>
                      <div className="space-y-5">
                        <div>
                          <label className={labelClass}>Adresse complète</label>
                          <textarea
                            value={formData.customerAddress}
                            onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                            rows={3}
                            className={`${inputClass} resize-none`}
                            placeholder="Numéro, rue, quartier..."
                          />
                        </div>
                        <div className="max-w-sm">
                          <label className={labelClass}>Ville</label>
                          <select
                            value={formData.customerCity}
                            onChange={(e) => handleInputChange('customerCity', e.target.value)}
                            className={inputClass}
                          >
                            {Object.keys(cities).map((city) => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Summary Card */}
                    {estimate && (
                      <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-6">
                        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-400" />
                          Récapitulatif de votre devis
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-xs text-slate-400 mb-1">Type</div>
                            <div className="text-sm font-bold text-white capitalize">{formData.type === 'car' ? '🚗 Voiture' : '🏍️ Moto'}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 mb-1">Formule</div>
                            <div className="text-sm font-bold text-white capitalize">{formData.coverage_type}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 mb-1">Prime annuelle</div>
                            <div className="text-sm font-bold text-blue-300">{estimate.premium.annualPremium.toLocaleString()} MAD</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 mb-1">Prime mensuelle</div>
                            <div className="text-sm font-bold text-emerald-300">{estimate.premium.monthlyPremium.toLocaleString()} MAD</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Enhanced Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`group flex items-center px-6 py-3 border-2 rounded-xl font-semibold transition-all duration-300 transform ${currentStep === 1
                      ? 'text-slate-500 cursor-not-allowed border-slate-600 bg-slate-700'
                      : 'text-slate-300 border-slate-500 hover:border-slate-400 hover:bg-slate-600 hover:scale-105 hover:shadow-md'
                    }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Précédent
                </button>

                {/* Save Draft Button */}
                <button
                  onClick={saveDraft}
                  className="group flex items-center px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-600 rounded-xl transition-all duration-300"
                >
                  <Save className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Sauvegarder</span>
                  {isDraftSaved && (
                    <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* Help Button */}
                <button className="group flex items-center px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-600 rounded-xl transition-all duration-300">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Aide</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="group flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={formLoading}
                    className="group flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-3" />
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <FileText className="h-5 w-5 mr-3" />
                        Créer le devis
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More space and enhanced fade effect */}
      <div className="h-24"></div>

      {/* Enhanced multi-layer fade effect at bottom - connected to footer */}
      <div className="relative -mb-8 mt-8">
        {/* Main fade layer */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-900 via-slate-900/90 via-slate-900/75 via-slate-900/60 via-slate-900/45 via-slate-900/30 via-slate-900/15 to-transparent pointer-events-none z-10"></div>
        {/* Secondary fade layer for depth */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/95 via-slate-900/70 via-slate-900/50 via-slate-900/30 via-slate-900/15 to-transparent pointer-events-none z-20"></div>
        {/* Top subtle layer */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/60 via-slate-900/30 via-slate-900/10 to-transparent pointer-events-none z-30"></div>
      </div>
    </div>
  );
};

export default Devis;
