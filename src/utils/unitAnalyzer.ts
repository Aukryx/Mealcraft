import { ingredientsDeBase } from '../data/recettesDeBase';
import { normalizeIngredientUnit } from './unitConverter';

// Analyse des inconsistances dans la base de données
export function analyzeUnitInconsistencies() {
  const inconsistencies: Array<{
    name: string;
    currentUnit: string;
    recommendedUnit: string;
    category: string;
  }> = [];

  ingredientsDeBase.forEach(ingredient => {
    const currentUnit = ingredient.unite || 'g';
    const recommendedUnit = normalizeIngredientUnit(
      ingredient.nom,
      ingredient.categorie,
      currentUnit
    );

    if (currentUnit !== recommendedUnit) {
      inconsistencies.push({
        name: ingredient.nom,
        currentUnit,
        recommendedUnit,
        category: ingredient.categorie
      });
    }
  });

  return inconsistencies;
}

// Générer une version corrigée de la base de données
export function generateNormalizedIngredients() {
  return ingredientsDeBase.map(ingredient => {
    const currentUnit = ingredient.unite || 'g';
    const normalizedUnit = normalizeIngredientUnit(
      ingredient.nom,
      ingredient.categorie,
      currentUnit
    );

    return {
      ...ingredient,
      unite: normalizedUnit
    };
  });
}

// Rapport détaillé des changements
export function getUnitConsistencyReport() {
  const inconsistencies = analyzeUnitInconsistencies();
  
  console.log('🔍 RAPPORT DE CONSISTANCE DES UNITÉS');
  console.log('====================================');
  
  if (inconsistencies.length === 0) {
    console.log('✅ Toutes les unités sont cohérentes !');
    return;
  }

  console.log(`❌ ${inconsistencies.length} inconsistances détectées :`);
  console.log('');

  // Grouper par catégorie
  const byCategory = inconsistencies.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof inconsistencies>);

  Object.entries(byCategory).forEach(([category, items]) => {
    console.log(`📂 ${category.toUpperCase()}`);
    items.forEach(item => {
      console.log(`  • ${item.name}: ${item.currentUnit} → ${item.recommendedUnit}`);
    });
    console.log('');
  });

  // Statistiques par type d'unité
  const unitStats = inconsistencies.reduce((acc, item) => {
    const change = `${item.currentUnit} → ${item.recommendedUnit}`;
    acc[change] = (acc[change] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('📊 TYPES DE CHANGEMENTS');
  Object.entries(unitStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([change, count]) => {
      console.log(`  • ${change}: ${count} ingrédient(s)`);
    });

  return inconsistencies;
}

// Fonction pour appliquer les corrections (à utiliser avec précaution)
export function applyUnitNormalization() {
  console.warn('⚠️  Cette fonction modifierait la base de données. Implémentation à faire manuellement.');
  console.log('Pour appliquer les corrections, copiez le code généré par generateNormalizedIngredients()');
  console.log('et remplacez manuellement le contenu de recettesDeBase.ts');
}
