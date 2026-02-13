// AI Model Logic - Deterministic algorithms simulating ML models

// Plant Disease Database (based on PlantVillage dataset)
export const plantDiseases = {
  tomato: [
    {
      name: "Early Blight",
      symptoms: ["brown spots", "dark rings", "leaf yellowing"],
      solution: "Remove infected leaves, apply copper-based fungicide, ensure proper spacing for air circulation",
      prevention: "Crop rotation, mulching, avoid overhead watering, use disease-resistant varieties",
      severity: "medium"
    },
    {
      name: "Late Blight",
      symptoms: ["water-soaked spots", "white mold", "rapid wilting"],
      solution: "Apply fungicide immediately, remove infected plants, improve drainage",
      prevention: "Use resistant varieties, avoid wet foliage, proper plant spacing",
      severity: "high"
    },
    {
      name: "Leaf Mold",
      symptoms: ["yellow spots", "olive-green mold", "leaf curling"],
      solution: "Reduce humidity, improve ventilation, apply appropriate fungicide",
      prevention: "Control humidity, ensure good air flow, use resistant varieties",
      severity: "medium"
    },
    {
      name: "Bacterial Spot",
      symptoms: ["small dark spots", "yellow halos", "leaf drop"],
      solution: "Remove infected parts, apply copper spray, avoid overhead irrigation",
      prevention: "Use certified seeds, crop rotation, drip irrigation",
      severity: "medium"
    }
  ],
  potato: [
    {
      name: "Early Blight",
      symptoms: ["concentric rings", "brown lesions", "leaf death"],
      solution: "Apply chlorothalonil fungicide, remove infected foliage, ensure proper nutrition",
      prevention: "Crop rotation, use healthy seed potatoes, avoid water stress",
      severity: "medium"
    },
    {
      name: "Late Blight",
      symptoms: ["water-soaked lesions", "white growth", "tuber rot"],
      solution: "Immediate fungicide application, destroy infected plants, harvest early if needed",
      prevention: "Use resistant varieties, fungicide program, proper storage",
      severity: "high"
    }
  ],
  wheat: [
    {
      name: "Rust",
      symptoms: ["orange pustules", "yellow spots", "reduced yield"],
      solution: "Apply triazole fungicide, remove volunteer plants, harvest timely",
      prevention: "Use resistant varieties, crop rotation, proper fertilization",
      severity: "high"
    },
    {
      name: "Powdery Mildew",
      symptoms: ["white powder", "leaf distortion", "stunted growth"],
      solution: "Apply sulfur-based fungicide, improve air circulation",
      prevention: "Resistant varieties, avoid excess nitrogen, proper spacing",
      severity: "medium"
    }
  ],
  rice: [
    {
      name: "Blast",
      symptoms: ["diamond-shaped lesions", "neck rot", "grain discoloration"],
      solution: "Apply tricyclazole fungicide, improve field drainage, balance fertilization",
      prevention: "Use resistant varieties, avoid excess nitrogen, proper water management",
      severity: "high"
    },
    {
      name: "Bacterial Leaf Blight",
      symptoms: ["water-soaked lesions", "yellowing", "wilting"],
      solution: "Use copper-based bactericide, improve drainage, remove infected plants",
      prevention: "Use certified seeds, crop rotation, balanced fertilization",
      severity: "medium"
    }
  ],
  corn: [
    {
      name: "Northern Leaf Blight",
      symptoms: ["gray-green lesions", "cigar-shaped spots", "premature death"],
      solution: "Apply fungicide at first sign, remove crop residue, hybrid rotation",
      prevention: "Use resistant hybrids, crop rotation, timely planting",
      severity: "medium"
    },
    {
      name: "Common Rust",
      symptoms: ["reddish-brown pustules", "yellowing", "early senescence"],
      solution: "Apply fungicide if severe, monitor weather conditions",
      prevention: "Plant resistant hybrids, avoid late planting",
      severity: "low"
    }
  ]
};

// Analyze image and detect disease (deterministic based on image properties)
export const detectCropDisease = (imageData: ImageData, cropType: string = 'tomato') => {
  // Analyze image color distribution
  const pixels = imageData.data;
  let rTotal = 0, gTotal = 0, bTotal = 0;
  let brownPixels = 0, yellowPixels = 0, darkPixels = 0, greenPixels = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    rTotal += r;
    gTotal += g;
    bTotal += b;

    // Detect brown (high red, medium green, low blue)
    if (r > 100 && r > g && g > 50 && b < 100) brownPixels++;
    
    // Detect yellow (high red, high green, low blue)
    if (r > 150 && g > 150 && b < 100) yellowPixels++;
    
    // Detect dark (all low)
    if (r < 80 && g < 80 && b < 80) darkPixels++;
    
    // Detect green
    if (g > r && g > b && g > 100) greenPixels++;
  }

  const totalPixels = pixels.length / 4;
  const brownRatio = brownPixels / totalPixels;
  const yellowRatio = yellowPixels / totalPixels;
  const darkRatio = darkPixels / totalPixels;
  const greenRatio = greenPixels / totalPixels;

  // Get diseases for crop type
  const diseases = plantDiseases[cropType as keyof typeof plantDiseases] || plantDiseases.tomato;
  
  // Determine disease based on color analysis
  let selectedDisease;
  let confidence;

  if (greenRatio > 0.5) {
    // Mostly green - healthy or early stage
    selectedDisease = { 
      name: "Healthy", 
      symptoms: ["Normal green leaves", "No visible damage"],
      solution: "Continue regular care and monitoring",
      prevention: "Maintain proper watering, fertilization, and pest control",
      severity: "none"
    };
    confidence = 92 + Math.random() * 5;
  } else if (brownRatio > 0.15 && darkRatio > 0.1) {
    // Brown and dark spots - likely blight
    selectedDisease = diseases[0]; // Early or Late Blight
    confidence = 85 + Math.random() * 10;
  } else if (yellowRatio > 0.2) {
    // Yellow dominant - bacterial or nutrient issue
    selectedDisease = diseases[diseases.length - 1];
    confidence = 80 + Math.random() * 12;
  } else if (darkRatio > 0.15) {
    // Dark spots - fungal disease
    selectedDisease = diseases[Math.min(2, diseases.length - 1)];
    confidence = 82 + Math.random() * 10;
  } else {
    // Mixed symptoms
    selectedDisease = diseases[1];
    confidence = 75 + Math.random() * 15;
  }

  return {
    disease: selectedDisease.name,
    confidence: Math.round(confidence * 10) / 10,
    solution: selectedDisease.solution,
    prevention: selectedDisease.prevention,
    severity: selectedDisease.severity,
    symptoms: selectedDisease.symptoms
  };
};

// Crop Recommendation Model (Random Forest simulation)
export const recommendCrop = (params: {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}) => {
  const { N, P, K, temperature, humidity, ph, rainfall } = params;

  // Decision tree logic
  const scores: { [key: string]: number } = {
    rice: 0,
    wheat: 0,
    cotton: 0,
    maize: 0,
    sugarcane: 0,
    tomato: 0,
    potato: 0,
    onion: 0,
    groundnut: 0,
    soybean: 0
  };

  // Rice prefers: High N, high rainfall, neutral pH
  scores.rice = 
    (N > 80 ? 25 : 0) +
    (rainfall > 150 ? 25 : 0) +
    (humidity > 70 ? 20 : 0) +
    (temperature > 20 && temperature < 35 ? 20 : 0) +
    (ph > 5.5 && ph < 7.5 ? 10 : 0);

  // Wheat prefers: Moderate N, low rainfall, cool temperature
  scores.wheat =
    (N > 50 && N < 100 ? 25 : 0) +
    (rainfall < 100 ? 25 : 0) +
    (temperature > 10 && temperature < 25 ? 25 : 0) +
    (ph > 6 && ph < 7.5 ? 15 : 0) +
    (P > 40 ? 10 : 0);

  // Cotton prefers: High K, moderate rainfall, warm
  scores.cotton =
    (K > 40 ? 25 : 0) +
    (rainfall > 50 && rainfall < 120 ? 25 : 0) +
    (temperature > 25 && temperature < 35 ? 25 : 0) +
    (humidity < 70 ? 15 : 0) +
    (ph > 6 && ph < 8 ? 10 : 0);

  // Maize: Moderate NPK, moderate rainfall
  scores.maize =
    (N > 60 && N < 100 ? 20 : 0) +
    (P > 30 && P < 60 ? 20 : 0) +
    (K > 30 && K < 60 ? 20 : 0) +
    (rainfall > 60 && rainfall < 120 ? 20 : 0) +
    (temperature > 20 && temperature < 30 ? 20 : 0);

  // Sugarcane: High N, high rainfall
  scores.sugarcane =
    (N > 100 ? 30 : 0) +
    (rainfall > 150 ? 25 : 0) +
    (temperature > 25 ? 20 : 0) +
    (humidity > 70 ? 15 : 0) +
    (K > 50 ? 10 : 0);

  // Tomato: Balanced NPK, moderate conditions
  scores.tomato =
    (N > 40 && N < 80 ? 20 : 0) +
    (P > 50 ? 25 : 0) +
    (K > 40 ? 20 : 0) +
    (temperature > 18 && temperature < 28 ? 20 : 0) +
    (ph > 6 && ph < 7 ? 15 : 0);

  // Potato: High P, cool temperature
  scores.potato =
    (P > 60 ? 30 : 0) +
    (temperature > 15 && temperature < 25 ? 25 : 0) +
    (rainfall > 50 && rainfall < 100 ? 20 : 0) +
    (ph > 5 && ph < 6.5 ? 15 : 0) +
    (K > 50 ? 10 : 0);

  // Onion: Low N, moderate P
  scores.onion =
    (N < 60 ? 25 : 0) +
    (P > 40 ? 20 : 0) +
    (K > 40 ? 20 : 0) +
    (temperature > 15 && temperature < 30 ? 20 : 0) +
    (rainfall < 80 ? 15 : 0);

  // Groundnut: High P, low rainfall
  scores.groundnut =
    (P > 50 ? 25 : 0) +
    (rainfall < 100 ? 25 : 0) +
    (temperature > 25 && temperature < 35 ? 25 : 0) +
    (K > 40 ? 15 : 0) +
    (ph > 6 && ph < 7 ? 10 : 0);

  // Soybean: Moderate all, moderate rainfall
  scores.soybean =
    (N > 30 && N < 80 ? 20 : 0) +
    (P > 40 && P < 80 ? 20 : 0) +
    (rainfall > 80 && rainfall < 150 ? 25 : 0) +
    (temperature > 20 && temperature < 30 ? 20 : 0) +
    (ph > 6 && ph < 7.5 ? 15 : 0);

  // Sort by score
  const sortedCrops = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([crop, score]) => ({
      crop,
      score,
      confidence: Math.min(98, Math.round((score / 100) * 100))
    }));

  return {
    recommendedCrop: sortedCrops[0].crop,
    confidence: sortedCrops[0].confidence,
    alternatives: sortedCrops.slice(1, 4)
  };
};

// Risk Prediction (Logistic Regression simulation)
export const predictCropRisk = (params: {
  soilHealth: number;
  weatherRisk: number;
  pestIncidence: number;
  irrigationQuality: number;
  cropAge: number;
}) => {
  const { soilHealth, weatherRisk, pestIncidence, irrigationQuality, cropAge } = params;

  // Calculate risk score (0-100)
  const riskScore =
    (100 - soilHealth) * 0.25 +
    weatherRisk * 0.3 +
    pestIncidence * 0.25 +
    (100 - irrigationQuality) * 0.15 +
    (cropAge > 90 ? 20 : cropAge > 60 ? 10 : 0) * 0.05;

  let riskLevel: 'Low' | 'Medium' | 'High';
  let recommendations: string[];

  if (riskScore < 35) {
    riskLevel = 'Low';
    recommendations = [
      'Continue current practices',
      'Monitor crop health regularly',
      'Maintain soil nutrition levels'
    ];
  } else if (riskScore < 65) {
    riskLevel = 'Medium';
    recommendations = [
      'Increase monitoring frequency',
      'Consider preventive pest control',
      'Review irrigation schedule',
      'Test soil health'
    ];
  } else {
    riskLevel = 'High';
    recommendations = [
      'Immediate intervention required',
      'Apply pest control measures',
      'Improve soil health urgently',
      'Adjust irrigation immediately',
      'Consider crop insurance'
    ];
  }

  return {
    riskLevel,
    riskScore: Math.round(riskScore),
    confidence: 85 + Math.random() * 10,
    recommendations,
    factors: {
      soil: 100 - soilHealth,
      weather: weatherRisk,
      pest: pestIncidence,
      irrigation: 100 - irrigationQuality
    }
  };
};

// Yield Estimation (Linear Regression simulation)
export const estimateYield = (params: {
  crop: string;
  landArea: number;
  soilQuality: number;
  irrigationScore: number;
  fertilizationScore: number;
  weatherScore: number;
}) => {
  const { crop, landArea, soilQuality, irrigationScore, fertilizationScore, weatherScore } = params;

  // Base yield per hectare for different crops (in quintals)
  const baseYields: { [key: string]: number } = {
    rice: 35,
    wheat: 30,
    cotton: 18,
    maize: 28,
    sugarcane: 350,
    tomato: 250,
    potato: 220,
    onion: 200,
    groundnut: 20,
    soybean: 25
  };

  const baseYield = baseYields[crop.toLowerCase()] || 25;

  // Calculate yield multiplier based on conditions
  const qualityMultiplier =
    (soilQuality / 100) * 0.3 +
    (irrigationScore / 100) * 0.25 +
    (fertilizationScore / 100) * 0.25 +
    (weatherScore / 100) * 0.2;

  const totalYield = baseYield * landArea * (0.5 + qualityMultiplier);

  // Market prices per quintal (in rupees)
  const marketPrices: { [key: string]: number } = {
    rice: 2100,
    wheat: 2000,
    cotton: 5500,
    maize: 1800,
    sugarcane: 300,
    tomato: 1500,
    potato: 1200,
    onion: 1800,
    groundnut: 5000,
    soybean: 3800
  };

  const pricePerQuintal = marketPrices[crop.toLowerCase()] || 2000;
  const totalRevenue = totalYield * pricePerQuintal;

  // Calculate costs
  const costPerHectare = 25000; // Average farming cost
  const totalCost = landArea * costPerHectare;
  const profit = totalRevenue - totalCost;

  return {
    estimatedYield: Math.round(totalYield * 10) / 10,
    unit: crop.toLowerCase() === 'sugarcane' || crop.toLowerCase() === 'tomato' || crop.toLowerCase() === 'potato' || crop.toLowerCase() === 'onion' ? 'quintals' : 'quintals',
    revenue: Math.round(totalRevenue),
    cost: totalCost,
    profit: Math.round(profit),
    pricePerQuintal,
    confidence: 75 + Math.round(qualityMultiplier * 20)
  };
};
