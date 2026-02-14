const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Check if OpenWeather API is configured
const isWeatherAPIConfigured = () => {
  return API_KEY && API_KEY !== 'your_openweather_api_key_here' && API_KEY.length > 10;
};

export const WEATHER_API_ENABLED = isWeatherAPIConfigured();

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  cityName: string;
  pressure: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  clouds: number;
  visibility: number;
}

export interface ForecastDay {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pop: number; // Probability of precipitation
}

// Demo weather data generator
function generateDemoWeather(city: string): WeatherData {
  const baseTemp = 25 + Math.floor(Math.random() * 15);
  return {
    temp: baseTemp,
    humidity: 60 + Math.floor(Math.random() * 30),
    windSpeed: 10 + Math.floor(Math.random() * 20),
    description: ['clear sky', 'partly cloudy', 'light rain', 'sunny'][Math.floor(Math.random() * 4)],
    icon: 'https://openweathermap.org/img/wn/01d@4x.png',
    cityName: city,
    pressure: 1010 + Math.floor(Math.random() * 20),
    feelsLike: baseTemp + Math.floor(Math.random() * 5) - 2,
    tempMin: baseTemp - 3,
    tempMax: baseTemp + 5,
    clouds: Math.floor(Math.random() * 100),
    visibility: 8 + Math.random() * 2,
  };
}

function generateDemoForecast(city: string): ForecastDay[] {
  const forecast: ForecastDay[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const baseTemp = 22 + Math.floor(Math.random() * 18);
    
    forecast.push({
      date: date.toDateString(),
      temp: baseTemp,
      tempMin: baseTemp - 4,
      tempMax: baseTemp + 6,
      description: ['clear sky', 'partly cloudy', 'light rain', 'sunny', 'overcast'][Math.floor(Math.random() * 5)],
      icon: 'https://openweathermap.org/img/wn/01d@2x.png',
      humidity: 55 + Math.floor(Math.random() * 35),
      windSpeed: 8 + Math.floor(Math.random() * 25),
      pop: Math.floor(Math.random() * 100),
    });
  }
  
  return forecast;
}

export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  if (!isWeatherAPIConfigured()) {
    console.warn('⚠️ OpenWeather API not configured. Using demo weather data.');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateDemoWeather(city);
  }

  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found');
    } else if (response.status === 401) {
      console.warn('Invalid OpenWeather API key. Falling back to demo mode.');
      return generateDemoWeather(city);
    } else {
      throw new Error('Failed to fetch weather data');
    }
  }

  const data = await response.json();

  return {
    temp: Math.round(data.main.temp),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
    cityName: data.name,
    pressure: data.main.pressure,
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    clouds: data.clouds.all,
    visibility: data.visibility / 1000, // Convert to km
  };
}

export async function fetch5DayForecast(city: string): Promise<ForecastDay[]> {
  if (!isWeatherAPIConfigured()) {
    console.warn('⚠️ OpenWeather API not configured. Using demo forecast data.');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateDemoForecast(city);
  }

  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found');
    } else if (response.status === 401) {
      console.warn('Invalid OpenWeather API key. Falling back to demo mode.');
      return generateDemoForecast(city);
    } else {
      throw new Error('Failed to fetch forecast data');
    }
  }

  const data = await response.json();

  // Group forecasts by day (take one reading per day at 12:00)
  const dailyForecasts: ForecastDay[] = [];
  const processedDates = new Set<string>();

  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateString = date.toDateString();
    
    // Take the noon forecast for each day
    if (!processedDates.has(dateString) && date.getHours() >= 11 && date.getHours() <= 13) {
      processedDates.add(dateString);
      dailyForecasts.push({
        date: dateString,
        temp: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        description: item.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6),
        pop: Math.round(item.pop * 100), // Probability of precipitation as percentage
      });
    }
  });

  return dailyForecasts.slice(0, 7);
}

export function generateWeatherAlerts(weather: WeatherData): Array<{
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  action: string;
}> {
  const alerts = [];

  // High temperature alert
  if (weather.temp > 40) {
    alerts.push({
      type: 'critical' as const,
      title: '🔥 Extreme Heat Warning',
      message: `Temperature is ${weather.temp}°C, which is dangerously high for crops.`,
      action: 'Increase irrigation frequency and consider shade nets for sensitive crops.',
    });
  } else if (weather.temp > 35) {
    alerts.push({
      type: 'warning' as const,
      title: '☀️ High Temperature Alert',
      message: `Temperature is ${weather.temp}°C. Heat stress possible for crops.`,
      action: 'Monitor soil moisture and ensure adequate irrigation.',
    });
  }

  // Low temperature alert
  if (weather.temp < 5) {
    alerts.push({
      type: 'critical' as const,
      title: '❄️ Frost Warning',
      message: `Temperature is ${weather.temp}°C. Risk of frost damage.`,
      action: 'Cover sensitive crops and use frost protection measures.',
    });
  }

  // Rain/storm alert based on description
  if (weather.description.includes('rain') || weather.description.includes('drizzle')) {
    alerts.push({
      type: 'info' as const,
      title: '🌧️ Rain Alert',
      message: `${weather.description} detected. Good for crops but monitor drainage.`,
      action: 'Ensure proper drainage and avoid irrigation today.',
    });
  }

  if (weather.description.includes('storm') || weather.description.includes('thunder')) {
    alerts.push({
      type: 'warning' as const,
      title: '⛈️ Storm Warning',
      message: 'Thunderstorm conditions detected.',
      action: 'Secure equipment, avoid field operations, and protect sensitive crops.',
    });
  }

  // Fog alert
  if (weather.description.includes('fog') || weather.description.includes('mist')) {
    alerts.push({
      type: 'info' as const,
      title: '🌫️ Fog Alert',
      message: 'Low visibility conditions due to fog.',
      action: 'Delay spraying operations and be cautious during field work.',
    });
  }

  // High wind alert
  if (weather.windSpeed > 40) {
    alerts.push({
      type: 'warning' as const,
      title: '💨 High Wind Warning',
      message: `Wind speed is ${weather.windSpeed} km/h.`,
      action: 'Postpone spraying, secure structures, and support tall crops.',
    });
  }

  // Low humidity
  if (weather.humidity < 30) {
    alerts.push({
      type: 'info' as const,
      title: '💧 Low Humidity Alert',
      message: `Humidity is ${weather.humidity}%. Dry conditions.`,
      action: 'Increase irrigation and monitor crop water stress.',
    });
  }

  // High humidity
  if (weather.humidity > 85) {
    alerts.push({
      type: 'info' as const,
      title: '💧 High Humidity Alert',
      message: `Humidity is ${weather.humidity}%. Risk of fungal diseases.`,
      action: 'Monitor for disease symptoms and ensure good air circulation.',
    });
  }

  // Default message if no alerts
  if (alerts.length === 0) {
    alerts.push({
      type: 'info' as const,
      title: '✅ Favorable Conditions',
      message: 'Weather conditions are favorable for farming activities.',
      action: 'Continue normal operations and monitor for any changes.',
    });
  }

  return alerts;
}