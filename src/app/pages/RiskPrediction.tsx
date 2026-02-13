import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { predictCropRisk } from '../utils/ai-models';
import { VoiceButton } from '../components/VoiceButton';
import { AlertTriangle, Loader2, Shield } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export function RiskPrediction() {
  const [formData, setFormData] = useState({
    soilHealth: 75,
    weatherRisk: 30,
    pestIncidence: 20,
    irrigationQuality: 80,
    cropAge: 45
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const prediction = predictCropRisk(formData);
      setResult(prediction);
      setAnalyzing(false);
    }, 1500);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-600 text-white';
      case 'Medium': return 'bg-yellow-600 text-white';
      default: return 'bg-green-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Crop Risk Prediction</h1>
        <p className="text-gray-600 mt-2">
          AI-powered risk assessment using logistic regression
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Risk Factors
            </CardTitle>
            <CardDescription>
              Assess various risk parameters affecting your crops
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Soil Health Score: {formData.soilHealth}%</Label>
              <Input
                type="range"
                min="0"
                max="100"
                value={formData.soilHealth}
                onChange={(e) => handleChange('soilHealth', Number(e.target.value))}
                className="mt-2"
              />
              <Progress value={formData.soilHealth} className="mt-2 h-2" />
            </div>

            <div>
              <Label>Weather Risk Level: {formData.weatherRisk}%</Label>
              <Input
                type="range"
                min="0"
                max="100"
                value={formData.weatherRisk}
                onChange={(e) => handleChange('weatherRisk', Number(e.target.value))}
                className="mt-2"
              />
              <Progress value={formData.weatherRisk} className="mt-2 h-2" />
            </div>

            <div>
              <Label>Pest Incidence: {formData.pestIncidence}%</Label>
              <Input
                type="range"
                min="0"
                max="100"
                value={formData.pestIncidence}
                onChange={(e) => handleChange('pestIncidence', Number(e.target.value))}
                className="mt-2"
              />
              <Progress value={formData.pestIncidence} className="mt-2 h-2" />
            </div>

            <div>
              <Label>Irrigation Quality: {formData.irrigationQuality}%</Label>
              <Input
                type="range"
                min="0"
                max="100"
                value={formData.irrigationQuality}
                onChange={(e) => handleChange('irrigationQuality', Number(e.target.value))}
                className="mt-2"
              />
              <Progress value={formData.irrigationQuality} className="mt-2 h-2" />
            </div>

            <div>
              <Label>Crop Age: {formData.cropAge} days</Label>
              <Input
                type="range"
                min="0"
                max="150"
                value={formData.cropAge}
                onChange={(e) => handleChange('cropAge', Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handlePredict}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white"
              size="lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Predict Risk
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-300">
                  <Shield className="h-16 w-16 mx-auto mb-3 text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {result.riskLevel} Risk
                  </h3>
                  <Badge className={`${getRiskColor(result.riskLevel)} text-lg px-4 py-2`}>
                    Score: {result.riskScore}/100
                  </Badge>
                  <div className="mt-4">
                    <VoiceButton 
                      text={`Your crop has ${result.riskLevel} risk with a score of ${result.riskScore}. ${result.recommendations[0]}`} 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Risk Factors Breakdown:</h4>
                  {Object.entries(result.factors).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1 capitalize">
                        <span>{key}</span>
                        <span className="font-medium">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">📋 Recommendations:</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-900">
                    <strong>AI Model:</strong> Logistic Regression<br />
                    <strong>Confidence:</strong> {Math.round(result.confidence)}%<br />
                    <strong>Last Updated:</strong> {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Enter risk parameters to get prediction</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
