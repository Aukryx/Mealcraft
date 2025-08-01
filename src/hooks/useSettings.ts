import { useState, useEffect } from 'react';
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

const STORAGE_KEY = 'mealcraft_settings';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Charger les paramètres au démarrage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    }
  }, []);

  // Sauvegarder les paramètres
  const saveSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Réinitialiser les paramètres
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  };

  return {
    settings,
    saveSettings,
    resetSettings,
  };
}
