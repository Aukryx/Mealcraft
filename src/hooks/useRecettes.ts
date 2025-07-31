import { useState, useEffect } from "react";
import { recettesDeBase, Recette } from "../data/recettesDeBase";

const STORAGE_KEY = "mealcraft_recettes";
const STORAGE_KEY_DELETED = "mealcraft_recettes_deleted";

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(deleted));
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
    let newDeleted = [...deletedIds, id];
    let custom = recettes.filter(r => !recettesDeBase.find(b => b.id === r.id) && r.id !== id);
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
