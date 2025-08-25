// Script de migration des unités abstraites vers unités concrètes
// Convertit pincée → g, càs → ml, pot → g, etc.

import { Ingredient } from '../data/recettesDeBase';

// Table de conversion des unités abstraites vers concrètes
const UNIT_MIGRATION_TABLE: Record<string, { newUnit: string; defaultQuantity?: number; description: string }> = {
  // Épices et herbes : 1 pincée = 0.5g
  'pincée': { 
    newUnit: 'g', 
    defaultQuantity: 0.5, 
    description: 'Pincée (0.5 g)' 
  },
  
  // Cuillères : 1 càs = 15ml, 1 càc = 5ml
  'càs': { 
    newUnit: 'ml', 
    defaultQuantity: 15, 
    description: 'Cuillère à soupe (15 ml)' 
  },
  'càc': { 
    newUnit: 'ml', 
    defaultQuantity: 5, 
    description: 'Cuillère à café (5 ml)' 
  },
  'cc': { 
    newUnit: 'ml', 
    defaultQuantity: 5, 
    description: 'Cuillère à café (5 ml)' 
  },
  'cs': { 
    newUnit: 'ml', 
    defaultQuantity: 15, 
    description: 'Cuillère à soupe (15 ml)' 
  },
  'cuillère': { 
    newUnit: 'ml', 
    defaultQuantity: 15, 
    description: 'Cuillère (15 ml)' 
  },

  // Contenants standards
  'pot': { 
    newUnit: 'g', 
    defaultQuantity: 125, 
    description: 'Pot de yaourt (125 g)' 
  },
  'sachet': { 
    newUnit: 'g', 
    defaultQuantity: 11, 
    description: 'Sachet de levure (11 g)' 
  },
  'boîte': { 
    newUnit: 'g', 
    defaultQuantity: 400, 
    description: 'Boîte conserve (400 g)' 
  },
  'paquet': { 
    newUnit: 'g', 
    defaultQuantity: 500, 
    description: 'Paquet (500 g)' 
  },

  // Mesures de volume
  'tasse': { 
    newUnit: 'ml', 
    defaultQuantity: 250, 
    description: 'Tasse (250 ml)' 
  },
  'verre': { 
    newUnit: 'ml', 
    defaultQuantity: 200, 
    description: 'Verre (200 ml)' 
  },

  // Légumes et herbes fraîches
  'botte': { 
    newUnit: 'g', 
    defaultQuantity: 100, 
    description: 'Botte (100 g)' 
  },
  'branche': { 
    newUnit: 'g', 
    defaultQuantity: 5, 
    description: 'Branche (5 g)' 
  },
  'feuille': { 
    newUnit: 'g', 
    defaultQuantity: 1, 
    description: 'Feuille (1 g)' 
  },

  // Viandes et fromages
  'tranche': { 
    newUnit: 'g', 
    defaultQuantity: 25, 
    description: 'Tranche (25 g)' 
  },

  // Ail
  'gousse': { 
    newUnit: 'g', 
    defaultQuantity: 3, 
    description: 'Gousse d\'ail (3 g)' 
  }
};

// Conversions spécifiques par ingrédient (pour plus de précision)
const INGREDIENT_SPECIFIC_MIGRATIONS: Record<string, { newUnit: string; defaultQuantity: number; description: string }> = {
  // Yaourts (pot standard)
  'yaourt': { 
    newUnit: 'g', 
    defaultQuantity: 125, 
    description: 'Pot de yaourt (125 g)' 
  },

  // Levure (sachet standard)
  'levure': { 
    newUnit: 'g', 
    defaultQuantity: 11, 
    description: 'Sachet de levure (11 g)' 
  },

  // Sauces (cuillère à soupe)
  'moutarde': { 
    newUnit: 'ml', 
    defaultQuantity: 15, 
    description: 'Cuillère à soupe (15 ml)' 
  },
  'ketchup': { 
    newUnit: 'ml', 
    defaultQuantity: 15, 
    description: 'Cuillère à soupe (15 ml)' 
  },
  'mayonnaise': { 
    newUnit: 'ml', 
    defaultQuantity: 15, 
    description: 'Cuillère à soupe (15 ml)' 
  },
  'vinaigrette': { 
    newUnit: 'ml', 
    defaultQuantity: 15, 
    description: 'Cuillère à soupe (15 ml)' 
  },

  // Café (cuillère à soupe)
  'cafe': { 
    newUnit: 'g', 
    defaultQuantity: 6, 
    description: 'Cuillère à soupe de café (6 g)' 
  },

  // Jambon (tranche)
  'jambon': { 
    newUnit: 'g', 
    defaultQuantity: 25, 
    description: 'Tranche de jambon (25 g)' 
  },
  'jambon-blanc': { 
    newUnit: 'g', 
    defaultQuantity: 25, 
    description: 'Tranche de jambon (25 g)' 
  },

  // Pain (tranche)
  'pain': { 
    newUnit: 'g', 
    defaultQuantity: 30, 
    description: 'Tranche de pain (30 g)' 
  },
  'pain-de-mie': { 
    newUnit: 'g', 
    defaultQuantity: 25, 
    description: 'Tranche de pain de mie (25 g)' 
  }
};

// Fonction pour migrer un ingrédient
export function migrateIngredientUnit(ingredient: Ingredient): Ingredient {
  const currentUnit = ingredient.unite;
  
  if (!currentUnit) {
    return ingredient;
  }

  // Vérifier d'abord les conversions spécifiques par ingrédient
  const specificMigration = INGREDIENT_SPECIFIC_MIGRATIONS[ingredient.id];
  if (specificMigration) {
    return {
      ...ingredient,
      unite: specificMigration.newUnit,
      quantite: ingredient.quantite || specificMigration.defaultQuantity
    };
  }

  // Puis les conversions génériques par unité
  const unitMigration = UNIT_MIGRATION_TABLE[currentUnit];
  if (unitMigration) {
    return {
      ...ingredient,
      unite: unitMigration.newUnit,
      quantite: ingredient.quantite || unitMigration.defaultQuantity
    };
  }

  // Si pas de conversion, garder tel quel
  return ingredient;
}

// Fonction pour migrer toute la base d'ingrédients
export function migrateAllIngredients(ingredients: Ingredient[]): Ingredient[] {
  return ingredients.map(migrateIngredientUnit);
}

// Fonction pour générer un rapport de migration
export function generateMigrationReport(ingredients: Ingredient[]): {
  migrations: Array<{
    ingredient: string;
    oldUnit: string;
    newUnit: string;
    defaultQuantity: number;
    description: string;
  }>;
  unchanged: Array<{
    ingredient: string;
    unit: string;
    reason: string;
  }>;
} {
  const migrations: any[] = [];
  const unchanged: any[] = [];

  ingredients.forEach(ingredient => {
    const currentUnit = ingredient.unite;
    
    if (!currentUnit) {
      unchanged.push({
        ingredient: ingredient.nom,
        unit: 'aucune',
        reason: 'Pas d\'unité définie'
      });
      return;
    }

    // Vérifier les conversions
    const specificMigration = INGREDIENT_SPECIFIC_MIGRATIONS[ingredient.id];
    const unitMigration = UNIT_MIGRATION_TABLE[currentUnit];
    
    if (specificMigration) {
      migrations.push({
        ingredient: ingredient.nom,
        oldUnit: currentUnit,
        newUnit: specificMigration.newUnit,
        defaultQuantity: specificMigration.defaultQuantity,
        description: specificMigration.description
      });
    } else if (unitMigration) {
      migrations.push({
        ingredient: ingredient.nom,
        oldUnit: currentUnit,
        newUnit: unitMigration.newUnit,
        defaultQuantity: unitMigration.defaultQuantity || 0,
        description: unitMigration.description
      });
    } else {
      unchanged.push({
        ingredient: ingredient.nom,
        unit: currentUnit,
        reason: 'Unité déjà concrète (g, ml, L, kg)'
      });
    }
  });

  return { migrations, unchanged };
}

// Fonction pour afficher le rapport de migration
export function displayMigrationReport(ingredients: Ingredient[]): void {
  const report = generateMigrationReport(ingredients);
  
  console.log('📋 RAPPORT DE MIGRATION DES UNITÉS');
  console.log('=====================================');
  
  if (report.migrations.length > 0) {
    console.log(`✅ ${report.migrations.length} ingrédients à migrer :`);
    console.log('');
    report.migrations.forEach(m => {
      console.log(`🔄 ${m.ingredient}: ${m.oldUnit} → ${m.newUnit} (${m.description})`);
    });
  }
  
  if (report.unchanged.length > 0) {
    console.log('');
    console.log(`✓ ${report.unchanged.length} ingrédients conservés :`);
    console.log('');
    report.unchanged.forEach(u => {
      console.log(`✓ ${u.ingredient} (${u.unit}) - ${u.reason}`);
    });
  }
  
  console.log('');
  console.log(`📊 Résumé: ${report.migrations.length} migrations, ${report.unchanged.length} conservés`);
}
