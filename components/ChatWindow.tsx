import React, { useState, useRef, useEffect } from 'react';
import { createAIClient, SYSTEM_PROMPT, itHelpdeskTools } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const ai = createAIClient();
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: itHelpdeskTools }],
      },
    });

    setMessages([{
      role: 'model',
      content: "Hello! I'm TMC IT SUPPORT. I'm ready to handle your password resets, ticket creations, or technical questions. What's on your mind?",
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      
      const modelMessage: ChatMessage = {
        role: 'model',
        content: response.text || "I've updated the systems based on your request.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: "System connection interrupted. Please re-type your request.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70dvh] lg:h-[calc(100vh-160px)] bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
      <div className="bg-slate-50/80 backdrop-blur-md p-4 lg:px-6 border-b border-slate-200 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <i className="fa-solid fa-robot text-white text-xs"></i>
          </div>
          <div>
            <span className="font-bold text-slate-800 text-sm block">TMC IT SUPPORT</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Agent</span>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 scroll-smooth overscroll-contain"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
            }`}>
              <p className="text-[14px] lg:text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
              <span className={`text-[8px] mt-1.5 block opacity-50 font-bold ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 lg:p-4 bg-white border-t border-slate-100 shrink-0 pb-safe">
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-2xl p-1.5 focus-within:bg-white focus-within:ring-4 ring-blue-50 transition-all">
          <input 
            type="text" 
            inputMode="text"
            placeholder="How can I help you today?"
            className="flex-1 bg-transparent border-none focus:outline-none text-[15px] lg:text-sm px-3 py-2.5 font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-11 h-11 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !isLoading ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-400'
            }`}
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;