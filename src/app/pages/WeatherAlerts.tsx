import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { fetchWeatherData, generateWeatherAlerts, getCropSpecificWeatherAdvice } from '../utils/weather-utils';
import { VoiceButton } from '../components/VoiceButton';
import { Cloud, RefreshCw, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';

export function WeatherAlerts() {
  const [weather, setWeather] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [cropAdvice, setCropAdvice] = useState<string[]>([]);

  useEffect(() => {
    loadWeather();
  }, []);

  useEffect(() => {
    if (weather) {
      const advice = getCropSpecificWeatherAdvice(selectedCrop, weather);
      setCropAdvice(advice);
    }
  }, [selectedCrop, weather]);

  const loadWeather = async () => {
    setLoading(true);
    const data = await fetchWeatherData();
    setWeather(data);
    const generatedAlerts = generateWeatherAlerts(data);
    setAlerts(generatedAlerts);
    setLoading(false);
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
                Updated just now • {weather.current.location || 'Local Field'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="text-8xl drop-shadow-md filter">{weather.current.icon}</div>
                  <div>
                    <div className="text-6xl font-bold tracking-tighter">{weather.current.temperature}°</div>
                    <div className="text-xl font-medium opacity-90">{weather.current.condition}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                    <p className="text-blue-100 text-sm mb-1">Humidity</p>
                    <p className="text-2xl font-bold">{weather.current.humidity}%</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                    <p className="text-blue-100 text-sm mb-1">Wind Speed</p>
                    <p className="text-2xl font-bold">{weather.current.windSpeed} km/h</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                    <p className="text-blue-100 text-sm mb-1">Rainfall</p>
                    <p className="text-2xl font-bold">{weather.current.rainfall} mm</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                    <p className="text-blue-100 text-sm mb-1">Pressure</p>
                    <p className="text-2xl font-bold">1012 hPa</p>
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
                {weather.forecast.map((day: any, i: number) => (
                  <div key={i} className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                    <p className="font-semibold text-gray-600 mb-2">{day.day}</p>
                    <div className="text-4xl mb-3 transform hover:scale-110 transition-transform duration-200 cursor-default" title={day.condition}>
                      {day.icon}
                    </div>
                    <p className="text-xl font-bold text-gray-900">{day.temp}°</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{day.condition}</p>
                    {day.rainfall > 0 && (
                      <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                        {day.rainfall}mm
                      </Badge>
                    )}
                  </div>
                ))}
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

          {/* Crop-Specific Advice */}
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle>🌾 Crop-Specific Weather Advice</CardTitle>
              <CardDescription>
                Tailored recommendations based on weather and crop type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Your Crop</Label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="tomato">Tomato</SelectItem>
                    <SelectItem value="potato">Potato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {cropAdvice.map((advice, i) => (
                  <div key={i} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-900">{advice}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
