import { useState, useEffect } from 'react';
import { Recette, RecetteIngredient, ingredientsDeBase } from '../data/recettesDeBase';
import { useStock } from './useStock';
import { useRecettes } from './useRecettes';

export type PlanningEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  meal: 'lunch' | 'dinner';
  recetteId: string;
  recetteName: string;
  generated?: boolean; // Indique si c'est généré automatiquement
  confirmed?: boolean; // Utilisateur a confirmé le choix
};

export type PlanningWeek = {
  [date: string]: {
    lunch?: PlanningEntry;
    dinner?: PlanningEntry;
  };
};

const STORAGE_KEY = 'mealcraft_planning';

export function usePlanning() {
  const [planning, setPlanning] = useState<PlanningWeek>({});
  const { stock } = useStock();
  const { recettes } = useRecettes();

  // Charger le planning
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPlanning(JSON.parse(saved));
      } catch (error) {
        console.error('Erreur chargement planning:', error);
      }
    }
  }, []);

  // Sauvegarder le planning
  const savePlanning = (newPlanning: PlanningWeek) => {
    setPlanning(newPlanning);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlanning));
  };

  // Calculer le score de compatibilité d'une recette avec le stock
  const calculateRecipeScore = (recette: Recette): number => {
    let score = 0;
    const totalIngredients = recette.ingredients.length;

    recette.ingredients.forEach(ingredient => {
      const stockItem = stock.find(s => s.id === ingredient.ingredientId);
      if (stockItem && stockItem.quantite && stockItem.quantite >= ingredient.quantite) {
        score += 2; // Ingrédient disponible en quantité
      } else if (stockItem && stockItem.quantite && stockItem.quantite > 0) {
        score += 1; // Ingrédient partiellement disponible
      }
      // Sinon 0 point
    });

    return totalIngredients > 0 ? (score / (totalIngredients * 2)) * 100 : 0;
  };

  // Générer des suggestions pour une semaine
  const generateWeekSuggestions = (startDate: Date): PlanningEntry[] => {
    console.log('🎯 Génération planning - Date début:', startDate.toISOString().split('T')[0]);
    console.log('📚 Nombre de recettes disponibles:', recettes.length);
    
    const suggestions: PlanningEntry[] = [];
    const usedRecettes: string[] = []; // Tracker les recettes utilisées récemment

    // Générer pour 7 jours, 2 repas par jour
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + dayOffset);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      console.log(`📅 Jour ${dayOffset + 1}: ${dateStr}`);

      ['lunch', 'dinner'].forEach((meal) => {
        if (recettes.length > 0) {
          // Filtrer les recettes pour éviter les répétitions trop fréquentes
          const availableRecettes = recettes.filter(r => {
            // Ne pas utiliser la même recette dans les 3 derniers repas
            const recentUses = usedRecettes.slice(-3);
            return !recentUses.includes(r.id);
          });

          console.log(`  🍽️ ${meal}: ${availableRecettes.length} recettes disponibles`);

          // Si aucune recette disponible (cas rare), utiliser toutes les recettes
          const recettesToUse = availableRecettes.length > 0 ? availableRecettes : recettes;

          // Trier par score de compatibilité avec le stock
          const scored = recettesToUse
            .map(r => ({ recette: r, score: calculateRecipeScore(r) }))
            .sort((a, b) => b.score - a.score);

          // Prendre une des 5 meilleures (plus de variété)
          const topChoices = scored.slice(0, Math.min(5, scored.length));
          const chosen = topChoices[Math.floor(Math.random() * topChoices.length)];

          if (chosen) {
            console.log(`    ✅ Choisi: ${chosen.recette.nom} (score: ${chosen.score.toFixed(1)})`);
            
            suggestions.push({
              id: `${dateStr}-${meal}`,
              date: dateStr,
              meal: meal as 'lunch' | 'dinner',
              recetteId: chosen.recette.id,
              recetteName: chosen.recette.nom,
              generated: true,
              confirmed: false
            });

            // Ajouter à la liste des recettes utilisées
            usedRecettes.push(chosen.recette.id);
            
            // Garder seulement les 6 dernières utilisations pour la mémoire
            if (usedRecettes.length > 6) {
              usedRecettes.shift();
            }
          } else {
            console.log(`    ❌ Aucune recette trouvée pour ${meal}`);
          }
        }
      });
    }

    console.log('🎉 Génération terminée:', suggestions.length, 'suggestions créées');
    console.log('📋 Suggestions:', suggestions.map(s => `${s.date} ${s.meal}: ${s.recetteName}`));
    
    return suggestions;
  };

  // Ajouter plusieurs entrées au planning en une seule fois
  const addMultipleToPlanning = (entries: Omit<PlanningEntry, 'id'>[]) => {
    console.log('📝 addMultipleToPlanning appelé avec', entries.length, 'entrées');
    
    const newPlanning = { ...planning };
    
    entries.forEach(entry => {
      const dateKey = entry.date;
      
      if (!newPlanning[dateKey]) {
        newPlanning[dateKey] = {};
      }

      const id = `${entry.date}-${entry.meal}`;
      newPlanning[dateKey][entry.meal] = {
        ...entry,
        id
      };
      
      console.log('➕ Ajouté au batch:', dateKey, entry.meal, '->', entry.recetteName);
    });

    console.log('💾 Sauvegarde complète du planning avec', Object.keys(newPlanning).length, 'dates');
    
    savePlanning(newPlanning);
  };

  // Ajouter une entrée au planning
  const addToPlanning = (entry: Omit<PlanningEntry, 'id'>) => {
    console.log('📝 addToPlanning appelé avec:', entry);
    
    const newPlanning = { ...planning };
    const dateKey = entry.date;
    
    if (!newPlanning[dateKey]) {
      newPlanning[dateKey] = {};
    }

    const id = `${entry.date}-${entry.meal}`;
    newPlanning[dateKey][entry.meal] = {
      ...entry,
      id
    };

    console.log('💾 Nouveau planning pour', dateKey, ':', newPlanning[dateKey]);
    
    savePlanning(newPlanning);
  };

  // Supprimer une entrée
  const removeFromPlanning = (date: string, meal: 'lunch' | 'dinner') => {
    const newPlanning = { ...planning };
    if (newPlanning[date] && newPlanning[date][meal]) {
      delete newPlanning[date][meal];
      if (!newPlanning[date].lunch && !newPlanning[date].dinner) {
        delete newPlanning[date];
      }
    }
    savePlanning(newPlanning);
  };

  // Confirmer une suggestion générée
  const confirmSuggestion = (date: string, meal: 'lunch' | 'dinner') => {
    const entry = planning[date]?.[meal];
    if (entry && entry.generated) {
      const newPlanning = { ...planning };
      newPlanning[date][meal] = { ...entry, confirmed: true };
      savePlanning(newPlanning);
    }
  };

  // Calculer les ingrédients nécessaires pour la semaine
  const getWeeklyIngredients = (startDate: Date): RecetteIngredient[] => {
    const weeklyIngredients: Map<string, RecetteIngredient> = new Map();

    // Parcourir 7 jours
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + dayOffset);
      const dateStr = currentDate.toISOString().split('T')[0];

      const dayPlanning = planning[dateStr];
      if (dayPlanning) {
        [dayPlanning.lunch, dayPlanning.dinner].forEach(entry => {
          if (entry) {
            const recette = recettes.find(r => r.id === entry.recetteId);
            if (recette) {
              recette.ingredients.forEach(ingredient => {
                const existing = weeklyIngredients.get(ingredient.ingredientId);
                if (existing) {
                  weeklyIngredients.set(ingredient.ingredientId, {
                    ...existing,
                    quantite: existing.quantite + ingredient.quantite
                  });
                } else {
                  weeklyIngredients.set(ingredient.ingredientId, { ...ingredient });
                }
              });
            }
          }
        });
      }
    }

    return Array.from(weeklyIngredients.values());
  };

  // Générer une liste de courses
  const generateShoppingList = (startDate: Date): RecetteIngredient[] => {
    const needed = getWeeklyIngredients(startDate);
    const missing: RecetteIngredient[] = [];

    needed.forEach(ingredient => {
      const stockItem = stock.find(s => s.id === ingredient.ingredientId);
      const available = stockItem?.quantite || 0;
      
      if (available < ingredient.quantite) {
        missing.push({
          ...ingredient,
          quantite: ingredient.quantite - available
        });
      }
    });

    return missing;
  };

  return {
    planning,
    addToPlanning,
    addMultipleToPlanning,
    removeFromPlanning,
    confirmSuggestion,
    generateWeekSuggestions,
    getWeeklyIngredients,
    generateShoppingList,
    calculateRecipeScore
  };
}
