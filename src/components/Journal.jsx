import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

// ✨ 1. Updated the journalExamples object with the new, detailed user stories.
const journalExamples = {
  'Select a journey example...': '',
  '🌸 Early Perimenopause': "I'm 45 and my periods have become so unpredictable. Some months I skip entirely, then I'll have two in one month. The brain fog is the worst part - I used to be so sharp at work, but now I forget simple things and feel like I'm losing my mind. My doctor says this is normal, but it doesn't feel normal to me.",
  '💚 Hormone Therapy Success': "The new hormone therapy has been helping with my hot flashes and sleep issues, but I'm still struggling with mood swings that are affecting my relationship. My partner tries to be understanding, and I'm learning to communicate my needs better. The treatment plan is working, and I feel more hopeful about the future.",
  '🔥 Severe Symptoms': "The hot flashes wake me up 6-7 times a night, and I'm drenched in sweat. My husband moved to the guest room because I keep the AC at 65 degrees. I feel like a stranger in my own body - irritable, exhausted, and completely overwhelmed. I snapped at my teenage daughter yesterday over nothing, and the guilt is eating me alive.",
  '⚖️ Body Changes': "I've gained 20 pounds in the past year despite eating the same way I always have. My clothes don't fit, and I feel uncomfortable in my own skin. The weight seems to settle around my middle no matter what I do. I've tried every diet, but nothing works like it used to. I feel invisible and unattractive.",
  '🦋 Post-Menopause Freedom': "It's been two years since my last period, and I finally feel like myself again. The hot flashes have mostly stopped, my energy is returning, and I'm sleeping through the night. I feel liberated from the monthly cycle and more confident than I've been in years. This new chapter feels full of possibilities."
};

const Journal = ({ onAnalyzeRequest }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'journal_entries'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user]);

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'journal_entries'), {
        userId: user.uid,
        content: newEntry,
        isShared: isShared,
        createdAt: serverTimestamp(),
      });
      setNewEntry('');
      setIsShared(false);
    } catch (err) {
      console.error("Failed to save entry:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // This function works perfectly with the new object. When a user selects an option,
  // it finds the corresponding text and sets it as the newEntry state.
  const handleExampleSelect = (e) => {
    const selectedKey = e.target.value;
    setNewEntry(journalExamples[selectedKey] || '');
  };

  return (
    <div>
      <form onSubmit={handleSaveEntry} className="mb-6">
        <div className="mb-4">
          {/* ✨ 2. Updated the label to be more descriptive of the new content. */}
          <label htmlFor="example-select" className="block text-sm font-medium text-slate-600 mb-1">
            Load a Menopause Journey Example:
          </label>
          <select 
            id="example-select" 
            onChange={handleExampleSelect} 
            // This logic finds which example title matches the current text to keep the dropdown in sync
            value={Object.keys(journalExamples).find(key => journalExamples[key] === newEntry) || ''} 
            className="w-full p-2.5 border border-slate-300 bg-white text-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          >
            {Object.keys(journalExamples).map(key => (<option key={key} value={key}>{key}</option>))}
          </select>
        </div>
        <textarea value={newEntry} onChange={(e) => setNewEntry(e.target.value)} placeholder="How are you feeling today?" className="w-full p-3 border border-slate-300 bg-white text-slate-800 rounded-lg h-32 transition focus:ring-2 focus:ring-blue-500"/>
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center cursor-pointer"><input type="checkbox" checked={isShared} onChange={(e) => setIsShared(e.target.checked)} className="h-5 w-5 rounded border-slate-400 bg-slate-100 text-blue-500 focus:ring-blue-500"/> <span className="ml-2 text-slate-700">Share with partner</span></label>
          <button type="submit" disabled={isLoading || !newEntry.trim()} className="bg-teal-500 text-white py-2 px-6 rounded-lg font-bold hover:bg-teal-600 disabled:bg-gray-400 transition">Save</button>
        </div>
      </form>

      <h3 className="text-xl font-bold text-slate-800 mb-4 pt-4 border-t">Past Entries</h3>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-slate-100/80 p-4 rounded-lg">
            <p className="text-slate-700 whitespace-pre-wrap">{entry.content}</p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-slate-500">{entry.createdAt?.toDate().toLocaleString()}</p>
              <div className="flex items-center space-x-2">
                {entry.isShared && <span className="text-xs bg-sky-100 text-sky-700 font-medium px-2 py-1 rounded-full">Shared</span>}
                <button onClick={() => onAnalyzeRequest(entry.content)} className="bg-blue-500 text-white text-xs py-1 px-3 rounded-lg font-bold hover:bg-blue-600 transition">Analyze</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
