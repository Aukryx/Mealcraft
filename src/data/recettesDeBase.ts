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
  { id: 'carotte', nom: 'Carotte', categorie: 'légume', unite: 'pièce' },
  { id: 'pomme-de-terre', nom: 'Pomme de terre', categorie: 'légume', unite: 'pièce' },
  { id: 'oignon', nom: 'Oignon', categorie: 'légume', unite: 'pièce' },
  { id: 'poulet', nom: 'Poulet', categorie: 'viande', unite: 'g' },
  { id: 'saumon', nom: 'Saumon', categorie: 'poisson', unite: 'g' },
  { id: 'lait', nom: 'Lait', categorie: 'produit laitier', unite: 'L' },
  { id: 'riz', nom: 'Riz', categorie: 'féculent', unite: 'g' },
  { id: 'pomme', nom: 'Pomme', categorie: 'fruit', unite: 'pièce' },
  { id: 'beurre', nom: 'Beurre', categorie: 'produit laitier', unite: 'g' },
  { id: 'sel', nom: 'Sel', categorie: 'épice', unite: 'g' },
  { id: 'poivre', nom: 'Poivre', categorie: 'épice', unite: 'g' },
  // ... à compléter selon besoins
];

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
};

export const recettesDeBase: Recette[] = [
  {
    id: 'omelette',
    nom: 'Omelette nature',
    ingredients: [
      { ingredientId: 'oeuf', quantite: 3, unite: 'pièce' },
      { ingredientId: 'lait', quantite: 1, unite: 'càs' },
      { ingredientId: 'sel', quantite: 1, unite: 'pincée' },
      { ingredientId: 'poivre', quantite: 1, unite: 'pincée' },
      { ingredientId: 'beurre', quantite: 10, unite: 'g' },
    ],
    ingredientsOptionnels: [],
    etapes: [
      "Battre les œufs avec le lait, sel et poivre.",
      "Faire fondre le beurre dans une poêle.",
      "Verser les œufs battus, cuire à feu doux en repliant l’omelette."
    ],
    categorie: 'Petit-déjeuner',
    tempsPreparation: 5,
    tempsCuisson: 5,
    nutrition: { calories: 320, proteines: 18, glucides: 2, lipides: 27 },
  },
  {
    id: 'pates-tomate',
    nom: 'Pâtes à la sauce tomate',
    ingredients: [
      { ingredientId: 'pates', quantite: 200, unite: 'g' },
      { ingredientId: 'tomate', quantite: 400, unite: 'g' },
      { ingredientId: 'oignon', quantite: 1, unite: 'pièce' },
      { ingredientId: 'huile', quantite: 1, unite: 'càs' },
      { ingredientId: 'sel', quantite: 1, unite: 'pincée' },
      { ingredientId: 'poivre', quantite: 1, unite: 'pincée' },
    ],
    ingredientsOptionnels: [
      { ingredientId: 'herbes', quantite: 1, unite: 'pincée' }
    ],
    etapes: [
      "Cuire les pâtes.",
      "Faire revenir l’oignon, ajouter les tomates, assaisonner, mijoter 10 min.",
      "Mélanger avec les pâtes."
    ],
    categorie: 'Repas',
    tempsPreparation: 10,
    tempsCuisson: 15,
    nutrition: { calories: 520, proteines: 15, glucides: 100, lipides: 7, fibres: 7 },
  },
  {
    id: 'riz-legumes',
    nom: 'Riz aux légumes',
    ingredients: [
      { ingredientId: 'riz', quantite: 150, unite: 'g' },
      { ingredientId: 'carotte', quantite: 1, unite: 'pièce' },
      { ingredientId: 'courgette', quantite: 1, unite: 'pièce' },
      { ingredientId: 'oignon', quantite: 1, unite: 'pièce' },
      { ingredientId: 'huile', quantite: 1, unite: 'càs' },
      { ingredientId: 'sel', quantite: 1, unite: 'pincée' },
      { ingredientId: 'poivre', quantite: 1, unite: 'pincée' },
    ],
    etapes: [
      "Cuire le riz.",
      "Émincer les légumes.",
      "Faire revenir les légumes dans l'huile.",
      "Ajouter le riz, assaisonner et servir chaud."
    ],
    categorie: 'Repas',
    tempsPreparation: 10,
    tempsCuisson: 15,
    nutrition: { calories: 390, proteines: 7, glucides: 80, lipides: 4, fibres: 5 },
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
    categorie: 'Repas',
    tempsPreparation: 5,
    tempsCuisson: 5,
    nutrition: { calories: 370, proteines: 18, glucides: 32, lipides: 18 },
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
      { ingredientId: 'sel', quantite: 1, unite: 'pincée' },
      { ingredientId: 'poivre', quantite: 1, unite: 'pincée' },
    ],
    etapes: [
      "Éplucher et couper les légumes.",
      "Cuire dans l’eau 20 min.",
      "Mixer, assaisonner."
    ],
    categorie: 'Repas',
    tempsPreparation: 10,
    tempsCuisson: 20,
    nutrition: { calories: 110, proteines: 3, glucides: 22, lipides: 1, fibres: 5 },
  },
  {
    id: 'salade-composee',
    nom: 'Salade composée',
    ingredients: [
      { ingredientId: 'salade-verte', quantite: 100, unite: 'g' },
      { ingredientId: 'tomate', quantite: 2, unite: 'pièce' },
      { ingredientId: 'vinaigrette', quantite: 2, unite: 'càs' },
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
    categorie: 'Repas',
    tempsPreparation: 10,
    nutrition: { calories: 180, proteines: 4, glucides: 10, lipides: 13, fibres: 3 },
  },
  {
    id: 'gratin-dauphinois',
    nom: 'Gratin dauphinois',
    ingredients: [
      { ingredientId: 'pomme-de-terre', quantite: 1000, unite: 'g' },
      { ingredientId: 'creme', quantite: 200, unite: 'ml' },
      { ingredientId: 'lait', quantite: 200, unite: 'ml' },
      { ingredientId: 'ail', quantite: 1, unite: 'gousse' },
      { ingredientId: 'sel', quantite: 1, unite: 'pincée' },
      { ingredientId: 'poivre', quantite: 1, unite: 'pincée' },
      { ingredientId: 'beurre', quantite: 20, unite: 'g' },
    ],
    etapes: [
      "Éplucher et couper les pommes de terre.",
      "Disposer dans un plat, ajouter crème/lait/ail.",
      "Cuire 1h à 180°C."
    ],
    categorie: 'Repas',
    tempsPreparation: 20,
    tempsCuisson: 60,
    nutrition: { calories: 650, proteines: 13, glucides: 110, lipides: 18, fibres: 7 },
  },
  {
    id: 'gateau-yaourt',
    nom: 'Gâteau au yaourt',
    ingredients: [
      { ingredientId: 'yaourt', quantite: 1, unite: 'pot' },
      { ingredientId: 'sucre', quantite: 2, unite: 'pot' },
      { ingredientId: 'farine', quantite: 3, unite: 'pot' },
      { ingredientId: 'huile', quantite: 0.5, unite: 'pot' },
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
    nutrition: { calories: 320, proteines: 7, glucides: 50, lipides: 10 },
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
    nutrition: { calories: 180, proteines: 4, glucides: 28, lipides: 6 },
  },
  {
    id: 'yaourt-fruits',
    nom: 'Yaourt aux fruits',
    ingredients: [
      { ingredientId: 'yaourt', quantite: 1, unite: 'pot' },
      { ingredientId: 'fruits', quantite: 100, unite: 'g' },
    ],
    ingredientsOptionnels: [
      { ingredientId: 'miel', quantite: 1, unite: 'càs' }
    ],
    etapes: [
      "Couper les fruits.",
      "Mélanger avec le yaourt.",
      "Sucrer si besoin."
    ],
    categorie: 'Dessert',
    tempsPreparation: 3,
    nutrition: { calories: 120, proteines: 4, glucides: 20, lipides: 2, fibres: 2 },
  },
  // Recettes supplémentaires
  {
    id: 'quiche-lorraine',
    nom: 'Quiche Lorraine',
    ingredients: [
      { ingredientId: 'pate-brisee', quantite: 1, unite: 'rouleau' },
      { ingredientId: 'lardons', quantite: 200, unite: 'g' },
      { ingredientId: 'oeuf', quantite: 3, unite: 'pièce' },
      { ingredientId: 'creme', quantite: 200, unite: 'ml' },
      { ingredientId: 'lait', quantite: 100, unite: 'ml' },
      { ingredientId: 'fromage', quantite: 100, unite: 'g' },
      { ingredientId: 'poivre', quantite: 1, unite: 'pincée' },
      { ingredientId: 'sel', quantite: 1, unite: 'pincée' },
    ],
    etapes: [
      "Préchauffer le four à 180°C.",
      "Étaler la pâte dans un moule.",
      "Répartir les lardons, mélanger œufs, crème, lait, assaisonner.",
      "Verser sur la pâte, parsemer de fromage.",
      "Cuire 35 min."
    ],
    categorie: 'Repas',
    tempsPreparation: 15,
    tempsCuisson: 35,
    nutrition: { calories: 520, proteines: 20, glucides: 32, lipides: 36 },
  },
  {
    id: 'poelee-campagnarde',
    nom: 'Poêlée campagnarde',
    ingredients: [
      { ingredientId: 'pomme-de-terre', quantite: 500, unite: 'g' },
      { ingredientId: 'lardons', quantite: 100, unite: 'g' },
      { ingredientId: 'oignon', quantite: 1, unite: 'pièce' },
      { ingredientId: 'champignon', quantite: 150, unite: 'g' },
      { ingredientId: 'huile', quantite: 1, unite: 'càs' },
      { ingredientId: 'persil', quantite: 1, unite: 'pincée' },
      { ingredientId: 'sel', quantite: 1, unite: 'pincée' },
      { ingredientId: 'poivre', quantite: 1, unite: 'pincée' },
    ],
    etapes: [
      "Éplucher et couper les pommes de terre.",
      "Faire revenir l’oignon, ajouter les lardons et champignons.",
      "Ajouter les pommes de terre, cuire 20 min.",
      "Assaisonner et parsemer de persil."
    ],
    categorie: 'Repas',
    tempsPreparation: 15,
    tempsCuisson: 20,
    nutrition: { calories: 410, proteines: 11, glucides: 60, lipides: 13, fibres: 6 },
  },
  {
    id: 'crepes',
    nom: 'Crêpes',
    ingredients: [
      { ingredientId: 'farine', quantite: 250, unite: 'g' },
      { ingredientId: 'oeuf', quantite: 3, unite: 'pièce' },
      { ingredientId: 'lait', quantite: 500, unite: 'ml' },
      { ingredientId: 'sucre', quantite: 2, unite: 'càs' },
      { ingredientId: 'beurre', quantite: 50, unite: 'g' },
      { ingredientId: 'sel', quantite: 1, unite: 'pincée' },
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
    nutrition: { calories: 320, proteines: 10, glucides: 48, lipides: 8 },
  },
  {
    id: 'taboule',
    nom: 'Taboulé',
    ingredients: [
      { ingredientId: 'semoule', quantite: 200, unite: 'g' },
      { ingredientId: 'tomate', quantite: 2, unite: 'pièce' },
      { ingredientId: 'concombre', quantite: 0.5, unite: 'pièce' },
      { ingredientId: 'oignon', quantite: 0.5, unite: 'pièce' },
      { ingredientId: 'menthe', quantite: 1, unite: 'pincée' },
      { ingredientId: 'huile', quantite: 2, unite: 'càs' },
      { ingredientId: 'citron', quantite: 1, unite: 'pièce' },
      { ingredientId: 'sel', quantite: 1, unite: 'pincée' },
      { ingredientId: 'poivre', quantite: 1, unite: 'pincée' },
    ],
    etapes: [
      "Préparer la semoule.",
      "Couper les légumes en petits dés.",
      "Mélanger tous les ingrédients, laisser reposer au frais."
    ],
    categorie: 'Repas',
    tempsPreparation: 15,
    tempsCuisson: 0,
    nutrition: { calories: 260, proteines: 7, glucides: 48, lipides: 4, fibres: 4 },
  },
];
