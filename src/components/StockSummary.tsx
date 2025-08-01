import React, { useState } from 'react';
import { useStock } from '../hooks/useStock';

type StockSummaryProps = {
  onFilterChange: (showOnlyFeasible: boolean) => void;
};

const StockSummary: React.FC<StockSummaryProps> = ({ onFilterChange }) => {
  const { stock } = useStock();
  const [showOnlyFeasible, setShowOnlyFeasible] = useState(false);

  const handleToggle = () => {
    const newValue = !showOnlyFeasible;
    setShowOnlyFeasible(newValue);
    onFilterChange(newValue);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8f4e6 0%, #e8dcc0 100%)',
      border: '2px solid #8b7355',
      borderRadius: '8px',
      padding: '1rem',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '0.6rem',
      margin: '1rem 0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          color: '#3a2d13'
        }}>
          <input
            type="checkbox"
            checked={showOnlyFeasible}
            onChange={handleToggle}
            style={{
              width: '16px',
              height: '16px',
              cursor: 'pointer'
            }}
          />
          <span>🔍 Seulement les recettes faisables</span>
        </label>
        
        <div style={{
          marginLeft: 'auto',
          fontSize: '0.5rem',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          📦 {stock.length} ingrédients en stock
        </div>
      </div>

      {showOnlyFeasible && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.4rem',
          background: '#4ecdc4',
          borderRadius: '4px',
          color: 'white',
          fontSize: '0.5rem',
          textAlign: 'center'
        }}>
          ✅ Filtrage actif : Recettes réalisables uniquement
        </div>
      )}
    </div>
  );
};

export default StockSummary;
