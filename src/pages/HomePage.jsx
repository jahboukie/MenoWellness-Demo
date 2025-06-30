import React, { useState, useEffect } from 'react';
import { useAuth } from '/src/contexts/AuthContext.jsx';
import { db } from '/src/firebase.js';
// ✨ 1. Restored the necessary imports from Firestore for the invite system
import { doc, setDoc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import ChatInterface from '/src/components/ChatInterface.jsx';
import Journal from '/src/components/Journal.jsx';
import AnalysisReport from '/src/components/AnalysisReport.jsx';

// A reusable card component for consistent styling
const DashboardCard = ({ title, children, className }) => (
  <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl ${className}`}>
    <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
    {children}
  </div>
);

const HomePage = () => {
  const { user } = useAuth();
  const [apiResponse, setApiResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleAnalysisRequest = async (textToAnalyze, focus) => {
    setIsAnalyzing(true);
    setApiResponse(null);
    try {
      const response = await fetch(import.meta.env.VITE_SENTIMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze, focus: focus, apps: "MenoWellness" }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API returned status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      console.error("Analysis Error:", err);
      setApiResponse({ error: `Analysis failed. ${err.message}` });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // ✨ 2. Restored the generateInviteCode function logic
  const generateInviteCode = async () => {
    if (!user) return;
    setIsGenerating(true);
    const invitesRef = collection(db, 'invites');
    // Check for an existing pending invite for this user
    const q = query(invitesRef, where('inviterId', '==', user.uid), where('status', '==', 'pending'), limit(1));
    const existingInvites = await getDocs(q);

    if (!existingInvites.empty) {
      // If one exists, just display that code
      setInviteCode(existingInvites.docs[0].id);
    } else {
      // Otherwise, generate a new 6-digit code
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
    <div className="p-4 md:p-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>Your Dashboard</h1>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="bg-white/30 hover:bg-white/40 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
        </button>
      </div>

      {showInstructions && (
         <div className="bg-sky-100/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl mb-8 border border-sky-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome & Demo Guide</h2>
            <p className="text-slate-600 mb-6">This interactive prototype demonstrates the core user-to-partner data flow. Follow the steps below to see it in action.</p>
            <div className="grid md:grid-cols-3 gap-6 text-slate-700">
               <div>
                  <h3 className="font-semibold text-lg text-slate-800">1. You are "Jane" (The User)</h3>
                  <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                     <li>Use the **Journal** to add an entry (you can load an example).</li>
                     <li>**Check the "Share with partner" box** and save it.</li>
                     <li>In the **Invite** section, generate and **copy the code**.</li>
                  </ul>
               </div>
               <div>
                  <h3 className="font-semibold text-lg text-slate-800">2. You are "John" (The Partner)</h3>
                  <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                     <li>Open an **Incognito/Private** browser window.</li>
                     <li>Sign in with a **DIFFERENT Google account**.</li>
                     <li>After login, change the URL to `/accept-invite`.</li>
                     <li>Paste the code to connect accounts.</li>
                  </ul>
               </div>
               <div>
                  <h3 className="font-semibold text-lg text-slate-800">3. The Magic Moment</h3>
                  <p className="mt-1">You'll land on the Partner Dashboard and see Jane's shared entry, demonstrating our secure, permissioned data-sharing.</p>
               </div>
            </div>
         </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <DashboardCard title="AI Chat">
            <ChatInterface onAnalysisComplete={setApiResponse} />
          </DashboardCard>

          <DashboardCard title="My Journal">
            <Journal onAnalyzeRequest={(text) => handleAnalysisRequest(text, "Journal Analysis")} />
          </DashboardCard>

          {/* This Invite Your Partner card will now work correctly */}
          <DashboardCard title="Invite Your Partner">
            <p className="text-gray-600 mb-4">Generate a code to securely share your journal entries.</p>
            {inviteCode ? (
              <div className="flex items-center justify-center space-x-4">
                <p className="text-4xl font-bold tracking-widest bg-slate-100 text-slate-800 p-4 rounded-lg">{inviteCode}</p>
                <button onClick={() => navigator.clipboard.writeText(inviteCode)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold">Copy</button>
              </div>
            ) : (
                <button onClick={generateInviteCode} disabled={isGenerating} className="bg-blue-500 text-white py-3 px-6 rounded-lg w-full font-bold hover:bg-blue-600 disabled:bg-blue-300 transition-all">
                {isGenerating ? 'Generating...' : 'Generate Invite Code'}
              </button>
            )}
          </DashboardCard>
        </div>

        <div className="sticky top-24">
           <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl min-h-[20rem] flex flex-col justify-center">
            {isAnalyzing && (
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-700">Analyzing...</p>
              </div>
            )}
            {apiResponse ? (
              <AnalysisReport response={apiResponse} />
            ) : (
              !isAnalyzing && (
                <div className="text-center">
                  <p className="text-slate-500">Analysis results will appear here.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
