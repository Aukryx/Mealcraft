import Dexie, { Table } from 'dexie';
import { Recette, Ingredient } from './recettesDeBase';
import { UserSettings, CookingSession, Achievement } from '../types';

// Types pour la DB
export interface UserProfile {
  id: string;
  nom: string;
  dateCreation: Date;
  derniereConnexion: Date;
  tutorialComplete: boolean;
  preferences: UserSettings;
}

export interface StockItem extends Ingredient {
  dateAjout: Date;
  dateExpiration?: Date;
  cout?: number;
}

export interface RecetteCustom extends Recette {
  createdBy: string;
  dateCreation: Date;
  dateModification: Date;
  favoris: boolean;
  nbUtilisations: number;
}

export interface PlanningEntry {
  id: string;
  date: string; // YYYY-MM-DD
  repas: 'dejeuner' | 'diner';
  recetteId: string;
  portions: number;
  genere: boolean; // true si généré automatiquement
  verrouille: boolean; // true si l'utilisateur ne veut pas que ça change
}

// Base de données
export class MealCraftDB extends Dexie {
  userProfile!: Table<UserProfile>;
  stock!: Table<StockItem>;
  recettes!: Table<RecetteCustom>;
  planning!: Table<PlanningEntry>;
  sessions!: Table<CookingSession>;
  achievements!: Table<Achievement>;

  constructor() {
    super('MealCraftDB');
    
    this.version(1).stores({
      userProfile: 'id, nom, dateCreation',
      stock: 'id, nom, categorie, dateAjout, dateExpiration',
      recettes: 'id, nom, categorie, createdBy, dateCreation, favoris',
      planning: 'id, date, repas, recetteId',
      sessions: 'recetteId, tempsDebut',
      achievements: 'id, obtenu, dateObtention'
    });
  }
}

// Instance globale
export const db = new MealCraftDB();
