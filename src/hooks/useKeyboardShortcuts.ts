import { useEffect } from 'react';

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        return (
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          (shortcut.ctrl ?? false) === event.ctrlKey &&
          (shortcut.alt ?? false) === event.altKey &&
          (shortcut.shift ?? false) === event.shiftKey
        );
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [shortcuts]);
}

// Raccourcis globaux pour l'application
export function useGlobalShortcuts(setActiveObject: (obj: 'calendar' | 'cookbook' | 'fridge' | 'pantry' | null) => void) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      alt: true,
      action: () => setActiveObject('cookbook'),
      description: 'Alt+1: Ouvrir le livre de recettes'
    },
    {
      key: '2',
      alt: true,
      action: () => setActiveObject('fridge'),
      description: 'Alt+2: Ouvrir le frigo'
    },
    {
      key: '3',
      alt: true,
      action: () => setActiveObject('pantry'),
      description: 'Alt+3: Ouvrir le placard'
    },
    {
      key: '4',
      alt: true,
      action: () => setActiveObject('calendar'),
      description: 'Alt+4: Ouvrir le planning'
    },
    {
      key: 'Escape',
      action: () => setActiveObject(null),
      description: 'Échap: Fermer les modales'
    },
    {
      key: 'h',
      ctrl: true,
      action: () => showHelp(),
      description: 'Ctrl+H: Afficher l\'aide'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  const showHelp = () => {
    const helpText = shortcuts
      .map(s => s.description)
      .join('\n');
    alert(`Raccourcis clavier disponibles :\n\n${helpText}`);
  };

  return { shortcuts };
}
