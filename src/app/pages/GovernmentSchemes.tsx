import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { checkSchemeEligibility, getLandCategory } from '../utils/schemes-data';
import { VoiceButton } from '../components/VoiceButton';
import { Award, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';

export function GovernmentSchemes() {
  const [formData, setFormData] = useState({
    landSize: 2.5,
    landOwnership: true,
    age: 35,
    organicFarming: false,
    loanTaken: false
  });
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheck = () => {
    setChecking(true);
    setTimeout(() => {
      const category = getLandCategory(formData.landSize);
      const eligibility = checkSchemeEligibility({
        ...formData,
        category
      });
      setResult(eligibility);
      setChecking(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Government Schemes</h1>
        <p className="text-gray-600 mt-2">
          Check eligibility for agricultural schemes and subsidies
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="border-2 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-pink-600" />
              Farmer Profile
            </CardTitle>
            <CardDescription>
              Enter your details to check scheme eligibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="landSize">Land Size: {formData.landSize} hectares</Label>
              <Input
                id="landSize"
                type="range"
                min="0.1"
                max="50"
                step="0.1"
                value={formData.landSize}
                onChange={(e) => handleChange('landSize', Number(e.target.value))}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Category: {getLandCategory(formData.landSize)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="ownership">Land Ownership</Label>
              <Switch
                id="ownership"
                checked={formData.landOwnership}
                onCheckedChange={(v) => handleChange('landOwnership', v)}
              />
            </div>

            <div>
              <Label htmlFor="age">Age: {formData.age} years</Label>
              <Input
                id="age"
                type="range"
                min="18"
                max="80"
                value={formData.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="organic">Practicing Organic Farming</Label>
              <Switch
                id="organic"
                checked={formData.organicFarming}
                onCheckedChange={(v) => handleChange('organicFarming', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="loan">Agricultural Loan Taken</Label>
              <Switch
                id="loan"
                checked={formData.loanTaken}
                onCheckedChange={(v) => handleChange('loanTaken', v)}
              />
            </div>

            <Button
              onClick={handleCheck}
              disabled={checking}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white"
              size="lg"
            >
              {checking ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Award className="h-5 w-5 mr-2" />
                  Check Eligibility
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle>Eligibility Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-300">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
                    <p className="text-3xl font-bold text-green-600">{result.eligible.length}</p>
                    <p className="text-sm text-green-700">Eligible Schemes</p>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-300">
                    <XCircle className="h-12 w-12 mx-auto text-red-600 mb-2" />
                    <p className="text-3xl font-bold text-red-600">{result.ineligible.length}</p>
                    <p className="text-sm text-red-700">Not Eligible</p>
                  </div>
                </div>

                <div className="mt-4">
                  <VoiceButton 
                    text={`You are eligible for ${result.eligible.length} government schemes. Top scheme is ${result.eligible[0]?.name}`} 
                    hindiText={`आप ${result.eligible.length} सरकारी योजनाओं के लिए पात्र हैं। मुख्य योजना ${result.eligible[0]?.name} है।`}
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">📋 Your Profile:</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>• Land: {formData.landSize} ha ({getLandCategory(formData.landSize)} farmer)</p>
                    <p>• Age: {formData.age} years</p>
                    <p>• Land Ownership: {formData.landOwnership ? 'Yes' : 'No'}</p>
                    <p>• Organic Farming: {formData.organicFarming ? 'Yes' : 'No'}</p>
                    <p>• Loan Status: {formData.loanTaken ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Enter your details and check eligibility</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schemes List */}
      {result && (
        <Tabs defaultValue="eligible" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="eligible">
              Eligible Schemes ({result.eligible.length})
            </TabsTrigger>
            <TabsTrigger value="ineligible">
              Not Eligible ({result.ineligible.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="eligible">
            <div className="space-y-4">
              {result.eligible.map((scheme: any, i: number) => (
                <Card key={i} className="border-2 border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-green-900">{scheme.name}</CardTitle>
                        <CardDescription className="text-green-700 mt-1">
                          {scheme.description}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {scheme.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-white rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-1">💰 Benefits:</h4>
                      <p className="text-sm text-green-800">{scheme.benefits}</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-1">✅ Eligibility:</h4>
                      <p className="text-sm text-green-700">{scheme.reason}</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-1">📄 Required Documents:</h4>
                      <p className="text-sm text-green-800">{scheme.documents.join(', ')}</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-1">📝 How to Apply:</h4>
                      <p className="text-sm text-green-800">{scheme.howToApply}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ineligible">
            <div className="space-y-4">
              {result.ineligible.map((scheme: any, i: number) => (
                <Card key={i} className="border-2 border-gray-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-gray-900">{scheme.name}</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                          {scheme.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{scheme.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-1">❌ Reason for Ineligibility:</h4>
                      <p className="text-sm text-red-800">{scheme.reason}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">💰 Benefits:</h4>
                      <p className="text-sm text-gray-700">{scheme.benefits}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Info */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-purple-800">ℹ️ Important Information</CardTitle>
        </CardHeader>
        <CardContent className="text-purple-900 space-y-2 text-sm">
          <p>• Schemes and eligibility criteria are updated regularly by the government</p>
          <p>• Some schemes may have additional state-specific requirements</p>
          <p>• Application deadlines vary by scheme - check official portals for dates</p>
          <p>• Keep all required documents ready before applying</p>
          <p>• For detailed information, visit official government agriculture portals</p>
        </CardContent>
      </Card>
    </div>
  );
}
