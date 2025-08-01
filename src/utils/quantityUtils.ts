// Service pour gérer les incréments intelligents selon l'unité
export type Unite = 'g' | 'kg' | 'ml' | 'L' | 'pièce' | 'tranche' | 'gousse' | 'pincée' | 'càs' | 'pot' | 'rouleau' | 'sachet';

export interface QuantityIncrement {
  unit: Unite;
  smallStep: number;
  mediumStep: number;
  largeStep: number;
  inputEnabled: boolean; // Permettre saisie manuelle
  placeholder: string;
}

// Configuration des incréments par unité
export const QUANTITY_INCREMENTS: Record<string, QuantityIncrement> = {
  'g': {
    unit: 'g',
    smallStep: 10,
    mediumStep: 50,
    largeStep: 100,
    inputEnabled: true,
    placeholder: 'Ex: 250g'
  },
  'kg': {
    unit: 'kg',
    smallStep: 0.1,
    mediumStep: 0.5,
    largeStep: 1,
    inputEnabled: true,
    placeholder: 'Ex: 1.5kg'
  },
  'ml': {
    unit: 'ml',
    smallStep: 10,
    mediumStep: 50,
    largeStep: 100,
    inputEnabled: true,
    placeholder: 'Ex: 250ml'
  },
  'L': {
    unit: 'L',
    smallStep: 0.1,
    mediumStep: 0.5,
    largeStep: 1,
    inputEnabled: true,
    placeholder: 'Ex: 1.5L'
  },
  'pièce': {
    unit: 'pièce',
    smallStep: 1,
    mediumStep: 5,
    largeStep: 10,
    inputEnabled: true,
    placeholder: 'Ex: 3 pièces'
  },
  'tranche': {
    unit: 'tranche',
    smallStep: 1,
    mediumStep: 2,
    largeStep: 5,
    inputEnabled: true,
    placeholder: 'Ex: 4 tranches'
  },
  'gousse': {
    unit: 'gousse',
    smallStep: 1,
    mediumStep: 2,
    largeStep: 5,
    inputEnabled: true,
    placeholder: 'Ex: 2 gousses'
  },
  'pincée': {
    unit: 'pincée',
    smallStep: 1,
    mediumStep: 2,
    largeStep: 3,
    inputEnabled: false, // Généralement 1-3 pincées max
    placeholder: 'Pincées'
  },
  'càs': {
    unit: 'càs',
    smallStep: 1,
    mediumStep: 2,
    largeStep: 5,
    inputEnabled: true,
    placeholder: 'Ex: 3 càs'
  },
  'pot': {
    unit: 'pot',
    smallStep: 1,
    mediumStep: 2,
    largeStep: 5,
    inputEnabled: true,
    placeholder: 'Ex: 2 pots'
  },
  'rouleau': {
    unit: 'rouleau',
    smallStep: 1,
    mediumStep: 1,
    largeStep: 2,
    inputEnabled: false, // Généralement 1 seul rouleau
    placeholder: 'Rouleaux'
  },
  'sachet': {
    unit: 'sachet',
    smallStep: 1,
    mediumStep: 2,
    largeStep: 3,
    inputEnabled: true,
    placeholder: 'Ex: 2 sachets'
  }
};

// Fonction pour obtenir la configuration d'une unité
export function getQuantityConfig(unit: string): QuantityIncrement {
  return QUANTITY_INCREMENTS[unit] || QUANTITY_INCREMENTS['pièce']; // Default
}

// Fonction pour formater l'affichage d'une quantité
export function formatQuantity(quantity: number, unit: string): string {
  const config = getQuantityConfig(unit);
  
  // Pour les unités décimales, afficher avec 1 décimale si nécessaire
  if (['kg', 'L'].includes(unit) && quantity % 1 !== 0) {
    return `${quantity.toFixed(1)} ${unit}`;
  }
  
  return `${quantity} ${unit}`;
}

// Fonction pour calculer la prochaine quantité avec un step donné
export function calculateNextQuantity(current: number, step: number, direction: 'up' | 'down'): number {
  const newValue = direction === 'up' ? current + step : current - step;
  return Math.max(0, newValue); // Ne pas descendre en dessous de 0
}
