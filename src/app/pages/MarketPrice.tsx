import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { cropMarketPrices, getMarketRecommendations, getNearbyMarkets, getFuturePricePrediction } from '../utils/market-data';
import { VoiceButton } from '../components/VoiceButton';
import { DollarSign, TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function MarketPrice() {
  const [prices, setPrices] = useState(cropMarketPrices);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState(cropMarketPrices[0]);
  const [prediction, setPrediction] = useState<any[]>([]);

  useEffect(() => {
    const recs = getMarketRecommendations(prices);
    setRecommendations(recs);
    const nearbyMarkets = getNearbyMarkets();
    setMarkets(nearbyMarkets);
  }, []);

  const handleCropSelect = (crop: any) => {
    setSelectedCrop(crop);
    const pred = getFuturePricePrediction(crop.crop, crop.currentPrice, crop.trend);
    setPrediction(pred);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Market Prices & Trends</h1>
        <p className="text-gray-600 mt-2">
          Live market prices and intelligent selling recommendations
        </p>
      </div>

      {/* Price Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prices.map((crop, i) => (
          <Card 
            key={i} 
            className={`cursor-pointer transition-all hover:shadow-xl ${
              selectedCrop.crop === crop.crop ? 'border-2 border-green-500 shadow-lg' : 'border'
            }`}
            onClick={() => handleCropSelect(crop)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{crop.crop}</CardTitle>
                {getTrendIcon(crop.trend)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{crop.currentPrice}
                  </p>
                  <p className="text-sm text-gray-600">per {crop.unit}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${getTrendColor(crop.trend)}`}>
                    {crop.change > 0 ? '+' : ''}{crop.change}%
                  </span>
                  <Badge className={
                    crop.marketDemand === 'high' ? 'bg-green-100 text-green-800' :
                    crop.marketDemand === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {crop.marketDemand} demand
                  </Badge>
                </div>

                {crop.msp > 0 && (
                  <div className="text-xs text-gray-600">
                    MSP: ₹{crop.msp}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Crop Details */}
      <Tabs defaultValue="trend" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trend">Price Trend</TabsTrigger>
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
          <TabsTrigger value="markets">Nearby Markets</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedCrop.crop} - Price History</span>
                <VoiceButton 
                  text={`Current price of ${selectedCrop.crop} is rupees ${selectedCrop.currentPrice} per quintal with a ${selectedCrop.trend}ward trend of ${Math.abs(selectedCrop.change)} percent`} 
                />
              </CardTitle>
              <CardDescription>
                6-month price movement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedCrop.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Price (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction">
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle>Future Price Prediction</CardTitle>
              <CardDescription>
                AI-based price forecast for next 3 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prediction.length > 0 && (
                <div className="space-y-4">
                  {prediction.map((pred, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div>
                        <p className="font-semibold text-purple-900">{pred.month}</p>
                        <p className="text-sm text-purple-700">Confidence: {pred.confidence}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-900">
                          ₹{pred.predictedPrice}
                        </p>
                        <p className="text-sm text-purple-600">
                          {((pred.predictedPrice - selectedCrop.currentPrice) / selectedCrop.currentPrice * 100).toFixed(1)}% change
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Predictions are based on historical trends and current market conditions. 
                  Actual prices may vary due to weather, policy changes, and market dynamics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markets">
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Nearby Markets & Mandis
              </CardTitle>
              <CardDescription>
                Find the best place to sell your crops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {markets.map((market, i) => (
                  <div key={i} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-green-900">{market.name}</h4>
                        <p className="text-sm text-green-700">{market.type}</p>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {market.distance}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-green-800 mb-1">
                        <strong>Facilities:</strong> {market.facilities.join(', ')}
                      </p>
                      <p className="text-sm text-green-700">
                        <strong>Contact:</strong> {market.contact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="border-2 border-amber-200">
          <CardHeader>
            <CardTitle>💡 Market Recommendations</CardTitle>
            <CardDescription>
              Smart selling suggestions based on current market conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border ${
                    rec.type === 'sell' ? 'bg-green-50 border-green-200' :
                    rec.type === 'hold' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Badge className={
                      rec.type === 'sell' ? 'bg-green-600 text-white' :
                      rec.type === 'hold' ? 'bg-yellow-600 text-white' :
                      'bg-blue-600 text-white'
                    }>
                      {rec.type.toUpperCase()}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{rec.crop}</p>
                      <p className="text-sm text-gray-700">{rec.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-indigo-800">📊 Market Intelligence</CardTitle>
        </CardHeader>
        <CardContent className="text-indigo-900">
          <ul className="space-y-2 text-sm">
            <li>• <strong>MSP (Minimum Support Price):</strong> Government-guaranteed minimum price for select crops</li>
            <li>• <strong>Market Demand:</strong> Current buyer interest and procurement levels</li>
            <li>• <strong>Price Trends:</strong> Historical data showing price movements over time</li>
            <li>• <strong>eNAM:</strong> Electronic National Agriculture Market for transparent online trading</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
