
import React, { useState } from "react";
import { ingredientsDeBase, Ingredient, IngredientCategorie } from "../data/recettesDeBase";

// Catégories et couleurs associées (pour le fun)
const categorieCouleurs: Record<IngredientCategorie, string> = {
  "légume": "#A8E063",
  "fruit": "#FFD36E",
  "viande": "#FF8C8C",
  "poisson": "#6EC6FF",
  "féculent": "#F5E6B2",
  "produit laitier": "#FFF6E0",
  "épice": "#E0C3FC",
  "autre": "#D3D3D3",
};

// Un petit emoji par catégorie pour l'aspect ludique
const categorieEmojis: Record<IngredientCategorie, string> = {
  "légume": "🥕",
  "fruit": "🍎",
  "viande": "🥩",
  "poisson": "🐟",
  "féculent": "🍞",
  "produit laitier": "🧀",
  "épice": "🧂",
  "autre": "🍽️",
};

export default function Ingredients() {
  // Stock utilisateur (en vrai, à stocker dans Zustand/localStorage)
  const [stock, setStock] = useState<Ingredient[]>([]);
  const [filtre, setFiltre] = useState<IngredientCategorie | "tous">("tous");
  const [recherche, setRecherche] = useState("");

  // Ajout d'un ingrédient au stock
  function ajouterIngredient(ingredient: Ingredient) {
    if (!stock.find(i => i.id === ingredient.id)) {
      setStock([...stock, { ...ingredient, quantite: 1 }]);
    }
  }

  // Retrait d'un ingrédient du stock
  function retirerIngredient(id: string) {
    setStock(stock.filter(i => i.id !== id));
  }

  // Changement de quantité
  function changerQuantite(id: string, delta: number) {
    setStock(stock => stock.map(i => i.id === id ? { ...i, quantite: Math.max(1, (i.quantite || 1) + delta) } : i));
  }

  // Liste filtrée pour suggestions
  const suggestions = ingredientsDeBase.filter(i =>
    (filtre === "tous" || i.categorie === filtre) &&
    (!recherche || i.nom.toLowerCase().includes(recherche.toLowerCase())) &&
    !stock.find(s => s.id === i.id)
  );

  // Liste filtrée du stock
  const stockFiltre = filtre === "tous" ? stock : stock.filter(i => i.categorie === filtre);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 0" }}>
      <h2 style={{ color: "var(--pixel-lavender)", marginBottom: 24, textAlign: "center" }}>Mon armoire à ingrédients</h2>
      {/* Filtres */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => setFiltre("tous")}
          style={{ background: filtre === "tous" ? "var(--pixel-mint)" : "#fff", color: "#333", border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", fontFamily: 'Press Start 2P, cursive', cursor: "pointer" }}>Tous</button>
        {Object.keys(categorieEmojis).map(cat => (
          <button key={cat}
            onClick={() => setFiltre(cat as IngredientCategorie)}
            style={{ background: filtre === cat ? categorieCouleurs[cat as IngredientCategorie] : "#fff", color: "#333", border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", fontFamily: 'Press Start 2P, cursive', cursor: "pointer" }}>
            {categorieEmojis[cat as IngredientCategorie]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un ingrédient..."
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
        style={{ width: "100%", marginBottom: 18, padding: "0.7rem 1rem", borderRadius: 8, border: "1.5px solid var(--pixel-mint)", fontFamily: 'Press Start 2P, cursive', fontSize: 14 }}
      />
      {/* Stock utilisateur */}
      <div style={{ marginBottom: 32 }}>
        {stockFiltre.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center", margin: "2rem 0" }}>
            Aucun ingrédient dans cette catégorie.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {stockFiltre.map(ing => (
              <li key={ing.id} style={{ background: categorieCouleurs[ing.categorie], borderRadius: 12, padding: "1.1rem 1.5rem", minWidth: 120, boxShadow: "2px 2px 0 #bfa76a", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                <span style={{ fontSize: 32, marginBottom: 6 }}>{categorieEmojis[ing.categorie]}</span>
                <span style={{ fontWeight: "bold", color: "#333", marginBottom: 4 }}>{ing.nom}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <button onClick={() => changerQuantite(ing.id, -1)} style={{ fontSize: 18, border: "none", background: "#fff", borderRadius: 6, cursor: "pointer", width: 28, height: 28, fontWeight: 700 }}>-</button>
                  <span style={{ fontFamily: 'Press Start 2P, cursive', fontSize: 15 }}>{ing.quantite || 1} {ing.unite || ''}</span>
                  <button onClick={() => changerQuantite(ing.id, 1)} style={{ fontSize: 18, border: "none", background: "#fff", borderRadius: 6, cursor: "pointer", width: 28, height: 28, fontWeight: 700 }}>+</button>
                </div>
                <button onClick={() => retirerIngredient(ing.id)} style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: "#c0392b", fontSize: 20, cursor: "pointer" }} title="Retirer">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Suggestions d'ajout */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: "var(--pixel-mint)", fontSize: 18, marginBottom: 12, textAlign: "center" }}>Ajouter un ingrédient</h3>
        {suggestions.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center" }}>Aucun ingrédient à suggérer.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {suggestions.map(ing => (
              <li key={ing.id} style={{ background: categorieCouleurs[ing.categorie], borderRadius: 10, padding: "0.7rem 1.1rem", minWidth: 90, boxShadow: "1px 1px 0 #bfa76a", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: 'Press Start 2P, cursive' }} onClick={() => ajouterIngredient(ing)}>
                <span style={{ fontSize: 22 }}>{categorieEmojis[ing.categorie]}</span>
                <span style={{ fontWeight: 500 }}>{ing.nom}</span>
                <span style={{ fontSize: 18, color: "#3a2d13", marginLeft: 4 }}>+</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
