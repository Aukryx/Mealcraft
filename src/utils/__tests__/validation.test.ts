import { 
  Validator, 
  ValidationResult,
  isValidQuantity,
  isValidName, 
  isValidUnit,
  isValidBarcode,
  sanitizeQuantity,
  sanitizeName 
} from '../validation'

// Mock logger pour éviter les logs pendant les tests
jest.mock('../logger', () => ({
  logger: {
    warn: jest.fn(),
    units: { warn: jest.fn() },
    barcode: { error: jest.fn() }
  },
  LogCategory: {
    GENERAL: 'GENERAL',
    USER: 'USER'
  }
}))

describe('validation', () => {
  describe('Validator.validateQuantity', () => {
    test('should accept valid positive numbers', () => {
      const result = Validator.validateQuantity(100)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)

      const result2 = Validator.validateQuantity(0.5)
      expect(result2.isValid).toBe(true)
      expect(result2.errors).toHaveLength(0)
    })

    test('should accept valid string numbers', () => {
      const result = Validator.validateQuantity('100')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)

      const result2 = Validator.validateQuantity('2.5')
      expect(result2.isValid).toBe(true)
      expect(result2.errors).toHaveLength(0)
    })

    test('should reject negative numbers', () => {
      const result = Validator.validateQuantity(-5)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La quantité ne peut pas être négative')

      const result2 = Validator.validateQuantity('-10')
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toContain('La quantité ne peut pas être négative')
    })

    test('should reject non-numeric strings', () => {
      const result = Validator.validateQuantity('abc')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Quantité invalide: "abc" n\'est pas un nombre')

      // Note: "10kg" sera parsé comme 10 par parseFloat, donc c'est valide
      const result2 = Validator.validateQuantity('text123')
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toContain('Quantité invalide: "text123" n\'est pas un nombre')
    })

    test('should warn about zero quantities', () => {
      const result = Validator.validateQuantity(0)
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('Quantité de 0 détectée')

      const result2 = Validator.validateQuantity('0')
      expect(result2.isValid).toBe(true)
      expect(result2.warnings).toContain('Quantité de 0 détectée')
    })

    test('should warn about very high quantities', () => {
      const result = Validator.validateQuantity(15000)
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('Quantité très élevée détectée (>10000)')

      const result2 = Validator.validateQuantity('20000')
      expect(result2.isValid).toBe(true)
      expect(result2.warnings).toContain('Quantité très élevée détectée (>10000)')
    })

    test('should warn about excessive precision', () => {
      const result = Validator.validateQuantity(1.12345)
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('Précision excessive détectée (>3 décimales)')

      const result2 = Validator.validateQuantity('2.123456')
      expect(result2.isValid).toBe(true)
      expect(result2.warnings).toContain('Précision excessive détectée (>3 décimales)')
    })

    test('should accept normal precision', () => {
      const result1 = Validator.validateQuantity(1.123)
      expect(result1.isValid).toBe(true)
      expect(result1.warnings).toBeUndefined()

      const result2 = Validator.validateQuantity(2.5)
      expect(result2.isValid).toBe(true)
      expect(result2.warnings).toBeUndefined()
    })

    test('should handle edge cases', () => {
      // Exactly at the threshold
      const result1 = Validator.validateQuantity(10000)
      expect(result1.isValid).toBe(true)
      expect(result1.warnings).toBeUndefined()

      const result2 = Validator.validateQuantity(10001)
      expect(result2.isValid).toBe(true)
      expect(result2.warnings).toContain('Quantité très élevée détectée (>10000)')
    })

    test('should include context in validation', () => {
      const result = Validator.validateQuantity(-1, 'test context')
      expect(result.isValid).toBe(false)
      // Le contexte est utilisé pour le logging, pas dans les messages d'erreur
    })
  })

  describe('Validator.validateName', () => {
    test('should accept valid names', () => {
      const result1 = Validator.validateName('Tomate')
      expect(result1.isValid).toBe(true)
      expect(result1.errors).toHaveLength(0)

      const result2 = Validator.validateName('Pomme de terre')
      expect(result2.isValid).toBe(true)
      expect(result2.errors).toHaveLength(0)

      // Note: l'apostrophe simple est un caractère interdit selon la validation
      const result3 = Validator.validateName('Huile olive')
      expect(result3.isValid).toBe(true)
      expect(result3.errors).toHaveLength(0)
    })

    test('should reject empty or whitespace-only names', () => {
      const result1 = Validator.validateName('')
      expect(result1.isValid).toBe(false)
      expect(result1.errors).toContain('Le nom ne peut pas être vide')

      const result2 = Validator.validateName('   ')
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toContain('Le nom ne peut pas être vide')

      const result3 = Validator.validateName(null as any)
      expect(result3.isValid).toBe(false)
      expect(result3.errors).toContain('Le nom ne peut pas être vide')
    })

    test('should reject names that are too short', () => {
      const result = Validator.validateName('A')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le nom doit contenir au moins 2 caractères')
    })

    test('should reject names that are too long', () => {
      const longName = 'A'.repeat(101)
      const result = Validator.validateName(longName)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le nom est trop long (maximum 100 caractères)')
    })

    test('should reject names with forbidden characters', () => {
      const forbiddenChars = ['<', '>', '"', "'", '&', '{', '}']
      
      forbiddenChars.forEach(char => {
        const result = Validator.validateName(`Test${char}Name`)
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain('Le nom contient des caractères interdits')
      })
    })

    test('should warn about purely numeric names', () => {
      const result = Validator.validateName('12345')
      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('Le nom ne devrait pas être uniquement numérique')
    })

    test('should handle names with numbers and letters', () => {
      const result = Validator.validateName('Coca Cola')
      expect(result.isValid).toBe(true)
      expect(result.warnings).toBeUndefined()

      const result2 = Validator.validateName('H2O')
      expect(result2.isValid).toBe(true)
      expect(result2.warnings).toBeUndefined()
    })

    test('should trim whitespace in validation', () => {
      const result = Validator.validateName('  Tomate  ')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Validator.validateUnit', () => {
    test('should accept valid units', () => {
      const validUnits = ['g', 'kg', 'ml', 'cl', 'L', 'càs', 'càc', 'pièce', 'tranche', 'pot', 'gousse', 'pincée']
      
      validUnits.forEach(unit => {
        const result = Validator.validateUnit(unit)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    test('should reject empty units', () => {
      const result1 = Validator.validateUnit('')
      expect(result1.isValid).toBe(false)
      expect(result1.errors).toContain('L\'unité ne peut pas être vide')

      const result2 = Validator.validateUnit('   ')
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toContain('L\'unité ne peut pas être vide')

      const result3 = Validator.validateUnit(null as any)
      expect(result3.isValid).toBe(false)
      expect(result3.errors).toContain('L\'unité ne peut pas être vide')
    })

    test('should reject invalid units', () => {
      const invalidUnits = ['cups', 'oz', 'lb', 'invalid', 'liters', 'grammes']
      
      invalidUnits.forEach(unit => {
        const result = Validator.validateUnit(unit)
        expect(result.isValid).toBe(false)
        expect(result.errors[0]).toContain('Unité non reconnue')
        expect(result.errors[0]).toContain(unit)
      })
    })

    test('should trim whitespace', () => {
      const result = Validator.validateUnit('  g  ')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('should be case sensitive', () => {
      const result1 = Validator.validateUnit('G')
      expect(result1.isValid).toBe(false)

      const result2 = Validator.validateUnit('ML')
      expect(result2.isValid).toBe(false)

      const result3 = Validator.validateUnit('l') // lowercase L
      expect(result3.isValid).toBe(false)
    })
  })

  describe('Validator.validateBarcode', () => {
    test('should accept valid barcodes', () => {
      const validBarcodes = [
        '1234567890123', // 13 digits
        '12345678', // 8 digits  
        '123456789012', // 12 digits
        '12345678901234' // 14 digits
      ]
      
      validBarcodes.forEach(barcode => {
        const result = Validator.validateBarcode(barcode)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    test('should reject empty barcodes', () => {
      const result1 = Validator.validateBarcode('')
      expect(result1.isValid).toBe(false)
      expect(result1.errors).toContain('Le code-barres ne peut pas être vide')

      const result2 = Validator.validateBarcode('   ')
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toContain('Le code-barres ne peut pas être vide')
    })

    test('should reject non-numeric barcodes', () => {
      const result1 = Validator.validateBarcode('123abc456')
      expect(result1.isValid).toBe(false)
      expect(result1.errors).toContain('Le code-barres doit contenir uniquement des chiffres')

      const result2 = Validator.validateBarcode('123-456-789')
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toContain('Le code-barres doit contenir uniquement des chiffres')
    })

    test('should warn about unusual lengths', () => {
      const result1 = Validator.validateBarcode('12345') // 5 digits
      expect(result1.isValid).toBe(true)
      expect(result1.warnings).toContain('Longueur inhabituelle pour un code-barres: 5 caractères')

      const result2 = Validator.validateBarcode('123456789012345678901') // 21 digits
      expect(result2.isValid).toBe(true)
      expect(result2.warnings).toContain('Longueur inhabituelle pour un code-barres: 21 caractères')
    })

    test('should not warn about standard lengths', () => {
      const standardLengths = [8, 12, 13, 14]
      
      standardLengths.forEach(length => {
        const barcode = '1'.repeat(length)
        const result = Validator.validateBarcode(barcode)
        expect(result.isValid).toBe(true)
        expect(result.warnings).toBeUndefined()
      })
    })

    test('should trim whitespace', () => {
      const result = Validator.validateBarcode('  1234567890123  ')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Utility functions', () => {
    describe('isValidQuantity', () => {
      test('should return boolean for quantity validation', () => {
        expect(isValidQuantity(100)).toBe(true)
        expect(isValidQuantity(-5)).toBe(false)
        expect(isValidQuantity('abc')).toBe(false)
        expect(isValidQuantity('10')).toBe(true)
      })
    })

    describe('isValidName', () => {
      test('should return boolean for name validation', () => {
        expect(isValidName('Tomate')).toBe(true)
        expect(isValidName('')).toBe(false)
        expect(isValidName('A')).toBe(false)
        expect(isValidName('Test<script>')).toBe(false)
      })
    })

    describe('isValidUnit', () => {
      test('should return boolean for unit validation', () => {
        expect(isValidUnit('g')).toBe(true)
        expect(isValidUnit('kg')).toBe(true)
        expect(isValidUnit('invalid')).toBe(false)
        expect(isValidUnit('')).toBe(false)
      })
    })

    describe('isValidBarcode', () => {
      test('should return boolean for barcode validation', () => {
        expect(isValidBarcode('1234567890123')).toBe(true)
        expect(isValidBarcode('123abc')).toBe(false)
        expect(isValidBarcode('')).toBe(false)
      })
    })
  })

  describe('Sanitization functions', () => {
    describe('sanitizeQuantity', () => {
      test('should convert strings to numbers', () => {
        expect(sanitizeQuantity('100')).toBe(100)
        expect(sanitizeQuantity('2.5')).toBe(2.5)
        expect(sanitizeQuantity('  10  ')).toBe(10)
      })

      test('should handle invalid inputs', () => {
        expect(sanitizeQuantity('abc')).toBe(0)
        expect(sanitizeQuantity('')).toBe(0)
        expect(sanitizeQuantity(null as any)).toBe(0)
        expect(sanitizeQuantity(undefined as any)).toBe(0)
      })

      test('should not allow negative numbers', () => {
        expect(sanitizeQuantity(-10)).toBe(0)
        expect(sanitizeQuantity('-5')).toBe(0)
      })

      test('should round to 3 decimal places maximum', () => {
        expect(sanitizeQuantity(1.123456789)).toBe(1.123)
        expect(sanitizeQuantity(2.9999)).toBe(3) // Rounding
        expect(sanitizeQuantity(1.0001)).toBe(1)
      })

      test('should preserve integers and reasonable decimals', () => {
        expect(sanitizeQuantity(100)).toBe(100)
        expect(sanitizeQuantity(2.5)).toBe(2.5)
        expect(sanitizeQuantity(1.123)).toBe(1.123)
      })
    })

    describe('sanitizeName', () => {
      test('should trim whitespace', () => {
        expect(sanitizeName('  Tomate  ')).toBe('Tomate')
        expect(sanitizeName('\n\tTest\n\t')).toBe('Test')
      })

      test('should remove forbidden characters', () => {
        expect(sanitizeName('Test<script>Name')).toBe('TestscriptName')
        expect(sanitizeName('A&B"C\'D{E}F')).toBe('ABCDEF')
      })

      test('should limit length to 100 characters', () => {
        const longName = 'A'.repeat(150)
        const result = sanitizeName(longName)
        expect(result).toHaveLength(100)
        expect(result).toBe('A'.repeat(100))
      })

      test('should preserve valid characters', () => {
        const validName = 'Pomme de terre bio 2kg'
        expect(sanitizeName(validName)).toBe(validName)
      })

      test('should handle edge cases', () => {
        expect(sanitizeName('')).toBe('')
        expect(sanitizeName('A')).toBe('A')
        expect(sanitizeName('🍅 Tomate')).toBe('🍅 Tomate')
      })
    })
  })

  describe('Integration tests', () => {
    test('should validate complete ingredient data workflow', () => {
      // Test d'un workflow complet de validation d'ingrédient
      const rawQuantity = '  2.5  '
      const rawName = '  Tomate bio  '
      const rawUnit = 'kg'
      
      // Étape 1: Sanitisation
      const cleanQuantity = sanitizeQuantity(rawQuantity)
      const cleanName = sanitizeName(rawName)
      
      // Étape 2: Validation
      const quantityValid = isValidQuantity(cleanQuantity)
      const nameValid = isValidName(cleanName)
      const unitValid = isValidUnit(rawUnit)
      
      expect(cleanQuantity).toBe(2.5)
      expect(cleanName).toBe('Tomate bio')
      expect(quantityValid).toBe(true)
      expect(nameValid).toBe(true)
      expect(unitValid).toBe(true)
    })

    test('should handle invalid ingredient data workflow', () => {
      const rawQuantity = 'abc'
      const rawName = '<script>alert("hack")</script>'
      const rawUnit = 'invalid_unit'
      
      const cleanQuantity = sanitizeQuantity(rawQuantity)
      const cleanName = sanitizeName(rawName)
      
      const quantityValid = isValidQuantity(cleanQuantity)
      const nameValid = isValidName(cleanName)
      const unitValid = isValidUnit(rawUnit)
      
      expect(cleanQuantity).toBe(0)
      expect(cleanName).toBe('scriptalert(hack)/script') // Forbidden chars removed (including quotes)
      expect(quantityValid).toBe(true) // 0 is valid but has warnings
      expect(nameValid).toBe(true) // Sanitized name is valid
      expect(unitValid).toBe(false)
    })
  })
})
