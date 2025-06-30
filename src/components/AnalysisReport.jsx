import React from 'react';

// This component already has a great light theme structure, so only minor tweaks are needed.

const getCrisisColor = (level) => {
  const s = String(level).toLowerCase();
  if (['high', 'critical'].includes(s)) return 'bg-red-100 border-red-500 text-red-900';
  if (['medium', 'elevated'].includes(s)) return 'bg-yellow-100 border-yellow-500 text-yellow-900';
  return 'bg-green-100 border-green-500 text-green-900';
};

const StructuredResponse = ({ response }) => {
  if (!response || response.error) {
    return <div className="mt-6 text-center text-red-600">Error: {response?.error || 'Analysis could not be completed.'}</div>;
  }

  const { insights = {}, sentiment = {}, emotions = {}, crisisAssessment = {} } = response;

  return (
    // ✨ Changed main container to be transparent as the parent card now has the background
    <div className="bg-transparent rounded-lg">
      <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">AI Analysis Report</h3>
      
      <div className="bg-white/80 p-4 rounded-lg shadow-sm mb-4">
        <h4 className="text-lg font-semibold text-blue-700 mb-2">Overall Assessment</h4>
        <p className="text-slate-700">{insights.overall_assessment || 'No assessment available.'}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/80 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg mb-2 text-slate-700">Sentiment</h4>
          <p className="text-slate-600">Category: {sentiment.category || 'N/A'}</p>
          <p className="text-slate-600">Score: {sentiment.score?.toFixed(2) || 'N/A'}</p>
        </div>
        <div className="bg-white/80 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg mb-2 text-slate-700">Emotions</h4>
          <p className="text-slate-600">Primary: {emotions.primary || 'N/A'}</p>
          <p className="text-slate-600">Intensity: {emotions.emotional_intensity?.toFixed(2) || 'N/A'}</p>
        </div>
        <div className={`p-4 rounded-lg shadow-sm border-l-4 ${getCrisisColor(crisisAssessment.risk_level)} md:col-span-2`}>
          <h4 className="font-semibold text-lg mb-2">Crisis Assessment</h4>
          <p>Risk: {crisisAssessment.risk_level || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default StructuredResponse;
