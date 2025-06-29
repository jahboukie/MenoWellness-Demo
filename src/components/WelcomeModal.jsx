import React from 'react';

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 text-left">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Metiscore Health Demo</h2>
        <p className="text-gray-600 mb-6">This interactive prototype demonstrates the core user-to-partner data flow of our platform. Follow the steps below to see the full lifecycle.</p>
        
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-lg">1. You are "Jane" (The Primary User):</h3>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Use the **Journal** to add an entry using the "Load an Example" dropdown.</li>
              <li>**Check the "Share with partner" box** and save it.</li>
              <li>Go to the **"Invite Your Partner"** section below and generate a code. **Copy this code.**</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">2. You are "John" (The Support Partner):</h3>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Open an **Incognito/Private** browser window and go to this same URL.</li>
              <li>**Sign in with a DIFFERENT Google account.**</li>
              <li>After logging in, manually change the URL to `/accept-invite`.</li>
              <li>Paste the code you copied and click **"Connect Accounts"**.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">3. The Magic Moment:</h3>
            <p className="ml-4 mt-1">You will be on the Partner Dashboard. Observe that you can now see the specific journal entry Jane chose to share, demonstrating our secure, real-time, user-permissioned data-sharing capability.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Got it, let's start!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
