import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

// The examples can stay here, as they are part of the Journal's functionality
const journalExamples = {
  'Select an Example...': '',
  'Early Perimenopause': "I'm 45...", // (shortened for brevity)
  'Hormone Therapy Success': "The new hormone therapy...",
  'Severe Symptoms': "The hot flashes wake me up...",
  'Body Changes': "I've gained 20 pounds...",
  'Post-Menopause Freedom': "It's been two years..."
};

// This component now only needs one prop: onAnalyzeRequest
const Journal = ({ onAnalyzeRequest }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    //... (save logic remains the same) ...
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
      setError("Failed to save entry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleSelect = (e) => {
    setNewEntry(journalExamples[e.target.value] || '');
  };

  return (
    <div>
      <form onSubmit={handleSaveEntry} className="mb-6">
       {/* Example Selector */}
        <div className="mb-2">
          <label htmlFor="example-select" className="block text-sm font-medium text-gray-700 mb-1">Load an Example Entry:</label>
          <select id="example-select" onChange={handleExampleSelect} className="w-full p-2 border rounded-lg bg-gray-50">{Object.keys(journalExamples).map(key => (<option key={key} value={key}>{key}</option>))}</select>
        </div>
        <textarea value={newEntry} onChange={(e) => setNewEntry(e.target.value)} placeholder="How are you feeling today?" className="w-full p-3 border rounded-lg h-32"/>
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center"><input type="checkbox" checked={isShared} onChange={(e) => setIsShared(e.target.checked)} className="h-5 w-5 rounded"/> <span className="ml-2 text-gray-700">Share with partner</span></label>
          <button type="submit" disabled={isLoading || !newEntry.trim()} className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300">Save Entry</button>
        </div>
      </form>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Past Entries</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-gray-400">{entry.createdAt?.toDate().toLocaleString()}</p>
              {/* The Analyze button now calls the prop passed down from HomePage */}
              <button onClick={() => onAnalyzeRequest(entry.content)} className="bg-purple-600 text-white text-xs py-1 px-3 rounded-lg font-semibold hover:bg-purple-700">Analyze</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
