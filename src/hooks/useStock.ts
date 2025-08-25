import { useState, useEffect } from 'react';
import { Ingredient, Recette } from '../data/recettesDeBase';
import { StockAlert } from '../types';
import { addQuantities, convertToDisplayUnit, areUnitsCompatible } from '../utils/unitConverter';

const STORAGE_KEY = 'mealcraft_stock';

export function useStock() {
  const [stock, setStock] = useState<Ingredient[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);

  // Charger le stock au démarrage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStock(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement du stock:', error);
      }
    }
  }, []);

  // Sauvegarder le stock
  const saveStock = (newStock: Ingredient[]) => {
    setStock(newStock);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStock));
    checkStockAlerts(newStock);
  };

  // Ajouter un ingrédient
  const addIngredient = (ingredient: Ingredient) => {
    const existingItem = stock.find(i => i.id === ingredient.id);
    
    if (existingItem) {
      // Si l'ingrédient existe déjà, on additionne les quantités
      const totalQuantity = addQuantities(
        existingItem.quantite || 0, existingItem.unite || 'g',
        ingredient.quantite || 1, ingredient.unite || 'g'
      );
      
      const newStock = stock.map(item =>
        item.id === ingredient.id
          ? { ...item, quantite: totalQuantity.quantity, unite: totalQuantity.unit }
          : item
      );
      saveStock(newStock);
      return true;
    } else {
      // Nouvel ingrédient
      const newStock = [...stock, { ...ingredient, quantite: ingredient.quantite || 1 }];
      saveStock(newStock);
      return true;
    }
  };

  // Modifier la quantité d'un ingrédient
  const updateQuantity = (id: string, delta: number) => {
    const newStock = stock.map(item =>
      item.id === id
        ? { ...item, quantite: Math.max(0, (item.quantite || 1) + delta) }
        : item
    ).filter(item => (item.quantite || 0) > 0);
    saveStock(newStock);
  };

  // Supprimer un ingrédient
  const removeIngredient = (id: string) => {
    const newStock = stock.filter(item => item.id !== id);
    saveStock(newStock);
  };

  // Consommer les ingrédients d'une recette
  const consumeRecipeIngredients = (recette: Recette, portions: number = 1) => {
    const newStock = [...stock];
    let success = true;
    
    for (const ingredient of recette.ingredients) {
      const stockItem = newStock.find(item => item.id === ingredient.ingredientId);
      if (!stockItem) {
        success = false;
        break;
      }
      
      const quantiteNecessaire = ingredient.quantite * portions;
      const uniteNecessaire = ingredient.unite || 'g';
      const stockQuantite = stockItem.quantite || 0;
      const stockUnite = stockItem.unite || 'g';
      
      // Vérifier si les unités sont compatibles et convertir si nécessaire
      if (!areUnitsCompatible(stockUnite, uniteNecessaire)) {
        success = false;
        break;
      }
      
      // Convertir la quantité nécessaire vers l'unité du stock
      const { quantity: quantiteConverted } = addQuantities(0, stockUnite, quantiteNecessaire, uniteNecessaire);
      
      if (stockQuantite < quantiteConverted) {
        success = false;
        break;
      }
      
      stockItem.quantite = stockQuantite - quantiteConverted;
    }
    
    if (success) {
      const filteredStock = newStock.filter(item => (item.quantite || 0) > 0);
      saveStock(filteredStock);
    }
    
    return success;
  };

  // Vérifier si on peut faire une recette
  const canMakeRecipe = (recette: Recette, portions: number = 1): boolean => {
    return recette.ingredients.every(ingredient => {
      const stockItem = stock.find(item => item.id === ingredient.ingredientId);
      if (!stockItem) return false;
      
      const quantiteNecessaire = ingredient.quantite * portions;
      const uniteNecessaire = ingredient.unite || 'g';
      const stockQuantite = stockItem.quantite || 0;
      const stockUnite = stockItem.unite || 'g';
      
      // Vérifier si les unités sont compatibles
      if (!areUnitsCompatible(stockUnite, uniteNecessaire)) return false;
      
      // Convertir la quantité nécessaire vers l'unité du stock
      const { quantity: quantiteConverted } = addQuantities(0, stockUnite, quantiteNecessaire, uniteNecessaire);
      
      return stockQuantite >= quantiteConverted;
    });
  };

  // Obtenir les ingrédients manquants pour une recette
  const getMissingIngredients = (recette: Recette, portions: number = 1) => {
    return recette.ingredients.filter(ingredient => {
      const stockItem = stock.find(item => item.id === ingredient.ingredientId);
      if (!stockItem) return true;
      
      const quantiteNecessaire = ingredient.quantite * portions;
      const uniteNecessaire = ingredient.unite || 'g';
      const stockQuantite = stockItem.quantite || 0;
      const stockUnite = stockItem.unite || 'g';
      
      // Si les unités ne sont pas compatibles, considérer comme manquant
      if (!areUnitsCompatible(stockUnite, uniteNecessaire)) return true;
      
      // Convertir et vérifier
      const { quantity: quantiteConverted } = addQuantities(0, stockUnite, quantiteNecessaire, uniteNecessaire);
      return stockQuantite < quantiteConverted;
    }).map(ingredient => {
      const stockItem = stock.find(item => item.id === ingredient.ingredientId);
      const quantiteNecessaire = ingredient.quantite * portions;
      let quantiteManquante = quantiteNecessaire;
      
      if (stockItem) {
        const stockQuantite = stockItem.quantite || 0;
        const stockUnite = stockItem.unite || 'g';
        const uniteNecessaire = ingredient.unite || 'g';
        
        if (areUnitsCompatible(stockUnite, uniteNecessaire)) {
          // Convertir le stock vers l'unité de la recette pour calculer ce qui manque
          const { quantity: stockConverted } = addQuantities(0, uniteNecessaire, stockQuantite, stockUnite);
          quantiteManquante = Math.max(0, quantiteNecessaire - stockConverted);
        }
      }
      
      return {
        ...ingredient,
        quantiteManquante
      };
    });
  };

  // Vérifier les alertes de stock
  const checkStockAlerts = (currentStock: Ingredient[]) => {
    const newAlerts: StockAlert[] = [];
    
    currentStock.forEach(item => {
      // Seuil bas (moins de 2 unités ou moins de 100g)
      const seuil = item.unite === 'g' ? 100 : 2;
      if ((item.quantite || 0) <= seuil) {
        newAlerts.push({
          ingredientId: item.id,
          type: 'faible',
          seuil,
        });
      }
    });
    
    setAlerts(newAlerts);
  };

  // Obtenir les recettes faisables
  const getAvailableRecipes = (allRecipes: Recette[], portions: number = 1) => {
    return allRecipes.filter(recette => canMakeRecipe(recette, portions));
  };

  return {
    stock,
    alerts,
    addIngredient,
    updateQuantity,
    removeIngredient,
    consumeRecipeIngredients,
    canMakeRecipe,
    getMissingIngredients,
    getAvailableRecipes,
    setStock: saveStock,
  };
}
