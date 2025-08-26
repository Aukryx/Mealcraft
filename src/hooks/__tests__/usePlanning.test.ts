import { renderHook, act } from '@testing-library/react'
import { usePlanning, PlanningEntry } from '../usePlanning'
import { useStock } from '../useStock'
import { useRecettes } from '../useRecettes'
import { Recette, Ingredient } from '../../data/recettesDeBase'

// Mock des hooks dépendants
jest.mock('../useStock')
jest.mock('../useRecettes')

const mockUseStock = useStock as jest.MockedFunction<typeof useStock>
const mockUseRecettes = useRecettes as jest.MockedFunction<typeof useRecettes>

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

// Mock console pour éviter les logs durant les tests
const originalConsole = console.log
const originalConsoleError = console.error
const mockConsoleLog = jest.fn()
const mockConsoleError = jest.fn()

describe('usePlanning', () => {
  // Données de test
  const mockStock: Ingredient[] = [
    { id: 'farine', nom: 'Farine', categorie: 'féculent', quantite: 1000, unite: 'g' },
    { id: 'sucre', nom: 'Sucre', categorie: 'autre', quantite: 500, unite: 'g' },
    { id: 'oeufs', nom: 'Oeufs', categorie: 'autre', quantite: 6, unite: 'pièce' }
  ]

  const mockRecettes: Recette[] = [
    {
      id: 'pancakes',
      nom: 'Pancakes',
      categorie: 'petit-déjeuner',
      ingredients: [
        { ingredientId: 'farine', quantite: 200, unite: 'g' },
        { ingredientId: 'sucre', quantite: 50, unite: 'g' },
        { ingredientId: 'oeufs', quantite: 2, unite: 'pièce' }
      ],
      etapes: ['Mélanger', 'Cuire'],
      tags: ['facile']
    },
    {
      id: 'gateau',
      nom: 'Gâteau',
      categorie: 'dessert',
      ingredients: [
        { ingredientId: 'farine', quantite: 300, unite: 'g' },
        { ingredientId: 'sucre', quantite: 200, unite: 'g' },
        { ingredientId: 'oeufs', quantite: 3, unite: 'pièce' }
      ],
      etapes: ['Mélanger', 'Cuire au four'],
      tags: ['dessert']
    },
    {
      id: 'salade',
      nom: 'Salade',
      categorie: 'entrée',
      ingredients: [
        { ingredientId: 'tomate', quantite: 2, unite: 'pièce' },
        { ingredientId: 'concombre', quantite: 1, unite: 'pièce' }
      ],
      etapes: ['Couper', 'Mélanger'],
      tags: ['léger']
    }
  ]

  beforeEach(() => {
    mockStorage.clear()
    mockStorage.getItem.mockClear()
    mockStorage.setItem.mockClear()
    
    // Configuration des mocks
    mockUseStock.mockReturnValue({
      stock: mockStock,
      alerts: [],
      addIngredient: jest.fn(),
      updateQuantity: jest.fn(),
      removeIngredient: jest.fn(),
      consumeRecipeIngredients: jest.fn(),
      canMakeRecipe: jest.fn(),
      getMissingIngredients: jest.fn(),
      getAvailableRecipes: jest.fn(),
      setStock: jest.fn()
    })

    mockUseRecettes.mockReturnValue({
      recettes: mockRecettes,
      addRecette: jest.fn(),
      editRecette: jest.fn(),
      deleteRecette: jest.fn(),
      resetRecettes: jest.fn(),
      isEmpty: false
    })

    // Silencer les console.log pour les tests
    console.log = mockConsoleLog
    console.error = mockConsoleError
    mockConsoleLog.mockClear()
    mockConsoleError.mockClear()
  })

  afterAll(() => {
    console.log = originalConsole
    console.error = originalConsoleError
  })

  test('should initialize with empty planning', () => {
    const { result } = renderHook(() => usePlanning())
    
    expect(result.current.planning).toEqual({})
  })

  test('should load existing planning from localStorage', () => {
    const existingPlanning = {
      '2025-08-26': {
        lunch: {
          id: '2025-08-26-lunch',
          date: '2025-08-26',
          meal: 'lunch',
          recetteId: 'pancakes',
          recetteName: 'Pancakes',
          generated: false,
          confirmed: true
        }
      }
    }

    mockStorage.getItem.mockReturnValue(JSON.stringify(existingPlanning))

    const { result } = renderHook(() => usePlanning())
    
    expect(result.current.planning).toEqual(existingPlanning)
  })

  test('should handle corrupted localStorage data', () => {
    mockStorage.getItem.mockReturnValue('{"invalid": json}')

    const { result } = renderHook(() => usePlanning())
    
    expect(result.current.planning).toEqual({})
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Erreur chargement planning:',
      expect.any(SyntaxError)
    )
  })

  test('should add single entry to planning', () => {
    const { result } = renderHook(() => usePlanning())
    
    const entry = {
      date: '2025-08-26',
      meal: 'lunch' as const,
      recetteId: 'pancakes',
      recetteName: 'Pancakes',
      generated: false,
      confirmed: true
    }

    act(() => {
      result.current.addToPlanning(entry)
    })

    expect(result.current.planning['2025-08-26'].lunch).toEqual({
      ...entry,
      id: '2025-08-26-lunch'
    })
    
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      'mealcraft_planning',
      expect.stringContaining('2025-08-26')
    )
  })

  test('should add multiple entries to planning', () => {
    const { result } = renderHook(() => usePlanning())
    
    const entries = [
      {
        date: '2025-08-26',
        meal: 'lunch' as const,
        recetteId: 'pancakes',
        recetteName: 'Pancakes'
      },
      {
        date: '2025-08-26',
        meal: 'dinner' as const,
        recetteId: 'gateau',
        recetteName: 'Gâteau'
      }
    ]

    act(() => {
      result.current.addMultipleToPlanning(entries)
    })

    expect(result.current.planning['2025-08-26'].lunch).toBeDefined()
    expect(result.current.planning['2025-08-26'].dinner).toBeDefined()
    expect(result.current.planning['2025-08-26'].lunch?.recetteName).toBe('Pancakes')
    expect(result.current.planning['2025-08-26'].dinner?.recetteName).toBe('Gâteau')
  })

  test('should remove entry from planning', () => {
    const { result } = renderHook(() => usePlanning())
    
    // Ajouter d'abord une entrée
    act(() => {
      result.current.addToPlanning({
        date: '2025-08-26',
        meal: 'lunch',
        recetteId: 'pancakes',
        recetteName: 'Pancakes'
      })
    })

    // Puis la supprimer
    act(() => {
      result.current.removeFromPlanning('2025-08-26', 'lunch')
    })

    expect(result.current.planning['2025-08-26']).toBeUndefined()
  })

  test('should confirm suggestion', () => {
    const { result } = renderHook(() => usePlanning())
    
    // Ajouter une suggestion générée
    act(() => {
      result.current.addToPlanning({
        date: '2025-08-26',
        meal: 'lunch',
        recetteId: 'pancakes',
        recetteName: 'Pancakes',
        generated: true,
        confirmed: false
      })
    })

    // Confirmer la suggestion
    act(() => {
      result.current.confirmSuggestion('2025-08-26', 'lunch')
    })

    expect(result.current.planning['2025-08-26'].lunch?.confirmed).toBe(true)
  })

  test('should calculate recipe score based on stock', () => {
    const { result } = renderHook(() => usePlanning())
    
    // Recette avec tous les ingrédients en stock suffisant
    const pancakesScore = result.current.calculateRecipeScore(mockRecettes[0]) // pancakes
    expect(pancakesScore).toBe(100) // 3 ingrédients * 2 points / (3 * 2) * 100 = 100%

    // Recette avec certains ingrédients manquants
    const saladeScore = result.current.calculateRecipeScore(mockRecettes[2]) // salade
    expect(saladeScore).toBe(0) // Aucun ingrédient disponible
  })

  test('should generate week suggestions', () => {
    const { result } = renderHook(() => usePlanning())
    
    const startDate = new Date('2025-08-26')
    
    act(() => {
      const suggestions = result.current.generateWeekSuggestions(startDate)
      expect(suggestions).toHaveLength(14) // 7 jours * 2 repas
      
      suggestions.forEach(suggestion => {
        expect(suggestion.generated).toBe(true)
        expect(suggestion.confirmed).toBe(false)
        expect(['lunch', 'dinner']).toContain(suggestion.meal)
        expect(mockRecettes.some(r => r.id === suggestion.recetteId)).toBe(true)
      })
    })
  })

  test('should get weekly ingredients', () => {
    const { result } = renderHook(() => usePlanning())
    
    // Ajouter quelques entrées au planning
    act(() => {
      result.current.addMultipleToPlanning([
        {
          date: '2025-08-26',
          meal: 'lunch',
          recetteId: 'pancakes',
          recetteName: 'Pancakes'
        },
        {
          date: '2025-08-27',
          meal: 'dinner',
          recetteId: 'gateau',
          recetteName: 'Gâteau'
        }
      ])
    })

    const startDate = new Date('2025-08-26')
    const weeklyIngredients = result.current.getWeeklyIngredients(startDate)
    
    // Vérifier qu'on a les ingrédients des deux recettes
    expect(weeklyIngredients.some(i => i.ingredientId === 'farine')).toBe(true)
    expect(weeklyIngredients.some(i => i.ingredientId === 'sucre')).toBe(true)
    expect(weeklyIngredients.some(i => i.ingredientId === 'oeufs')).toBe(true)

    // Vérifier l'addition des quantités (pancakes + gateau)
    const farine = weeklyIngredients.find(i => i.ingredientId === 'farine')
    expect(farine?.quantite).toBe(500) // 200 + 300

    const sucre = weeklyIngredients.find(i => i.ingredientId === 'sucre')
    expect(sucre?.quantite).toBe(250) // 50 + 200

    const oeufs = weeklyIngredients.find(i => i.ingredientId === 'oeufs')
    expect(oeufs?.quantite).toBe(5) // 2 + 3
  })

  test('should generate shopping list based on stock shortage', () => {
    const { result } = renderHook(() => usePlanning())
    
    // Modifier le stock pour avoir moins de farine
    mockUseStock.mockReturnValue({
      stock: [
        { id: 'farine', nom: 'Farine', categorie: 'féculent', quantite: 100, unite: 'g' }, // Insuffisant
        { id: 'sucre', nom: 'Sucre', categorie: 'autre', quantite: 500, unite: 'g' },
        { id: 'oeufs', nom: 'Oeufs', categorie: 'autre', quantite: 6, unite: 'pièce' }
      ],
      alerts: [],
      addIngredient: jest.fn(),
      updateQuantity: jest.fn(),
      removeIngredient: jest.fn(),
      consumeRecipeIngredients: jest.fn(),
      canMakeRecipe: jest.fn(),
      getMissingIngredients: jest.fn(),
      getAvailableRecipes: jest.fn(),
      setStock: jest.fn()
    })

    // Re-render avec le nouveau stock
    const { result: newResult } = renderHook(() => usePlanning())
    
    // Ajouter une recette qui nécessite plus de farine
    act(() => {
      newResult.current.addToPlanning({
        date: '2025-08-26',
        meal: 'lunch',
        recetteId: 'gateau', // Nécessite 300g de farine
        recetteName: 'Gâteau'
      })
    })

    const startDate = new Date('2025-08-26')
    const shoppingList = newResult.current.generateShoppingList(startDate)
    
    // Devrait y avoir de la farine manquante
    const farineMissing = shoppingList.find(i => i.ingredientId === 'farine')
    expect(farineMissing).toBeDefined()
    expect(farineMissing?.quantite).toBe(200) // 300 nécessaire - 100 en stock = 200 manquant
  })

  test('should not generate shopping list for available ingredients', () => {
    const { result } = renderHook(() => usePlanning())
    
    // Ajouter une recette simple avec ingrédients disponibles
    act(() => {
      result.current.addToPlanning({
        date: '2025-08-26',
        meal: 'lunch',
        recetteId: 'pancakes', // Tous ingrédients disponibles
        recetteName: 'Pancakes'
      })
    })

    const startDate = new Date('2025-08-26')
    const shoppingList = result.current.generateShoppingList(startDate)
    
    // Aucun ingrédient manquant
    expect(shoppingList).toHaveLength(0)
  })
})
