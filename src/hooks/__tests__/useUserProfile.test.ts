import { renderHook, act, waitFor } from '@testing-library/react'
import { UserSettings } from '../../types'

// Utiliser le mock automatique de Jest  
jest.mock('../../data/database')

// Import après le mock
import { useUserProfile } from '../useUserProfile'
import { db, UserProfile } from '../../data/database'

// Mock console pour éviter les logs d'erreur durant les tests
const originalConsoleError = console.error
const mockConsoleError = jest.fn()

// Cast du db pour avoir accès aux méthodes mockées
const mockDB = db as any

describe('useUserProfile', () => {
  const mockProfile: UserProfile = {
    id: 'user_123',
    nom: 'Test User',
    dateCreation: new Date('2025-01-01'),
    derniereConnexion: new Date('2025-08-25'),
    tutorialComplete: false,
    preferences: {
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
  }

  beforeEach(() => {
    jest.clearAllMocks()
    console.error = mockConsoleError
    mockConsoleError.mockClear()
  })

  afterAll(() => {
    console.error = originalConsoleError
  })

  test('should initialize with loading state', () => {
    mockDB.userProfile.toArray.mockResolvedValue([])
    
    const { result } = renderHook(() => useUserProfile())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.profile).toBe(null)
    expect(result.current.isFirstTime).toBe(false)
  })

  test('should detect first time user when no profiles exist', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([])
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.isFirstTime).toBe(true)
    expect(result.current.profile).toBe(null)
  })

  test('should load existing user profile', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([mockProfile])
    mockDB.userProfile.update.mockResolvedValue(1)
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.isFirstTime).toBe(false)
    expect(result.current.profile).toEqual(mockProfile)
    
    // Should update last connection
    expect(mockDB.userProfile.update).toHaveBeenCalledWith(
      mockProfile.id,
      { derniereConnexion: expect.any(Date) }
    )
  })

  test('should handle database error during profile loading', async () => {
    const error = new Error('Database error')
    mockDB.userProfile.toArray.mockRejectedValue(error)
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Erreur lors du chargement du profil:',
      error
    )
  })

  test('should create new profile', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([])
    mockDB.userProfile.add.mockResolvedValue('user_123')
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    let createdProfile: UserProfile | undefined
    await act(async () => {
      createdProfile = await result.current.createProfile('John Doe')
    })
    
    expect(createdProfile?.nom).toBe('John Doe')
    expect(createdProfile?.tutorialComplete).toBe(false)
    expect(createdProfile?.id).toMatch(/^user_\d+$/)
    expect(createdProfile?.dateCreation).toBeInstanceOf(Date)
    expect(createdProfile?.derniereConnexion).toBeInstanceOf(Date)
    
    expect(mockDB.userProfile.add).toHaveBeenCalledWith(createdProfile)
    expect(result.current.profile).toEqual(createdProfile)
    expect(result.current.isFirstTime).toBe(false)
  })

  test('should trim whitespace when creating profile', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([])
    mockDB.userProfile.add.mockResolvedValue('user_123')
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    let createdProfile: UserProfile | undefined
    await act(async () => {
      createdProfile = await result.current.createProfile('  John Doe  ')
    })
    
    expect(createdProfile?.nom).toBe('John Doe')
  })

  test('should handle error during profile creation', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([])
    const error = new Error('Creation failed')
    mockDB.userProfile.add.mockRejectedValue(error)
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    await act(async () => {
      await expect(result.current.createProfile('John Doe')).rejects.toThrow('Creation failed')
    })
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Erreur lors de la création du profil:',
      error
    )
  })

  test('should update profile', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([mockProfile])
    mockDB.userProfile.update.mockResolvedValue(1)
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile)
    })
    
    const updates = { nom: 'Updated Name' }
    
    await act(async () => {
      await result.current.updateProfile(updates)
    })
    
    expect(mockDB.userProfile.update).toHaveBeenCalledWith(mockProfile.id, updates)
    expect(result.current.profile?.nom).toBe('Updated Name')
  })

  test('should not update profile if none exists', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([])
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.profile).toBe(null)
    })
    
    await act(async () => {
      await result.current.updateProfile({ nom: 'Test' })
    })
    
    expect(mockDB.userProfile.update).not.toHaveBeenCalled()
  })

  test('should handle error during profile update', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([mockProfile])
    mockDB.userProfile.update.mockResolvedValue(1)
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile)
    })
    
    const error = new Error('Update failed')
    mockDB.userProfile.update.mockRejectedValueOnce(error)
    
    await act(async () => {
      await expect(result.current.updateProfile({ nom: 'Test' })).rejects.toThrow('Update failed')
    })
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Erreur lors de la mise à jour du profil:',
      error
    )
  })

  test('should complete tutorial', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([mockProfile])
    mockDB.userProfile.update.mockResolvedValue(1)
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile)
    })
    
    await act(async () => {
      await result.current.completeTutorial()
    })
    
    expect(mockDB.userProfile.update).toHaveBeenCalledWith(
      mockProfile.id, 
      { tutorialComplete: true }
    )
    expect(result.current.profile?.tutorialComplete).toBe(true)
  })

  test('should update preferences', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([mockProfile])
    mockDB.userProfile.update.mockResolvedValue(1)
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile)
    })
    
    const newPreferences: Partial<UserSettings> = {
      modeNuit: true,
      portionsParDefaut: 4,
      regimesAlimentaires: ['végétarien']
    }
    
    await act(async () => {
      await result.current.updatePreferences(newPreferences)
    })
    
    expect(mockDB.userProfile.update).toHaveBeenCalledWith(
      mockProfile.id,
      {
        preferences: {
          ...mockProfile.preferences,
          ...newPreferences
        }
      }
    )
    
    expect(result.current.profile?.preferences.modeNuit).toBe(true)
    expect(result.current.profile?.preferences.portionsParDefaut).toBe(4)
    expect(result.current.profile?.preferences.regimesAlimentaires).toEqual(['végétarien'])
  })

  test('should not update preferences if no profile exists', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([])
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.profile).toBe(null)
    })
    
    await act(async () => {
      await result.current.updatePreferences({ modeNuit: true })
    })
    
    // Should not make any database calls beyond the initial load
    expect(mockDB.userProfile.update).toHaveBeenCalledTimes(0)
  })

  test('should reset profile and database', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([mockProfile])
    mockDB.userProfile.update.mockResolvedValue(1)
    mockDB.delete.mockResolvedValue(undefined)
    mockDB.open.mockResolvedValue(undefined)
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile)
    })
    
    await act(async () => {
      await result.current.resetProfile()
    })
    
    expect(mockDB.delete).toHaveBeenCalled()
    expect(mockDB.open).toHaveBeenCalled()
    expect(result.current.profile).toBe(null)
    expect(result.current.isFirstTime).toBe(true)
  })

  test('should handle error during profile reset', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([mockProfile])
    mockDB.userProfile.update.mockResolvedValue(1)
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile)
    })
    
    const error = new Error('Reset failed')
    mockDB.delete.mockRejectedValue(error)
    
    await act(async () => {
      await result.current.resetProfile()
    })
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Erreur lors de la réinitialisation:',
      error
    )
  })

  test('should preserve default preferences when creating profile', async () => {
    mockDB.userProfile.toArray.mockResolvedValue([])
    mockDB.userProfile.add.mockResolvedValue('user_123')
    
    const { result } = renderHook(() => useUserProfile())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    let createdProfile: UserProfile | undefined
    await act(async () => {
      createdProfile = await result.current.createProfile('John Doe')
    })
    
    expect(createdProfile?.preferences).toEqual({
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
    })
  })
})
