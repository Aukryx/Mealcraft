import React, { useState, useEffect } from "react";
import { ingredientsDeBase, Ingredient } from "../../data/recettesDeBase";
import { SmartQuantityEditor } from "../SmartQuantityEditor";

const categoriesRefrigerees = ["produit laitier", "viande", "poisson"];
const categoriesNonRefrigerees = ["légume", "fruit", "féculent", "épice", "autre"];

const categorieCouleurs: Record<string, string> = {
  "légume": "#A8E063",
  "fruit": "#FFD36E",
  "viande": "#FF8C8C",
  "poisson": "#6EC6FF",
  "féculent": "#F5E6B2",
  "produit laitier": "#FFF6E0",
  "épice": "#E0C3FC",
  "autre": "#D3D3D3",
};
const categorieEmojis: Record<string, string> = {
  "légume": "🥕",
  "fruit": "🍎",
  "viande": "🥩",
  "poisson": "🐟",
  "féculent": "🍞",
  "produit laitier": "🧀",
  "épice": "🧂",
  "autre": "🍽️",
};

type Props = {
  initialTab: "fridge" | "pantry";
  onClose: () => void;
  stock: Ingredient[];
  onStockChange: (newStock: Ingredient[]) => void;
};

export default function FridgePantryModal({ initialTab, onClose, stock, onStockChange }: Props) {
  const [tab, setTab] = useState<"fridge" | "pantry">(initialTab);
  const [filtre, setFiltre] = useState<"tous" | string>("tous");
  const [recherche, setRecherche] = useState("");
  const categories = tab === "fridge" ? categoriesRefrigerees : categoriesNonRefrigerees;
  const stockFiltre = stock.filter((i: Ingredient) =>
    categories.includes(i.categorie) &&
    (filtre === "tous" || i.categorie === filtre) &&
    (!recherche || i.nom.toLowerCase().includes(recherche.toLowerCase()))
  );
  const suggestions = ingredientsDeBase.filter(i =>
    categories.includes(i.categorie) &&
    (filtre === "tous" || i.categorie === filtre) &&
    (!recherche || i.nom.toLowerCase().includes(recherche.toLowerCase())) &&
    !stock.find((s: Ingredient) => s.id === i.id)
  );
  const handleAddIngredient = (ingredient: Ingredient) => {
    // Empêche l'ajout de doublons (même id)
    if (stock.some(i => i.id === ingredient.id)) return;
    onStockChange([...stock, { ...ingredient, quantite: 1 }]);
  };
  const handleRemove = (id: string) => {
    const newStock = stock.filter(i => i.id !== id);
    onStockChange(newStock);
  };
  const handleChangeQuantite = (id: string, newQuantity: number) => {
    const newStock = stock.map(i =>
      i.id === id ? { ...i, quantite: Math.max(0, newQuantity) } : i
    );
    onStockChange(newStock);
  };
  const categoriesOnglet = ["tous", ...categories];
  useEffect(() => {
    setFiltre("tous");
    setRecherche("");
  }, [tab]);
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: tab === "fridge"
        ? "linear-gradient(180deg, #e8f4f8, #d1e7dd)"
        : "linear-gradient(180deg, #f8f3d4, #e2d7a7)",
      zIndex: 1000,
      padding: "0 1rem",
      fontFamily: "Press Start 2P, cursive",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "flex-start",
      overflow: "auto",
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: "1.5rem", right: "2rem",
        background: "#dc3545", color: "white", border: "none", borderRadius: "8px",
        padding: "0.7rem 1.3rem", cursor: "pointer", fontSize: "1.2rem", zIndex: 10
      }}>×</button>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2.5rem", marginBottom: "1.5rem", gap: "2rem" }}>
        <button
          onClick={() => setTab("fridge")}
          style={{
            background: tab === "fridge" ? "#e8f4f8" : "#f0f0f0",
            color: tab === "fridge" ? "#495057" : "#888",
            border: tab === "fridge" ? "3px solid #495057" : "1px solid #bbb",
            borderRadius: "12px 12px 0 0",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "1rem 2.5rem",
            cursor: tab === "fridge" ? "default" : "pointer",
            boxShadow: tab === "fridge" ? "0 4px 16px #49505733" : "none",
            outline: "none",
            transition: "all 0.2s",
          }}
          disabled={tab === "fridge"}
        >🧊 Frigo</button>
        <button
          onClick={() => setTab("pantry")}
          style={{
            background: tab === "pantry" ? "#f8f3d4" : "#f0f0f0",
            color: tab === "pantry" ? "#8b4513" : "#888",
            border: tab === "pantry" ? "3px solid #8b4513" : "1px solid #bbb",
            borderRadius: "12px 12px 0 0",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "1rem 2.5rem",
            cursor: tab === "pantry" ? "default" : "pointer",
            boxShadow: tab === "pantry" ? "0 4px 16px #8b451333" : "none",
            outline: "none",
            transition: "all 0.2s",
          }}
          disabled={tab === "pantry"}
        >🗄️ Placard</button>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", justifyContent: "center" }}>
        {categoriesOnglet.map(cat => (
          <button key={cat}
            onClick={() => setFiltre(cat)}
            style={{ background: filtre === cat ? (cat === "tous" ? "var(--pixel-mint)" : categorieCouleurs[cat] || "#fff") : "#fff", color: "#333", border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", fontFamily: 'Press Start 2P, cursive', cursor: "pointer" }}>
            {cat !== "tous" && categorieEmojis[cat] ? categorieEmojis[cat] + ' ' : ''}{cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Rechercher un ingrédient..."
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
        style={{ width: '100%', marginBottom: 18, padding: '0.7rem 1rem', borderRadius: 8, border: '1.5px solid var(--pixel-mint)', fontFamily: 'Press Start 2P, cursive', fontSize: 14, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
      />
      <div style={{ marginBottom: 32 }}>
        {stockFiltre.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', margin: '2rem 0' }}>
            Aucun ingrédient dans cette catégorie.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            {stockFiltre.map((ing: Ingredient) => (
              <li key={ing.id} style={{ 
                background: categorieCouleurs[ing.categorie], 
                borderRadius: 12, 
                padding: '1rem', 
                minWidth: 200, 
                boxShadow: '2px 2px 0 #bfa76a', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                position: 'relative',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: 32 }}>{categorieEmojis[ing.categorie]}</span>
                <span style={{ fontWeight: 'bold', color: '#333', marginBottom: 4, textAlign: 'center' }}>{ing.nom}</span>
                
                <SmartQuantityEditor
                  quantity={ing.quantite || 1}
                  unit={ing.unite || 'pièce'}
                  onQuantityChange={(newQuantity) => handleChangeQuantite(ing.id, newQuantity)}
                  className="ingredient-quantity-editor"
                />
                
                <button 
                  onClick={() => handleRemove(ing.id)} 
                  style={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    background: 'none', 
                    border: 'none', 
                    color: '#c0392b', 
                    fontSize: 20, 
                    cursor: 'pointer' 
                  }} 
                  title="Retirer"
                >×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: 'var(--pixel-mint)', fontSize: 18, marginBottom: 12, textAlign: 'center' }}>Ajouter un ingrédient</h3>
        {suggestions.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center' }}>Aucun ingrédient à suggérer.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {suggestions.map((ing: Ingredient) => (
              <li key={ing.id} style={{ background: categorieCouleurs[ing.categorie], borderRadius: 10, padding: '0.7rem 1.1rem', minWidth: 90, boxShadow: '1px 1px 0 #bfa76a', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Press Start 2P, cursive' }} onClick={() => handleAddIngredient(ing)}>
                <span style={{ fontSize: 22 }}>{categorieEmojis[ing.categorie]}</span>
                <span style={{ fontWeight: 500 }}>{ing.nom}</span>
                <span style={{ fontSize: 18, color: '#3a2d13', marginLeft: 4 }}>+</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
