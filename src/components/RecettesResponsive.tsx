import React, { useState, useEffect } from "react";
import { recettesDeBase, Recette } from "../data/recettesDeBase";

const RECETTES_PAR_PAGE_DESKTOP = 9;
const RECETTES_GAUCHE = 5;
const RECETTES_DROITE = 4;
const RECETTES_PAR_PAGE_MOBILE = 5;

// Types pour les filtres
type Filtres = {
  categories: string[];
  tempsMaxPreparation: number | null;
  tempsMaxCuisson: number | null;
  caloriesMax: number | null;
  recherche: string;
  ingredientsDispo: string[];
  difficulte: string | null;
};

const filtresInitiaux: Filtres = {
  categories: [],
  tempsMaxPreparation: null,
  tempsMaxCuisson: null,
  caloriesMax: null,
  recherche: "",
  ingredientsDispo: [],
  difficulte: null,
};

function useIsMobile(breakpoint = 700) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// Fonction pour filtrer les recettes
function filtrerRecettes(recettes: Recette[], filtres: Filtres): Recette[] {
  return recettes.filter(recette => {
    // Filtre par catégorie
    if (filtres.categories.length > 0 && recette.categorie && !filtres.categories.includes(recette.categorie)) {
      return false;
    }

    // Filtre par temps de préparation
    if (filtres.tempsMaxPreparation !== null && recette.tempsPreparation && recette.tempsPreparation > filtres.tempsMaxPreparation) {
      return false;
    }

    // Filtre par temps de cuisson
    if (filtres.tempsMaxCuisson !== null && recette.tempsCuisson && recette.tempsCuisson > filtres.tempsMaxCuisson) {
      return false;
    }

    // Filtre par calories
    if (filtres.caloriesMax !== null && recette.nutrition && recette.nutrition.calories > filtres.caloriesMax) {
      return false;
    }

    // Filtre par recherche textuelle
    if (filtres.recherche && !recette.nom.toLowerCase().includes(filtres.recherche.toLowerCase())) {
      return false;
    }

    // Filtre par ingrédients disponibles
    if (filtres.ingredientsDispo.length > 0) {
      const ingredientsRecette = recette.ingredients.map(ing => ing.ingredientId);
      const hasIngredients = filtres.ingredientsDispo.some(ing => ingredientsRecette.includes(ing));
      if (!hasIngredients) return false;
    }

    return true;
  });
}

export default function RecettesResponsive() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(0);
  const [selectedRecette, setSelectedRecette] = useState<Recette | null>(null);
  const [filtres, setFiltres] = useState<Filtres>(filtresInitiaux);
  const [showFilters, setShowFilters] = useState(false);

  // Appliquer les filtres
  const recettesFiltrees = filtrerRecettes(recettesDeBase, filtres);

  // Pagination
  const recettesParPage = isMobile ? RECETTES_PAR_PAGE_MOBILE : RECETTES_PAR_PAGE_DESKTOP;
  const totalPages = Math.ceil(recettesFiltrees.length / recettesParPage);
  const recettesPage = recettesFiltrees.slice(
    page * recettesParPage,
    (page + 1) * recettesParPage
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filtres]);

  // Obtenir toutes les catégories uniques
  const categoriesUniques = [...new Set(recettesDeBase.map(r => r.categorie).filter((cat): cat is string => typeof cat === "string"))];
  
  // Obtenir tous les ingrédients uniques
  const ingredientsUniques = [...new Set(recettesDeBase.flatMap(r => 
    r.ingredients.map(ing => ing.ingredientId)
  ))].sort();

  const toggleCategorie = (cat: string) => {
    setFiltres(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const toggleIngredient = (ing: string) => {
    setFiltres(prev => ({
      ...prev,
      ingredientsDispo: prev.ingredientsDispo.includes(ing)
        ? prev.ingredientsDispo.filter(i => i !== ing)
        : [...prev.ingredientsDispo, ing]
    }));
  };

  const resetFiltres = () => {
    setFiltres(filtresInitiaux);
    setPage(0);
  };

  // Interface des filtres
  const FilterPanel = () => (
    <div style={{
      background: "#f8f3d4",
      border: "2px solid #bfa76a",
      borderRadius: 16,
      padding: "1.5rem",
      marginBottom: "1rem",
      fontSize: "0.9rem",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, color: "#3a2d13", fontSize: "1.1rem" }}>Filtres</h3>
        <div>
          <button onClick={resetFiltres} style={{
            background: "#e2d7a7", border: "1px solid #bfa76a", borderRadius: 8,
            padding: "0.5rem 1rem", fontSize: "0.8rem", cursor: "pointer", marginRight: "0.5rem"
          }}>
            Réinitialiser
          </button>
          <button onClick={() => setShowFilters(false)} style={{
            background: "#bfa76a", color: "white", border: "none", borderRadius: 8,
            padding: "0.5rem 1rem", fontSize: "0.8rem", cursor: "pointer"
          }}>
            Fermer
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
        {/* Recherche */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#3a2d13" }}>
            Recherche :
          </label>
          <input
            type="text"
            value={filtres.recherche}
            onChange={(e) => setFiltres(prev => ({ ...prev, recherche: e.target.value }))}
            placeholder="Nom de la recette..."
            style={{
              width: "100%", padding: "0.5rem", border: "1px solid #bfa76a",
              borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit"
            }}
          />
        </div>

        {/* Catégories */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#3a2d13" }}>
            Catégories :
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {categoriesUniques.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategorie(cat)}
                style={{
                  background: filtres.categories.includes(cat) ? "#bfa76a" : "#e2d7a7",
                  color: filtres.categories.includes(cat) ? "white" : "#3a2d13",
                  border: "1px solid #bfa76a",
                  borderRadius: 8,
                  padding: "0.3rem 0.8rem",
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Temps de préparation */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#3a2d13" }}>
            Temps préparation max (min) :
          </label>
          <select
            value={filtres.tempsMaxPreparation || ""}
            onChange={(e) => setFiltres(prev => ({ 
              ...prev, 
              tempsMaxPreparation: e.target.value ? parseInt(e.target.value) : null 
            }))}
            style={{
              width: "100%", padding: "0.5rem", border: "1px solid #bfa76a",
              borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit"
            }}
          >
            <option value="">Tous</option>
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
          </select>
        </div>

        {/* Temps de cuisson */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#3a2d13" }}>
            Temps cuisson max (min) :
          </label>
          <select
            value={filtres.tempsMaxCuisson || ""}
            onChange={(e) => setFiltres(prev => ({ 
              ...prev, 
              tempsMaxCuisson: e.target.value ? parseInt(e.target.value) : null 
            }))}
            style={{
              width: "100%", padding: "0.5rem", border: "1px solid #bfa76a",
              borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit"
            }}
          >
            <option value="">Tous</option>
            <option value="10">10 min</option>
            <option value="20">20 min</option>
            <option value="30">30 min</option>
            <option value="60">1h</option>
          </select>
        </div>

        {/* Calories */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#3a2d13" }}>
            Calories max :
          </label>
          <select
            value={filtres.caloriesMax || ""}
            onChange={(e) => setFiltres(prev => ({ 
              ...prev, 
              caloriesMax: e.target.value ? parseInt(e.target.value) : null 
            }))}
            style={{
              width: "100%", padding: "0.5rem", border: "1px solid #bfa76a",
              borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit"
            }}
          >
            <option value="">Toutes</option>
            <option value="200">200 kcal</option>
            <option value="400">400 kcal</option>
            <option value="600">600 kcal</option>
          </select>
        </div>

        {/* Ingrédients disponibles */}
        <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#3a2d13" }}>
            Ingrédients que j'ai :
          </label>
          <div style={{ 
            maxHeight: "120px", overflowY: "auto", 
            display: "flex", flexWrap: "wrap", gap: "0.3rem",
            padding: "0.5rem", border: "1px solid #bfa76a", borderRadius: 8, background: "white"
          }}>
            {ingredientsUniques.slice(0, 20).map(ing => ( // Limite pour l'exemple
              <button
                key={ing}
                onClick={() => toggleIngredient(ing)}
                style={{
                  background: filtres.ingredientsDispo.includes(ing) ? "#bfa76a" : "#f0f0f0",
                  color: filtres.ingredientsDispo.includes(ing) ? "white" : "#333",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.7rem",
                  cursor: "pointer"
                }}
              >
                {ing}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#666" }}>
        {recettesFiltrees.length} recette{recettesFiltrees.length > 1 ? 's' : ''} trouvée{recettesFiltrees.length > 1 ? 's' : ''}
      </div>
    </div>
  );

  // Affichage mobile (liste verticale)
  if (isMobile) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
          padding: "2.5rem 0 0 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: 'Press Start 2P, cursive',
        }}
      >
        {/* Bouton filtres mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            background: "var(--pixel-mint)",
            color: "var(--pixel-dark)",
            border: "none",
            borderRadius: 12,
            padding: "0.8rem 1.5rem",
            fontSize: "0.9rem",
            cursor: "pointer",
            marginBottom: "1rem",
            boxShadow: "2px 2px 0 var(--pixel-blue)",
          }}
        >
          🔍 Filtres {Object.values(filtres).some(v => Array.isArray(v) ? v.length > 0 : v !== null && v !== "") && "●"}
        </button>

        {showFilters && <FilterPanel />}

        <div
          style={{
            width: "100%",
            background: "rgba(255, 250, 205, 0.93)",
            borderRadius: 24,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.13)",
            border: "2px solid var(--pixel-mint)",
            padding: "2rem 1.2rem 1.2rem 1.2rem",
            minHeight: 420,
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {recettesPage.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888", fontSize: "1rem", marginTop: "2rem" }}>
              Aucune recette trouvée avec ces filtres
            </div>
          ) : (
            recettesPage.map((recette) => (
              <div key={recette.id} style={{ marginBottom: "2.2rem" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#222",
                    fontSize: "1.1rem",
                    marginBottom: 6,
                    textShadow:
                      "-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff",
                  }}
                >
                  {recette.nom}
                </div>
                <div
                  style={{
                    color: "#888",
                    fontSize: "0.8rem",
                    fontWeight: 400,
                    marginLeft: 8,
                    marginBottom: 2,
                    wordBreak: "break-word",
                  }}
                >
                  {recette.ingredients.map(ing => `${ing.quantite} ${ing.unite} ${ing.ingredientId}`).join(", ")}
                </div>
              </div>
            ))
          )}
          
          {/* Bouton ajouter une recette en bas */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", minHeight: 60 }}>
            <button
              style={{
                background: "var(--pixel-mint)",
                color: "var(--pixel-dark)",
                fontFamily: 'Press Start 2P, cursive',
                border: "none",
                borderRadius: 12,
                padding: "1.1rem 1.7rem",
                fontSize: "1rem",
                boxShadow: "2px 2px 0 var(--pixel-blue)",
                cursor: "pointer",
                marginTop: 12,
                marginLeft: "auto",
                marginRight: 0,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: "1.2em" }}>＋</span> Ajouter une recette
            </button>
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", gap: 24, marginTop: 12, alignItems: "center" }}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                background: "none",
                border: "none",
                color: page === 0 ? "#bbb" : "var(--pixel-mint)",
                fontFamily: 'Press Start 2P, cursive',
                fontSize: "1.2rem",
                cursor: page === 0 ? "not-allowed" : "pointer",
                opacity: page === 0 ? 0.4 : 1,
                padding: 0,
                userSelect: "none",
              }}
            >
              ◀
            </button>
            <span style={{ fontFamily: 'Press Start 2P, cursive', fontSize: "1rem", color: "var(--pixel-pink)" }}>
              Page {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              style={{
                background: "none",
                border: "none",
                color: page === totalPages - 1 ? "#bbb" : "var(--pixel-mint)",
                fontFamily: 'Press Start 2P, cursive',
                fontSize: "1.2rem",
                cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                opacity: page === totalPages - 1 ? 0.4 : 1,
                padding: 0,
                userSelect: "none",
              }}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    );
  }

  // Affichage desktop (livre)
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: 'Press Start 2P, cursive',
        background: "none",
      }}
    >
      {/* Barre de filtres desktop */}
      <div style={{ width: "min(98vw, 1800px)", marginBottom: "1rem" }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            background: "#e2d7a7",
            color: "#3a2d13",
            border: "2px solid #bfa76a",
            borderRadius: 12,
            padding: "0.8rem 1.5rem",
            fontSize: "1rem",
            fontFamily: 'Press Start 2P, cursive',
            cursor: "pointer",
            boxShadow: "2px 2px 0 #bfa76a",
            marginBottom: showFilters ? "1rem" : 0,
          }}
        >
          🔍 Filtres {Object.values(filtres).some(v => Array.isArray(v) ? v.length > 0 : v !== null && v !== "") && "●"}
        </button>
        
        {showFilters && <FilterPanel />}
      </div>

      <div
        style={{
          width: "min(98vw, 1800px)",
          minHeight: 600,
          margin: "0 auto",
          background: "#f8f3d4 url('https://www.transparenttextures.com/patterns/old-mathematics.png') repeat",
          borderRadius: "32px 32px 40px 40px/36px 36px 60px 60px",
          boxShadow: "0 16px 48px 0 rgba(0,0,0,0.25), 0 0 0 8px #e2d7a7 inset",
          border: "4px solid #bfa76a",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          overflow: "visible",
          filter: "drop-shadow(0 8px 32px #bfa76a88)",
          transform: "perspective(1200px) rotateX(2deg)",
        }}
      >
        {/* Séparateur central façon reliure */}
        <div style={{
          position: "absolute",
          top: 30,
          bottom: 30,
          left: "50%",
          width: 0,
          borderLeft: "6px double #bfa76a",
          filter: "blur(0.5px)",
          opacity: 0.8,
          zIndex: 2,
          boxShadow: "0 0 16px 2px #bfa76a99, 0 0 0 8px #e2d7a7 inset",
        }} />
        
        {recettesPage.length === 0 ? (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            color: "#888",
            textAlign: "center"
          }}>
            Aucune recette trouvée avec ces filtres
          </div>
        ) : (
          <>
            {/* Page gauche */}
            <div style={{
              flex: 1,
              padding: "3.5rem 3.5rem 3.5rem 4.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              {recettesPage.slice(0, RECETTES_GAUCHE).map((recette, idx) => (
                <div
                  key={recette.id}
                  style={{ marginBottom: idx < RECETTES_GAUCHE - 1 ? "2.7rem" : 0, cursor: "pointer" }}
                  onClick={() => setSelectedRecette(recette)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Voir la recette ${recette.nom}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedRecette(recette); }}
                  onMouseEnter={e => {
                    const title = e.currentTarget.querySelector('.recette-title');
                    if (title) (title as HTMLElement).style.color = '#c0392b';
                  }}
                  onMouseLeave={e => {
                    const title = e.currentTarget.querySelector('.recette-title');
                    if (title) (title as HTMLElement).style.color = '#3a2d13';
                  }}
                >
                  <div
                    className="recette-title"
                    style={{
                      fontWeight: "bold",
                      color: "#3a2d13",
                      fontSize: "1.45rem",
                      marginBottom: 7,
                      textShadow:
                        "0 2px 0 #e2d7a7, 0 0 2px #fff, 0 0 8px #bfa76a55",
                      letterSpacing: 1,
                    }}
                  >
                    {recette.nom}
                  </div>
                  <div
                    style={{
                      color: "#5e4b1b",
                      fontSize: "1.05rem",
                      fontWeight: 400,
                      marginLeft: 10,
                      marginBottom: 2,
                      wordBreak: "break-word",
                      textShadow: "0 1px 0 #fff, 0 0 2px #e2d7a7",
                    }}
                  >
                    {recette.ingredients.map(ing => `${ing.quantite} ${ing.unite} ${ing.ingredientId}`).join(", ")}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Page droite */}
            <div style={{
              flex: 1,
              padding: "3.5rem 4.5rem 3.5rem 3.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}>
              {recettesPage.slice(RECETTES_GAUCHE, RECETTES_PAR_PAGE_DESKTOP).map((recette, idx) => (
                <div
                  key={recette.id}
                  style={{ marginBottom: idx < RECETTES_DROITE - 1 ? "2.7rem" : 0, cursor: "pointer" }}
                  onClick={() => setSelectedRecette(recette)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Voir la recette ${recette.nom}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedRecette(recette); }}
                  onMouseEnter={e => {
                    const title = e.currentTarget.querySelector('.recette-title');
                    if (title) (title as HTMLElement).style.color = '#c0392b';
                  }}
                  onMouseLeave={e => {
                    const title = e.currentTarget.querySelector('.recette-title');
                    if (title) (title as HTMLElement).style.color = '#3a2d13';
                  }}
                >
                  <div
                    className="recette-title"
                    style={{
                      fontWeight: "bold",
                      color: "#3a2d13",
                      fontSize: "1.45rem",
                      marginBottom: 7,
                      textShadow:
                        "0 2px 0 #e2d7a7, 0 0 2px #fff, 0 0 8px #bfa76a55",
                      letterSpacing: 1,
                    }}
                  >
                    {recette.nom}
                  </div>
                  <div
                    style={{
                      color: "#5e4b1b",
                      fontSize: "1.05rem",
                      fontWeight: 400,
                      marginLeft: 10,
                      marginBottom: 2,
                      wordBreak: "break-word",
                      textShadow: "0 1px 0 #fff, 0 0 2px #e2d7a7",
                    }}
                  >
                    {recette.ingredients.map(ing => `${ing.quantite} ${ing.unite} ${ing.ingredientId}`).join(", ")}
                  </div>
                </div>
              ))}
              
              {/* Bouton ajouter une recette */}
              <div style={{ 
                display: "flex", 
                justifyContent: "flex-end", 
                alignItems: "flex-end", 
                minHeight: 60, 
                position: "absolute", 
                bottom: 32, 
                right: 40, 
                width: "calc(100% - 80px)" 
              }}>
                <button
                  style={{
                    background: "#e2d7a7",
                    color: "#3a2d13",
                    fontFamily: 'Press Start 2P, cursive',
                    border: "2px solid #bfa76a",
                    borderRadius: 12,
                    padding: "1.1rem 1.7rem",
                    fontSize: "1rem",
                    boxShadow: "2px 2px 0 #bfa76a",
                    cursor: "pointer",
                    marginTop: 12,
                    marginLeft: "auto",
                    marginRight: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: "1.2em" }}>＋</span> Ajouter une recette
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Modal recette détaillée */}
      {selectedRecette && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedRecette(null)}
        >
          <div
            style={{
              minWidth: 420,
              maxWidth: 720,
              background: "#f8f3d4 url('https://www.transparenttextures.com/patterns/old-mathematics.png') repeat",
              borderRadius: 32,
              boxShadow: "0 12px 48px 0 rgba(0,0,0,0.28)",
              border: "4px solid #bfa76a",
              padding: "2.7rem 2.7rem 2.2rem 2.7rem",
              position: "relative",
              color: "#3a2d13",
              fontFamily: 'Press Start 2P, cursive',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRecette(null)}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: "none",
                border: "none",
                fontSize: 28,
                color: "#bfa76a",
                cursor: "pointer",
                fontWeight: 700,
                zIndex: 2,
              }}
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 style={{ fontSize: "1.5rem", marginBottom: 18, color: "#3a2d13", textAlign: "center", textShadow: "0 2px 0 #e2d7a7, 0 0 2px #fff" }}>{selectedRecette.nom}</h2>
            <div style={{ marginBottom: 16 }}>
              <strong>Ingrédients :</strong>
              <ul style={{ margin: 0, paddingLeft: 18, marginTop: 8, marginBottom: 8 }}>
                {selectedRecette.ingredients.map((ing, i) => (
                  <li key={i} style={{ fontSize: "1.08rem", color: "#5e4b1b", marginBottom: 6, lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 600 }}>{ing.quantite} {ing.unite} {ing.ingredientId}</span>
                  </li>
                ))}
                {selectedRecette.ingredientsOptionnels && selectedRecette.ingredientsOptionnels.length > 0 && (
                  <li style={{ fontSize: "1rem", color: "#bfa76a", fontStyle: "italic", marginTop: 8 }}>
                    Optionnel : {selectedRecette.ingredientsOptionnels.map(ing => `${ing.quantite} ${ing.unite} ${ing.ingredientId}`).join(", ")}
                  </li>
                )}
              </ul>
            </div>

            {/* Valeurs nutritionnelles globales */}
            {selectedRecette.nutrition && (
              <div style={{ marginBottom: 16, marginTop: 8, color: "#7a5e1b", fontSize: "1.08rem" }}>
                <strong>Valeurs nutritionnelles (par portion) :</strong><br />
                {selectedRecette.nutrition.calories} kcal, {selectedRecette.nutrition.proteines}g prot, {selectedRecette.nutrition.glucides}g gluc, {selectedRecette.nutrition.lipides}g lip
                {selectedRecette.nutrition.fibres !== undefined ? `, ${selectedRecette.nutrition.fibres}g fibres` : ""}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <strong>Étapes :</strong>
              <ol style={{ fontSize: "1rem", color: "#3a2d13", marginTop: 8, marginBottom: 0, paddingLeft: 22 }}>
                {selectedRecette.etapes && selectedRecette.etapes.map((etape, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{etape}</li>
                ))}
              </ol>
            </div>
            {selectedRecette.categorie && (
              <div style={{ marginBottom: 8 }}><strong>Catégorie :</strong> {selectedRecette.categorie}</div>
            )}
            {(selectedRecette.tempsPreparation || selectedRecette.tempsCuisson) && (
              <div style={{ marginBottom: 8 }}>
                <strong>Préparation :</strong> {selectedRecette.tempsPreparation ? selectedRecette.tempsPreparation + ' min' : '-'}<br />
                <strong>Cuisson :</strong> {selectedRecette.tempsCuisson ? selectedRecette.tempsCuisson + ' min' : '-'}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 24, marginTop: 32, alignItems: "center" }}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              background: "none",
              border: "none",
              color: page === 0 ? "#bbb" : "var(--pixel-mint)",
              fontFamily: 'Press Start 2P, cursive',
              fontSize: "1.2rem",
              cursor: page === 0 ? "not-allowed" : "pointer",
              opacity: page === 0 ? 0.4 : 1,
              padding: 0,
              userSelect: "none",
            }}
            title={page === 0 ? "Page précédente non accessible" : "Page précédente"}
          >
            ◀
          </button>
          <span style={{ fontFamily: 'Press Start 2P, cursive', fontSize: "1rem", color: "var(--pixel-pink)" }}>
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            style={{
              background: "none",
              border: "none",
              color: page === totalPages - 1 ? "#bbb" : "var(--pixel-mint)",
              fontFamily: 'Press Start 2P, cursive',
              fontSize: "1.2rem",
              cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
              opacity: page === totalPages - 1 ? 0.4 : 1,
              padding: 0,
              userSelect: "none",
            }}
            title={page === totalPages - 1 ? "Page suivante non accessible" : "Page suivante"}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}