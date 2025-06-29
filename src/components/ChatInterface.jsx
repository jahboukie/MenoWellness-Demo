import React, { useState } from 'react';

const ChatInterface = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    onAnalysisStart(); // Tell HomePage we are starting

    try {
      const response = await fetch(import.meta.env.VITE_SENTIMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, focus: "AI Chat", apps: "MenoWellness" }),
      });
      if (!response.ok) throw new Error("API request failed.");
      const data = await response.json();
      onAnalysisComplete(data); // Send the full data object up
    } catch (err) {
      onAnalysisComplete({ error: err.message }); // Send an error object up
    }
  };

  return (
    <div>
      <div className="bg-gray-50 p-4 rounded-lg h-80 overflow-y-auto mb-4 border">{messages.map((msg, index) => (<div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}><span className={`inline-block p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>{msg.content}</span></div>))}</div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="w-full p-3 border rounded-lg"/>
        <button type="submit" className="w-full mt-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;
