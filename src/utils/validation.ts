// Système de validation des données pour MealCraft
// Validation des inputs utilisateur et des données externes

import { logger, LogCategory } from './logger';

// Types de validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Règles de validation
export class Validator {
  
  // Validation des quantités
  static validateQuantity(quantity: number | string, context: string = ''): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Conversion en nombre si string
    const qty = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
    
    if (isNaN(qty)) {
      errors.push(`Quantité invalide: "${quantity}" n'est pas un nombre`);
      return { isValid: false, errors, warnings };
    }
    
    if (qty < 0) {
      errors.push('La quantité ne peut pas être négative');
    }
    
    if (qty === 0) {
      warnings.push('Quantité de 0 détectée');
    }
    
    if (qty > 10000) {
      warnings.push('Quantité très élevée détectée (>10000)');
    }
    
    // Vérification des décimales excessives
    if (qty.toString().includes('.') && qty.toString().split('.')[1].length > 3) {
      warnings.push('Précision excessive détectée (>3 décimales)');
    }
    
    if (errors.length > 0) {
      logger.warn(LogCategory.GENERAL, `Validation quantité échoué pour ${context}:`, { quantity, errors });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
  
  // Validation des noms d'ingrédients/recettes
  static validateName(name: string, context: string = ''): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Le nom ne peut pas être vide');
      return { isValid: false, errors };
    }
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }
    
    if (trimmedName.length > 100) {
      errors.push('Le nom est trop long (maximum 100 caractères)');
    }
    
    // Vérification des caractères interdits
    const forbiddenChars = /[<>\"'&{}]/;
    if (forbiddenChars.test(trimmedName)) {
      errors.push('Le nom contient des caractères interdits');
    }
    
    // Vérifications de format
    if (/^\d+$/.test(trimmedName)) {
      warnings.push('Le nom ne devrait pas être uniquement numérique');
    }
    
    if (errors.length > 0) {
      logger.warn(LogCategory.USER, `Validation nom échoué pour ${context}:`, { name, errors });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
  
  // Validation des unités
  static validateUnit(unit: string): ValidationResult {
    const errors: string[] = [];
    const validUnits = [
      'g', 'kg', 'ml', 'cl', 'L', 'càs', 'càc', 
      'pièce', 'tranche', 'pot', 'gousse', 'pincée'
    ];
    
    if (!unit || unit.trim().length === 0) {
      errors.push('L\'unité ne peut pas être vide');
      return { isValid: false, errors };
    }
    
    if (!validUnits.includes(unit.trim())) {
      errors.push(`Unité non reconnue: "${unit}". Unités valides: ${validUnits.join(', ')}`);
    }
    
    if (errors.length > 0) {
      logger.units.warn('Validation unité échoué:', { unit, errors });
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  // Validation des codes-barres
  static validateBarcode(barcode: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!barcode || barcode.trim().length === 0) {
      errors.push('Le code-barres ne peut pas être vide');
      return { isValid: false, errors };
    }
    
    const cleanBarcode = barcode.trim();
    
    // Vérification de longueur (codes EAN-13, EAN-8, UPC-A couramment utilisés)
    const validLengths = [8, 12, 13, 14];
    if (!validLengths.includes(cleanBarcode.length)) {
      warnings.push(`Longueur inhabituelle pour un code-barres: ${cleanBarcode.length} caractères`);
    }
    
    // Vérification que ce sont uniquement des chiffres
    if (!/^\d+$/.test(cleanBarcode)) {
      errors.push('Le code-barres doit contenir uniquement des chiffres');
    }
    
    if (errors.length > 0) {
      logger.barcode.error('Validation code-barres échoué:', { barcode, errors });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
  
  // Validation des données de l'API OpenFoodFacts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validateOpenFoodFactsProduct(product: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!product) {
      errors.push('Produit null ou undefined');
      return { isValid: false, errors };
    }
    
    if (!product.product) {
      errors.push('Structure de produit invalide (propriété product manquante)');
      return { isValid: false, errors };
    }
    
    const productData = product.product;
    
    if (!productData.product_name && !productData.product_name_fr) {
      warnings.push('Nom du produit manquant');
    }
    
    if (!productData.categories && !productData.categories_tags) {
      warnings.push('Catégories du produit manquantes');
    }
    
    if (!productData.nutriments && !productData.nutrition_data_per) {
      warnings.push('Informations nutritionnelles manquantes');
    }
    
    if (warnings.length > 0) {
      logger.api.debug('Données OpenFoodFacts incomplètes:', { warnings });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
  
  // Validation des portions
  static validatePortions(portions: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (isNaN(portions)) {
      errors.push('Nombre de portions invalide');
      return { isValid: false, errors };
    }
    
    if (portions <= 0) {
      errors.push('Le nombre de portions doit être positif');
    }
    
    if (portions > 20) {
      warnings.push('Nombre de portions très élevé (>20)');
    }
    
    if (portions !== Math.floor(portions)) {
      warnings.push('Portions avec décimales détectées');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
  
  // Validation complète d'un ingrédient
  static validateIngredient(ingredient: {
    nom?: string;
    quantite?: number;
    unite?: string;
  }): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    
    // Validation du nom
    if (ingredient.nom) {
      const nameResult = this.validateName(ingredient.nom, 'ingrédient');
      allErrors.push(...nameResult.errors);
      if (nameResult.warnings) allWarnings.push(...nameResult.warnings);
    }
    
    // Validation de la quantité
    if (ingredient.quantite !== undefined) {
      const qtyResult = this.validateQuantity(ingredient.quantite, 'ingrédient');
      allErrors.push(...qtyResult.errors);
      if (qtyResult.warnings) allWarnings.push(...qtyResult.warnings);
    }
    
    // Validation de l'unité
    if (ingredient.unite) {
      const unitResult = this.validateUnit(ingredient.unite);
      allErrors.push(...unitResult.errors);
    }
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings.length > 0 ? allWarnings : undefined
    };
  }
}

// Utilitaires de validation
export const isValidQuantity = (qty: number | string): boolean => 
  Validator.validateQuantity(qty).isValid;

export const isValidName = (name: string): boolean => 
  Validator.validateName(name).isValid;

export const isValidUnit = (unit: string): boolean => 
  Validator.validateUnit(unit).isValid;

export const isValidBarcode = (barcode: string): boolean => 
  Validator.validateBarcode(barcode).isValid;

// Nettoyage des données
export const sanitizeQuantity = (qty: number | string): number => {
  const numQty = typeof qty === 'string' ? parseFloat(qty) : qty;
  if (isNaN(numQty) || numQty < 0) return 0;
  // Arrondir à 3 décimales maximum
  return Math.round(numQty * 1000) / 1000;
};

export const sanitizeName = (name: string): string => {
  return name
    .trim()
    .replace(/[<>\"'&{}]/g, '') // Supprime les caractères dangereux
    .substring(0, 100); // Limite à 100 caractères
};
