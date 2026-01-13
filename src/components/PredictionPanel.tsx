import React from 'react';

interface PredictionPanelProps {
  label: string;
  confidence: number; // 0-1
  uncertainty?: number; // 0-1
  explanation?: string;
  className?: string;
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({
  label,
  confidence,
  uncertainty,
  explanation,
  className = '',
}) => {
  const getUncertaintyLevel = (uncertaintyValue?: number): 'Low' | 'Medium' | 'High' => {
    if (uncertaintyValue === undefined) return 'Low';
    if (uncertaintyValue < 0.3) return 'Low';
    if (uncertaintyValue < 0.7) return 'Medium';
    return 'High';
  };

  const getUncertaintyColor = (level: 'Low' | 'Medium' | 'High'): string => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
    }
  };

  const uncertaintyLevel = getUncertaintyLevel(uncertainty);
  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Prediction</h3>
      </div>

      {/* Label */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-bold text-gray-900">{label}</h4>
          <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-800">
            {confidencePercentage}%
          </span>
        </div>
      </div>

      {/* Confidence Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Confidence</span>
          <span className="text-sm text-gray-500">{confidencePercentage}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${confidencePercentage}%` }}
            role="progressbar"
            aria-valuenow={confidencePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Confidence: ${confidencePercentage}%`}
          />
        </div>
      </div>

      {/* Uncertainty Level */}
      {uncertainty !== undefined && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Uncertainty</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getUncertaintyColor(
                uncertaintyLevel
              )}`}
            >
              {uncertaintyLevel}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-500 ${
                uncertaintyLevel === 'Low'
                  ? 'bg-green-500'
                  : uncertaintyLevel === 'Medium'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.round(uncertainty * 100)}%` }}
              role="progressbar"
              aria-valuenow={Math.round(uncertainty * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Uncertainty: ${uncertaintyLevel}`}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Uncertainty: {Math.round(uncertainty * 100)}%
          </p>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h5 className="mb-2 text-sm font-semibold text-gray-900">Explanation</h5>
          <p className="text-sm leading-relaxed text-gray-700">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;

