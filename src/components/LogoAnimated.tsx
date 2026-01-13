import React from 'react';
import Logo from './Logo';

export interface LogoAnimatedProps {
  size?: 'small' | 'medium' | 'large' | number;
  variant?: 'option-a' | 'option-b' | 'option-c';
  dark?: boolean;
  monochrome?: boolean;
  withText?: boolean;
  text?: string;
  className?: string;
}

/**
 * LogoAnimated - Logo with heartbeat pulse and glow effects
 * Perfect for loading screens, splash screens, and interactive elements
 */
const LogoAnimated: React.FC<LogoAnimatedProps> = ({
  size = 'large',
  variant = 'option-a',
  dark = false,
  monochrome = false,
  withText = false,
  text = 'MAX',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <style>{`
        @keyframes max-heartbeat {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          25% {
            transform: scale(1.08);
            opacity: 0.8;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          75% {
            transform: scale(1.04);
            opacity: 0.85;
          }
        }

        @keyframes max-glow {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(0, 102, 204, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(0, 102, 204, 0.6));
          }
        }

        @keyframes max-pulse-ring {
          0% {
            r: 30px;
            opacity: 0.8;
            stroke-width: 1px;
          }
          100% {
            r: 45px;
            opacity: 0;
            stroke-width: 2px;
          }
        }

        .logo-animated-container {
          animation: max-heartbeat 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .logo-animated-glow {
          animation: max-glow 1.5s ease-in-out infinite;
        }

        .logo-animated-pulse-ring {
          animation: max-pulse-ring 1.5s ease-out infinite;
        }

        /* Dark mode adjustments */
        .dark .logo-animated-glow {
          animation: max-glow-dark 1.5s ease-in-out infinite;
        }

        @keyframes max-glow-dark {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(0, 204, 255, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 14px rgba(0, 204, 255, 0.7));
          }
        }

        /* Text animation */
        @keyframes max-text-fade {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        .logo-animated-text {
          animation: max-text-fade 2s ease-in-out infinite;
        }
      `}</style>

      {/* Outer glow container */}
      <div className="logo-animated-glow relative inline-flex items-center justify-center">
        {/* Logo container with heartbeat */}
        <div className="logo-animated-container">
          <Logo
            size={size}
            variant={variant}
            animated={true}
            dark={dark}
            monochrome={monochrome}
          />
        </div>
      </div>

      {/* Optional text below logo */}
      {withText && (
        <div className="mt-6 text-center">
          <p className="logo-animated-text text-lg font-bold text-primary">
            {text}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Medical Analysis eXpert
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * LoadingSpinner - Minimal animated logo for inline loading states
 * Smaller version suitable for buttons, modals, inline elements
 */
export const LoadingSpinner: React.FC<{
  size?: number;
  variant?: 'option-a' | 'option-b' | 'option-c';
  dark?: boolean;
}> = ({ size = 32, variant = 'option-a', dark = false }) => {
  return (
    <div className="inline-flex">
      <style>{`
        @keyframes spinner-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .spinner-rotating {
          animation: spinner-rotate 2s linear infinite;
        }
      `}</style>
      <div className="spinner-rotating">
        <Logo size={size} variant={variant} dark={dark} animated={false} />
      </div>
    </div>
  );
};

/**
 * PulsingBadge - Logo in a pulsing badge (for notifications, etc.)
 */
export const PulsingBadge: React.FC<{
  size?: number;
  variant?: 'option-a' | 'option-b' | 'option-c';
  dark?: boolean;
  status?: 'processing' | 'success' | 'error';
}> = ({ size = 48, variant = 'option-a', dark = false, status = 'processing' }) => {
  const statusColor = {
    processing: 'bg-blue-100 border-blue-300',
    success: 'bg-green-100 border-green-300',
    error: 'bg-red-100 border-red-300',
  };

  return (
    <div className="inline-flex">
      <style>{`
        @keyframes badge-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        .badge-pulsing {
          animation: badge-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      <div
        className={`badge-pulsing relative flex items-center justify-center rounded-full border-2 ${statusColor[status]}`}
        style={{ width: size, height: size }}
      >
        <div style={{ transform: 'scale(0.7)' }}>
          <Logo size={size * 0.6} variant={variant} dark={dark} animated={false} />
        </div>
      </div>
    </div>
  );
};

export default LogoAnimated;
