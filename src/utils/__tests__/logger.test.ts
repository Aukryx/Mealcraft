import { 
  logger, 
  LogLevel, 
  LogCategory,
  configureProductionLogging,
  configureDevelopmentLogging 
} from '../logger'

describe('logger', () => {
  // Mock console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
  }

  const mockConsole = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    console.log = mockConsole.log
    console.warn = mockConsole.warn
    console.error = mockConsole.error
    
    // Reset logger to default state
    logger.setLevel(LogLevel.DEBUG)
    Object.values(LogCategory).forEach(category => {
      logger.enableCategory(category)
    })
  })

  afterAll(() => {
    console.log = originalConsole.log
    console.warn = originalConsole.warn
    console.error = originalConsole.error
  })

  describe('LogLevel filtering', () => {
    test('should log all levels when set to DEBUG', () => {
      logger.setLevel(LogLevel.DEBUG)
      
      logger.error(LogCategory.GENERAL, 'Test error')
      logger.warn(LogCategory.GENERAL, 'Test warn')
      logger.info(LogCategory.GENERAL, 'Test info')
      logger.debug(LogCategory.GENERAL, 'Test debug')
      
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
      expect(mockConsole.warn).toHaveBeenCalledTimes(1)
      expect(mockConsole.log).toHaveBeenCalledTimes(2) // info + debug
    })

    test('should filter logs when set to INFO', () => {
      logger.setLevel(LogLevel.INFO)
      
      logger.error(LogCategory.GENERAL, 'Test error')
      logger.warn(LogCategory.GENERAL, 'Test warn')
      logger.info(LogCategory.GENERAL, 'Test info')
      logger.debug(LogCategory.GENERAL, 'Test debug')
      
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
      expect(mockConsole.warn).toHaveBeenCalledTimes(1)
      expect(mockConsole.log).toHaveBeenCalledTimes(1) // only info
    })

    test('should filter logs when set to WARN', () => {
      logger.setLevel(LogLevel.WARN)
      
      logger.error(LogCategory.GENERAL, 'Test error')
      logger.warn(LogCategory.GENERAL, 'Test warn')
      logger.info(LogCategory.GENERAL, 'Test info')
      logger.debug(LogCategory.GENERAL, 'Test debug')
      
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
      expect(mockConsole.warn).toHaveBeenCalledTimes(1)
      expect(mockConsole.log).not.toHaveBeenCalled()
    })

    test('should only log errors when set to ERROR', () => {
      logger.setLevel(LogLevel.ERROR)
      
      logger.error(LogCategory.GENERAL, 'Test error')
      logger.warn(LogCategory.GENERAL, 'Test warn')
      logger.info(LogCategory.GENERAL, 'Test info')
      logger.debug(LogCategory.GENERAL, 'Test debug')
      
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
      expect(mockConsole.warn).not.toHaveBeenCalled()
      expect(mockConsole.log).not.toHaveBeenCalled()
    })
  })

  describe('Category filtering', () => {
    test('should log when category is enabled', () => {
      logger.enableCategory(LogCategory.BARCODE)
      
      logger.info(LogCategory.BARCODE, 'Test message')
      
      expect(mockConsole.log).toHaveBeenCalledTimes(1)
    })

    test('should not log when category is disabled', () => {
      logger.disableCategory(LogCategory.BARCODE)
      
      logger.info(LogCategory.BARCODE, 'Test message')
      
      expect(mockConsole.log).not.toHaveBeenCalled()
    })

    test('should handle multiple categories independently', () => {
      logger.enableCategory(LogCategory.STOCK)
      logger.disableCategory(LogCategory.API)
      
      logger.info(LogCategory.STOCK, 'Stock message')
      logger.info(LogCategory.API, 'API message')
      
      expect(mockConsole.log).toHaveBeenCalledTimes(1)
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('INFO:STOCK Stock message')
      )
    })
  })

  describe('Message formatting', () => {
    test('should format messages with timestamp and level', () => {
      logger.info(LogCategory.GENERAL, 'Test message')
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringMatching(/ℹ️ \[\d{2}:\d{2}:\d{2}\] INFO:GENERAL Test message/)
      )
    })

    test('should include emojis for different levels', () => {
      logger.error(LogCategory.GENERAL, 'Error message')
      logger.warn(LogCategory.GENERAL, 'Warn message')
      logger.info(LogCategory.GENERAL, 'Info message')
      logger.debug(LogCategory.GENERAL, 'Debug message')
      
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('❌ [')
      )
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('⚠️ [')
      )
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('ℹ️ [')
      )
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('🔍 [')
      )
    })

    test('should include additional arguments', () => {
      const extraData = { key: 'value', number: 42 }
      
      logger.info(LogCategory.GENERAL, 'Test message', extraData, 'extra string')
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Test message'),
        extraData,
        'extra string'
      )
    })
  })

  describe('Convenience methods', () => {
    test('should use barcode convenience methods', () => {
      logger.barcode.info('Barcode scanned')
      logger.barcode.debug('Barcode debug info')
      logger.barcode.error('Barcode error')
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('INFO:BARCODE Barcode scanned')
      )
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG:BARCODE Barcode debug info')
      )
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR:BARCODE Barcode error')
      )
    })

    test('should use stock convenience methods', () => {
      logger.stock.info('Stock updated')
      logger.stock.debug('Stock debug info')
      logger.stock.error('Stock error')
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('INFO:STOCK Stock updated')
      )
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR:STOCK Stock error')
      )
    })

    test('should use planning convenience methods', () => {
      logger.planning.info('Planning updated')
      logger.planning.debug('Planning debug info')
      logger.planning.error('Planning error')
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('INFO:PLANNING Planning updated')
      )
    })

    test('should use api convenience methods', () => {
      logger.api.info('API call successful')
      logger.api.debug('API debug info')
      logger.api.error('API error')
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('INFO:API API call successful')
      )
    })

    test('should use units convenience methods', () => {
      logger.units.warn('Unit conversion warning')
      logger.units.debug('Unit debug info')
      
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('WARN:UNITS Unit conversion warning')
      )
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG:UNITS Unit debug info')
      )
    })
  })

  describe('Configuration functions', () => {
    test('should configure production logging', () => {
      configureProductionLogging()
      
      logger.error(LogCategory.GENERAL, 'Error message')
      logger.warn(LogCategory.GENERAL, 'Warn message')
      logger.info(LogCategory.GENERAL, 'Info message')
      logger.debug(LogCategory.GENERAL, 'Debug message')
      
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
      expect(mockConsole.warn).not.toHaveBeenCalled()
      expect(mockConsole.log).not.toHaveBeenCalled()
    })

    test('should configure development logging', () => {
      configureDevelopmentLogging()
      
      logger.error(LogCategory.GENERAL, 'Error message')
      logger.warn(LogCategory.GENERAL, 'Warn message')
      logger.info(LogCategory.GENERAL, 'Info message')
      logger.debug(LogCategory.GENERAL, 'Debug message')
      
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
      expect(mockConsole.warn).toHaveBeenCalledTimes(1)
      expect(mockConsole.log).toHaveBeenCalledTimes(2) // info + debug
    })
  })

  describe('Edge cases and error handling', () => {
    test('should handle undefined and null arguments', () => {
      logger.info(LogCategory.GENERAL, 'Test message', null, undefined)
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Test message'),
        null,
        undefined
      )
    })

    test('should handle empty messages', () => {
      logger.info(LogCategory.GENERAL, '')
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringMatching(/INFO:GENERAL $/)
      )
    })

    test('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000)
      
      logger.info(LogCategory.GENERAL, longMessage)
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining(longMessage)
      )
    })

    test('should handle special characters in messages', () => {
      const specialMessage = 'Test 🎉 with émojis & spéciàl chârs'
      
      logger.info(LogCategory.GENERAL, specialMessage)
      
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining(specialMessage)
      )
    })

    test('should handle circular reference objects', () => {
      const circularObj: any = { name: 'test' }
      circularObj.self = circularObj
      
      // Should not throw error
      expect(() => {
        logger.info(LogCategory.GENERAL, 'Circular object', circularObj)
      }).not.toThrow()
      
      expect(mockConsole.log).toHaveBeenCalled()
    })
  })

  describe('Singleton behavior', () => {
    test('should maintain state across different imports', () => {
      // Simulate different configuration
      logger.setLevel(LogLevel.ERROR)
      logger.disableCategory(LogCategory.STOCK)
      
      // These changes should persist
      logger.warn(LogCategory.GENERAL, 'Should not log')
      logger.info(LogCategory.STOCK, 'Should not log')
      logger.error(LogCategory.GENERAL, 'Should log')
      
      expect(mockConsole.warn).not.toHaveBeenCalled()
      expect(mockConsole.log).not.toHaveBeenCalled()
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('Performance considerations', () => {
    test('should not format messages when logging is disabled', () => {
      logger.setLevel(LogLevel.ERROR)
      
      const expensiveOperation = jest.fn(() => ({ expensive: 'data' }))
      
      // This should not call the expensive operation
      logger.debug(LogCategory.GENERAL, 'Debug message', expensiveOperation())
      
      expect(expensiveOperation).toHaveBeenCalled() // Note: arguments are evaluated
      expect(mockConsole.log).not.toHaveBeenCalled()
    })
  })
})
