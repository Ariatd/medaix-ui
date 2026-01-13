import React, { useContext, useEffect, useMemo, useState } from 'react';
import { KeyboardContext } from './KeyboardShortcutsProvider';
import usePlatform from '../hooks/usePlatform';
import { formatShortcutForPlatform } from '../utils/keyboardShortcuts';

const KeyboardShortcutsModal: React.FC = () => {
  const kb = useContext(KeyboardContext);
  const platform = usePlatform();
  const [query, setQuery] = useState('');
  const [learnMode, setLearnMode] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

  // Guard: if context is not available, don't render
  if (!kb) return null;

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const s of kb.shortcuts) {
      const sec = s.section || 'General';
      groups[sec] = groups[sec] || [];
      groups[sec].push(s);
    }
    return groups;
  }, [kb.shortcuts]);

  useEffect(() => {
    if (!learnMode) return;
    const onKey = (ev: KeyboardEvent) => {
      setPressed(ev.key);
    };
    window.addEventListener('keydown', onKey as any);
    return () => window.removeEventListener('keydown', onKey as any);
  }, [learnMode]);

  if (!kb.helpOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Keyboard Shortcuts" className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => kb.closeHelp()} />
      <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-auto max-h-[80vh] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Press <strong>{platform.isMac ? '⌘' : 'Ctrl'}</strong> for modifier. Search and print shortcuts here.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className="px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700"
              aria-label="Search shortcuts"
            />
            <button onClick={() => setLearnMode((s) => !s)} className="px-3 py-2 rounded bg-primary text-white">{learnMode ? 'Stop Learn' : 'Learn'}</button>
            <button onClick={() => kb.closeHelp()} className="px-3 py-2 rounded border">Close</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(grouped).map((section) => (
            <div key={section}>
              <h3 className="font-semibold mb-3">{section}</h3>
              <ul className="space-y-2">
                {grouped[section]
                  .filter((s: any) => s.label.toLowerCase().includes(query.toLowerCase()) || (s.description || '').toLowerCase().includes(query.toLowerCase()))
                  .map((s: any) => (
                    <li key={s.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div>
                        <div className="font-medium">{s.label}</div>
                        {s.description && <div className="text-xs text-gray-500">{s.description}</div>}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-200">
                        {formatShortcutForPlatform(s.keys, platform.isMac)}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-gray-500">Printable version available. <button className="underline">Print</button></div>
          <div className="text-sm text-gray-600">Learn mode: {learnMode ? <strong>{pressed ?? 'press a key'}</strong> : 'inactive'}</div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
