import React from "react";

export default function KitchenInstructions() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '5%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontFamily: 'Press Start 2P, cursive',
      fontSize: '0.7rem',
      textAlign: 'center',
      zIndex: 10
    }}>
      Cliquez sur les objets pour interagir avec votre cuisine
    </div>
  );
}
