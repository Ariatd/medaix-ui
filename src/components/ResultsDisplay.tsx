import React, { useState, useMemo } from 'react';

interface PredictionResult {
  label: string;
  confidence: number;
  uncertainty?: number;
}

interface ResultsDisplayProps {
  originalImage: string;
  heatmapImage?: string;
  predictions: PredictionResult[];
  className?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  originalImage,
  heatmapImage,
  predictions,
  className = '',
}) => {
  const [opacity, setOpacity] = useState(0.5);

  // Combine original image with heatmap overlay
  const overlayStyle = useMemo(() => {
    if (!heatmapImage) return {};
    return {
      backgroundImage: `url(${heatmapImage})`,
      opacity: opacity,
      mixBlendMode: 'multiply' as const,
    };
  }, [heatmapImage, opacity]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Warning Banner */}
      <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4" role="alert">
        <div className="flex items-start gap-3">
          <svg
            className="h-6 w-6 flex-shrink-0 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-yellow-800">Research Use Only</h3>
            <p className="mt-1 text-sm text-yellow-700">
              These results are for research and educational purposes only. Not a clinical diagnosis.
            </p>
          </div>
        </div>
      </div>

      {/* Image Comparison Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Original Image */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Original Image</h3>
          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <img
              src={originalImage}
              alt="Original medical image"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Heatmap Overlay */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Heatmap Overlay</h3>
            {heatmapImage && (
              <span className="text-sm text-gray-500">
                Opacity: {Math.round(opacity * 100)}%
              </span>
            )}
          </div>
          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <img
              src={originalImage}
              alt="Original image"
              className="h-full w-full object-contain"
            />
            {heatmapImage && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={overlayStyle}
                aria-label="Heatmap overlay"
              />
            )}
            {!heatmapImage && (
              <div className="flex h-64 items-center justify-center text-gray-400">
                <p>No heatmap available</p>
              </div>
            )}
          </div>
          
          {/* Opacity Slider */}
          {heatmapImage && (
            <div className="space-y-2">
              <label htmlFor="opacity-slider" className="block text-sm font-medium text-gray-700">
                Adjust Overlay Opacity
              </label>
              <input
                id="opacity-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prediction Results */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Prediction Results</h3>
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{prediction.label}</h4>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {Math.round(prediction.confidence * 100)}% confidence
                </span>
              </div>
              
              {/* Confidence Bar */}
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${prediction.confidence * 100}%` }}
                  role="progressbar"
                  aria-valuenow={prediction.confidence * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              
              {/* Uncertainty (if available) */}
              {prediction.uncertainty !== undefined && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Uncertainty:</span>
                  <span className="font-medium text-gray-800">
                    {Math.round(prediction.uncertainty * 100)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;

