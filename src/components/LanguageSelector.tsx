import React from 'react';
import { useTranslation } from '../utils/i18n';

// Composant de sélecteur de langue
export default function LanguageSelector() {
  const { language, changeLanguage } = useTranslation();
  
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button
        onClick={() => changeLanguage('fr')}
        style={{
          background: language === 'fr' ? '#28a745' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontSize: '0.8rem'
        }}
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => changeLanguage('en')}
        style={{
          background: language === 'en' ? '#28a745' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontSize: '0.8rem'
        }}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
