// Irrigation System Utilities

export const calculateIrrigationNeeds = (params: {
  crop: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  cropStage: string;
  soilType: string;
}) => {
  const { crop, soilMoisture, temperature, humidity, rainfall, cropStage, soilType } = params;

  // Crop water requirements (mm/day)
  const cropWaterNeeds: { [key: string]: number } = {
    rice: 6.5,
    wheat: 4.0,
    cotton: 5.0,
    maize: 5.5,
    sugarcane: 7.0,
    tomato: 5.0,
    potato: 4.5,
    onion: 4.0,
    groundnut: 4.5,
    soybean: 5.0
  };

  const baseWaterNeed = cropWaterNeeds[crop.toLowerCase()] || 5.0;

  // Adjust for crop stage
  let stageMultiplier = 1.0;
  if (cropStage === 'germination') stageMultiplier = 0.7;
  else if (cropStage === 'vegetative') stageMultiplier = 1.0;
  else if (cropStage === 'flowering') stageMultiplier = 1.3;
  else if (cropStage === 'maturity') stageMultiplier = 0.8;

  // Adjust for weather
  const tempMultiplier = temperature > 35 ? 1.3 : temperature > 30 ? 1.15 : temperature > 25 ? 1.0 : 0.9;
  const humidityMultiplier = humidity < 40 ? 1.2 : humidity < 60 ? 1.0 : 0.85;

  // Calculate daily water need
  const dailyWaterNeed = baseWaterNeed * stageMultiplier * tempMultiplier * humidityMultiplier;

  // Soil water holding capacity
  const soilCapacity: { [key: string]: number } = {
    sandy: 40,
    loamy: 60,
    clay: 75,
    'silt loam': 65
  };

  const fieldCapacity = soilCapacity[soilType.toLowerCase()] || 60;

  // Determine irrigation need
  let irrigationRequired = false;
  let waterAmount = 0;
  let urgency: 'Low' | 'Medium' | 'High' = 'Low';
  let schedule = '';

  if (soilMoisture < 30) {
    irrigationRequired = true;
    urgency = 'High';
    waterAmount = ((fieldCapacity - soilMoisture) / 100) * dailyWaterNeed * 1.5;
    schedule = 'Immediate irrigation required';
  } else if (soilMoisture < 50) {
    irrigationRequired = true;
    urgency = 'Medium';
    waterAmount = ((fieldCapacity - soilMoisture) / 100) * dailyWaterNeed;
    schedule = 'Irrigate within 24 hours';
  } else if (soilMoisture < 65) {
    irrigationRequired = true;
    urgency = 'Low';
    waterAmount = dailyWaterNeed * 0.5;
    schedule = 'Irrigate within 2-3 days';
  } else {
    schedule = 'No irrigation needed currently';
  }

  // Account for recent rainfall
  if (rainfall > 10) {
    irrigationRequired = false;
    schedule = 'Recent rainfall sufficient, skip irrigation';
    waterAmount = 0;
  }

  return {
    irrigationRequired,
    urgency,
    waterAmount: Math.round(waterAmount * 10) / 10,
    schedule,
    soilMoistureStatus: soilMoisture > 60 ? 'Adequate' : soilMoisture > 40 ? 'Moderate' : 'Low',
    recommendations: getIrrigationRecommendations(soilMoisture, crop, soilType)
  };
};

const getIrrigationRecommendations = (soilMoisture: number, crop: string, soilType: string) => {
  const recommendations: string[] = [];

  if (soilMoisture < 30) {
    recommendations.push('⚠️ Critical moisture level - irrigate immediately to prevent crop stress');
    recommendations.push('Consider installing soil moisture sensors for better monitoring');
  } else if (soilMoisture < 50) {
    recommendations.push('Plan irrigation within next 24 hours');
  }

  // Method recommendations
  if (['rice', 'sugarcane'].includes(crop.toLowerCase())) {
    recommendations.push('💧 Recommended: Flood irrigation or continuous submergence for rice');
  } else if (['tomato', 'potato', 'onion'].includes(crop.toLowerCase())) {
    recommendations.push('💧 Recommended: Drip irrigation for efficient water use and disease prevention');
  } else {
    recommendations.push('💧 Recommended: Sprinkler or drip irrigation for water efficiency');
  }

  // Soil-specific advice
  if (soilType === 'sandy') {
    recommendations.push('🌱 Sandy soil: Irrigate more frequently with smaller amounts');
  } else if (soilType === 'clay') {
    recommendations.push('🌱 Clay soil: Irrigate less frequently but with larger amounts');
  }

  // Timing
  recommendations.push('⏰ Best time: Early morning (4-8 AM) or evening (5-8 PM) to minimize evaporation');

  return recommendations;
};

export const getIrrigationSchedule = (crop: string, soilType: string, season: string) => {
  const schedules: { [key: string]: any } = {
    rice: {
      germination: { frequency: 'Daily', amount: 'Light watering' },
      vegetative: { frequency: 'Continuous submergence', amount: '5-7 cm standing water' },
      flowering: { frequency: 'Continuous submergence', amount: '5-10 cm standing water' },
      maturity: { frequency: 'Reduce water', amount: 'Drain 2 weeks before harvest' }
    },
    wheat: {
      germination: { frequency: 'Every 3-4 days', amount: '40-50 mm' },
      vegetative: { frequency: 'Every 7-10 days', amount: '50-60 mm' },
      flowering: { frequency: 'Every 5-7 days', amount: '60-70 mm' },
      maturity: { frequency: 'Stop 10 days before harvest', amount: '0 mm' }
    },
    cotton: {
      germination: { frequency: 'Every 5-7 days', amount: '40-50 mm' },
      vegetative: { frequency: 'Every 10-12 days', amount: '50-60 mm' },
      flowering: { frequency: 'Every 7-10 days', amount: '60-80 mm' },
      maturity: { frequency: 'Every 12-15 days', amount: '40-50 mm' }
    },
    tomato: {
      germination: { frequency: 'Daily', amount: 'Light watering' },
      vegetative: { frequency: 'Every 2-3 days', amount: '25-30 mm' },
      flowering: { frequency: 'Every 2 days', amount: '30-40 mm' },
      maturity: { frequency: 'Every 3-4 days', amount: '20-30 mm' }
    }
  };

  return schedules[crop.toLowerCase()] || schedules.wheat;
};
