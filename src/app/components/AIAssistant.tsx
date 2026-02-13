import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Mic, MicOff, Send, X, Globe, User, Volume2, VolumeX, Minimize2, Maximize2, Sparkles, Cat } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { speak, stopSpeaking, startListening, stopListening } from '../utils/voice';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Meow! I'm your AgriSarthi Cat Assistant. How can I help you with your crops today? 🐾",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const CAT_AVATAR = "https://images.unsplash.com/photo-1716045168176-15d310a01dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2FsaWNvJTIwY2F0JTIwY2FydG9vbiUyMGF2YXRhcnxlbnwxfHx8fDE3NzEwMTEyNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isSpeaking]);

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    processAIResponse(userMsg.text);
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      startListening((transcript) => {
        setInputText(transcript);
        setIsListening(false);
        // Automatically send after voice input
        if (transcript.trim()) {
           setTimeout(() => {
             const userMsg: Message = {
               id: Date.now().toString(),
               text: transcript,
               sender: 'user',
               timestamp: new Date()
             };
             setMessages(prev => [...prev, userMsg]);
             setInputText('');
             processAIResponse(transcript);
           }, 500);
        }
      }, language);
    }
  };
  
  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: newLang === 'hi' ? "म्याऊँ! भाषा हिंदी में बदल दी गई है। पूछिए क्या जानना चाहते हैं? 🐾" : "Meow! Language changed to English. How can I help? 🐾",
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  const processAIResponse = (query: string) => {
    let responseText = "";
    const lowerQuery = query.toLowerCase();

    if (language === 'en') {
      if (lowerQuery.includes('weather') || lowerQuery.includes('rain')) {
        responseText = "The skies are looking good for farming! Expect light showers tomorrow morning which is great for your wheat. Purr-fect timing!";
      } else if (lowerQuery.includes('disease') || lowerQuery.includes('pest') || lowerQuery.includes('yellow')) {
        responseText = "If you see yellow spots on leaves, it could be Rust disease. I recommend checking the 'Crop Disease' section and spraying appropriate fungicide. Don't let those pests scratch your hard work!";
      } else if (lowerQuery.includes('market') || lowerQuery.includes('price')) {
        responseText = "Market prices are climbing! Wheat is at ₹2,150 per quintal. It's a good time to sell part of your harvest. More milk for the kitty!";
      } else if (lowerQuery.includes('irrigation') || lowerQuery.includes('water')) {
        responseText = "Your soil moisture sensor says it's getting dry. Turn on the drip irrigation for 2 hours today. Water is precious, like a clean bowl of milk!";
      } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        responseText = "Hello there! I'm your agricultural cat expert. What's on your mind? Crops, weather, or maybe some government schemes?";
      } else if (lowerQuery.includes('scheme') || lowerQuery.includes('government')) {
        responseText = "There are many schemes like PM-KISAN. Check the 'Government Schemes' page for eligibility. It's like finding a hidden treat!";
      } else {
        responseText = "That's an interesting question! While I'm just a cat, I suggest checking our specialized tools for soil analysis or yield estimation for exact data.";
      }
    } else {
      if (lowerQuery.includes('weather') || lowerQuery.includes('mausam') || lowerQuery.includes('barish')) {
        responseText = "मौसम खेती के लिए अच्छा लग रहा है! कल सुबह हल्की बारिश की संभावना है जो आपकी गेहूं की फसल के लिए बहुत अच्छी है। म्याऊँ!";
      } else if (lowerQuery.includes('disease') || lowerQuery.includes('bimari') || lowerQuery.includes('peela')) {
        responseText = "यदि आप पत्तियों पर पीले धब्बे देखते हैं, तो यह रस्ट रोग हो सकता है। मैं 'फसल रोग' अनुभाग की जांच करने और उचित कवकनाशी (fungicide) के छिड़काव की सलाह देता हूँ।";
      } else if (lowerQuery.includes('market') || lowerQuery.includes('bhav') || lowerQuery.includes('mandi')) {
        responseText = "मंडी भाव बढ़ रहे हैं! गेहूं ₹2,150 प्रति क्विंटल पर है। अपनी फसल का कुछ हिस्सा बेचने का यह अच्छा समय है।";
      } else if (lowerQuery.includes('irrigation') || lowerQuery.includes('pani') || lowerQuery.includes('sinchai')) {
        responseText = "मिट्टी की नमी कम हो रही है। आज 2 घंटे के लिए ड्रिप सिंचाई चालू करें। पानी की बचत करें!";
      } else if (lowerQuery.includes('hello') || lowerQuery.includes('namaste')) {
        responseText = "नमस्ते! मैं आपका कृषि बिल्ली सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?";
      } else {
        responseText = "यह एक दिलचस्प सवाल है! मैं आपको सटीक डेटा के लिए हमारे मिट्टी विश्लेषण या उपज अनुमान टूल की जांच करने का सुझाव देता हूँ। म्याऊँ!";
      }
    }

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now().toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      speak(responseText, language);
      setIsSpeaking(true);
      // Auto-reset speaking state after a while
      setTimeout(() => setIsSpeaking(false), responseText.length * 80);
    }, 1200);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              whileHover={{ scale: 1.1 }}
            >
              <Button 
                onClick={toggleAssistant}
                className="h-16 w-16 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] bg-gradient-to-br from-emerald-500 to-green-700 hover:from-emerald-600 hover:to-green-800 p-0 overflow-hidden border-2 border-white"
              >
                <ImageWithFallback 
                   src={CAT_AVATAR} 
                   alt="Cat AI" 
                   className="h-full w-full object-cover"
                />
              </Button>
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white animate-bounce flex items-center justify-center">
                 <Sparkles className="h-3 w-3 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] z-50 flex flex-col"
          >
            <Card className="flex-1 flex flex-col shadow-2xl border-none overflow-hidden bg-white/90 backdrop-blur-xl ring-1 ring-black/5">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-800 text-white p-4 shrink-0 relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                       <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
                          <ImageWithFallback src={CAT_AVATAR} alt="Cat AI" className="h-full w-full object-cover" />
                       </div>
                       <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-emerald-600 animate-pulse" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold tracking-tight">AgriSarthi AI</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none text-[10px]">Cat Assistant</Badge>
                        <span className="text-xs text-emerald-100 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9 text-white hover:bg-white/20 rounded-full" 
                      onClick={toggleLanguage} 
                      title={language === 'en' ? "Hindi" : "English"}
                    >
                      <Globe className="h-5 w-5" />
                      <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-white text-emerald-800 px-1 rounded-full shadow-sm">{language.toUpperCase()}</span>
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9 text-white hover:bg-white/20 rounded-full" 
                      onClick={toggleAssistant}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                  <div className="space-y-6">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white shadow-sm ${msg.sender === 'user' ? 'bg-emerald-500' : 'bg-green-700'}`}>
                             {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Cat className="h-4 w-4" />}
                          </div>
                          <div
                            className={`p-4 rounded-2xl shadow-sm relative ${
                              msg.sender === 'user'
                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                : 'bg-white text-gray-800 border border-emerald-100 rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <span className={`text-[9px] block mt-2 font-medium opacity-60`}>
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isSpeaking && (
                       <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="flex justify-start pl-11"
                       >
                         <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-4 py-1.5 text-xs flex items-center gap-2 shadow-sm">
                           <Volume2 className="h-3 w-3 animate-pulse" />
                           <span>Cat is speaking...</span>
                           <button onClick={handleStopSpeaking} className="hover:text-emerald-900 font-bold ml-1 transition-colors">Stop</button>
                         </div>
                       </motion.div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 bg-white/80 backdrop-blur-md border-t border-emerald-50">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2 border border-emerald-50 shadow-inner">
                    <Button
                      size="icon"
                      variant={isListening ? "destructive" : "ghost"}
                      className={`shrink-0 h-10 w-10 rounded-xl ${isListening ? "animate-pulse shadow-lg" : "text-emerald-600 hover:bg-emerald-100"}`}
                      onClick={handleMicClick}
                      title="Voice Input"
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Input
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={language === 'en' ? "Meow to me..." : "मुझसे म्याऊँ करें..."}
                      className="flex-1 border-none bg-transparent focus-visible:ring-0 text-sm h-10 shadow-none"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSendMessage} 
                      className="shrink-0 h-10 w-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95"
                      disabled={!inputText.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
                     Powered by AgriSarthi AI • Language: {language === 'en' ? 'English' : 'हिन्दी'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
