// Système de logging conditionnel pour MealCraft
// Remplace les console.log avec des niveaux et conditions

import { useEffect } from 'react';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export enum LogCategory {
  GENERAL = 'GENERAL',
  BARCODE = 'BARCODE',
  STOCK = 'STOCK',
  PLANNING = 'PLANNING',
  API = 'API',
  USER = 'USER',
  UNITS = 'UNITS'
}

class Logger {
  private static instance: Logger;
  private level: LogLevel;
  private enabledCategories: Set<LogCategory>;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.level = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
    this.enabledCategories = new Set(Object.values(LogCategory));
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  enableCategory(category: LogCategory) {
    this.enabledCategories.add(category);
  }

  disableCategory(category: LogCategory) {
    this.enabledCategories.delete(category);
  }

  private shouldLog(level: LogLevel, category: LogCategory): boolean {
    return (
      level <= this.level && 
      this.enabledCategories.has(category)
    );
  }

  private formatMessage(level: LogLevel, category: LogCategory, message: string, ...args: any[]): any[] {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    const levelStr = LogLevel[level];
    const emoji = this.getLevelEmoji(level);
    
    return [
      `${emoji} [${timestamp}] ${levelStr}:${category} ${message}`,
      ...args
    ];
  }

  private getLevelEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR: return '❌';
      case LogLevel.WARN: return '⚠️';
      case LogLevel.INFO: return 'ℹ️';
      case LogLevel.DEBUG: return '🔍';
      default: return '📝';
    }
  }

  error(category: LogCategory, message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.ERROR, category)) {
      console.error(...this.formatMessage(LogLevel.ERROR, category, message, ...args));
    }
  }

  warn(category: LogCategory, message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.WARN, category)) {
      console.warn(...this.formatMessage(LogLevel.WARN, category, message, ...args));
    }
  }

  info(category: LogCategory, message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.INFO, category)) {
      console.log(...this.formatMessage(LogLevel.INFO, category, message, ...args));
    }
  }

  debug(category: LogCategory, message: string, ...args: any[]) {
    if (this.shouldLog(LogLevel.DEBUG, category)) {
      console.log(...this.formatMessage(LogLevel.DEBUG, category, message, ...args));
    }
  }

  // Méthodes de convenance pour des catégories spécifiques
  barcode = {
    info: (message: string, ...args: any[]) => this.info(LogCategory.BARCODE, message, ...args),
    debug: (message: string, ...args: any[]) => this.debug(LogCategory.BARCODE, message, ...args),
    error: (message: string, ...args: any[]) => this.error(LogCategory.BARCODE, message, ...args)
  };

  stock = {
    info: (message: string, ...args: any[]) => this.info(LogCategory.STOCK, message, ...args),
    debug: (message: string, ...args: any[]) => this.debug(LogCategory.STOCK, message, ...args),
    error: (message: string, ...args: any[]) => this.error(LogCategory.STOCK, message, ...args)
  };

  planning = {
    info: (message: string, ...args: any[]) => this.info(LogCategory.PLANNING, message, ...args),
    debug: (message: string, ...args: any[]) => this.debug(LogCategory.PLANNING, message, ...args),
    error: (message: string, ...args: any[]) => this.error(LogCategory.PLANNING, message, ...args)
  };

  api = {
    info: (message: string, ...args: any[]) => this.info(LogCategory.API, message, ...args),
    debug: (message: string, ...args: any[]) => this.debug(LogCategory.API, message, ...args),
    error: (message: string, ...args: any[]) => this.error(LogCategory.API, message, ...args)
  };

  units = {
    warn: (message: string, ...args: any[]) => this.warn(LogCategory.UNITS, message, ...args),
    debug: (message: string, ...args: any[]) => this.debug(LogCategory.UNITS, message, ...args)
  };
}

// Export du singleton
export const logger = Logger.getInstance();

// Configuration pour la production
export const configureProductionLogging = () => {
  logger.setLevel(LogLevel.ERROR);
  // Garder toutes les catégories mais niveau ERROR seulement
};

// Configuration pour le développement
export const configureDevelopmentLogging = () => {
  logger.setLevel(LogLevel.DEBUG);
};

// Hook React pour configurer le logging selon l'environnement
export const useLogger = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      configureProductionLogging();
    } else {
      configureDevelopmentLogging();
    }
  }, []);
  
  return logger;
};
