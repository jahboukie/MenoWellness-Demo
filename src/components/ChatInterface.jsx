import React, { useState } from 'react';

const ChatInterface = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    onAnalysisStart();
    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_SENTIMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentInput, focus: "AI Chat", apps: "MenoWellness" }),
      });
      if (!response.ok) throw new Error("API request failed.");
      const data = await response.json();
      onAnalysisComplete(data);
    } catch (err) {
      onAnalysisComplete({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gray-900 p-4 rounded-lg h-80 overflow-y-auto mb-4 border border-gray-700">
        {messages.length === 0 && <p className="text-gray-500 text-center mt-4">Ask me anything...</p>}
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span className={`inline-block p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
