"use client"

import React, { useState } from 'react';
import { Ingredient } from '../data/recettesDeBase';



import KitchenObject from '../components/KitchenObject';
import KitchenInstructions from '../components/KitchenInstructions';
import type { MouseEvent } from 'react';


import DayDetailModal from '../components/immersive/DayDetailModal';
import CalendarWall from '../components/immersive/CalendarWall';
import FridgePantryModal from '../components/immersive/FridgePantryModal';
import CookBook from '../components/immersive/CookBook';

// Types d'objets interactifs
type InteractiveObject = 'calendar' | 'cookbook' | 'fridge' | 'pantry' | null;


import { categoriesRefrigerees, categoriesNonRefrigerees } from '../data/kitchenMeta';

// Modale Frigo/Placard avec onglets

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
        {/* Objets interactifs */}
        <KitchenObject
          icon={<div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>}
          label="Planning"
          subLabel={today.toLocaleString('fr-FR', { month: 'short' }) + ' ' + currentYear}
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
          onClick={() => setActiveObject('calendar')}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <KitchenObject
          icon={<div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>�</div>}
          label={<><div>Livre de</div><div>Recettes</div></>}
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
          onClick={() => setActiveObject('cookbook')}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)')}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.transform = 'translateX(-50%) scale(1)')}
        />
        <KitchenObject
          icon={<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧊</div>}
          label="Frigo"
          subLabel={stock.filter(ing => categoriesRefrigerees.includes(ing.categorie)).length + ' articles'}
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
          onClick={() => setActiveObject('fridge')}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <KitchenObject
          icon={<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗄️</div>}
          label="Placard"
          subLabel={stock.filter(ing => categoriesNonRefrigerees.includes(ing.categorie)).length + ' articles'}
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
          onClick={() => setActiveObject('pantry')}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
        
        {/* Instructions d'utilisation */}
        <KitchenInstructions />
      </div>
      
      {/* Modales des objets interactifs */}
      {activeObject === 'calendar' && <CalendarWall onClose={() => setActiveObject(null)} />}
      {activeObject === 'cookbook' && <CookBook onClose={() => setActiveObject(null)} />}
      {(activeObject === 'fridge' || activeObject === 'pantry') && (
        <FridgePantryModal 
          initialTab={activeObject === 'fridge' ? 'fridge' : 'pantry'} 
          onClose={() => setActiveObject(null)}
          stock={stock}
          onStockChange={setStock}
        />
      )}

      {/* Modal détail du jour */}
      {selectedDay !== null && (
        <DayDetailModal
          day={selectedDay}
          currentYear={currentYear}
          currentMonth={currentMonth}
          planning={planning}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}