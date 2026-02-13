import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { recommendCrop } from '../utils/ai-models';
import { VoiceButton } from '../components/VoiceButton';
import { Sprout, Loader2, CheckCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';

export function CropRecommendation() {
  const [formData, setFormData] = useState({
    N: 80,
    P: 50,
    K: 45,
    temperature: 25,
    humidity: 65,
    ph: 6.5,
    rainfall: 100
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecommend = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const recommendation = recommendCrop(formData);
      setResult(recommendation);
      setAnalyzing(false);
    }, 1500);
  };

  const getCropIcon = (crop: string) => {
    const icons: { [key: string]: string } = {
      rice: '🌾',
      wheat: '🌾',
      cotton: '🌸',
      maize: '🌽',
      sugarcane: '🎋',
      tomato: '🍅',
      potato: '🥔',
      onion: '🧅',
      groundnut: '🥜',
      soybean: '🌱'
    };
    return icons[crop.toLowerCase()] || '🌱';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Crop Recommendation</h1>
        <p className="text-gray-600 mt-2">
          Get intelligent crop suggestions based on soil nutrients and weather conditions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-green-600" />
              Soil & Weather Parameters
            </CardTitle>
            <CardDescription>
              Enter your field conditions for personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Soil Nutrients */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Soil Nutrients (kg/ha)</h3>
              
              <div>
                <Label htmlFor="N">Nitrogen (N): {formData.N} kg/ha</Label>
                <Input
                  id="N"
                  type="range"
                  min="0"
                  max="150"
                  value={formData.N}
                  onChange={(e) => handleChange('N', Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="P">Phosphorus (P): {formData.P} kg/ha</Label>
                <Input
                  id="P"
                  type="range"
                  min="0"
                  max="150"
                  value={formData.P}
                  onChange={(e) => handleChange('P', Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="K">Potassium (K): {formData.K} kg/ha</Label>
                <Input
                  id="K"
                  type="range"
                  min="0"
                  max="150"
                  value={formData.K}
                  onChange={(e) => handleChange('K', Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="ph">Soil pH: {formData.ph}</Label>
                <Input
                  id="ph"
                  type="range"
                  min="4"
                  max="9"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => handleChange('ph', Number(e.target.value))}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Weather Conditions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Weather Conditions</h3>
              
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
                <Label htmlFor="rainfall">Rainfall: {formData.rainfall} mm</Label>
                <Input
                  id="rainfall"
                  type="range"
                  min="0"
                  max="300"
                  value={formData.rainfall}
                  onChange={(e) => handleChange('rainfall', Number(e.target.value))}
                  className="mt-2"
                />
              </div>
            </div>

            <Button
              onClick={handleRecommend}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              size="lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sprout className="h-5 w-5 mr-2" />
                  Get Recommendation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Recommendation Results
            </CardTitle>
            <CardDescription>
              AI-powered crop suggestions for your field
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Best Crop */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-5xl">{getCropIcon(result.recommendedCrop)}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-green-800 capitalize">
                        {result.recommendedCrop}
                      </h3>
                      <p className="text-sm text-green-700">Best Recommended Crop</p>
                    </div>
                    <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                      {result.confidence}%
                    </Badge>
                  </div>
                  
                  <div className="mt-4">
                    <VoiceButton 
                      text={`The best recommended crop for your field is ${result.recommendedCrop} with ${result.confidence}% confidence based on your soil and weather conditions.`} 
                    />
                  </div>
                </div>

                {/* Alternative Crops */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Alternative Crops:</h4>
                  <div className="space-y-2">
                    {result.alternatives.map((alt: any, i: number) => (
                      <div 
                        key={i} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getCropIcon(alt.crop)}</span>
                          <span className="font-medium capitalize">{alt.crop}</span>
                        </div>
                        <Badge variant="outline">
                          {alt.confidence}% match
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <Alert className="bg-blue-50 border-blue-300">
                  <AlertDescription>
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Farming Tips:</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Prepare soil 2-3 weeks before sowing</li>
                      <li>• Use certified seeds for better yield</li>
                      <li>• Follow recommended fertilizer schedule</li>
                      <li>• Ensure proper irrigation based on crop stage</li>
                      <li>• Monitor for pests and diseases regularly</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* Conditions Summary */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-amber-800 font-medium">Soil NPK</p>
                    <p className="text-amber-900">{formData.N}:{formData.P}:{formData.K}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">pH Level</p>
                    <p className="text-blue-900">{formData.ph}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-800 font-medium">Temperature</p>
                    <p className="text-orange-900">{formData.temperature}°C</p>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                    <p className="text-cyan-800 font-medium">Rainfall</p>
                    <p className="text-cyan-900">{formData.rainfall} mm</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Sprout className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Enter your field conditions and click "Get Recommendation"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-purple-800">🤖 How AI Recommendation Works</CardTitle>
        </CardHeader>
        <CardContent className="text-purple-900">
          <p className="mb-3">
            Our AI model uses <strong>Random Forest algorithm</strong> to analyze your soil nutrients, 
            pH levels, and weather conditions. It compares them against optimal requirements for 10+ crops 
            and suggests the best match.
          </p>
          <p className="text-sm">
            <strong>Accuracy:</strong> 90%+ based on thousands of agricultural data points
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
