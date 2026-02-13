import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { estimateYield } from '../utils/ai-models';
import { VoiceButton } from '../components/VoiceButton';
import { TrendingUp, Loader2, DollarSign } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function YieldEstimation() {
  const [formData, setFormData] = useState({
    crop: 'wheat',
    landArea: 5,
    soilQuality: 75,
    irrigationScore: 80,
    fertilizationScore: 70,
    weatherScore: 85
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEstimate = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const estimation = estimateYield(formData);
      setResult(estimation);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Yield & Profit Estimation</h1>
        <p className="text-gray-600 mt-2">
          Predict crop yield and calculate expected profits using AI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Farm Parameters
            </CardTitle>
            <CardDescription>
              Enter field conditions for accurate yield prediction
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
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="sugarcane">Sugarcane</SelectItem>
                  <SelectItem value="tomato">Tomato</SelectItem>
                  <SelectItem value="potato">Potato</SelectItem>
                  <SelectItem value="onion">Onion</SelectItem>
                  <SelectItem value="groundnut">Groundnut</SelectItem>
                  <SelectItem value="soybean">Soybean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="landArea">Land Area: {formData.landArea} hectares</Label>
              <Input
                id="landArea"
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={formData.landArea}
                onChange={(e) => handleChange('landArea', Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="soilQuality">Soil Quality Score: {formData.soilQuality}%</Label>
              <Input
                id="soilQuality"
                type="range"
                min="0"
                max="100"
                value={formData.soilQuality}
                onChange={(e) => handleChange('soilQuality', Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="irrigation">Irrigation Score: {formData.irrigationScore}%</Label>
              <Input
                id="irrigation"
                type="range"
                min="0"
                max="100"
                value={formData.irrigationScore}
                onChange={(e) => handleChange('irrigationScore', Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="fertilization">Fertilization Score: {formData.fertilizationScore}%</Label>
              <Input
                id="fertilization"
                type="range"
                min="0"
                max="100"
                value={formData.fertilizationScore}
                onChange={(e) => handleChange('fertilizationScore', Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="weather">Weather Conditions Score: {formData.weatherScore}%</Label>
              <Input
                id="weather"
                type="range"
                min="0"
                max="100"
                value={formData.weatherScore}
                onChange={(e) => handleChange('weatherScore', Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handleEstimate}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white"
              size="lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Estimate Yield
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle>Estimation Results</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                  <TrendingUp className="h-16 w-16 mx-auto text-green-600 mb-3" />
                  <h3 className="text-lg text-gray-600 mb-1">Estimated Yield</h3>
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {result.estimatedYield} {result.unit}
                  </p>
                  <Badge className="bg-green-600 text-white">
                    Confidence: {result.confidence}%
                  </Badge>
                  <div className="mt-4">
                    <VoiceButton 
                      text={`Estimated yield is ${result.estimatedYield} quintals. Expected profit is rupees ${result.profit.toLocaleString('en-IN')}`} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">Market Price</p>
                    <p className="text-2xl font-bold text-blue-900">
                      ₹{result.pricePerQuintal.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-blue-600">per quintal</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-900">
                      ₹{result.revenue.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-green-600">expected</p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-700 mb-1">Total Cost</p>
                    <p className="text-2xl font-bold text-orange-900">
                      ₹{result.cost.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-orange-600">estimated</p>
                  </div>

                  <div className={`p-4 rounded-lg border ${result.profit > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <p className={`text-sm mb-1 ${result.profit > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      Net Profit
                    </p>
                    <p className={`text-2xl font-bold ${result.profit > 0 ? 'text-emerald-900' : 'text-red-900'}`}>
                      ₹{result.profit.toLocaleString('en-IN')}
                    </p>
                    <p className={`text-xs ${result.profit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {result.profit > 0 ? 'expected' : 'loss'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">📊 Financial Summary:</h4>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div className="flex justify-between">
                      <span>Land Area:</span>
                      <span className="font-medium">{formData.landArea} hectares</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yield per Hectare:</span>
                      <span className="font-medium">
                        {Math.round((result.estimatedYield / formData.landArea) * 10) / 10} quintals
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue per Hectare:</span>
                      <span className="font-medium">
                        ₹{Math.round(result.revenue / formData.landArea).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit Margin:</span>
                      <span className="font-medium">
                        {Math.round((result.profit / result.revenue) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Recommendations:</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Monitor market prices regularly for best selling time</li>
                    <li>• Consider crop insurance to protect against losses</li>
                    <li>• Maintain optimal farming practices to achieve predicted yield</li>
                    <li>• Explore value-added processing for higher profits</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Enter farm parameters to estimate yield and profit</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-indigo-800">🤖 AI Linear Regression Model</CardTitle>
        </CardHeader>
        <CardContent className="text-indigo-900">
          <p className="mb-2">
            Our yield estimation uses <strong>Linear Regression</strong> algorithm trained on historical 
            agricultural data to predict crop yields based on multiple factors.
          </p>
          <p className="text-sm">
            <strong>Factors considered:</strong> Soil quality, irrigation efficiency, fertilization, 
            weather conditions, land area, and crop-specific growth patterns.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
