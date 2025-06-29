import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const journalExamples = {
  'Select an Example...': '',
  'Early Perimenopause': "I'm 45 and my periods have become so unpredictable...",
  'Hormone Therapy Success': "The new hormone therapy has been helping...",
  'Severe Symptoms': "The hot flashes wake me up 6-7 times a night...",
  'Body Changes': "I've gained 20 pounds in the past year...",
  'Post-Menopause Freedom': "It's been two years since my last period..."
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

  const handleExampleSelect = (e) => {
    const selectedKey = e.target.value;
    setNewEntry(journalExamples[selectedKey] || '');
  };

  return (
    <div>
      <form onSubmit={handleSaveEntry} className="mb-6">
        <div className="mb-2">
          <label htmlFor="example-select" className="block text-sm font-medium text-gray-400 mb-1">Load an Example Entry:</label>
          <select id="example-select" onChange={handleExampleSelect} value={Object.keys(journalExamples).find(key => journalExamples[key] === newEntry) || ''} className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-lg">
            {Object.keys(journalExamples).map(key => (<option key={key} value={key}>{key}</option>))}
          </select>
        </div>
        <textarea value={newEntry} onChange={(e) => setNewEntry(e.target.value)} placeholder="How are you feeling today?" className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg h-32"/>
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center cursor-pointer"><input type="checkbox" checked={isShared} onChange={(e) => setIsShared(e.target.checked)} className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"/> <span className="ml-2 text-gray-300">Share with partner</span></label>
          <button type="submit" disabled={isLoading || !newEntry.trim()} className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-500">Save</button>
        </div>
      </form>

      <h3 className="text-xl font-semibold text-white mb-4">Past Entries</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-200 whitespace-pre-wrap">{entry.content}</p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-gray-400">{entry.createdAt?.toDate().toLocaleString()}</p>
              <div>
                {entry.isShared && <span className="text-xs bg-blue-900 text-blue-300 font-medium px-2 py-1 rounded-full mr-2">Shared</span>}
                <button onClick={() => onAnalyzeRequest(entry.content)} className="bg-purple-600 text-white text-xs py-1 px-3 rounded-lg font-semibold hover:bg-purple-700">Analyze</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Journal;
