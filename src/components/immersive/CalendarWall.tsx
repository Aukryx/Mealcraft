import React from "react";
import Planning from "../Planning";

type Props = {
  onClose: () => void;
};

export default function CalendarWall({ onClose }: Props) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #fff8e1, #f5f5dc)',
      border: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      padding: 0,
      zIndex: 1000,
      overflow: 'auto',
      fontFamily: 'Press Start 2P, cursive',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '1.5rem', right: '2rem',
        background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px',
        padding: '0.7rem 1.3rem', cursor: 'pointer', fontSize: '1.2rem', zIndex: 10
      }}>×</button>
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem 0 0 0' }}>
        <Planning />
      </div>
    </div>
  );
}
