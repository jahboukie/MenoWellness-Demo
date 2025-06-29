import React from 'react';

const getCrisisColor = (level) => {
  const s = String(level).toLowerCase();
  if (['high', 'critical'].includes(s)) return 'bg-red-100 border-red-500 text-red-900';
  if (['medium', 'elevated'].includes(s)) return 'bg-yellow-100 border-yellow-500 text-yellow-900';
  return 'bg-green-100 border-green-500 text-green-900';
};

const StructuredResponse = ({ response }) => {
  if (!response || response.error) {
    return <div className="mt-6 text-center text-red-500">Error: {response?.error || 'Analysis could not be completed.'}</div>;
  }

  const { insights = {}, sentiment = {}, emotions = {}, crisisAssessment = {} } = response;

  return (
    <div className="mt-6 p-4 bg-slate-100 rounded-lg border">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">AI Analysis Report</h3>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h4 className="text-lg font-semibold text-blue-700 mb-2">Overall Assessment</h4>
        <p className="text-gray-700">{insights.overall_assessment || 'No assessment available.'}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg mb-2">Sentiment</h4>
          <p>Category: {sentiment.category || 'N/A'}</p>
          <p>Score: {sentiment.score?.toFixed(2) || 'N/A'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg mb-2">Emotions</h4>
          <p>Primary: {emotions.primary || 'N/A'}</p>
          <p>Intensity: {emotions.emotional_intensity?.toFixed(2) || 'N/A'}</p>
        </div>
        <div className={`p-4 rounded-lg shadow-sm border-l-4 ${getCrisisColor(crisisAssessment.risk_level)}`}>
          <h4 className="font-semibold text-lg mb-2">Crisis Assessment</h4>
          <p>Risk: {crisisAssessment.risk_level || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default StructuredResponse;
