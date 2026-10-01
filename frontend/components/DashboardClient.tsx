"use client";
import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Mic, Send, Volume2, Square, Save, Trash2, Plus, VolumeX, User, Sparkles } from 'lucide-react';
import { Item } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ userEmail, userId, initialItems }: { userEmail: string, userId: string, initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState('');
  
  const listeningRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      if (listeningRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Failed to restart recognition:', e);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      listeningRef.current = false;
      recognition.stop();
    };
  }, [language]);

  // Auto-submit after 2 seconds of silence
  useEffect(() => {
    if (!isListening || !transcript.trim() || isProcessing) return;
    if (transcript === lastSubmitted) return;
    
    const timeout = setTimeout(() => {
      handleSubmit(transcript);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [transcript, isListening, isProcessing, lastSubmitted]);

  // Immediate interruption when user starts speaking
  useEffect(() => {
    if (transcript !== lastSubmitted && isPlaying) {
      stopPlaying();
    }
  }, [transcript, lastSubmitted, isPlaying]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    stopPlaying();
    setActiveItem(null);
    setAiResponse('');
    setTranscript('');
    setLastSubmitted('');
    setTextInput('');
    setIsListening(true);
    listeningRef.current = true;
    try {
      recognitionRef.current.start();
    } catch(e) {}
  };

  const stopListening = () => {
    setIsListening(false);
    listeningRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;
    
    setLastSubmitted(text);
    setActiveItem(null);
    setTranscript(text);
    setTextInput('');
    setIsProcessing(true);
    setAiResponse('');
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, language })
      });
      const data = await res.json();
      
      if (data.response) {
        setAiResponse(data.response);
        playAloud(data.response, language);
        saveSession(text, data.response);
      } else {
        const errorMsg = data.error || '';
        if (errorMsg.includes('429') || errorMsg.includes('quota')) {
          setAiResponse("Whoa, you're asking questions too fast! The free tier allows 15 questions per minute. Please wait about 60 seconds and try again.");
          playAloud("Whoa, you're asking questions too fast! Please wait a minute and try again.", language);
        } else {
          setAiResponse(`Error: ${errorMsg || 'Unknown error occurred.'}`);
        }
      }
    } catch (error) {
      setAiResponse('Network error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const playAloud = (text: string, lang: 'en' | 'hi') => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a friendly female voice
    const voices = window.speechSynthesis.getVoices();
    const targetLang = lang === 'en' ? 'en-IN' : 'hi-IN';
    
    let femaleVoice = voices.find(v => 
      (v.lang === targetLang || v.lang.startsWith(lang)) && 
      (v.name.toLowerCase().includes('female') || 
       v.name.toLowerCase().includes('zira') || 
       v.name.toLowerCase().includes('heera') || 
       v.name.toLowerCase().includes('neerja') ||
       v.name.toLowerCase().includes('samantha'))
    );

    if (!femaleVoice) {
      femaleVoice = voices.find(v => 
        (v.lang === targetLang || v.lang.startsWith(lang)) && 
        !v.name.toLowerCase().includes('male') && 
        !v.name.toLowerCase().includes('david') && 
        !v.name.toLowerCase().includes('ravi') &&
        !v.name.toLowerCase().includes('mark')
      );
    }
    
    if (!femaleVoice) {
      femaleVoice = voices.find(v => v.lang.startsWith(lang));
    }
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.lang = targetLang;
    utterance.pitch = 1.0; // Reset pitch to default so it sounds natural and soft
    utterance.rate = 1.0; // Reset rate to normal conversational speed
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  const stopPlaying = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const saveSession = async (currentTranscript: string, currentAiResponse: string) => {
    if (!currentTranscript || !currentAiResponse) return;
    
    const title = currentTranscript.length > 40 ? currentTranscript.substring(0, 40) + '...' : currentTranscript;
    
    if (activeItem) {
      const { data, error } = await supabase.from('items').update({
        content: currentTranscript,
        ai_response: currentAiResponse
      }).eq('id', activeItem.id).select().single();
      
      if (data && !error) {
        setItems(items.map(i => i.id === data.id ? data : i));
        setActiveItem(data);
      }
    } else {
      const { data, error } = await supabase.from('items').insert({
        user_id: userId,
        title,
        content: currentTranscript,
        ai_response: currentAiResponse
      }).select().single();
      
      if (data && !error) {
        setItems([data, ...items]);
        setActiveItem(data);
      }
    }
  };

  const deleteSession = async (id: string) => {
    await supabase.from('items').delete().eq('id', id);
    setItems(items.filter(item => item.id !== id));
    if (activeItem?.id === id) {
      setActiveItem(null);
      setTranscript('');
      setAiResponse('');
    }
  };

  const loadSession = (item: Item) => {
    stopListening();
    stopPlaying();
    setActiveItem(item);
    setTranscript(item.content);
    setLastSubmitted(item.content);
    setAiResponse(item.ai_response);
  };

  const resetSession = () => {
    stopListening();
    stopPlaying();
    setActiveItem(null);
    setTranscript('');
    setLastSubmitted('');
    setAiResponse('');
    setTextInput('');
  };

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      <Sidebar 
        userEmail={userEmail} 
        items={items} 
        activeItemId={activeItem?.id || null} 
        onSelect={loadSession}
        onNew={resetSession}
        language={language}
        setLanguage={setLanguage}
      />
      <main className="flex-1 flex flex-col h-full bg-zinc-900 border-l border-zinc-800 relative shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10">
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          {!transcript && !isProcessing && !aiResponse ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
              <h2 className="font-display font-medium text-4xl text-zinc-50 mb-12 text-center tracking-tight">How can I help your career today?</h2>
              <button 
                onClick={toggleListening}
                className="w-24 h-24 rounded-full bg-amber-600 text-white flex items-center justify-center hover:bg-amber-500 transition-all shadow-[0_0_30px_rgba(217,119,6,0.4)] ring-8 ring-amber-500/20 mb-12 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
              >
                {isListening ? <Square size={40} className="fill-white" /> : <Mic size={40} strokeWidth={1.5} />}
              </button>
              <div className="flex flex-wrap justify-center gap-3">
                 <button onClick={() => handleSubmit("What are good career options after 12th science apart from engineering?")} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors border border-zinc-700">Options after 12th science?</button>
                 <button onClick={() => handleSubmit("How do I prepare for a marketing interview?")} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors border border-zinc-700">Marketing interview prep?</button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 pt-8">
              <div className="flex gap-4 p-6 rounded-2xl bg-zinc-800/50">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={16} className="text-zinc-400" />
                </div>
                <div className="text-zinc-50 text-lg leading-relaxed pt-1">
                  {transcript}
                  {isListening && <span className="inline-block w-2 h-4 ml-1 bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>}
                </div>
              </div>
              
              {isProcessing && (
                <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm mt-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-amber-500" />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                     <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
                     <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-75 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
                     <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-150 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
                  </div>
                </div>
              )}

              {aiResponse && (
                <div className="flex gap-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm mt-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles size={16} className="text-amber-500" />
                  </div>
                  <div className="text-zinc-300 leading-relaxed pt-1 w-full min-w-0">
                    <div className="whitespace-pre-wrap text-zinc-50">{aiResponse}</div>
                    
                    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-zinc-800/50">
                      {isPlaying ? (
                        <button onClick={stopPlaying} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
                          <VolumeX size={16} /> Stop audio
                        </button>
                      ) : (
                        <button onClick={() => playAloud(aiResponse, language)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
                          <Volume2 size={16} /> Play aloud
                        </button>
                      )}
                      
                      {activeItem && (
                        <button onClick={() => deleteSession(activeItem.id)} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors border border-transparent">
                          <Trash2 size={16} /> Delete
                        </button>
                      )}
                      
                      <button onClick={resetSession} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors ml-auto">
                        <Plus size={16} /> Ask another
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent">
          <div className="max-w-3xl mx-auto flex items-center gap-3 bg-zinc-950 border border-zinc-800 p-2 rounded-xl shadow-lg focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all">
            <button 
              onClick={toggleListening}
              className={`p-3 rounded-lg transition-colors flex-shrink-0 ${isListening ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-50'}`}
            >
              {isListening ? <Square size={20} className="fill-amber-500" /> : <Mic size={20} />}
            </button>
            <input 
              type="text" 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(textInput) }}
              placeholder="Type a message or click the mic to speak..."
              className="flex-1 bg-transparent border-none focus:outline-none text-zinc-50 placeholder:text-zinc-600 px-2"
              disabled={isListening}
            />
            <button 
              onClick={() => handleSubmit(textInput)}
              disabled={!textInput.trim() || isListening}
              className="p-3 bg-amber-600 text-zinc-50 rounded-lg hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors flex-shrink-0"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
