// Service de gestion des identifiants numériques d'ingrédients
// Maintient la correspondance entre IDs texte et numéros pour l'UX

const STORAGE_KEY = 'mealcraft_ingredient_ids';

interface IngredientIdMapping {
  [textId: string]: number;
}

class IngredientIdService {
  private mapping: IngredientIdMapping = {};
  private reverseMapping: { [numId: number]: string } = {};
  private nextId = 1;

  constructor() {
    this.loadMapping();
  }

  // Charger la correspondance depuis localStorage
  private loadMapping() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.mapping = data.mapping || {};
        this.nextId = data.nextId || 1;
        
        // Reconstruire le mapping inverse
        this.reverseMapping = {};
        Object.keys(this.mapping).forEach(textId => {
          this.reverseMapping[this.mapping[textId]] = textId;
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des IDs d\'ingrédients:', error);
    }
  }

  // Sauvegarder la correspondance
  private saveMapping() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        mapping: this.mapping,
        nextId: this.nextId
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des IDs d\'ingrédients:', error);
    }
  }

  // Obtenir le numéro d'un ingrédient (créer si n'existe pas)
  getNumericId(textId: string): number {
    if (!this.mapping[textId]) {
      this.mapping[textId] = this.nextId++;
      this.reverseMapping[this.mapping[textId]] = textId;
      this.saveMapping();
    }
    return this.mapping[textId];
  }

  // Obtenir l'ID texte à partir du numéro
  getTextId(numericId: number): string | null {
    return this.reverseMapping[numericId] || null;
  }

  // Rechercher des ingrédients par nom
  searchIngredients(query: string, maxResults = 10): Array<{ id: string; numId: number; nom: string }> {
    const results: Array<{ id: string; numId: number; nom: string }> = [];
    
    // Import dynamique pour éviter les dépendances circulaires
    import('../data/recettesDeBase').then(({ ingredientsDeBase }) => {
      ingredientsDeBase
        .filter(ing => ing.nom.toLowerCase().includes(query.toLowerCase()))
        .slice(0, maxResults)
        .forEach(ing => {
          results.push({
            id: ing.id,
            numId: this.getNumericId(ing.id),
            nom: ing.nom
          });
        });
    });
    
    return results;
  }

  // Obtenir tous les ingrédients avec leurs numéros
  getAllMappings(): Array<{ id: string; numId: number }> {
    return Object.keys(this.mapping).map(textId => ({
      id: textId,
      numId: this.mapping[textId]
    }));
  }

  // Réinitialiser tous les IDs (utile pour le développement)
  resetAllIds() {
    this.mapping = {};
    this.reverseMapping = {};
    this.nextId = 1;
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Instance singleton
export const ingredientIdService = new IngredientIdService();

// Hook React pour utiliser le service
import { useState, useEffect } from 'react';

export function useIngredientSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; numId: number; nom: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Import dynamique des ingrédients de base
    import('../data/recettesDeBase').then(({ ingredientsDeBase }) => {
      const results = ingredientsDeBase
        .filter(ing => ing.nom.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 10)
        .map(ing => ({
          id: ing.id,
          numId: ingredientIdService.getNumericId(ing.id),
          nom: ing.nom
        }));
      
      setSearchResults(results);
      setIsSearching(false);
    });
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching
  };
}
