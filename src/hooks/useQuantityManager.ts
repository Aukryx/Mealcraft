import { useState, useCallback } from 'react';

export interface QuantityState {
  [key: string]: number;
}

export const useQuantityManager = (initialQuantities: QuantityState = {}) => {
  const [quantities, setQuantities] = useState<QuantityState>(initialQuantities);

  const updateQuantity = useCallback((id: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, newQuantity)
    }));
  }, []);

  const getQuantity = useCallback((id: string): number => {
    return quantities[id] || 0;
  }, [quantities]);

  const incrementQuantity = useCallback((id: string, step: number = 1) => {
    updateQuantity(id, getQuantity(id) + step);
  }, [updateQuantity, getQuantity]);

  const decrementQuantity = useCallback((id: string, step: number = 1) => {
    updateQuantity(id, Math.max(0, getQuantity(id) - step));
  }, [updateQuantity, getQuantity]);

  const setQuantity = useCallback((id: string, quantity: number) => {
    updateQuantity(id, quantity);
  }, [updateQuantity]);

  const resetQuantity = useCallback((id: string) => {
    updateQuantity(id, 0);
  }, [updateQuantity]);

  const resetAllQuantities = useCallback(() => {
    setQuantities({});
  }, []);

  const getAllQuantities = useCallback(() => {
    return { ...quantities };
  }, [quantities]);

  const getTotalItems = useCallback(() => {
    return Object.keys(quantities).length;
  }, [quantities]);

  const getTotalQuantity = useCallback(() => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  }, [quantities]);

  const hasItems = useCallback(() => {
    return Object.values(quantities).some(qty => qty > 0);
  }, [quantities]);

  return {
    quantities,
    updateQuantity,
    getQuantity,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
    resetQuantity,
    resetAllQuantities,
    getAllQuantities,
    getTotalItems,
    getTotalQuantity,
    hasItems,
    setQuantities
  };
};
