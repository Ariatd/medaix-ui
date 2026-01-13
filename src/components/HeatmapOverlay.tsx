import React, { useState, useMemo } from 'react';

interface HeatmapOverlayProps {
  originalImageUrl: string;
  heatmapImageUrl?: string;
  className?: string;
}

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({
  originalImageUrl,
  heatmapImageUrl,
  className = '',
}) => {
  const [opacity, setOpacity] = useState(50); // 0-100%
  const [isEnabled, setIsEnabled] = useState(true);

  const overlayStyle = useMemo(() => {
    if (!heatmapImageUrl || !isEnabled) return {};
    return {
      backgroundImage: `url(${heatmapImageUrl})`,
      opacity: opacity / 100,
      mixBlendMode: 'multiply' as const,
    };
  }, [heatmapImageUrl, opacity, isEnabled]);

  if (!heatmapImageUrl) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-gray-100 ${className}`}>
        <div className="flex h-64 items-center justify-center text-gray-400">
          <p>No heatmap available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image with Overlay */}
      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        <img
          src={originalImageUrl}
          alt="Original image"
          className="h-full w-full object-contain"
        />
        {isEnabled && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={overlayStyle}
            aria-label="Heatmap overlay"
          />
        )}
      </div>

      {/* Controls */}
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        {/* Toggle Button */}
        <div className="flex items-center justify-between">
          <label htmlFor="heatmap-toggle" className="text-sm font-medium text-gray-700">
            Show Heatmap
          </label>
          <button
            type="button"
            id="heatmap-toggle"
            onClick={() => setIsEnabled(!isEnabled)}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isEnabled ? 'bg-blue-600' : 'bg-gray-200'}
            `}
            role="switch"
            aria-checked={isEnabled}
            aria-label="Toggle heatmap overlay"
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                ${isEnabled ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        {/* Opacity Slider */}
        {isEnabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="opacity-slider" className="text-sm font-medium text-gray-700">
                Opacity
              </label>
              <span className="text-sm font-semibold text-gray-900">{opacity}%</span>
            </div>
            <input
              id="opacity-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
              aria-label="Adjust heatmap opacity"
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
  );
};

export default HeatmapOverlay;

