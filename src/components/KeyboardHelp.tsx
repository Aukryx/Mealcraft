import React from 'react';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function KeyboardHelp({ visible, onClose }: Props) {
  if (!visible) return null;

  const shortcuts = [
    { keys: 'Alt + 1', action: 'Livre de recettes' },
    { keys: 'Alt + 2', action: 'Frigo' },
    { keys: 'Alt + 3', action: 'Placard' },
    { keys: 'Alt + 4', action: 'Planning' },
    { keys: 'Échap', action: 'Fermer' },
    { keys: 'Ctrl + H', action: 'Cette aide' },
    { keys: '↑↓', action: 'Navigation dans les listes' },
    { keys: 'Entrée', action: 'Sélectionner' },
    { keys: 'Tab', action: 'Navigation entre éléments' },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.8)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        fontFamily: 'Press Start 2P, cursive'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#8b4513' }}>⌨️ Raccourcis</h2>
          <button
            onClick={onClose}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {shortcuts.map((shortcut, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{
                background: '#f5f5f5',
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                border: '1px solid #ddd'
              }}>
                {shortcut.keys}
              </code>
              <span style={{ fontSize: '0.7rem', color: '#666' }}>
                {shortcut.action}
              </span>
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: '#e8f4f8', 
          borderRadius: '8px',
          fontSize: '0.6rem',
          color: '#666'
        }}>
          💡 Ces raccourcis fonctionnent dans toute l&apos;application pour une navigation rapide !
        </div>
      </div>
    </div>
  );
}
