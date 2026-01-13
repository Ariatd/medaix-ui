import React, { useEffect, useState } from 'react';
import LogoAnimated from './LogoAnimated';

export interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number; // milliseconds to show splash
  variant?: 'option-a' | 'option-b' | 'option-c';
  dark?: boolean;
}

/**
 * SplashScreen - Full-screen introduction animation (3 seconds default)
 * Displays animated MedAIx logo with fade-in/out effects
 */
const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 3000,
  variant = 'option-a',
  dark = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 600); // Start fade out 600ms before duration ends

    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <style>{`
        @keyframes splash-fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes splash-fade-out {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(1.05);
          }
        }

        @keyframes splash-text-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes splash-text-fade-out {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .splash-container {
          animation: splash-fade-in 0.8s ease-out forwards;
        }

        .splash-container.exiting {
          animation: splash-fade-out 0.6s ease-in forwards;
        }

        .splash-text {
          animation: splash-text-fade-in 1s ease-out 0.2s forwards;
          animation-fill-mode: both;
        }

        .splash-container.exiting .splash-text {
          animation: splash-text-fade-out 0.6s ease-in forwards !important;
        }

        .splash-subtitle {
          animation: splash-text-fade-in 1s ease-out 0.4s forwards;
          animation-fill-mode: both;
        }

        .splash-container.exiting .splash-subtitle {
          animation: splash-text-fade-out 0.6s ease-in 0.1s forwards !important;
        }

        /* Decorative elements */
        @keyframes splash-dot-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .splash-dot {
          animation: splash-dot-pulse 2s ease-in-out infinite;
        }

        .splash-dot:nth-child(1) {
          animation-delay: 0s;
        }

        .splash-dot:nth-child(2) {
          animation-delay: 0.3s;
        }

        .splash-dot:nth-child(3) {
          animation-delay: 0.6s;
        }

        /* Prevent scrolling while splash is visible */
        body.splash-active {
          overflow: hidden;
        }
      `}</style>

      <div className={`splash-container ${isExiting ? 'exiting' : ''} flex flex-col items-center justify-center gap-8`}>
        {/* Logo */}
        <div>
          <LogoAnimated
            size="large"
            variant={variant}
            dark={dark}
            withText={false}
          />
        </div>

        {/* Main Text */}
        <div className="text-center">
          <h1 className="splash-text text-4xl font-bold text-gray-900 dark:text-white">
            MedAIx
          </h1>
          <p className="splash-subtitle mt-3 text-lg text-gray-600 dark:text-gray-300">
            Medical Analysis eXpert
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="splash-dot h-2 w-2 rounded-full bg-primary"></span>
          <span className="splash-dot h-2 w-2 rounded-full bg-primary"></span>
          <span className="splash-dot h-2 w-2 rounded-full bg-primary"></span>
        </div>

        {/* Tagline */}
        <p className="splash-text mt-8 text-center text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          AI-Powered Medical Image Analysis
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
