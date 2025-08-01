type Props = {
  onClose: () => void;
};
import React from "react";
import "./custom-scrollbar.css";
import { useState } from "react";
import { useRecettes } from "../../hooks/useRecettes";
import { Recette } from "../../data/recettesDeBase";
import RecettesResponsive from "../RecettesResponsive";


export default function CookBook({ onClose }: Props) {
  const { recettes, addRecette, editRecette, deleteRecette, isEmpty } = useRecettes();
  const [editing, setEditing] = useState<Recette | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Formulaire simplifié pour la démo (à améliorer)
  function RecetteForm({ initial, onSave, onCancel }: { initial?: Recette, onSave: (r: Recette) => void, onCancel: () => void }) {
    // Champs principaux
    const [nom, setNom] = useState(initial?.nom || "");
    const [categorie, setCategorie] = useState(initial?.categorie || "");
    const [tags, setTags] = useState(initial?.tags?.join(", ") || "");
    const [tempsPreparation, setTempsPreparation] = useState(initial?.tempsPreparation?.toString() || "");
    const [tempsCuisson, setTempsCuisson] = useState(initial?.tempsCuisson?.toString() || "");

    // Ingrédients principaux
    const [ingredients, setIngredients] = useState(initial?.ingredients || []);
    // Ingrédients optionnels
    const [ingredientsOptionnels, setIngredientsOptionnels] = useState(initial?.ingredientsOptionnels || []);
    // Étapes
    const [etapes, setEtapes] = useState(initial?.etapes || [""]);
    // Nutrition
    const [calories, setCalories] = useState(initial?.nutrition?.calories?.toString() || "");
    const [proteines, setProteines] = useState(initial?.nutrition?.proteines?.toString() || "");
    const [glucides, setGlucides] = useState(initial?.nutrition?.glucides?.toString() || "");
    const [lipides, setLipides] = useState(initial?.nutrition?.lipides?.toString() || "");
    const [fibres, setFibres] = useState(initial?.nutrition?.fibres?.toString() || "");

    // Pour détecter si le formulaire a été modifié
    const [dirty, setDirty] = useState(false);
    React.useEffect(() => {
      setDirty(false);
    }, [initial]);
    const markDirty = () => setDirty(true);

    // Helpers pour ingrédients/étapes dynamiques

    const handleIngredientChange = (idx: number, field: string, value: string) => {
      setIngredients(ings => ings.map((ing, i) => i === idx ? { ...ing, [field]: value } : ing));
      markDirty();
    };
    const addIngredient = () => { setIngredients([...ingredients, { ingredientId: '', quantite: 0, unite: '' }]); markDirty(); };
    const removeIngredient = (idx: number) => { setIngredients(ings => ings.filter((_, i) => i !== idx)); markDirty(); };

    const handleIngredientOptChange = (idx: number, field: string, value: string) => {
      setIngredientsOptionnels(ings => ings.map((ing, i) => i === idx ? { ...ing, [field]: value } : ing));
      markDirty();
    };
    const addIngredientOpt = () => { setIngredientsOptionnels([...ingredientsOptionnels, { ingredientId: '', quantite: 0, unite: '' }]); markDirty(); };
    const removeIngredientOpt = (idx: number) => { setIngredientsOptionnels(ings => ings.filter((_, i) => i !== idx)); markDirty(); };

    const handleEtapeChange = (idx: number, value: string) => {
      setEtapes(steps => steps.map((et, i) => i === idx ? value : et));
      markDirty();
    };
    const addEtape = () => { setEtapes([...etapes, ""]); markDirty(); };
    const removeEtape = (idx: number) => { setEtapes(steps => steps.filter((_, i) => i !== idx)); markDirty(); };

    // Catégories et tags prédéfinis (à adapter selon vos filtres de recherche)
    const CATEGORIES = [
      "Petit-déjeuner",
      "Déjeuner",
      "Dîner",
      "Goûter",
      "Dessert",
      "Entrée",
      "Boisson",
      "Autre"
    ];
    const TAGS = [
      "végétarien",
      "végétalien",
      "sans gluten",
      "rapide",
      "économique",
      "protéiné",
      "léger",
      "classique"
    ];

    // Pour la multi-sélection des tags
    const handleTagToggle = (tag: string) => {
      const arr = tags.split(",").map(t => t.trim()).filter(Boolean);
      if (arr.includes(tag)) {
        setTags(arr.filter(t => t !== tag).join(", "));
      } else {
        setTags([...arr, tag].join(", "));
      }
    };

    // Liste des tags sélectionnés
    const selectedTags = tags.split(",").map(t => t.trim()).filter(Boolean);

    // Styles communs pour les inputs
    const inputStyle = {
      width: '100%',
      background: '#fffbe7',
      border: '1.5px solid #bfa76a',
      borderRadius: 6,
      padding: '10px',
      fontSize: 15,
      marginBottom: 8,
      fontFamily: 'inherit'
    };

    // Gestion des erreurs de validation
    const [formError, setFormError] = useState<string | null>(null);

    // Validation stricte avant enregistrement
    const validateForm = () => {
      if (!nom.trim()) return "Le nom de la recette est obligatoire.";
      if (!categorie.trim()) return "La catégorie est obligatoire.";
      if (ingredients.length === 0 || ingredients.some(ing => !ing.ingredientId.trim())) return "Au moins un ingrédient principal valide est requis.";
      if (ingredients.some(ing => Number(ing.quantite) <= 0)) return "Les quantités d'ingrédients doivent être strictement positives.";
      if (ingredients.some(ing => Number(ing.quantite) < 0)) return "Aucune quantité ne peut être négative.";
      if (etapes.length === 0 || etapes.every(e => !e.trim())) return "Au moins une étape est requise.";
      if (tempsPreparation && Number(tempsPreparation) < 0) return "Le temps de préparation ne peut pas être négatif.";
      if (tempsCuisson && Number(tempsCuisson) < 0) return "Le temps de cuisson ne peut pas être négatif.";
      if (calories && Number(calories) < 0) return "Les calories ne peuvent pas être négatives.";
      if (proteines && Number(proteines) < 0) return "Les protéines ne peuvent pas être négatives.";
      if (glucides && Number(glucides) < 0) return "Les glucides ne peuvent pas être négatifs.";
      if (lipides && Number(lipides) < 0) return "Les lipides ne peuvent pas être négatifs.";
      if (fibres && fibres !== '' && Number(fibres) < 0) return "Les fibres ne peuvent pas être négatives.";
      return null;
    };

    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Bouton fermer fixe en haut à droite du formulaire */}
        <button
          type="button"
          onClick={() => {
            if (!dirty) { onCancel(); return; }
            if (window.confirm("Voulez-vous enregistrer les modifications avant de fermer ? (OK = enregistrer, Annuler = quitter sans enregistrer)")) {
              // Simule submit du formulaire
              const form = document.querySelector('form[data-recipe-form="true"]') as HTMLFormElement;
              if (form) {
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(submitEvent);
              }
            } else {
              onCancel();
            }
          }}
          style={{
            position: 'sticky',
            top: 15,
            right: 15,
            alignSelf: 'flex-end',
            background: '#bfa76a',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            fontWeight: 700,
            fontSize: 22,
            zIndex: 30,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(191, 167, 106, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            padding: 0,
            marginBottom: 10
          }}
          aria-label="Fermer"
        >×</button>

        <form
          data-recipe-form="true"
          onSubmit={e => {
            e.preventDefault();
            const error = validateForm();
            if (error) {
              setFormError(error);
              return;
            }
            setFormError(null);
            onSave({
              id: initial?.id || Date.now().toString(),
              nom,
              categorie,
              tags: selectedTags,
              tempsPreparation: tempsPreparation ? parseInt(tempsPreparation) : undefined,
              tempsCuisson: tempsCuisson ? parseInt(tempsCuisson) : undefined,
              ingredients: ingredients.map(ing => ({
                ingredientId: ing.ingredientId,
                quantite: Number(ing.quantite),
                unite: ing.unite
              })),
              ingredientsOptionnels: ingredientsOptionnels.map(ing => ({
                ingredientId: ing.ingredientId,
                quantite: Number(ing.quantite),
                unite: ing.unite
              })),
              etapes: etapes.filter(e => e.trim() !== ""),
              nutrition: ([calories, proteines, glucides, lipides].every(v => v !== '' && !isNaN(Number(v)))) ? {
                calories: Number(calories),
                proteines: Number(proteines),
                glucides: Number(glucides),
                lipides: Number(lipides),
                ...(fibres !== '' && !isNaN(Number(fibres)) ? { fibres: Number(fibres) } : {})
              } : undefined,
            });
          }}
          style={{
            background: 'none',
            padding: '0 24px 24px 24px',
            borderRadius: 0,
            maxWidth: 600,
            margin: '0 auto 2rem auto',
            fontFamily: 'inherit',
            color: '#3a2d13',
            flex: 1
          }}
        >
          {formError && (
            <div style={{ color: '#dc3545', fontWeight: 700, marginBottom: 12, fontSize: 15, textAlign: 'center' }}>{formError}</div>
          )}
          <h3 style={{ marginBottom: 28, color: '#bfa76a', fontWeight: 700, letterSpacing: 1, fontSize: 22, textAlign: 'center' }}>
            {initial ? "Modifier" : "Ajouter"} une recette
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <label style={{ marginBottom: 0, fontWeight: 700, fontSize: 16 }}>Nom
              <input 
                value={nom} 
                onChange={e => { setNom(e.target.value); markDirty(); }} 
                placeholder="Nom" 
                style={{ ...inputStyle, fontWeight: 700, fontSize: 18, padding: '12px 10px' }} 
                required 
              />
            </label>
            <label style={{ fontWeight: 700, fontSize: 16 }}>Catégorie
              <select 
                value={categorie} 
                onChange={e => { setCategorie(e.target.value); markDirty(); }} 
              >
                <option value="">Choisir une catégorie</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </label>
            <label style={{ fontWeight: 700, fontSize: 16 }}>Tags
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                {TAGS.map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => { handleTagToggle(tag); markDirty(); }}
                    style={{
                      background: selectedTags.includes(tag) ? '#bfa76a' : '#fffbe7',
                      color: selectedTags.includes(tag) ? '#fff' : '#3a2d13',
                      border: '1.5px solid #bfa76a',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: 13,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      opacity: 0.95
                    }}
                  >{tag}</button>
                ))}
              </div>
            </label>
            <label style={{ fontWeight: 700, fontSize: 16 }}>Temps préparation (min)
              <input 
                type="number" 
                min="0" 
                value={tempsPreparation} 
                onChange={e => { setTempsPreparation(e.target.value); markDirty(); }} 
                style={inputStyle} 
              />
            </label>
            <label style={{ fontWeight: 700, fontSize: 16 }}>Temps cuisson (min)
              <input 
                type="number" 
                min="0" 
                value={tempsCuisson} 
                onChange={e => { setTempsCuisson(e.target.value); markDirty(); }} 
                style={inputStyle} 
              />
            </label>
            <label style={{ fontWeight: 700, fontSize: 16 }}>Valeurs nutritionnelles (par portion)
              <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    min="0" 
                    value={calories} 
                    onChange={e => { setCalories(e.target.value); markDirty(); }} 
                    placeholder="kcal" 
                    style={{ width: 80, background: '#fffbe7', border: '1.5px solid #bfa76a', borderRadius: 6, padding: '6px 8px', fontSize: 14 }} 
                  />
                  <span style={{ fontSize: 12, color: '#3a2d13', marginTop: 2 }}>Calories</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    min="0" 
                    value={proteines} 
                    onChange={e => { setProteines(e.target.value); markDirty(); }} 
                    placeholder="prot" 
                    style={{ width: 80, background: '#fffbe7', border: '1.5px solid #bfa76a', borderRadius: 6, padding: '6px 8px', fontSize: 14 }} 
                  />
                  <span style={{ fontSize: 12, color: '#3a2d13', marginTop: 2 }}>Protéines</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    min="0" 
                    value={glucides} 
                    onChange={e => { setGlucides(e.target.value); markDirty(); }} 
                    placeholder="gluc" 
                    style={{ width: 80, background: '#fffbe7', border: '1.5px solid #bfa76a', borderRadius: 6, padding: '6px 8px', fontSize: 14 }} 
                  />
                  <span style={{ fontSize: 12, color: '#3a2d13', marginTop: 2 }}>Glucides</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    min="0" 
                    value={lipides} 
                    onChange={e => { setLipides(e.target.value); markDirty(); }} 
                    placeholder="lip" 
                    style={{ width: 80, background: '#fffbe7', border: '1.5px solid #bfa76a', borderRadius: 6, padding: '6px 8px', fontSize: 14 }} 
                  />
                  <span style={{ fontSize: 12, color: '#3a2d13', marginTop: 2 }}>Lipides</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    min="0" 
                    value={fibres} 
                    onChange={e => { setFibres(e.target.value); markDirty(); }} 
                    placeholder="fibres" 
                    style={{ width: 80, background: '#fffbe7', border: '1.5px solid #bfa76a', borderRadius: 6, padding: '6px 8px', fontSize: 14 }} 
                  />
                  <span style={{ fontSize: 12, color: '#3a2d13', marginTop: 2 }}>Fibres</span>
                </div>
              </div>
            </label>
          </div>
          <hr style={{ margin: '18px 0' }} />
          
          {/* Ingrédients principaux encadré */}
          <div style={{ background: '#fffbe7', border: '2px solid #bfa76a', borderRadius: 10, padding: '12px 10px 10px 10px', marginBottom: 18 }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#3a2d13', fontSize: 16 }}>Ingrédients principaux</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 1fr 32px', fontWeight: 700, color: '#3a2d13', marginBottom: 8, fontSize: 15, gap: '0 8px' }}>
              <span>Ingrédient</span>
              <span style={{ paddingLeft: 4 }}>Quantité</span>
              <span>Unité</span>
              <span></span>
            </div>
            {ingredients.map((ing, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 1fr 32px', gap: '8px', marginBottom: 4, alignItems: 'center' }}>
                <input 
                  value={ing.ingredientId} 
                  onChange={e => handleIngredientChange(idx, 'ingredientId', e.target.value)} 
                  placeholder="Nom ou id" 
                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #bfa76a', borderRadius: 4, fontSize: 14 }} 
                />
                <input 
                  type="number" 
                  min="0" 
                  value={ing.quantite} 
                  onChange={e => handleIngredientChange(idx, 'quantite', e.target.value)} 
                  placeholder="Quantité" 
                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #bfa76a', borderRadius: 4, fontSize: 14 }} 
                />
                <input 
                  value={ing.unite} 
                  onChange={e => handleIngredientChange(idx, 'unite', e.target.value)} 
                  placeholder="Unité" 
                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #bfa76a', borderRadius: 4, fontSize: 14 }} 
                />
                <button 
                  type="button" 
                  onClick={() => removeIngredient(idx)} 
                  style={{ color: '#dc3545', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}
                >🗑️</button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addIngredient} 
              style={{ color: '#28a745', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', marginBottom: 8, marginTop: 4 }}
            >+ Ajouter ingrédient</button>
          </div>
          
          {/* Ingrédients optionnels encadré */}
          <div style={{ background: '#fffbe7', border: '2px solid #bfa76a', borderRadius: 10, padding: '12px 10px 10px 10px', marginBottom: 18 }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#3a2d13', fontSize: 16 }}>Ingrédients optionnels</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 1fr 32px', fontWeight: 700, color: '#3a2d13', marginBottom: 8, fontSize: 15, gap: '0 8px' }}>
              <span>Ingrédient</span>
              <span style={{ paddingLeft: 4 }}>Quantité</span>
              <span>Unité</span>
              <span></span>
            </div>
            {ingredientsOptionnels.map((ing, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 1fr 32px', gap: '8px', marginBottom: 4, alignItems: 'center' }}>
                <input 
                  value={ing.ingredientId} 
                  onChange={e => handleIngredientOptChange(idx, 'ingredientId', e.target.value)} 
                  placeholder="Nom ou id" 
                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #bfa76a', borderRadius: 4, fontSize: 14 }} 
                />
                <input 
                  type="number" 
                  min="0" 
                  value={ing.quantite} 
                  onChange={e => handleIngredientOptChange(idx, 'quantite', e.target.value)} 
                  placeholder="Quantité" 
                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #bfa76a', borderRadius: 4, fontSize: 14 }} 
                />
                <input 
                  value={ing.unite} 
                  onChange={e => handleIngredientOptChange(idx, 'unite', e.target.value)} 
                  placeholder="Unité" 
                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #bfa76a', borderRadius: 4, fontSize: 14 }} 
                />
                <button 
                  type="button" 
                  onClick={() => removeIngredientOpt(idx)} 
                  style={{ color: '#dc3545', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}
                >🗑️</button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addIngredientOpt} 
              style={{ color: '#28a745', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', marginBottom: 8, marginTop: 4 }}
            >+ Ajouter ingrédient optionnel</button>
          </div>
          
          {/* Étapes encadré */}
          <div style={{ background: '#fffbe7', border: '2px solid #bfa76a', borderRadius: 10, padding: '12px 10px 10px 10px', marginBottom: 18 }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#3a2d13', fontSize: 16 }}>Étapes</h4>
            {etapes.map((et, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 32px', gap: 8, marginBottom: 4, alignItems: 'center' }}>
                <textarea 
                  value={et} 
                  onChange={e => handleEtapeChange(idx, e.target.value)} 
                  placeholder={`Étape ${idx + 1}`} 
                  style={{ width: '100%', minHeight: 32, resize: 'vertical', padding: '6px 8px', border: '1px solid #bfa76a', borderRadius: 4, fontSize: 14 }} 
                />
                <button 
                  type="button" 
                  onClick={() => removeEtape(idx)} 
                  style={{ color: '#dc3545', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}
                >🗑️</button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addEtape} 
              style={{ color: '#28a745', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', marginBottom: 8, marginTop: 4 }}
            >+ Ajouter étape</button>
          </div>
          
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 18 }}>
            <button 
              type="button" 
              onClick={onCancel} 
              style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', cursor: 'pointer' }}
            >Annuler</button>
            <button 
              type="submit" 
              style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', cursor: 'pointer' }}
            >Enregistrer</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(45deg, #8b4513, #a0522d)',
      border: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      zIndex: 1000,
      overflow: 'auto',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      fontFamily: 'Press Start 2P, cursive',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '1.5rem', right: '2rem',
        background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px',
        padding: '0.7rem 1.3rem', cursor: 'pointer', fontSize: '1.2rem', zIndex: 10
      }}>×</button>
      
      {/* Modal for add/edit */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.45)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div
            onClick={e => e.stopPropagation()}
            className="custom-scrollbar"
            style={{
              maxHeight: '90vh',
              minWidth: 320,
              maxWidth: 700,
              width: '98vw',
              margin: '0 auto',
              overflowY: 'auto',
              background: '#f8f3d4',
              borderRadius: 18,
              boxShadow: '0 2px 32px #bfa76a55',
              border: '3px solid #bfa76a',
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <RecetteForm
              initial={editing || undefined}
              onSave={r => {
                if (editing) editRecette(editing.id, r); else addRecette(r);
                setShowForm(false); setEditing(null);
              }}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        </div>
      )}
      
      {/* Main recipe UI */}
      <RecettesResponsive
        recettes={recettes}
        onEdit={recette => { setEditing(recette); setShowForm(true); }}
        onDelete={id => deleteRecette(id)}
        onAdd={() => { setEditing(null); setShowForm(true); }}
      />
    </div>
  );
}