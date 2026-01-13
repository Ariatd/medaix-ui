import usePlatform from '../hooks/usePlatform';

export type Shortcut = {
  id: string;
  keys: string; // normalized keystring like "mod+k" or "mod+shift+l"
  label: string;
  section?: string;
  description?: string;
  platformOverrides?: { [key: string]: string };
};

// Helper to format display label for a given platform
export const formatShortcutForPlatform = (keys: string, isMac: boolean) => {
  // keys stored in normalized form: mod+k, mod+shift+l, esc, ctrl+/
  const parts = keys.split('+');
  const mapped = parts.map((p) => {
    if (p === 'mod') return isMac ? '⌘' : 'Ctrl';
    if (p === 'alt') return 'Alt';
    if (p === 'shift') return 'Shift';
    if (p === 'esc') return 'Esc';
    if (p.length === 1) return p.toUpperCase();
    return p;
  });
  return mapped.join(isMac ? '' : ' + ');
};

// Default registry of shortcuts
export const defaultShortcuts: Shortcut[] = [
  { id: 'search', keys: 'mod+k', label: 'Search', section: 'Navigation', description: 'Open global search' },
  { id: 'new-analysis', keys: 'mod+n', label: 'New Analysis', section: 'Actions', description: 'Create a new analysis' },
  { id: 'dashboard', keys: 'mod+d', label: 'Dashboard', section: 'Navigation' },
  { id: 'history', keys: 'mod+h', label: 'History', section: 'Navigation' },
  { id: 'settings', keys: 'mod+,', label: 'Settings', section: 'Navigation' },
  { id: 'help', keys: 'mod+/', label: 'Help', section: 'Help' },
  { id: 'theme-toggle', keys: 'mod+shift+l', label: 'Toggle Theme', section: 'Actions' },
  { id: 'logout', keys: 'mod+shift+q', label: 'Logout', section: 'Actions' },

  // Context-specific
  { id: 'upload', keys: 'mod+u', label: 'Upload (Upload page)', section: 'Upload' },
  { id: 'export', keys: 'mod+e', label: 'Export (Results)', section: 'Results' },
  { id: 'history-search', keys: 'mod+f', label: 'Search in History', section: 'History' },
  { id: 'close-modal', keys: 'esc', label: 'Close Modal', section: 'General' },
  { id: 'focus-search', keys: '/', label: 'Focus Search', section: 'Navigation' },
];

export default {};
