import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Camera, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { detectCropDisease } from '../utils/ai-models';
import { storage } from '../utils/storage';
import { VoiceButton } from '../components/VoiceButton';
import { Badge } from '../components/ui/badge';

export function CropDisease() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState('tomato');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) return;

    setAnalyzing(true);

    // Load image and analyze
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Resize image to standard size
      canvas.width = 224;
      canvas.height = 224;
      ctx.drawImage(img, 0, 0, 224, 224);

      // Get image data
      const imageData = ctx.getImageData(0, 0, 224, 224);

      // Simulate AI processing delay
      setTimeout(() => {
        const detection = detectCropDisease(imageData, cropType);
        
        // Save to history
        storage.saveDiseaseDetection({
          crop: cropType,
          ...detection,
          image: selectedImage
        });

        setResult(detection);
        setAnalyzing(false);
      }, 2000);
    };

    img.src = selectedImage;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Crop Disease Detection</h1>
        <p className="text-gray-600 mt-2">
          Upload a crop image for AI-powered disease identification and treatment recommendations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-green-600" />
              Upload Crop Image
            </CardTitle>
            <CardDescription>
              Take a clear photo of affected leaves or plant parts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="crop-type">Select Crop Type</Label>
              <Select value={cropType} onValueChange={setCropType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tomato">Tomato</SelectItem>
                  <SelectItem value="potato">Potato</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="corn">Corn/Maize</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
              {selectedImage ? (
                <div className="space-y-4">
                  <img 
                    src={selectedImage} 
                    alt="Selected crop" 
                    className="max-h-64 mx-auto rounded-lg shadow-lg"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-16 w-16 text-green-400 mx-auto" />
                  <div>
                    <p className="text-gray-700 font-medium mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Image
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <Button
              onClick={analyzeImage}
              disabled={!selectedImage || analyzing}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              size="lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Analyze Disease
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
              Detection Results
            </CardTitle>
            <CardDescription>
              AI-powered analysis with treatment recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Disease Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {result.disease}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Confidence: {result.confidence}%
                      </p>
                    </div>
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.severity === 'none' ? 'Healthy' : `${result.severity} severity`}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <VoiceButton 
                      text={`Disease detected: ${result.disease}. ${result.solution}`} 
                      hindiText={`रोग की पहचान हुई: ${result.disease}। समाधान: ${result.solution}`}
                    />
                  </div>
                </div>

                {/* Symptoms */}
                {result.symptoms && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Symptoms:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {result.symptoms.map((symptom: string, i: number) => (
                        <li key={i} className="text-sm">{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Solution */}
                <Alert className="bg-blue-50 border-blue-300">
                  <AlertDescription>
                    <h4 className="font-semibold text-blue-900 mb-2">💊 Treatment Solution:</h4>
                    <p className="text-blue-800">{result.solution}</p>
                  </AlertDescription>
                </Alert>

                {/* Prevention */}
                <Alert className="bg-green-50 border-green-300">
                  <AlertDescription>
                    <h4 className="font-semibold text-green-900 mb-2">🛡️ Prevention Measures:</h4>
                    <p className="text-green-800">{result.prevention}</p>
                  </AlertDescription>
                </Alert>

                {/* Next Steps */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">📋 Next Steps:</h4>
                  <ul className="space-y-1 text-sm text-purple-800">
                    <li>✓ Save this result for monitoring</li>
                    <li>✓ Apply recommended treatment immediately</li>
                    <li>✓ Monitor crop for improvement after 7 days</li>
                    <li>✓ Check irrigation and fertilization schedule</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Camera className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Upload and analyze an image to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-amber-800">📸 Tips for Better Results</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Good Lighting</h4>
            <p className="text-sm text-amber-800">Take photos in natural daylight for best accuracy</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Focus on Symptoms</h4>
            <p className="text-sm text-amber-800">Capture affected areas clearly and up close</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Clean Background</h4>
            <p className="text-sm text-amber-800">Avoid cluttered backgrounds for better detection</p>
          </div>
        </CardContent>
      </Card>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
