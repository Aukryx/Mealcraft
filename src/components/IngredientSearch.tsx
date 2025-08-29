import React, { useState, useRef, useEffect } from 'react';
import { useIngredientSearch, ingredientIdService } from '../services/ingredientIdService';

type IngredientSearchProps = {
  onSelect: (ingredient: { id: string; numId: number; nom: string }) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

const IngredientSearch: React.FC<IngredientSearchProps> = ({ 
  onSelect, 
  value = "",
  placeholder = "Rechercher un ingrédient...",
  disabled = false 
}) => {
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useIngredientSearch();
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer les résultats si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gestion du clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleSelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (ingredient: { id: string; numId: number; nom: string }) => {
    onSelect(ingredient);
    setSearchQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(value.length >= 2);
    setSelectedIndex(-1);
  };

  return (
    <div 
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
    >
      <input
        ref={inputRef}
        type="text"
        value={searchQuery || value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '2px solid #8b7355',
          borderRadius: '4px',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: value ? '1.1rem' : '0.6rem',
          fontWeight: value ? 'bold' : 'normal',
          background: disabled ? '#f5f5f5' : 'white',
          color: disabled ? '#999' : '#333',
          outline: 'none'
        }}
      />

      {/* Résultats de recherche */}
      {showResults && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '2px solid #8b7355',
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {isSearching ? (
            <div style={{
              padding: '0.5rem',
              textAlign: 'center',
              color: '#666',
              fontSize: '0.5rem'
            }}>
              🔍 Recherche...
            </div>
          ) : searchResults.length === 0 ? (
            <div style={{
              padding: '0.5rem',
              textAlign: 'center',
              color: '#666',
              fontSize: '0.5rem'
            }}>
              Aucun ingrédient trouvé
            </div>
          ) : (
            searchResults.map((ingredient, index) => (
              <button
                type="button"
                key={ingredient.id}
                onClick={() => handleSelect(ingredient)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: 'none',
                  background: selectedIndex === index ? '#4ecdc4' : 'white',
                  color: selectedIndex === index ? 'white' : '#333',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.5rem',
                  borderBottom: index < searchResults.length - 1 ? '1px solid #eee' : 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>{ingredient.nom}</span>
                  <span style={{ 
                    fontSize: '0.4rem', 
                    opacity: 0.7,
                    background: selectedIndex === index ? 'rgba(255,255,255,0.2)' : '#f0f0f0',
                    padding: '0.1rem 0.3rem',
                    borderRadius: '2px'
                  }}>
                    #{ingredient.numId}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;
