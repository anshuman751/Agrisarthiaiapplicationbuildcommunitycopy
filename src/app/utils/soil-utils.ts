// Soil Intelligence Utilities

export const calculateSoilFertility = (params: {
  N: number;
  P: number;
  K: number;
  pH: number;
  organicMatter: number;
  moisture: number;
}) => {
  const { N, P, K, pH, organicMatter, moisture } = params;

  // NPK score (0-100)
  const nScore = Math.min(100, (N / 150) * 100);
  const pScore = Math.min(100, (P / 100) * 100);
  const kScore = Math.min(100, (K / 100) * 100);
  
  // pH score (optimal 6-7)
  const pHScore = pH >= 6 && pH <= 7 ? 100 : pH >= 5.5 && pH <= 7.5 ? 75 : pH >= 5 && pH <= 8 ? 50 : 25;
  
  // Organic matter score
  const omScore = Math.min(100, (organicMatter / 5) * 100);
  
  // Moisture score
  const moistureScore = moisture >= 40 && moisture <= 60 ? 100 : moisture >= 30 && moisture <= 70 ? 75 : 50;

  const fertilityScore = Math.round(
    (nScore * 0.25 + pScore * 0.25 + kScore * 0.25 + pHScore * 0.15 + omScore * 0.05 + moistureScore * 0.05)
  );

  let grade: string;
  if (fertilityScore >= 80) grade = 'Excellent';
  else if (fertilityScore >= 65) grade = 'Good';
  else if (fertilityScore >= 50) grade = 'Fair';
  else grade = 'Poor';

  return {
    score: fertilityScore,
    grade,
    components: {
      nitrogen: Math.round(nScore),
      phosphorus: Math.round(pScore),
      potassium: Math.round(kScore),
      pH: Math.round(pHScore),
      organicMatter: Math.round(omScore),
      moisture: Math.round(moistureScore)
    }
  };
};

export const getSoilImprovements = (params: {
  N: number;
  P: number;
  K: number;
  pH: number;
  organicMatter: number;
}) => {
  const { N, P, K, pH, organicMatter } = params;
  const improvements: string[] = [];

  if (N < 60) {
    improvements.push('Add nitrogen-rich fertilizers (Urea, Ammonium sulfate) or organic sources like compost');
  } else if (N > 140) {
    improvements.push('Reduce nitrogen application to prevent pollution and crop lodging');
  }

  if (P < 40) {
    improvements.push('Apply phosphorus fertilizers (DAP, SSP) or bone meal to improve root development');
  }

  if (K < 40) {
    improvements.push('Add potassium fertilizers (Muriate of Potash) or wood ash to enhance disease resistance');
  }

  if (pH < 5.5) {
    improvements.push('Apply agricultural lime to increase pH and reduce soil acidity');
  } else if (pH > 8) {
    improvements.push('Apply sulfur or organic matter to reduce alkalinity');
  }

  if (organicMatter < 2) {
    improvements.push('Incorporate farmyard manure, compost, or green manure to improve soil structure');
  }

  if (improvements.length === 0) {
    improvements.push('Soil is in good condition. Maintain current practices and monitor regularly');
  }

  return improvements;
};

export const getNaturalFertilizerRecommendations = (deficientNutrient: string[]) => {
  const recommendations: { [key: string]: any } = {
    nitrogen: {
      name: 'Nitrogen Boosters',
      options: [
        {
          fertilizer: 'Compost',
          application: 'Apply 5-10 tons per hectare before planting',
          benefits: 'Slow-release nitrogen, improves soil structure'
        },
        {
          fertilizer: 'Vermicompost',
          application: 'Apply 2-3 tons per hectare',
          benefits: 'High nutrient content, beneficial microorganisms'
        },
        {
          fertilizer: 'Green Manure (Dhaincha, Sunhemp)',
          application: 'Grow for 45-60 days then incorporate into soil',
          benefits: 'Fixes atmospheric nitrogen, adds organic matter'
        },
        {
          fertilizer: 'Neem Cake',
          application: '250-500 kg per hectare',
          benefits: 'Nitrogen source plus pest repellent properties'
        }
      ]
    },
    phosphorus: {
      name: 'Phosphorus Enhancers',
      options: [
        {
          fertilizer: 'Bone Meal',
          application: '200-300 kg per hectare',
          benefits: 'Slow-release phosphorus, improves flowering'
        },
        {
          fertilizer: 'Rock Phosphate',
          application: '400-600 kg per hectare',
          benefits: 'Long-lasting phosphorus source'
        },
        {
          fertilizer: 'Fish Bone Meal',
          application: '150-250 kg per hectare',
          benefits: 'High phosphorus content, trace minerals'
        }
      ]
    },
    potassium: {
      name: 'Potassium Sources',
      options: [
        {
          fertilizer: 'Wood Ash',
          application: '500-1000 kg per hectare',
          benefits: 'Potassium and micronutrients, raises pH'
        },
        {
          fertilizer: 'Banana Peel Compost',
          application: 'Mix into compost or apply as mulch',
          benefits: 'High potassium, improves fruit quality'
        },
        {
          fertilizer: 'Kelp Meal',
          application: '200-400 kg per hectare',
          benefits: 'Potassium plus growth hormones'
        }
      ]
    },
    general: {
      name: 'Complete Organic Fertilizers',
      options: [
        {
          fertilizer: 'Farmyard Manure (FYM)',
          application: '10-15 tons per hectare annually',
          benefits: 'Balanced NPK, improves soil health'
        },
        {
          fertilizer: 'Poultry Manure',
          application: '3-5 tons per hectare',
          benefits: 'High nutrient content, fast-acting'
        },
        {
          fertilizer: 'Biofertilizers (Rhizobium, Azotobacter)',
          application: 'Seed treatment or soil application as per packet',
          benefits: 'Biological nitrogen fixation, eco-friendly'
        }
      ]
    }
  };

  const result: any[] = [];

  if (deficientNutrient.includes('N')) {
    result.push(recommendations.nitrogen);
  }
  if (deficientNutrient.includes('P')) {
    result.push(recommendations.phosphorus);
  }
  if (deficientNutrient.includes('K')) {
    result.push(recommendations.potassium);
  }

  // Always add general recommendations
  result.push(recommendations.general);

  return result;
};
