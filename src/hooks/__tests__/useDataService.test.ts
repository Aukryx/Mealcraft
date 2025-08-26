import { renderHook, act, waitFor } from '@testing-library/react'
import { useDataService } from '../useDataService'

// Mock global fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock btoa/atob
global.btoa = jest.fn((str) => Buffer.from(str).toString('base64'))
global.atob = jest.fn((str) => Buffer.from(str, 'base64').toString())

// Mock navigator.onLine
const mockNavigator = {
  onLine: true
}
Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true
})

describe('useDataService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
    mockNavigator.onLine = true
  })

  test('should initialize with local service by default', () => {
    const { result } = renderHook(() => useDataService())
    
    expect(result.current.isCloudMode).toBe(false)
    expect(result.current.service).toBeDefined()
  })

  test('should switch to cloud mode if user ID exists and online', async () => {
    mockLocalStorage.getItem.mockReturnValue('user123')
    
    const { result } = renderHook(() => useDataService())
    
    await waitFor(() => {
      expect(result.current.isCloudMode).toBe(true)
    })
  })

  test('should stay in local mode if offline', async () => {
    mockLocalStorage.getItem.mockReturnValue('user123')
    mockNavigator.onLine = false
    
    const { result } = renderHook(() => useDataService())
    
    await waitFor(() => {
      expect(result.current.isCloudMode).toBe(false)
    })
  })

  test('LocalDataService should save data to localStorage', async () => {
    const { result } = renderHook(() => useDataService())
    
    await act(async () => {
      await result.current.service.save('test', { value: 'data' })
    })
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'mealcraft_test',
      expect.stringContaining('"data":{"value":"data"}')
    )
  })

  test('LocalDataService should load data from localStorage', async () => {
    const storedData = JSON.stringify({
      data: { value: 'test' },
      timestamp: Date.now(),
      version: '1.0',
      source: 'local'
    })
    mockLocalStorage.getItem.mockReturnValue(storedData)
    // S'assurer qu'on reste en mode local
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'mealcraft_cloud_user_id') return null
      if (key === 'mealcraft_test') return storedData
      return null
    })
    
    const { result } = renderHook(() => useDataService())
    
    let loadedData
    await act(async () => {
      loadedData = await result.current.service.load('test')
    })
    
    expect(loadedData).toEqual({ value: 'test' })
  })

  test('LocalDataService should return null for missing data', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useDataService())
    
    let loadedData
    await act(async () => {
      loadedData = await result.current.service.load('missing')
    })
    
    expect(loadedData).toBeNull()
  })

  test('CloudDataService should save data via API', async () => {
    mockLocalStorage.getItem.mockReturnValue('user123')
    mockFetch.mockResolvedValue({ ok: true })
    
    const { result } = renderHook(() => useDataService())
    
    await waitFor(() => {
      expect(result.current.isCloudMode).toBe(true)
    })
    
    await act(async () => {
      await result.current.service.save('test', { value: 'data' })
    })
    
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/users/user123/data/test',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"data":{"value":"data"}')
      })
    )
  })

  test('CloudDataService should load data via API', async () => {
    mockLocalStorage.getItem.mockReturnValue('user123')
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { value: 'cloud-data' } })
    })
    
    const { result } = renderHook(() => useDataService())
    
    await waitFor(() => {
      expect(result.current.isCloudMode).toBe(true)
    })
    
    let loadedData
    await act(async () => {
      loadedData = await result.current.service.load('test')
    })
    
    expect(loadedData).toEqual({ value: 'cloud-data' })
    expect(mockFetch).toHaveBeenCalledWith('/api/users/user123/data/test')
  })

  test('should export local data as encoded string', async () => {
    // Mock des données pour les clés standard
    const mockData = {
      recettes: [{ id: '1', nom: 'Test Recipe' }],
      stock: [{ id: '1', ingredient: 'Test Item' }],
      settings: { theme: 'light' },
      planning: [{ date: '2024-01-01', recettes: [] }]
    }
    
    // Mock localStorage.getItem pour retourner les données mockées
    mockLocalStorage.getItem.mockImplementation((key) => {
      const dataKey = key.replace('mealcraft_', '')
      if (mockData[dataKey as keyof typeof mockData]) {
        return JSON.stringify({
          data: mockData[dataKey as keyof typeof mockData],
          timestamp: Date.now(),
          version: '1.0',
          source: 'local'
        })
      }
      return null
    })
    
    const { result } = renderHook(() => useDataService())
    
    let exportedData
    await act(async () => {
      exportedData = await result.current.exportLocalData()
    })
    
    expect(exportedData).toBeDefined()
    expect(typeof exportedData).toBe('string')
    
    // Vérifier que btoa a été appelé
    expect(global.btoa).toHaveBeenCalled()
  })

  test('should import cloud data from encoded string', async () => {
    const importData = {
      recettes: [{ id: '1', nom: 'Imported Recipe' }],
      stock: [{ id: '1', ingredient: 'Imported Item' }],
      exportDate: '2024-01-01T00:00:00.000Z',
      version: '1.0'
    }
    
    const encodedData = Buffer.from(JSON.stringify(importData)).toString('base64')
    
    const { result } = renderHook(() => useDataService())
    
    await act(async () => {
      await result.current.importCloudData(encodedData)
    })
    
    // Vérifier que atob a été appelé
    expect(global.atob).toHaveBeenCalledWith(encodedData)
    
    // Vérifier que localStorage.setItem a été appelé pour chaque clé de données
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'mealcraft_recettes',
      expect.stringContaining('"data":[{"id":"1","nom":"Imported Recipe"}]')
    )
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'mealcraft_stock',
      expect.stringContaining('"data":[{"id":"1","ingredient":"Imported Item"}]')
    )
    // exportDate et version ne doivent pas être sauvegardées
    expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
      'mealcraft_exportDate',
      expect.anything()
    )
  })

  test('should switch to cloud mode manually', async () => {
    const { result } = renderHook(() => useDataService())
    
    expect(result.current.isCloudMode).toBe(false)
    
    await act(async () => {
      await result.current.switchToCloud('newuser123')
    })
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mealcraft_cloud_user_id', 'newuser123')
    expect(result.current.isCloudMode).toBe(true)
  })

  test('should handle fetch errors gracefully in cloud mode', async () => {
    mockLocalStorage.getItem.mockReturnValue('user123')
    mockFetch.mockRejectedValue(new Error('Network error'))
    
    const { result } = renderHook(() => useDataService())
    
    await waitFor(() => {
      expect(result.current.isCloudMode).toBe(true)
    })
    
    // Test que l'erreur ne fait pas planter l'application
    await expect(async () => {
      await act(async () => {
        await result.current.service.save('test', { value: 'data' })
      })
    }).rejects.toThrow('Network error')
  })

  test('should handle malformed data in localStorage', async () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json')
    
    const { result } = renderHook(() => useDataService())
    
    await expect(async () => {
      await act(async () => {
        await result.current.service.load('test')
      })
    }).rejects.toThrow()
  })

  test('should handle malformed import data', async () => {
    const { result } = renderHook(() => useDataService())
    
    await expect(async () => {
      await act(async () => {
        await result.current.importCloudData('invalid-base64-!@#')
      })
    }).rejects.toThrow()
  })

  test('CloudDataService sync method should be defined', async () => {
    mockLocalStorage.getItem.mockReturnValue('user123')
    
    const { result } = renderHook(() => useDataService())
    
    await waitFor(() => {
      expect(result.current.isCloudMode).toBe(true)
    })
    
    // Vérifier que la méthode sync existe (même si elle est vide pour l'instant)
    expect(result.current.service.sync).toBeDefined()
    expect(typeof result.current.service.sync).toBe('function')
  })
})
