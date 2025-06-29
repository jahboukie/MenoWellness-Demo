import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const PartnerDashboardPage = () => {
  const { user } = useAuth();
  const [sharedEntries, setSharedEntries] = useState([]);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchPartnerData = async () => {
      try {
        // First, get the partner's own user document to find the inviter's ID
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().partnerId) {
          const partnerId = userDocSnap.data().partnerId;

          // Now get the primary user's info to display their name
          const partnerInfoRef = doc(db, 'users', partnerId);
          const partnerInfoSnap = await getDoc(partnerInfoRef);
          if(partnerInfoSnap.exists()) {
            setPartnerInfo(partnerInfoSnap.data());
          }

          // Now, set up the real-time listener for shared journal entries
          const q = query(
            collection(db, 'journal_entries'),
            where('userId', '==', partnerId),
            where('isShared', '==', true),
            orderBy('createdAt', 'desc')
          );

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const entriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSharedEntries(entriesData);
            setIsLoading(false);
          });

          return unsubscribe; // Return the cleanup function
        } else {
          // This user isn't linked to a partner
          setError("You are not currently linked to a partner's account.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error setting up partner dashboard:", err);
        setError("Failed to load partner data.");
        setIsLoading(false);
      }
    };

    fetchPartnerData();

  }, [user]);

  if (isLoading) {
    return <div className="text-center p-10">Loading Partner Dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Partner Dashboard</h1>
      {partnerInfo ? (
        <p className="text-lg text-gray-600 mb-6">Viewing shared entries from <span className="font-semibold">{partnerInfo.displayName}</span></p>
      ) : (
        <p className="text-lg text-gray-600 mb-6">A space to support your partner's journey.</p>
      )}

      {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

      <div className="space-y-4">
        {sharedEntries.length > 0 ? (
          sharedEntries.map(entry => (
            <div key={entry.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
              <p className="text-xs text-gray-400 mt-3 text-right">
                Shared on {entry.createdAt?.toDate().toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          !error && <p className="text-gray-500 text-center p-10">Your partner has not shared any journal entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboardPage;
