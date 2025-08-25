// Système de conversion d'unités pour MealCraft
// Gestion des différents types d'unités et conversions automatiques

export interface UnitInfo {
  type: 'weight' | 'volume' | 'piece' | 'special';
  baseUnit: string;
  conversionFactor: number; // Facteur pour convertir vers l'unité de base
  displayName: string;
  equivalence?: string; // Équivalence concrète pour l'utilisateur
}

// Table principale de conversion avec équivalences concrètes
export const UNIT_CONVERSIONS: Record<string, UnitInfo> = {
  // Unités de poids (base: grammes)
  'g': { 
    type: 'weight', 
    baseUnit: 'g', 
    conversionFactor: 1, 
    displayName: 'gramme(s)',
    equivalence: 'Poids de référence'
  },
  'kg': { 
    type: 'weight', 
    baseUnit: 'g', 
    conversionFactor: 1000, 
    displayName: 'kilogramme(s)',
    equivalence: '1 kg = 1000 g'
  },
  
  // Unités de volume (base: millilitres)
  'ml': { 
    type: 'volume', 
    baseUnit: 'ml', 
    conversionFactor: 1, 
    displayName: 'millilitre(s)',
    equivalence: 'Volume de référence'
  },
  'cl': { 
    type: 'volume', 
    baseUnit: 'ml', 
    conversionFactor: 10, 
    displayName: 'centilitre(s)',
    equivalence: '1 cl = 10 ml'
  },
  'L': { 
    type: 'volume', 
    baseUnit: 'ml', 
    conversionFactor: 1000, 
    displayName: 'litre(s)',
    equivalence: '1 L = 1000 ml = 1 grande bouteille d\'eau'
  },
  'càs': { 
    type: 'volume', 
    baseUnit: 'ml', 
    conversionFactor: 15, 
    displayName: 'cuillère(s) à soupe',
    equivalence: '1 càs = 15 ml = 3 càc'
  },
  'càc': { 
    type: 'volume', 
    baseUnit: 'ml', 
    conversionFactor: 5, 
    displayName: 'cuillère(s) à café',
    equivalence: '1 càc = 5 ml = 1/3 càs'
  },
  'tasse': { 
    type: 'volume', 
    baseUnit: 'ml', 
    conversionFactor: 250, 
    displayName: 'tasse(s)',
    equivalence: '1 tasse = 250 ml = 1 verre standard'
  },
  'verre': { 
    type: 'volume', 
    baseUnit: 'ml', 
    conversionFactor: 200, 
    displayName: 'verre(s)',
    equivalence: '1 verre = 200 ml = petite tasse'
  },
  'poignée': { 
    type: 'special', 
    baseUnit: 'poignée', 
    conversionFactor: 1, 
    displayName: 'poignée(s)',
    equivalence: '1 poignée = ce qu\'on peut tenir dans la main'
  },
  
  // Unités de pièce (base: pièce)
  'pièce': { 
    type: 'piece', 
    baseUnit: 'pièce', 
    conversionFactor: 1, 
    displayName: 'pièce(s)',
    equivalence: 'Unité individuelle'
  },
  'tranche': { 
    type: 'piece', 
    baseUnit: 'pièce', 
    conversionFactor: 1, 
    displayName: 'tranche(s)',
    equivalence: '1 tranche = 1 portion découpée'
  },
  'pot': { 
    type: 'piece', 
    baseUnit: 'pièce', 
    conversionFactor: 1, 
    displayName: 'pot(s)',
    equivalence: '1 pot = 1 contenant standard (ex: yaourt 125g)'
  },
  
  // Unités spéciales avec approximations utiles
  'gousse': { 
    type: 'special', 
    baseUnit: 'gousse', 
    conversionFactor: 1, 
    displayName: 'gousse(s)',
    equivalence: '1 gousse d\'ail ≈ 1 càc hachée'
  },
  'pincée': { 
    type: 'special', 
    baseUnit: 'pincée', 
    conversionFactor: 1, 
    displayName: 'pincée(s)',
    equivalence: '1 pincée ≈ 0.5 g = ce qu\'on prend entre 2 doigts'
  },
  'botte': { 
    type: 'special', 
    baseUnit: 'botte', 
    conversionFactor: 1, 
    displayName: 'botte(s)',
    equivalence: '1 botte = bouquet d\'herbes ou légumes verts'
  }
};

// Conversions spécifiques par ingrédient
// Permet de convertir des unités abstraites en équivalents concrets
export const INGREDIENT_SPECIFIC_CONVERSIONS: Record<string, Record<string, { to: string; factor: number; description: string }>> = {
  // Farine
  'farine': {
    'tasse': { to: 'g', factor: 120, description: '1 tasse de farine = 120 g' },
    'verre': { to: 'g', factor: 100, description: '1 verre de farine = 100 g' }
  },
  
  // Sucre
  'sucre': {
    'tasse': { to: 'g', factor: 200, description: '1 tasse de sucre = 200 g' },
    'verre': { to: 'g', factor: 160, description: '1 verre de sucre = 160 g' }
  },
  
  // Sucre glace
  'sucre-glace': {
    'tasse': { to: 'g', factor: 120, description: '1 tasse de sucre glace = 120 g' }
  },
  
  // Riz
  'riz': {
    'tasse': { to: 'g', factor: 200, description: '1 tasse de riz cru = 200 g' },
    'verre': { to: 'g', factor: 160, description: '1 verre de riz cru = 160 g' }
  },
  
  // Beurre
  'beurre': {
    'càs': { to: 'g', factor: 15, description: '1 càs de beurre = 15 g' },
    'càc': { to: 'g', factor: 5, description: '1 càc de beurre = 5 g' }
  },
  
  // Huile
  'huile': {
    'càs': { to: 'ml', factor: 15, description: '1 càs d\'huile = 15 ml' },
    'càc': { to: 'ml', factor: 5, description: '1 càc d\'huile = 5 ml' }
  },
  
  // Miel
  'miel': {
    'càs': { to: 'g', factor: 20, description: '1 càs de miel = 20 g' },
    'càc': { to: 'g', factor: 7, description: '1 càc de miel = 7 g' }
  },
  
  // Épices en poudre
  'cannelle': {
    'pincée': { to: 'g', factor: 0.5, description: '1 pincée de cannelle = 0.5 g' }
  },
  'paprika': {
    'pincée': { to: 'g', factor: 0.5, description: '1 pincée de paprika = 0.5 g' }
  },
  'cumin': {
    'pincée': { to: 'g', factor: 0.5, description: '1 pincée de cumin = 0.5 g' }
  },
  
  // Sel et poivre
  'sel': {
    'pincée': { to: 'g', factor: 0.5, description: '1 pincée de sel = 0.5 g' },
    'càc': { to: 'g', factor: 5, description: '1 càc de sel = 5 g' }
  },
  'poivre': {
    'pincée': { to: 'g', factor: 0.3, description: '1 pincée de poivre = 0.3 g' }
  },
  
  // Fromage râpé
  'parmesan': {
    'càs': { to: 'g', factor: 10, description: '1 càs de parmesan râpé = 10 g' }
  },
  'gruyere': {
    'càs': { to: 'g', factor: 10, description: '1 càs de gruyère râpé = 10 g' }
  },
  
  // Noix et amandes
  'noix': {
    'poignée': { to: 'g', factor: 30, description: '1 poignée de noix = 30 g (environ 6-8 noix)' }
  },
  'amandes': {
    'poignée': { to: 'g', factor: 25, description: '1 poignée d\'amandes = 25 g (environ 20 amandes)' }
  }
};

// Unités recommandées par catégorie d'ingrédient
export const CATEGORY_PREFERRED_UNITS: { [category: string]: string[] } = {
  'légume': ['g', 'pièce'], // Poids pour petits légumes (champignons), pièces pour gros (carottes)
  'fruit': ['pièce', 'g'], // Pièces pour fruits entiers, grammes pour fruits découpés
  'viande': ['g'], // Toujours en grammes
  'poisson': ['g'], // Toujours en grammes
  'féculent': ['g'], // Toujours en grammes
  'produit laitier': ['ml', 'g', 'pot'], // ml pour liquides, g pour solides, pot pour yaourts
  'épice': ['pincée', 'g'], // Pincée pour herbes, grammes pour épices en poudre
  'autre': ['ml', 'g', 'càs'] // Dépend du type d'ingrédient
};

// Conversion automatique vers l'unité la plus appropriée
export function convertToBaseUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  const unitInfo = UNIT_CONVERSIONS[unit];
  if (!unitInfo) {
    console.warn(`Unité inconnue: ${unit}`);
    return { quantity, unit };
  }

  const baseQuantity = quantity * unitInfo.conversionFactor;
  return { quantity: baseQuantity, unit: unitInfo.baseUnit };
}

// Conversion pour affichage optimisé
export function convertToDisplayUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  const unitInfo = UNIT_CONVERSIONS[unit];
  if (!unitInfo) {
    return { quantity, unit };
  }

  // Optimisations d'affichage
  if (unitInfo.type === 'weight') {
    // Convertir en kg si >= 1000g
    if (quantity >= 1000) {
      return { quantity: quantity / 1000, unit: 'kg' };
    }
    return { quantity, unit: 'g' };
  }

  if (unitInfo.type === 'volume') {
    // Convertir en L si >= 1000ml
    if (quantity >= 1000) {
      return { quantity: quantity / 1000, unit: 'L' };
    }
    // Convertir en cl si multiple de 10ml et < 100ml
    if (quantity % 10 === 0 && quantity < 100) {
      return { quantity: quantity / 10, unit: 'cl' };
    }
    return { quantity, unit: 'ml' };
  }

  return { quantity, unit };
}

// Normaliser l'unité d'un ingrédient selon sa catégorie
export function normalizeIngredientUnit(ingredientName: string, category: string, currentUnit: string): string {
  const preferredUnits = CATEGORY_PREFERRED_UNITS[category] || ['g'];
  
  // Si l'unité actuelle est déjà dans les préférées, la garder
  if (preferredUnits.includes(currentUnit)) {
    return currentUnit;
  }

  // Règles spécifiques par ingrédient
  const specificRules: { [key: string]: string } = {
    // Légumes qui devraient être en pièces
    'carotte': 'pièce',
    'oignon': 'pièce',
    'poivron': 'pièce',
    'courgette': 'pièce',
    'aubergine': 'pièce',
    'tomate': 'pièce',
    'pomme-de-terre': 'pièce',
    
    // Légumes qui devraient être en grammes
    'champignon': 'g',
    'epinard': 'g',
    'salade-verte': 'g',
    'brocoli': 'g',
    'haricot-vert': 'g',
    
    // Fruits
    'banane': 'pièce',
    'pomme': 'pièce',
    'orange': 'pièce',
    'citron': 'pièce',
    
    // Produits laitiers
    'lait': 'ml',
    'creme': 'ml',
    'yaourt': 'pot',
    'fromage': 'g',
    'beurre': 'g',
    
    // Liquides
    'huile': 'ml',
    'eau': 'ml',
    'vinaigre': 'ml',
    
    // Épices
    'sel': 'pincée',
    'poivre': 'pincée',
    'ail': 'gousse'
  };

  return specificRules[ingredientName] || preferredUnits[0];
}

// Addition de quantités avec conversion automatique
export function addQuantities(
  qty1: number, 
  unit1: string, 
  qty2: number, 
  unit2: string
): { quantity: number; unit: string } {
  
  // Si même unité, addition simple
  if (unit1 === unit2) {
    return { quantity: qty1 + qty2, unit: unit1 };
  }

  // Conversion vers l'unité de base
  const base1 = convertToBaseUnit(qty1, unit1);
  const base2 = convertToBaseUnit(qty2, unit2);

  // Si types incompatibles, garder la première unité
  const unitInfo1 = UNIT_CONVERSIONS[unit1];
  const unitInfo2 = UNIT_CONVERSIONS[unit2];
  
  if (unitInfo1?.type !== unitInfo2?.type) {
    console.warn(`Types d'unités incompatibles: ${unit1} et ${unit2}`);
    return { quantity: qty1 + qty2, unit: unit1 };
  }

  // Addition en unité de base
  const totalBase = base1.quantity + base2.quantity;
  
  // Conversion pour affichage optimisé
  return convertToDisplayUnit(totalBase, base1.unit);
}

// Vérifier la compatibilité des unités
export function areUnitsCompatible(unit1: string, unit2: string): boolean {
  const info1 = UNIT_CONVERSIONS[unit1];
  const info2 = UNIT_CONVERSIONS[unit2];
  
  if (!info1 || !info2) return false;
  return info1.type === info2.type;
}

// Obtenir l'unité recommandée pour un ingrédient
export function getRecommendedUnit(ingredientName: string, category: string): string {
  return normalizeIngredientUnit(ingredientName, category, '');
}

// Convertir avec les équivalences spécifiques d'ingrédients
export function convertWithIngredientSpecific(
  quantity: number,
  fromUnit: string,
  ingredientName: string
): { quantity: number; unit: string; usedConversion?: string } {
  const ingredientKey = ingredientName.toLowerCase().replace(/\s+/g, '-');
  const specificConversions = INGREDIENT_SPECIFIC_CONVERSIONS[ingredientKey];
  
  if (specificConversions && specificConversions[fromUnit]) {
    const conversion = specificConversions[fromUnit];
    return {
      quantity: quantity * conversion.factor,
      unit: conversion.to,
      usedConversion: conversion.description
    };
  }
  
  // Sinon, utiliser la conversion standard
  const standardResult = convertToBaseUnit(quantity, fromUnit);
  return { 
    quantity: standardResult.quantity, 
    unit: standardResult.unit 
  };
}

// Obtenir toutes les équivalences disponibles pour un ingrédient
export function getIngredientEquivalences(ingredientName: string): Array<{
  from: string;
  to: string;
  factor: number;
  description: string;
}> {
  const ingredientKey = ingredientName.toLowerCase().replace(/\s+/g, '-');
  const specificConversions = INGREDIENT_SPECIFIC_CONVERSIONS[ingredientKey];
  
  if (!specificConversions) return [];
  
  return Object.entries(specificConversions).map(([fromUnit, conversion]) => ({
    from: fromUnit,
    to: conversion.to,
    factor: conversion.factor,
    description: conversion.description
  }));
}

// Obtenir les équivalences d'une unité générale
export function getUnitEquivalence(unit: string): string | undefined {
  const unitInfo = UNIT_CONVERSIONS[unit];
  return unitInfo?.equivalence;
}
