// Types centralisés pour l'application
export type ConsommationMode = 'simulation' | 'reel' | 'planification';

export type UserSettings = {
  consommationMode: ConsommationMode;
  portionsParDefaut: number;
  alertesStock: boolean;
  planificationAutomatique: boolean;
  modeNuit: boolean;
  difficultePreferee: 'facile' | 'moyen' | 'difficile' | null;
  regimesAlimentaires: string[];
  allergies: string[];
  tempsCuissonMax: number | null;
  budgetMoyen: number | null;
};

export type InteractiveObject = 'calendar' | 'cookbook' | 'fridge' | 'pantry' | 'cooking' | null;

export type CookingSession = {
  recetteId: string;
  portions: number;
  etapeActuelle: number;
  tempsDebut: Date;
  tempsPause?: number;
  ingredientsUtilises: boolean;
  notes?: string;
};

export type Achievement = {
  id: string;
  nom: string;
  description: string;
  icone: string;
  obtenu: boolean;
  dateObtention?: Date;
  progression?: number;
  maxProgression?: number;
};

export type Statistics = {
  recettesRealisees: number;
  tempsTotal: number; // minutes
  recettesFavorites: string[];
  categoriesPreferees: Record<string, number>;
  moyenneCalories: number;
  economiesEstimees: number;
  derniereMiseAJour: Date;
};

export type StockAlert = {
  ingredientId: string;
  type: 'faible' | 'expire_bientot' | 'expire';
  seuil?: number;
  dateExpiration?: Date;
};

export type ListeCourses = {
  id: string;
  nom: string;
  ingredients: Array<{
    ingredientId: string;
    quantiteNecessaire: number;
    quantitePossedee: number;
    unite: string;
    urgent: boolean;
  }>;
  createdAt: Date;
  completee: boolean;
};
