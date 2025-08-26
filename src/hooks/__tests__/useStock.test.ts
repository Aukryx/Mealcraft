import { renderHook, act } from '@testing-library/react'
import { useStock } from '../useStock'
import { Ingredient, Recette } from '../../data/recettesDeBase'

// Mock localStorage
const mockStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockStorage
})

// Mock console.error pour les tests d'erreur
const originalConsoleError = console.error
const mockConsoleError = jest.fn()

describe('useStock', () => {
  beforeEach(() => {
    mockStorage.clear()
    mockStorage.getItem.mockClear()
    mockStorage.setItem.mockClear()
    console.error = mockConsoleError
    mockConsoleError.mockClear()
  })

  afterAll(() => {
    console.error = originalConsoleError
  })

  test('should initialize with empty stock', () => {
    const { result } = renderHook(() => useStock())
    
    expect(result.current.stock).toEqual([])
    expect(result.current.alerts).toEqual([])
  })

  test('should load existing stock from localStorage', () => {
    const existingStock: Ingredient[] = [
      { id: 'farine', nom: 'Farine', categorie: 'féculent', quantite: 1000, unite: 'g' },
      { id: 'sucre', nom: 'Sucre', categorie: 'autre', quantite: 500, unite: 'g' }
    ]

    mockStorage.getItem.mockReturnValue(JSON.stringify(existingStock))

    const { result } = renderHook(() => useStock())
    
    expect(result.current.stock).toEqual(existingStock)
  })

  test('should handle corrupted localStorage data', () => {
    mockStorage.getItem.mockReturnValue('{"invalid": json}')

    const { result } = renderHook(() => useStock())
    
    expect(result.current.stock).toEqual([])
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Erreur lors du chargement du stock:',
      expect.any(SyntaxError)
    )
  })

  test('should add new ingredient', () => {
    const { result } = renderHook(() => useStock())
    
    const newIngredient: Ingredient = {
      id: 'farine',
      nom: 'Farine',
      categorie: 'féculent',
      quantite: 1000,
      unite: 'g'
    }

    act(() => {
      const success = result.current.addIngredient(newIngredient)
      expect(success).toBe(true)
    })

    expect(result.current.stock).toContainEqual(newIngredient)
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      'mealcraft_stock',
      JSON.stringify([newIngredient])
    )
  })

  test('should add quantities when ingredient already exists', () => {
    const { result } = renderHook(() => useStock())
    
    const firstIngredient: Ingredient = {
      id: 'farine',
      nom: 'Farine',
      categorie: 'féculent',
      quantite: 500,
      unite: 'g'
    }

    const additionalIngredient: Ingredient = {
      id: 'farine',
      nom: 'Farine',
      categorie: 'féculent',
      quantite: 500,
      unite: 'g'
    }

    act(() => {
      result.current.addIngredient(firstIngredient)
    })

    act(() => {
      result.current.addIngredient(additionalIngredient)
    })

    expect(result.current.stock).toHaveLength(1)
    expect(result.current.stock[0].quantite).toBe(1000)
  })

  test('should update ingredient quantity', () => {
    const { result } = renderHook(() => useStock())
    
    const ingredient: Ingredient = {
      id: 'farine',
      nom: 'Farine',
      categorie: 'féculent',
      quantite: 1000,
      unite: 'g'
    }

    act(() => {
      result.current.addIngredient(ingredient)
    })

    act(() => {
      result.current.updateQuantity('farine', -200)
    })

    expect(result.current.stock[0].quantite).toBe(800)
  })

  test('should remove ingredient when quantity reaches zero', () => {
    const { result } = renderHook(() => useStock())
    
    const ingredient: Ingredient = {
      id: 'farine',
      nom: 'Farine',
      categorie: 'féculent',
      quantite: 100,
      unite: 'g'
    }

    act(() => {
      result.current.addIngredient(ingredient)
    })

    act(() => {
      result.current.updateQuantity('farine', -100)
    })

    expect(result.current.stock).toHaveLength(0)
  })

  test('should not allow negative quantities', () => {
    const { result } = renderHook(() => useStock())
    
    const ingredient: Ingredient = {
      id: 'farine',
      nom: 'Farine',
      categorie: 'féculent',
      quantite: 100,
      unite: 'g'
    }

    act(() => {
      result.current.addIngredient(ingredient)
    })

    act(() => {
      result.current.updateQuantity('farine', -200)
    })

    expect(result.current.stock).toHaveLength(0)
  })

  test('should remove ingredient completely', () => {
    const { result } = renderHook(() => useStock())
    
    const ingredient: Ingredient = {
      id: 'farine',
      nom: 'Farine',
      categorie: 'féculent',
      quantite: 1000,
      unite: 'g'
    }

    act(() => {
      result.current.addIngredient(ingredient)
    })

    act(() => {
      result.current.removeIngredient('farine')
    })

    expect(result.current.stock).toHaveLength(0)
  })

  test('should check if recipe can be made', () => {
    const { result } = renderHook(() => useStock())
    
    // Ajouter des ingrédients au stock (séparément pour React)
    act(() => {
      result.current.addIngredient({ id: 'farine', nom: 'Farine', categorie: 'féculent', quantite: 1000, unite: 'g' })
    })
    
    act(() => {
      result.current.addIngredient({ id: 'sucre', nom: 'Sucre', categorie: 'autre', quantite: 500, unite: 'g' })
    })

    // Vérifier que les ingrédients sont bien ajoutés
    expect(result.current.stock).toHaveLength(2)

    const recipe: Recette = {
      id: 'test-recipe',
      nom: 'Test Recipe',
      categorie: 'test',
      ingredients: [
        { ingredientId: 'farine', quantite: 200, unite: 'g' },
        { ingredientId: 'sucre', quantite: 100, unite: 'g' }
      ],
      etapes: ['Test step'],
      tags: ['test']
    }

    const canMake = result.current.canMakeRecipe(recipe)
    expect(canMake).toBe(true)

    // Test avec portions multiples
    const canMakeMultiple = result.current.canMakeRecipe(recipe, 3)
    expect(canMakeMultiple).toBe(true)

    // Test avec quantité insuffisante
    const bigRecipe: Recette = {
      ...recipe,
      ingredients: [
        { ingredientId: 'farine', quantite: 2000, unite: 'g' }
      ]
    }

    const canMakeBig = result.current.canMakeRecipe(bigRecipe)
    expect(canMakeBig).toBe(false)
  })

  test('should get missing ingredients for recipe', () => {
    const { result } = renderHook(() => useStock())
    
    // Ajouter seulement de la farine
    act(() => {
      result.current.addIngredient({ id: 'farine', nom: 'Farine', categorie: 'féculent', quantite: 100, unite: 'g' })
    })

    const recipe: Recette = {
      id: 'test-recipe',
      nom: 'Test Recipe',
      categorie: 'test',
      ingredients: [
        { ingredientId: 'farine', quantite: 200, unite: 'g' },
        { ingredientId: 'sucre', quantite: 100, unite: 'g' }
      ],
      etapes: ['Test step'],
      tags: ['test']
    }

    const missing = result.current.getMissingIngredients(recipe)
    
    expect(missing).toHaveLength(2)
    expect(missing.find(i => i.ingredientId === 'farine')?.quantiteManquante).toBe(100)
    expect(missing.find(i => i.ingredientId === 'sucre')?.quantiteManquante).toBe(100)
  })

  test('should consume recipe ingredients', () => {
    const { result } = renderHook(() => useStock())
    
    // Ajouter des ingrédients séparément
    act(() => {
      result.current.addIngredient({ id: 'farine', nom: 'Farine', categorie: 'féculent', quantite: 1000, unite: 'g' })
    })
    
    act(() => {
      result.current.addIngredient({ id: 'sucre', nom: 'Sucre', categorie: 'autre', quantite: 500, unite: 'g' })
    })

    const recipe: Recette = {
      id: 'test-recipe',
      nom: 'Test Recipe',
      categorie: 'test',
      ingredients: [
        { ingredientId: 'farine', quantite: 200, unite: 'g' },
        { ingredientId: 'sucre', quantite: 100, unite: 'g' }
      ],
      etapes: ['Test step'],
      tags: ['test']
    }

    let success: boolean = false
    act(() => {
      success = result.current.consumeRecipeIngredients(recipe)
    })

    expect(success).toBe(true)
    expect(result.current.stock.find(i => i.id === 'farine')?.quantite).toBe(800)
    expect(result.current.stock.find(i => i.id === 'sucre')?.quantite).toBe(400)
  })

  test('should not consume ingredients if insufficient stock', () => {
    const { result } = renderHook(() => useStock())
    
    // Ajouter seulement un peu de farine
    act(() => {
      result.current.addIngredient({ id: 'farine', nom: 'Farine', categorie: 'féculent', quantite: 100, unite: 'g' })
    })

    const recipe: Recette = {
      id: 'test-recipe',
      nom: 'Test Recipe',
      categorie: 'test',
      ingredients: [
        { ingredientId: 'farine', quantite: 200, unite: 'g' },
        { ingredientId: 'sucre', quantite: 100, unite: 'g' }
      ],
      etapes: ['Test step'],
      tags: ['test']
    }

    let success: boolean = false
    act(() => {
      success = result.current.consumeRecipeIngredients(recipe)
    })

    expect(success).toBe(false)
    // Le stock ne devrait pas avoir changé
    expect(result.current.stock.find(i => i.id === 'farine')?.quantite).toBe(100)
  })

  test('should generate stock alerts for low quantities', () => {
    const { result } = renderHook(() => useStock())
    
    // Ajouter un ingrédient avec quantité faible (séparément)
    act(() => {
      result.current.addIngredient({ id: 'farine', nom: 'Farine', categorie: 'féculent', quantite: 50, unite: 'g' })
    })
    
    act(() => {
      result.current.addIngredient({ id: 'sucre', nom: 'Sucre', categorie: 'autre', quantite: 1, unite: 'pièce' })
    })

    expect(result.current.alerts).toHaveLength(2)
    expect(result.current.alerts).toEqual(
      expect.arrayContaining([
        { ingredientId: 'farine', type: 'faible', seuil: 100 },
        { ingredientId: 'sucre', type: 'faible', seuil: 2 }
      ])
    )
  })

  test('should get available recipes', () => {
    const { result } = renderHook(() => useStock())
    
    // Ajouter des ingrédients séparément
    act(() => {
      result.current.addIngredient({ id: 'farine', nom: 'Farine', categorie: 'féculent', quantite: 1000, unite: 'g' })
    })
    
    act(() => {
      result.current.addIngredient({ id: 'sucre', nom: 'Sucre', categorie: 'autre', quantite: 500, unite: 'g' })
    })

    const recipes: Recette[] = [
      {
        id: 'recipe1',
        nom: 'Recipe 1',
        categorie: 'test',
        ingredients: [
          { ingredientId: 'farine', quantite: 200, unite: 'g' }
        ],
        etapes: ['Test'],
        tags: ['test']
      },
      {
        id: 'recipe2',
        nom: 'Recipe 2',
        categorie: 'test',
        ingredients: [
          { ingredientId: 'chocolat', quantite: 100, unite: 'g' }
        ],
        etapes: ['Test'],
        tags: ['test']
      }
    ]

    const available = result.current.getAvailableRecipes(recipes)
    
    expect(available).toHaveLength(1)
    expect(available[0].id).toBe('recipe1')
  })
})
