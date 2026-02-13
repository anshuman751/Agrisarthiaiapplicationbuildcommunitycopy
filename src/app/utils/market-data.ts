// Market Price Data and Trends

export const cropMarketPrices = [
  {
    crop: 'Rice',
    currentPrice: 2100,
    unit: 'quintal',
    change: +5.2,
    trend: 'up',
    msp: 2060,
    marketDemand: 'high',
    priceHistory: [
      { month: 'Jan', price: 1980 },
      { month: 'Feb', price: 2020 },
      { month: 'Mar', price: 2050 },
      { month: 'Apr', price: 2080 },
      { month: 'May', price: 2100 },
      { month: 'Jun', price: 2100 }
    ]
  },
  {
    crop: 'Wheat',
    currentPrice: 2000,
    unit: 'quintal',
    change: +3.8,
    trend: 'up',
    msp: 2015,
    marketDemand: 'high',
    priceHistory: [
      { month: 'Jan', price: 1850 },
      { month: 'Feb', price: 1900 },
      { month: 'Mar', price: 1950 },
      { month: 'Apr', price: 1980 },
      { month: 'May', price: 1990 },
      { month: 'Jun', price: 2000 }
    ]
  },
  {
    crop: 'Cotton',
    currentPrice: 5500,
    unit: 'quintal',
    change: -2.1,
    trend: 'down',
    msp: 5726,
    marketDemand: 'medium',
    priceHistory: [
      { month: 'Jan', price: 5800 },
      { month: 'Feb', price: 5750 },
      { month: 'Mar', price: 5700 },
      { month: 'Apr', price: 5650 },
      { month: 'May', price: 5550 },
      { month: 'Jun', price: 5500 }
    ]
  },
  {
    crop: 'Maize',
    currentPrice: 1800,
    unit: 'quintal',
    change: +1.5,
    trend: 'stable',
    msp: 1870,
    marketDemand: 'medium',
    priceHistory: [
      { month: 'Jan', price: 1750 },
      { month: 'Feb', price: 1760 },
      { month: 'Mar', price: 1780 },
      { month: 'Apr', price: 1790 },
      { month: 'May', price: 1795 },
      { month: 'Jun', price: 1800 }
    ]
  },
  {
    crop: 'Sugarcane',
    currentPrice: 300,
    unit: 'quintal',
    change: +0.5,
    trend: 'stable',
    msp: 315,
    marketDemand: 'high',
    priceHistory: [
      { month: 'Jan', price: 295 },
      { month: 'Feb', price: 296 },
      { month: 'Mar', price: 298 },
      { month: 'Apr', price: 299 },
      { month: 'May', price: 299 },
      { month: 'Jun', price: 300 }
    ]
  },
  {
    crop: 'Tomato',
    currentPrice: 1500,
    unit: 'quintal',
    change: +15.3,
    trend: 'up',
    msp: 0,
    marketDemand: 'high',
    priceHistory: [
      { month: 'Jan', price: 800 },
      { month: 'Feb', price: 900 },
      { month: 'Mar', price: 1100 },
      { month: 'Apr', price: 1250 },
      { month: 'May', price: 1400 },
      { month: 'Jun', price: 1500 }
    ]
  },
  {
    crop: 'Potato',
    currentPrice: 1200,
    unit: 'quintal',
    change: -8.2,
    trend: 'down',
    msp: 0,
    marketDemand: 'medium',
    priceHistory: [
      { month: 'Jan', price: 1500 },
      { month: 'Feb', price: 1450 },
      { month: 'Mar', price: 1350 },
      { month: 'Apr', price: 1300 },
      { month: 'May', price: 1250 },
      { month: 'Jun', price: 1200 }
    ]
  },
  {
    crop: 'Onion',
    currentPrice: 1800,
    unit: 'quintal',
    change: +12.5,
    trend: 'up',
    msp: 0,
    marketDemand: 'high',
    priceHistory: [
      { month: 'Jan', price: 1200 },
      { month: 'Feb', price: 1300 },
      { month: 'Mar', price: 1450 },
      { month: 'Apr', price: 1600 },
      { month: 'May', price: 1700 },
      { month: 'Jun', price: 1800 }
    ]
  },
  {
    crop: 'Groundnut',
    currentPrice: 5000,
    unit: 'quintal',
    change: +2.8,
    trend: 'up',
    msp: 5550,
    marketDemand: 'medium',
    priceHistory: [
      { month: 'Jan', price: 4800 },
      { month: 'Feb', price: 4850 },
      { month: 'Mar', price: 4900 },
      { month: 'Apr', price: 4950 },
      { month: 'May', price: 4980 },
      { month: 'Jun', price: 5000 }
    ]
  },
  {
    crop: 'Soybean',
    currentPrice: 3800,
    unit: 'quintal',
    change: +1.2,
    trend: 'stable',
    msp: 3950,
    marketDemand: 'medium',
    priceHistory: [
      { month: 'Jan', price: 3700 },
      { month: 'Feb', price: 3720 },
      { month: 'Mar', price: 3750 },
      { month: 'Apr', price: 3770 },
      { month: 'May', price: 3790 },
      { month: 'Jun', price: 3800 }
    ]
  }
];

export const getMarketRecommendations = (cropPrices: typeof cropMarketPrices) => {
  const recommendations: Array<{
    type: 'sell' | 'hold' | 'buy';
    crop: string;
    reason: string;
  }> = [];

  cropPrices.forEach(crop => {
    if (crop.change > 10) {
      recommendations.push({
        type: 'sell',
        crop: crop.crop,
        reason: `Strong price increase (+${crop.change}%). Good selling opportunity.`
      });
    } else if (crop.change < -5) {
      recommendations.push({
        type: 'hold',
        crop: crop.crop,
        reason: `Price declining (-${Math.abs(crop.change)}%). Consider holding for better rates.`
      });
    } else if (crop.currentPrice < crop.msp && crop.msp > 0) {
      recommendations.push({
        type: 'hold',
        crop: crop.crop,
        reason: `Current price below MSP. Sell at government procurement centers.`
      });
    } else if (crop.marketDemand === 'high' && crop.trend === 'up') {
      recommendations.push({
        type: 'sell',
        crop: crop.crop,
        reason: `High market demand with upward trend. Favorable selling conditions.`
      });
    }
  });

  return recommendations;
};

export const getNearbyMarkets = (location: string = 'India') => {
  // Mock nearby markets data
  return [
    {
      name: 'District Agricultural Market',
      distance: '5 km',
      type: 'Mandi',
      facilities: ['Weighing', 'Storage', 'Transport'],
      contact: '1800-XXX-XXXX'
    },
    {
      name: 'Cooperative Society Market',
      distance: '8 km',
      type: 'Cooperative',
      facilities: ['Direct Purchase', 'MSP Guarantee'],
      contact: '1800-XXX-XXXX'
    },
    {
      name: 'eNAM Center',
      distance: '12 km',
      type: 'Electronic Trading',
      facilities: ['Online Trading', 'Quality Testing', 'Payment Guarantee'],
      contact: '1800-270-0224'
    },
    {
      name: 'Private Procurement Center',
      distance: '15 km',
      type: 'Private',
      facilities: ['Immediate Payment', 'Transport Facility'],
      contact: 'Contact Local Agent'
    }
  ];
};

export const getFuturePricePrediction = (crop: string, currentPrice: number, trend: string) => {
  // Simple price prediction based on trend
  const predictions = [];
  let price = currentPrice;

  for (let i = 1; i <= 3; i++) {
    if (trend === 'up') {
      price = price * (1 + (0.02 + Math.random() * 0.03));
    } else if (trend === 'down') {
      price = price * (1 - (0.02 + Math.random() * 0.03));
    } else {
      price = price * (1 + (Math.random() - 0.5) * 0.02);
    }

    predictions.push({
      month: `Month ${i}`,
      predictedPrice: Math.round(price),
      confidence: Math.round(85 - i * 10)
    });
  }

  return predictions;
};
