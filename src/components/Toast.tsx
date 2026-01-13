import React from 'react';
import { useToast } from '../context/ToastContext';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white animate-slide-in flex items-center gap-3 max-w-sm dark:shadow-lg
            ${
              toast.type === 'success'
                ? 'bg-success-600'
                : toast.type === 'error'
                  ? 'bg-danger-600'
                  : toast.type === 'warning'
                    ? 'bg-warning-600'
                    : 'bg-blue-600'
            }
          `}
        >
          <span>
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'warning' && '⚠'}
            {toast.type === 'info' && 'ℹ'}
          </span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white hover:opacity-80 ml-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
