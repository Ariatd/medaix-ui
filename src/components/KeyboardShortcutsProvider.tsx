import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultShortcuts } from '../utils/keyboardShortcuts';
import type { Shortcut } from '../utils/keyboardShortcuts';

type ShortcutHandler = (id: string, ev?: KeyboardEvent) => void;

type ContextValue = {
  shortcuts: Shortcut[];
  registerHandler: (id: string, fn: ShortcutHandler) => void;
  unregisterHandler: (id: string) => void;
  openHelp: () => void;
  closeHelp: () => void;
  helpOpen: boolean;
};

export const KeyboardContext = createContext<ContextValue | null>(null);

export const useKeyboardShortcutsContext = () => {
  const ctx = useContext(KeyboardContext);
  if (!ctx) throw new Error('useKeyboardShortcutsContext must be used within provider');
  return ctx;
};

const reservedBrowserCombos = new Set([
  'mod+t', // new tab (do not override)
  'mod+w', // close tab
  'mod+q',
  'mod+shift+n',
]);

const normalizeKeyEvent = (ev: KeyboardEvent) => {
  const parts: string[] = [];
  if (ev.metaKey) parts.push('mod');
  if (ev.ctrlKey && !ev.metaKey) parts.push('mod');
  if (ev.altKey) parts.push('alt');
  if (ev.shiftKey) parts.push('shift');
  let key = ev.key.toLowerCase();
  if (key === 'escape') key = 'esc';
  // convert single-character keys to literal
  parts.push(key);
  return parts.join('+');
};

export const KeyboardShortcutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Platform detection (kept if needed later)
  const [handlers, setHandlers] = useState<Record<string, ShortcutHandler>>({});
  const [helpOpen, setHelpOpen] = useState(false);
  const shortcuts = useMemo(() => defaultShortcuts, []);

  const registerHandler = useCallback((id: string, fn: ShortcutHandler) => {
    setHandlers((h) => ({ ...h, [id]: fn }));
  }, []);

  const unregisterHandler = useCallback((id: string) => {
    setHandlers((h) => {
      const copy = { ...h };
      delete copy[id];
      return copy;
    });
  }, []);

  const onKeyDown = useCallback((ev: KeyboardEvent) => {
    // ignore if focus is in input/textarea/select and key isn't explicit
    const target = ev.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    const editing = tag === 'input' || tag === 'textarea' || (target?.getAttribute?.('contenteditable') === 'true');

    const normalized = normalizeKeyEvent(ev);
    // don't override browser reserved combos
    if (reservedBrowserCombos.has(normalized)) return;

    // global help: '?' or mod+/
    if ((ev.key === '?' || normalized === 'mod+/')) {
      ev.preventDefault();
      setHelpOpen((s) => !s);
      return;
    }

    // allow ESC to close modals even when editing
    if (normalized === 'esc') {
      const handler = handlers['close-modal'];
      if (handler) {
        ev.preventDefault();
        handler('close-modal', ev);
      }
      return;
    }

    // if editing text, avoid capturing general shortcuts except explicit ones
    if (editing && !normalized.startsWith('mod')) return;

    // find matching shortcut
    for (const s of shortcuts) {
      if (s.keys === normalized) {
        const handler = handlers[s.id];
        if (handler) {
          try {
            ev.preventDefault();
            handler(s.id, ev);
            // visual feedback can be added here (toast, aria-live)
          } catch (err) {
            if (import.meta.env.DEV) console.warn('Shortcut handler error', err);
          }
        }
        break;
      }
    }
  }, [handlers, shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown as any);
    return () => window.removeEventListener('keydown', onKeyDown as any);
  }, [onKeyDown]);

  const value = useMemo<ContextValue>(() => ({
    shortcuts,
    registerHandler,
    unregisterHandler,
    openHelp: () => setHelpOpen(true),
    closeHelp: () => setHelpOpen(false),
    helpOpen,
  }), [shortcuts, registerHandler, unregisterHandler, helpOpen]);

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
};

export default KeyboardShortcutsProvider;
