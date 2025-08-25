import { ingredientsDeBase, Ingredient, IngredientCategorie } from '../data/recettesDeBase';

// Service pour interroger l'API OpenFoodFacts et mapper vers notre base locale
export interface ProductInfo {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  ingredients?: string[];
  nutrition?: {
    energy?: number;
    proteins?: number;
    carbohydrates?: number;
    fat?: number;
    fiber?: number;
  };
  imageUrl?: string;
  quantity?: string;
  unit?: string;
  // Nouveaux champs pour la correspondance
  matchedIngredient?: Ingredient;
  extractedQuantity?: number;
  confidence: number; // Score de confiance de la correspondance
}

// Correspondance entre catégories OpenFoodFacts et nos ingrédients
const CATEGORY_MAPPING: { [key: string]: string } = {
  'vegetables': 'légume',
  'fruits': 'fruit',
  'dairy': 'produit laitier',
  'meat': 'viande',
  'fish': 'poisson',
  'cereals': 'céréale',
  'legumes': 'légumineuse',
  'herbs': 'herbe aromatique',
  'spices': 'épice',
  'oils': 'huile',
  'beverages': 'boisson',
  'snacks': 'autre',
  'bread': 'céréale'
};

export class OpenFoodFactsService {
  private static BASE_URL = 'https://world.openfoodfacts.org/api/v0/product';

  static async getProductByBarcode(barcode: string): Promise<ProductInfo | null> {
    try {
      console.log('🔍 Recherche produit:', barcode);
      
      // Gestion des codes de test pour les ingrédients de base
      if (barcode.startsWith('test_')) {
        return this.getTestProduct(barcode);
      }

      const response = await fetch(`${this.BASE_URL}/${barcode}.json`);
      const data = await response.json();

      if (data.status === 0 || !data.product) {
        console.log('❌ Produit non trouvé');
        return null;
      }

      const product = data.product;
      console.log('📦 Produit trouvé:', product);

      // Extraction des informations utiles
      const productInfo: ProductInfo = {
        id: barcode,
        name: this.extractProductName(product),
        brand: product.brands || undefined,
        category: this.mapCategory(product.categories_tags || []),
        ingredients: this.extractIngredients(product.ingredients_text),
        nutrition: this.extractNutrition(product.nutriments),
        imageUrl: product.image_url || undefined,
        quantity: product.quantity || undefined,
        unit: this.extractUnit(product.quantity),
        confidence: 0.8 // Confiance de base pour OpenFoodFacts
      };

      // Correspondance avec notre base locale
      console.log('🔍 Recherche de correspondance locale pour:', productInfo.name);
      const matchResult = this.findBestMatch(productInfo);
      console.log('🎯 Résultat de correspondance:', matchResult);
      
      productInfo.matchedIngredient = matchResult.ingredient || undefined;
      productInfo.extractedQuantity = matchResult.quantity;
      productInfo.confidence = matchResult.confidence;

      console.log('📊 Produit final avec correspondance:', productInfo);
      return productInfo;
    } catch (error) {
      console.error('Erreur API OpenFoodFacts:', error);
      return null;
    }
  }

  // Retourner un produit de test basé sur notre base d'ingrédients
  private static getTestProduct(testCode: string): ProductInfo | null {
    const testProducts: { [key: string]: { ingredient: Ingredient; quantity: number; unit: string } } = {
      'test_banane': {
        ingredient: ingredientsDeBase.find(i => i.id === 'banane')!,
        quantity: 1000,
        unit: 'g'
      },
      'test_yaourt': {
        ingredient: ingredientsDeBase.find(i => i.id === 'yaourt')!,
        quantity: 4,
        unit: 'pot'
      },
      'test_poulet': {
        ingredient: ingredientsDeBase.find(i => i.id === 'poulet')!,
        quantity: 500,
        unit: 'g'
      },
      'test_carotte': {
        ingredient: ingredientsDeBase.find(i => i.id === 'carotte')!,
        quantity: 5,
        unit: 'pièce'
      },
      'test_lait': {
        ingredient: ingredientsDeBase.find(i => i.id === 'lait')!,
        quantity: 1000,
        unit: 'ml'
      },
      'test_fromage': {
        ingredient: ingredientsDeBase.find(i => i.id === 'fromage')!,
        quantity: 200,
        unit: 'g'
      }
    };

    const testProduct = testProducts[testCode];
    if (!testProduct || !testProduct.ingredient) {
      console.log('❌ Produit de test non trouvé:', testCode);
      return null;
    }

    const { ingredient, quantity, unit } = testProduct;
    
    console.log('🧪 Produit de test créé:', ingredient.nom, quantity, unit);
    
    return {
      id: testCode,
      name: ingredient.nom,
      category: ingredient.categorie,
      unit: unit,
      quantity: `${quantity}${unit}`,
      confidence: 1.0, // Confiance maximale pour les tests
      matchedIngredient: ingredient,
      extractedQuantity: quantity
    };
  }

  // Recherche par nom de produit
  static async searchProducts(query: string, limit = 10): Promise<ProductInfo[]> {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${limit}`
      );
      const data = await response.json();

      if (!data.products) {
        return [];
      }

      return data.products.map((product: any) => ({
        id: product.code || product._id,
        name: this.extractProductName(product),
        brand: product.brands || undefined,
        category: this.mapCategory(product.categories_tags || []),
        imageUrl: product.image_url || undefined,
        quantity: product.quantity || undefined,
        unit: this.extractUnit(product.quantity)
      }));
    } catch (error) {
      console.error('Erreur recherche produits:', error);
      return [];
    }
  }

  private static extractProductName(product: any): string {
    return product.product_name_fr || 
           product.product_name || 
           product.generic_name_fr ||
           product.generic_name ||
           'Produit inconnu';
  }

  private static mapCategory(categoriesTags: string[]): string {
    // Chercher une correspondance dans nos catégories
    for (const tag of categoriesTags) {
      const normalizedTag = tag.replace('en:', '').toLowerCase();
      for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
        if (normalizedTag.includes(key)) {
          return value;
        }
      }
    }
    return 'autre';
  }

  private static extractIngredients(ingredientsText?: string): string[] {
    if (!ingredientsText) return [];
    
    // Parse simple des ingrédients (améliorer avec regex plus sophistiquée)
    return ingredientsText
      .split(/[,;]/)
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0)
      .slice(0, 10); // Limiter à 10 ingrédients principaux
  }

  private static extractNutrition(nutriments: any) {
    if (!nutriments) return undefined;

    return {
      energy: nutriments.energy_100g || nutriments['energy-kcal_100g'],
      proteins: nutriments.proteins_100g,
      carbohydrates: nutriments.carbohydrates_100g,
      fat: nutriments.fat_100g,
      fiber: nutriments.fiber_100g
    };
  }

  private static extractUnit(quantity?: string): string {
    if (!quantity) return 'pièce';
    
    const quantityLower = quantity.toLowerCase();
    
    if (quantityLower.includes('kg')) return 'kg';
    if (quantityLower.includes('g') && !quantityLower.includes('kg')) return 'g';
    if (quantityLower.includes('l') && !quantityLower.includes('ml')) return 'l';
    if (quantityLower.includes('ml')) return 'ml';
    if (quantityLower.includes('cl')) return 'cl';
    
    return 'pièce';
  }

  // Suggérer des ingrédients basés sur un produit
  static suggestIngredients(product: ProductInfo): Array<{
    nom: string;
    quantite: number;
    unite: string;
    categorie: string;
  }> {
    const suggestions = [];

    // Le produit lui-même
    suggestions.push({
      nom: product.name,
      quantite: this.extractQuantityNumber(product.quantity) || 1,
      unite: product.unit || 'pièce',
      categorie: product.category || 'autre'
    });

    // Si on a des ingrédients listés, on peut les suggérer aussi
    if (product.ingredients && product.ingredients.length > 0) {
      product.ingredients.slice(0, 3).forEach(ingredient => {
        suggestions.push({
          nom: ingredient,
          quantite: 0.1, // Quantité estimée
          unite: 'kg',
          categorie: 'autre'
        });
      });
    }

    return suggestions;
  }

  // Extraire la quantité depuis les informations du produit
  private static extractQuantityFromProduct(product: ProductInfo): number {
    // Extraire depuis product.quantity (ex: "500g", "1L", "6 pièces")
    if (product.quantity) {
      const match = product.quantity.match(/(\d+(?:\.\d+)?)/);
      if (match) {
        return parseFloat(match[1]);
      }
    }

    // Extraire depuis le nom du produit
    const nameQuantityPatterns = [
      /(\d+(?:\.\d+)?)\s*(?:kg|g|l|ml|cl)/i,
      /(\d+)\s*(?:pièces?|unités?|pack)/i,
      /lot\s*de\s*(\d+)/i,
      /x\s*(\d+)/i
    ];

    for (const pattern of nameQuantityPatterns) {
      const match = product.name.match(pattern);
      if (match) {
        return parseFloat(match[1]);
      }
    }

    return 1; // Quantité par défaut
  }

  // Extraire des mots-clés alimentaires du nom du produit
  private static extractFoodKeywords(productName: string): string[] {
    const foodTerms = [
      'lait', 'fromage', 'yaourt', 'beurre', 'crème',
      'poulet', 'bœuf', 'porc', 'jambon', 'saucisse',
      'saumon', 'thon', 'poisson',
      'pomme', 'banane', 'orange', 'citron', 'fraise',
      'carotte', 'tomate', 'oignon', 'pomme de terre',
      'pain', 'pâtes', 'riz', 'farine',
      'sel', 'poivre', 'sucre', 'huile', 'vinaigre'
    ];

    return foodTerms.filter(term => productName.includes(term));
  }

  // Obtenir des mots-clés pour une catégorie
  private static getCategoryKeywords(category: IngredientCategorie): string[] {
    const categoryMap = {
      'légume': ['légume', 'salade', 'carotte', 'tomate', 'oignon'],
      'fruit': ['fruit', 'pomme', 'banane', 'orange', 'citron'],
      'viande': ['viande', 'poulet', 'bœuf', 'porc', 'jambon'],
      'poisson': ['poisson', 'saumon', 'thon', 'truite'],
      'produit laitier': ['lait', 'fromage', 'yaourt', 'beurre'],
      'féculent': ['pain', 'pâtes', 'riz', 'farine', 'céréale'],
      'épice': ['épice', 'herbe', 'aromate', 'condiment'],
      'autre': []
    };

    return categoryMap[category] || [];
  }

  private static extractQuantityNumber(quantity?: string): number | null {
    if (!quantity) return null;
    
    const matches = quantity.match(/(\d+(?:\.\d+)?)/);
    return matches ? parseFloat(matches[1]) : null;
  }

  // Trouver la meilleure correspondance dans la base locale
  private static findBestMatch(productInfo: ProductInfo): {
    ingredient: Ingredient | null;
    quantity: number;
    confidence: number;
  } {
    console.log('🔍 Recherche correspondance pour:', productInfo.name);

    const productName = productInfo.name.toLowerCase();
    const extractedQuantity = this.extractQuantityFromProduct(productInfo);
    
    // 1. Correspondance exacte par nom
    const exactMatch = ingredientsDeBase.find(ing => 
      ing.nom.toLowerCase() === productName ||
      productName.includes(ing.nom.toLowerCase()) ||
      ing.nom.toLowerCase().includes(productName)
    );

    if (exactMatch) {
      console.log('✅ Correspondance exacte trouvée:', exactMatch.nom);
      return {
        ingredient: exactMatch,
        quantity: extractedQuantity,
        confidence: 0.9
      };
    }

    // 2. Correspondance par mots-clés
    const keywords = this.extractFoodKeywords(productName);
    let bestMatch: Ingredient | null = null;
    let bestScore = 0;

    for (const ingredient of ingredientsDeBase) {
      const ingredientKeywords = this.extractFoodKeywords(ingredient.nom.toLowerCase());
      const commonKeywords = keywords.filter(k => ingredientKeywords.includes(k));
      
      if (commonKeywords.length > 0) {
        const score = commonKeywords.length / Math.max(keywords.length, ingredientKeywords.length);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = ingredient;
        }
      }
    }

    if (bestMatch && bestScore > 0.3) {
      console.log('🎯 Correspondance par mots-clés:', bestMatch.nom, 'Score:', bestScore);
      return {
        ingredient: bestMatch,
        quantity: extractedQuantity,
        confidence: bestScore
      };
    }

    // 3. Correspondance par catégorie
    if (productInfo.category && productInfo.category !== 'autre') {
      const categoryIngredients = ingredientsDeBase.filter(ing => ing.categorie === productInfo.category);
      if (categoryIngredients.length > 0) {
        // Prendre le premier de la catégorie ou chercher par nom similaire
        const categoryMatch = categoryIngredients.find(ing => 
          productName.includes(ing.nom.toLowerCase().split(' ')[0])
        ) || categoryIngredients[0];
        
        console.log('📂 Correspondance par catégorie:', categoryMatch.nom);
        return {
          ingredient: categoryMatch,
          quantity: extractedQuantity,
          confidence: 0.4
        };
      }
    }

    console.log('❌ Aucune correspondance trouvée');
    return {
      ingredient: null,
      quantity: extractedQuantity,
      confidence: 0.1
    };
  }
}

export default OpenFoodFactsService;
