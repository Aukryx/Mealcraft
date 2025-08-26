import { renderHook, act } from '@testing-library/react'
import { useQuantityManager, QuantityState } from '../useQuantityManager'

describe('useQuantityManager', () => {
  test('should initialize with empty quantities by default', () => {
    const { result } = renderHook(() => useQuantityManager())
    
    expect(result.current.quantities).toEqual({})
    expect(result.current.getTotalItems()).toBe(0)
    expect(result.current.getTotalQuantity()).toBe(0)
    expect(result.current.hasItems()).toBe(false)
  })

  test('should initialize with provided initial quantities', () => {
    const initialQuantities: QuantityState = {
      'item1': 5,
      'item2': 3,
      'item3': 0
    }

    const { result } = renderHook(() => useQuantityManager(initialQuantities))
    
    expect(result.current.quantities).toEqual(initialQuantities)
    expect(result.current.getTotalItems()).toBe(3)
    expect(result.current.getTotalQuantity()).toBe(8) // 5 + 3 + 0
    expect(result.current.hasItems()).toBe(true)
  })

  test('should get quantity for existing and non-existing items', () => {
    const initialQuantities = { 'item1': 10 }
    const { result } = renderHook(() => useQuantityManager(initialQuantities))
    
    expect(result.current.getQuantity('item1')).toBe(10)
    expect(result.current.getQuantity('non-existing')).toBe(0)
  })

  test('should update quantity for existing item', () => {
    const { result } = renderHook(() => useQuantityManager({ 'item1': 5 }))
    
    act(() => {
      result.current.updateQuantity('item1', 15)
    })

    expect(result.current.getQuantity('item1')).toBe(15)
    expect(result.current.quantities['item1']).toBe(15)
  })

  test('should add new item when updating non-existing item', () => {
    const { result } = renderHook(() => useQuantityManager())
    
    act(() => {
      result.current.updateQuantity('new-item', 7)
    })

    expect(result.current.getQuantity('new-item')).toBe(7)
    expect(result.current.getTotalItems()).toBe(1)
  })

  test('should not allow negative quantities', () => {
    const { result } = renderHook(() => useQuantityManager({ 'item1': 5 }))
    
    act(() => {
      result.current.updateQuantity('item1', -3)
    })

    expect(result.current.getQuantity('item1')).toBe(0)
  })

  test('should set quantity directly', () => {
    const { result } = renderHook(() => useQuantityManager())
    
    act(() => {
      result.current.setQuantity('item1', 25)
    })

    expect(result.current.getQuantity('item1')).toBe(25)
  })

  test('should increment quantity with default step of 1', () => {
    const { result } = renderHook(() => useQuantityManager({ 'item1': 10 }))
    
    act(() => {
      result.current.incrementQuantity('item1')
    })

    expect(result.current.getQuantity('item1')).toBe(11)
  })

  test('should increment quantity with custom step', () => {
    const { result } = renderHook(() => useQuantityManager({ 'item1': 10 }))
    
    act(() => {
      result.current.incrementQuantity('item1', 5)
    })

    expect(result.current.getQuantity('item1')).toBe(15)
  })

  test('should increment non-existing item from 0', () => {
    const { result } = renderHook(() => useQuantityManager())
    
    act(() => {
      result.current.incrementQuantity('new-item', 3)
    })

    expect(result.current.getQuantity('new-item')).toBe(3)
  })

  test('should decrement quantity with default step of 1', () => {
    const { result } = renderHook(() => useQuantityManager({ 'item1': 10 }))
    
    act(() => {
      result.current.decrementQuantity('item1')
    })

    expect(result.current.getQuantity('item1')).toBe(9)
  })

  test('should decrement quantity with custom step', () => {
    const { result } = renderHook(() => useQuantityManager({ 'item1': 10 }))
    
    act(() => {
      result.current.decrementQuantity('item1', 3)
    })

    expect(result.current.getQuantity('item1')).toBe(7)
  })

  test('should not allow decrement below 0', () => {
    const { result } = renderHook(() => useQuantityManager({ 'item1': 5 }))
    
    act(() => {
      result.current.decrementQuantity('item1', 10)
    })

    expect(result.current.getQuantity('item1')).toBe(0)
  })

  test('should reset single item quantity to 0', () => {
    const { result } = renderHook(() => useQuantityManager({ 'item1': 15, 'item2': 10 }))
    
    act(() => {
      result.current.resetQuantity('item1')
    })

    expect(result.current.getQuantity('item1')).toBe(0)
    expect(result.current.getQuantity('item2')).toBe(10) // Should remain unchanged
  })

  test('should reset all quantities', () => {
    const { result } = renderHook(() => useQuantityManager({ 
      'item1': 15, 
      'item2': 10, 
      'item3': 5 
    }))
    
    act(() => {
      result.current.resetAllQuantities()
    })

    expect(result.current.quantities).toEqual({})
    expect(result.current.getTotalItems()).toBe(0)
    expect(result.current.getTotalQuantity()).toBe(0)
    expect(result.current.hasItems()).toBe(false)
  })

  test('should get all quantities as a copy', () => {
    const initialQuantities = { 'item1': 5, 'item2': 10 }
    const { result } = renderHook(() => useQuantityManager(initialQuantities))
    
    const allQuantities = result.current.getAllQuantities()
    
    expect(allQuantities).toEqual(initialQuantities)
    expect(allQuantities).not.toBe(result.current.quantities) // Should be a copy
    
    // Modifying the returned object should not affect the hook's state
    allQuantities['item1'] = 999
    expect(result.current.getQuantity('item1')).toBe(5)
  })

  test('should calculate total items correctly', () => {
    const { result } = renderHook(() => useQuantityManager())
    
    expect(result.current.getTotalItems()).toBe(0)
    
    act(() => {
      result.current.setQuantity('item1', 5)
    })
    expect(result.current.getTotalItems()).toBe(1)
    
    act(() => {
      result.current.setQuantity('item2', 0)
    })
    expect(result.current.getTotalItems()).toBe(2) // Even items with quantity 0 are counted
    
    act(() => {
      result.current.setQuantity('item3', 10)
    })
    expect(result.current.getTotalItems()).toBe(3)
  })

  test('should calculate total quantity correctly', () => {
    const { result } = renderHook(() => useQuantityManager())
    
    expect(result.current.getTotalQuantity()).toBe(0)
    
    act(() => {
      result.current.setQuantity('item1', 5)
      result.current.setQuantity('item2', 10)
      result.current.setQuantity('item3', 0)
    })
    
    expect(result.current.getTotalQuantity()).toBe(15) // 5 + 10 + 0
  })

  test('should detect if has items correctly', () => {
    const { result } = renderHook(() => useQuantityManager())
    
    expect(result.current.hasItems()).toBe(false)
    
    act(() => {
      result.current.setQuantity('item1', 0)
    })
    expect(result.current.hasItems()).toBe(false) // 0 quantity doesn't count
    
    act(() => {
      result.current.setQuantity('item2', 5)
    })
    expect(result.current.hasItems()).toBe(true)
    
    act(() => {
      result.current.resetQuantity('item2')
    })
    expect(result.current.hasItems()).toBe(false) // Back to all 0 quantities
  })

  test('should set all quantities at once', () => {
    const { result } = renderHook(() => useQuantityManager({ 'old1': 5 }))
    
    const newQuantities = {
      'item1': 10,
      'item2': 20,
      'item3': 5
    }
    
    act(() => {
      result.current.setQuantities(newQuantities)
    })

    expect(result.current.quantities).toEqual(newQuantities)
    expect(result.current.getQuantity('old1')).toBe(0) // Old items should be gone
    expect(result.current.getTotalQuantity()).toBe(35) // 10 + 20 + 5
  })

  test('should handle multiple rapid updates correctly', () => {
    const { result } = renderHook(() => useQuantityManager())
    
    act(() => {
      result.current.setQuantity('item1', 10)
    })
    
    act(() => {
      result.current.incrementQuantity('item1', 5)
    })
    
    act(() => {
      result.current.decrementQuantity('item1', 3)
    })
    
    act(() => {
      const currentValue = result.current.getQuantity('item1')
      result.current.updateQuantity('item1', currentValue + 2)
    })

    expect(result.current.getQuantity('item1')).toBe(14) // 10 + 5 - 3 + 2
  })

  test('should maintain immutability of quantities object', () => {
    const { result } = renderHook(() => useQuantityManager({ 'item1': 5 }))
    
    const initialQuantities = result.current.quantities
    
    act(() => {
      result.current.setQuantity('item2', 10)
    })

    const newQuantities = result.current.quantities
    
    expect(newQuantities).not.toBe(initialQuantities) // Should be a new object
    expect(newQuantities).toEqual({ 'item1': 5, 'item2': 10 })
  })

  test('should handle edge case of 0 step increment/decrement', () => {
    const { result } = renderHook(() => useQuantityManager({ 'item1': 10 }))
    
    act(() => {
      result.current.incrementQuantity('item1', 0)
    })
    expect(result.current.getQuantity('item1')).toBe(10) // Should remain unchanged
    
    act(() => {
      result.current.decrementQuantity('item1', 0)
    })
    expect(result.current.getQuantity('item1')).toBe(10) // Should remain unchanged
  })
})
