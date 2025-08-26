import React, { useState, useEffect } from 'react';
import { Recette } from '../data/recettesDeBase';
import { useUserProfile } from '../hooks/useUserProfile';

interface CozyCookingModeProps {
  recette: Recette;
  onComplete: (portions: number) => void;
  onCancel: () => void;
}

export const CozyCookingMode: React.FC<CozyCookingModeProps> = ({
  recette,
  onComplete,
  onCancel
}) => {
  const { profile } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [portions, setPortions] = useState(profile?.preferences.portionsParDefaut || 2);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerActive && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === null || prevTimer <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (minutes: number) => {
    setTimer(minutes * 60);
    setIsTimerActive(true);
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setTimer(null);
    setIsTimerActive(false);
  };

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const allStepsCompleted = completedSteps.length === recette.etapes.length;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #FFF6B7, #FFD6A5)',
        zIndex: 1000,
        overflow: 'auto',
        padding: '2rem'
      }}
    >
      {/* Header avec style cozy */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={onCancel} 
          style={{
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.7rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          🏠 Retour au livre
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '1.5rem',
            color: '#8b4513',
            margin: 0,
            marginBottom: '0.5rem'
          }}>🍳 {recette.nom}</h1>
          <div style={{
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '0.8rem',
            color: '#666'
          }}>
            {recette.tempsPreparation ? `⏰ ${recette.tempsPreparation}min` : ''} 
            {recette.tempsCuisson ? ` • 🔥 ${recette.tempsCuisson}min` : ''}
          </div>
          
          {/* Sélecteur de portions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <span style={{
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.7rem',
              color: '#8b4513'
            }}>👥 Portions:</span>
            <button 
              onClick={() => setPortions(Math.max(1, portions - 1))}
              disabled={portions <= 1}
              style={{
                background: portions <= 1 ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem',
                cursor: portions <= 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.6rem'
              }}
            >
              -
            </button>
            <span style={{
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '1rem',
              color: '#8b4513',
              minWidth: '2rem',
              textAlign: 'center'
            }}>{portions}</span>
            <button 
              onClick={() => setPortions(portions + 1)}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem',
                cursor: 'pointer',
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.6rem'
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Timer Section cozy */}
      {timer !== null && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '2rem' }}>⏰</div>
            <div style={{
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '2rem',
              color: timer === 0 ? '#ff6b6b' : '#4CAF50',
              fontWeight: 'bold'
            }}>
              {formatTime(timer)}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={toggleTimer} 
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                {isTimerActive ? '⏸️' : '▶️'}
              </button>
              <button 
                onClick={resetTimer} 
                style={{
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                🔄
              </button>
            </div>
            {timer === 0 && (
              <div style={{
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.8rem',
                color: '#ff6b6b',
                marginTop: '1rem',
                padding: '0.5rem',
                background: '#fff',
                borderRadius: '8px',
                border: '2px solid #ff6b6b'
              }}>
                🎉 C&apos;est prêt ! Vérifiez votre plat 
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Timers cozy */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          fontFamily: 'Press Start 2P, cursive',
          fontSize: '0.9rem',
          color: '#8b4513',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>⏱️ Minuteurs rapides :</div>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => startTimer(1)} 
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >1min</button>
          <button 
            onClick={() => startTimer(5)} 
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >5min</button>
          <button 
            onClick={() => startTimer(10)} 
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >10min</button>
          <button 
            onClick={() => startTimer(15)} 
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >15min</button>
        </div>
      </div>

      {/* Ingredients List cozy */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontFamily: 'Press Start 2P, cursive',
          fontSize: '1.2rem',
          color: '#8b4513',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>📝 Mes ingrédients</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '0.75rem'
        }}>
          {recette.ingredients.map((ing, index) => (
            <div key={index} style={{
              background: '#f8f9fa',
              borderRadius: '8px',
              padding: '1rem',
              border: '2px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}>
              <span style={{
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.7rem',
                color: '#4CAF50',
                fontWeight: 'bold'
              }}>
                {(ing.quantite * portions).toFixed(ing.quantite % 1 === 0 ? 0 : 1)} {ing.unite}
              </span>
              <span style={{
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.6rem',
                color: '#8b4513'
              }}>{ing.ingredientId}</span>
            </div>
          ))}
          {recette.ingredientsOptionnels?.map((ing, index) => (
            <div key={`opt-${index}`} style={{
              background: '#fff3cd',
              borderRadius: '8px',
              padding: '1rem',
              border: '2px solid #ffeaa7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s',
              opacity: 0.8
            }}>
              <span style={{
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.7rem',
                color: '#f39c12',
                fontWeight: 'bold'
              }}>
                {(ing.quantite * portions).toFixed(ing.quantite % 1 === 0 ? 0 : 1)} {ing.unite}
              </span>
              <span style={{
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.6rem',
                color: '#8b4513'
              }}>{ing.ingredientId} ✨</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cooking Steps cozy */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontFamily: 'Press Start 2P, cursive',
          fontSize: '1.2rem',
          color: '#8b4513',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>👩‍🍳 Les étapes</h2>
        {recette.etapes.map((etape, index) => (
          <div 
            key={index} 
            style={{
              background: completedSteps.includes(index) ? '#d4edda' : (index === currentStep ? '#fff3cd' : '#f8f9fa'),
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1rem',
              border: `3px solid ${completedSteps.includes(index) ? '#28a745' : (index === currentStep ? '#ffc107' : '#e9ecef')}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{
                fontFamily: 'Press Start 2P, cursive',
                fontSize: '0.8rem',
                color: '#8b4513',
                fontWeight: 'bold'
              }}>Étape {index + 1}</div>
              <button
                onClick={() => markStepComplete(index)}
                style={{
                  background: completedSteps.includes(index) ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.6rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {completedSteps.includes(index) ? '✅ Fini !' : '⭕ À faire'}
              </button>
            </div>
            <div style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '1rem',
              color: '#333',
              lineHeight: '1.5',
              marginBottom: '1rem'
            }}>
              {etape}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setCurrentStep(index)}
                style={{
                  background: index === currentStep ? '#ffc107' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontFamily: 'Press Start 2P, cursive',
                  fontSize: '0.6rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                👀 Je suis là
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Completion cozy */}
      {allStepsCompleted && (
        <div style={{
          background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          border: '3px solid #28a745',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '1rem'
          }}>🎉✨🍽️✨🎉</div>
          <div style={{
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '1rem',
            color: '#155724',
            marginBottom: '1.5rem',
            fontWeight: 'bold'
          }}>
            Bravo ! Votre délicieux {recette.nom} est terminé !
          </div>
          <button 
            onClick={() => onComplete(portions)} 
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontFamily: 'Press Start 2P, cursive',
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              fontWeight: 'bold'
            }}
          >
            🌟 C&apos;est fini ! 🌟
          </button>
        </div>
      )}

      <style jsx>{`
        .cozy-cooking-mode {
          max-width: 900px;
          margin: 0 auto;
          padding: 1rem;
          background: linear-gradient(135deg, #fff8e7 0%, #ffe4b5 50%, #fff8e7 100%);
          min-height: 100vh;
          color: #8b4513;
          font-family: 'Press Start 2P', monospace;
        }

        .cozy-header {
          background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
          border: 3px solid #8b4513;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 4px 4px 0px #cd853f, 0 0 0 2px #fff inset;
          text-align: center;
        }

        .cozy-back-btn {
          background: linear-gradient(135deg, #f0e68c 0%, #fafad2 100%);
          border: 2px solid #8b4513;
          border-radius: 12px;
          color: #8b4513;
          padding: 0.8rem 1.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          box-shadow: 2px 2px 0px #cd853f;
          margin-bottom: 1rem;
          transition: all 0.1s ease;
        }

        .cozy-back-btn:hover {
          background: linear-gradient(135deg, #fafad2 0%, #f0e68c 100%);
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #cd853f;
        }

        .recipe-title-container {
          margin-top: 0.5rem;
        }

        .cozy-recipe-title {
          font-size: 1.3rem;
          color: #8b4513;
          text-shadow: 2px 2px 0 #fff;
          margin: 0 0 0.5rem 0;
        }

        .cozy-cooking-info {
          font-size: 0.6rem;
          color: #a0522d;
          background: rgba(255, 255, 255, 0.7);
          padding: 0.5rem;
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .cozy-portions-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          background: linear-gradient(135deg, #f0e68c 0%, #fafad2 100%);
          border: 2px solid #8b4513;
          border-radius: 12px;
          padding: 0.8rem 1.2rem;
          margin-top: 1rem;
          box-shadow: 2px 2px 0px #cd853f;
        }

        .portions-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #8b4513;
        }

        .cozy-portion-btn {
          background: linear-gradient(135deg, #98fb98 0%, #90ee90 100%);
          border: 2px solid #8b4513;
          border-radius: 8px;
          color: #8b4513;
          padding: 0.5rem 0.8rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
          box-shadow: 1px 1px 0px #cd853f;
          transition: all 0.1s ease;
          min-width: 40px;
        }

        .cozy-portion-btn:hover:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 0px 0px 0px #cd853f;
        }

        .cozy-portion-btn:disabled {
          background: rgba(74, 85, 104, 0.3);
          color: #a0aec0;
          cursor: not-allowed;
          box-shadow: none;
        }

        .portions-value {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          color: #8b4513;
          font-weight: bold;
          min-width: 30px;
          text-align: center;
        }

        .cozy-timer-section {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .cozy-timer-card {
          background: linear-gradient(135deg, #e6e6fa 0%, #dda0dd 100%);
          border: 3px solid #8b4513;
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 4px 4px 0px #cd853f, 0 0 0 2px #fff inset;
          min-width: 250px;
        }

        .timer-emoji {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .cozy-timer-display {
          font-size: 2.5rem;
          color: #8b4513;
          text-shadow: 2px 2px 0 #fff;
          margin-bottom: 1rem;
        }

        .cozy-timer-display.timer-finished {
          animation: cozy-pulse 1s infinite;
          color: #228b22;
        }

        @keyframes cozy-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        .cozy-timer-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .cozy-timer-btn {
          background: linear-gradient(135deg, #98fb98 0%, #90ee90 100%);
          border: 2px solid #8b4513;
          border-radius: 12px;
          color: #8b4513;
          padding: 0.8rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.8rem;
          cursor: pointer;
          box-shadow: 2px 2px 0px #cd853f;
          transition: all 0.1s ease;
          min-width: 50px;
        }

        .cozy-timer-btn:hover {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #cd853f;
        }

        .cozy-timer-alert {
          background: linear-gradient(135deg, #98fb98 0%, #90ee90 100%);
          border: 2px solid #8b4513;
          border-radius: 12px;
          padding: 0.8rem;
          color: #8b4513;
          font-size: 0.6rem;
          box-shadow: 2px 2px 0px #cd853f;
        }

        .cozy-quick-timers {
          background: linear-gradient(135deg, #ffe4e1 0%, #ffd1dc 100%);
          border: 3px solid #8b4513;
          border-radius: 16px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          text-align: center;
          box-shadow: 4px 4px 0px #cd853f, 0 0 0 2px #fff inset;
        }

        .quick-timer-label {
          font-size: 0.7rem;
          margin-bottom: 1rem;
          color: #8b4513;
        }

        .quick-timer-buttons {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cozy-quick-timer-btn {
          background: linear-gradient(135deg, #ffffe0 0%, #fffacd 100%);
          border: 2px solid #8b4513;
          border-radius: 10px;
          color: #8b4513;
          padding: 0.6rem 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
          box-shadow: 2px 2px 0px #cd853f;
          transition: all 0.1s ease;
        }

        .cozy-quick-timer-btn:hover {
          background: linear-gradient(135deg, #fffacd 0%, #ffffe0 100%);
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #cd853f;
        }

        .cozy-ingredients-section, .cozy-steps-section {
          margin-bottom: 2rem;
        }

        .cozy-section-title {
          font-size: 1rem;
          color: #8b4513;
          text-align: center;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 0 #fff;
          background: linear-gradient(135deg, #f0e68c 0%, #fafad2 100%);
          border: 3px solid #8b4513;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 4px 4px 0px #cd853f, 0 0 0 2px #fff inset;
        }

        .cozy-ingredients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .cozy-ingredient-card {
          background: linear-gradient(135deg, #f5deb3 0%, #deb887 100%);
          border: 2px solid #8b4513;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          box-shadow: 2px 2px 0px #cd853f;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cozy-ingredient-card.optional {
          background: linear-gradient(135deg, #e6e6fa 0%, #dda0dd 100%);
          border-style: dashed;
        }

        .ingredient-quantity {
          font-size: 0.8rem;
          color: #8b4513;
          font-weight: bold;
        }

        .ingredient-name {
          font-size: 0.6rem;
          color: #a0522d;
        }

        .cozy-step-card {
          background: linear-gradient(135deg, #fff8dc 0%, #f5deb3 100%);
          border: 3px solid #8b4513;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 4px 4px 0px #cd853f, 0 0 0 2px #fff inset;
          transition: all 0.3s ease;
        }

        .cozy-step-card.current {
          background: linear-gradient(135deg, #98fb98 0%, #90ee90 100%);
          border-color: #228b22;
          transform: scale(1.02);
        }

        .cozy-step-card.completed {
          background: linear-gradient(135deg, #e0ffe0 0%, #ccffcc 100%);
          opacity: 0.8;
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .step-number {
          font-size: 0.8rem;
          color: #8b4513;
          font-weight: bold;
        }

        .cozy-complete-btn {
          background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
          border: 2px solid #8b4513;
          border-radius: 10px;
          color: #8b4513;
          padding: 0.5rem 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          cursor: pointer;
          box-shadow: 2px 2px 0px #cd853f;
          transition: all 0.1s ease;
        }

        .cozy-complete-btn.completed {
          background: linear-gradient(135deg, #98fb98 0%, #90ee90 100%);
        }

        .cozy-complete-btn:hover {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #cd853f;
        }

        .step-content {
          margin: 1rem 0;
          font-size: 0.7rem;
          line-height: 1.6;
          color: #8b4513;
          background: rgba(255, 255, 255, 0.5);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .step-actions {
          display: flex;
          gap: 0.5rem;
        }

        .cozy-focus-btn {
          background: linear-gradient(135deg, #ffd700 0%, #ffec8c 100%);
          border: 2px solid #8b4513;
          border-radius: 10px;
          color: #8b4513;
          padding: 0.5rem 1rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          cursor: pointer;
          box-shadow: 2px 2px 0px #cd853f;
          transition: all 0.1s ease;
        }

        .cozy-focus-btn:hover {
          background: linear-gradient(135deg, #ffec8c 0%, #ffd700 100%);
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #cd853f;
        }

        .cozy-completion-section {
          text-align: center;
          background: linear-gradient(135deg, #fff8dc 0%, #f0e68c 100%);
          border: 4px solid #8b4513;
          border-radius: 20px;
          padding: 3rem 2rem;
          box-shadow: 6px 6px 0px #cd853f, 0 0 0 3px #fff inset;
          margin-top: 2rem;
        }

        .completion-emoji {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: cozy-bounce 2s infinite;
        }

        @keyframes cozy-bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .cozy-completion-message {
          font-size: 0.9rem;
          color: #8b4513;
          margin-bottom: 2rem;
          text-shadow: 2px 2px 0 #fff;
        }

        .cozy-complete-cooking-btn {
          background: linear-gradient(135deg, #ffd700 0%, #ffec8c 50%, #ffd700 100%);
          border: 4px solid #8b4513;
          border-radius: 16px;
          color: #8b4513;
          padding: 1.5rem 3rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 6px 6px 0px #cd853f;
          transition: all 0.2s ease;
          text-shadow: 1px 1px 0 #fff;
        }

        .cozy-complete-cooking-btn:hover {
          background: linear-gradient(135deg, #ffec8c 0%, #ffd700 50%, #ffec8c 100%);
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0px #cd853f;
        }

        @media (max-width: 768px) {
          .cozy-cooking-mode {
            padding: 0.5rem;
          }

          .cozy-ingredients-grid {
            grid-template-columns: 1fr;
          }

          .step-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .cozy-timer-card {
            min-width: auto;
            width: 100%;
          }

          .quick-timer-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
