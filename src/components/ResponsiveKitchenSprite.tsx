import React, { useState, useEffect } from 'react';
import { KITCHEN_SPRITES, KITCHEN_LAYOUTS, SpriteConfig, KitchenLayoutConfig } from '../config/spriteConfig';

interface ResponsiveKitchenSpriteProps {
  objectType: string;
  isActive?: boolean;
  isHovered?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  onTouchStart?: () => void;
  className?: string;
}

export default function ResponsiveKitchenSprite({ 
  objectType, 
  isActive = false, 
  isHovered = false,
  isDisabled = false,
  onClick,
  onTouchStart,
  className = ''
}: ResponsiveKitchenSpriteProps) {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [spriteState, setSpriteState] = useState<'base' | 'hover' | 'active' | 'disabled'>('base');

  // Détection du type d'appareil
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  // Gestion de l'état du sprite
  useEffect(() => {
    if (isDisabled) setSpriteState('disabled');
    else if (isActive) setSpriteState('active');
    else if (isHovered) setSpriteState('hover');
    else setSpriteState('base');
  }, [isActive, isHovered, isDisabled]);

  const spriteConfig = KITCHEN_SPRITES[objectType];
  const layoutConfig = KITCHEN_LAYOUTS[deviceType];
  
  if (!spriteConfig || !layoutConfig) {
    console.warn(`Configuration manquante pour ${objectType} sur ${deviceType}`);
    return null;
  }

  const zone = layoutConfig.interactiveZones[objectType as keyof typeof layoutConfig.interactiveZones];
  const size = spriteConfig.sizes[deviceType];
  
  if (!zone) {
    console.warn(`Zone non définie pour ${objectType}`);
    return null;
  }
  
  // Sélection de l'image selon l'état
  const getSpriteSource = (): string => {
    switch (spriteState) {
      case 'active': return spriteConfig.active;
      case 'hover': return spriteConfig.hover || spriteConfig.base;
      case 'disabled': return spriteConfig.disabled || spriteConfig.base;
      default: return spriteConfig.base;
    }
  };

  // Gestion des interactions tactiles
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Évite le double-tap zoom
    setSpriteState('active');
    onTouchStart?.();
  };

  const handleTouchEnd = () => {
    if (!isActive) setSpriteState('base');
  };

  return (
    <div
      className={`kitchen-sprite ${className}`}
      style={{
        position: 'absolute',
        left: `${zone.x}%`,
        top: `${zone.y}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        transition: 'all 0.2s ease',
        transform: spriteState === 'active' ? 'scale(1.05)' : 'scale(1)',
        zIndex: spriteState === 'active' ? 10 : 1,
      }}
      onClick={!isDisabled ? onClick : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => !isDisabled && setSpriteState('hover')}
      onMouseLeave={() => !isDisabled && !isActive && setSpriteState('base')}
    >
      <img
        src={getSpriteSource()}
        alt={`${objectType} interactif`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: isDisabled ? 'grayscale(100%) opacity(0.5)' : 'none',
          imageRendering: 'pixelated', // Pour le style pixel art
        }}
        draggable={false}
      />
      
      {/* Indicateur d'interaction pour mobile */}
      {deviceType === 'mobile' && !isDisabled && (
        <div
          className="touch-indicator"
          style={{
            position: 'absolute',
            bottom: '-8px',
            right: '-8px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #4CAF50',
            animation: isActive ? 'none' : 'pulse 2s infinite',
            fontSize: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          👆
        </div>
      )}
    </div>
  );
}

// CSS pour les animations (à ajouter dans un fichier CSS global)
const spriteStyles = `
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

.kitchen-sprite {
  /* Amélioration des performances sur mobile */
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.touch-indicator {
  /* Animation de pulsation pour indiquer l'interactivité */
  animation: pulse 2s infinite;
}

/* Désactiver les animations sur les appareils avec préférences d'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .kitchen-sprite {
    transition: none;
  }
  
  .touch-indicator {
    animation: none;
  }
}
`;
