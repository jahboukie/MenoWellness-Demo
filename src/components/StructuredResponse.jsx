import React from 'react';

// A small helper component for displaying data points
const DataPoint = ({ label, value, color = 'text-gray-900' }) => (
  <div>
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className={`ml-2 font-medium ${color}`}>{value}</span>
  </div>
);

const StructuredResponse = ({ response }) => {
  if (!response) return null;

  // Determine the color for the crisis assessment based on risk level
  const getCrisisColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'medium':
      case 'elevated':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      default:
        return 'bg-green-100 border-green-500 text-green-900';
    }
  };

  return (
    <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">AI Analysis Report</h3>
      
      {/* Main Assessment Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h4 className="text-lg font-semibold text-blue-700 mb-2">Overall Assessment</h4>
        <p className="text-gray-700">{response.insights?.overall_assessment}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Sentiment Analysis Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg mb-2">Sentiment</h4>
          <DataPoint label="Category" value={response.sentiment?.category} />
          <DataPoint label="Score" value={Number(response.sentiment?.score).toFixed(2)} />
        </div>

        {/* Emotions Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg mb-2">Emotions</h4>
          <DataPoint label="Primary" value={response.emotions?.primary} />
          <DataPoint label="Intensity" value={Number(response.emotions?.emotional_intensity).toFixed(2)} />
        </div>

        {/* Crisis Assessment Card - with dynamic coloring */}
        <div className={`p-4 rounded-lg shadow-sm border-l-4 ${getCrisisColor(response.crisisAssessment?.risk_level)}`}>
          <h4 className="font-semibold text-lg mb-2">Crisis Assessment</h4>
          <DataPoint label="Risk Level" value={response.crisisAssessment?.risk_level} color="font-bold" />
          <DataPoint label="Action" value={response.crisisAssessment?.recommended_action} />
        </div>
      </div>
    </div>
  );
};

export default StructuredResponse;
