import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // THIS LINE WAS MISSING
import { db } from '../firebase';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AcceptInvitePage = () => {
  const { user } = useAuth(); // Now this line will work correctly
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !user) return;
    setIsLoading(true);
    setError('');

    try {
      const inviteDocRef = doc(db, "invites", code);
      const inviteDocSnap = await getDoc(inviteDocRef);

      if (!inviteDocSnap.exists() || inviteDocSnap.data().status !== 'pending') {
        throw new Error("Invalid or expired invitation code.");
      }

      const inviterId = inviteDocSnap.data().inviterId;

      if (inviterId === user.uid) {
        throw new Error("You cannot accept your own invitation.");
      }

      const batch = writeBatch(db);

      const userRef = doc(db, 'users', inviterId);
      batch.update(userRef, { partnerId: user.uid });

      const partnerRef = doc(db, 'users', user.uid);
      batch.update(partnerRef, { partnerId: inviterId, role: 'partner' });

      batch.update(inviteDocRef, { status: 'completed', acceptorId: user.uid });

      await batch.commit();
      navigate('/partner-dashboard');

    } catch (err) {
      console.error("Error accepting invite:", err)
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-4">Accept Invitation</h2>
          <p className="text-center text-gray-600 mb-6">Enter the 6-digit code your partner sent you.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full p-3 text-center text-2xl tracking-widest border rounded-lg"
              maxLength="6"
            />
            <button type="submit" disabled={isLoading} className="w-full mt-4 bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300">
              {isLoading ? 'Connecting...' : 'Connect Accounts'}
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </form>
        </div>
      </div>
  );
};

export default AcceptInvitePage;
