import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { calculateSoilFertility, getSoilImprovements, getNaturalFertilizerRecommendations } from '../utils/soil-utils';
import { VoiceButton } from '../components/VoiceButton';
import { Beaker, Loader2 } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function SoilIntelligence() {
  const [formData, setFormData] = useState({
    N: 70,
    P: 45,
    K: 50,
    pH: 6.5,
    organicMatter: 3.5,
    moisture: 50
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const fertility = calculateSoilFertility(formData);
      const improvements = getSoilImprovements(formData);
      
      const deficientNutrients: string[] = [];
      if (formData.N < 60) deficientNutrients.push('N');
      if (formData.P < 40) deficientNutrients.push('P');
      if (formData.K < 40) deficientNutrients.push('K');
      
      const fertilizers = getNaturalFertilizerRecommendations(
        deficientNutrients.length > 0 ? deficientNutrients : ['general']
      );

      setResult({
        ...fertility,
        improvements,
        fertilizers
      });
      setAnalyzing(false);
    }, 1500);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Excellent': return 'bg-green-600';
      case 'Good': return 'bg-blue-600';
      case 'Fair': return 'bg-yellow-600';
      default: return 'bg-red-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Soil Intelligence</h1>
        <p className="text-gray-600 mt-2">
          Analyze soil health and get personalized fertilizer recommendations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="border-2 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-amber-600" />
              Soil Test Parameters
            </CardTitle>
            <CardDescription>
              Enter soil test results from laboratory or field testing kit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <p className="text-xs text-gray-500 mt-1">
                {formData.N < 60 ? 'Low' : formData.N < 100 ? 'Medium' : 'High'}
              </p>
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
              <p className="text-xs text-gray-500 mt-1">
                {formData.P < 40 ? 'Low' : formData.P < 80 ? 'Medium' : 'High'}
              </p>
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
              <p className="text-xs text-gray-500 mt-1">
                {formData.K < 40 ? 'Low' : formData.K < 80 ? 'Medium' : 'High'}
              </p>
            </div>

            <div>
              <Label htmlFor="pH">Soil pH: {formData.pH}</Label>
              <Input
                id="pH"
                type="range"
                min="4"
                max="9"
                step="0.1"
                value={formData.pH}
                onChange={(e) => handleChange('pH', Number(e.target.value))}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.pH < 5.5 ? 'Acidic' : formData.pH < 7.5 ? 'Neutral' : 'Alkaline'}
              </p>
            </div>

            <div>
              <Label htmlFor="organic">Organic Matter: {formData.organicMatter}%</Label>
              <Input
                id="organic"
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={formData.organicMatter}
                onChange={(e) => handleChange('organicMatter', Number(e.target.value))}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.organicMatter < 2 ? 'Low' : formData.organicMatter < 5 ? 'Medium' : 'High'}
              </p>
            </div>

            <div>
              <Label htmlFor="moisture">Soil Moisture: {formData.moisture}%</Label>
              <Input
                id="moisture"
                type="range"
                min="0"
                max="100"
                value={formData.moisture}
                onChange={(e) => handleChange('moisture', Number(e.target.value))}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.moisture < 30 ? 'Dry' : formData.moisture < 70 ? 'Optimal' : 'Wet'}
              </p>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white"
              size="lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Beaker className="h-5 w-5 mr-2" />
                  Analyze Soil Health
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Comprehensive soil health report
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                  <p className="text-sm text-gray-600 mb-2">Soil Fertility Score</p>
                  <p className="text-5xl font-bold text-green-600 mb-2">{result.score}%</p>
                  <Badge className={`${getGradeColor(result.grade)} text-white text-lg px-4 py-1`}>
                    {result.grade}
                  </Badge>
                  <div className="mt-4">
                    <VoiceButton 
                      text={`Your soil fertility score is ${result.score}% which is ${result.grade}. ${result.improvements[0]}`} 
                    />
                  </div>
                </div>

                {/* Component Scores */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Nutrient Levels:</h4>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Nitrogen (N)</span>
                      <span className="font-medium">{result.components.nitrogen}%</span>
                    </div>
                    <Progress value={result.components.nitrogen} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Phosphorus (P)</span>
                      <span className="font-medium">{result.components.phosphorus}%</span>
                    </div>
                    <Progress value={result.components.phosphorus} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Potassium (K)</span>
                      <span className="font-medium">{result.components.potassium}%</span>
                    </div>
                    <Progress value={result.components.potassium} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>pH Balance</span>
                      <span className="font-medium">{result.components.pH}%</span>
                    </div>
                    <Progress value={result.components.pH} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Organic Matter</span>
                      <span className="font-medium">{result.components.organicMatter}%</span>
                    </div>
                    <Progress value={result.components.organicMatter} className="h-2" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Beaker className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Enter soil parameters and analyze</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {result && (
        <Tabs defaultValue="improvements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="improvements">Improvements</TabsTrigger>
            <TabsTrigger value="fertilizers">Natural Fertilizers</TabsTrigger>
          </TabsList>

          <TabsContent value="improvements">
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle>🔧 Soil Improvement Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.improvements.map((improvement: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 font-bold mt-0.5">{i + 1}.</span>
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fertilizers">
            <div className="space-y-4">
              {result.fertilizers.map((category: any, i: number) => (
                <Card key={i} className="border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.options.map((option: any, j: number) => (
                        <div key={j} className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-2">
                            🌿 {option.fertilizer}
                          </h4>
                          <p className="text-sm text-green-800 mb-1">
                            <strong>Application:</strong> {option.application}
                          </p>
                          <p className="text-sm text-green-700">
                            <strong>Benefits:</strong> {option.benefits}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
