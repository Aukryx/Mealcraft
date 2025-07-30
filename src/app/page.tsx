"use client"

import React, { useState } from 'react';
import Planning from '../components/Planning';
import Recettes from '../components/Recettes';
import Ingredients from '../components/Ingredients';

const tabs = [
  { key: 'planning', label: '📅 Planning' },
  { key: 'recettes', label: '🍲 Recettes' },
  { key: 'ingredients', label: '🥕 Ingrédients' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('planning');

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem',
      }}
    >
      <nav style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? 'var(--pixel-mint)' : 'var(--pixel-white)',
              color: 'var(--pixel-dark)',
              fontFamily: 'Press Start 2P, cursive',
              border: 'none',
              borderRadius: '8px',
              padding: '1rem 2rem',
              fontSize: '1rem',
              boxShadow: activeTab === tab.key ? '2px 2px 0 var(--pixel-blue)' : '2px 2px 0 var(--pixel-lightgray)',
              cursor: 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Section adaptative selon l'onglet */}
      <section style={{ 
        width: activeTab === 'recettes' ? '100%' : '100%', 
        maxWidth: activeTab === 'recettes' ? 'none' : '600px', 
        minHeight: 300 
      }}>
        {activeTab === 'planning' && <Planning />}
        {activeTab === 'recettes' && <Recettes />}
        {activeTab === 'ingredients' && <Ingredients />}
      </section>
    </main>
  );
}