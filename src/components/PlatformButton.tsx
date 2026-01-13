import React from 'react';
import usePlatform from '../hooks/usePlatform';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shortcut?: string; // e.g., 'K' or 'mod+k' or 'Ctrl+K'
}

const formatShortcut = (shortcut: string | undefined, isMac: boolean) => {
  if (!shortcut) return null;
  // allow either 'K' or 'mod+k' formats
  const s = shortcut.includes('+') ? shortcut : `mod+${shortcut}`;
  const parts = s.split('+');
  const mapped = parts.map((p) => {
    const lower = p.toLowerCase();
    if (lower === 'mod') return isMac ? '⌘' : 'Ctrl';
    if (lower === 'alt') return 'Alt';
    if (lower === 'shift') return 'Shift';
    return p.length === 1 ? p.toUpperCase() : p;
  });
  return mapped.join(isMac ? '' : ' + ');
};

const PlatformButton: React.FC<Props> = ({ children, shortcut, className = '', ...rest }) => {
  const platform = usePlatform();
  const display = formatShortcut(shortcut, platform.isMac);

  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-3 px-4 py-2 rounded-md shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
    >
      <span>{children}</span>
      {display && (
        <span className="ml-2 text-xs text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
          {display}
        </span>
      )}
    </button>
  );
};

export default PlatformButton;
