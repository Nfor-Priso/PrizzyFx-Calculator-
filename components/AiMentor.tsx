
import React, { useState, useRef, useEffect } from 'react';
import { getAiMentorResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';

const AiMentor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hello! I am Prizzy, your AI forex mentor. How can I help you understand the markets today? Ask me about risk management, chart patterns, or trading psychology.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const chatHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const aiResponseText = await getAiMentorResponse(input, chatHistory);
    const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };
  
  // Custom markdown-to-HTML parser for simple formatting
  const formatMessage = (text: string) => {
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') // Bold
      .replace(/\n/g, '<br />'); // Newlines
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };


  return (
    <div className="flex flex-col h-full p-4 sm:p-6 md:p-8 text-white">
      <h2 className="text-3xl font-bold text-white mb-4">AI Mentor</h2>
      <div className="flex-grow bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden flex flex-col">
        <div className="flex-grow p-6 space-y-6 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex-shrink-0 flex items-center justify-center font-bold">P</div>
              )}
              <div className={`max-w-xl p-4 rounded-xl ${msg.sender === 'ai' ? 'bg-gray-700/80 text-gray-300' : 'bg-cyan-600/90 text-white'}`}>
                <div className="prose prose-invert prose-sm text-gray-300">{formatMessage(msg.text)}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex-shrink-0 flex items-center justify-center font-bold animate-pulse">P</div>
              <div className="max-w-xl p-4 rounded-xl bg-gray-700/80 text-gray-300">
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a trading concept..."
              className="flex-grow bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiMentor;
