import { useState, useEffect } from 'react';
import { db, UserProfile } from '../data/database';
import { UserSettings } from '../types';

const DEFAULT_SETTINGS: UserSettings = {
  consommationMode: 'simulation',
  portionsParDefaut: 2,
  alertesStock: true,
  planificationAutomatique: false,
  modeNuit: false,
  difficultePreferee: null,
  regimesAlimentaires: [],
  allergies: [],
  tempsCuissonMax: null,
  budgetMoyen: null,
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger le profil au démarrage
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profiles = await db.userProfile.toArray();
      
      if (profiles.length === 0) {
        // Première utilisation
        setIsFirstTime(true);
        setLoading(false);
      } else {
        // Utilisateur existant
        const userProfile = profiles[0];
        
        // Mettre à jour la dernière connexion
        await db.userProfile.update(userProfile.id, {
          derniereConnexion: new Date()
        });
        
        setProfile(userProfile);
        setIsFirstTime(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setLoading(false);
    }
  };

  const createProfile = async (nom: string): Promise<UserProfile> => {
    const newProfile: UserProfile = {
      id: 'user_' + Date.now(),
      nom: nom.trim(),
      dateCreation: new Date(),
      derniereConnexion: new Date(),
      tutorialComplete: false,
      preferences: DEFAULT_SETTINGS
    };

    try {
      await db.userProfile.add(newProfile);
      setProfile(newProfile);
      setIsFirstTime(false);
      return newProfile;
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      await db.userProfile.update(profile.id, updates);
      setProfile({ ...profile, ...updates });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  };

  const completeTutorial = async () => {
    await updateProfile({ tutorialComplete: true });
  };

  const updatePreferences = async (newPreferences: Partial<UserSettings>) => {
    if (!profile) return;
    
    const updatedPreferences: UserSettings = { 
      ...profile.preferences, 
      ...newPreferences 
    };
    await updateProfile({ preferences: updatedPreferences });
  };

  const resetProfile = async () => {
    try {
      // Supprimer toutes les données
      await db.delete();
      await db.open();
      
      setProfile(null);
      setIsFirstTime(true);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  };

  return {
    profile,
    isFirstTime,
    loading,
    createProfile,
    updateProfile,
    completeTutorial,
    updatePreferences,
    resetProfile
  };
}
