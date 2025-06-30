import React, { useState } from 'react';

const DemoGuide = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <button onClick={() => setIsOpen(true)} className="text-blue-600 font-semibold hover:underline">
          Show Demo Instructions
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-left border-t-4 border-blue-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">🚀 Quick Start Demo Guide</h2>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
          Hide
        </button>
      </div>
      <p className="text-gray-600 mb-6">Follow these steps to experience the core user-to-partner data flow.</p>
      
      <div className="space-y-4 text-gray-700">
        <div>
          <h3 className="font-semibold text-lg">1. As the Primary User ("Jane"):</h3>
          <ul className="list-decimal list-inside ml-4 mt-1 space-y-1">
            <li>Use the **Journal** to add an entry (you can use the "Load an Example" dropdown).</li>
            <li>**Check the "Share with partner" box** before saving.</li>
            <li>In the **"Invite Your Partner"** section, generate and **copy the 6-digit code**.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg">2. As the Support Partner ("John"):</h3>
          <ul className="list-decimal list-inside ml-4 mt-1 space-y-1">
            <li>Open an **Incognito/Private** browser window and go to this same URL.</li>
            <li>**Sign in with a DIFFERENT Google account.**</li>
            <li>After logging in, manually change the URL in the address bar to `/accept-invite`.</li>
            <li>Paste the code and click **"Connect Accounts"**.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg">3. The Magic Moment:</h3>
          <p className="ml-4 mt-1">You will be on the Partner Dashboard. Observe that only the journal entry Jane chose to share is visible. This demonstrates our secure, real-time, user-permissioned data sharing.</p>
        </div>
      </div>
    </div>
  );
};

export default DemoGuide;
