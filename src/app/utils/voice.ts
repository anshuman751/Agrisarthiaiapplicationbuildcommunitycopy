// Voice synthesis and recognition using Web Speech API

// Types for SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

let recognition: SpeechRecognition | null = null;
let synthesisVoice: SpeechSynthesisVoice | null = null;

// Initialize voices
if ('speechSynthesis' in window) {
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    // Prefer Hindi India, then English India, then generic English
    synthesisVoice = voices.find(v => v.lang === 'hi-IN') || 
                     voices.find(v => v.lang === 'en-IN') || 
                     voices.find(v => v.lang.startsWith('en')) || 
                     null;
  };
  
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

export const speak = (text: string, lang: 'en' | 'hi' = 'en') => {
  if (!('speechSynthesis' in window)) return false;

  window.speechSynthesis.cancel(); // Stop previous

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Select voice based on requested language
  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = null;

  if (lang === 'hi') {
    selectedVoice = voices.find(v => v.lang === 'hi-IN' || v.lang.includes('Hindi'));
  } else {
    selectedVoice = voices.find(v => v.lang === 'en-IN' || v.lang === 'en-US');
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  // Set language property as fallback
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const startListening = (
  onResult: (text: string) => void, 
  lang: 'en' | 'hi' = 'en'
) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.error("Speech recognition not supported");
    return null;
  }

  if (recognition) {
    recognition.abort();
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    console.error("Speech recognition error", event.error);
  };

  recognition.start();
  return recognition;
};

export const stopListening = () => {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
};
