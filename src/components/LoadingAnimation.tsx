import React from 'react';

interface LoadingAnimationProps {
  message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinning Loader */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>
      </div>
      
      {/* Message */}
      <p className="text-lg font-medium text-gray-700">{message}</p>
    </div>
  );
};

export default LoadingAnimation;