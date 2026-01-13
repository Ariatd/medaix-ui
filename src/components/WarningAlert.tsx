import React, { useState, useEffect } from 'react';

interface WarningAlertProps {
  message: string;
  title?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const WarningAlert: React.FC<WarningAlertProps> = ({ 
  message,
  title = 'Warning',
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
      className="animate-fade-in-down mb-4 rounded-lg border-2 border-warning bg-warning-50 p-4 shadow-md"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          className="h-6 w-6 flex-shrink-0 text-warning"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <div className="flex-1">
          <p className="font-bold text-warning">{title}</p>
          <p className="mt-1 text-sm text-[#333333]">{message}</p>
        </div>

        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="flex-shrink-0 text-warning transition hover:scale-110"
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

export default WarningAlert;