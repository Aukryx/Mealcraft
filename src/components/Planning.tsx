import React, { useState, useEffect } from "react";

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

  // Pour l'esquisse, on simule un planning vide
  const [planning, setPlanning] = useState<{ [day: number]: { lunch?: string; dinner?: string } }>({});

  // Modal pour afficher le détail d'un jour
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Ajoute un pseudo-élément pour flouter uniquement le background
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
        background: url('/cuisine.png') center/cover no-repeat;
        filter: blur(3px);
        opacity: 1;
        pointer-events: none;
      }
      body { background: var(--pixel-yellow) !important; }
    `;
    document.head.appendChild(style);
    return () => {
      const s = document.getElementById('planning-bg-blur');
      if (s) s.remove();
    };
  }, []);

  // Génère la grille du calendrier (commence lundi)
  const firstDay = new Date(displayedYear, displayedMonth, 1).getDay() || 7; // 1 = lundi, 7 = dimanche
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay - 1).fill(null);
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

  return (
    <div style={{ width: '100%', maxWidth: 700, margin: '0 auto', padding: '2rem 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: '1.5rem' }}>
        <button
          onClick={() => {
            if (!canGoPrev) return;
            if (displayedMonth === 0) {
              setDisplayedMonth(11);
              setDisplayedYear(y => y - 1);
            } else {
              setDisplayedMonth(m => m - 1);
            }
          }}
          disabled={!canGoPrev}
          style={{
            background: 'none',
            border: 'none',
            color: canGoPrev ? 'var(--pixel-mint)' : '#bbb',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '1.2rem',
            cursor: canGoPrev ? 'pointer' : 'not-allowed',
            opacity: canGoPrev ? 1 : 0.4,
            padding: 0,
            marginRight: 8,
            userSelect: 'none',
          }}
          title={canGoPrev ? 'Mois précédent' : 'Non accessible'}
        >
          ◀
        </button>
        <h2 style={{
          color: 'var(--pixel-pink)',
          margin: 0,
          textAlign: 'center',
          textShadow: '-2px -2px 0 #222, 2px -2px 0 #222, -2px 2px 0 #222, 2px 2px 0 #222',
          fontSize: '1.2rem',
        }}>
          Planning des repas — {new Date(displayedYear, displayedMonth).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => {
            if (displayedMonth === 11) {
              setDisplayedMonth(0);
              setDisplayedYear(y => y + 1);
            } else {
              setDisplayedMonth(m => m + 1);
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--pixel-mint)',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '1.2rem',
            cursor: 'pointer',
            marginLeft: 8,
            userSelect: 'none',
          }}
          title="Mois suivant"
        >
          ▶
        </button>
      </div>
      <div
        style={{
          background: 'rgba(255, 230, 60, 0.9)', // plus transparent
          borderRadius: '32px',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.13), 0 2px 0 var(--pixel-mint)',
          padding: '2.2rem 2.2rem 2.5rem 2.2rem',
          marginBottom: '2.5rem',
          width: '100%',
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '2.35rem',
          marginBottom: '1rem',
          fontFamily: 'Press Start 2P, cursive',
          fontSize: '1rem',
          textAlign: 'center',
          padding: 0,
          width: '100%',
        }}>
          {joursSemaine.map(j => (
            <div
              key={j}
              style={{
                color: 'var(--pixel-lavender)',
                padding: 0,
                margin: 0,
                textShadow: '-2px -2px 0 #222, 2px -2px 0 #222, -2px 2px 0 #222, 2px 2px 0 #222',
              }}
            >
              {j}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '1.2rem', width: '100%' }}>
          {weeks.flat().map((day, i) => {
            if (!day) return <div key={i} />;
            // Date du jour courant dans la grille
            const cellDate = new Date(displayedYear, displayedMonth, day);
            let isPast = false;
            if (displayedYear < today.getFullYear() || (displayedYear === today.getFullYear() && displayedMonth < today.getMonth())) {
              isPast = true;
            } else if (displayedYear === today.getFullYear() && displayedMonth === today.getMonth() && day < today.getDate()) {
              isPast = true;
            }
            return (
              <button
                key={i}
                style={{
                  background: isPast ? 'rgba(220,220,220,0.7)' : 'rgba(255,250,205,0.95)',
                  border: isPast ? '2px dashed #bbb' : '2px solid var(--pixel-mint)',
                  borderRadius: '50%',
                  width: 54,
                  height: 54,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '1.1rem',
                  color: isPast ? '#bbb' : 'var(--pixel-pink)',
                  boxShadow: isPast ? 'none' : '2px 2px 0 var(--pixel-yellow)',
                  position: 'relative',
                  cursor: isPast ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  transition: 'transform 0.1s',
                  padding: 0,
                  margin: 0,
                  opacity: isPast ? 0.6 : 1,
                  pointerEvents: isPast ? 'none' : 'auto',
                }}
                title={isPast ? 'Jour passé' : `Voir le détail du ${day}`}
                onClick={isPast ? undefined : () => setSelectedDay(day)}
                disabled={isPast}
              >
                <span style={{ fontSize: '1.2em', marginRight: 4, opacity: isPast ? 0.5 : 1 }}>🍽️</span>
                <span style={{
                  position: 'absolute',
                  left: 0, right: 0, top: 0, bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9em',
                  color: isPast ? '#bbb' : 'var(--pixel-pink)',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                  textShadow: isPast ? 'none' : '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff',
                }}>{day}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2.5rem' }}>
        <button style={{
          background: 'var(--pixel-mint)',
          color: 'var(--pixel-dark)',
          fontFamily: 'Press Start 2P, cursive',
          border: 'none',
          borderRadius: '8px',
          padding: '1rem 1.5rem',
          fontSize: '1rem',
          boxShadow: '2px 2px 0 var(--pixel-blue)',
          cursor: 'pointer',
        }}>
          Générer la semaine
        </button>
        <button style={{
          background: 'var(--pixel-yellow)',
          color: 'var(--pixel-dark)',
          fontFamily: 'Press Start 2P, cursive',
          border: 'none',
          borderRadius: '8px',
          padding: '1rem 1.5rem',
          fontSize: '1rem',
          boxShadow: '2px 2px 0 var(--pixel-orange)',
          cursor: 'pointer',
        }}>
          Générer le mois
        </button>
      </div>

      {/* Modal détail du jour */}
      {selectedDay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.35)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setSelectedDay(null)}
        >
          <div
            style={{
              background: 'rgba(255,250,205,0.98)',
              border: '2px solid var(--pixel-mint)',
              borderRadius: 18,
              minWidth: 320,
              maxWidth: '90vw',
              padding: '2.5rem 2rem 2rem 2rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
              fontFamily: 'Press Start 2P, cursive',
              position: 'relative',
              textAlign: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '1.2rem', color: 'var(--pixel-pink)', marginBottom: 16 }}>
              Détail du {selectedDay} {today.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
            </div>
            <div style={{ color: 'var(--pixel-dark)', fontSize: '0.9rem', marginBottom: 10 }}>
              🥗 {planning[selectedDay]?.lunch || <span style={{ opacity: 0.3 }}>Déjeuner non renseigné</span>}
            </div>
            <div style={{ color: 'var(--pixel-dark)', fontSize: '0.9rem', marginBottom: 18 }}>
              🍽️ {planning[selectedDay]?.dinner || <span style={{ opacity: 0.3 }}>Dîner non renseigné</span>}
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              style={{
                background: 'var(--pixel-mint)',
                color: 'var(--pixel-dark)',
                fontFamily: 'Press Start 2P, cursive',
                border: 'none',
                borderRadius: 8,
                padding: '0.7rem 1.2rem',
                fontSize: '1rem',
                boxShadow: '2px 2px 0 var(--pixel-blue)',
                cursor: 'pointer',
                marginTop: 8,
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
