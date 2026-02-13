// Weather and Alert Utilities

export const mockWeatherData = {
  current: {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    windSpeed: 12,
    pressure: 1013,
    condition: 'Partly Cloudy',
    icon: '⛅'
  },
  forecast: [
    { day: 'Today', temp: 28, condition: 'Partly Cloudy', icon: '⛅', rainfall: 0 },
    { day: 'Tomorrow', temp: 30, condition: 'Sunny', icon: '☀️', rainfall: 0 },
    { day: 'Day 3', temp: 26, condition: 'Rainy', icon: '🌧️', rainfall: 15 },
    { day: 'Day 4', temp: 25, condition: 'Cloudy', icon: '☁️', rainfall: 5 },
    { day: 'Day 5', temp: 29, condition: 'Sunny', icon: '☀️', rainfall: 0 },
    { day: 'Day 6', temp: 31, condition: 'Hot', icon: '🌡️', rainfall: 0 },
    { day: 'Day 7', temp: 27, condition: 'Rainy', icon: '🌧️', rainfall: 20 }
  ]
};

export const generateWeatherAlerts = (weather: typeof mockWeatherData) => {
  const alerts: Array<{
    type: 'warning' | 'info' | 'critical';
    title: string;
    message: string;
    action: string;
  }> = [];

  const { current, forecast } = weather;

  // Temperature alerts
  if (current.temperature > 38) {
    alerts.push({
      type: 'critical',
      title: '🌡️ Extreme Heat Warning',
      message: 'Temperature exceeds 38°C. High risk of heat stress to crops.',
      action: 'Increase irrigation frequency, provide shade for sensitive crops, avoid pesticide application during peak heat'
    });
  } else if (current.temperature > 35) {
    alerts.push({
      type: 'warning',
      title: '☀️ High Temperature Alert',
      message: 'Temperature above 35°C. Monitor crops for heat stress.',
      action: 'Ensure adequate soil moisture, irrigate in early morning or evening'
    });
  }

  if (current.temperature < 10) {
    alerts.push({
      type: 'critical',
      title: '❄️ Frost Warning',
      message: 'Temperature below 10°C. Risk of frost damage.',
      action: 'Protect young plants, use frost covers, irrigate before temperature drops'
    });
  }

  // Rainfall alerts
  const upcomingRain = forecast.filter(f => f.rainfall > 10);
  if (upcomingRain.length > 0) {
    const totalRain = upcomingRain.reduce((sum, f) => sum + f.rainfall, 0);
    if (totalRain > 50) {
      alerts.push({
        type: 'warning',
        title: '🌧️ Heavy Rainfall Expected',
        message: `Expected ${totalRain}mm rainfall in next 7 days. Risk of waterlogging.`,
        action: 'Ensure proper drainage, postpone irrigation, apply preventive fungicide before rain'
      });
    } else {
      alerts.push({
        type: 'info',
        title: '🌦️ Rainfall Expected',
        message: `Expected ${totalRain}mm rainfall in coming days.`,
        action: 'Skip scheduled irrigation, plan field operations accordingly'
      });
    }
  }

  // Humidity alerts
  if (current.humidity > 80) {
    alerts.push({
      type: 'warning',
      title: '💧 High Humidity Alert',
      message: 'Humidity above 80%. Increased risk of fungal diseases.',
      action: 'Monitor for disease symptoms, ensure good air circulation, consider preventive fungicide'
    });
  } else if (current.humidity < 30) {
    alerts.push({
      type: 'warning',
      title: '🏜️ Low Humidity Alert',
      message: 'Humidity below 30%. Increased water stress and evaporation.',
      action: 'Increase irrigation, mulch soil to retain moisture, monitor plant water stress'
    });
  }

  // Wind alerts
  if (current.windSpeed > 40) {
    alerts.push({
      type: 'critical',
      title: '💨 Strong Wind Warning',
      message: 'Wind speed exceeds 40 km/h. Risk of crop lodging and physical damage.',
      action: 'Provide support to tall crops, avoid spraying operations, secure greenhouse structures'
    });
  }

  // Dry spell detection
  const dryDays = forecast.filter(f => f.rainfall === 0).length;
  if (dryDays >= 5) {
    alerts.push({
      type: 'info',
      title: '☀️ Dry Spell Ahead',
      message: `${dryDays} consecutive dry days expected.`,
      action: 'Plan irrigation schedule, ensure water availability, consider mulching'
    });
  }

  // General advisory
  if (alerts.length === 0) {
    alerts.push({
      type: 'info',
      title: '✅ Favorable Weather',
      message: 'Weather conditions are favorable for farming operations.',
      action: 'Good time for field activities, planting, and crop care'
    });
  }

  return alerts;
};

export const getCropSpecificWeatherAdvice = (crop: string, weather: typeof mockWeatherData) => {
  const { current } = weather;
  const advice: string[] = [];

  const cropData: { [key: string]: any } = {
    rice: {
      optimalTemp: [20, 35],
      optimalHumidity: [70, 90],
      waterNeed: 'high'
    },
    wheat: {
      optimalTemp: [12, 25],
      optimalHumidity: [50, 70],
      waterNeed: 'medium'
    },
    cotton: {
      optimalTemp: [21, 35],
      optimalHumidity: [50, 70],
      waterNeed: 'medium'
    },
    tomato: {
      optimalTemp: [18, 27],
      optimalHumidity: [60, 70],
      waterNeed: 'medium'
    },
    potato: {
      optimalTemp: [15, 25],
      optimalHumidity: [70, 80],
      waterNeed: 'medium'
    }
  };

  const data = cropData[crop.toLowerCase()] || cropData.wheat;

  // Temperature advice
  if (current.temperature < data.optimalTemp[0]) {
    advice.push(`⚠️ Temperature below optimal range for ${crop}. Growth may be slower. Consider delaying planting or using row covers.`);
  } else if (current.temperature > data.optimalTemp[1]) {
    advice.push(`⚠️ Temperature above optimal range for ${crop}. Ensure adequate irrigation and monitor for heat stress.`);
  } else {
    advice.push(`✅ Temperature is optimal for ${crop} growth.`);
  }

  // Humidity advice
  if (current.humidity < data.optimalHumidity[0]) {
    advice.push(`💧 Humidity is lower than ideal. Increase irrigation frequency and consider misting for ${crop}.`);
  } else if (current.humidity > data.optimalHumidity[1]) {
    advice.push(`⚠️ High humidity may promote diseases in ${crop}. Ensure good air circulation and monitor for fungal issues.`);
  } else {
    advice.push(`✅ Humidity levels are suitable for ${crop}.`);
  }

  return advice;
};

// Simulate weather API fetch
export const fetchWeatherData = async (location: string = 'India'): Promise<typeof mockWeatherData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate random variations
  const temp = 25 + Math.random() * 15;
  const humidity = 50 + Math.random() * 30;

  return {
    current: {
      temperature: Math.round(temp),
      humidity: Math.round(humidity),
      rainfall: Math.random() > 0.7 ? Math.round(Math.random() * 20) : 0,
      windSpeed: Math.round(8 + Math.random() * 15),
      pressure: 1010 + Math.round(Math.random() * 10),
      condition: temp > 32 ? 'Hot' : temp > 28 ? 'Sunny' : temp > 24 ? 'Partly Cloudy' : 'Cloudy',
      icon: temp > 32 ? '🌡️' : temp > 28 ? '☀️' : temp > 24 ? '⛅' : '☁️'
    },
    forecast: Array.from({ length: 7 }, (_, i) => {
      const dayTemp = temp + (Math.random() - 0.5) * 6;
      const rain = Math.random() > 0.6 ? Math.round(Math.random() * 25) : 0;
      return {
        day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `Day ${i + 1}`,
        temp: Math.round(dayTemp),
        condition: rain > 10 ? 'Rainy' : dayTemp > 30 ? 'Sunny' : dayTemp > 25 ? 'Partly Cloudy' : 'Cloudy',
        icon: rain > 10 ? '🌧️' : dayTemp > 30 ? '☀️' : dayTemp > 25 ? '⛅' : '☁️',
        rainfall: rain
      };
    })
  };
};
