import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  modifierKey?: 'ctrlOrCmd' | 'shift' | 'alt'
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check modifier
      if (modifierKey === 'ctrlOrCmd') {
        const isModifier = e.metaKey || e.ctrlKey;
        if (!isModifier) return;
      } else if (modifierKey === 'shift' && !e.shiftKey) {
        return;
      } else if (modifierKey === 'alt' && !e.altKey) {
        return;
      }

      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, modifierKey]);
}
