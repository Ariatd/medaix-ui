import React from 'react';
import usePlatform from '../hooks/usePlatform';
import { formatShortcutForPlatform } from '../utils/keyboardShortcuts';

interface Props {
  content: string;
  shortcut?: string; // normalized like 'mod+k' or '/'
  children: React.ReactElement;
}

const SmartTooltip: React.FC<Props> = ({ content, shortcut, children }) => {
  const platform = usePlatform();

  const showShortcut = !platform.isTouch && shortcut;
  const formatted = showShortcut ? formatShortcutForPlatform(shortcut!, platform.isMac) : null;

  // Clone child to attach aria and title for screen readers
  const child = React.cloneElement(children, {
    'aria-label': content + (formatted ? ` (${formatted})` : ''),
    title: content + (formatted ? ` (${formatted})` : ''),
  });

  return (
    <span className="relative group inline-flex items-center">
      {child}
      <span className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 z-50">
        {content}{formatted ? ` (${formatted})` : ''}
      </span>
    </span>
  );
};

export default SmartTooltip;
