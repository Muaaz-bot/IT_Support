
import React, { useState, useRef, useEffect } from 'react';
import { createAIClient, SYSTEM_PROMPT, encode, decode, decodeAudioData } from '../services/geminiService';
import { Modality, LiveServerMessage } from '@google/genai';

const VoiceAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [transcription, setTranscription] = useState('');
  const [userTranscription, setUserTranscription] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Helper for mobile haptics
  const triggerHaptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  };

  const startSession = async () => {
    try {
      setStatus('connecting');
      triggerHaptic(50);
      const ai = createAIClient();
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Critical for mobile: resume context on user gesture
      await audioContextRef.current.resume();
      await outAudioContextRef.current.resume();

      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Voice session opened');
            setStatus('listening');
            triggerHaptic([30, 50, 30]);
            
            const source = audioContextRef.current!.createMediaStreamSource(mediaStreamRef.current!);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(2048, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              if (status !== 'speaking') triggerHaptic(10);
              setStatus('speaking');
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outAudioContextRef.current!.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outAudioContextRef.current!, 24000, 1);
              const source = outAudioContextRef.current!.createBufferSource();
              source.buffer = buffer;
              source.connect(outAudioContextRef.current!.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
              triggerHaptic(20);
            }

            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent?.outputTranscription?.text);
            }
            if (message.serverContent?.inputTranscription) {
              setUserTranscription(prev => prev + message.serverContent?.inputTranscription?.text);
            }
            if (message.serverContent?.turnComplete) {
              setTranscription('');
              setUserTranscription('');
            }
          },
          onerror: (e) => {
            console.error('Voice Error:', e);
            setStatus('idle');
          },
          onclose: () => {
            setIsActive(false);
            setStatus('idle');
            triggerHaptic([50, 100]);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          thinkingConfig: { thinkingBudget: 0 },
          systemInstruction: SYSTEM_PROMPT,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {} 
        }
      });

      sessionRef.current = await sessionPromise;
      setIsActive(true);
    } catch (error) {
      console.error('Failed to start voice session:', error);
      setStatus('idle');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsActive(false);
    setStatus('idle');
    setTranscription('');
    setUserTranscription('');
    triggerHaptic(50);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] h-full bg-slate-900 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent animate-pulse"></div>
      
      <div className="z-10 text-center mb-6 lg:mb-12">
        <h2 className="text-2xl lg:text-3xl font-black mb-1 tracking-tight">Rapid AI Response</h2>
        <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-blue-500/10 rounded-full inline-block border border-blue-500/20">
          Secure Mobile Voice
        </p>
      </div>

      <div className="z-10 relative mb-8 lg:mb-12">
        <div className={`w-36 h-36 lg:w-48 lg:h-48 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
          status === 'listening' ? 'border-blue-500 bg-blue-600/20 scale-110 shadow-[0_0_40px_rgba(37,99,235,0.4)]' :
          status === 'speaking' ? 'border-green-500 bg-green-600/20 scale-105 shadow-[0_0_40px_rgba(22,163,74,0.4)]' :
          'border-slate-700 bg-slate-800'
        }`}>
          <div className={`w-28 h-28 lg:w-36 lg:h-36 rounded-full flex items-center justify-center transition-all duration-300 ${
            status === 'listening' ? 'bg-blue-600 shadow-xl' :
            status === 'speaking' ? 'bg-green-600 shadow-xl' :
            'bg-slate-700'
          }`}>
            <i className={`fa-solid text-4xl lg:text-5xl transition-transform duration-200 ${
              status === 'speaking' ? 'fa-volume-high scale-110' : 'fa-microphone'
            }`}></i>
          </div>
        </div>
        
        {(status === 'speaking' || status === 'listening') && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-8">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 lg:w-1.5 rounded-full transition-all duration-100 ${status === 'speaking' ? 'bg-green-400' : 'bg-blue-400'}`}
                style={{ 
                  height: `${30 + Math.random() * 70}%`,
                  animation: `wave 0.6s infinite ease-in-out ${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      <div className="z-10 w-full max-w-sm mb-8 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 min-h-[140px] flex flex-col items-center justify-center text-center gap-4">
        {userTranscription && (
          <div className="text-blue-400 text-[10px] lg:text-xs font-black uppercase tracking-widest animate-fade-in px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 max-w-full truncate">
            "{userTranscription}"
          </div>
        )}
        
        {transcription ? (
          <div className="text-white text-base lg:text-lg font-bold animate-fade-in leading-snug">
             {transcription}
          </div>
        ) : (
          !userTranscription && (
            <div className="space-y-3">
              <p className="text-slate-500 text-xs lg:text-sm font-medium">
                {status === 'idle' ? 'Connect for secure technical assistance.' : 
                 status === 'connecting' ? 'Calibrating audio path...' : 
                 status === 'listening' ? 'Agent is waiting. Speak now.' : 
                 'Synthesizing answer...'}
              </p>
              {status === 'listening' && (
                <div className="flex justify-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>
          )
        )}
      </div>

      <button
        onClick={isActive ? stopSession : startSession}
        className={`z-10 w-full sm:w-auto px-10 py-4 lg:py-4 rounded-2xl font-black text-sm lg:text-base uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 active:ring-4 ${
          isActive 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-900/20 active:ring-red-500/30' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20 active:ring-blue-600/30'
        }`}
      >
        <i className={`fa-solid ${isActive ? 'fa-power-off' : 'fa-play'}`}></i>
        {isActive ? 'Disconnect' : 'Start Session'}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .animate-fade-in {
          animation: fadeIn 0.15s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default VoiceAgent;
