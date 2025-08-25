// --- Types ingrédients (stock utilisateur) ---
export type IngredientCategorie =
  | 'légume'
  | 'fruit'
  | 'viande'
  | 'poisson'
  | 'féculent'
  | 'produit laitier'
  | 'épice'
  | 'autre';

export type ValeursNutritionnelles = {
  calories: number; // pour 100g ou unité
  proteines: number;
  glucides: number;
  lipides: number;
  fibres?: number;
};

export type Ingredient = {
  id: string; // identifiant unique (ex: "carotte")
  nom: string;
  categorie: IngredientCategorie;
  quantite?: number; // quantité possédée (optionnel)
  unite?: string; // ex: "g", "pièce", "L"
  // nutrition?: ValeursNutritionnelles;
};

// Exemple de base d'ingrédients structurés (pour suggestions, filtres, etc.)
export const ingredientsDeBase: Ingredient[] = [
  // === LÉGUMES ===
  { id: 'carotte', nom: 'Carotte', categorie: 'légume', unite: 'pièce' },
  { id: 'pomme-de-terre', nom: 'Pomme de terre', categorie: 'légume', unite: 'pièce' },
  { id: 'oignon', nom: 'Oignon', categorie: 'légume', unite: 'pièce' },
  { id: 'courgette', nom: 'Courgette', categorie: 'légume', unite: 'pièce' },
  { id: 'poireau', nom: 'Poireau', categorie: 'légume', unite: 'pièce' },
  { id: 'champignon', nom: 'Champignon', categorie: 'légume', unite: 'g' },
  { id: 'concombre', nom: 'Concombre', categorie: 'légume', unite: 'pièce' },
  { id: 'ail', nom: 'Ail', categorie: 'légume', unite: 'g' },
  { id: 'salade-verte', nom: 'Salade verte', categorie: 'légume', unite: 'g' },
  { id: 'tomate', nom: 'Tomate', categorie: 'légume', unite: 'pièce' },
  { id: 'mais', nom: 'Maïs', categorie: 'légume', unite: 'g' },
  { id: 'aubergine', nom: 'Aubergine', categorie: 'légume', unite: 'pièce' },
  { id: 'brocoli', nom: 'Brocoli', categorie: 'légume', unite: 'g' },
  { id: 'chou-fleur', nom: 'Chou-fleur', categorie: 'légume', unite: 'g' },
  { id: 'epinard', nom: 'Épinard', categorie: 'légume', unite: 'g' },
  { id: 'haricot-vert', nom: 'Haricot vert', categorie: 'légume', unite: 'g' },
  { id: 'petits-pois', nom: 'Petits pois', categorie: 'légume', unite: 'g' },
  { id: 'radis', nom: 'Radis', categorie: 'légume', unite: 'pièce' },
  { id: 'navet', nom: 'Navet', categorie: 'légume', unite: 'pièce' },
  { id: 'betterave', nom: 'Betterave', categorie: 'légume', unite: 'pièce' },
  { id: 'poivron', nom: 'Poivron', categorie: 'légume', unite: 'pièce' },

  // === FRUITS ===
  { id: 'citron', nom: 'Citron', categorie: 'fruit', unite: 'pièce' },
  { id: 'pomme', nom: 'Pomme', categorie: 'fruit', unite: 'pièce' },
  { id: 'fruits', nom: 'Fruits', categorie: 'fruit', unite: 'g' },
  { id: 'banane', nom: 'Banane', categorie: 'fruit', unite: 'pièce' },
  { id: 'orange', nom: 'Orange', categorie: 'fruit', unite: 'pièce' },
  { id: 'poire', nom: 'Poire', categorie: 'fruit', unite: 'pièce' },
  { id: 'fraise', nom: 'Fraise', categorie: 'fruit', unite: 'g' },
  { id: 'raisin', nom: 'Raisin', categorie: 'fruit', unite: 'g' },
  { id: 'avocat', nom: 'Avocat', categorie: 'fruit', unite: 'pièce' },

  // === VIANDES ===
  { id: 'poulet', nom: 'Poulet', categorie: 'viande', unite: 'g' },
  { id: 'jambon', nom: 'Jambon', categorie: 'viande', unite: 'g' },
  { id: 'lardons', nom: 'Lardons', categorie: 'viande', unite: 'g' },
  { id: 'boeuf', nom: 'Bœuf', categorie: 'viande', unite: 'g' },
  { id: 'porc', nom: 'Porc', categorie: 'viande', unite: 'g' },
  { id: 'agneau', nom: 'Agneau', categorie: 'viande', unite: 'g' },
  { id: 'saucisse', nom: 'Saucisse', categorie: 'viande', unite: 'pièce' },
  { id: 'jambon-blanc', nom: 'Jambon blanc', categorie: 'viande', unite: 'g' },

  // === POISSONS ===
  { id: 'saumon', nom: 'Saumon', categorie: 'poisson', unite: 'g' },
  { id: 'thon', nom: 'Thon', categorie: 'poisson', unite: 'g' },
  { id: 'truite', nom: 'Truite', categorie: 'poisson', unite: 'g' },
  { id: 'cabillaud', nom: 'Cabillaud', categorie: 'poisson', unite: 'g' },
  { id: 'sardine', nom: 'Sardine', categorie: 'poisson', unite: 'g' },
  { id: 'crevette', nom: 'Crevette', categorie: 'poisson', unite: 'g' },

  // === PRODUITS LAITIERS ===
  { id: 'lait', nom: 'Lait', categorie: 'produit laitier', unite: 'ml' },
  { id: 'beurre', nom: 'Beurre', categorie: 'produit laitier', unite: 'g' },
  { id: 'fromage', nom: 'Fromage', categorie: 'produit laitier', unite: 'g' },
  { id: 'yaourt', nom: 'Yaourt', categorie: 'produit laitier', unite: 'g' },
  { id: 'creme', nom: 'Crème', categorie: 'produit laitier', unite: 'ml' },
  { id: 'mozzarella', nom: 'Mozzarella', categorie: 'produit laitier', unite: 'g' },
  { id: 'parmesan', nom: 'Parmesan', categorie: 'produit laitier', unite: 'g' },
  { id: 'gruyere', nom: 'Gruyère', categorie: 'produit laitier', unite: 'g' },
  { id: 'creme-fraiche', nom: 'Crème fraîche', categorie: 'produit laitier', unite: 'g' },

  // === FÉCULENTS ===
  { id: 'farine', nom: 'Farine', categorie: 'féculent', unite: 'g' },
  { id: 'pates', nom: 'Pâtes', categorie: 'féculent', unite: 'g' },
  { id: 'riz', nom: 'Riz', categorie: 'féculent', unite: 'g' },
  { id: 'pain', nom: 'Pain', categorie: 'féculent', unite: 'g' },
  { id: 'pain-de-mie', nom: 'Pain de mie', categorie: 'féculent', unite: 'g' },
  { id: 'semoule', nom: 'Semoule', categorie: 'féculent', unite: 'g' },
  { id: 'pate-brisee', nom: 'Pâte brisée', categorie: 'féculent', unite: 'g' },
  { id: 'quinoa', nom: 'Quinoa', categorie: 'féculent', unite: 'g' },
  { id: 'avoine', nom: 'Avoine', categorie: 'féculent', unite: 'g' },
  { id: 'polenta', nom: 'Polenta', categorie: 'féculent', unite: 'g' },
  { id: 'lentille', nom: 'Lentille', categorie: 'féculent', unite: 'g' },
  { id: 'haricot-blanc', nom: 'Haricot blanc', categorie: 'féculent', unite: 'g' },
  { id: 'pois-chiche', nom: 'Pois chiche', categorie: 'féculent', unite: 'g' },
  { id: 'pate-a-pizza', nom: 'Pâte à pizza', categorie: 'féculent', unite: 'g' },

  // === ÉPICES & HERBES ===
  { id: 'persil', nom: 'Persil', categorie: 'épice', unite: 'g' },
  { id: 'herbes', nom: 'Herbes', categorie: 'épice', unite: 'g' },
  { id: 'menthe', nom: 'Menthe', categorie: 'épice', unite: 'g' },
  { id: 'sel', nom: 'Sel', categorie: 'épice', unite: 'g' },
  { id: 'poivre', nom: 'Poivre', categorie: 'épice', unite: 'g' },
  { id: 'thym', nom: 'Thym', categorie: 'épice', unite: 'g' },
  { id: 'romarin', nom: 'Romarin', categorie: 'épice', unite: 'g' },
  { id: 'basilic', nom: 'Basilic', categorie: 'épice', unite: 'g' },
  { id: 'oregano', nom: 'Orégano', categorie: 'épice', unite: 'g' },
  { id: 'paprika', nom: 'Paprika', categorie: 'épice', unite: 'g' },
  { id: 'cumin', nom: 'Cumin', categorie: 'épice', unite: 'g' },
  { id: 'curry', nom: 'Curry', categorie: 'épice', unite: 'g' },
  { id: 'cannelle', nom: 'Cannelle', categorie: 'épice', unite: 'g' },
  { id: 'aneth', nom: 'Aneth', categorie: 'épice', unite: 'g' },
  { id: 'herbes-de-provence', nom: 'Herbes de Provence', categorie: 'épice', unite: 'g' },
  { id: 'gingembre', nom: 'Gingembre', categorie: 'épice', unite: 'g' },

  // === AUTRES ===
  { id: 'huile', nom: 'Huile', categorie: 'autre', unite: 'ml' },
  { id: 'vinaigrette', nom: 'Vinaigrette', categorie: 'autre', unite: 'ml' },
  { id: 'eau', nom: 'Eau', categorie: 'autre', unite: 'L' },
  { id: 'sucre', nom: 'Sucre', categorie: 'autre', unite: 'g' },
  { id: 'confiture', nom: 'Confiture', categorie: 'autre', unite: 'g' },
  { id: 'miel', nom: 'Miel', categorie: 'autre', unite: 'g' },
  { id: 'oeuf', nom: 'Oeuf', categorie: 'autre', unite: 'pièce' },
  { id: 'levure', nom: 'Levure', categorie: 'autre', unite: 'g' },
  { id: 'vinaigre', nom: 'Vinaigre', categorie: 'autre', unite: 'ml' },
  { id: 'moutarde', nom: 'Moutarde', categorie: 'autre', unite: 'ml' },
  { id: 'ketchup', nom: 'Ketchup', categorie: 'autre', unite: 'ml' },
  { id: 'mayonnaise', nom: 'Mayonnaise', categorie: 'autre', unite: 'ml' },
  { id: 'chocolat', nom: 'Chocolat', categorie: 'autre', unite: 'g' },
  { id: 'cacao', nom: 'Cacao', categorie: 'autre', unite: 'g' },
  { id: 'cafe', nom: 'Café', categorie: 'autre', unite: 'g' },
  { id: 'the', nom: 'Thé', categorie: 'autre', unite: 'g' },
  { id: 'lait-de-coco', nom: 'Lait de coco', categorie: 'autre', unite: 'ml' },
  { id: 'salade-romaine', nom: 'Salade romaine', categorie: 'légume', unite: 'g' },
]

// Exemple de stock utilisateur (à stocker dans le localStorage ou Zustand)
// export const stockInitial: Ingredient[] = [ingredientsDeBase[0], ingredientsDeBase[1]];


export type RecetteIngredient = {
  ingredientId: string;
  quantite: number;
  unite: string;
};

export type Recette = {
  id: string;
  nom: string;
  ingredients: RecetteIngredient[];
  ingredientsOptionnels?: RecetteIngredient[];
  etapes: string[];
  instructions?: string; // (optionnel, pour compat)
  categorie?: string;
  tempsPreparation?: number; // en minutes
  tempsCuisson?: number; // en minutes
  image?: string; // url ou nom de sprite
  nutrition?: ValeursNutritionnelles; // total recette (à remplir dans chaque recette)
  tags: string[]; // régimes compatibles: ex: ['végétarien', 'sans gluten']
};

export const recettesDeBase: Recette[] = [
  {
    id: 'omelette',
    nom: 'Omelette nature',
    ingredients: [
      { ingredientId: 'oeuf', quantite: 3, unite: 'pièce' },
      { ingredientId: 'lait', quantite: 15, unite: 'ml' },
      { ingredientId: 'sel', quantite: 0.5, unite: 'g' },
      { ingredientId: 'poivre', quantite: 0.5, unite: 'g' },
      { ingredientId: 'beurre', quantite: 10, unite: 'g' },
    ],
    ingredientsOptionnels: [],
    etapes: [
      "Battre les œufs avec le lait, sel et poivre."
    ],
    categorie: 'Petit-déjeuner',
    tempsPreparation: 5,
    tempsCuisson: 5,
    nutrition: { calories: 320, proteines: 18, glucides: 2, lipides: 27 },
    tags: ['végétarien', 'sans gluten'],
  },
  {
    id: 'yaourt-fruits',
    nom: 'Yaourt aux fruits',
    ingredients: [
      { ingredientId: 'yaourt', quantite: 1, unite: 'g' },
      { ingredientId: 'fruits', quantite: 100, unite: 'g' },
    ],
    ingredientsOptionnels: [
      { ingredientId: 'miel', quantite: 1, unite: 'ml' }
    ],
    etapes: [
      "Couper les fruits.",
      "Mélanger avec le yaourt.",
      "Sucrer si besoin."
    ],
    categorie: 'Dessert',
    tempsPreparation: 3,
    nutrition: { calories: 120, proteines: 4, glucides: 20, lipides: 2, fibres: 2 },
    tags: ['végétarien', 'sans gluten'],
  },
  {
    id: 'gratin-dauphinois',
    nom: 'Gratin dauphinois',
    ingredients: [
      { ingredientId: 'pomme-de-terre', quantite: 1000, unite: 'g' },
      { ingredientId: 'creme', quantite: 200, unite: 'ml' },
      { ingredientId: 'lait', quantite: 200, unite: 'ml' },
      { ingredientId: 'ail', quantite: 1, unite: 'g' },
      { ingredientId: 'sel', quantite: 1, unite: 'g' },
      { ingredientId: 'poivre', quantite: 1, unite: 'g' },
      { ingredientId: 'beurre', quantite: 20, unite: 'g' },
    ],
    etapes: [
      "Éplucher et couper les pommes de terre.",
      "Disposer dans un plat, ajouter crème/lait/ail.",
      "Cuire 1h à 180°C."
    ],
    categorie: 'Dîner',
    tempsPreparation: 20,
    tempsCuisson: 60,
    nutrition: { calories: 650, proteines: 13, glucides: 110, lipides: 18, fibres: 7 },
    tags: ['végétarien', 'sans gluten'],
  },
  {
    id: 'quiche-lorraine',
    nom: 'Quiche Lorraine',
    ingredients: [
      { ingredientId: 'pate-brisee', quantite: 230, unite: 'g' },
      { ingredientId: 'lardons', quantite: 200, unite: 'g' },
      { ingredientId: 'oeuf', quantite: 3, unite: 'pièce' },
      { ingredientId: 'creme', quantite: 200, unite: 'ml' },
      { ingredientId: 'lait', quantite: 100, unite: 'ml' },
      { ingredientId: 'fromage', quantite: 100, unite: 'g' },
      { ingredientId: 'poivre', quantite: 1, unite: 'g' },
      { ingredientId: 'sel', quantite: 1, unite: 'g' },
    ],
    etapes: [
      "Préchauffer le four à 180°C.",
      "Étaler la pâte dans un moule.",
      "Répartir les lardons, mélanger œufs, crème, lait, assaisonner.",
      "Verser sur la pâte, parsemer de fromage.",
      "Cuire 35 min."
    ],
    categorie: 'Déjeuner',
    tempsPreparation: 15,
    tempsCuisson: 35,
    nutrition: { calories: 520, proteines: 20, glucides: 32, lipides: 36, fibres: 2 },
    tags: ['classique'],
  },
  {
    id: 'poelee-campagnarde',
    nom: 'Poêlée campagnarde',
    ingredients: [
      { ingredientId: 'pomme-de-terre', quantite: 500, unite: 'g' },
      { ingredientId: 'lardons', quantite: 100, unite: 'g' },
      { ingredientId: 'oignon', quantite: 1, unite: 'pièce' },
      { ingredientId: 'champignon', quantite: 150, unite: 'g' },
      { ingredientId: 'huile', quantite: 1, unite: 'ml' },
      { ingredientId: 'persil', quantite: 1, unite: 'g' },
      { ingredientId: 'sel', quantite: 1, unite: 'g' },
      { ingredientId: 'poivre', quantite: 1, unite: 'g' },
    ],
    etapes: [
      "Éplucher et couper les pommes de terre.",
      "Faire revenir l’oignon, ajouter les lardons et champignons.",
      "Ajouter les pommes de terre, cuire 20 min.",
      "Assaisonner et parsemer de persil."
    ],
    categorie: 'Dîner',
    tempsPreparation: 15,
    tempsCuisson: 20,
    nutrition: { calories: 410, proteines: 11, glucides: 60, lipides: 13, fibres: 6 },
    tags: ['classique'],
  },
  {
    id: 'crepes',
    nom: 'Crêpes',
    ingredients: [
      { ingredientId: 'farine', quantite: 250, unite: 'g' },
      { ingredientId: 'oeuf', quantite: 3, unite: 'pièce' },
      { ingredientId: 'lait', quantite: 500, unite: 'ml' },
      { ingredientId: 'sucre', quantite: 2, unite: 'ml' },
      { ingredientId: 'beurre', quantite: 50, unite: 'g' },
      { ingredientId: 'sel', quantite: 1, unite: 'g' },
    ],
    etapes: [
      "Mélanger farine, œufs, sucre, sel.",
      "Ajouter le lait progressivement.",
      "Laisser reposer 30 min.",
      "Cuire les crêpes dans une poêle beurrée."
    ],
    categorie: 'Dessert',
    tempsPreparation: 10,
    tempsCuisson: 20,
    nutrition: { calories: 320, proteines: 10, glucides: 48, lipides: 8, fibres: 2 },
    tags: ['végétarien', 'classique'],
  },
  {
    id: 'taboule',
    nom: 'Taboulé',
    ingredients: [
      { ingredientId: 'semoule', quantite: 200, unite: 'g' },
      { ingredientId: 'tomate', quantite: 2, unite: 'pièce' },
      { ingredientId: 'concombre', quantite: 0.5, unite: 'pièce' },
      { ingredientId: 'oignon', quantite: 0.5, unite: 'pièce' },
      { ingredientId: 'menthe', quantite: 1, unite: 'g' },
      { ingredientId: 'huile', quantite: 2, unite: 'ml' },
      { ingredientId: 'citron', quantite: 1, unite: 'pièce' },
      { ingredientId: 'sel', quantite: 1, unite: 'g' },
      { ingredientId: 'poivre', quantite: 1, unite: 'g' },
    ],
    etapes: [
      "Préparer la semoule.",
      "Couper les légumes en petits dés.",
      "Mélanger tous les ingrédients, laisser reposer au frais."
    ],
    categorie: 'Déjeuner',
    tempsPreparation: 15,
    tempsCuisson: 0,
    nutrition: { calories: 260, proteines: 7, glucides: 48, lipides: 4, fibres: 4 },
    tags: ['végétarien', 'léger'],
  }
  ,
  {
    id: 'salade-composee',
    nom: 'Salade composée',
    ingredients: [
      { ingredientId: 'salade-verte', quantite: 100, unite: 'g' },
      { ingredientId: 'tomate', quantite: 2, unite: 'pièce' },
      { ingredientId: 'vinaigrette', quantite: 2, unite: 'ml' },
    ],
    ingredientsOptionnels: [
      { ingredientId: 'mais', quantite: 50, unite: 'g' },
      { ingredientId: 'oeuf', quantite: 1, unite: 'pièce' },
      { ingredientId: 'thon', quantite: 50, unite: 'g' },
    ],
    etapes: [
      "Laver et couper les ingrédients.",
      "Assembler dans un saladier.",
      "Ajouter la vinaigrette."
    ],
    categorie: 'Dîner',
    tempsPreparation: 10,
    tempsCuisson: 0,
    nutrition: { calories: 180, proteines: 4, glucides: 10, lipides: 13, fibres: 3 },
    tags: ['végétarien'],
  },
  {
    id: 'gateau-yaourt',
    nom: 'Gâteau au yaourt',
    ingredients: [
      { ingredientId: 'yaourt', quantite: 1, unite: 'g' },
      { ingredientId: 'sucre', quantite: 2, unite: 'g' },
      { ingredientId: 'farine', quantite: 3, unite: 'g' },
      { ingredientId: 'huile', quantite: 0.5, unite: 'g' },
      { ingredientId: 'oeuf', quantite: 3, unite: 'pièce' },
      { ingredientId: 'levure', quantite: 1, unite: 'sachet' },
    ],
    etapes: [
      "Mélanger tous les ingrédients.",
      "Verser dans un moule.",
      "Cuire 30 min à 180°C."
    ],
    categorie: 'Dessert',
    tempsPreparation: 10,
    tempsCuisson: 30,
    nutrition: { calories: 320, proteines: 7, glucides: 50, lipides: 10, fibres: 1 },
    tags: ['végétarien'],
  },
  {
    id: 'soupe-legumes',
    nom: 'Soupe de légumes',
    ingredients: [
      { ingredientId: 'carotte', quantite: 2, unite: 'pièce' },
      { ingredientId: 'pomme-de-terre', quantite: 1, unite: 'pièce' },
      { ingredientId: 'poireau', quantite: 1, unite: 'pièce' },
      { ingredientId: 'oignon', quantite: 1, unite: 'pièce' },
      { ingredientId: 'eau', quantite: 1, unite: 'L' },
      { ingredientId: 'sel', quantite: 1, unite: 'g' },
      { ingredientId: 'poivre', quantite: 1, unite: 'g' },
    ],
    etapes: [
      "Éplucher et couper les légumes.",
      "Cuire dans l’eau 20 min.",
      "Mixer, assaisonner."
    ],
    categorie: 'Dîner',
    tempsPreparation: 10,
    tempsCuisson: 20,
    nutrition: { calories: 110, proteines: 3, glucides: 22, lipides: 1, fibres: 5 },
    tags: ['végétalien', 'végétarien', 'sans gluten'],
  },
  {
    id: 'croque-monsieur',
    nom: 'Croque-monsieur',
    ingredients: [
      { ingredientId: 'pain-de-mie', quantite: 2, unite: 'tranche' },
      { ingredientId: 'jambon', quantite: 1, unite: 'tranche' },
      { ingredientId: 'fromage', quantite: 1, unite: 'tranche' },
      { ingredientId: 'beurre', quantite: 10, unite: 'g' },
    ],
    etapes: [
      "Beurrer le pain.",
      "Garnir de jambon et fromage, refermer.",
      "Cuire à la poêle ou appareil à croque."
    ],
    categorie: 'Dîner',
    tempsPreparation: 5,
    tempsCuisson: 5,
    nutrition: { calories: 370, proteines: 18, glucides: 32, lipides: 18, fibres: 2 },
    tags: ['contient-gluten', 'contient-lactose', 'contient-viande'],
  },
  {
    id: 'pates-tomate',
    nom: 'Pâtes à la sauce tomate',
    ingredients: [
      { ingredientId: 'pates', quantite: 200, unite: 'g' },
      { ingredientId: 'tomate', quantite: 400, unite: 'g' },
      { ingredientId: 'oignon', quantite: 1, unite: 'pièce' },
      { ingredientId: 'huile', quantite: 1, unite: 'ml' },
      { ingredientId: 'sel', quantite: 1, unite: 'g' },
      { ingredientId: 'poivre', quantite: 1, unite: 'g' },
    ],
    ingredientsOptionnels: [
      { ingredientId: 'herbes', quantite: 1, unite: 'g' }
    ],
    etapes: [
      "Cuire les pâtes.",
      "Faire revenir l’oignon, ajouter les tomates, assaisonner, mijoter 10 min.",
      "Mélanger avec les pâtes."
    ],
    categorie: 'Déjeuner',
    tempsPreparation: 10,
    tempsCuisson: 15,
    nutrition: { calories: 520, proteines: 15, glucides: 100, lipides: 7, fibres: 7 },
    tags: ['végétarien'],
  },
  {
    id: 'riz-legumes',
    nom: 'Riz aux légumes',
    ingredients: [
      { ingredientId: 'riz', quantite: 150, unite: 'g' },
      { ingredientId: 'carotte', quantite: 1, unite: 'pièce' },
      { ingredientId: 'courgette', quantite: 1, unite: 'pièce' },
      { ingredientId: 'oignon', quantite: 1, unite: 'pièce' },
      { ingredientId: 'huile', quantite: 1, unite: 'ml' },
      { ingredientId: 'sel', quantite: 1, unite: 'g' },
      { ingredientId: 'poivre', quantite: 1, unite: 'g' },
    ],
    etapes: [
      "Cuire le riz.",
      "Émincer les légumes.",
      "Faire revenir les légumes dans l'huile.",
      "Ajouter le riz, assaisonner et servir chaud."
    ],
    categorie: 'Déjeuner',
    tempsPreparation: 10,
    tempsCuisson: 15,
    nutrition: { calories: 390, proteines: 7, glucides: 80, lipides: 4, fibres: 5 },
    tags: ['végétalien', 'végétarien', 'sans gluten'],
  },
  {
    id: 'tartines',
    nom: 'Tartines beurre-confiture',
    ingredients: [
      { ingredientId: 'pain', quantite: 2, unite: 'tranche' },
      { ingredientId: 'beurre', quantite: 10, unite: 'g' },
    ],
    ingredientsOptionnels: [
      { ingredientId: 'confiture', quantite: 20, unite: 'g' }
    ],
    etapes: [
      "Tartiner le pain de beurre puis de confiture."
    ],
    categorie: 'Petit-déjeuner',
    tempsPreparation: 2,
    tempsCuisson: 0,
    nutrition: { calories: 180, proteines: 4, glucides: 28, lipides: 6, fibres: 1 },
    tags: ['végétarien'],
  },
  {
    id: 'pizza-margherita',
    nom: 'Pizza Margherita',
    ingredients: [
      { ingredientId: 'pate-a-pizza', quantite: 280, unite: 'g' },
      { ingredientId: 'tomate', quantite: 3, unite: 'pièce' },
      { ingredientId: 'mozzarella', quantite: 250, unite: 'g' },
      { ingredientId: 'basilic', quantite: 1, unite: 'g' },
      { ingredientId: 'huile', quantite: 2, unite: 'ml' },
      { ingredientId: 'sel', quantite: 1, unite: 'g' },
    ],
    etapes: [
      "Préchauffez le four à 250°C.",
      "Étalez la pâte sur une plaque huilée.",
      "Écrasez les tomates et étalez sur la pâte.",
      "Ajoutez la mozzarella en morceaux.",
      "Enfournez 12-15 minutes jusqu'à ce que les bords soient dorés.",
      "Parsemez de basilic frais avant de servir."
    ],
    categorie: 'Dîner',
    tempsPreparation: 15,
    tempsCuisson: 15,
    nutrition: { calories: 620, proteines: 28, glucides: 65, lipides: 25, fibres: 4 },
    tags: ['végétarien'],
  },
  {
    id: 'curry-legumes',
    nom: 'Curry de légumes',
    ingredients: [
      { ingredientId: 'aubergine', quantite: 1, unite: 'pièce' },
      { ingredientId: 'courgette', quantite: 1, unite: 'pièce' },
      { ingredientId: 'carotte', quantite: 2, unite: 'pièce' },
      { ingredientId: 'pois-chiche', quantite: 200, unite: 'g' },
      { ingredientId: 'lait-de-coco', quantite: 400, unite: 'ml' },
      { ingredientId: 'curry', quantite: 2, unite: 'g' },
      { ingredientId: 'ail', quantite: 2, unite: 'g' },
      { ingredientId: 'gingembre', quantite: 1, unite: 'g' },
      { ingredientId: 'oignon', quantite: 1, unite: 'pièce' },
      { ingredientId: 'huile', quantite: 2, unite: 'ml' },
    ],
    etapes: [
      "Coupez tous les légumes en cubes moyens.",
      "Faites revenir l'oignon, l'ail et le gingembre dans l'huile.",
      "Ajoutez le curry en poudre et faites griller 1 minute.",
      "Incorporez les légumes et les pois chiches égouttés.",
      "Versez le lait de coco et laissez mijoter 25 minutes.",
      "Servez avec du riz basmati."
    ],
    categorie: 'Dîner',
    tempsPreparation: 20,
    tempsCuisson: 30,
    nutrition: { calories: 480, proteines: 18, glucides: 45, lipides: 28, fibres: 12 },
    tags: ['végétalien', 'végétarien', 'sans gluten'],
  },
  {
    id: 'risotto-champignons',
    nom: 'Risotto aux champignons',
    ingredients: [
      { ingredientId: 'riz', quantite: 300, unite: 'g' },
      { ingredientId: 'champignon', quantite: 400, unite: 'g' },
      { ingredientId: 'oignon', quantite: 1, unite: 'pièce' },
      { ingredientId: 'ail', quantite: 2, unite: 'g' },
      { ingredientId: 'parmesan', quantite: 80, unite: 'g' },
      { ingredientId: 'beurre', quantite: 50, unite: 'g' },
      { ingredientId: 'huile', quantite: 2, unite: 'ml' },
      { ingredientId: 'eau', quantite: 1, unite: 'L' },
    ],
    etapes: [
      "Préparez un bouillon chaud avec l'eau.",
      "Émincez les champignons et l'oignon finement.",
      "Faites revenir l'oignon dans l'huile jusqu'à transparence.",
      "Ajoutez le riz et nacrez 2 minutes en remuant.",
      "Ajoutez le bouillon louche par louche en remuant constamment.",
      "Incorporez les champignons à mi-cuisson.",
      "Terminez avec le beurre et le parmesan râpé."
    ],
    categorie: 'Dîner',
    tempsPreparation: 15,
    tempsCuisson: 35,
    nutrition: { calories: 520, proteines: 16, glucides: 75, lipides: 18, fibres: 4 },
    tags: ['végétarien'],
  },
  {
    id: 'ratatouille',
    nom: 'Ratatouille provençale',
    ingredients: [
      { ingredientId: 'aubergine', quantite: 1, unite: 'pièce' },
      { ingredientId: 'courgette', quantite: 2, unite: 'pièce' },
      { ingredientId: 'tomate', quantite: 4, unite: 'pièce' },
      { ingredientId: 'poivron', quantite: 2, unite: 'pièce' },
      { ingredientId: 'oignon', quantite: 1, unite: 'pièce' },
      { ingredientId: 'ail', quantite: 3, unite: 'g' },
      { ingredientId: 'huile', quantite: 4, unite: 'ml' },
      { ingredientId: 'herbes-de-provence', quantite: 1, unite: 'g' },
      { ingredientId: 'sel', quantite: 1, unite: 'g' },
      { ingredientId: 'poivre', quantite: 1, unite: 'g' },
    ],
    etapes: [
      "Coupez tous les légumes en dés réguliers.",
      "Faites revenir l'oignon et l'ail dans l'huile.",
      "Ajoutez les aubergines, laissez cuire 5 minutes.",
      "Incorporez courgettes et poivrons, mélangez.",
      "Ajoutez les tomates et les herbes de Provence.",
      "Laissez mijoter 30 minutes à feu doux en remuant.",
      "Rectifiez l'assaisonnement avant de servir."
    ],
    categorie: 'Dîner',
    tempsPreparation: 25,
    tempsCuisson: 40,
    nutrition: { calories: 220, proteines: 6, glucides: 28, lipides: 12, fibres: 8 },
    tags: ['végétalien', 'végétarien', 'sans gluten'],
  },
  {
    id: 'salade-cesar',
    nom: 'Salade César au poulet',
    ingredients: [
      { ingredientId: 'salade-romaine', quantite: 200, unite: 'g' },
      { ingredientId: 'poulet', quantite: 300, unite: 'g' },
      { ingredientId: 'parmesan', quantite: 50, unite: 'g' },
      { ingredientId: 'pain', quantite: 4, unite: 'tranche' },
      { ingredientId: 'oeuf', quantite: 1, unite: 'pièce' },
      { ingredientId: 'ail', quantite: 1, unite: 'g' },
      { ingredientId: 'mayonnaise', quantite: 3, unite: 'ml' },
      { ingredientId: 'citron', quantite: 1, unite: 'pièce' },
      { ingredientId: 'huile', quantite: 2, unite: 'ml' },
    ],
    etapes: [
      "Faites griller le poulet et coupez-le en lamelles.",
      "Préparez des croûtons en grillant le pain coupé en cubes.",
      "Lavez et coupez la salade romaine.",
      "Préparez la sauce : mélangez mayo, ail écrasé, jus de citron.",
      "Faites cuire l'œuf dur et hachez-le grossièrement.",
      "Mélangez salade, poulet, croûtons dans un grand saladier.",
      "Assaisonnez avec la sauce et parsemez de parmesan."
    ],
    categorie: 'Déjeuner',
    tempsPreparation: 20,
    tempsCuisson: 15,
    nutrition: { calories: 580, proteines: 42, glucides: 18, lipides: 38, fibres: 3 },
    tags: ['contient-gluten'],
  },
  {
    id: 'saumon-teriyaki',
    nom: 'Saumon teriyaki',
    ingredients: [
      { ingredientId: 'saumon', quantite: 600, unite: 'g' },
      { ingredientId: 'riz', quantite: 200, unite: 'g' },
      { ingredientId: 'brocoli', quantite: 300, unite: 'g' },
      { ingredientId: 'miel', quantite: 2, unite: 'ml' },
      { ingredientId: 'gingembre', quantite: 1, unite: 'g' },
      { ingredientId: 'ail', quantite: 2, unite: 'g' },
      { ingredientId: 'huile', quantite: 2, unite: 'ml' },
    ],
    etapes: [
      "Préparez la sauce teriyaki avec miel, gingembre et ail.",
      "Faites cuire le riz selon les instructions.",
      "Faites cuire le brocoli à la vapeur 8 minutes.",
      "Saisissez le saumon dans une poêle huilée 4 min par face.",
      "Glacez le saumon avec la sauce teriyaki.",
      "Servez le saumon avec le riz et les brocolis."
    ],
    categorie: 'Dîner',
    tempsPreparation: 15,
    tempsCuisson: 25,
    nutrition: { calories: 650, proteines: 48, glucides: 52, lipides: 26, fibres: 5 },
    tags: ['sans gluten'],
  }
];
