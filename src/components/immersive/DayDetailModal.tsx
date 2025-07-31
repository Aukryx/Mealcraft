import React from "react";

type Props = {
  day: number;
  currentYear: number;
  currentMonth: number;
  planning: { [day: number]: { lunch?: string; dinner?: string } };
  onClose: () => void;
};

export default function DayDetailModal({ day, currentYear, currentMonth, planning, onClose }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #fff8e1, #f5f5dc)',
          border: '4px solid #8b4513',
          borderRadius: '16px',
          minWidth: '400px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          fontFamily: 'Press Start 2P, cursive',
          position: 'relative',
          textAlign: 'center',
          color: '#8b4513'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >×</button>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          {day} {new Date(currentYear, currentMonth).toLocaleString('fr-FR', { month: 'long' })}
        </h2>
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            🥗 <strong>Déjeuner:</strong> {planning[day]?.lunch || 'Non planifié'}
          </div>
          <div>
            🍽️ <strong>Dîner:</strong> {planning[day]?.dinner || 'Non planifié'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.7rem 1.2rem',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}>
            Planifier repas
          </button>
          <button style={{
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.7rem 1.2rem',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}>
            Générer suggestions
          </button>
        </div>
      </div>
    </div>
  );
}
