import { Volume2, VolumeX, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { speak, stopSpeaking } from '../utils/voice';
import { useState } from 'react';

interface VoiceButtonProps {
  text: string;
  hindiText?: string;
}

export function VoiceButton({ text, hindiText }: VoiceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const handleClick = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const speechText = lang === 'hi' && hindiText ? hindiText : text;
      const success = speak(speechText, lang);
      if (success) {
        setIsSpeaking(true);
        // Reset after speech ends (approximate)
        setTimeout(() => setIsSpeaking(false), speechText.length * 60);
      }
    }
  };

  const toggleLang = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        className="gap-2 bg-white/50 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50"
      >
        {isSpeaking ? (
          <>
            <VolumeX className="h-4 w-4 text-rose-500" />
            Stop
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4 text-emerald-600" />
            {lang === 'en' ? 'Listen' : 'सुनें'}
          </>
        )}
      </Button>
      <Button
        onClick={toggleLang}
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-xs font-bold text-emerald-700"
        title="Switch Language"
      >
        {lang.toUpperCase()}
      </Button>
    </div>
  );
}
