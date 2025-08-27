// Configuration adaptée pour Aseprite + système de scènes
// Optimisé pour pixel art avec animations hover

export interface AsepriteSpriteConfig {
  base: string;           // Sprite normal  
  hover: string;          // Animation hover (peut être animée)
  active: string;         // État sélectionné
  disabled?: string;      // État désactivé
  
  // Spécifique pixel art
  pixelScale: number;     // Facteur de scale (4x, 6x)
  frameCount?: number;    // Nombre de frames si animé
  frameRate?: number;     // FPS pour animations
  
  // Dimensions en pixels du sprite original Aseprite
  sourceSize: { width: number; height: number };
  
  // Position sur la scène (en pourcentages)
  scenePosition: { x: number; y: number; width: number; height: number };
}

export interface SceneConfig {
  background: string;     // PNG de la scène principale
  name: string;
  
  // Objets interactifs sur cette scène
  interactiveObjects: Record<string, AsepriteSpriteConfig>;
  
  // Transitions vers d'autres scènes
  transitions: Record<string, string>; // objectId → sceneId
}

// Configuration des scènes
export const MEALCRAFT_SCENES: Record<string, SceneConfig> = {
  // Scène principale - cuisine
  kitchen: {
    background: '/scenes/kitchen-main.png',
    name: 'Cuisine Principale',
    
    interactiveObjects: {
      calendar: {
        base: '/sprites/calendar-idle.png',
        hover: '/sprites/calendar-hover.png',    // Peut être animé !
        active: '/sprites/calendar-active.png',
        
        pixelScale: 4,
        frameCount: 1,        // Static pour base/active
        sourceSize: { width: 48, height: 48 },
        scenePosition: { x: 8, y: 12, width: 12, height: 12 }
      },
      
      cookbook: {
        base: '/sprites/cookbook-idle.png',
        hover: '/sprites/cookbook-hover.png',    // Pages qui bougent
        active: '/sprites/cookbook-active.png',
        
        pixelScale: 4,
        frameCount: 4,        // Animation hover 4 frames
        frameRate: 8,         // 8 FPS pour animation douce
        sourceSize: { width: 40, height: 60 },
        scenePosition: { x: 78, y: 18, width: 16, height: 20 }
      },
      
      fridge: {
        base: '/sprites/fridge-idle.png',
        hover: '/sprites/fridge-hover.png',      // Porte qui s'entrouvre
        active: '/sprites/fridge-active.png',
        
        pixelScale: 4,
        frameCount: 6,        // Animation d'ouverture
        frameRate: 12,
        sourceSize: { width: 40, height: 70 },
        scenePosition: { x: 12, y: 55, width: 20, height: 30 }
      },
      
      pantry: {
        base: '/sprites/pantry-idle.png',
        hover: '/sprites/pantry-hover.png',      // Étagères qui brillent
        active: '/sprites/pantry-active.png',
        
        pixelScale: 4,
        frameCount: 3,
        frameRate: 6,
        sourceSize: { width: 50, height: 60 },
        scenePosition: { x: 68, y: 58, width: 18, height: 25 }
      },
      
      stove: {
        base: '/sprites/stove-idle.png',
        hover: '/sprites/stove-hover.png',       // Flammes qui dansent
        active: '/sprites/stove-active.png',
        
        pixelScale: 4,
        frameCount: 8,        // Animation de flammes
        frameRate: 16,        // Plus rapide pour effet réaliste
        sourceSize: { width: 60, height: 50 },
        scenePosition: { x: 42, y: 40, width: 16, height: 12 }
      },
      
      counter: {
        base: '/sprites/counter-idle.png',
        hover: '/sprites/counter-hover.png',     // Reflets qui bougent
        active: '/sprites/counter-active.png',
        
        pixelScale: 4,
        frameCount: 2,        // Animation subtile
        frameRate: 4,
        sourceSize: { width: 75, height: 40 },
        scenePosition: { x: 30, y: 70, width: 30, height: 8 }
      }
    },
    
    transitions: {
      calendar: 'planning',
      cookbook: 'recipes',
      fridge: 'fridge_interior', 
      pantry: 'pantry_interior',
      stove: 'cooking',
      counter: 'preparation'
    }
  },
  
  // Scène frigo ouvert
  fridge_interior: {
    background: '/scenes/fridge-open.png',
    name: 'Intérieur du Frigo',
    
    interactiveObjects: {
      close_button: {
        base: '/sprites/close-btn-idle.png',
        hover: '/sprites/close-btn-hover.png',
        active: '/sprites/close-btn-active.png',
        
        pixelScale: 4,
        sourceSize: { width: 32, height: 32 },
        scenePosition: { x: 85, y: 10, width: 8, height: 8 }
      },
      
      milk: {
        base: '/sprites/milk-idle.png',
        hover: '/sprites/milk-hover.png',
        active: '/sprites/milk-active.png',
        
        pixelScale: 4,
        frameCount: 2,
        frameRate: 3,
        sourceSize: { width: 24, height: 32 },
        scenePosition: { x: 25, y: 45, width: 6, height: 8 }
      }
      // ... autres items du frigo
    },
    
    transitions: {
      close_button: 'kitchen',
      milk: 'kitchen'  // Retour après sélection
    }
  }
  
  // ... autres scènes (planning, recipes, etc.)
};

// Utilitaires pour Aseprite
export const ASEPRITE_SETTINGS = {
  // Palette recommandée pour cohérence
  palette: [
    '#000000', '#1a1c2c', '#5d275d', '#b13e53', '#ef7d57',
    '#ffcd75', '#a7f070', '#38b764', '#257179', '#29366f',
    '#3b5dc9', '#41a6f6', '#73eff7', '#f4f4f4', '#94b0c2', '#566c86'
  ],
  
  // Export settings
  export: {
    format: 'PNG',
    scale: 4,               // 4x pour la plupart des sprites
    preservePixels: true,   // Nearest neighbor
    transparentBackground: true
  },
  
  // Animation settings
  animation: {
    defaultFPS: 8,
    hoverFPS: 12,          // Plus fluide pour interactions
    maxFrames: 16          // Limite pour performance
  }
};
