import { useState, useEffect } from 'react';
import { Ingredient, Recette } from '../data/recettesDeBase';
import { StockAlert } from '../types';

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
    if (stock.some(i => i.id === ingredient.id)) return false;
    const newStock = [...stock, { ...ingredient, quantite: ingredient.quantite || 1 }];
    saveStock(newStock);
    return true;
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
      if ((stockItem.quantite || 0) < quantiteNecessaire) {
        success = false;
        break;
      }
      
      stockItem.quantite = (stockItem.quantite || 0) - quantiteNecessaire;
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
      return stockItem && (stockItem.quantite || 0) >= ingredient.quantite * portions;
    });
  };

  // Obtenir les ingrédients manquants pour une recette
  const getMissingIngredients = (recette: Recette, portions: number = 1) => {
    return recette.ingredients.filter(ingredient => {
      const stockItem = stock.find(item => item.id === ingredient.ingredientId);
      return !stockItem || (stockItem.quantite || 0) < ingredient.quantite * portions;
    }).map(ingredient => ({
      ...ingredient,
      quantiteManquante: ingredient.quantite * portions - 
        (stock.find(item => item.id === ingredient.ingredientId)?.quantite || 0)
    }));
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
