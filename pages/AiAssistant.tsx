import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Send, ExternalLink, Bot, User as UserIcon } from 'lucide-react';

interface GroundingLink {
  uri: string;
  title: string;
}

export default function AiAssistant() {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<{ role: 'user' | 'ai', text: string, links?: GroundingLink[] }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = prompt;
    setPrompt('');
    setLoading(true);
    setConversation(prev => [...prev, { role: 'user', text: userMessage }, { role: 'ai', text: '' }]);

    const updateAiMessage = (text: string, links?: GroundingLink[]) => {
      setConversation(prev => {
        const updated = [...prev];
        let aiIndex = -1;
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].role === 'ai') {
            aiIndex = i;
            break;
          }
        }
        const message = { role: 'ai', text, ...(links && links.length ? { links } : {}) };
        if (aiIndex === -1) {
          updated.push(message);
        } else {
          updated[aiIndex] = message;
        }
        return updated;
      });
    };

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: 'You are "DhobiGhat AI", a world-class laundry and fabric care expert. Provide practical, professional advice on stain removal, textile care, and laundry hygiene. If the user asks about local services or recent trends, use Google Search grounding. Always maintain a helpful, premium tone.',
          tools: [{ googleSearch: {} }],
        },
      });

      let accumulatedText = '';
      let groundingLinks: GroundingLink[] | undefined;

      for await (const chunk of response) {
        accumulatedText += chunk.text ?? '';

        const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && chunks.length) {
          groundingLinks = chunks
            .filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title }));
        }

        updateAiMessage(accumulatedText || "I'm thinking...", groundingLinks);
      }

      if (!accumulatedText) {
        updateAiMessage("I'm sorry, I couldn't process that request.", groundingLinks);
      }
    } catch (error) {
      console.error(error);
      updateAiMessage("I'm experiencing a technical glitch. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="bg-white border rounded-t-2xl p-4 border-b-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Bot className="text-indigo-600" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900">DhobiGhat Expert AI</h1>
            <p className="text-xs text-green-500 font-medium">● Online and ready to help</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 border-x p-4 space-y-6">
        {conversation.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border mb-4">
              <Sparkles size={48} className="text-indigo-500 mb-4 animate-pulse mx-auto" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">How can I help you today?</h2>
              <p className="text-slate-500 text-sm">
                Ask me anything about fabric care, stain removal, or dry cleaning standards.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-sm">
              <button onClick={() => setPrompt("How to remove turmeric stains?")} className="text-xs p-2 bg-white border rounded-lg hover:bg-slate-100 transition-colors">"Remove turmeric stains"</button>
              <button onClick={() => setPrompt("Is silk machine washable?")} className="text-xs p-2 bg-white border rounded-lg hover:bg-slate-100 transition-colors">"Machine wash silk?"</button>
            </div>
          </div>
        )}

        {conversation.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                {msg.role === 'user' ? <UserIcon size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.links.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors"
                        >
                          <ExternalLink size={10} />
                          <span className="truncate max-w-[120px]">{link.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white border p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border border-t-0 rounded-b-2xl shadow-lg">
        <form onSubmit={handleAsk} className="flex gap-2">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask your laundry expert..."
            className="flex-1 bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
          <button 
            disabled={loading || !prompt.trim()}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-2">Powered by Gemini & DhobiGhat</p>
      </div>
    </div>
  );
}
