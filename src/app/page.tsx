"use client"

import React, { useState, useEffect } from 'react';
import { recettesDeBase, ingredientsDeBase, Ingredient } from '../data/recettesDeBase';
import Planning from '../components/Planning';
import RecettesResponsive from '../components/RecettesResponsive';
import Ingredients from '../components/Ingredients';

// Types d'objets interactifs
type InteractiveObject = 'calendar' | 'cookbook' | 'fridge' | 'pantry' | null;

// Catégories réfrigérées vs non-réfrigérées
const categoriesRefrigerees = ['produit laitier', 'viande', 'poisson'];
const categoriesNonRefrigerees = ['légume', 'fruit', 'féculent', 'épice', 'autre'];

// Couleurs et emojis pour les catégories
const categorieCouleurs: Record<string, string> = {
  "légume": "#A8E063",
  "fruit": "#FFD36E",
  "viande": "#FF8C8C",
  "poisson": "#6EC6FF",
  "féculent": "#F5E6B2",
  "produit laitier": "#FFF6E0",
  "épice": "#E0C3FC",
  "autre": "#D3D3D3",
};

const categorieEmojis: Record<string, string> = {
  "légume": "🥕",
  "fruit": "🍎",
  "viande": "🥩",
  "poisson": "🐟",
  "féculent": "🍞",
  "produit laitier": "🧀",
  "épice": "🧂",
  "autre": "🍽️",
};

// Modale Frigo/Placard avec onglets
function FridgePantryModal({ 
  initialTab, 
  onClose, 
  stock, 
  onStockChange 
}: { 
  initialTab: 'fridge' | 'pantry'; 
  onClose: () => void;
  stock: Ingredient[];
  onStockChange: (newStock: Ingredient[]) => void;
}) {
  const [tab, setTab] = useState<'fridge' | 'pantry'>(initialTab);
  const [filtre, setFiltre] = useState<'tous' | string>('tous');
  const [recherche, setRecherche] = useState('');

  // Catégories selon l'onglet
  const categories = tab === 'fridge' ? categoriesRefrigerees : categoriesNonRefrigerees;
  
  // Stock filtré (par catégorie et recherche)
  const stockFiltre = stock.filter((i: Ingredient) =>
    categories.includes(i.categorie) &&
    (filtre === 'tous' || i.categorie === filtre) &&
    (!recherche || i.nom.toLowerCase().includes(recherche.toLowerCase()))
  );
  
  // Suggestions d'ajout (ingrédients de base non possédés)
  const suggestions = ingredientsDeBase.filter(i =>
    categories.includes(i.categorie) &&
    (filtre === 'tous' || i.categorie === filtre) &&
    (!recherche || i.nom.toLowerCase().includes(recherche.toLowerCase())) &&
    !stock.find((s: Ingredient) => s.id === i.id)
  );

  // Ajout d'un ingrédient au stock utilisateur
  const handleAddIngredient = (ingredient: Ingredient) => {
    const newStock = stock.find(i => i.id === ingredient.id) 
      ? stock 
      : [...stock, { ...ingredient, quantite: 1 }];
    onStockChange(newStock);
  };

  // Retirer un ingrédient
  const handleRemove = (id: string) => {
    const newStock = stock.filter(i => i.id !== id);
    onStockChange(newStock);
  };

  // Changer la quantité
  const handleChangeQuantite = (id: string, delta: number) => {
    const newStock = stock.map(i =>
      i.id === id ? { ...i, quantite: Math.max(1, (i.quantite || 1) + delta) } : i
    );
    onStockChange(newStock);
  };

  // Liste des catégories de l'onglet
  const categoriesOnglet = ['tous', ...categories];

  // Reset des filtres quand on change d'onglet
  useEffect(() => {
    setFiltre('tous');
    setRecherche('');
  }, [tab]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: tab === 'fridge'
        ? 'linear-gradient(180deg, #e8f4f8, #d1e7dd)'
        : 'linear-gradient(180deg, #f8f3d4, #e2d7a7)',
      zIndex: 1000,
      padding: '0 1rem',
      fontFamily: 'Press Start 2P, cursive',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      overflow: 'auto',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '1.5rem', right: '2rem',
        background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px',
        padding: '0.7rem 1.3rem', cursor: 'pointer', fontSize: '1.2rem', zIndex: 10
      }}>×</button>
      
      {/* Onglets */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem', marginBottom: '1.5rem', gap: '2rem' }}>
        <button
          onClick={() => setTab('fridge')}
          style={{
            background: tab === 'fridge' ? '#e8f4f8' : '#f0f0f0',
            color: tab === 'fridge' ? '#495057' : '#888',
            border: tab === 'fridge' ? '3px solid #495057' : '1px solid #bbb',
            borderRadius: '12px 12px 0 0',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            padding: '1rem 2.5rem',
            cursor: 'pointer',
            boxShadow: tab === 'fridge' ? '0 4px 16px #49505733' : 'none',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >🧊 Frigo</button>
        <button
          onClick={() => setTab('pantry')}
          style={{
            background: tab === 'pantry' ? '#f8f3d4' : '#f0f0f0',
            color: tab === 'pantry' ? '#8b4513' : '#888',
            border: tab === 'pantry' ? '3px solid #8b4513' : '1px solid #bbb',
            borderRadius: '12px 12px 0 0',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            padding: '1rem 2.5rem',
            cursor: 'pointer',
            boxShadow: tab === 'pantry' ? '0 4px 16px #8b451333' : 'none',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >🗄️ Placard</button>
      </div>
      
      {/* Filtres catégorie */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
        {categoriesOnglet.map(cat => (
          <button key={cat}
            onClick={() => setFiltre(cat)}
            style={{ 
              background: filtre === cat ? (cat === 'tous' ? '#90EE90' : categorieCouleurs[cat] || '#fff') : '#fff', 
              color: '#333', 
              border: 'none', 
              borderRadius: 8, 
              padding: '0.5rem 1.2rem', 
              fontFamily: 'Press Start 2P, cursive', 
              cursor: 'pointer',
              fontSize: '0.7rem'
            }}>
            {cat !== 'tous' && categorieEmojis[cat] ? categorieEmojis[cat] + ' ' : ''}
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un ingrédient..."
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
        style={{ 
          width: '100%', 
          marginBottom: 18, 
          padding: '0.7rem 1rem', 
          borderRadius: 8, 
          border: '1.5px solid #90EE90', 
          fontFamily: 'Press Start 2P, cursive', 
          fontSize: 14, 
          maxWidth: 500, 
          marginLeft: 'auto', 
          marginRight: 'auto', 
          display: 'block' 
        }}
      />
      
      {/* Titre de section */}
      <h2 style={{ 
        textAlign: 'center', 
        color: tab === 'fridge' ? '#495057' : '#8b4513', 
        fontSize: '1.5rem', 
        marginBottom: '1rem' 
      }}>
        {tab === 'fridge' ? '🧊 Mon Frigo' : '🗄️ Mon Placard'}
      </h2>
      
      {/* Stock utilisateur */}
      <div style={{ marginBottom: 32 }}>
        {stockFiltre.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', margin: '2rem 0', fontSize: '0.8rem' }}>
            Aucun ingrédient dans cette catégorie.
          </div>
        ) : (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 16, 
            justifyContent: 'center' 
          }}>
            {stockFiltre.map((ing: Ingredient) => (
              <li key={ing.id} style={{ 
                background: categorieCouleurs[ing.categorie], 
                borderRadius: 12, 
                padding: '1.1rem 1.5rem', 
                minWidth: 120, 
                boxShadow: '2px 2px 0 #bfa76a', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                position: 'relative' 
              }}>
                <span style={{ fontSize: 32, marginBottom: 6 }}>{categorieEmojis[ing.categorie]}</span>
                <span style={{ fontWeight: 'bold', color: '#333', marginBottom: 4, fontSize: '0.7rem' }}>{ing.nom}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <button 
                    onClick={() => handleChangeQuantite(ing.id, -1)} 
                    style={{ 
                      fontSize: 18, 
                      border: 'none', 
                      background: '#fff', 
                      borderRadius: 6, 
                      cursor: 'pointer', 
                      width: 28, 
                      height: 28, 
                      fontWeight: 700 
                    }}>-</button>
                  <span style={{ fontFamily: 'Press Start 2P, cursive', fontSize: 12 }}>
                    {ing.quantite || 1} {ing.unite || ''}
                  </span>
                  <button 
                    onClick={() => handleChangeQuantite(ing.id, 1)} 
                    style={{ 
                      fontSize: 18, 
                      border: 'none', 
                      background: '#fff', 
                      borderRadius: 6, 
                      cursor: 'pointer', 
                      width: 28, 
                      height: 28, 
                      fontWeight: 700 
                    }}>+</button>
                </div>
                <button 
                  onClick={() => handleRemove(ing.id)} 
                  style={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    background: 'none', 
                    border: 'none', 
                    color: '#c0392b', 
                    fontSize: 20, 
                    cursor: 'pointer' 
                  }} 
                  title="Retirer">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Suggestions d'ajout */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: '#90EE90', fontSize: 18, marginBottom: 12, textAlign: 'center' }}>
          Ajouter un ingrédient
        </h3>
        {suggestions.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', fontSize: '0.8rem' }}>
            Aucun ingrédient à suggérer.
          </div>
        ) : (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 12, 
            justifyContent: 'center' 
          }}>
            {suggestions.map((ing: Ingredient) => (
              <li 
                key={ing.id} 
                style={{ 
                  background: categorieCouleurs[ing.categorie], 
                  borderRadius: 10, 
                  padding: '0.7rem 1.1rem', 
                  minWidth: 90, 
                  boxShadow: '1px 1px 0 #bfa76a', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  cursor: 'pointer', 
                  fontFamily: 'Press Start 2P, cursive' 
                }} 
                onClick={() => handleAddIngredient(ing)}>
                <span style={{ fontSize: 22 }}>{categorieEmojis[ing.categorie]}</span>
                <span style={{ fontWeight: 500, fontSize: '0.7rem' }}>{ing.nom}</span>
                <span style={{ fontSize: 18, color: '#3a2d13', marginLeft: 4 }}>+</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeObject, setActiveObject] = useState<InteractiveObject>(null);
  const [stock, setStock] = useState<Ingredient[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  // Simulation du planning
  const [planning, setPlanning] = useState<{ [day: number]: { lunch?: string; dinner?: string } }>({});

  // Date actuelle pour le calendrier
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Composant Calendrier Mural (Planning en full-screen)
  const CalendarWall = () => (
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
      <button onClick={() => setActiveObject(null)} style={{
        position: 'absolute', top: '1.5rem', right: '2rem',
        background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px',
        padding: '0.7rem 1.3rem', cursor: 'pointer', fontSize: '1.2rem', zIndex: 10
      }}>×</button>
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem 0 0 0' }}>
        <Planning />
      </div>
    </div>
  );

  // Composant Livre de Cuisine (RecettesResponsive en full-screen)
  const CookBook = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(45deg, #8b4513, #a0522d)',
      border: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      zIndex: 1000,
      overflow: 'auto',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      fontFamily: 'Press Start 2P, cursive',
    }}>
      <button onClick={() => setActiveObject(null)} style={{
        position: 'absolute', top: '1.5rem', right: '2rem',
        background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px',
        padding: '0.7rem 1.3rem', cursor: 'pointer', fontSize: '1.2rem', zIndex: 10
      }}>×</button>
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem 0 0 0' }}>
        <RecettesResponsive />
      </div>
    </div>
  );

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'url("/cuisine.png") center/cover',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Overlay pour améliorer la lisibilité */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.3)',
        zIndex: 1
      }} />
      
      {/* Interface principale avec objets interactifs */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
        {/* Calendrier mural (coin supérieur gauche) */}
        <div 
          onClick={() => setActiveObject('calendar')}
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '200px',
            height: '150px',
            background: 'linear-gradient(135deg, #fff8e1, #f5f5dc)',
            border: '6px solid #8b4513',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.8rem',
            color: '#8b4513',
            transition: 'transform 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
          <div>Planning</div>
          <div style={{ fontSize: '0.6rem', opacity: 0.7, marginTop: '0.3rem' }}>
            {today.toLocaleString('fr-FR', { month: 'short' })} {currentYear}
          </div>
        </div>
        
        {/* Livre de cuisine (centre supérieur) */}
        <div 
          onClick={() => setActiveObject('cookbook')}
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '250px',
            height: '180px',
            background: 'linear-gradient(45deg, #8b4513, #a0522d)',
            border: '8px solid #654321',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.9rem',
            color: '#fff',
            transition: 'transform 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📖</div>
          <div>Livre de</div>
          <div>Recettes</div>
        </div>
        
        {/* Frigo (côté gauche) */}
        <div 
          onClick={() => setActiveObject('fridge')}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: '180px',
            height: '300px',
            background: 'linear-gradient(180deg, #e8f4f8, #d1e7dd)',
            border: '6px solid #495057',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.8rem',
            color: '#495057',
            transition: 'transform 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧊</div>
          <div>Frigo</div>
          <div style={{ fontSize: '0.6rem', opacity: 0.7, marginTop: '0.5rem', textAlign: 'center' }}>
            {stock.filter(ing => categoriesRefrigerees.includes(ing.categorie)).length} articles
          </div>
        </div>
        
        {/* Placard (côté droit) */}
        <div 
          onClick={() => setActiveObject('pantry')}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '180px',
            height: '300px',
            background: 'linear-gradient(180deg, #f8f3d4, #e2d7a7)',
            border: '6px solid #8b4513',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.8rem',
            color: '#8b4513',
            transition: 'transform 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗄️</div>
          <div>Placard</div>
          <div style={{ fontSize: '0.6rem', opacity: 0.7, marginTop: '0.5rem', textAlign: 'center' }}>
            {stock.filter(ing => categoriesNonRefrigerees.includes(ing.categorie)).length} articles
          </div>
        </div>
        
        {/* Instructions d'utilisation */}
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
      </div>
      
      {/* Modales des objets interactifs */}
      {activeObject === 'calendar' && <CalendarWall />}
      {activeObject === 'cookbook' && <CookBook />}
      {(activeObject === 'fridge' || activeObject === 'pantry') && (
        <FridgePantryModal 
          initialTab={activeObject === 'fridge' ? 'fridge' : 'pantry'} 
          onClose={() => setActiveObject(null)}
          stock={stock}
          onStockChange={setStock}
        />
      )}

      {/* Modal détail du jour */}
      {selectedDay && (
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
          onClick={() => setSelectedDay(null)}
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
              onClick={() => setSelectedDay(null)}
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
              {selectedDay} {new Date(currentYear, currentMonth).toLocaleString('fr-FR', { month: 'long' })}
            </h2>
            <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                🥗 <strong>Déjeuner:</strong> {planning[selectedDay]?.lunch || 'Non planifié'}
              </div>
              <div>
                🍽️ <strong>Dîner:</strong> {planning[selectedDay]?.dinner || 'Non planifié'}
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
      )}
    </div>
  );
}