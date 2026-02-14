import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { fetchCurrentWeather, fetch5DayForecast, generateWeatherAlerts } from '../../services/weatherService';
import { VoiceButton } from '../components/VoiceButton';
import { Cloud, RefreshCw, AlertTriangle, Info, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function WeatherAlerts() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('Delhi');
  const [inputCity, setInputCity] = useState('Delhi');

  useEffect(() => {
    loadWeather();
  }, [city]);

  const loadWeather = async () => {
    setLoading(true);
    try {
      const weatherData = await fetchCurrentWeather(city);
      const forecastData = await fetch5DayForecast(city);
      
      setWeather(weatherData);
      setForecast(forecastData);
      
      const generatedAlerts = generateWeatherAlerts(weatherData);
      setAlerts(generatedAlerts);
      
      toast.success(`Weather loaded for ${weatherData.cityName}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch weather data');
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-300 bg-red-50';
      case 'warning': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-blue-300 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weather Alerts & Forecast</h1>
          <p className="text-gray-600 mt-2">
            Real-time weather monitoring and farming advisories
          </p>
        </div>
        <Button onClick={loadWeather} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* City Search */}
      <Card className="border-emerald-200">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="city" className="mb-2 block">Search City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="city"
                  value={inputCity}
                  onChange={(e) => setInputCity(e.target.value)}
                  placeholder="Enter city name (e.g., Mumbai, Pune, Delhi)"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {weather && (
        <>
          {/* Current Weather */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-900 opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
            
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="flex items-center gap-2 text-white text-xl">
                <Cloud className="h-6 w-6" />
                Current Conditions
              </CardTitle>
              <CardDescription className="text-blue-100">
                Updated just now • {weather.cityName || 'Local Field'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <img src={weather.icon} alt={weather.description} className="w-32 h-32 drop-shadow-md" />
                  <div>
                    <div className="text-6xl font-bold tracking-tighter">{weather.temp}°</div>
                    <div className="text-xl font-medium opacity-90 capitalize">{weather.description}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                    <p className="text-blue-100 text-sm mb-1">Humidity</p>
                    <p className="text-2xl font-bold">{weather.humidity}%</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                    <p className="text-blue-100 text-sm mb-1">Wind Speed</p>
                    <p className="text-2xl font-bold">{weather.windSpeed} km/h</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                    <p className="text-blue-100 text-sm mb-1">Feels Like</p>
                    <p className="text-2xl font-bold">{weather.feelsLike}°C</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                    <p className="text-blue-100 text-sm mb-1">Pressure</p>
                    <p className="text-2xl font-bold">{weather.pressure} hPa</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>7-Day Forecast</CardTitle>
              <CardDescription>
                Weekly weather prediction for planning farming activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {forecast.map((day: any, i: number) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return (
                    <div key={i} className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                      <p className="font-semibold text-gray-600 mb-2">{dayName}</p>
                      <img src={day.icon} alt={day.description} className="w-16 h-16 mb-3" />
                      <p className="text-xl font-bold text-gray-900">{day.temp}°</p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{day.description}</p>
                      {day.pop > 0 && (
                        <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                          {day.pop}% rain
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">⚠️ Weather Alerts</h2>
            {alerts.map((alert, i) => (
              <Alert key={i} className={`border-2 ${getAlertColor(alert.type)}`}>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{alert.title}</h3>
                    <p className="text-gray-700 mb-2">{alert.message}</p>
                    <p className="text-sm font-medium text-gray-900">
                      <strong>Action:</strong> {alert.action}
                    </p>
                    <div className="mt-3">
                      <VoiceButton 
                        text={`${alert.title}. ${alert.message}. ${alert.action}`} 
                        hindiText={`${alert.title}. ${alert.message}. ${alert.action}`}
                      />
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>

          {/* Tips */}
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-amber-800">☀️ Weather-Based Farming Tips</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-amber-900">
              <div>
                <h4 className="font-semibold mb-1">Before Rain</h4>
                <p className="text-sm">Apply fungicides, complete spraying operations, ensure drainage</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Hot Weather</h4>
                <p className="text-sm">Increase irrigation, mulch soil, avoid midday field work</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Windy Conditions</h4>
                <p className="text-sm">Postpone spraying, secure structures, support tall crops</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}