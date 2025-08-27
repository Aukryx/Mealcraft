import React, { useState, useEffect, useRef } from 'react';
import { MEALCRAFT_SCENES, AsepriteSpriteConfig } from '../config/asepriteConfig';

interface PixelArtSpriteProps {
  config: AsepriteSpriteConfig;
  isHovered: boolean;
  isActive: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  onTouchStart?: () => void;
}

export default function PixelArtSprite({
  config,
  isHovered,
  isActive,
  isDisabled = false,
  onClick,
  onTouchStart
}: PixelArtSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [spriteState, setSpriteState] = useState<'base' | 'hover' | 'active' | 'disabled'>('base');
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Gestion de l'état du sprite
  useEffect(() => {
    if (isDisabled) setSpriteState('disabled');
    else if (isActive) setSpriteState('active');
    else if (isHovered) setSpriteState('hover');
    else setSpriteState('base');
  }, [isActive, isHovered, isDisabled]);

  // Animation des frames pour le hover
  useEffect(() => {
    if (spriteState === 'hover' && config.frameCount && config.frameCount > 1) {
      const fps = config.frameRate || 8;
      const interval = 1000 / fps;
      
      const animate = () => {
        setCurrentFrame(prev => (prev + 1) % (config.frameCount || 1));
        animationRef.current = setTimeout(animate, interval);
      };
      
      animationRef.current = setTimeout(animate, interval);
      
      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    } else {
      // Reset frame pour états non-animés
      setCurrentFrame(0);
    }
  }, [spriteState, config.frameCount, config.frameRate]);

  // Sélection de l'image selon l'état
  const getSpriteSource = (): string => {
    switch (spriteState) {
      case 'active': return config.active;
      case 'hover': 
        // Si animé, on ajoute le numéro de frame
        if (config.frameCount && config.frameCount > 1) {
          return config.hover.replace('.png', `-${currentFrame.toString().padStart(2, '0')}.png`);
        }
        return config.hover;
      case 'disabled': return config.disabled || config.base;
      default: return config.base;
    }
  };

  // Gestion des interactions tactiles optimisées pour pixel art
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDisabled) {
      setSpriteState('active');
      onTouchStart?.();
    }
  };

  const handleTouchEnd = () => {
    if (!isActive && !isDisabled) {
      setSpriteState('base');
    }
  };

  return (
    <div
      className="pixel-art-sprite"
      style={{
        position: 'absolute',
        left: `${config.scenePosition.x}%`,
        top: `${config.scenePosition.y}%`,
        width: `${config.scenePosition.width}%`,
        height: `${config.scenePosition.height}%`,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        
        // Effets visuels pour les interactions
        filter: isDisabled ? 'grayscale(100%) opacity(0.5)' : 'none',
        transform: spriteState === 'active' ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.1s ease', // Transition rapide pour réactivité
        zIndex: spriteState === 'active' ? 10 : 1,
        
        // Optimisations pixel art
        imageRendering: 'pixelated' as const,
      }}
      onClick={!isDisabled ? onClick : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={getSpriteSource()}
        alt="Objet interactif"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          
          // CRUCIAL pour pixel art
          imageRendering: 'pixelated' as const,
        }}
        draggable={false}
      />
      
      {/* Indicateur d'interactivité pour mobile */}
      {!isDisabled && (
        <div
          className="interaction-hint"
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: spriteState === 'active' ? '#4CAF50' : 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #333',
            opacity: spriteState === 'hover' || spriteState === 'active' ? 1 : 0.7,
            transition: 'opacity 0.2s',
            
            // Style pixel art pour l'indicateur aussi
            imageRendering: 'pixelated' as const,
          }}
        />
      )}
    </div>
  );
}

// CSS global à ajouter pour les optimisations pixel art
export const pixelArtCSS = `
/* Optimisations globales pour pixel art */
.pixel-art-sprite {
  /* Amélioration des performances sur mobile */
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

/* Désactiver l'anti-aliasing pour le pixel art */
.pixel-art-sprite img {
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* Améliorer les performances sur les appareils moins puissants */
@media (max-width: 768px) {
  .pixel-art-sprite {
    /* Désactiver les transitions complexes sur mobile */
    transition: transform 0.05s ease;
  }
}

/* Respecter les préférences d'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .pixel-art-sprite {
    transition: none;
  }
}
`;
