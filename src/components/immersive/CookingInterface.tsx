import React, { useState } from 'react';
import { Recette } from '../../data/recettesDeBase';
import { useStock } from '../../hooks/useStock';
import { useSettings } from '../../hooks/useSettings';

type Props = {
  recette: Recette;
  onClose: () => void;
  onComplete: () => void;
};

export default function CookingInterface({ recette, onClose, onComplete }: Props) {
  const { settings } = useSettings();
  const { consumeRecipeIngredients, canMakeRecipe } = useStock();
  const [etapeActuelle, setEtapeActuelle] = useState(0);
  const [portions, setPortions] = useState(settings.portionsParDefaut);
  const [timers, setTimers] = useState<{ [key: number]: number }>({});
  const [notes, setNotes] = useState('');

  const handleComplete = () => {
    // Mode flexible : l'utilisateur choisit s'il consomme vraiment
    if (settings.consommationMode === 'reel') {
      const success = consumeRecipeIngredients(recette, portions);
      if (!success) {
        alert('Pas assez d\'ingrédients disponibles !');
        return;
      }
    }
    
    // Sauvegarder la session de cuisine
    const session = {
      recetteId: recette.id,
      portions,
      completedAt: new Date(),
      notes,
      ingredientsConsumed: settings.consommationMode === 'reel'
    };
    
    // Ici on pourrait sauvegarder dans l'historique
    localStorage.setItem('last_cooking_session', JSON.stringify(session));
    
    onComplete();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #fff8e1, #f5f5dc)',
      zIndex: 1000,
      padding: '2rem',
      fontFamily: 'Press Start 2P, cursive',
      overflow: 'auto'
    }}>
      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.2rem', color: '#8b4513' }}>{recette.nom}</h1>
        <button onClick={onClose} style={{
          background: '#dc3545', color: 'white', border: 'none',
          borderRadius: '8px', padding: '0.7rem 1.3rem', cursor: 'pointer'
        }}>×</button>
      </div>

      {/* Contrôles portions */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Portions:</span>
        <button onClick={() => setPortions(Math.max(1, portions - 1))}>-</button>
        <span>{portions}</span>
        <button onClick={() => setPortions(portions + 1)}>+</button>
        
        {settings.consommationMode === 'reel' && !canMakeRecipe(recette, portions) && (
          <span style={{ color: 'red', fontSize: '0.8rem' }}>
            ⚠️ Ingrédients insuffisants
          </span>
        )}
      </div>

      {/* Étapes */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Étape {etapeActuelle + 1} / {recette.etapes.length}</h2>
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px',
          border: '3px solid #8b4513',
          marginBottom: '1rem'
        }}>
          {recette.etapes[etapeActuelle]}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setEtapeActuelle(Math.max(0, etapeActuelle - 1))}
            disabled={etapeActuelle === 0}
          >
            ← Précédent
          </button>
          <button 
            onClick={() => setEtapeActuelle(Math.min(recette.etapes.length - 1, etapeActuelle + 1))}
            disabled={etapeActuelle === recette.etapes.length - 1}
          >
            Suivant →
          </button>
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '2rem' }}>
        <label>Notes personnelles:</label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Vos modifications, observations..."
          style={{ 
            width: '100%', 
            height: '100px', 
            marginTop: '0.5rem',
            padding: '1rem',
            borderRadius: '8px',
            border: '2px solid #8b4513'
          }}
        />
      </div>

      {/* Actions finales */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={handleComplete} style={{
          background: '#28a745', color: 'white', border: 'none',
          borderRadius: '8px', padding: '1rem 2rem', cursor: 'pointer',
          fontSize: '1rem'
        }}>
          {settings.consommationMode === 'reel' ? 'Terminer et consommer ingrédients' : 'Terminer la recette'}
        </button>
      </div>

      {/* Avertissement mode simulation */}
      {settings.consommationMode === 'simulation' && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,123,255,0.9)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '0.8rem'
        }}>
          Mode simulation : les ingrédients ne seront pas consommés
        </div>
      )}
    </div>
  );
}
