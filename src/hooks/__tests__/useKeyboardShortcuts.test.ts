import { renderHook, act } from '@testing-library/react'
import { useKeyboardShortcuts, useGlobalShortcuts } from '../useKeyboardShortcuts'

// Mock window.alert
const mockAlert = jest.fn()
window.alert = mockAlert

// Mock addEventListener/removeEventListener
const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useKeyboardShortcuts', () => {
    test('should register keyboard event listener on mount', () => {
      const mockAction = jest.fn()
      const shortcuts = [
        {
          key: 'a',
          action: mockAction,
          description: 'Test shortcut'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    test('should remove keyboard event listener on unmount', () => {
      const mockAction = jest.fn()
      const shortcuts = [
        {
          key: 'a',
          action: mockAction,
          description: 'Test shortcut'
        }
      ]

      const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts))
      
      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    test('should trigger action for matching shortcut', () => {
      const mockAction = jest.fn()
      const shortcuts = [
        {
          key: 'a',
          action: mockAction,
          description: 'Test shortcut'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      // Simuler l'appui sur la touche 'a'
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: false,
        altKey: false,
        shiftKey: false
      })

      act(() => {
        window.dispatchEvent(keyEvent)
      })

      expect(mockAction).toHaveBeenCalledTimes(1)
    })

    test('should handle special keys like Escape', () => {
      const mockAction = jest.fn()
      const shortcuts = [
        {
          key: 'Escape',
          action: mockAction,
          description: 'Close modal'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Escape'
      })

      act(() => {
        window.dispatchEvent(keyEvent)
      })

      expect(mockAction).toHaveBeenCalledTimes(1)
    })

    test('should handle modifiers correctly', () => {
      const mockCtrlAction = jest.fn()
      const mockAltAction = jest.fn()
      const mockShiftAction = jest.fn()
      
      const shortcuts = [
        {
          key: 's',
          ctrl: true,
          action: mockCtrlAction,
          description: 'Ctrl+S'
        },
        {
          key: 'a',
          alt: true,
          action: mockAltAction,
          description: 'Alt+A'
        },
        {
          key: 't',
          shift: true,
          action: mockShiftAction,
          description: 'Shift+T'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      // Test Ctrl+S
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 's',
          ctrlKey: true
        }))
      })

      // Test Alt+A
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'a',
          altKey: true
        }))
      })

      // Test Shift+T
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 't',
          shiftKey: true
        }))
      })

      expect(mockCtrlAction).toHaveBeenCalledTimes(1)
      expect(mockAltAction).toHaveBeenCalledTimes(1)
      expect(mockShiftAction).toHaveBeenCalledTimes(1)
    })

    test('should not trigger when wrong modifiers are pressed', () => {
      const mockAction = jest.fn()
      const shortcuts = [
        {
          key: 's',
          ctrl: true,
          action: mockAction,
          description: 'Ctrl+S'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      // Tester avec Alt+S au lieu de Ctrl+S
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 's',
          altKey: true
        }))
      })

      expect(mockAction).not.toHaveBeenCalled()
    })

    test('should prevent default when shortcut matches', () => {
      const mockAction = jest.fn()
      const shortcuts = [
        {
          key: 's',
          ctrl: true,
          action: mockAction,
          description: 'Save'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      const keyEvent = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true
      })
      const preventDefaultSpy = jest.spyOn(keyEvent, 'preventDefault')

      act(() => {
        window.dispatchEvent(keyEvent)
      })

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(mockAction).toHaveBeenCalled()
    })

    test('should handle empty shortcuts array', () => {
      const { result } = renderHook(() => useKeyboardShortcuts([]))

      // Ne devrait pas générer d'erreur
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
      })

      // Pas d'assertion spécifique, juste vérifier qu'il n'y a pas d'erreur
      expect(result.current).toBeUndefined()
    })
  })

  describe('useGlobalShortcuts', () => {
    test('should create global shortcuts with setActiveObject function', () => {
      const mockSetActiveObject = jest.fn()
      
      const { result } = renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      expect(result.current.shortcuts).toBeDefined()
      expect(Array.isArray(result.current.shortcuts)).toBe(true)
      expect(result.current.shortcuts.length).toBeGreaterThan(0)
    })

    test('should handle all global shortcuts correctly', () => {
      const mockSetActiveObject = jest.fn()
      
      renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      // Test tous les raccourcis
      const shortcuts = [
        { key: '1', altKey: true, expectedCall: 'cookbook' },
        { key: '2', altKey: true, expectedCall: 'fridge' },
        { key: '3', altKey: true, expectedCall: 'pantry' },
        { key: '4', altKey: true, expectedCall: 'calendar' },
        { key: 'Escape', expectedCall: null }
      ]

      shortcuts.forEach(({ key, altKey, expectedCall }) => {
        mockSetActiveObject.mockClear()
        
        act(() => {
          window.dispatchEvent(new KeyboardEvent('keydown', {
            key,
            altKey: altKey || false
          }))
        })
        
        expect(mockSetActiveObject).toHaveBeenCalledWith(expectedCall)
      })
    })

    test('should show help dialog on Ctrl+H', () => {
      const mockSetActiveObject = jest.fn()
      
      renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'h',
          ctrlKey: true
        }))
      })
      
      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining('Raccourcis clavier disponibles')
      )
    })

    test('should recreate shortcuts when setActiveObject changes', () => {
      const mockSetActiveObject1 = jest.fn()
      const mockSetActiveObject2 = jest.fn()
      
      const { rerender } = renderHook(
        ({ fn }) => useGlobalShortcuts(fn),
        { initialProps: { fn: mockSetActiveObject1 } }
      )
      
      // Test avec la première fonction
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: '1',
          altKey: true
        }))
      })
      
      expect(mockSetActiveObject1).toHaveBeenCalledWith('cookbook')
      
      // Changer la fonction
      rerender({ fn: mockSetActiveObject2 })
      
      // Test avec la nouvelle fonction
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: '1',
          altKey: true
        }))
      })
      
      expect(mockSetActiveObject2).toHaveBeenCalledWith('cookbook')
    })

    test('should maintain shortcut descriptions correctly', () => {
      const mockSetActiveObject = jest.fn()
      
      const { result } = renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      const shortcuts = result.current.shortcuts
      const descriptions = shortcuts.map(s => s.description)
      
      expect(descriptions).toContain('Alt+1: Ouvrir le livre de recettes')
      expect(descriptions).toContain('Alt+2: Ouvrir le frigo')
      expect(descriptions).toContain('Alt+3: Ouvrir le placard')
      expect(descriptions).toContain('Alt+4: Ouvrir le planning')
      expect(descriptions).toContain('Échap: Fermer les modales')
      expect(descriptions).toContain('Ctrl+H: Afficher l\'aide')
    })

    test('should handle help shortcut with all descriptions', () => {
      const mockSetActiveObject = jest.fn()
      
      renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'h',
          ctrlKey: true
        }))
      })
      
      const helpMessage = mockAlert.mock.calls[0][0]
      
      // Vérifier que toutes les descriptions sont incluses
      expect(helpMessage).toContain('Alt+1')
      expect(helpMessage).toContain('Alt+2')
      expect(helpMessage).toContain('Alt+3')
      expect(helpMessage).toContain('Alt+4')
      expect(helpMessage).toContain('Échap')
      expect(helpMessage).toContain('Ctrl+H')
    })
  })
})
