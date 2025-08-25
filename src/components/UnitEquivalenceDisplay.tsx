// Composant pour afficher les équivalences d'unités à l'utilisateur
import React, { useState } from 'react';
import { 
  UNIT_CONVERSIONS, 
  getUnitEquivalence, 
  getIngredientEquivalences,
  convertWithIngredientSpecific,
  UnitInfo 
} from '../utils/unitConverter';

interface UnitEquivalenceProps {
  ingredientName?: string;
  showAllUnits?: boolean;
  compact?: boolean;
}

export const UnitEquivalenceDisplay: React.FC<UnitEquivalenceProps> = ({
  ingredientName,
  showAllUnits = false,
  compact = false
}) => {
  const [expanded, setExpanded] = useState(!compact);
  
  // Obtenir les équivalences spécifiques à l'ingrédient
  const ingredientEquivalences = ingredientName ? getIngredientEquivalences(ingredientName) : [];
  
  // Grouper les unités par type
  const unitsByType = Object.entries(UNIT_CONVERSIONS).reduce((acc, [unit, info]) => {
    if (!acc[info.type]) acc[info.type] = [];
    acc[info.type].push({ unit, info });
    return acc;
  }, {} as Record<string, Array<{ unit: string; info: UnitInfo }>>);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weight': return '⚖️';
      case 'volume': return '🥤';
      case 'piece': return '🔢';
      case 'special': return '✨';
      default: return '📏';
    }
  };
  
  const getTypeName = (type: string) => {
    switch (type) {
      case 'weight': return 'Poids';
      case 'volume': return 'Volume';
      case 'piece': return 'Quantité';
      case 'special': return 'Spécial';
      default: return 'Autre';
    }
  };
  
  if (compact && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          background: 'rgba(33, 150, 243, 0.1)',
          border: '1px solid rgba(33, 150, 243, 0.3)',
          borderRadius: '6px',
          padding: '0.5rem',
          color: '#2196F3',
          fontSize: '0.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        📏 Voir les équivalences
      </button>
    );
  }
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      padding: '1rem',
      margin: '1rem 0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          margin: 0,
          color: '#2d3748',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}>
          📏 Guide des équivalences
          {ingredientName && (
            <span style={{ color: '#4CAF50', fontSize: '0.9rem' }}>
              {' '}• {ingredientName}
            </span>
          )}
        </h3>
        {compact && (
          <button
            onClick={() => setExpanded(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Équivalences spécifiques à l'ingrédient */}
      {ingredientEquivalences.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{
            color: '#4CAF50',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            🎯 Conversions pour {ingredientName}
          </h4>
          <div style={{
            background: 'rgba(76, 175, 80, 0.05)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem'
          }}>
            {ingredientEquivalences.map((equiv, index) => (
              <div key={index} style={{
                padding: '0.25rem 0',
                fontSize: '0.8rem',
                color: '#2d3748',
                borderBottom: index < ingredientEquivalences.length - 1 ? '1px solid rgba(76, 175, 80, 0.1)' : 'none'
              }}>
                <strong>{equiv.description}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Équivalences générales */}
      {(showAllUnits || !ingredientName) && (
        <div>
          <h4 style={{
            color: '#666',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}>
            📋 Équivalences générales
          </h4>
          
          {Object.entries(unitsByType).map(([type, units]) => (
            <div key={type} style={{ marginBottom: '1rem' }}>
              <h5 style={{
                color: '#4a5568',
                fontSize: '0.8rem',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {getTypeIcon(type)} {getTypeName(type)}
              </h5>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '0.5rem',
                marginLeft: '1rem'
              }}>
                {units.map(({ unit, info }) => (
                  <div key={unit} style={{
                    background: 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '0.75rem'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#2d3748' }}>
                      {unit} - {info.displayName}
                    </div>
                    {info.equivalence && (
                      <div style={{ color: '#666', marginTop: '0.25rem' }}>
                        {info.equivalence}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Note explicative */}
      <div style={{
        background: 'rgba(255, 193, 7, 0.1)',
        border: '1px solid rgba(255, 193, 7, 0.3)',
        borderRadius: '6px',
        padding: '0.75rem',
        marginTop: '1rem'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#5d4e00',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          💡 <strong>Astuce :</strong> Ces équivalences vous aident à convertir les mesures abstraites en quantités précises. 
          Les conversions d&apos;ingrédients spécifiques sont plus précises que les conversions générales.
        </div>
      </div>
    </div>
  );
};

// Composant simple pour afficher une équivalence inline
export const InlineEquivalence: React.FC<{
  unit: string;
  ingredientName?: string;
}> = ({ unit, ingredientName }) => {
  const equivalence = getUnitEquivalence(unit);
  const ingredientEquivalences = ingredientName ? getIngredientEquivalences(ingredientName) : [];
  
  // Chercher une équivalence spécifique pour cet ingrédient et cette unité
  const specificEquiv = ingredientEquivalences.find(eq => eq.from === unit);
  
  const displayText = specificEquiv ? specificEquiv.description : equivalence;
  
  if (!displayText) return null;
  
  return (
    <span style={{
      fontSize: '0.7rem',
      color: '#666',
      fontStyle: 'italic',
      marginLeft: '0.5rem'
    }}>
      ({displayText})
    </span>
  );
};

// Hook pour calculer et afficher les conversions
export const useUnitConverter = () => {
  const [conversions, setConversions] = useState<Array<{
    original: { quantity: number; unit: string };
    converted: { quantity: number; unit: string };
    description?: string;
  }>>([]);
  
  const convertIngredient = (
    quantity: number,
    fromUnit: string,
    ingredientName: string
  ) => {
    const result = convertWithIngredientSpecific(quantity, fromUnit, ingredientName);
    
    const conversion = {
      original: { quantity, unit: fromUnit },
      converted: { quantity: result.quantity, unit: result.unit },
      description: result.usedConversion
    };
    
    setConversions(prev => [...prev, conversion]);
    return result;
  };
  
  const clearConversions = () => setConversions([]);
  
  return {
    conversions,
    convertIngredient,
    clearConversions
  };
};

export default UnitEquivalenceDisplay;
