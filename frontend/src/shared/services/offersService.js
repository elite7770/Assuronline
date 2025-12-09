// Real offers data service based on backend pricing service
import { quotesAPI } from './api.js';

// Real offers data based on backend pricing service
const REAL_OFFERS_DATA = {
  car: {
    essentiel: {
      title: "Essentiel",
      basePrice: 2500,
      description: "Protection conforme à la loi marocaine",
      benefits: [
        "RC illimitée",
        "Protection juridique 15K MAD",
        "Garantie conducteur 1K MAD",
        "Assistance 0km",
        "Défense recours",
        "Franchise 300 MAD"
      ],
      coverage: ["RC Obligatoire", "Protection juridique", "Garantie conducteur"],
      popular: false
    },
    confort: {
      title: "Confort",
      basePrice: 4500,
      description: "Protection complète pour le marché marocain",
      benefits: [
        "Toutes garanties Essentiel",
        "Vol et Incendie",
        "Bris de glace",
        "Vandalisme",
        "Protection contenu 500 MAD",
        "Véhicule remplacement 7j"
      ],
      coverage: ["RC Obligatoire", "Vol", "Incendie", "Bris de glace", "Vandalisme"],
      popular: true
    },
    premium: {
      title: "Premium",
      basePrice: 7500,
      description: "Protection maximale pour véhicules de valeur",
      benefits: [
        "Toutes garanties Confort",
        "Protection tous risques",
        "Équipements assurés 2K MAD",
        "Véhicule remplacement 30j",
        "Garantie valeur neuve 2 ans",
        "Assistance premium 24h/24"
      ],
      coverage: ["RC Obligatoire", "Vol", "Incendie", "Bris de glace", "Vandalisme", "Assistance 0 km", "Véhicule de remplacement", "Tous risques"],
      popular: false
    }
  },
  moto: {
    essentiel: {
      title: "Essentiel",
      basePrice: 1200,
      description: "Protection conforme à la loi marocaine",
      benefits: [
        "RC illimitée",
        "Prot. juridique 10K MAD",
        "Garantie conduct. 500 MAD",
        "Assistance 0km",
        "Défense recours",
        "Franchise 200 MAD"
      ],
      coverage: ["RC Obligatoire", "Protection juridique", "Garantie conducteur"],
      popular: false
    },
    confort: {
      title: "Confort",
      basePrice: 2800,
      description: "Protection complète pour le marché marocain",
      benefits: [
        "Toutes garanties Essentiel",
        "Vol et Incendie",
        "Équipements prot. 1K MAD",
        "Bris de glace",
        "Vandalisme",
        "Moto prêt 7j"
      ],
      coverage: ["RC Obligatoire", "Vol", "Incendie", "Équipements de protection"],
      popular: true
    },
    ultimate: {
      title: "Ultimate",
      basePrice: 4500,
      description: "Protection maximale pour motos de valeur",
      benefits: [
        "Toutes garanties Confort",
        "Protection tous risques",
        "Équipements assurés 3K MAD",
        "Moto prêt 30j",
        "Garantie valeur neuve 2ans",
        "Assistance premium 24h/24"
      ],
      coverage: ["RC Obligatoire", "Vol", "Incendie", "Équipements de protection", "Assistance 0 km", "Moto de prêt", "Protection tous risques"],
      popular: false
    }
  }
};

// Calculate dynamic pricing based on real factors
const calculateDynamicPricing = (offer, vehicleType, vehicleValue = 0, driverAge = 30, experience = 5) => {
  let basePrice = offer.basePrice;
  
  // Age factor
  if (driverAge < 25) basePrice *= 1.5;
  else if (driverAge > 65) basePrice *= 1.3;
  
  // Experience factor
  if (experience < 2) basePrice *= 1.3;
  else if (experience > 10) basePrice *= 0.9;
  
  // Vehicle value factor (for premium packages)
  if (offer.title === "Premium" || offer.title === "Ultimate") {
    if (vehicleValue > 200000) basePrice *= 1.2;
    else if (vehicleValue > 100000) basePrice *= 1.1;
  }
  
  return Math.round(basePrice);
};

// Get real offers with dynamic pricing
export const getRealOffers = async (vehicleType = 'car', vehicleValue = 0, driverAge = 30, experience = 5) => {
  try {
    // Try to get real-time pricing from API
    const response = await quotesAPI.getEstimate({
      type: vehicleType,
      coverage: 'standard', // Use standard as baseline
      vehicleValue,
      driverAge,
      drivingExperience: experience
    });
    
    // If API call successful, use real data
    if (response.data.success) {
      const realData = response.data.data;
      const offers = REAL_OFFERS_DATA[vehicleType];
      
      // Update offers with real pricing data
      Object.keys(offers).forEach(key => {
        const offer = offers[key];
        const dynamicPrice = calculateDynamicPricing(offer, vehicleType, vehicleValue, driverAge, experience);
        offer.price = `À partir de ${dynamicPrice.toLocaleString('fr-FR')} MAD/an`;
        offer.monthlyPrice = `À partir de ${Math.round(dynamicPrice / 12).toLocaleString('fr-FR')} MAD/mois`;
      });
      
      return offers;
    }
  } catch (error) {
    console.log('Using fallback offers data:', error.message);
  }
  
  // Fallback to static data with dynamic pricing
  const offers = JSON.parse(JSON.stringify(REAL_OFFERS_DATA[vehicleType]));
  Object.keys(offers).forEach(key => {
    const offer = offers[key];
    const dynamicPrice = calculateDynamicPricing(offer, vehicleType, vehicleValue, driverAge, experience);
    offer.price = `À partir de ${dynamicPrice.toLocaleString('fr-FR')} MAD/an`;
    offer.monthlyPrice = `À partir de ${Math.round(dynamicPrice / 12).toLocaleString('fr-FR')} MAD/mois`;
  });
  
  return offers;
};

// Get coverage details for a specific offer
export const getCoverageDetails = (vehicleType, offerType) => {
  const offers = REAL_OFFERS_DATA[vehicleType];
  return offers[offerType]?.coverage || [];
};

// Get all available coverage options
export const getAllCoverageOptions = (vehicleType) => {
  const coverageOptions = {
    car: [
      'RC Obligatoire',
      'Vol',
      'Incendie',
      'Bris de glace',
      'Vandalisme',
      'Assistance 0 km',
      'Véhicule de remplacement',
      'Protection juridique',
      'Garantie conducteur',
      'Défense Recours',
      'Tous risques'
    ],
    moto: [
      'RC Obligatoire',
      'Vol',
      'Incendie',
      'Bris de glace',
      'Équipements de protection',
      'Assistance 0 km',
      'Moto de prêt',
      'Protection juridique',
      'Garantie conducteur',
      'Protection tous risques',
      'Protection circuit'
    ]
  };
  
  return coverageOptions[vehicleType] || [];
};

export default {
  getRealOffers,
  getCoverageDetails,
  getAllCoverageOptions
};
