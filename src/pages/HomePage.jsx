import React, { useState } from 'react'; // THIS LINE IS THE FIX
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import ChatInterface from '../components/ChatInterface';
import Journal from '../components/Journal';
import StructuredResponse from '../components/StructuredResponse';

const HomePage = () => {
  const { user } = useAuth();
  const [apiResponse, setApiResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAnalysisRequest = async (textToAnalyze, focus) => {
    setIsAnalyzing(true);
    setApiResponse(null);
    try {
      const response = await fetch(import.meta.env.VITE_SENTIMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze, focus: focus, apps: "MenoWellness" }),
      });
      if (!response.ok) throw new Error("API request failed.");
      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      setApiResponse({ error: err.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateInviteCode = async () => {
    if (!user) return;
    setIsGenerating(true);

    const invitesRef = collection(db, 'invites');
    const q = query(invitesRef, where('inviterId', '==', user.uid), where('status', '==', 'pending'), limit(1));
    const existingInvites = await getDocs(q);

    if (!existingInvites.empty) {
      setInviteCode(existingInvites.docs[0].id);
    } else {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const inviteDocRef = doc(db, 'invites', newCode);
      try {
        await setDoc(inviteDocRef, {
          inviterId: user.uid,
          status: 'pending',
          createdAt: new Date(),
        });
        setInviteCode(newCode);
      } catch (error) {
        console.error("Error creating invite code:", error);
      }
    }
    setIsGenerating(false);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">AI Chat</h2>
          <ChatInterface onAnalysisStart={() => {setIsAnalyzing(true); setApiResponse(null);}} onAnalysisComplete={setApiResponse} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Journal</h2>
          <Journal onAnalyzeRequest={(text) => handleAnalysisRequest(text, "Journal Analysis")} />
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Invite Your Partner</h2>
        <p className="text-gray-600 mb-4">Generate a code to share with your partner so they can access your shared journal entries.</p>
        {inviteCode ? (
          <div className="text-center">
            <p className="text-gray-800 mb-2">Your one-time invite code is:</p>
            <p className="text-4xl font-bold tracking-widest bg-gray-100 p-4 rounded-lg inline-block">{inviteCode}</p>
            <button onClick={() => navigator.clipboard.writeText(inviteCode)} className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-lg">Copy</button>
          </div>
        ) : (
          <button onClick={generateInviteCode} disabled={isGenerating} className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300">
            {isGenerating ? 'Generating...' : 'Generate Code'}
          </button>
        )}
      </div>
      <div className="mt-8">
        {isAnalyzing && <p className="text-center text-lg font-semibold">Analyzing...</p>}
        {apiResponse && <StructuredResponse response={apiResponse} />}
      </div>
    </div>
  );
};

export default HomePage;
