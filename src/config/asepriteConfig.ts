// Configuration adaptée pour Aseprite + système de scènes
// Optimisé pour mobile/tablette avec pixel art et animations hover

export interface AsepriteSpriteConfig {
  base: string;           // Sprite normal  
  hover: string;          // Animation hover (peut être animée)
  active: string;         // État sélectionné
  disabled?: string;      // État désactivé
  
  // Spécifique pixel art pour mobile/tablette
  pixelScale: number;     // Facteur de scale adaptatif (mobile: 3x, tablette: 4x, desktop: 6x)
  frameCount?: number;    // Nombre de frames si animé
  frameRate?: number;     // FPS pour animations
  
  // Dimensions en pixels du sprite original Aseprite
  sourceSize: { width: number; height: number };
  
  // Position sur la scène (en pourcentages pour responsive)
  scenePosition: { x: number; y: number; width: number; height: number };
  
  // Zone tactile élargie pour mobile
  touchArea?: { x: number; y: number; width: number; height: number };
  
  // Feedback haptique pour mobile
  hapticFeedback?: 'light' | 'medium' | 'heavy';
}

export interface SceneConfig {
  background: string;     // PNG de la scène créée avec Aseprite
  name: string;
  
  // Objets interactifs sur cette scène
  interactiveObjects: Record<string, AsepriteSpriteConfig>;
  
  // Transitions vers d'autres scènes
  transitions: Record<string, string>; // objectId → sceneId
  
  // Dimensions recommandées pour la scène (mobile first)
  dimensions: {
    mobile: { width: number; height: number };    // Portrait 390x844 (iPhone)
    tablet: { width: number; height: number };    // 768x1024 (iPad)
    desktop: { width: number; height: number };   // 1920x1080
  };
  
  // Échelle de base pour cette scène
  baseScale: number;
}

// Configuration des scènes
export const MEALCRAFT_SCENES: Record<string, SceneConfig> = {
  // Scène principale - cuisine
  kitchen: {
    background: '/scenes/kitchen-main.png',
    name: 'Cuisine Principale',
    
    // Dimensions optimisées pour mobile first
    dimensions: {
      mobile: { width: 390, height: 844 },   // iPhone 14
      tablet: { width: 768, height: 1024 },  // iPad
      desktop: { width: 1920, height: 1080 } // Desktop
    },
    baseScale: 3, // Échelle de base pour pixel art mobile
    
    interactiveObjects: {
      calendar: {
        base: '/sprites/calendar-idle.png',
        hover: '/sprites/calendar-hover.png',    // Peut être animé !
        active: '/sprites/calendar-active.png',
        
        pixelScale: 3,        // Mobile first
        frameCount: 1,        // Static pour base/active
        sourceSize: { width: 48, height: 48 },
        scenePosition: { x: 8, y: 12, width: 12, height: 12 },
        
        // Zone tactile plus large pour mobile
        touchArea: { x: 6, y: 10, width: 16, height: 16 },
        hapticFeedback: 'light'
      },
      
      cookbook: {
        base: '/sprites/cookbook-idle.png',
        hover: '/sprites/cookbook-hover.png',    // Pages qui bougent
        active: '/sprites/cookbook-active.png',
        
        pixelScale: 3,        // Mobile optimized
        frameCount: 4,        // Animation hover 4 frames
        frameRate: 8,         // 8 FPS pour animation douce
        sourceSize: { width: 40, height: 60 },
        scenePosition: { x: 78, y: 18, width: 16, height: 20 },
        
        touchArea: { x: 75, y: 15, width: 22, height: 26 },
        hapticFeedback: 'medium'
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
    
    // Dimensions identiques à la scène principale
    dimensions: {
      mobile: { width: 390, height: 844 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1920, height: 1080 }
    },
    baseScale: 3,
    
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

// Utilitaires pour Aseprite - Optimisé Mobile/Tablette
export const ASEPRITE_SETTINGS = {
  // Palette recommandée pour cohérence (adaptée aux écrans mobiles)
  palette: [
    '#000000', '#1a1c2c', '#5d275d', '#b13e53', '#ef7d57',
    '#ffcd75', '#a7f070', '#38b764', '#257179', '#29366f',
    '#3b5dc9', '#41a6f6', '#73eff7', '#f4f4f4', '#94b0c2', '#566c86'
  ],
  
  // Export settings pour différentes tailles d'écran
  export: {
    format: 'PNG',
    mobile: {
      scale: 3,             // 3x pour mobile (performance)
      maxSize: 512,         // Limite taille fichier
    },
    tablet: {
      scale: 4,             // 4x pour tablette
      maxSize: 1024,
    },
    desktop: {
      scale: 6,             // 6x pour desktop
      maxSize: 2048,
    },
    preservePixels: true,   // Nearest neighbor obligatoire
    transparentBackground: true,
    compression: 'medium'   // Équilibre qualité/taille
  },
  
  // Animation settings optimisées pour mobile
  animation: {
    defaultFPS: 6,          // Réduit pour économiser batterie
    hoverFPS: 10,           // Assez fluide pour interactions tactiles
    activeFPS: 12,          // Plus rapide pour feedback immédiat
    maxFrames: 12,          // Limite pour performance mobile
    
    // Optimisations mobile
    preloadFrames: true,    // Précharge pour éviter lag
    pauseOnInactive: true,  // Économie batterie
    reducedMotion: true     // Respect préférences accessibilité
  },
  
  // Dimensions recommandées pour création dans Aseprite
  canvasSizes: {
    scene: {
      mobile: { width: 130, height: 281 },   // 390/3 x 844/3 en pixels
      tablet: { width: 192, height: 256 },   // 768/4 x 1024/4 en pixels
      desktop: { width: 320, height: 180 }   // 1920/6 x 1080/6 en pixels
    },
    sprites: {
      small: { width: 16, height: 16 },      // Petits objets
      medium: { width: 32, height: 32 },     // Objets moyens
      large: { width: 48, height: 48 },      // Gros objets
      xlarge: { width: 64, height: 64 }      // Très gros objets
    }
  },
  
  // Guidelines pour création Aseprite
  guidelines: {
    pixelPerfect: true,
    antialiasing: false,
    dithering: 'minimal',
    contrast: 'high',       // Important pour lisibilité mobile
    saturation: 'medium'    // Équilibre pour différents écrans
  }
};
