import React, { useState } from 'react';
import PixelArtSprite from './PixelArtSprite';
import { MEALCRAFT_SCENES, SceneConfig } from '../config/asepriteConfig';

interface SceneManagerProps {
  onSceneTransition?: (fromScene: string, toScene: string, objectClicked: string) => void;
}

export default function SceneManager({ onSceneTransition }: SceneManagerProps) {
  const [currentScene, setCurrentScene] = useState<string>('kitchen');
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [activeObject, setActiveObject] = useState<string | null>(null);

  const scene = MEALCRAFT_SCENES[currentScene];
  
  if (!scene) {
    console.error(`Scène non trouvée: ${currentScene}`);
    return <div>Erreur: Scène non trouvée</div>;
  }

  const handleObjectClick = (objectId: string) => {
    const targetScene = scene.transitions[objectId];
    
    if (targetScene) {
      // Transition vers une nouvelle scène
      onSceneTransition?.(currentScene, targetScene, objectId);
      setCurrentScene(targetScene);
      setActiveObject(null);
      setHoveredObject(null);
    } else {
      // Action sur place (toggle state)
      setActiveObject(activeObject === objectId ? null : objectId);
    }
  };

  const handleObjectHover = (objectId: string, isHovering: boolean) => {
    setHoveredObject(isHovering ? objectId : null);
  };

  return (
    <div className="scene-container">
      {/* Background de la scène */}
      <div 
        className="scene-background"
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${scene.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          
          // Optimisations pixel art pour le background
          imageRendering: 'pixelated',
        }}
      >
        {/* Rendu des objets interactifs */}
        {Object.entries(scene.interactiveObjects).map(([objectId, config]) => (
          <PixelArtSprite
            key={objectId}
            config={config}
            isHovered={hoveredObject === objectId}
            isActive={activeObject === objectId}
            onClick={() => handleObjectClick(objectId)}
            onTouchStart={() => setHoveredObject(objectId)}
          />
        ))}
        
        {/* Overlay d'informations de scène */}
        <div 
          className="scene-info"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.6rem',
            zIndex: 100,
          }}
        >
          📍 {scene.name}
        </div>
        
        {/* Bouton retour pour les sous-scènes */}
        {currentScene !== 'kitchen' && (
          <button
            onClick={() => setCurrentScene('kitchen')}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(220, 53, 69, 0.9)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.8rem 1.2rem',
              cursor: 'pointer',
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.8rem',
              zIndex: 100,
              
              // Style pixel art
              imageRendering: 'pixelated',
            }}
          >
            ← Retour
          </button>
        )}
        
        {/* Instructions pour l'utilisateur */}
        <div 
          className="scene-instructions"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.7rem',
            textAlign: 'center',
            zIndex: 100,
            maxWidth: '90%',
          }}
        >
          {hoveredObject ? (
            <>🎯 Cliquez sur <strong>{hoveredObject}</strong> pour interagir</>
          ) : (
            <>🖱️ Survolez ou touchez les objets pour les découvrir</>
          )}
        </div>
      </div>
      
      {/* CSS embarqué pour les optimisations pixel art */}
      <style jsx>{`
        .scene-container {
          overflow: hidden;
          position: relative;
        }
        
        .scene-background {
          /* Désactiver l'anti-aliasing pour pixel art */
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
        
        /* Optimisations mobile pour pixel art */
        @media (max-width: 768px) {
          .scene-info {
            font-size: 0.5rem;
            padding: 0.4rem 0.8rem;
          }
          
          .scene-instructions {
            font-size: 0.6rem;
            padding: 0.8rem 1.5rem;
          }
        }
        
        /* Respecter les préférences d'accessibilité */
        @media (prefers-reduced-motion: reduce) {
          .scene-background {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
