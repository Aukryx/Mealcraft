import React, { useState } from 'react';
import ResponsiveKitchenSprite from './ResponsiveKitchenSprite';

interface InteractiveKitchenProps {
  onObjectClick: (objectType: string) => void;
  activeObject?: string;
  disabledObjects?: string[];
}

export default function InteractiveKitchen({ 
  onObjectClick, 
  activeObject,
  disabledObjects = []
}: InteractiveKitchenProps) {
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  // Objets interactifs de la cuisine
  const kitchenObjects = ['calendar', 'cookbook', 'fridge', 'pantry', 'stove', 'counter'];

  return (
    <div className="interactive-kitchen">
      {/* Background de la cuisine - pourrait être un sprite aussi */}
      <div 
        className="kitchen-background"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          backgroundImage: 'url(/images/kitchen-background.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Rendu des objets interactifs */}
        {kitchenObjects.map(objectType => (
          <ResponsiveKitchenSprite
            key={objectType}
            objectType={objectType}
            isActive={activeObject === objectType}
            isHovered={hoveredObject === objectType}
            isDisabled={disabledObjects.includes(objectType)}
            onClick={() => onObjectClick(objectType)}
            onTouchStart={() => setHoveredObject(objectType)}
            className={`kitchen-object-${objectType}`}
          />
        ))}
        
        {/* Overlay d'instructions pour première utilisation */}
        <div 
          className="kitchen-instructions"
          style={{
            position: 'absolute',
            bottom: '10%',
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
          🖱️ Cliquez ou touchez les objets pour interagir
        </div>
      </div>
      
      {/* CSS embarqué pour les animations */}
      <style jsx>{`
        .interactive-kitchen {
          position: relative;
          overflow: hidden;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .kitchen-sprite {
          will-change: transform;
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }
        
        .touch-indicator {
          animation: pulse 2s infinite;
        }
        
        /* Responsive pour très petits écrans */
        @media (max-width: 480px) {
          .kitchen-instructions {
            font-size: 0.6rem;
            padding: 0.8rem 1.5rem;
          }
        }
        
        /* Optimisations pour les tablettes */
        @media (min-width: 768px) and (max-width: 1023px) {
          .kitchen-instructions {
            font-size: 0.8rem;
          }
        }
        
        /* Désactiver les animations si l'utilisateur préfère */
        @media (prefers-reduced-motion: reduce) {
          .kitchen-sprite {
            transition: none;
          }
          
          .touch-indicator {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
