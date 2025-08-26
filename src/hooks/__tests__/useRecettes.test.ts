import { renderHook, act } from '@testing-library/react'
import { useRecettes } from '../useRecettes'

// Mock localStorage
const mockLocalStorage = () => {
  let store: { [key: string]: string } = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    })
  }
}

// Mock pour générer un ID unique
jest.mock('../useRecettes', () => {
  const actual = jest.requireActual('../useRecettes')
  return {
    ...actual,
    // On peut mocker la génération d'ID si nécessaire
  }
})

describe('useRecettes', () => {
  let mockStorage: ReturnType<typeof mockLocalStorage>

  beforeEach(() => {
    mockStorage = mockLocalStorage()
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    })
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should initialize with empty custom recipes', () => {
    const { result } = renderHook(() => useRecettes())
    
    // Doit retourner les recettes de base + aucune custom au début
    expect(Array.isArray(result.current.recettes)).toBe(true)
    expect(result.current.recettes.length).toBeGreaterThan(0) // Recettes de base
    expect(result.current.isEmpty).toBe(false) // Car il y a les recettes de base
  })

  test('should add a new recipe', async () => {
    const { result } = renderHook(() => useRecettes())
    
    const newRecipe = {
      id: 'test-recipe-1',
      nom: 'Test Recipe',
      categorie: 'test',
      ingredients: [
        { ingredientId: 'farine', quantite: 100, unite: 'g' }
      ],
      etapes: ['Étape 1', 'Étape 2'],
      tempsPreparation: 10,
      tempsCuisson: 20,
      tags: ['test']
    }

    await act(async () => {
      result.current.addRecette(newRecipe)
    })

    // Vérifier que la recette a été ajoutée
    const addedRecipe = result.current.recettes.find(r => r.id === 'test-recipe-1')
    expect(addedRecipe).toBeDefined()
    expect(addedRecipe?.nom).toBe('Test Recipe')

    // Vérifier que localStorage a été appelé
    expect(mockStorage.setItem).toHaveBeenCalled()
  })

  test('should edit an existing recipe', async () => {
    const { result } = renderHook(() => useRecettes())
    
    // Ajouter d'abord une recette
    const newRecipe = {
      id: 'test-recipe-edit',
      nom: 'Recipe to Edit',
      categorie: 'test',
      ingredients: [],
      etapes: [],
      tags: ['test']
    }

    await act(async () => {
      result.current.addRecette(newRecipe)
    })

    // Modifier la recette
    const updatedRecipe = {
      ...newRecipe,
      nom: 'Updated Recipe',
      tempsPreparation: 15
    }

    await act(async () => {
      result.current.editRecette('test-recipe-edit', updatedRecipe)
    })

    // Vérifier que la recette a été modifiée
    const editedRecipe = result.current.recettes.find(r => r.id === 'test-recipe-edit')
    expect(editedRecipe?.nom).toBe('Updated Recipe')
    expect(editedRecipe?.tempsPreparation).toBe(15)
  })

  test('should delete a recipe', async () => {
    const { result } = renderHook(() => useRecettes())
    
    // Ajouter d'abord une recette
    const newRecipe = {
      id: 'test-recipe-delete',
      nom: 'Recipe to Delete',
      categorie: 'test',
      ingredients: [
        { ingredientId: 'farine', quantite: 100, unite: 'g' }
      ],
      etapes: ['Étape 1'],
      tags: ['test']
    }

    await act(async () => {
      result.current.addRecette(newRecipe)
    })

    // Vérifier que la recette existe
    expect(result.current.recettes.find(r => r.id === 'test-recipe-delete')).toBeDefined()

    // Supprimer la recette
    await act(async () => {
      result.current.deleteRecette('test-recipe-delete')
    })

    // Vérifier que la recette a été supprimée
    expect(result.current.recettes.find(r => r.id === 'test-recipe-delete')).toBeUndefined()
  })

  test('should handle localStorage errors gracefully', () => {
    // Simuler une erreur localStorage
    mockStorage.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    const { result } = renderHook(() => useRecettes())
    
    const newRecipe = {
      id: 'error-recipe',
      nom: 'Error Recipe',
      categorie: 'test',
      ingredients: [],
      etapes: [],
      tags: ['test']
    }    // Ne devrait pas planter même avec une erreur localStorage
    expect(() => {
      act(() => {
        result.current.addRecette(newRecipe)
      })
    }).not.toThrow()
  })

  test('should load existing data from localStorage', () => {
    // Simuler des données existantes dans localStorage
    const existingRecipes = [{
      id: 'existing-recipe',
      nom: 'Existing Recipe',
      categorie: 'test',
      ingredients: [],
      etapes: [],
      tags: ['test']
    }]

    // Simuler les clés séparées comme dans le vrai code
    mockStorage.getItem.mockImplementation((key) => {
      if (key === 'mealcraft_recettes') return JSON.stringify(existingRecipes)
      if (key === 'mealcraft_recettes_deleted') return JSON.stringify([])
      return null
    })

    const { result } = renderHook(() => useRecettes())
    
    // Devrait charger la recette existante
    expect(result.current.recettes.find(r => r.id === 'existing-recipe')).toBeDefined()
  })

  test('should handle malformed localStorage data', () => {
    // Simuler des données corrompues
    mockStorage.getItem.mockReturnValue('{"invalid": json}')

    // Ne devrait pas planter avec des données invalides
    expect(() => {
      renderHook(() => useRecettes())
    }).not.toThrow()
  })
})
