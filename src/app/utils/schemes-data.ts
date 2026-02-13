// Government Schemes Data and Eligibility Logic

export const governmentSchemes = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Direct income support of ₹6000 per year in three equal installments to all landholding farmer families',
    benefits: '₹6000/year (₹2000 per installment, 3 times a year)',
    eligibility: {
      landOwnership: true,
      minLand: 0,
      maxLand: 1000,
      category: ['small', 'marginal', 'large']
    },
    documents: ['Land records', 'Aadhaar card', 'Bank account details'],
    howToApply: 'Apply online at pmkisan.gov.in or visit nearest Common Service Centre (CSC)',
    category: 'Income Support'
  },
  {
    id: 'fasal-bima',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Crop insurance scheme providing financial support to farmers in case of crop loss',
    benefits: 'Insurance coverage for crop loss due to natural calamities, pests, and diseases',
    eligibility: {
      landOwnership: true,
      minLand: 0,
      maxLand: 1000,
      category: ['small', 'marginal', 'large'],
      loanTaken: false // Optional
    },
    documents: ['Land records', 'Aadhaar card', 'Bank account', 'Crop sowing details'],
    howToApply: 'Apply through banks, CSCs, or insurance company agents within crop sowing period',
    category: 'Insurance'
  },
  {
    id: 'kisan-credit',
    name: 'Kisan Credit Card (KCC)',
    description: 'Credit facility for farmers to meet crop production and related needs',
    benefits: 'Easy credit access up to ₹3 lakh at concessional interest rates (4% interest for timely repayment)',
    eligibility: {
      landOwnership: true,
      minLand: 0.5,
      maxLand: 1000,
      category: ['small', 'marginal', 'large']
    },
    documents: ['Land documents', 'Identity proof', 'Address proof', 'Passport photo'],
    howToApply: 'Apply at nearest bank branch with required documents',
    category: 'Credit'
  },
  {
    id: 'soil-health',
    name: 'Soil Health Card Scheme',
    description: 'Free soil testing and health card to help farmers improve soil fertility',
    benefits: 'Free soil testing and customized fertilizer recommendations',
    eligibility: {
      landOwnership: true,
      minLand: 0,
      maxLand: 1000,
      category: ['small', 'marginal', 'large']
    },
    documents: ['Land records', 'Farmer ID'],
    howToApply: 'Contact district agriculture office or visit soilhealth.dac.gov.in',
    category: 'Soil Management'
  },
  {
    id: 'micro-irrigation',
    name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    description: 'Subsidy for micro-irrigation systems (drip, sprinkler) for water conservation',
    benefits: 'Up to 55% subsidy for small/marginal farmers, 45% for others',
    eligibility: {
      landOwnership: true,
      minLand: 0.5,
      maxLand: 1000,
      category: ['small', 'marginal', 'large']
    },
    documents: ['Land documents', 'Bank account', 'Aadhaar', 'Quotation for irrigation system'],
    howToApply: 'Apply through state agriculture department or online portal',
    category: 'Irrigation'
  },
  {
    id: 'paramparagat-krishi',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    description: 'Support for organic farming through cluster formation and certification',
    benefits: '₹50,000 per hectare for 3 years including organic inputs and certification',
    eligibility: {
      landOwnership: true,
      minLand: 0.5,
      maxLand: 50,
      category: ['small', 'marginal', 'large'],
      organicFarming: true
    },
    documents: ['Land records', 'Group formation certificate', 'Aadhaar'],
    howToApply: 'Form cluster of 50 farmers and apply through district agriculture office',
    category: 'Organic Farming'
  },
  {
    id: 'kisan-maan-dhan',
    name: 'PM Kisan Maan Dhan Yojana',
    description: 'Pension scheme for small and marginal farmers',
    benefits: '₹3000/month pension after 60 years of age',
    eligibility: {
      landOwnership: true,
      minLand: 0,
      maxLand: 2,
      category: ['small', 'marginal'],
      age: [18, 40] // Enrollment age
    },
    documents: ['Aadhaar', 'Bank account', 'Land records'],
    howToApply: 'Enroll through CSC or online at maandhan.in',
    category: 'Pension'
  },
  {
    id: 'gramin-bhandaran',
    name: 'Gramin Bhandaran Yojana',
    description: 'Subsidy for construction/renovation of rural godowns for crop storage',
    benefits: 'Subsidy on bank loans for warehouse construction',
    eligibility: {
      landOwnership: true,
      minLand: 2,
      maxLand: 1000,
      category: ['small', 'marginal', 'large']
    },
    documents: ['Land documents', 'Project report', 'Bank account'],
    howToApply: 'Apply through NABARD or commercial banks',
    category: 'Infrastructure'
  },
  {
    id: 'interest-subvention',
    name: 'Interest Subvention Scheme',
    description: 'Interest subsidy on crop loans',
    benefits: '2% interest subvention + 3% prompt repayment incentive (effective 4% interest)',
    eligibility: {
      landOwnership: true,
      minLand: 0,
      maxLand: 1000,
      category: ['small', 'marginal', 'large'],
      loanTaken: true
    },
    documents: ['Loan account details', 'Land records'],
    howToApply: 'Automatically applicable on crop loans from banks',
    category: 'Credit'
  },
  {
    id: 'national-beekeeping',
    name: 'National Beekeeping & Honey Mission (NBHM)',
    description: 'Support for beekeeping and honey production',
    benefits: 'Subsidy on beekeeping equipment and training',
    eligibility: {
      landOwnership: false, // Not mandatory
      minLand: 0,
      maxLand: 1000,
      category: ['small', 'marginal', 'large']
    },
    documents: ['Aadhaar', 'Bank account', 'Training certificate'],
    howToApply: 'Apply through state horticulture department',
    category: 'Allied Activities'
  }
];

export const checkSchemeEligibility = (farmerProfile: {
  landSize: number;
  landOwnership: boolean;
  category: 'small' | 'marginal' | 'large';
  age?: number;
  organicFarming?: boolean;
  loanTaken?: boolean;
}) => {
  const eligibleSchemes = governmentSchemes.filter(scheme => {
    const { eligibility } = scheme;

    // Check land ownership
    if (eligibility.landOwnership && !farmerProfile.landOwnership) {
      return false;
    }

    // Check land size
    if (farmerProfile.landSize < eligibility.minLand || farmerProfile.landSize > eligibility.maxLand) {
      return false;
    }

    // Check category
    if (!eligibility.category.includes(farmerProfile.category)) {
      return false;
    }

    // Check age (if scheme requires)
    if (eligibility.age && farmerProfile.age) {
      if (farmerProfile.age < eligibility.age[0] || farmerProfile.age > eligibility.age[1]) {
        return false;
      }
    }

    // Check organic farming (if scheme requires)
    if ('organicFarming' in eligibility && eligibility.organicFarming && !farmerProfile.organicFarming) {
      return false;
    }

    // Check loan status (if scheme requires)
    if ('loanTaken' in eligibility && eligibility.loanTaken !== undefined) {
      if (eligibility.loanTaken && !farmerProfile.loanTaken) {
        return false;
      }
    }

    return true;
  });

  const ineligibleSchemes = governmentSchemes.filter(
    scheme => !eligibleSchemes.includes(scheme)
  );

  return {
    eligible: eligibleSchemes.map(scheme => ({
      ...scheme,
      reason: getEligibilityReason(scheme, farmerProfile, true)
    })),
    ineligible: ineligibleSchemes.map(scheme => ({
      ...scheme,
      reason: getEligibilityReason(scheme, farmerProfile, false)
    }))
  };
};

const getEligibilityReason = (scheme: any, profile: any, isEligible: boolean) => {
  if (isEligible) {
    const reasons = [
      'You meet all eligibility criteria for this scheme.',
      'Based on your profile, you are highly qualified for this support.',
      'Your land size and farmer category align perfectly with this initiative.',
      'You are eligible for direct benefits under this government program.',
      'Criteria matched: Profile verified for agricultural subsidy.'
    ];
    // Return a semi-random but consistent reason based on scheme ID and land size
    const index = (scheme.id.length + Math.floor(profile.landSize)) % reasons.length;
    return reasons[index];
  }

  const reasons: string[] = [];

  if (scheme.eligibility.landOwnership && !profile.landOwnership) {
    reasons.push('Requires land ownership');
  }

  if (profile.landSize < scheme.eligibility.minLand) {
    reasons.push(`Requires minimum ${scheme.eligibility.minLand} hectare land`);
  }

  if (profile.landSize > scheme.eligibility.maxLand) {
    reasons.push(`Maximum land size: ${scheme.eligibility.maxLand} hectares`);
  }

  if (!scheme.eligibility.category.includes(profile.category)) {
    reasons.push(`Only for ${scheme.eligibility.category.join(', ')} farmers`);
  }

  if (scheme.eligibility.age && profile.age) {
    if (profile.age < scheme.eligibility.age[0]) {
      reasons.push(`Minimum age: ${scheme.eligibility.age[0]} years`);
    }
    if (profile.age > scheme.eligibility.age[1]) {
      reasons.push(`Maximum age: ${scheme.eligibility.age[1]} years`);
    }
  }

  if (scheme.eligibility.organicFarming && !profile.organicFarming) {
    reasons.push('Requires organic farming practice');
  }

  return reasons.join(', ');
};

export const getLandCategory = (landSize: number): 'small' | 'marginal' | 'large' => {
  if (landSize < 1) return 'marginal';
  if (landSize < 2) return 'small';
  return 'large';
};
