import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import getDoc and setDoc
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = () => {
    setLoading(true);
    signInWithPopup(auth, googleProvider)
      .catch((error) => console.error("Google Sign-In Error", error))
      .finally(() => setLoading(false));
  };

  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in, now check/create their Firestore document
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // This is a new user, create their document in Firestore
          try {
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: 'primary', // Default role
              partnerId: null, // Default partnerId
            });
          } catch (error) {
            console.error("Error creating user document in Firestore:", error);
          }
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
