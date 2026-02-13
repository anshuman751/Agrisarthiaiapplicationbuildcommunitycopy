import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { storage } from '../utils/storage';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { VoiceButton } from '../components/VoiceButton';

export function CropMonitoring() {
  const [history, setHistory] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const data = storage.getDiseaseHistory();
    setHistory(data);

    if (data.length >= 2) {
      analyzeProgress(data);
    }
  }, []);

  const analyzeProgress = (data: any[]) => {
    const recent = data[0];
    const previous = data[1];

    const healthScore = recent.disease === 'Healthy' ? 95 : 
                       recent.severity === 'low' ? 70 :
                       recent.severity === 'medium' ? 50 : 30;

    const previousScore = previous.disease === 'Healthy' ? 95 :
                         previous.severity === 'low' ? 70 :
                         previous.severity === 'medium' ? 50 : 30;

    const improvement = healthScore - previousScore;
    const trend = improvement > 5 ? 'improving' : improvement < -5 ? 'declining' : 'stable';

    setInsights({
      currentHealth: healthScore,
      previousHealth: previousScore,
      improvement,
      trend,
      daysMonitored: data.length,
      recommendations: getRecommendations(trend, recent)
    });
  };

  const getRecommendations = (trend: string, recent: any) => {
    if (trend === 'improving') {
      return [
        'Continue current treatment plan',
        'Monitor for complete recovery in 7 days',
        'Maintain optimal irrigation and fertilization'
      ];
    } else if (trend === 'declining') {
      return [
        '⚠️ Immediate action required',
        'Increase treatment intensity',
        'Consult agricultural expert if condition worsens',
        'Check soil health and drainage'
      ];
    } else {
      return [
        'Maintain current care routine',
        'Continue monitoring every 3-5 days',
        'Ensure preventive measures are in place'
      ];
    }
  };

  const chartData = history.slice(0, 10).reverse().map((item, index) => ({
    name: `Day ${index + 1}`,
    confidence: item.confidence,
    health: item.disease === 'Healthy' ? 95 : 
            item.severity === 'low' ? 70 :
            item.severity === 'medium' ? 50 : 30
  }));

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Continuous Crop Monitoring</h1>
        <p className="text-gray-600 mt-2">
          Track crop health over time and get improvement insights
        </p>
      </div>

      {insights && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Current Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{insights.currentHealth}%</p>
              <div className="mt-2 flex items-center gap-2">
                {insights.trend === 'improving' && (
                  <Badge className="bg-green-100 text-green-800">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Improving
                  </Badge>
                )}
                {insights.trend === 'declining' && (
                  <Badge className="bg-red-100 text-red-800">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Declining
                  </Badge>
                )}
                {insights.trend === 'stable' && (
                  <Badge className="bg-gray-100 text-gray-800">
                    <Minus className="h-3 w-3 mr-1" />
                    Stable
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold ${insights.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {insights.improvement > 0 ? '+' : ''}{insights.improvement}%
              </p>
              <p className="text-sm text-gray-600 mt-2">Since last check</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">Monitoring Days</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-600">{insights.daysMonitored}</p>
              <p className="text-sm text-gray-600 mt-2">Records saved</p>
            </CardContent>
          </Card>
        </div>
      )}

      {chartData.length > 1 && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              Health Trend Analysis
            </CardTitle>
            <CardDescription>
              Crop health score over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="health" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Health Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  name="Confidence"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {insights && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle>📋 Recommendations</CardTitle>
            <div className="mt-2">
              <VoiceButton text={`Crop health is ${insights.trend}. ${insights.recommendations.join('. ')}`} />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* History Log */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle>Detection History</CardTitle>
          <CardDescription>
            Past detections and monitoring records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt="Crop" 
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{item.disease}</h4>
                      <Badge className={
                        item.severity === 'high' ? 'bg-red-100 text-red-800' :
                        item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        item.severity === 'low' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {item.severity || 'healthy'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.crop} • Confidence: {item.confidence}%</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(item.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No monitoring data yet. Start by detecting crop diseases to build your monitoring history.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
