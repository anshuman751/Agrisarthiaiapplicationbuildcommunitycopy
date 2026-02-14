const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_TOKEN || import.meta.env.VITE_HF_TOKEN;
const MODEL = 'google/flan-t5-large';
const API_URL = `https://api-inference.huggingface.co/models/${MODEL}`;

// Check if HuggingFace is configured
const isHFConfigured = () => {
  return HF_TOKEN && HF_TOKEN !== 'your_huggingface_token_here' && HF_TOKEN.length > 10;
};

// Demo responses for when API is not configured
const demoResponses: Record<string, { en: string; hi: string }> = {
  crop: {
    en: 'For better crop yield, ensure proper soil nutrition, adequate watering, and pest control. Consider crop rotation to maintain soil health. Wheat, Rice, and Maize are good options for this season depending on your region.',
    hi: 'बेहतर फसल उपज के लिए, उचित मिट्टी पोषण, पर्याप्त पानी और कीट नियंत्रण सुनिश्चित करें। मिट्टी के स्वास्थ्य को बनाए रखने के लिए फसल चक्र पर विचार करें। आपके क्षेत्र के आधार पर इस मौसम के लिए गेहूं, चावल और मक्का अच्छे विकल्प हैं।'
  },
  weather: {
    en: 'Monitor weather forecasts regularly and plan your farming activities accordingly. Protect crops during extreme weather conditions like heavy rain or drought by using proper drainage or irrigation.',
    hi: 'मौसम का पूर्वानुमान नियमित रूप से देखें और अपनी खेती की गतिविधियों की तदनुसार योजना बनाएं। भारी बारिश या सूखे जैसी चरम मौसम की स्थिति के दौरान उचित जल निकासी या सिंचाई का उपयोग करके फसलों की रक्षा करें।'
  },
  disease: {
    en: 'Early detection is key to disease management. Look for yellowing leaves, spots, or stunted growth. Use disease-resistant varieties and maintain proper field hygiene to prevent disease spread.',
    hi: 'रोग प्रबंधन के लिए शीघ्र पता लगाना महत्वपूर्ण है। पीली पत्तियां, धब्बे या रुक-रुक कर हो रहे विकास को देखें। रोग-प्रतिरोधी किस्मों का उपयोग करें और रोग के प्रसार को रोकने के लिए उचित खेत स्वच्छता बनाए रखें।'
  },
  soil: {
    en: 'Healthy soil is the foundation of good farming. Test your soil NPK levels regularly. Add organic matter like compost or manure to improve soil structure and fertility.',
    hi: 'स्वस्थ मिट्टी अच्छी खेती की नींव है। नियमित रूप से अपनी मिट्टी के NPK स्तर का परीक्षण करें। मिट्टी की संरचना और उर्वरता में सुधार के लिए खाद या गोबर जैसी जैविक सामग्री डालें।'
  },
  irrigation: {
    en: 'Drip irrigation is highly efficient and saves water. Ensure you water crops early in the morning or late evening to reduce evaporation.',
    hi: 'ड्रिप सिंचाई अत्यधिक कुशल है और पानी बचाती है। वाष्पीकरण को कम करने के लिए सुनिश्चित करें कि आप फसलों को सुबह जल्दी या देर शाम को पानी दें।'
  },
  market: {
    en: 'Check local mandi prices before selling. Prices fluctuate based on demand and supply. Consider storing non-perishable crops if prices are currently low.',
    hi: 'बेचने से पहले स्थानीय मंडी की कीमतों की जाँच करें। मांग और आपूर्ति के आधार पर कीमतों में उतार-चढ़ाव होता है। यदि कीमतें वर्तमान में कम हैं तो गैर-नाशवान फसलों को संग्रहीत करने पर विचार करें।'
  },
  scheme: {
    en: 'There are several government schemes like PM-KISAN, Soil Health Card, and PM Fasal Bima Yojana. Visit your local agriculture office or our Schemes section for eligibility details.',
    hi: 'पीएम-किसान, मृदा स्वास्थ्य कार्ड और पीएम फसल बीमा योजना जैसी कई सरकारी योजनाएं हैं। पात्रता विवरण के लिए अपने स्थानीय कृषि कार्यालय या हमारे योजना अनुभाग पर जाएं।'
  },
  pest: {
    en: 'Integrated Pest Management (IPM) is best. Use biological controls like ladybugs or neem oil before resorting to chemical pesticides. Rotate crops to break pest cycles.',
    hi: 'एकीकृत कीट प्रबंधन (IPM) सबसे अच्छा है। रासायनिक कीटनाशकों का सहारा लेने से पहले लेडीबग्स या नीम के तेल जैसे जैविक नियंत्रणों का उपयोग करें। कीट चक्र को तोड़ने के लिए फसलों को घुमाएं।'
  },
  organic: {
    en: 'Organic farming improves long-term soil health. Use vermicompost, bio-fertilizers, and green manure. Certification can help you get better prices in the market.',
    hi: 'जैविक खेती दीर्घकालिक मिट्टी के स्वास्थ्य में सुधार करती है। वर्मीकम्पोस्ट, जैव-उर्वरक और हरी खाद का उपयोग करें। प्रमाणीकरण आपको बाजार में बेहतर कीमतें प्राप्त करने में मदद कर सकता है।'
  },
  hello: {
    en: 'Hello! I am your AgriSarthi assistant. I can help you with crops, weather, market prices, and farming advice. What would you like to know?',
    hi: 'नमस्ते! मैं आपका एग्रीसारथी सहायक हूँ। मैं फसलों, मौसम, बाजार की कीमतों और खेती की सलाह के साथ आपकी मदद कर सकता हूं। आप क्या जानना चाहेंगे?'
  },
  thanks: {
    en: 'You are welcome! Happy farming! Let me know if you have any other questions.',
    hi: 'आपका स्वागत है! खुशहाल खेती! अगर आपके कोई अन्य सवाल हैं तो मुझे बताएं।'
  },
  price: {
    en: 'Market prices change daily. Please check the Market Prices section of this app for the latest real-time rates in your local mandi.',
    hi: 'बाजार की कीमतें रोजाना बदलती हैं। अपनी स्थानीय मंडी में नवीनतम वास्तविक समय की दरों के लिए कृपया इस ऐप के बाजार मूल्य अनुभाग की जांच करें।'
  },
  fertilizer: {
    en: 'Use fertilizers based on soil test reports. Balanced use of Nitrogen, Phosphorus, and Potassium (NPK) prevents soil degradation and saves money.',
    hi: 'मिट्टी परीक्षण रिपोर्ट के आधार पर उर्वरकों का उपयोग करें। नाइट्रोजन, फास्फोरस और पोटेशियम (NPK) का संतुलित उपयोग मिट्टी के क्षरण को रोकता है और पैसा बचाता है।'
  },
  seed: {
    en: 'Always use treated, high-quality seeds from certified sources. High yielding varieties (HYV) can significantly increase your production.',
    hi: 'हमेशा प्रमाणित स्रोतों से उपचारित, उच्च गुणवत्ता वाले बीजों का उपयोग करें। उच्च उपज देने वाली किस्में (HYV) आपके उत्पादन को काफी बढ़ा सकती हैं।'
  },
  weed: {
    en: 'Remove weeds early before they compete with your crop for nutrients. Mulching is an effective way to suppress weed growth naturally.',
    hi: 'खरपतवारों को जल्दी हटा दें इससे पहले कि वे पोषक तत्वों के लिए आपकी फसल के साथ प्रतिस्पर्धा करें। मल्चिंग प्राकृतिक रूप से खरपतवार के विकास को दबाने का एक प्रभावी तरीका है।'
  },
  loan: {
    en: 'Kisan Credit Card (KCC) offers low-interest loans for farmers. Contact your nearest bank branch for details on crop loans and subsidies.',
    hi: 'किसान क्रेडिट कार्ड (KCC) किसानों के लिए कम ब्याज वाले ऋण प्रदान करता है। फसल ऋण और सब्सिडी पर विवरण के लिए अपनी निकटतम बैंक शाखा से संपर्क करें।'
  },
  storage: {
    en: 'Proper storage prevents post-harvest losses. Use hermetic bags or silos for grains. Keep the storage area dry, cool, and free from rodents.',
    hi: 'उचित भंडारण फसल कटाई के बाद के नुकसान को रोकता है। अनाज के लिए हर्मेटिक बैग या साइलो का उपयोग करें। भंडारण क्षेत्र को सूखा, ठंडा और कृन्तकों से मुक्त रखें।'
  },
  cow: {
    en: 'For dairy farming, ensure cattle are vaccinated and fed a balanced diet of green fodder and concentrates. Hygiene is crucial for milk quality.',
    hi: 'डेरी फार्मिंग के लिए, सुनिश्चित करें कि मवेशियों को टीका लगाया गया है और उन्हें हरे चारे और सांद्रण का संतुलित आहार खिलाया गया है। दूध की गुणवत्ता के लिए स्वच्छता महत्वपूर्ण है।'
  },
  default: {
    en: 'I can help you with agricultural advice on crops, weather, soil, diseases, irrigation, market prices, and government schemes. Please ask a specific question.',
    hi: 'मैं फसलों, मौसम, मिट्टी, बीमारियों, सिंचाई, बाजार की कीमतों और सरकारी योजनाओं पर कृषि सलाह के साथ आपकी मदद कर सकता हूं। कृपया एक विशिष्ट प्रश्न पूछें।'
  }
};

function getDemoResponse(message: string, language: 'en' | 'hi'): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('फसल') || lowerMessage.includes('पौधा')) {
    return demoResponses.crop[language];
  } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('sun') || lowerMessage.includes('मौसम') || lowerMessage.includes('बारिश')) {
    return demoResponses.weather[language];
  } else if (lowerMessage.includes('disease') || lowerMessage.includes('fungus') || lowerMessage.includes('virus') || lowerMessage.includes('रोग') || lowerMessage.includes('बीमारी')) {
    return demoResponses.disease[language];
  } else if (lowerMessage.includes('soil') || lowerMessage.includes('land') || lowerMessage.includes('earth') || lowerMessage.includes('मिट्टी') || lowerMessage.includes('ज़मीन')) {
    return demoResponses.soil[language];
  } else if (lowerMessage.includes('water') || lowerMessage.includes('irrigation') || lowerMessage.includes('drip') || lowerMessage.includes('पानी') || lowerMessage.includes('सिंचाई')) {
    return demoResponses.irrigation[language];
  } else if (lowerMessage.includes('market') || lowerMessage.includes('mandi') || lowerMessage.includes('sell') || lowerMessage.includes('बाजार') || lowerMessage.includes('मंडी')) {
    return demoResponses.market[language];
  } else if (lowerMessage.includes('price') || lowerMessage.includes('rate') || lowerMessage.includes('cost') || lowerMessage.includes('भाव') || lowerMessage.includes('दाम') || lowerMessage.includes('कीमत')) {
    return demoResponses.price[language];
  } else if (lowerMessage.includes('scheme') || lowerMessage.includes('govt') || lowerMessage.includes('subsidy') || lowerMessage.includes('yojana') || lowerMessage.includes('योजना') || lowerMessage.includes('सरकार')) {
    return demoResponses.scheme[language];
  } else if (lowerMessage.includes('pest') || lowerMessage.includes('insect') || lowerMessage.includes('bug') || lowerMessage.includes('कीट') || lowerMessage.includes('कीड़ा')) {
    return demoResponses.pest[language];
  } else if (lowerMessage.includes('organic') || lowerMessage.includes('natural') || lowerMessage.includes('जैविक') || lowerMessage.includes('प्राकृतिक')) {
    return demoResponses.organic[language];
  } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste') || lowerMessage.includes('नमस्ते') || lowerMessage.includes('हाय')) {
    return demoResponses.hello[language];
  } else if (lowerMessage.includes('thank') || lowerMessage.includes('dhanyavad') || lowerMessage.includes('शुक्रिया') || lowerMessage.includes('धन्यवाद')) {
    return demoResponses.thanks[language];
  } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('urea') || lowerMessage.includes('dap') || lowerMessage.includes('khad') || lowerMessage.includes('खाद') || lowerMessage.includes('उर्वरक')) {
    return demoResponses.fertilizer[language];
  } else if (lowerMessage.includes('seed') || lowerMessage.includes('variety') || lowerMessage.includes('beej') || lowerMessage.includes('बीज')) {
    return demoResponses.seed[language];
  } else if (lowerMessage.includes('weed') || lowerMessage.includes('grass') || lowerMessage.includes('kharpatwar') || lowerMessage.includes('खरपतवार') || lowerMessage.includes('घास')) {
    return demoResponses.weed[language];
  } else if (lowerMessage.includes('loan') || lowerMessage.includes('kcc') || lowerMessage.includes('bank') || lowerMessage.includes('credit') || lowerMessage.includes('ऋण') || lowerMessage.includes('लोन') || lowerMessage.includes('बैंक')) {
    return demoResponses.loan[language];
  } else if (lowerMessage.includes('store') || lowerMessage.includes('storage') || lowerMessage.includes('godown') || lowerMessage.includes('भंडारण')) {
    return demoResponses.storage[language];
  } else if (lowerMessage.includes('cow') || lowerMessage.includes('buffalo') || lowerMessage.includes('milk') || lowerMessage.includes('dairy') || lowerMessage.includes('गाय') || lowerMessage.includes('भैंस') || lowerMessage.includes('दूध')) {
    return demoResponses.cow[language];
  }
  
  return demoResponses.default[language];
}

export async function generateAIResponse(userMessage: string, language: 'en' | 'hi' = 'en'): Promise<string> {
  // If HuggingFace is not configured, return demo response
  if (!isHFConfigured()) {
    console.warn('⚠️ HuggingFace API not configured. Using demo responses.');
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    return getDemoResponse(userMessage, language);
  }

  try {
    // Create a farming-specific prompt
    const prompt = language === 'en' 
      ? `You are an agricultural AI assistant. Answer this farming question concisely: ${userMessage}`
      : `आप एक कृषि AI सहायक हैं। इस कृषि प्रश्न का संक्षिप्त उत्तर दें: ${userMessage}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 150,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Invalid HuggingFace API token. Falling back to demo mode.');
        return getDemoResponse(userMessage, language);
      } else if (response.status === 503) {
        throw new Error('Model is loading. Please wait a moment and try again.');
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    }

    const data = await response.json();

    // Handle different response formats
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return data[0].generated_text.trim();
    } else if (typeof data === 'object' && data.generated_text) {
      return data.generated_text.trim();
    } else {
      throw new Error('Unexpected response format from API');
    }
  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    // Fallback to demo response on error
    if (error.message.includes('API') || error.message.includes('token') || error.name === 'TypeError') {
      console.warn('Falling back to demo response due to API error');
      return getDemoResponse(userMessage, language);
    }
    
    throw error;
  }
}

export async function checkModelStatus(): Promise<boolean> {
  if (!isHFConfigured()) {
    return false;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
      },
    });
    
    return response.ok;
  } catch {
    return false;
  }
}

export const HF_ENABLED = isHFConfigured();
