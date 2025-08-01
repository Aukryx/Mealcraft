import { useState, useEffect } from "react";
import { recettesDeBase, Recette } from "../data/recettesDeBase";

const STORAGE_KEY = "mealcraft_recettes";
const STORAGE_KEY_DELETED = "mealcraft_recettes_deleted";
const DATA_VERSION = "1.0";

// Structure compatible avec la future version cloud
type RecettesData = {
  custom: Recette[];
  deleted: string[];
  version: string;
  lastModified: number;
  deviceId?: string;
};

export function useRecettes() {
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Charger depuis le localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const deleted = localStorage.getItem(STORAGE_KEY_DELETED);
    let custom: Recette[] = [];
    let deletedList: string[] = [];
    
    try {
      if (saved) custom = JSON.parse(saved);
      if (deleted) deletedList = JSON.parse(deleted);
    } catch {}
    
    // Fusionne recettes de base et custom, retire celles supprimées
    const all = [
      ...recettesDeBase.filter(r => !deletedList.includes(r.id)),
      ...custom.filter(r => !deletedList.includes(r.id)),
    ];
    setRecettes(all);
    setDeletedIds(deletedList);
  }, []);

  // Sauvegarder les recettes custom et les suppressions
  const save = (custom: Recette[], deleted: string[]) => {
    // Structure compatible cloud
    const dataStructure: RecettesData = {
      custom,
      deleted,
      version: DATA_VERSION,
      lastModified: Date.now(),
      deviceId: getDeviceId()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(deleted));
    
    // Optionnel : sauvegarder aussi la structure complète pour migration
    localStorage.setItem('mealcraft_data_recettes', JSON.stringify(dataStructure));
  };

  // Générer un ID d'appareil stable
  const getDeviceId = (): string => {
    let deviceId = localStorage.getItem('mealcraft_device_id');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('mealcraft_device_id', deviceId);
    }
    return deviceId;
  };

  // Ajouter une recette
  const addRecette = (recette: Recette) => {
    const custom = recettes.filter(r => !recettesDeBase.find(b => b.id === r.id));
    const newCustom = [...custom, recette];
    setRecettes([
      ...recettesDeBase.filter(r => !deletedIds.includes(r.id)),
      ...newCustom
    ]);
    save(newCustom, deletedIds);
  };

  // Modifier une recette (par id)
  const editRecette = (id: string, recette: Recette) => {
    const custom = recettes.filter(r => !recettesDeBase.find(b => b.id === r.id) || r.id === id);
    const newCustom = custom.map(r => r.id === id ? recette : r);
    setRecettes([
      ...recettesDeBase.filter(r => !deletedIds.includes(r.id)),
      ...newCustom
    ]);
    save(newCustom, deletedIds);
  };

  // Supprimer une recette (par id)
  const deleteRecette = (id: string) => {
    const newDeleted = [...deletedIds, id];
    const custom = recettes.filter(r => !recettesDeBase.find(b => b.id === r.id) && r.id !== id);
    setRecettes([
      ...recettesDeBase.filter(r => !newDeleted.includes(r.id)),
      ...custom
    ]);
    setDeletedIds(newDeleted);
    save(custom, newDeleted);
  };

  // Réinitialiser toutes les recettes (optionnel)
  const resetRecettes = () => {
    setRecettes(recettesDeBase);
    setDeletedIds([]);
    save([], []);
  };

  return {
    recettes,
    addRecette,
    editRecette,
    deleteRecette,
    resetRecettes,
    isEmpty: recettes.length === 0
  };
}
