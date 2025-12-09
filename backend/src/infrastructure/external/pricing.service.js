// AssurOnline Pricing Engine
// Real Moroccan market data and pricing logic

export class PricingService {
  constructor() {
    // Base rates per year (in MAD) - Real Moroccan market data
    this.baseRates = {
      car: {
        basique: 2500,
        standard: 4500,
        premium: 7500,
      },
      moto: {
        essentiel: 1200,
        confort: 2800,
        ultimate: 4500,
      },
    };

    // Risk factors based on Moroccan market analysis
    this.riskFactors = {
      age: {
        '18-25': 1.5, // High risk - young drivers
        '26-35': 1.2, // Medium-high risk
        '36-50': 1.0, // Normal risk - best rates
        '51-65': 1.1, // Slightly higher risk
        '65+': 1.3, // Higher risk - senior drivers
      },
      vehicleAge: {
        '0-2': 0.9, // New car discount
        '3-5': 1.0, // Normal rate
        '6-10': 1.25, // Aging vehicle
        '11-15': 1.5, // Old vehicle
        '15+': 2.0, // Very old vehicle
      },
      vehicleValue: {
        '0-100000': 0.8, // Economy cars
        '100001-200000': 1.0, // Mid-range cars
        '200001-400000': 1.3, // Premium cars
        '400001-600000': 1.6, // Luxury cars
        '600000+': 2.0, // Super luxury
      },
      city: {
        Casablanca: 1.4, // High risk - traffic, theft
        Rabat: 1.2, // Capital city
        Marrakech: 1.15, // Tourist area
        Fès: 1.1, // Medium city
        Agadir: 1.05, // Coastal, lower risk
        Tanger: 1.1, // Port city
        Meknès: 1.0, // Normal risk
        Oujda: 0.95, // Lower risk
        Kénitra: 1.0, // Normal risk
        Tétouan: 0.95, // Lower risk
        Autre: 1.0, // Default
      },
      drivingExperience: {
        '0-2': 1.8, // New drivers - high risk
        '3-5': 1.3, // Some experience
        '6-10': 1.0, // Experienced drivers
        '10+': 0.8, // Very experienced - discount
      },
    };

    // Coverage options with additional costs
    this.coverageOptions = {
      car: {
        'RC Obligatoire': 0,
        Vol: 15,
        Incendie: 12,
        'Bris de glace': 8,
        Vandalisme: 10,
        'Assistance 0 km': 20,
        'Véhicule de remplacement': 25,
        'Protection juridique': 5,
        'Garantie conducteur': 8,
        'Défense Recours': 12,
        'Tous risques': 40,
      },
      moto: {
        'RC Obligatoire': 0,
        Vol: 18,
        Incendie: 15,
        'Bris de glace': 10,
        'Équipements de protection': 12,
        'Assistance 0 km': 22,
        'Moto de prêt': 20,
        'Protection juridique': 6,
        'Garantie conducteur': 10,
        'Protection tous risques': 35,
        'Protection circuit': 25,
      },
    };

    // Coverage packages
    this.coveragePackages = {
      car: {
        basique: ['RC Obligatoire', 'Protection juridique', 'Garantie conducteur'],
        standard: ['RC Obligatoire', 'Vol', 'Incendie', 'Bris de glace', 'Vandalisme'],
        premium: [
          'RC Obligatoire',
          'Vol',
          'Incendie',
          'Bris de glace',
          'Vandalisme',
          'Assistance 0 km',
          'Véhicule de remplacement',
          'Tous risques',
        ],
      },
      moto: {
        essentiel: ['RC Obligatoire', 'Protection juridique', 'Garantie conducteur'],
        confort: ['RC Obligatoire', 'Vol', 'Incendie', 'Équipements de protection'],
        ultimate: [
          'RC Obligatoire',
          'Vol',
          'Incendie',
          'Équipements de protection',
          'Assistance 0 km',
          'Moto de prêt',
          'Protection tous risques',
        ],
      },
    };

    // Coverage limits (in MAD)
    this.coverageLimits = {
      car: {
        basique: {
          'RC Obligatoire': 'illimité',
          'Protection juridique': 15000,
          'Garantie conducteur': 1000,
        },
        standard: {
          'RC Obligatoire': 'illimité',
          Vol: 200000,
          Incendie: 200000,
          'Bris de glace': 5000,
          Vandalisme: 10000,
        },
        premium: {
          'RC Obligatoire': 'illimité',
          Vol: 500000,
          Incendie: 500000,
          'Bris de glace': 10000,
          Vandalisme: 25000,
          'Assistance 0 km': 'illimité',
          'Véhicule de remplacement': 30, // days
          'Tous risques': 'illimité',
        },
      },
      moto: {
        essentiel: {
          'RC Obligatoire': 'illimité',
          'Protection juridique': 10000,
          'Garantie conducteur': 2000,
        },
        confort: {
          'RC Obligatoire': 'illimité',
          Vol: 100000,
          Incendie: 100000,
          'Équipements de protection': 15000,
        },
        ultimate: {
          'RC Obligatoire': 'illimité',
          Vol: 200000,
          Incendie: 200000,
          'Équipements de protection': 30000,
          'Assistance 0 km': 'illimité',
          'Moto de prêt': 15, // days
          'Protection tous risques': 'illimité',
        },
      },
    };
  }

  /**
   * Calculate insurance premium based on risk factors
   * @param {Object} quoteData - Quote information
   * @returns {Object} Premium calculation result
   */
  calculatePremium(quoteData) {
    const {
      type,
      coverage,
      driverAge,
      vehicleAge,
      vehicleValue,
      city,
      drivingExperience,
      vehicleBrand,
      // vehicleModel is not currently used in pricing; kept for future use
      // eslint-disable-next-line no-unused-vars
      vehicleModel,
    } = quoteData;

    // Validate input
    if (!type || !coverage) {
      throw new Error('Type and coverage are required');
    }

    // Get base rate
    const baseRate = this.baseRates[type][coverage];
    if (!baseRate) {
      throw new Error(`Invalid coverage type: ${coverage} for ${type}`);
    }

    // Calculate risk factors
    const ageFactor = this.getAgeFactor(driverAge || 30);
    const vehicleAgeFactor = this.getVehicleAgeFactor(vehicleAge || 5);
    const valueFactor = this.getValueFactor(vehicleValue || 150000);
    const cityFactor = this.getCityFactor(city || 'Casablanca');
    const experienceFactor = this.getExperienceFactor(drivingExperience || 5);
    const brandFactor = this.getBrandFactor(vehicleBrand, type);

    // Calculate coverage costs
    const coverageCost = this.calculateCoverageCost(type, coverage);

    // Calculate total risk multiplier
    const riskMultiplier =
      ageFactor * vehicleAgeFactor * valueFactor * cityFactor * experienceFactor * brandFactor;

    // Calculate premiums
    const annualPremium = (baseRate + coverageCost) * riskMultiplier;
    const monthlyPremium = annualPremium / 12;
    const quarterlyPremium = annualPremium / 4;

    // Apply payment frequency discounts
    const annualDiscount = 0.05; // 5% discount for annual payment
    const quarterlyDiscount = 0.02; // 2% discount for quarterly payment

    const discountedAnnual = annualPremium * (1 - annualDiscount);
    const discountedQuarterly = quarterlyPremium * (1 - quarterlyDiscount);

    return {
      annualPremium: Math.round(annualPremium),
      monthlyPremium: Math.round(monthlyPremium),
      quarterlyPremium: Math.round(quarterlyPremium),
      discountedAnnual: Math.round(discountedAnnual),
      discountedQuarterly: Math.round(discountedQuarterly),
      baseRate,
      coverageCost,
      riskMultiplier: Math.round(riskMultiplier * 100) / 100,
      breakdown: {
        ageFactor,
        vehicleAgeFactor,
        valueFactor,
        cityFactor,
        experienceFactor,
        brandFactor,
      },
      coverageDetails: this.getCoverageDetails(type, coverage),
      savings: {
        annual: Math.round(annualPremium - discountedAnnual),
        quarterly: Math.round(quarterlyPremium - discountedQuarterly),
      },
    };
  }

  /**
   * Get age risk factor
   */
  getAgeFactor(age) {
    if (age >= 18 && age <= 25) return this.riskFactors.age['18-25'];
    if (age >= 26 && age <= 35) return this.riskFactors.age['26-35'];
    if (age >= 36 && age <= 50) return this.riskFactors.age['36-50'];
    if (age >= 51 && age <= 65) return this.riskFactors.age['51-65'];
    return this.riskFactors.age['65+'];
  }

  /**
   * Get vehicle age risk factor
   */
  getVehicleAgeFactor(age) {
    if (age <= 2) return this.riskFactors.vehicleAge['0-2'];
    if (age <= 5) return this.riskFactors.vehicleAge['3-5'];
    if (age <= 10) return this.riskFactors.vehicleAge['6-10'];
    if (age <= 15) return this.riskFactors.vehicleAge['11-15'];
    return this.riskFactors.vehicleAge['15+'];
  }

  /**
   * Get vehicle value risk factor
   */
  getValueFactor(value) {
    if (value <= 100000) return this.riskFactors.vehicleValue['0-100000'];
    if (value <= 200000) return this.riskFactors.vehicleValue['100001-200000'];
    if (value <= 400000) return this.riskFactors.vehicleValue['200001-400000'];
    if (value <= 600000) return this.riskFactors.vehicleValue['400001-600000'];
    return this.riskFactors.vehicleValue['600000+'];
  }

  /**
   * Get city risk factor
   */
  getCityFactor(city) {
    return this.riskFactors.city[city] || this.riskFactors.city['Autre'];
  }

  /**
   * Get driving experience risk factor
   */
  getExperienceFactor(experience) {
    if (experience <= 2) return this.riskFactors.drivingExperience['0-2'];
    if (experience <= 5) return this.riskFactors.drivingExperience['3-5'];
    if (experience <= 10) return this.riskFactors.drivingExperience['6-10'];
    return this.riskFactors.drivingExperience['10+'];
  }

  /**
   * Get vehicle brand risk factor
   */
  getBrandFactor(brand, type) {
    // Premium brands have higher risk factors
    const premiumBrands = {
      car: ['BMW', 'Mercedes', 'Audi', 'Porsche', 'Jaguar', 'Land Rover'],
      moto: ['Ducati', 'MV Agusta', 'Aprilia', 'KTM', 'Triumph'],
    };

    const economyBrands = {
      car: ['Dacia', 'Renault', 'Peugeot', 'Citroën'],
      moto: ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki'],
    };

    if (premiumBrands[type]?.includes(brand)) {
      return 1.2; // 20% higher for premium brands
    } else if (economyBrands[type]?.includes(brand)) {
      return 0.9; // 10% lower for economy brands
    }

    return 1.0; // Normal rate for other brands
  }

  /**
   * Calculate coverage cost
   */
  calculateCoverageCost(type, coverage) {
    const packageCoverages = this.coveragePackages[type][coverage];
    if (!packageCoverages) return 0;

    let totalCost = 0;
    packageCoverages.forEach((coverageName) => {
      totalCost += this.coverageOptions[type][coverageName] || 0;
    });

    return totalCost;
  }

  /**
   * Get coverage details for a package
   */
  getCoverageDetails(type, coverage) {
    return {
      package: coverage,
      coverages: this.coveragePackages[type][coverage] || [],
      limits: this.coverageLimits[type][coverage] || {},
    };
  }

  /**
   * Get available coverage packages for a vehicle type
   */
  getAvailablePackages(type) {
    return Object.keys(this.coveragePackages[type] || {});
  }

  /**
   * Get all available coverages for a vehicle type
   */
  getAvailableCoverages(type) {
    return Object.keys(this.coverageOptions[type] || {});
  }

  /**
   * Get vehicle brands for a type
   */
  getVehicleBrands(type) {
    const brands = {
      car: [
        'Renault',
        'Peugeot',
        'Dacia',
        'Toyota',
        'BMW',
        'Mercedes',
        'Audi',
        'Volkswagen',
        'Ford',
        'Nissan',
        'Hyundai',
        'Kia',
        'Citroën',
        'Opel',
        'Fiat',
        'Skoda',
      ],
      moto: [
        'Honda',
        'Yamaha',
        'Kawasaki',
        'Suzuki',
        'Ducati',
        'BMW',
        'KTM',
        'Triumph',
        'Aprilia',
        'MV Agusta',
        'Benelli',
        'Moto Guzzi',
      ],
    };
    return brands[type] || [];
  }

  /**
   * Get vehicle models for a brand and type
   */
  getVehicleModels(brand, type) {
    const models = {
      car: {
        Renault: ['Clio', 'Megane', 'Kadjar', 'Captur', 'Duster', 'Logan'],
        Peugeot: ['208', '308', '3008', '5008', 'Partner', '2008'],
        Dacia: ['Sandero', 'Logan', 'Duster', 'Lodgy', 'Dokker'],
        Toyota: ['Corolla', 'Camry', 'RAV4', 'Yaris', 'Hilux', 'Prius'],
        BMW: ['3 Series', '5 Series', 'X1', 'X3', 'X5', 'i3'],
        Mercedes: ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC', 'S-Class'],
        Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
        Volkswagen: ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touran'],
      },
      moto: {
        Honda: ['CBR 600', 'CBR 1000', 'CB 650', 'NC 750', 'Africa Twin', 'Shadow'],
        Yamaha: ['R1', 'R6', 'MT-07', 'MT-09', 'FZ-07', 'YZF-R3'],
        Kawasaki: ['Ninja 650', 'Ninja 1000', 'Z650', 'Z900', 'Versys', 'ER-6n'],
        Suzuki: ['GSX-R 600', 'GSX-R 1000', 'SV 650', 'V-Strom', 'Boulevard', 'Bandit'],
        Ducati: ['Monster', 'Panigale', 'Multistrada', 'Scrambler'],
        BMW: ['R 1200 GS', 'S 1000 RR', 'F 800 GS', 'K 1600 GT'],
      },
    };
    return models[type]?.[brand] || [];
  }

  /**
   * Get average vehicle value for a brand and model
   */
  getAverageVehicleValue(brand, model, type) {
    const values = {
      car: {
        Renault: {
          Clio: 80000,
          Megane: 120000,
          Kadjar: 180000,
          Captur: 150000,
          Duster: 160000,
          Logan: 70000,
        },
        Peugeot: {
          208: 90000,
          308: 130000,
          3008: 200000,
          5008: 250000,
          Partner: 140000,
          2008: 170000,
        },
        Dacia: { Sandero: 60000, Logan: 70000, Duster: 120000, Lodgy: 100000, Dokker: 90000 },
        Toyota: {
          Corolla: 140000,
          Camry: 200000,
          RAV4: 250000,
          Yaris: 110000,
          Hilux: 180000,
          Prius: 160000,
        },
        BMW: {
          '3 Series': 280000,
          '5 Series': 380000,
          X1: 220000,
          X3: 320000,
          X5: 450000,
          i3: 200000,
        },
        Mercedes: {
          'A-Class': 250000,
          'C-Class': 350000,
          'E-Class': 450000,
          GLA: 280000,
          GLC: 380000,
          'S-Class': 600000,
        },
      },
      moto: {
        Honda: {
          'CBR 600': 45000,
          'CBR 1000': 65000,
          'CB 650': 35000,
          'NC 750': 40000,
          'Africa Twin': 55000,
          Shadow: 30000,
        },
        Yamaha: {
          R1: 75000,
          R6: 55000,
          'MT-07': 40000,
          'MT-09': 50000,
          'FZ-07': 35000,
          'YZF-R3': 28000,
        },
        Kawasaki: {
          'Ninja 650': 40000,
          'Ninja 1000': 60000,
          Z650: 35000,
          Z900: 45000,
          Versys: 42000,
          'ER-6n': 30000,
        },
        Suzuki: {
          'GSX-R 600': 42000,
          'GSX-R 1000': 62000,
          'SV 650': 32000,
          'V-Strom': 38000,
          Boulevard: 35000,
          Bandit: 28000,
        },
      },
    };
    return values[type]?.[brand]?.[model] || 150000;
  }

  /**
   * Get Moroccan cities with risk factors
   */
  getMoroccanCities() {
    return {
      Casablanca: { risk: 1.4, population: '3.4M', region: 'Casablanca-Settat' },
      Rabat: { risk: 1.2, population: '1.2M', region: 'Rabat-Salé-Kénitra' },
      Marrakech: { risk: 1.15, population: '1.1M', region: 'Marrakech-Safi' },
      Fès: { risk: 1.1, population: '1.2M', region: 'Fès-Meknès' },
      Agadir: { risk: 1.05, population: '924K', region: 'Souss-Massa' },
      Tanger: { risk: 1.1, population: '1.1M', region: 'Tanger-Tétouan-Al Hoceïma' },
      Meknès: { risk: 1.0, population: '835K', region: 'Fès-Meknès' },
      Oujda: { risk: 0.95, population: '558K', region: 'Oriental' },
      Kénitra: { risk: 1.0, population: '431K', region: 'Rabat-Salé-Kénitra' },
      Tétouan: { risk: 0.95, population: '463K', region: 'Tanger-Tétouan-Al Hoceïma' },
    };
  }

  /**
   * Validate quote data
   */
  validateQuoteData(quoteData) {
    const errors = [];

    if (!quoteData.type || !['car', 'moto'].includes(quoteData.type)) {
      errors.push('Vehicle type must be car or moto');
    }

    if (!quoteData.coverage) {
      errors.push('Coverage type is required');
    }

    if (quoteData.driverAge && (quoteData.driverAge < 18 || quoteData.driverAge > 80)) {
      errors.push('Driver age must be between 18 and 80');
    }

    if (quoteData.vehicleAge && quoteData.vehicleAge > 30) {
      errors.push('Vehicle age cannot exceed 30 years');
    }

    if (quoteData.vehicleValue && quoteData.vehicleValue < 10000) {
      errors.push('Vehicle value must be at least 10,000 MAD');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const pricingService = new PricingService();
