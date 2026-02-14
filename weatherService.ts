const API_KEY = '04643319c4a04e99a8f222443261302';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Check if WeatherAPI is configured
const isWeatherAPIConfigured = () => {
  return API_KEY && API_KEY.length > 10;
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

// Demo weather data generator (fallback)
function generateDemoWeather(city: string): WeatherData {
  const baseTemp = 25 + Math.floor(Math.random() * 15);
  return {
    temp: baseTemp,
    humidity: 60 + Math.floor(Math.random() * 30),
    windSpeed: 10 + Math.floor(Math.random() * 20),
    description: ['clear sky', 'partly cloudy', 'light rain', 'sunny'][Math.floor(Math.random() * 4)],
    icon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
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
      icon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
      humidity: 55 + Math.floor(Math.random() * 35),
      windSpeed: 8 + Math.floor(Math.random() * 25),
      pop: Math.floor(Math.random() * 100),
    });
  }
  
  return forecast;
}

// Get user's current location using browser geolocation API
export async function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

// Fetch weather by coordinates (user's location)
export async function fetchWeatherByLocation(): Promise<WeatherData> {
  if (!isWeatherAPIConfigured()) {
    console.warn('⚠️ WeatherAPI not configured. Using demo weather data.');
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateDemoWeather('Your Location');
  }

  try {
    const location = await getUserLocation();
    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${location.lat},${location.lon}&aqi=no`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Invalid WeatherAPI key. Falling back to demo mode.');
        return generateDemoWeather('Your Location');
      } else {
        throw new Error('Failed to fetch weather data');
      }
    }

    const data = await response.json();

    return {
      temp: Math.round(data.current.temp_c),
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph),
      description: data.current.condition.text,
      icon: `https:${data.current.condition.icon}`,
      cityName: `${data.location.name}, ${data.location.region}`,
      pressure: data.current.pressure_mb,
      feelsLike: Math.round(data.current.feelslike_c),
      tempMin: Math.round(data.current.temp_c - 2), // WeatherAPI doesn't provide min/max for current
      tempMax: Math.round(data.current.temp_c + 2),
      clouds: data.current.cloud,
      visibility: data.current.vis_km,
    };
  } catch (error) {
    console.error('Error fetching weather by location:', error);
    throw error;
  }
}

// Fetch current weather by city name (kept for backward compatibility)
export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  if (!isWeatherAPIConfigured()) {
    console.warn('⚠️ WeatherAPI not configured. Using demo weather data.');
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateDemoWeather(city);
  }

  const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('City not found');
    } else if (response.status === 401) {
      console.warn('Invalid WeatherAPI key. Falling back to demo mode.');
      return generateDemoWeather(city);
    } else {
      throw new Error('Failed to fetch weather data');
    }
  }

  const data = await response.json();

  return {
    temp: Math.round(data.current.temp_c),
    humidity: data.current.humidity,
    windSpeed: Math.round(data.current.wind_kph),
    description: data.current.condition.text,
    icon: `https:${data.current.condition.icon}`,
    cityName: `${data.location.name}, ${data.location.region}`,
    pressure: data.current.pressure_mb,
    feelsLike: Math.round(data.current.feelslike_c),
    tempMin: Math.round(data.current.temp_c - 2),
    tempMax: Math.round(data.current.temp_c + 2),
    clouds: data.current.cloud,
    visibility: data.current.vis_km,
  };
}

// Fetch 7-day forecast by user's location
export async function fetch7DayForecastByLocation(): Promise<ForecastDay[]> {
  if (!isWeatherAPIConfigured()) {
    console.warn('⚠️ WeatherAPI not configured. Using demo forecast data.');
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateDemoForecast('Your Location');
  }

  try {
    const location = await getUserLocation();
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location.lat},${location.lon}&days=7&aqi=no`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Invalid WeatherAPI key. Falling back to demo mode.');
        return generateDemoForecast('Your Location');
      } else {
        throw new Error('Failed to fetch forecast data');
      }
    }

    const data = await response.json();

    return data.forecast.forecastday.map((day: any) => ({
      date: new Date(day.date).toDateString(),
      temp: Math.round(day.day.avgtemp_c),
      tempMin: Math.round(day.day.mintemp_c),
      tempMax: Math.round(day.day.maxtemp_c),
      description: day.day.condition.text,
      icon: `https:${day.day.condition.icon}`,
      humidity: day.day.avghumidity,
      windSpeed: Math.round(day.day.maxwind_kph),
      pop: day.day.daily_chance_of_rain,
    }));
  } catch (error) {
    console.error('Error fetching forecast by location:', error);
    throw error;
  }
}

// Fetch forecast by city name (kept for backward compatibility)
export async function fetch5DayForecast(city: string): Promise<ForecastDay[]> {
  if (!isWeatherAPIConfigured()) {
    console.warn('⚠️ WeatherAPI not configured. Using demo forecast data.');
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateDemoForecast(city);
  }

  const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('City not found');
    } else if (response.status === 401) {
      console.warn('Invalid WeatherAPI key. Falling back to demo mode.');
      return generateDemoForecast(city);
    } else {
      throw new Error('Failed to fetch forecast data');
    }
  }

  const data = await response.json();

  return data.forecast.forecastday.map((day: any) => ({
    date: new Date(day.date).toDateString(),
    temp: Math.round(day.day.avgtemp_c),
    tempMin: Math.round(day.day.mintemp_c),
    tempMax: Math.round(day.day.maxtemp_c),
    description: day.day.condition.text,
    icon: `https:${day.day.condition.icon}`,
    humidity: day.day.avghumidity,
    windSpeed: Math.round(day.day.maxwind_kph),
    pop: day.day.daily_chance_of_rain,
  }));
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
  if (weather.description.toLowerCase().includes('rain') || weather.description.toLowerCase().includes('drizzle')) {
    alerts.push({
      type: 'info' as const,
      title: '🌧️ Rain Alert',
      message: `${weather.description} detected. Good for crops but monitor drainage.`,
      action: 'Ensure proper drainage and avoid irrigation today.',
    });
  }

  if (weather.description.toLowerCase().includes('storm') || weather.description.toLowerCase().includes('thunder')) {
    alerts.push({
      type: 'warning' as const,
      title: '⛈️ Storm Warning',
      message: 'Thunderstorm conditions detected.',
      action: 'Secure equipment, avoid field operations, and protect sensitive crops.',
    });
  }

  // Fog alert
  if (weather.description.toLowerCase().includes('fog') || weather.description.toLowerCase().includes('mist')) {
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
