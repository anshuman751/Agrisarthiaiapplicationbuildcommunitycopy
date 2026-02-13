import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { calculateIrrigationNeeds, getIrrigationSchedule } from '../utils/irrigation-utils';
import { VoiceButton } from '../components/VoiceButton';
import { Droplets, Loader2, AlertTriangle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';

export function IrrigationSystem() {
  const [formData, setFormData] = useState({
    crop: 'wheat',
    soilMoisture: 45,
    temperature: 28,
    humidity: 60,
    rainfall: 0,
    cropStage: 'vegetative',
    soilType: 'loamy'
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const irrigation = calculateIrrigationNeeds(formData);
      const stageSchedule = getIrrigationSchedule(formData.crop, formData.soilType, 'current');
      setResult({
        ...irrigation,
        stageSchedule
      });
      setAnalyzing(false);
    }, 1500);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Irrigation System</h1>
        <p className="text-gray-600 mt-2">
          Optimize water usage with intelligent irrigation scheduling
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="border-2 border-cyan-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-cyan-600" />
              Field Parameters
            </CardTitle>
            <CardDescription>
              Enter current field and weather conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="crop">Crop Type</Label>
              <Select value={formData.crop} onValueChange={(v) => handleChange('crop', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="tomato">Tomato</SelectItem>
                  <SelectItem value="potato">Potato</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="sugarcane">Sugarcane</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cropStage">Crop Growth Stage</Label>
              <Select value={formData.cropStage} onValueChange={(v) => handleChange('cropStage', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="germination">Germination</SelectItem>
                  <SelectItem value="vegetative">Vegetative</SelectItem>
                  <SelectItem value="flowering">Flowering/Fruiting</SelectItem>
                  <SelectItem value="maturity">Maturity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="soilType">Soil Type</Label>
              <Select value={formData.soilType} onValueChange={(v) => handleChange('soilType', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loamy">Loamy</SelectItem>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="silt loam">Silt Loam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="moisture">Soil Moisture: {formData.soilMoisture}%</Label>
              <Input
                id="moisture"
                type="range"
                min="0"
                max="100"
                value={formData.soilMoisture}
                onChange={(e) => handleChange('soilMoisture', Number(e.target.value))}
                className="mt-2"
              />
              <div className="mt-2">
                <Progress value={formData.soilMoisture} className="h-2" />
              </div>
            </div>

            <div>
              <Label htmlFor="temperature">Temperature: {formData.temperature}°C</Label>
              <Input
                id="temperature"
                type="range"
                min="0"
                max="50"
                value={formData.temperature}
                onChange={(e) => handleChange('temperature', Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="humidity">Humidity: {formData.humidity}%</Label>
              <Input
                id="humidity"
                type="range"
                min="0"
                max="100"
                value={formData.humidity}
                onChange={(e) => handleChange('humidity', Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="rainfall">Recent Rainfall: {formData.rainfall} mm</Label>
              <Input
                id="rainfall"
                type="range"
                min="0"
                max="100"
                value={formData.rainfall}
                onChange={(e) => handleChange('rainfall', Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
              size="lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Droplets className="h-5 w-5 mr-2" />
                  Calculate Irrigation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Irrigation Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Status */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-300">
                  {result.irrigationRequired ? (
                    <>
                      <Droplets className="h-16 w-16 mx-auto text-blue-600 mb-3" />
                      <h3 className="text-2xl font-bold text-blue-900 mb-2">
                        Irrigation Required
                      </h3>
                      <Badge className={getUrgencyColor(result.urgency)}>
                        {result.urgency} Priority
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-16 w-16 mx-auto text-green-600 mb-3" />
                      <h3 className="text-2xl font-bold text-green-900 mb-2">
                        No Irrigation Needed
                      </h3>
                      <Badge className="bg-green-100 text-green-800">
                        Adequate Moisture
                      </Badge>
                    </>
                  )}
                  
                  <div className="mt-4">
                    <VoiceButton 
                      text={`${result.schedule}. ${result.irrigationRequired ? `Apply ${result.waterAmount} mm of water.` : ''}`} 
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">Soil Moisture</p>
                    <p className="text-2xl font-bold text-blue-900">{result.soilMoistureStatus}</p>
                  </div>
                  <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <p className="text-sm text-cyan-700 mb-1">Water Amount</p>
                    <p className="text-2xl font-bold text-cyan-900">{result.waterAmount} mm</p>
                  </div>
                </div>

                {/* Schedule */}
                <Alert className="bg-indigo-50 border-indigo-300">
                  <AlertDescription>
                    <h4 className="font-semibold text-indigo-900 mb-2">📅 Schedule:</h4>
                    <p className="text-indigo-800">{result.schedule}</p>
                  </AlertDescription>
                </Alert>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">💡 Recommendations:</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Crop-Specific Schedule */}
                {result.stageSchedule && (
                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-purple-800">Irrigation Schedule by Stage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(result.stageSchedule).map(([stage, info]: [string, any]) => (
                          <div key={stage} className="p-3 bg-white rounded-lg border">
                            <h5 className="font-semibold capitalize text-purple-900">{stage}</h5>
                            <p className="text-sm text-gray-700">
                              <strong>Frequency:</strong> {info.frequency}
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Amount:</strong> {info.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Droplets className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Enter field conditions to get irrigation recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-green-800">🌊 Water Conservation Tips</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-green-900">
          <div>
            <h4 className="font-semibold mb-1">Drip Irrigation</h4>
            <p className="text-sm">Save 30-70% water compared to flood irrigation</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Mulching</h4>
            <p className="text-sm">Reduces water evaporation by 50-70%</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Right Timing</h4>
            <p className="text-sm">Irrigate early morning or evening to minimize loss</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
