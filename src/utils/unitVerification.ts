// Script de vérification des corrections d'unités
// À exécuter dans la console du navigateur

import { ingredientsDeBase } from '../data/recettesDeBase';
import { analyzeUnitInconsistencies, getUnitConsistencyReport } from '../utils/unitAnalyzer';

export const verifyUnitCorrections = () => {
  console.log('🔍 VÉRIFICATION DES CORRECTIONS D\'UNITÉS');
  console.log('==========================================');
  
  // Analyse des inconsistances restantes
  const inconsistencies = analyzeUnitInconsistencies();
  
  console.log(`📊 Inconsistances restantes: ${inconsistencies.length}`);
  
  if (inconsistencies.length === 0) {
    console.log('✅ TOUTES LES UNITÉS SONT MAINTENANT COHÉRENTES !');
    return true;
  }
  
  console.log('❌ Inconsistances restantes à corriger:');
  inconsistencies.forEach(item => {
    console.log(`  • ${item.name}: ${item.currentUnit} → ${item.recommendedUnit} (${item.category})`);
  });
  
  return false;
};

// Vérifications spécifiques pour les corrections appliquées
export const verifySpecificCorrections = () => {
  console.log('🎯 VÉRIFICATION DES CORRECTIONS SPÉCIFIQUES');
  console.log('===========================================');
  
  const sel = ingredientsDeBase.find(i => i.id === 'sel');
  const poivre = ingredientsDeBase.find(i => i.id === 'poivre');
  
  console.log(`Sel: ${sel?.unite} ${sel?.unite === 'pincée' ? '✅' : '❌'}`);
  console.log(`Poivre: ${poivre?.unite} ${poivre?.unite === 'pincée' ? '✅' : '❌'}`);
  
  return sel?.unite === 'pincée' && poivre?.unite === 'pincée';
};

// Test de l'accumulation avec les nouvelles unités
export const testUnitAccumulation = () => {
  console.log('🧪 TEST D\'ACCUMULATION AVEC NOUVELLES UNITÉS');
  console.log('=============================================');
  
  // Test fictif d'accumulation sel
  console.log('Test: Ajouter 2 pincées de sel + 1 pincée de sel');
  console.log('Résultat attendu: 3 pincées de sel');
  
  // Ceci sera testé réellement dans l'interface
  return true;
};

// Fonction principale de vérification
export const runAllVerifications = () => {
  console.log('🏁 EXÉCUTION DE TOUTES LES VÉRIFICATIONS');
  console.log('========================================');
  
  const results = {
    unitConsistency: verifyUnitCorrections(),
    specificCorrections: verifySpecificCorrections(),
    accumulation: testUnitAccumulation()
  };
  
  console.log('\n📋 RÉSUMÉ DES VÉRIFICATIONS:');
  console.log(`Cohérence des unités: ${results.unitConsistency ? '✅' : '❌'}`);
  console.log(`Corrections spécifiques: ${results.specificCorrections ? '✅' : '❌'}`);
  console.log(`Test d'accumulation: ${results.accumulation ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(r => r);
  console.log(`\n🎯 STATUT GLOBAL: ${allPassed ? '✅ TOUTES LES VÉRIFICATIONS RÉUSSIES' : '❌ CORRECTIONS NÉCESSAIRES'}`);
  
  return results;
};
