"use client"

import React, { useState } from 'react';
import CookBook from '../components/immersive/CookBook';
import CalendarWall from '../components/immersive/CalendarWall';
import FridgePantryModal from '../components/immersive/FridgePantryModal';
import DayDetailModal from '../components/immersive/DayDetailModal';
import KitchenObject from '../components/KitchenObject';
import KitchenInstructions from '../components/KitchenInstructions';
import OnboardingFlow from '../components/OnboardingFlow';
import UserProfileModal from '../components/UserProfileModal';
import SmartStockManager from '../components/SmartStockManager';
import ResponsiveKitchenSprite from '../components/ResponsiveKitchenSprite';
import { CozyCookingMode } from '../components/CozyCookingMode';
import { categoriesRefrigerees, categoriesNonRefrigerees } from '../data/kitchenMeta';
import { useUserProfile } from '../hooks/useUserProfile';
import { useStock } from '../hooks/useStock';
import { useGlobalShortcuts } from '../hooks/useKeyboardShortcuts';
import { Recette } from '../data/recettesDeBase';

// Types d'objets interactifs
type InteractiveObject = 'calendar' | 'cookbook' | 'fridge' | 'pantry' | null;

// Modale Frigo/Placard avec onglets

export default function Home() {
  const [activeObject, setActiveObject] = useState<InteractiveObject>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSmartStockManager, setShowSmartStockManager] = useState(false);
  const [cookingRecipe, setCookingRecipe] = useState<Recette | null>(null);
  
  // Gestion du profil utilisateur
  const { profile, isFirstTime, loading, createProfile, resetProfile, updatePreferences } = useUserProfile();
  const { stock, setStock } = useStock();
  
  // Raccourcis clavier globaux
  useGlobalShortcuts(setActiveObject);
  
  // Simulation du planning
  const [planning] = useState<{ [day: number]: { lunch?: string; dinner?: string } }>({});

  // Date actuelle pour le calendrier
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Chargement initial
  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF6B7, #FFD6A5)',
        fontFamily: 'Press Start 2P, cursive'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍳</div>
          <div style={{ fontSize: '1rem', color: '#8b4513' }}>MealCraft</div>
          <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '1rem' }}>Chargement...</div>
        </div>
      </div>
    );
  }

  // Première visite : onboarding
  if (isFirstTime) {
    return (
      <OnboardingFlow
        onProfileCreated={() => window.location.reload()}
        onCreateProfile={createProfile}
      />
    );
  }

  // Mode cuisine actif - exactement comme dans Planning.tsx
  if (cookingRecipe) {
    return (
      <CozyCookingMode
        recette={cookingRecipe}
        onComplete={() => setCookingRecipe(null)}
        onCancel={() => setCookingRecipe(null)}
      />
    );
  }

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
        
        {/* Bouton Smart Stock Manager */}
        <div
          onClick={() => setShowSmartStockManager(true)}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            fontSize: '0.6rem',
            fontFamily: 'Press Start 2P, cursive',
            color: 'white',
            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
            transition: 'all 0.3s',
            zIndex: 10,
            minWidth: '120px'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(76, 175, 80, 0.6)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
          <div style={{ textAlign: 'center', lineHeight: '1.4' }}>
            <div>Smart Stock</div>
            <div style={{ fontSize: '0.4rem', opacity: 0.9, marginTop: '0.3rem' }}>
              📱 Scan & 🧾 Tickets
            </div>
          </div>
        </div>

        {/* Indicateur de profil utilisateur */}
        {profile && (
          <div
            onClick={() => setShowProfile(true)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(45, 55, 72, 0.9)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontFamily: 'Press Start 2P, cursive',
              color: '#e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '1.2rem' }}>👤</span>
            <div>
              <div style={{ color: '#ffd93d' }}>{profile.nom}</div>
              <div style={{ fontSize: '0.5rem', opacity: 0.8 }}>
                {profile.preferences.portionsParDefaut} portions
              </div>
            </div>
          </div>
        )}
        
        {/* Objets interactifs avec sprites */}
        
        {/* Planning avec sprite adaptatif */}
        <ResponsiveKitchenSprite
          objectType="calendar"
          isActive={activeObject === 'calendar'}
          onClick={() => setActiveObject('calendar')}
        />
        
        {/* Fallback pour les objets sans sprites encore */}
        <KitchenObject
          icon={<div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>}
          label="Planning (Old)"
          subLabel={today.toLocaleString('fr-FR', { month: 'short' }) + ' ' + currentYear}
          style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
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
        
        {/* Bouton de debug pour réinitialiser (développement seulement) */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={() => {
              if (window.confirm('Réinitialiser toutes les données ? (pour tester l\'onboarding)')) {
                resetProfile();
                window.location.reload();
              }
            }}
            style={{
              position: 'fixed',
              bottom: '10px',
              right: '10px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              fontSize: '0.7rem',
              cursor: 'pointer',
              zIndex: 1000,
              opacity: 0.7
            }}
          >
            🗑️ Reset DB
          </button>
        )}
      </div>
      
      {/* Modales des objets interactifs */}
      {activeObject === 'calendar' && <CalendarWall onClose={() => setActiveObject(null)} />}
      {activeObject === 'cookbook' && (
        <CookBook 
          onClose={() => setActiveObject(null)} 
          onStartCooking={(recette: Recette) => {
            setCookingRecipe(recette);
            setActiveObject(null); // Ferme le livre
          }}
        />
      )}
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

      {/* Modal profil utilisateur */}
      {showProfile && profile && (
        <UserProfileModal
          profile={profile}
          onClose={() => setShowProfile(false)}
          onUpdatePreferences={updatePreferences}
          onResetProfile={resetProfile}
        />
      )}

      {/* Smart Stock Manager */}
      <SmartStockManager
        isActive={showSmartStockManager}
        onClose={() => setShowSmartStockManager(false)}
      />
    </div>
  );
}