import React, { useState, useEffect } from 'react';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  message, 
  onClose,
  autoClose = false,
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="animate-fade-in-down mb-4 rounded-lg border-2 border-danger bg-danger-50 p-4 shadow-md"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          className="h-6 w-6 flex-shrink-0 text-danger"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <div className="flex-1">
          <p className="font-bold text-danger">Error</p>
          <p className="mt-1 text-sm text-[#333333]">{message}</p>
        </div>

        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="flex-shrink-0 text-danger transition hover:scale-110"
            aria-label="Close alert"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;