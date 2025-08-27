// Système de sprites adaptatifs pour MealCraft
// Optimisé pour mobile/tablette avec interactions tactiles

export interface SpriteConfig {
  base: string;           // Image de base
  hover?: string;         // État survol (tablette)
  active: string;         // État actif/sélectionné  
  disabled?: string;      // État désactivé
  sizes: {
    mobile: { width: number; height: number };
    tablet: { width: number; height: number };
    desktop: { width: number; height: number };
  };
}

export interface KitchenLayoutConfig {
  // Zones interactives définies en pourcentages pour la responsivité
  interactiveZones: {
    calendar: { x: number; y: number; width: number; height: number };
    cookbook: { x: number; y: number; width: number; height: number };
    fridge: { x: number; y: number; width: number; height: number };
    pantry: { x: number; y: number; width: number; height: number };
    stove: { x: number; y: number; width: number; height: number };
    counter: { x: number; y: number; width: number; height: number };
  };
  
  // Points d'ancrage pour les tooltips et interactions
  anchorPoints: {
    [key: string]: { x: number; y: number };
  };
}

// Configuration pour différents écrans
export const KITCHEN_SPRITES: Record<string, SpriteConfig> = {
  calendar: {
    base: '/sprites/calendar-base.svg',
    hover: '/sprites/calendar-hover.svg', 
    active: '/sprites/calendar-active.svg',
    sizes: {
      mobile: { width: 60, height: 60 },
      tablet: { width: 80, height: 80 },
      desktop: { width: 100, height: 100 }
    }
  },
  
  cookbook: {
    base: '/sprites/cookbook-base.svg',
    hover: '/sprites/cookbook-hover.svg',
    active: '/sprites/cookbook-active.svg', 
    sizes: {
      mobile: { width: 70, height: 90 },
      tablet: { width: 90, height: 120 },
      desktop: { width: 110, height: 150 }
    }
  },
  
  fridge: {
    base: '/sprites/fridge-base.svg',
    hover: '/sprites/fridge-hover.svg',
    active: '/sprites/fridge-active.svg',
    sizes: {
      mobile: { width: 80, height: 120 },
      tablet: { width: 110, height: 160 },
      desktop: { width: 140, height: 200 }
    }
  },
  
  // ... autres objets
};

// Layouts adaptatifs par device
export const KITCHEN_LAYOUTS: Record<string, KitchenLayoutConfig> = {
  mobile: {
    interactiveZones: {
      calendar: { x: 5, y: 10, width: 15, height: 15 },
      cookbook: { x: 75, y: 15, width: 20, height: 25 },
      fridge: { x: 10, y: 60, width: 25, height: 35 },
      pantry: { x: 65, y: 65, width: 20, height: 30 },
      stove: { x: 40, y: 45, width: 20, height: 15 },
      counter: { x: 25, y: 75, width: 35, height: 10 }
    },
    anchorPoints: {
      calendar: { x: 12, y: 25 },
      cookbook: { x: 85, y: 40 },
      // ...
    }
  },
  
  tablet: {
    interactiveZones: {
      calendar: { x: 8, y: 12, width: 12, height: 12 },
      cookbook: { x: 78, y: 18, width: 16, height: 20 },
      fridge: { x: 12, y: 55, width: 20, height: 30 },
      pantry: { x: 68, y: 58, width: 18, height: 25 },
      stove: { x: 42, y: 40, width: 16, height: 12 },
      counter: { x: 30, y: 70, width: 30, height: 8 }
    },
    anchorPoints: {
      calendar: { x: 14, y: 24 },
      cookbook: { x: 86, y: 38 },
      // ...
    }
  }
};
