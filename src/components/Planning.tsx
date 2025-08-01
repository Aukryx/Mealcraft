import React, { useState, useEffect } from "react";
import { usePlanning, PlanningEntry } from "../hooks/usePlanning";
import { useRecettes } from "../hooks/useRecettes";
import { useStock } from "../hooks/useStock";
import { useUserProfile } from "../hooks/useUserProfile";
import { CozyCookingMode } from "./CozyCookingMode";
import { Recette } from "../data/recettesDeBase";

// Génère les jours du mois courant
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const joursSemaine = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function Planning() {
  const today = new Date();
  const [displayedYear, setDisplayedYear] = useState(today.getFullYear());
  const [displayedMonth, setDisplayedMonth] = useState(today.getMonth());
  const daysInMonth = getDaysInMonth(displayedYear, displayedMonth);

  const { 
    planning, 
    addMultipleToPlanning,
    removeFromPlanning, 
    confirmSuggestion,
    calculateRecipeScore 
  } = usePlanning();
  
  const { recettes } = useRecettes();
  const { consumeRecipeIngredients } = useStock();
  const { profile } = useUserProfile();

  // Modal pour afficher le détail d'un jour
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [cookingRecipe, setCookingRecipe] = useState<Recette | null>(null);
  const [selectedDaysForGeneration, setSelectedDaysForGeneration] = useState<string[]>([]);

  // Background plus lisible pour le planning
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'planning-bg-blur';
    style.innerHTML = `
      body::before {
        content: '';
        position: fixed;
        z-index: -1;
        top: 0; left: 0; right: 0; bottom: 0;
        width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%);
        opacity: 0.95;
        pointer-events: none;
      }
      body { 
        background: #1a202c !important; 
        color: #e2e8f0 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const s = document.getElementById('planning-bg-blur');
      if (s) s.remove();
    };
  }, []);

  // Générer automatiquement pour les jours sélectionnés
  const generateForSelectedDays = () => {
    if (selectedDaysForGeneration.length === 0) return;
    
    console.log('🎯 Génération pour les jours sélectionnés:', selectedDaysForGeneration);
    
    const entries: Omit<PlanningEntry, 'id'>[] = [];
    const usedRecettes: string[] = [];
    
    selectedDaysForGeneration.forEach(dateStr => {
      ['lunch', 'dinner'].forEach((meal) => {
        if (recettes.length > 0) {
          // Filtrer les recettes pour éviter les répétitions
          const availableRecettes = recettes.filter(r => {
            const recentUses = usedRecettes.slice(-3);
            return !recentUses.includes(r.id);
          });

          const recettesToUse = availableRecettes.length > 0 ? availableRecettes : recettes;

          // Trier par score de compatibilité avec le stock
          const scored = recettesToUse
            .map(r => ({ recette: r, score: calculateRecipeScore(r) }))
            .sort((a, b) => b.score - a.score);

          // Prendre une des 5 meilleures
          const topChoices = scored.slice(0, Math.min(5, scored.length));
          const chosen = topChoices[Math.floor(Math.random() * topChoices.length)];

          if (chosen) {
            console.log(`✅ ${dateStr} ${meal}: ${chosen.recette.nom}`);
            
            entries.push({
              date: dateStr,
              meal: meal as 'lunch' | 'dinner',
              recetteId: chosen.recette.id,
              recetteName: chosen.recette.nom,
              generated: true,
              confirmed: false
            });

            usedRecettes.push(chosen.recette.id);
            if (usedRecettes.length > 6) {
              usedRecettes.shift();
            }
          }
        }
      });
    });
    
    console.log('📝 Génération terminée:', entries.length, 'repas créés');
    addMultipleToPlanning(entries);
    
    setShowGenerationModal(false);
    setSelectedDaysForGeneration([]);
  };

  // Générer les dates disponibles (du jour actuel aux 30 prochains jours)
  const getAvailableDates = () => {
    const dates: { date: string; displayName: string; isToday: boolean; hasPlanning: boolean }[] = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayName = date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
      
      dates.push({
        date: dateStr,
        displayName: dayName,
        isToday: i === 0,
        hasPlanning: !!planning[dateStr]?.lunch || !!planning[dateStr]?.dinner
      });
    }
    
    return dates;
  };

  // Gérer la sélection/désélection des jours
  const toggleDaySelection = (dateStr: string) => {
    setSelectedDaysForGeneration(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
  };

  // Raccourcis pour sélection rapide
  const selectNext7Days = () => {
    const dates = getAvailableDates().slice(0, 7).map(d => d.date);
    setSelectedDaysForGeneration(dates);
  };

  const selectWeekdays = () => {
    const dates = getAvailableDates().slice(0, 14).filter(d => {
      const date = new Date(d.date);
      const dayOfWeek = date.getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Lundi à vendredi
    }).map(d => d.date);
    setSelectedDaysForGeneration(dates);
  };

  // Génère la grille du calendrier (commence lundi)
  const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1).getDay();
  // Convertir pour que lundi = 0, mardi = 1, ..., dimanche = 6
  const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)]);

  // Pour la pagination : ne pas aller avant le mois/année courants
  const isCurrentMonth = displayedYear === today.getFullYear() && displayedMonth === today.getMonth();
  const canGoPrev = !isCurrentMonth;
  const canGoNext = true;

  // Fonctions pour le mode cuisine
  const startCooking = (recetteName: string) => {
    const recette = recettes.find(r => r.nom === recetteName);
    if (recette) {
      setCookingRecipe(recette);
      setSelectedDay(null); // Fermer le modal du jour
    }
  };

  const finishCooking = (portions?: number) => {
    if (cookingRecipe && profile) {
      // Consommer les ingrédients si on est en mode réel
      if (profile.preferences.consommationMode === 'reel') {
        const actualPortions = portions || profile.preferences.portionsParDefaut;
        const success = consumeRecipeIngredients(cookingRecipe, actualPortions);
        
        if (!success) {
          console.warn('Impossible de consommer tous les ingrédients - stock insuffisant');
          // On continue quand même, mais on pourrait afficher un avertissement
        } else {
          console.log(`✅ Ingrédients consommés du stock pour ${actualPortions} portions`);
        }
      }
    }
    
    setCookingRecipe(null);
    // Optionnel : marquer le repas comme cuisiné dans le planning
  };

  // Mode cuisine actif
  if (cookingRecipe) {
    return (
      <CozyCookingMode 
        recette={cookingRecipe} 
        onComplete={finishCooking}
        onCancel={finishCooking}
      />
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 700, margin: '0 auto', padding: '2rem 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* En-tête avec génération automatique */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <button
          onClick={() => setShowGenerationModal(true)}
          style={{
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.6rem',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          🍽️ Planifier mes repas
        </button>
        
        <div style={{ fontSize: '0.7rem', color: '#a0aec0', textAlign: 'center' }}>
          📊 {Object.keys(planning).length} jours planifiés
        </div>
      </div>

      {/* Navigation du mois */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%',
        marginBottom: '1rem'
      }}>
        <button
          onClick={() => {
            if (displayedMonth === 0) {
              setDisplayedMonth(11);
              setDisplayedYear(displayedYear - 1);
            } else {
              setDisplayedMonth(displayedMonth - 1);
            }
          }}
          disabled={!canGoPrev}
          style={{
            background: canGoPrev ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#4a5568',
            color: canGoPrev ? 'white' : '#a0aec0',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.6rem',
            cursor: canGoPrev ? 'pointer' : 'not-allowed',
            boxShadow: canGoPrev ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          ← Précédent
        </button>
        
        <h2 style={{ 
          fontFamily: 'Press Start 2P, cursive', 
          fontSize: '0.8rem', 
          margin: 0,
          background: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {new Date(displayedYear, displayedMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>
        
        <button
          onClick={() => {
            if (displayedMonth === 11) {
              setDisplayedMonth(0);
              setDisplayedYear(displayedYear + 1);
            } else {
              setDisplayedMonth(displayedMonth + 1);
            }
          }}
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.6rem',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Suivant →
        </button>
      </div>

      {/* Grille du calendrier */}
      <div style={{
        background: 'rgba(45, 55, 72, 0.9)',
        borderRadius: '16px',
        padding: '1rem',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* En-têtes des jours */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          {joursSemaine.map(jour => (
            <div 
              key={jour} 
              style={{
                padding: '0.5rem',
                textAlign: 'center',
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.5rem',
                color: '#ffd93d',
                background: 'rgba(255, 217, 61, 0.1)',
                borderRadius: '8px'
              }}
            >
              {jour}
            </div>
          ))}
        </div>

        {/* Semaines */}
        {weeks.map((week, weekIndex) => (
          <div 
            key={weekIndex}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            {week.map((day, dayIndex) => {
              if (day === null) {
                return <div key={`empty-${weekIndex}-${dayIndex}`} style={{ height: '60px' }} />;
              }

              const dateStr = `${displayedYear}-${String(displayedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayPlanning = planning[dateStr];
              const isToday = 
                today.getDate() === day && 
                today.getMonth() === displayedMonth && 
                today.getFullYear() === displayedYear;
              const isPast = new Date(dateStr) < new Date(today.toISOString().split('T')[0]);

              const hasLunch = dayPlanning?.lunch;
              const hasDinner = dayPlanning?.dinner;
              const hasAnyMeal = hasLunch || hasDinner;

              return (
                <div
                  key={`day-${displayedYear}-${displayedMonth}-${day}`}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    height: '60px',
                    background: isToday 
                      ? 'linear-gradient(135deg, #ffd93d, #ffad3d)' 
                      : hasAnyMeal
                        ? 'linear-gradient(135deg, #6bcf7f, #4CAF50)'
                        : isPast
                          ? 'rgba(74, 85, 104, 0.5)'
                          : 'rgba(226, 232, 240, 0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: isToday ? '2px solid #ff6b6b' : '2px solid transparent',
                    opacity: isPast ? 0.6 : 1,
                    boxShadow: hasAnyMeal ? '0 4px 12px rgba(76, 175, 80, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={e => {
                    if (!isPast) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                    }
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = hasAnyMeal ? '0 4px 12px rgba(76, 175, 80, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    fontFamily: 'Press Start 2P, cursive',
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                    color: isToday ? '#2d3748' : '#e2e8f0'
                  }}>
                    {day}
                  </div>
                  
                  {hasAnyMeal && (
                    <div style={{
                      display: 'flex',
                      gap: '2px',
                      marginTop: '2px'
                    }}>
                      {hasLunch && <span style={{ fontSize: '0.5rem' }}>🥗</span>}
                      {hasDinner && <span style={{ fontSize: '0.5rem' }}>🍽️</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Modal de génération automatique avec sélection de jours */}
      {showGenerationModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowGenerationModal(false);
              setSelectedDaysForGeneration([]);
            }
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #2d3748, #4a5568)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.8rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🍽️ Sélectionnez les jours à planifier
            </h3>

            {/* Raccourcis de sélection */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button
                onClick={selectNext7Days}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                📅 7 prochains jours
              </button>
              
              <button
                onClick={selectWeekdays}
                style={{
                  background: 'linear-gradient(135deg, #ff7675, #fd79a8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                🏢 Jours ouvrés
              </button>
              
              <button
                onClick={() => setSelectedDaysForGeneration([])}
                style={{
                  background: 'rgba(74, 85, 104, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                🗑️ Tout désélectionner
              </button>
            </div>

            {/* Liste des jours disponibles */}
            <div style={{
              maxHeight: '300px',
              overflow: 'auto',
              marginBottom: '1.5rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              {getAvailableDates().map(({ date, displayName, isToday, hasPlanning }) => (
                <label
                  key={date}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    background: selectedDaysForGeneration.includes(date) 
                      ? 'rgba(76, 175, 80, 0.3)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: isToday ? '2px solid #ffd93d' : '2px solid transparent'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseOut={e => {
                    e.currentTarget.style.background = selectedDaysForGeneration.includes(date) 
                      ? 'rgba(76, 175, 80, 0.3)' 
                      : 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedDaysForGeneration.includes(date)}
                    onChange={() => toggleDaySelection(date)}
                    style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'Press Start 2P, cursive',
                      fontSize: '0.6rem',
                      color: isToday ? '#ffd93d' : '#e2e8f0'
                    }}>
                      {displayName} {isToday ? '(Aujourd\'hui)' : ''}
                    </div>
                    
                    {hasPlanning && (
                      <div style={{
                        fontSize: '0.5rem',
                        color: '#ff7675',
                        marginTop: '0.25rem'
                      }}>
                        ⚠️ Déjà planifié (sera remplacé)
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  setShowGenerationModal(false);
                  setSelectedDaysForGeneration([]);
                }}
                style={{
                  background: 'rgba(74, 85, 104, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.6rem',
                  cursor: 'pointer'
                }}
              >
                ❌ Annuler
              </button>
              
              <button
                onClick={generateForSelectedDays}
                disabled={selectedDaysForGeneration.length === 0}
                style={{
                  background: selectedDaysForGeneration.length > 0 
                    ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
                    : 'rgba(74, 85, 104, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.6rem',
                  cursor: selectedDaysForGeneration.length > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                ✨ Générer ({selectedDaysForGeneration.length} jours)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détail d'un jour */}
      {selectedDay && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedDay(null);
            }
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #2d3748, #4a5568)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.8rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              📅 {selectedDay} {new Date(displayedYear, displayedMonth).toLocaleDateString('fr-FR', { month: 'long' })}
            </h3>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'Press Start 2P, cursive', fontSize: '0.6rem', color: '#ffd93d', marginBottom: '0.5rem' }}>
                  🥗 Déjeuner:
                </div>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontSize: '0.7rem',
                  color: '#e2e8f0'
                }}>
                  {(() => {
                    const dateStr = `${displayedYear}-${String(displayedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                    const lunchEntry = planning[dateStr]?.lunch;
                    return lunchEntry ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{lunchEntry.recetteName}</span>
                        <button
                          onClick={() => startCooking(lunchEntry.recetteName)}
                          style={{
                            background: 'linear-gradient(135deg, #ff7675, #fd79a8)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            fontFamily: 'Press Start 2P, cursive',
                            fontSize: '0.4rem',
                            cursor: 'pointer'
                          }}
                        >
                          👨‍🍳 Cuisiner
                        </button>
                      </div>
                    ) : (
                      <span style={{ opacity: 0.5 }}>Déjeuner non planifié</span>
                    );
                  })()}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'Press Start 2P, cursive', fontSize: '0.6rem', color: '#ffd93d', marginBottom: '0.5rem' }}>
                  🍽️ Dîner:
                </div>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontSize: '0.7rem',
                  color: '#e2e8f0'
                }}>
                  {(() => {
                    const dateStr = `${displayedYear}-${String(displayedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                    const dinnerEntry = planning[dateStr]?.dinner;
                    return dinnerEntry ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{dinnerEntry.recetteName}</span>
                        <button
                          onClick={() => startCooking(dinnerEntry.recetteName)}
                          style={{
                            background: 'linear-gradient(135deg, #ff7675, #fd79a8)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            fontFamily: 'Press Start 2P, cursive',
                            fontSize: '0.4rem',
                            cursor: 'pointer'
                          }}
                        >
                          👨‍🍳 Cuisiner
                        </button>
                      </div>
                    ) : (
                      <span style={{ opacity: 0.5 }}>Dîner non planifié</span>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setSelectedDay(null)}
                style={{
                  background: 'rgba(74, 85, 104, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.6rem',
                  cursor: 'pointer'
                }}
              >
                ✅ Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
