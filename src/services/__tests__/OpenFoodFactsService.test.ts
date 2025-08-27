import { OpenFoodFactsService, ProductInfo } from '../OpenFoodFactsService';

// Mock fetch
global.fetch = jest.fn();

// Mock console pour éviter les logs pendant les tests
const consoleMock = {
  log: jest.fn(),
  error: jest.fn(),
};
global.console = { ...console, ...consoleMock };

// Mock des ingrédients de base
jest.mock('../../data/recettesDeBase', () => ({
  ingredientsDeBase: [
    { id: 'tomate', nom: 'Tomate', categorie: 'légume' },
    { id: 'pomme', nom: 'Pomme', categorie: 'fruit' },
    { id: 'poulet', nom: 'Poulet', categorie: 'viande' },
    { id: 'lait', nom: 'Lait', categorie: 'produit laitier' },
    { id: 'banane', nom: 'Banane', categorie: 'fruit' },
    { id: 'yaourt', nom: 'Yaourt', categorie: 'produit laitier' },
    { id: 'carotte', nom: 'Carotte', categorie: 'légume' },
    { id: 'fromage', nom: 'Fromage', categorie: 'produit laitier' }
  ]
}));

describe('OpenFoodFactsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
    consoleMock.log.mockClear();
    consoleMock.error.mockClear();
  });

  describe('getProductByBarcode', () => {
    test('should return test product for test barcode', async () => {
      const product = await OpenFoodFactsService.getProductByBarcode('test_banane');
      
      expect(product).not.toBeNull();
      expect(product!.id).toBe('test_banane');
      expect(product!.name).toBe('Banane');
      expect(product!.category).toBe('fruit');
      expect(product!.confidence).toBe(1.0);
      expect(product!.matchedIngredient).toBeDefined();
      expect(product!.matchedIngredient!.id).toBe('banane');
    });

    test('should return null for unknown test product', async () => {
      const product = await OpenFoodFactsService.getProductByBarcode('test_inexistant');
      
      expect(product).toBeNull();
    });

    test('should fetch product from API for real barcode', async () => {
      const mockApiResponse = {
        status: 1,
        product: {
          product_name: 'Tomates cerises',
          brands: 'Marque Test',
          categories_tags: ['en:vegetables'],
          ingredients_text: 'tomates',
          nutriments: {
            energy_100g: 100,
            proteins_100g: 1.2
          },
          image_url: 'https://example.com/image.jpg',
          quantity: '500g'
        }
      };

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockApiResponse)
      });

      const product = await OpenFoodFactsService.getProductByBarcode('1234567890');

      expect(fetch).toHaveBeenCalledWith(
        'https://world.openfoodfacts.org/api/v0/product/1234567890.json'
      );
      expect(product).not.toBeNull();
      expect(product!.name).toBe('Tomates cerises');
      expect(product!.brand).toBe('Marque Test');
      expect(product!.category).toBe('légume');
      expect(product!.unit).toBe('g');
    });

    test('should return null when API returns status 0', async () => {
      const mockApiResponse = {
        status: 0
      };

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockApiResponse)
      });

      const product = await OpenFoodFactsService.getProductByBarcode('1234567890');

      expect(product).toBeNull();
    });

    test('should return null when API returns no product', async () => {
      const mockApiResponse = {
        status: 1,
        product: null
      };

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockApiResponse)
      });

      const product = await OpenFoodFactsService.getProductByBarcode('1234567890');

      expect(product).toBeNull();
    });

    test('should handle API errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const product = await OpenFoodFactsService.getProductByBarcode('1234567890');

      expect(product).toBeNull();
      expect(consoleMock.error).toHaveBeenCalledWith(
        'Erreur API OpenFoodFacts:',
        expect.any(Error)
      );
    });

    test('should extract nutrition information correctly', async () => {
      const mockApiResponse = {
        status: 1,
        product: {
          product_name: 'Test Product',
          nutriments: {
            energy_100g: 250,
            proteins_100g: 15.5,
            carbohydrates_100g: 30.2,
            fat_100g: 5.8,
            fiber_100g: 2.1
          }
        }
      };

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockApiResponse)
      });

      const product = await OpenFoodFactsService.getProductByBarcode('1234567890');

      expect(product!.nutrition).toEqual({
        energy: 250,
        proteins: 15.5,
        carbohydrates: 30.2,
        fat: 5.8,
        fiber: 2.1
      });
    });

    test('should handle missing nutrition information', async () => {
      const mockApiResponse = {
        status: 1,
        product: {
          product_name: 'Test Product',
          nutriments: null
        }
      };

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockApiResponse)
      });

      const product = await OpenFoodFactsService.getProductByBarcode('1234567890');

      expect(product!.nutrition).toBeUndefined();
    });
  });

  describe('searchProducts', () => {
    test('should search products by query', async () => {
      const mockSearchResponse = {
        products: [
          {
            code: '1234567890',
            product_name: 'Pommes Golden',
            brands: 'Verger Bio',
            categories_tags: ['en:fruits'],
            image_url: 'https://example.com/pomme.jpg',
            quantity: '1kg'
          },
          {
            code: '0987654321',
            product_name: 'Pommes de terre',
            categories_tags: ['en:vegetables']
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockSearchResponse)
      });

      const products = await OpenFoodFactsService.searchProducts('pomme', 5);

      expect(fetch).toHaveBeenCalledWith(
        'https://world.openfoodfacts.org/cgi/search.pl?search_terms=pomme&search_simple=1&action=process&json=1&page_size=5'
      );
      expect(products).toHaveLength(2);
      expect(products[0].name).toBe('Pommes Golden');
      expect(products[0].brand).toBe('Verger Bio');
      expect(products[1].name).toBe('Pommes de terre');
    });

    test('should return empty array when no products found', async () => {
      const mockSearchResponse = {
        products: null
      };

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockSearchResponse)
      });

      const products = await OpenFoodFactsService.searchProducts('inexistant');

      expect(products).toEqual([]);
    });

    test('should handle search API errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const products = await OpenFoodFactsService.searchProducts('test');

      expect(products).toEqual([]);
      expect(consoleMock.error).toHaveBeenCalledWith(
        'Erreur recherche produits:',
        expect.any(Error)
      );
    });

    test('should use default limit when not specified', async () => {
      const mockSearchResponse = { products: [] };

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve(mockSearchResponse)
      });

      await OpenFoodFactsService.searchProducts('test');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page_size=10')
      );
    });
  });

  describe('suggestIngredients', () => {
    test('should suggest ingredients from product', () => {
      const product: ProductInfo = {
        id: '123',
        name: 'Tomate Bio',
        category: 'légume',
        quantity: '500g',
        unit: 'g',
        ingredients: ['tomate', 'eau', 'sel'],
        confidence: 0.8
      };

      const suggestions = OpenFoodFactsService.suggestIngredients(product);

      expect(suggestions).toHaveLength(4); // produit + 3 ingrédients
      expect(suggestions[0]).toEqual({
        nom: 'Tomate Bio',
        quantite: 500,
        unite: 'g',
        categorie: 'légume'
      });
      expect(suggestions[1]).toEqual({
        nom: 'tomate',
        quantite: 0.1,
        unite: 'kg',
        categorie: 'autre'
      });
    });

    test('should handle product without ingredients', () => {
      const product: ProductInfo = {
        id: '123',
        name: 'Produit Simple',
        confidence: 0.8
      };

      const suggestions = OpenFoodFactsService.suggestIngredients(product);

      expect(suggestions).toHaveLength(1);
      expect(suggestions[0]).toEqual({
        nom: 'Produit Simple',
        quantite: 1,
        unite: 'pièce',
        categorie: 'autre'
      });
    });

    test('should handle product without quantity', () => {
      const product: ProductInfo = {
        id: '123',
        name: 'Produit Sans Quantité',
        confidence: 0.8
      };

      const suggestions = OpenFoodFactsService.suggestIngredients(product);

      expect(suggestions[0].quantite).toBe(1);
    });
  });

  describe('private methods via public interface', () => {
    describe('extractProductName', () => {
      test('should extract French product name when available', async () => {
        const mockApiResponse = {
          status: 1,
          product: {
            product_name_fr: 'Nom français',
            product_name: 'English name',
            generic_name: 'Generic'
          }
        };

        (fetch as jest.Mock).mockResolvedValue({
          json: () => Promise.resolve(mockApiResponse)
        });

        const product = await OpenFoodFactsService.getProductByBarcode('123');
        expect(product!.name).toBe('Nom français');
      });

      test('should fallback to generic name when specific names missing', async () => {
        const mockApiResponse = {
          status: 1,
          product: {
            generic_name: 'Nom générique'
          }
        };

        (fetch as jest.Mock).mockResolvedValue({
          json: () => Promise.resolve(mockApiResponse)
        });

        const product = await OpenFoodFactsService.getProductByBarcode('123');
        expect(product!.name).toBe('Nom générique');
      });

      test('should use default name when no name available', async () => {
        const mockApiResponse = {
          status: 1,
          product: {}
        };

        (fetch as jest.Mock).mockResolvedValue({
          json: () => Promise.resolve(mockApiResponse)
        });

        const product = await OpenFoodFactsService.getProductByBarcode('123');
        expect(product!.name).toBe('Produit inconnu');
      });
    });

    describe('mapCategory', () => {
      test('should map OpenFoodFacts categories to our categories', async () => {
        const mockApiResponse = {
          status: 1,
          product: {
            product_name: 'Test',
            categories_tags: ['en:vegetables', 'en:tomatoes']
          }
        };

        (fetch as jest.Mock).mockResolvedValue({
          json: () => Promise.resolve(mockApiResponse)
        });

        const product = await OpenFoodFactsService.getProductByBarcode('123');
        expect(product!.category).toBe('légume');
      });

      test('should return "autre" for unknown categories', async () => {
        const mockApiResponse = {
          status: 1,
          product: {
            product_name: 'Test',
            categories_tags: ['en:unknown-category']
          }
        };

        (fetch as jest.Mock).mockResolvedValue({
          json: () => Promise.resolve(mockApiResponse)
        });

        const product = await OpenFoodFactsService.getProductByBarcode('123');
        expect(product!.category).toBe('autre');
      });
    });

    describe('extractIngredients', () => {
      test('should extract and parse ingredients text', async () => {
        const mockApiResponse = {
          status: 1,
          product: {
            product_name: 'Test',
            ingredients_text: 'tomate, eau, sel, poivre, huile d\'olive'
          }
        };

        (fetch as jest.Mock).mockResolvedValue({
          json: () => Promise.resolve(mockApiResponse)
        });

        const product = await OpenFoodFactsService.getProductByBarcode('123');
        expect(product!.ingredients).toEqual([
          'tomate', 'eau', 'sel', 'poivre', 'huile d\'olive'
        ]);
      });

      test('should handle semicolon separators', async () => {
        const mockApiResponse = {
          status: 1,
          product: {
            product_name: 'Test',
            ingredients_text: 'tomate; eau; sel'
          }
        };

        (fetch as jest.Mock).mockResolvedValue({
          json: () => Promise.resolve(mockApiResponse)
        });

        const product = await OpenFoodFactsService.getProductByBarcode('123');
        expect(product!.ingredients).toEqual(['tomate', 'eau', 'sel']);
      });

      test('should limit to 10 ingredients', async () => {
        const longIngredientsList = Array.from({ length: 15 }, (_, i) => `ingredient${i + 1}`).join(', ');
        
        const mockApiResponse = {
          status: 1,
          product: {
            product_name: 'Test',
            ingredients_text: longIngredientsList
          }
        };

        (fetch as jest.Mock).mockResolvedValue({
          json: () => Promise.resolve(mockApiResponse)
        });

        const product = await OpenFoodFactsService.getProductByBarcode('123');
        expect(product!.ingredients).toHaveLength(10);
      });
    });

    describe('extractUnit', () => {
      test('should extract unit from quantity string', async () => {
        const testCases = [
          { quantity: '500g', expectedUnit: 'g' },
          { quantity: '1kg', expectedUnit: 'kg' },
          { quantity: '250ml', expectedUnit: 'ml' },
          { quantity: '1l', expectedUnit: 'l' },
          { quantity: '33cl', expectedUnit: 'l' }, // cl contient "l" donc extrait "l"
          { quantity: '6 pièces', expectedUnit: 'pièce' },
          { quantity: undefined, expectedUnit: 'pièce' }
        ];

        for (const testCase of testCases) {
          const mockApiResponse = {
            status: 1,
            product: {
              product_name: 'Test',
              quantity: testCase.quantity
            }
          };

          (fetch as jest.Mock).mockResolvedValue({
            json: () => Promise.resolve(mockApiResponse)
          });

          const product = await OpenFoodFactsService.getProductByBarcode('123');
          expect(product!.unit).toBe(testCase.expectedUnit);
        }
      });
    });
  });

  describe('test products', () => {
    test('should return all defined test products', async () => {
      const testCodes = [
        'test_banane',
        'test_yaourt', 
        'test_poulet',
        'test_carotte',
        'test_lait',
        'test_fromage'
      ];

      for (const code of testCodes) {
        const product = await OpenFoodFactsService.getProductByBarcode(code);
        expect(product).not.toBeNull();
        expect(product!.id).toBe(code);
        expect(product!.confidence).toBe(1.0);
        expect(product!.matchedIngredient).toBeDefined();
      }
    });

    test('should have correct quantities for test products', async () => {
      const expectedQuantities = {
        'test_banane': { quantity: 1000, unit: 'g' },
        'test_yaourt': { quantity: 4, unit: 'pot' },
        'test_poulet': { quantity: 500, unit: 'g' },
        'test_carotte': { quantity: 5, unit: 'pièce' },
        'test_lait': { quantity: 1000, unit: 'ml' },
        'test_fromage': { quantity: 200, unit: 'g' }
      };

      for (const [code, expected] of Object.entries(expectedQuantities)) {
        const product = await OpenFoodFactsService.getProductByBarcode(code);
        expect(product!.extractedQuantity).toBe(expected.quantity);
        expect(product!.unit).toBe(expected.unit);
      }
    });
  });
});
