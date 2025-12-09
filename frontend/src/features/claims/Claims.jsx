import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimsAPI } from '../../shared/services/api';
import {
  ArrowLeft, AlertTriangle, Clock, FileText, Shield, CheckCircle, XCircle, AlertCircle,
  Save, Bookmark, Lightbulb, ChevronLeft, ChevronRight, HelpCircle, Settings,
  User, Car, Building, Camera
} from 'lucide-react';

const Claims = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Incident Information
    type: '', // Backend expects 'type' not 'claim_type'
    incident_date: '',
    incident_time: '',
    incident_location: '',
    description: '', // Backend expects 'description' not 'incident_description'
    
    // Step 2: Vehicle/Property Details
    policy_id: '', // Backend expects 'policy_id' not 'policy_number'
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    license_plate: '',
    
    // Step 3: Damage Assessment
    damage_description: '',
    amount_estimate: '', // Backend expects 'amount_estimate' not 'estimated_damage'
    third_party_involved: false,
    third_party_details: '',
    
    // Step 4: Contact & Documents
    contact_phone: '',
    preferred_contact_method: 'email',
    emergency_contact: '',
    documents: []
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  // Preferences state for future implementation
  // const [preferences, setPreferences] = useState({
  //   preferredContactMethod: 'email',
  //   urgency: 'normal',
  //   reminderEnabled: true,
  //   newsletterSubscription: false
  // });

  const claimTypes = [
    { value: 'accident', label: 'Accident de circulation', icon: Car, description: 'Collision, choc, ou accident de la route' },
    { value: 'theft', label: 'Vol', icon: Shield, description: 'Vol de véhicule ou d\'objets' },
    { value: 'vandalism', label: 'Vandalisme', icon: AlertTriangle, description: 'Dégâts volontaires causés au véhicule' },
    { value: 'fire', label: 'Incendie', icon: AlertCircle, description: 'Dommages causés par le feu' },
    { value: 'natural_disaster', label: 'Catastrophe naturelle', icon: Building, description: 'Inondation, tempête, séisme' },
    { value: 'other', label: 'Autre', icon: FileText, description: 'Autre type de sinistre' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Prepare data for backend API
      const claimData = {
        type: formData.type,
        policy_id: formData.policy_id,
        incident_date: formData.incident_date,
        description: formData.description,
        amount_estimate: formData.amount_estimate ? parseFloat(formData.amount_estimate) : null,
        incident_location: formData.incident_location
      };

      // Remove empty fields
      Object.keys(claimData).forEach(key => {
        if (claimData[key] === '' || claimData[key] === null || claimData[key] === undefined) {
          delete claimData[key];
        }
      });

      // Submitting claim data:
      
      // Call the real API
      const response = await claimsAPI.create(claimData);
      
      // Claim created successfully:
      
      setSuccess('Votre déclaration de sinistre a été soumise avec succès! Un numéro de référence vous sera envoyé par email.');
      setCurrentStep(5); // Success step
    } catch (error) {
      console.error('Error creating claim:', error);
      setError(error.response?.data?.message || 'Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    const draft = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      formData: { ...formData },
      step: currentStep
    };
    setSavedDrafts(prev => [draft, ...prev.slice(0, 4)]);
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  const getStepProgress = () => {
    return ((currentStep - 1) / 3) * 100;
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <AlertTriangle className="h-5 w-5" />;
      case 2: return <Car className="h-5 w-5" />;
      case 3: return <FileText className="h-5 w-5" />;
      case 4: return <User className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animate-fade-in">
       {/* Enhanced Header with Navigation */}
       <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-sm dark:bg-slate-900/80 dark:border-slate-700/50">
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
                 <h1 className="text-2xl font-bold text-white dark:text-white">Déclaration de Sinistre</h1>
                 <p className="text-sm text-slate-300 dark:text-slate-300">Déclarez votre sinistre en quelques étapes simples</p>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {/* Enhanced Tips Section */}
        {showTips && (
          <div className="mb-8 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-red-600 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">⚠️ Conseils pour une déclaration efficace</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-4 w-4 text-blue-400" />
                    <span>Prenez des photos des dégâts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-400" />
                    <span>Rassemblez tous les documents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span>Déclarez dans les 5 jours</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowTips(false)}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <XCircle className="h-4 w-4" />
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
                  className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getStepProgress()}%` }}
                ></div>
              </div>
            </div>
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform ${
                      currentStep >= step 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-110' 
                        : currentStep === step
                        ? 'bg-slate-700 text-red-400 border-2 border-red-500'
                        : 'bg-slate-600 text-slate-400'
                    }`}>
                      {currentStep > step ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        getStepIcon(step)
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium text-center transition-colors duration-300 ${
                      currentStep >= step ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {step === 1 && 'Incident'}
                      {step === 2 && 'Véhicule'}
                      {step === 3 && 'Dégâts'}
                      {step === 4 && 'Contact'}
                    </span>
                  </div>
                  {step < 4 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                      currentStep > step 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
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
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden section-transition mb-12">
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4 border-b border-slate-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStepIcon(currentStep)}
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {currentStep === 1 && 'Informations sur l\'incident'}
                    {currentStep === 2 && 'Détails du véhicule'}
                    {currentStep === 3 && 'Évaluation des dégâts'}
                    {currentStep === 4 && 'Vos informations de contact'}
                  </h2>
                  <p className="text-sm text-slate-300 mt-1">
                    {currentStep === 1 && 'Décrivez les circonstances de l\'incident'}
                    {currentStep === 2 && 'Renseignez les détails de votre véhicule'}
                    {currentStep === 3 && 'Évaluez l\'étendue des dégâts'}
                    {currentStep === 4 && 'Finalisez votre déclaration'}
                  </p>
                </div>
              </div>
              
              {/* Step Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-all duration-300"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Options
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Incident Information */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  {/* Claim Type Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <label className="text-lg font-semibold text-white">
                        Type de sinistre
                      </label>
                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Sélectionnez le type d'incident</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {claimTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleInputChange('type', type.value)}
                          className={`group relative p-6 border-2 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
                            formData.type === type.value
                              ? 'border-red-500 bg-gradient-to-br from-red-900/30 via-red-800/20 to-pink-900/30 shadow-lg'
                              : 'border-slate-600 hover:border-red-400 hover:bg-slate-700/50'
                          }`}
                        >
                          {/* Selection Indicator */}
                          {formData.type === type.value && (
                            <div className="absolute top-4 right-4">
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                          
                          {/* Type Icon */}
                          <div className={`p-4 rounded-xl w-fit mb-4 transition-all duration-300 ${
                            formData.type === type.value 
                              ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg' 
                              : 'bg-slate-600 group-hover:bg-red-500'
                          }`}>
                            <type.icon className={`h-8 w-8 transition-all duration-300 ${
                              formData.type === type.value 
                                ? 'text-white' 
                                : 'text-slate-300 group-hover:text-white'
                            }`} />
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className={`font-bold text-xl transition-colors ${
                              formData.type === type.value ? 'text-red-300' : 'text-white'
                            }`}>{type.label}</h3>
                            <p className={`text-sm transition-colors ${
                              formData.type === type.value ? 'text-red-200' : 'text-slate-300'
                            }`}>{type.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Incident Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Date de l'incident *
                      </label>
                      <input
                        type="date"
                        value={formData.incident_date}
                        onChange={(e) => handleInputChange('incident_date', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Heure de l'incident *
                      </label>
                      <input
                        type="time"
                        value={formData.incident_time}
                        onChange={(e) => handleInputChange('incident_time', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Lieu de l'incident *
                    </label>
                    <input
                      type="text"
                      value={formData.incident_location}
                      onChange={(e) => handleInputChange('incident_location', e.target.value)}
                      placeholder="Adresse complète du lieu de l'incident"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Description de l'incident *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('incident_description', e.target.value)}
                      placeholder="Décrivez en détail ce qui s'est passé..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Vehicle Details */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-6">Informations du véhicule</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Numéro de police *
                        </label>
                        <input
                          type="text"
                          value={formData.policy_id}
                          onChange={(e) => handleInputChange('policy_number', e.target.value)}
                          placeholder="Ex: POL-2024-001234"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Immatriculation *
                        </label>
                        <input
                          type="text"
                          value={formData.license_plate}
                          onChange={(e) => handleInputChange('license_plate', e.target.value)}
                          placeholder="Ex: 12345-A-67"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Marque *
                        </label>
                        <input
                          type="text"
                          value={formData.vehicle_make}
                          onChange={(e) => handleInputChange('vehicle_make', e.target.value)}
                          placeholder="Ex: Toyota, Renault, BMW"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Modèle *
                        </label>
                        <input
                          type="text"
                          value={formData.vehicle_model}
                          onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                          placeholder="Ex: Corolla, Clio, X3"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Année *
                        </label>
                        <input
                          type="number"
                          value={formData.vehicle_year}
                          onChange={(e) => handleInputChange('vehicle_year', e.target.value)}
                          placeholder="Ex: 2020"
                          min="1990"
                          max="2024"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Damage Assessment */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-6">Évaluation des dégâts</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Description des dégâts *
                      </label>
                      <textarea
                        value={formData.damage_description}
                        onChange={(e) => handleInputChange('damage_description', e.target.value)}
                        placeholder="Décrivez en détail les dégâts subis..."
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Estimation des dégâts (DH)
                      </label>
                      <input
                        type="number"
                        value={formData.amount_estimate}
                        onChange={(e) => handleInputChange('estimated_damage', e.target.value)}
                        placeholder="Montant estimé des réparations"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="third_party"
                        checked={formData.third_party_involved}
                        onChange={(e) => handleInputChange('third_party_involved', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                      />
                      <label htmlFor="third_party" className="text-sm font-medium text-white">
                        Un tiers est impliqué dans cet incident
                      </label>
                    </div>
                    
                    {formData.third_party_involved && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Informations sur le tiers
                        </label>
                        <textarea
                          value={formData.third_party_details}
                          onChange={(e) => handleInputChange('third_party_details', e.target.value)}
                          placeholder="Nom, coordonnées, assurance du tiers..."
                          rows={3}
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Contact Information */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-6">Informations de contact</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          value={formData.contact_phone}
                          onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                          placeholder="Ex: +212 6 12 34 56 78"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Méthode de contact préférée
                        </label>
                        <select
                          value={formData.preferred_contact_method}
                          onChange={(e) => handleInputChange('preferred_contact_method', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="email">Email</option>
                          <option value="phone">Téléphone</option>
                          <option value="sms">SMS</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white mb-2">
                          Contact d'urgence
                        </label>
                        <input
                          type="text"
                          value={formData.emergency_contact}
                          onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                          placeholder="Nom et téléphone d'une personne à contacter en cas d'urgence"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Step */}
              {currentStep === 5 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Déclaration soumise avec succès!</h2>
                  <p className="text-slate-300 text-lg mb-8">
                    Votre déclaration de sinistre a été enregistrée. Vous recevrez un email de confirmation avec votre numéro de référence.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Retour à l'accueil
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1);
                        setFormData({
                          type: '',
                          incident_date: '',
                          incident_time: '',
                          incident_location: '',
                          description: '',
                          policy_id: '',
                          vehicle_make: '',
                          vehicle_model: '',
                          vehicle_year: '',
                          license_plate: '',
                          damage_description: '',
                          amount_estimate: '',
                          third_party_involved: false,
                          third_party_details: '',
                          contact_phone: '',
                          preferred_contact_method: 'email',
                          emergency_contact: '',
                          documents: []
                        });
                        setSuccess('');
                      }}
                      className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Nouvelle déclaration
                    </button>
                  </div>
                </div>
              )}

              {/* Enhanced Navigation Buttons */}
              {currentStep < 5 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-600/50">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      className={`group flex items-center px-6 py-3 border-2 rounded-xl font-semibold transition-all duration-300 transform ${
                        currentStep === 1
                          ? 'text-slate-500 cursor-not-allowed border-slate-600 bg-slate-700'
                          : 'text-slate-300 border-slate-500 hover:border-slate-400 hover:bg-slate-600 hover:scale-105 hover:shadow-md'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Précédent
                    </button>
                    
                    {/* Save Draft Button */}
                    <button
                      type="button"
                      onClick={saveDraft}
                      className="group flex items-center px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-600 rounded-xl transition-all duration-300"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Sauvegarder</span>
                      {isDraftSaved && (
                        <CheckCircle className="h-4 w-4 ml-2 text-green-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Help Button */}
                    <button type="button" className="group flex items-center px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-600 rounded-xl transition-all duration-300">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Aide</span>
                    </button>

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="group flex items-center px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="group flex items-center px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Soumission...
                          </>
                        ) : (
                          <>
                            Soumettre la déclaration
                            <CheckCircle className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>
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

export default Claims;
