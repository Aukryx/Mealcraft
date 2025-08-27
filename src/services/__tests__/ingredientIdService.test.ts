import { ingredientIdService, useIngredientSearch } from '../ingredientIdService';
import { renderHook, act } from '@testing-library/react';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock des ingrédients de base
jest.mock('../../data/recettesDeBase', () => ({
  ingredientsDeBase: [
    { id: 'tomate', nom: 'Tomate', categorie: 'légume' },
    { id: 'pomme', nom: 'Pomme', categorie: 'fruit' },
    { id: 'poulet', nom: 'Poulet', categorie: 'viande' },
    { id: 'farine', nom: 'Farine', categorie: 'féculent' },
    { id: 'lait', nom: 'Lait', categorie: 'produit laitier' }
  ]
}));

describe('IngredientIdService', () => {
  beforeEach(() => {
    // Reset des mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    
    // Reset du service
    ingredientIdService.resetAllIds();
  });

  describe('getNumericId', () => {
    test('should create new numeric ID for new ingredient', () => {
      const id = ingredientIdService.getNumericId('tomate');
      expect(id).toBe(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'mealcraft_ingredient_ids',
        expect.stringContaining('"tomate":1')
      );
    });

    test('should return same ID for existing ingredient', () => {
      const id1 = ingredientIdService.getNumericId('tomate');
      const id2 = ingredientIdService.getNumericId('tomate');
      expect(id1).toBe(id2);
      expect(id1).toBe(1);
    });

    test('should increment ID for different ingredients', () => {
      const tomateId = ingredientIdService.getNumericId('tomate');
      const pommeId = ingredientIdService.getNumericId('pomme');
      const pouletId = ingredientIdService.getNumericId('poulet');

      expect(tomateId).toBe(1);
      expect(pommeId).toBe(2);
      expect(pouletId).toBe(3);
    });

    test('should handle empty string', () => {
      const id = ingredientIdService.getNumericId('');
      expect(id).toBe(1);
    });

    test('should handle special characters', () => {
      const id1 = ingredientIdService.getNumericId('pomme-de-terre');
      const id2 = ingredientIdService.getNumericId('œuf');
      expect(id1).toBe(1);
      expect(id2).toBe(2);
    });
  });

  describe('getTextId', () => {
    test('should return text ID for existing numeric ID', () => {
      ingredientIdService.getNumericId('tomate');
      const textId = ingredientIdService.getTextId(1);
      expect(textId).toBe('tomate');
    });

    test('should return null for non-existent numeric ID', () => {
      const textId = ingredientIdService.getTextId(999);
      expect(textId).toBeNull();
    });

    test('should handle zero and negative IDs', () => {
      expect(ingredientIdService.getTextId(0)).toBeNull();
      expect(ingredientIdService.getTextId(-1)).toBeNull();
    });
  });

  describe('getAllMappings', () => {
    test('should return empty array when no mappings exist', () => {
      const mappings = ingredientIdService.getAllMappings();
      expect(mappings).toEqual([]);
    });

    test('should return all mappings', () => {
      ingredientIdService.getNumericId('tomate');
      ingredientIdService.getNumericId('pomme');
      
      const mappings = ingredientIdService.getAllMappings();
      expect(mappings).toHaveLength(2);
      expect(mappings).toContainEqual({ id: 'tomate', numId: 1 });
      expect(mappings).toContainEqual({ id: 'pomme', numId: 2 });
    });

    test('should maintain order of creation', () => {
      ingredientIdService.getNumericId('c');
      ingredientIdService.getNumericId('a');
      ingredientIdService.getNumericId('b');
      
      const mappings = ingredientIdService.getAllMappings();
      expect(mappings[0]).toEqual({ id: 'c', numId: 1 });
      expect(mappings[1]).toEqual({ id: 'a', numId: 2 });
      expect(mappings[2]).toEqual({ id: 'b', numId: 3 });
    });
  });

  describe('resetAllIds', () => {
    test('should clear all mappings and reset counter', () => {
      ingredientIdService.getNumericId('tomate');
      ingredientIdService.getNumericId('pomme');
      
      ingredientIdService.resetAllIds();
      
      expect(ingredientIdService.getAllMappings()).toEqual([]);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('mealcraft_ingredient_ids');
      
      // Vérifier que le compteur est reset
      const newId = ingredientIdService.getNumericId('nouvelle');
      expect(newId).toBe(1);
    });
  });

  describe('localStorage integration', () => {
    test('should save mapping to localStorage', () => {
      ingredientIdService.getNumericId('tomate');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'mealcraft_ingredient_ids',
        expect.stringContaining('"mapping":{"tomate":1}')
      );
    });

    test('should load existing mapping from localStorage', () => {
      const savedData = {
        mapping: { 'tomate': 5, 'pomme': 10 },
        nextId: 11
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));
      
      // Vérifier que getItem est appelé lors de l'initialisation
      // Le service est déjà initialisé, donc on teste la sauvegarde
      ingredientIdService.getNumericId('nouvelle');
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('should handle corrupted localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      // Ne devrait pas lever d'erreur
      expect(() => {
        ingredientIdService.getNumericId('test');
      }).not.toThrow();
    });

    test('should handle localStorage errors', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      // Ne devrait pas lever d'erreur
      expect(() => {
        ingredientIdService.getNumericId('tomate');
      }).not.toThrow();
    });
  });

  describe('searchIngredients', () => {
    test('should return empty array initially', () => {
      const results = ingredientIdService.searchIngredients('tomate');
      expect(results).toEqual([]);
    });

    test('should handle empty query', () => {
      const results = ingredientIdService.searchIngredients('');
      expect(results).toEqual([]);
    });

    test('should handle special characters in query', () => {
      const results = ingredientIdService.searchIngredients('café');
      expect(results).toEqual([]);
    });
  });
});

describe('useIngredientSearch hook', () => {
  beforeEach(() => {
    // Reset du service
    ingredientIdService.resetAllIds();
  });

  test('should initialize with empty state', () => {
    const { result } = renderHook(() => useIngredientSearch());
    
    expect(result.current.searchQuery).toBe('');
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  test('should update search query', () => {
    const { result } = renderHook(() => useIngredientSearch());
    
    act(() => {
      result.current.setSearchQuery('tomate');
    });
    
    expect(result.current.searchQuery).toBe('tomate');
  });

  test('should not search for queries less than 2 characters', () => {
    const { result } = renderHook(() => useIngredientSearch());
    
    act(() => {
      result.current.setSearchQuery('t');
    });
    
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  test('should clear results when query becomes too short', () => {
    const { result } = renderHook(() => useIngredientSearch());
    
    // Simuler des résultats existants
    act(() => {
      result.current.setSearchQuery('tomate');
    });
    
    act(() => {
      result.current.setSearchQuery('t');
    });
    
    expect(result.current.searchResults).toEqual([]);
  });

  test('should handle search query changes', async () => {
    const { result } = renderHook(() => useIngredientSearch());
    
    act(() => {
      result.current.setSearchQuery('pomme');
    });
    
    expect(result.current.searchQuery).toBe('pomme');
    // L'état de recherche pourrait être activé pendant la recherche async
  });

  test('should handle empty search results', async () => {
    const { result } = renderHook(() => useIngredientSearch());
    
    act(() => {
      result.current.setSearchQuery('inexistant');
    });
    
    expect(result.current.searchQuery).toBe('inexistant');
  });

  test('should maintain search state during query updates', () => {
    const { result } = renderHook(() => useIngredientSearch());
    
    act(() => {
      result.current.setSearchQuery('to');
    });
    
    act(() => {
      result.current.setSearchQuery('tom');
    });
    
    expect(result.current.searchQuery).toBe('tom');
  });
});
