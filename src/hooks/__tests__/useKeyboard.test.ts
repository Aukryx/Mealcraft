import { renderHook, act } from '@testing-library/react'
import { useKeyboardShortcuts, useGlobalShortcuts } from '../useKeyboard'

// Mock window.alert
const mockAlert = jest.fn()
window.alert = mockAlert

// Mock addEventListener/removeEventListener
const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

describe('useKeyboard', () => {
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

    test('should handle ctrl+key shortcuts', () => {
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

      // Simuler Ctrl+S
      const keyEvent = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        altKey: false,
        shiftKey: false
      })

      act(() => {
        window.dispatchEvent(keyEvent)
      })

      expect(mockAction).toHaveBeenCalledTimes(1)
    })

    test('should handle alt+key shortcuts', () => {
      const mockAction = jest.fn()
      const shortcuts = [
        {
          key: '1',
          alt: true,
          action: mockAction,
          description: 'Alt+1'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      // Simuler Alt+1
      const keyEvent = new KeyboardEvent('keydown', {
        key: '1',
        ctrlKey: false,
        altKey: true,
        shiftKey: false
      })

      act(() => {
        window.dispatchEvent(keyEvent)
      })

      expect(mockAction).toHaveBeenCalledTimes(1)
    })

    test('should handle shift+key shortcuts', () => {
      const mockAction = jest.fn()
      const shortcuts = [
        {
          key: 'A',
          shift: true,
          action: mockAction,
          description: 'Shift+A'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      // Simuler Shift+A
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'A',
        ctrlKey: false,
        altKey: false,
        shiftKey: true
      })

      act(() => {
        window.dispatchEvent(keyEvent)
      })

      expect(mockAction).toHaveBeenCalledTimes(1)
    })

    test('should handle complex shortcuts (ctrl+alt+key)', () => {
      const mockAction = jest.fn()
      const shortcuts = [
        {
          key: 'd',
          ctrl: true,
          alt: true,
          action: mockAction,
          description: 'Ctrl+Alt+D'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      // Simuler Ctrl+Alt+D
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'd',
        ctrlKey: true,
        altKey: true,
        shiftKey: false
      })

      act(() => {
        window.dispatchEvent(keyEvent)
      })

      expect(mockAction).toHaveBeenCalledTimes(1)
    })

    test('should not trigger action for partial match', () => {
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

      // Simuler seulement 's' sans Ctrl
      const keyEvent = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: false,
        altKey: false,
        shiftKey: false
      })

      act(() => {
        window.dispatchEvent(keyEvent)
      })

      expect(mockAction).not.toHaveBeenCalled()
    })

    test('should be case insensitive for key matching', () => {
      const mockAction = jest.fn()
      const shortcuts = [
        {
          key: 'A',
          action: mockAction,
          description: 'Test'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      // Simuler 'a' minuscule
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

    test('should handle multiple shortcuts in one hook call', () => {
      const mockAction1 = jest.fn()
      const mockAction2 = jest.fn()
      const shortcuts = [
        {
          key: 'a',
          action: mockAction1,
          description: 'Action 1'
        },
        {
          key: 'b',
          action: mockAction2,
          description: 'Action 2'
        }
      ]

      renderHook(() => useKeyboardShortcuts(shortcuts))

      // Simuler 'a'
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
      })

      // Simuler 'b'
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
      })

      expect(mockAction1).toHaveBeenCalledTimes(1)
      expect(mockAction2).toHaveBeenCalledTimes(1)
    })

    test('should prevent default for matching shortcuts', () => {
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
    })
  })

  describe('useGlobalShortcuts', () => {
    test('should create global shortcuts with correct structure', () => {
      const mockSetActiveObject = jest.fn()
      
      const { result } = renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      expect(result.current.shortcuts).toHaveLength(6)
      expect(result.current.shortcuts[0]).toMatchObject({
        key: '1',
        alt: true,
        description: 'Alt+1: Ouvrir le livre de recettes'
      })
    })

    test('should trigger cookbook shortcut (Alt+1)', () => {
      const mockSetActiveObject = jest.fn()
      
      renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: '1',
          altKey: true
        }))
      })
      
      expect(mockSetActiveObject).toHaveBeenCalledWith('cookbook')
    })

    test('should trigger fridge shortcut (Alt+2)', () => {
      const mockSetActiveObject = jest.fn()
      
      renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: '2',
          altKey: true
        }))
      })
      
      expect(mockSetActiveObject).toHaveBeenCalledWith('fridge')
    })

    test('should trigger pantry shortcut (Alt+3)', () => {
      const mockSetActiveObject = jest.fn()
      
      renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: '3',
          altKey: true
        }))
      })
      
      expect(mockSetActiveObject).toHaveBeenCalledWith('pantry')
    })

    test('should trigger calendar shortcut (Alt+4)', () => {
      const mockSetActiveObject = jest.fn()
      
      renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: '4',
          altKey: true
        }))
      })
      
      expect(mockSetActiveObject).toHaveBeenCalledWith('calendar')
    })

    test('should trigger close shortcut (Escape)', () => {
      const mockSetActiveObject = jest.fn()
      
      renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Escape'
        }))
      })
      
      expect(mockSetActiveObject).toHaveBeenCalledWith(null)
    })

    test('should trigger help shortcut (Ctrl+H)', () => {
      const mockSetActiveObject = jest.fn()
      
      renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'h',
          ctrlKey: true
        }))
      })
      
      // Vérifier que l'alerte d'aide est affichée
      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining('Raccourcis clavier disponibles')
      )
      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining('Alt+1: Ouvrir le livre de recettes')
      )
    })

    test('should include all shortcut descriptions in help', () => {
      const mockSetActiveObject = jest.fn()
      
      renderHook(() => useGlobalShortcuts(mockSetActiveObject))
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'h',
          ctrlKey: true
        }))
      })
      
      const alertMessage = mockAlert.mock.calls[0][0]
      expect(alertMessage).toContain('Alt+1: Ouvrir le livre de recettes')
      expect(alertMessage).toContain('Alt+2: Ouvrir le frigo')
      expect(alertMessage).toContain('Alt+3: Ouvrir le placard')
      expect(alertMessage).toContain('Alt+4: Ouvrir le planning')
      expect(alertMessage).toContain('Échap: Fermer les modales')
      expect(alertMessage).toContain('Ctrl+H: Afficher l\'aide')
    })

    test('should update shortcuts when dependencies change', () => {
      const mockSetActiveObject1 = jest.fn()
      const mockSetActiveObject2 = jest.fn()
      
      const { rerender } = renderHook(
        ({ setActiveObject }) => useGlobalShortcuts(setActiveObject),
        { initialProps: { setActiveObject: mockSetActiveObject1 } }
      )
      
      // Test avec la première fonction
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: '1',
          altKey: true
        }))
      })
      
      expect(mockSetActiveObject1).toHaveBeenCalledWith('cookbook')
      
      // Rerendre avec une nouvelle fonction
      rerender({ setActiveObject: mockSetActiveObject2 })
      
      // Test avec la nouvelle fonction
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', {
          key: '1',
          altKey: true
        }))
      })
      
      expect(mockSetActiveObject2).toHaveBeenCalledWith('cookbook')
    })
  })
})
