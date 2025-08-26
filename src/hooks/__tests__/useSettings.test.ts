import { renderHook, act } from '@testing-library/react'
import { useSettings } from '../useSettings'
import { UserSettings } from '../../types'

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

describe('useSettings', () => {
  const DEFAULT_SETTINGS: UserSettings = {
    consommationMode: 'simulation',
    portionsParDefaut: 2,
    alertesStock: true,
    planificationAutomatique: false,
    modeNuit: false,
    difficultePreferee: null,
    regimesAlimentaires: [],
    allergies: [],
    tempsCuissonMax: null,
    budgetMoyen: null,
  }

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

  test('should initialize with default settings', () => {
    const { result } = renderHook(() => useSettings())
    
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
  })

  test('should load existing settings from localStorage', () => {
    const savedSettings = {
      consommationMode: 'reel' as const,
      portionsParDefaut: 4,
      modeNuit: true,
      difficultePreferee: 'facile' as const,
      regimesAlimentaires: ['végétarien'],
      allergies: ['gluten'],
      tempsCuissonMax: 30,
      budgetMoyen: 50
    }

    mockStorage.getItem.mockReturnValue(JSON.stringify(savedSettings))

    const { result } = renderHook(() => useSettings())
    
    // Should merge with default settings
    expect(result.current.settings).toEqual({
      ...DEFAULT_SETTINGS,
      ...savedSettings
    })
  })

  test('should handle corrupted localStorage data', () => {
    mockStorage.getItem.mockReturnValue('{"invalid": json}')

    const { result } = renderHook(() => useSettings())
    
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Erreur lors du chargement des paramètres:',
      expect.any(SyntaxError)
    )
  })

  test('should save partial settings update', () => {
    const { result } = renderHook(() => useSettings())
    
    const partialUpdate = {
      portionsParDefaut: 6,
      modeNuit: true
    }

    act(() => {
      result.current.saveSettings(partialUpdate)
    })

    expect(result.current.settings).toEqual({
      ...DEFAULT_SETTINGS,
      ...partialUpdate
    })

    expect(mockStorage.setItem).toHaveBeenCalledWith(
      'mealcraft_settings',
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        ...partialUpdate
      })
    )
  })

  test('should save single setting update', () => {
    const { result } = renderHook(() => useSettings())
    
    act(() => {
      result.current.saveSettings({ consommationMode: 'planification' })
    })

    expect(result.current.settings.consommationMode).toBe('planification')
    expect(result.current.settings.portionsParDefaut).toBe(2) // Other settings unchanged
  })

  test('should save array settings', () => {
    const { result } = renderHook(() => useSettings())
    
    act(() => {
      result.current.saveSettings({ 
        regimesAlimentaires: ['végétarien', 'sans gluten'] 
      })
    })

    expect(result.current.settings.regimesAlimentaires).toEqual(['végétarien', 'sans gluten'])
  })

  test('should save allergies', () => {
    const { result } = renderHook(() => useSettings())
    
    act(() => {
      result.current.saveSettings({ 
        allergies: ['arachides', 'fruits de mer'] 
      })
    })

    expect(result.current.settings.allergies).toEqual(['arachides', 'fruits de mer'])
  })

  test('should save numerical settings', () => {
    const { result } = renderHook(() => useSettings())
    
    act(() => {
      result.current.saveSettings({ 
        tempsCuissonMax: 45,
        budgetMoyen: 75.5
      })
    })

    expect(result.current.settings.tempsCuissonMax).toBe(45)
    expect(result.current.settings.budgetMoyen).toBe(75.5)
  })

  test('should save boolean settings', () => {
    const { result } = renderHook(() => useSettings())
    
    act(() => {
      result.current.saveSettings({ 
        alertesStock: false,
        planificationAutomatique: true
      })
    })

    expect(result.current.settings.alertesStock).toBe(false)
    expect(result.current.settings.planificationAutomatique).toBe(true)
  })

  test('should save difficulty preference', () => {
    const { result } = renderHook(() => useSettings())
    
    act(() => {
      result.current.saveSettings({ difficultePreferee: 'difficile' })
    })

    expect(result.current.settings.difficultePreferee).toBe('difficile')
    
    act(() => {
      result.current.saveSettings({ difficultePreferee: null })
    })

    expect(result.current.settings.difficultePreferee).toBe(null)
  })

  test('should reset settings to default', () => {
    const { result } = renderHook(() => useSettings())
    
    // First modify some settings
    act(() => {
      result.current.saveSettings({
        consommationMode: 'reel',
        portionsParDefaut: 8,
        modeNuit: true,
        regimesAlimentaires: ['végétarien'],
        allergies: ['gluten']
      })
    })

    // Verify settings were changed
    expect(result.current.settings.consommationMode).toBe('reel')
    expect(result.current.settings.portionsParDefaut).toBe(8)
    expect(result.current.settings.modeNuit).toBe(true)

    // Reset to defaults
    act(() => {
      result.current.resetSettings()
    })

    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
    
    expect(mockStorage.setItem).toHaveBeenLastCalledWith(
      'mealcraft_settings',
      JSON.stringify(DEFAULT_SETTINGS)
    )
  })

  test('should handle multiple consecutive updates', () => {
    const { result } = renderHook(() => useSettings())
    
    act(() => {
      result.current.saveSettings({ portionsParDefaut: 3 })
    })
    
    act(() => {
      result.current.saveSettings({ modeNuit: true })
    })
    
    act(() => {
      result.current.saveSettings({ consommationMode: 'reel' })
    })

    expect(result.current.settings).toEqual({
      ...DEFAULT_SETTINGS,
      portionsParDefaut: 3,
      modeNuit: true,
      consommationMode: 'reel'
    })
  })

  test('should preserve existing settings when loading partial saved settings', () => {
    // Save partial settings to localStorage
    const partialSettings = {
      portionsParDefaut: 6,
      modeNuit: true
    }
    mockStorage.getItem.mockReturnValue(JSON.stringify(partialSettings))

    const { result } = renderHook(() => useSettings())
    
    // Should have merged with defaults
    expect(result.current.settings).toEqual({
      ...DEFAULT_SETTINGS,
      ...partialSettings
    })
    
    // All default values should still be present
    expect(result.current.settings.alertesStock).toBe(true) // From defaults
    expect(result.current.settings.consommationMode).toBe('simulation') // From defaults
    expect(result.current.settings.portionsParDefaut).toBe(6) // From saved
    expect(result.current.settings.modeNuit).toBe(true) // From saved
  })

  test('should handle null and undefined values correctly', () => {
    const { result } = renderHook(() => useSettings())
    
    act(() => {
      result.current.saveSettings({
        difficultePreferee: null,
        tempsCuissonMax: null,
        budgetMoyen: null
      })
    })

    expect(result.current.settings.difficultePreferee).toBe(null)
    expect(result.current.settings.tempsCuissonMax).toBe(null)
    expect(result.current.settings.budgetMoyen).toBe(null)
  })

  test('should handle empty arrays correctly', () => {
    const { result } = renderHook(() => useSettings())
    
    // Set some values first
    act(() => {
      result.current.saveSettings({
        regimesAlimentaires: ['végétarien', 'bio'],
        allergies: ['gluten']
      })
    })

    // Then clear them
    act(() => {
      result.current.saveSettings({
        regimesAlimentaires: [],
        allergies: []
      })
    })

    expect(result.current.settings.regimesAlimentaires).toEqual([])
    expect(result.current.settings.allergies).toEqual([])
  })
})
