import React from 'react';
import usePlatform from '../hooks/usePlatform';

const ShortcutHint: React.FC<{ keys: string; className?: string }> = ({ keys, className = '' }) => {
  const platform = usePlatform();
  // keys in normalized form like mod+k
  const parts = keys.split('+').map((p) => {
    if (p === 'mod') return platform.isMac ? '⌘' : 'Ctrl';
    if (p === 'alt') return 'Alt';
    if (p === 'shift') return 'Shift';
    if (p === 'esc') return 'Esc';
    return p.length === 1 ? p.toUpperCase() : p;
  });

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 ${className}`} aria-hidden>
      {parts.map((p, i) => (
        <span key={i} className="font-medium">{p}{i < parts.length - 1 && (platform.isMac ? '' : ' + ')}</span>
      ))}
    </span>
  );
};

export default ShortcutHint;
