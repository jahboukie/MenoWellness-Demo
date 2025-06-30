import React, { useState } from 'react';

const ChatInterface = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // ... (logic is unchanged)
  };

  return (
    // ✨ The whole component is restyled for the light card theme
    <div>
      <div className="bg-slate-100 p-4 rounded-lg h-64 overflow-y-auto mb-4 border border-slate-200">
        {messages.length === 0 && <p className="text-slate-400 text-center mt-4">Ask me anything...</p>}
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* ✨ User message bubble style remains the same as it fits our theme */}
            <span className={`inline-block p-3 rounded-lg max-w-xs shadow-sm ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-slate-700'}`}>
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
          className="w-full p-3 border border-slate-300 bg-white text-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-blue-500 text-white p-3 rounded-lg font-bold hover:bg-blue-600 disabled:bg-blue-300 transition"
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
