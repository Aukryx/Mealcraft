"use client"

import React, { useState, useEffect } from 'react';
import { MEALCRAFT_SCENES, SceneConfig, AsepriteSpriteConfig } from '../config/asepriteConfig';

interface SceneManagerProps {
  initialScene?: string;
  onSceneChange?: (sceneId: string) => void;
}

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  scale: number;
}

export default function SceneManager({ 
  initialScene = 'kitchen',
  onSceneChange 
}: SceneManagerProps) {
  const [currentScene, setCurrentScene] = useState<string>(initialScene);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'mobile',
    width: 390,
    height: 844,
    scale: 3
  });
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [activeObject, setActiveObject] = useState<string | null>(null);

  // Détection du type d'appareil
  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let type: DeviceInfo['type'] = 'mobile';
      let scale = 3;
      
      if (width >= 1200) {
        type = 'desktop';
        scale = 6;
      } else if (width >= 768) {
        type = 'tablet';
        scale = 4;
      }
      
      setDeviceInfo({ type, width, height, scale });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  const scene: SceneConfig = MEALCRAFT_SCENES[currentScene];
  
  if (!scene) {
    console.error(`Scene not found: ${currentScene}`);
    return <div>Scene introuvable</div>;
  }

  // Gestion du clic sur un objet interactif
  const handleObjectClick = (objectId: string) => {
    setActiveObject(objectId);
    
    // Feedback haptique sur mobile
    if ('vibrate' in navigator && deviceInfo.type === 'mobile') {
      const sprite = scene.interactiveObjects[objectId];
      if (sprite?.hapticFeedback) {
        const intensity = sprite.hapticFeedback === 'light' ? 10 : 
                         sprite.hapticFeedback === 'medium' ? 20 : 50;
        navigator.vibrate(intensity);
      }
    }

    // Transition vers une autre scène si définie
    const targetScene = scene.transitions[objectId];
    if (targetScene && MEALCRAFT_SCENES[targetScene]) {
      setTimeout(() => {
        setCurrentScene(targetScene);
        setActiveObject(null);
        onSceneChange?.(targetScene);
      }, 200); // Petit délai pour l'animation
    }
  };

  // Gestion du hover (desktop) et touch start (mobile)
  const handleObjectHover = (objectId: string, isHovering: boolean) => {
    setHoveredObject(isHovering ? objectId : null);
  };

  // Calcul des dimensions responsives
  const getSceneDimensions = () => {
    const sceneDims = scene.dimensions[deviceInfo.type];
    const containerAspect = deviceInfo.width / deviceInfo.height;
    const sceneAspect = sceneDims.width / sceneDims.height;
    
    let width, height;
    
    if (containerAspect > sceneAspect) {
      // Container plus large que la scène
      height = Math.min(deviceInfo.height, sceneDims.height);
      width = height * sceneAspect;
    } else {
      // Container plus haut que la scène
      width = Math.min(deviceInfo.width, sceneDims.width);
      height = width / sceneAspect;
    }
    
    return { width, height };
  };

  const sceneDimensions = getSceneDimensions();

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1c2c', // Couleur de fond sombre
      overflow: 'hidden'
    }}>
      {/* Conteneur de la scène */}
      <div 
        style={{
          position: 'relative',
          width: sceneDimensions.width,
          height: sceneDimensions.height,
          backgroundImage: `url(${scene.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated', // Important pour pixel art
        }}
      >
        {/* Objets interactifs */}
        {Object.entries(scene.interactiveObjects).map(([objectId, config]) => (
          <InteractiveSprite
            key={objectId}
            objectId={objectId}
            config={config}
            sceneDimensions={sceneDimensions}
            deviceScale={deviceInfo.scale}
            isHovered={hoveredObject === objectId}
            isActive={activeObject === objectId}
            onHover={handleObjectHover}
            onClick={handleObjectClick}
          />
        ))}
        
        {/* Bouton retour pour les sous-scènes */}
        {currentScene !== 'kitchen' && (
          <button
            onClick={() => setCurrentScene('kitchen')}
            style={{
              position: 'absolute',
              top: '5%',
              right: '5%',
              background: 'rgba(220, 53, 69, 0.9)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 15px',
              cursor: 'pointer',
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '12px',
              zIndex: 100,
            }}
          >
            ← Retour
          </button>
        )}
      </div>
      
      {/* Debug info en développement */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: 10,
          left: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <div>Scène: {currentScene}</div>
          <div>Appareil: {deviceInfo.type}</div>
          <div>Échelle: {deviceInfo.scale}x</div>
          <div>Dimensions: {sceneDimensions.width}x{sceneDimensions.height}</div>
          {hoveredObject && <div>Hover: {hoveredObject}</div>}
        </div>
      )}
    </div>
  );
}

// Composant pour un sprite interactif individuel
interface InteractiveSpriteProps {
  objectId: string;
  config: AsepriteSpriteConfig;
  sceneDimensions: { width: number; height: number };
  deviceScale: number;
  isHovered: boolean;
  isActive: boolean;
  onHover: (objectId: string, isHovering: boolean) => void;
  onClick: (objectId: string) => void;
}

function InteractiveSprite({
  objectId,
  config,
  sceneDimensions,
  deviceScale,
  isHovered,
  isActive,
  onHover,
  onClick
}: InteractiveSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Animation des frames
  useEffect(() => {
    if (!config.frameCount || config.frameCount <= 1) return;
    if (!isHovered && !isActive) {
      setCurrentFrame(0);
      return;
    }

    const fps = config.frameRate || 8;
    const interval = setInterval(() => {
      setCurrentFrame(frame => (frame + 1) % (config.frameCount || 1));
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [isHovered, isActive, config.frameCount, config.frameRate]);

  // Choix du sprite selon l'état
  const getSpriteUrl = () => {
    if (isActive) return config.active;
    if (isHovered) return config.hover;
    return config.base;
  };

  // Position et taille calculées
  const position = config.scenePosition;
  const touchArea = config.touchArea || position;
  
  const spriteStyle = {
    position: 'absolute' as const,
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${position.width}%`,
    height: `${position.height}%`,
    backgroundImage: `url(${getSpriteUrl()})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    imageRendering: 'pixelated' as const,
    cursor: 'pointer',
    transition: isActive ? 'transform 0.1s ease' : 'transform 0.2s ease',
    transform: isActive ? 'scale(0.95)' : isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  // Zone tactile plus grande
  const touchStyle = {
    position: 'absolute' as const,
    left: `${touchArea.x}%`,
    top: `${touchArea.y}%`,
    width: `${touchArea.width}%`,
    height: `${touchArea.height}%`,
    cursor: 'pointer',
    // Debug: bordure visible en développement
    ...(process.env.NODE_ENV === 'development' && {
      border: '1px dashed rgba(255,0,0,0.3)'
    })
  };

  return (
    <>
      {/* Sprite visuel */}
      <div style={spriteStyle} />
      
      {/* Zone tactile interactive */}
      <div
        style={touchStyle}
        onMouseEnter={() => onHover(objectId, true)}
        onMouseLeave={() => onHover(objectId, false)}
        onTouchStart={() => onHover(objectId, true)}
        onTouchEnd={() => onHover(objectId, false)}
        onClick={() => onClick(objectId)}
        role="button"
        aria-label={`Interagir avec ${objectId}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(objectId);
          }
        }}
      />
    </>
  );
}
