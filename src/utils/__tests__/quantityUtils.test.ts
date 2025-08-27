import { 
  getQuantityConfig, 
  formatQuantity, 
  calculateNextQuantity, 
  QUANTITY_INCREMENTS 
} from '../quantityUtils'

describe('quantityUtils', () => {
  describe('QUANTITY_INCREMENTS', () => {
    test('should have all required units defined', () => {
      const requiredUnits = ['g', 'kg', 'ml', 'L', 'pièce', 'tranche', 'gousse', 'pincée', 'càs', 'pot', 'rouleau', 'sachet']
      
      requiredUnits.forEach(unit => {
        expect(QUANTITY_INCREMENTS[unit]).toBeDefined()
        expect(QUANTITY_INCREMENTS[unit].unit).toBe(unit)
      })
    })

    test('should have proper structure for all units', () => {
      Object.values(QUANTITY_INCREMENTS).forEach(config => {
        expect(config).toHaveProperty('unit')
        expect(config).toHaveProperty('smallStep')
        expect(config).toHaveProperty('mediumStep') 
        expect(config).toHaveProperty('largeStep')
        expect(config).toHaveProperty('inputEnabled')
        expect(config).toHaveProperty('placeholder')
        
        expect(typeof config.unit).toBe('string')
        expect(typeof config.smallStep).toBe('number')
        expect(typeof config.mediumStep).toBe('number')
        expect(typeof config.largeStep).toBe('number')
        expect(typeof config.inputEnabled).toBe('boolean')
        expect(typeof config.placeholder).toBe('string')
        
        expect(config.smallStep).toBeGreaterThan(0)
        expect(config.mediumStep).toBeGreaterThanOrEqual(config.smallStep)
        expect(config.largeStep).toBeGreaterThanOrEqual(config.mediumStep)
      })
    })

    test('should have logical step progression for weight units', () => {
      const gConfig = QUANTITY_INCREMENTS['g']
      expect(gConfig.smallStep).toBe(10)
      expect(gConfig.mediumStep).toBe(50)
      expect(gConfig.largeStep).toBe(100)
      expect(gConfig.inputEnabled).toBe(true)

      const kgConfig = QUANTITY_INCREMENTS['kg']
      expect(kgConfig.smallStep).toBe(0.1)
      expect(kgConfig.mediumStep).toBe(0.5)
      expect(kgConfig.largeStep).toBe(1)
      expect(kgConfig.inputEnabled).toBe(true)
    })

    test('should have logical step progression for volume units', () => {
      const mlConfig = QUANTITY_INCREMENTS['ml']
      expect(mlConfig.smallStep).toBe(10)
      expect(mlConfig.mediumStep).toBe(50)
      expect(mlConfig.largeStep).toBe(100)
      expect(mlConfig.inputEnabled).toBe(true)

      const lConfig = QUANTITY_INCREMENTS['L']
      expect(lConfig.smallStep).toBe(0.1)
      expect(lConfig.mediumStep).toBe(0.5)
      expect(lConfig.largeStep).toBe(1)
      expect(lConfig.inputEnabled).toBe(true)
    })

    test('should have reasonable constraints for special units', () => {
      const pinceeConfig = QUANTITY_INCREMENTS['pincée']
      expect(pinceeConfig.inputEnabled).toBe(false)
      expect(pinceeConfig.largeStep).toBeLessThanOrEqual(3)

      const rouleauConfig = QUANTITY_INCREMENTS['rouleau']
      expect(rouleauConfig.inputEnabled).toBe(false)
      expect(rouleauConfig.mediumStep).toBe(1)
      expect(rouleauConfig.largeStep).toBe(2)
    })
  })

  describe('getQuantityConfig', () => {
    test('should return correct config for existing units', () => {
      const gConfig = getQuantityConfig('g')
      expect(gConfig.unit).toBe('g')
      expect(gConfig.smallStep).toBe(10)
      expect(gConfig.mediumStep).toBe(50)
      expect(gConfig.largeStep).toBe(100)

      const kgConfig = getQuantityConfig('kg')
      expect(kgConfig.unit).toBe('kg')
      expect(kgConfig.smallStep).toBe(0.1)

      const pinceeConfig = getQuantityConfig('pincée')
      expect(pinceeConfig.unit).toBe('pincée')
      expect(pinceeConfig.inputEnabled).toBe(false)
    })

    test('should return default config for unknown units', () => {
      const unknownConfig = getQuantityConfig('unknown_unit')
      expect(unknownConfig.unit).toBe('pièce')
      expect(unknownConfig).toEqual(QUANTITY_INCREMENTS['pièce'])

      const emptyConfig = getQuantityConfig('')
      expect(emptyConfig.unit).toBe('pièce')

      const nullConfig = getQuantityConfig(null as any)
      expect(nullConfig.unit).toBe('pièce')
    })

    test('should handle case sensitivity correctly', () => {
      const upperCaseConfig = getQuantityConfig('G')
      expect(upperCaseConfig.unit).toBe('pièce') // Should fallback to default

      const mixedCaseConfig = getQuantityConfig('Kg')
      expect(mixedCaseConfig.unit).toBe('pièce') // Should fallback to default
    })

    test('should return same reference for multiple calls', () => {
      const config1 = getQuantityConfig('g')
      const config2 = getQuantityConfig('g')
      expect(config1).toBe(config2) // Same reference
    })
  })

  describe('formatQuantity', () => {
    test('should format integer quantities correctly', () => {
      expect(formatQuantity(100, 'g')).toBe('100 g')
      expect(formatQuantity(5, 'pièce')).toBe('5 pièce')
      expect(formatQuantity(2, 'tranche')).toBe('2 tranche')
      expect(formatQuantity(1, 'gousse')).toBe('1 gousse')
    })

    test('should format decimal quantities for weight units', () => {
      expect(formatQuantity(1.5, 'kg')).toBe('1.5 kg')
      expect(formatQuantity(0.8, 'kg')).toBe('0.8 kg')
      expect(formatQuantity(2.0, 'kg')).toBe('2 kg') // Should remove .0
      expect(formatQuantity(3, 'kg')).toBe('3 kg') // Integer should stay integer
    })

    test('should format decimal quantities for volume units', () => {
      expect(formatQuantity(1.5, 'L')).toBe('1.5 L')
      expect(formatQuantity(0.3, 'L')).toBe('0.3 L')
      expect(formatQuantity(2.0, 'L')).toBe('2 L') // Should remove .0
      expect(formatQuantity(1, 'L')).toBe('1 L') // Integer should stay integer
    })

    test('should not show decimals for non-decimal units', () => {
      expect(formatQuantity(100.7, 'g')).toBe('100.7 g') // g can have decimals but not special formatting
      expect(formatQuantity(250.5, 'ml')).toBe('250.5 ml') // ml can have decimals but not special formatting
      expect(formatQuantity(5.0, 'pièce')).toBe('5 pièce')
      expect(formatQuantity(2.3, 'tranche')).toBe('2.3 tranche')
    })

    test('should handle edge cases', () => {
      expect(formatQuantity(0, 'g')).toBe('0 g')
      expect(formatQuantity(0, 'kg')).toBe('0 kg')
      expect(formatQuantity(0.0, 'L')).toBe('0 L')
      
      // Very small decimals
      expect(formatQuantity(0.01, 'kg')).toBe('0.0 kg') // toFixed(1) rounds
      expect(formatQuantity(0.06, 'kg')).toBe('0.1 kg') // toFixed(1) rounds
      
      // Large numbers
      expect(formatQuantity(1000, 'g')).toBe('1000 g')
      expect(formatQuantity(100.5, 'kg')).toBe('100.5 kg')
    })

    test('should handle unknown units using default config', () => {
      expect(formatQuantity(5, 'unknown_unit')).toBe('5 unknown_unit')
      expect(formatQuantity(2.5, 'custom_unit')).toBe('2.5 custom_unit')
    })

    test('should handle negative numbers (edge case)', () => {
      expect(formatQuantity(-5, 'g')).toBe('-5 g')
      expect(formatQuantity(-1.5, 'kg')).toBe('-1.5 kg')
    })
  })

  describe('calculateNextQuantity', () => {
    test('should increment quantity correctly', () => {
      expect(calculateNextQuantity(10, 5, 'up')).toBe(15)
      expect(calculateNextQuantity(0, 1, 'up')).toBe(1)
      expect(calculateNextQuantity(100, 50, 'up')).toBe(150)
      expect(calculateNextQuantity(1.5, 0.5, 'up')).toBe(2)
    })

    test('should decrement quantity correctly', () => {
      expect(calculateNextQuantity(15, 5, 'down')).toBe(10)
      expect(calculateNextQuantity(1, 1, 'down')).toBe(0)
      expect(calculateNextQuantity(100, 25, 'down')).toBe(75)
      expect(calculateNextQuantity(2.5, 0.5, 'down')).toBe(2)
    })

    test('should not go below zero when decrementing', () => {
      expect(calculateNextQuantity(5, 10, 'down')).toBe(0)
      expect(calculateNextQuantity(1, 5, 'down')).toBe(0)
      expect(calculateNextQuantity(0, 1, 'down')).toBe(0)
      expect(calculateNextQuantity(0.1, 1, 'down')).toBe(0)
    })

    test('should handle zero steps', () => {
      expect(calculateNextQuantity(10, 0, 'up')).toBe(10)
      expect(calculateNextQuantity(10, 0, 'down')).toBe(10)
    })

    test('should handle negative steps (edge case)', () => {
      // Comportement avec step négatif
      expect(calculateNextQuantity(10, -5, 'up')).toBe(5) // 10 + (-5) = 5
      expect(calculateNextQuantity(10, -5, 'down')).toBe(15) // 10 - (-5) = 15
    })

    test('should handle decimal steps correctly', () => {
      expect(calculateNextQuantity(1, 0.1, 'up')).toBeCloseTo(1.1)
      expect(calculateNextQuantity(1, 0.1, 'down')).toBeCloseTo(0.9)
      expect(calculateNextQuantity(0.5, 0.3, 'up')).toBeCloseTo(0.8)
      expect(calculateNextQuantity(0.5, 0.3, 'down')).toBeCloseTo(0.2)
    })

    test('should handle large numbers', () => {
      expect(calculateNextQuantity(1000, 100, 'up')).toBe(1100)
      expect(calculateNextQuantity(1000, 1500, 'down')).toBe(0) // Clamped to 0
      expect(calculateNextQuantity(999999, 1, 'up')).toBe(1000000)
    })

    test('should preserve precision for floating point operations', () => {
      // Test pour éviter les problèmes de précision floating point
      const result1 = calculateNextQuantity(0.1, 0.2, 'up')
      expect(result1).toBeCloseTo(0.3, 10)
      
      const result2 = calculateNextQuantity(1.1, 0.2, 'down')
      expect(result2).toBeCloseTo(0.9, 10)
    })
  })

  describe('Integration tests', () => {
    test('should work together for realistic cooking scenarios', () => {
      // Scénario: Incrémenter du sel
      const saltConfig = getQuantityConfig('pincée')
      const currentSalt = 1
      const newSaltAmount = calculateNextQuantity(currentSalt, saltConfig.smallStep, 'up')
      const formattedSalt = formatQuantity(newSaltAmount, 'pincée')
      
      expect(newSaltAmount).toBe(2)
      expect(formattedSalt).toBe('2 pincée')
    })

    test('should work together for weight measurements', () => {
      // Scénario: Ajuster farine en kg
      const flourConfig = getQuantityConfig('kg')
      let currentFlour = 0.5
      currentFlour = calculateNextQuantity(currentFlour, flourConfig.mediumStep, 'up')
      const formattedFlour = formatQuantity(currentFlour, 'kg')
      
      expect(currentFlour).toBe(1)
      expect(formattedFlour).toBe('1 kg')
    })

    test('should work together for volume measurements', () => {
      // Scénario: Ajuster lait en L avec décimales
      const milkConfig = getQuantityConfig('L')
      let currentMilk = 0.8
      currentMilk = calculateNextQuantity(currentMilk, milkConfig.smallStep, 'up')
      const formattedMilk = formatQuantity(currentMilk, 'L')
      
      expect(currentMilk).toBeCloseTo(0.9)
      expect(formattedMilk).toBe('0.9 L')
    })

    test('should handle workflow from unknown unit to default', () => {
      // Scénario: Unité inconnue utilise le fallback
      const unknownConfig = getQuantityConfig('cups')
      let amount = 2
      amount = calculateNextQuantity(amount, unknownConfig.largeStep, 'up')
      const formatted = formatQuantity(amount, 'cups')
      
      expect(unknownConfig.unit).toBe('pièce') // Fallback
      expect(amount).toBe(12) // 2 + 10 (largeStep de pièce)
      expect(formatted).toBe('12 cups')
    })
  })
})
