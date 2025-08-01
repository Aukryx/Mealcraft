import React, { useState, useEffect } from 'react';
import { Recette } from '../data/recettesDeBase';

interface CookingModeProps {
  recette: Recette;
  onComplete: () => void;
  onCancel: () => void;
}

export const CookingMode: React.FC<CookingModeProps> = ({
  recette,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerActive && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === null || prevTimer <= 1) {
            setIsTimerActive(false);
            // Son de notification (optionnel)
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
    <div className="cooking-mode">
      {/* Header */}
      <div className="cooking-header">
        <button onClick={onCancel} className="back-btn">
          ← Retour
        </button>
        <h2 className="recipe-title">{recette.nom}</h2>
        <div className="cooking-info">
          ⏱️ Prépa: {recette.tempsPreparation || 0}min | 
          🔥 Cuisson: {recette.tempsCuisson || 0}min
        </div>
      </div>

      {/* Timer Section */}
      {timer !== null && (
        <div className="timer-section">
          <div className={`timer-display ${timer === 0 ? 'timer-finished' : ''}`}>
            {formatTime(timer)}
          </div>
          <div className="timer-controls">
            <button onClick={toggleTimer} className="timer-btn">
              {isTimerActive ? '⏸️ Pause' : '▶️ Start'}
            </button>
            <button onClick={resetTimer} className="timer-btn">
              🔄 Reset
            </button>
          </div>
          {timer === 0 && (
            <div className="timer-alert">
              ⏰ Timer terminé ! Vérifiez votre plat.
            </div>
          )}
        </div>
      )}

      {/* Quick Timers */}
      <div className="quick-timers">
        <span>Minuteurs rapides:</span>
        <button onClick={() => startTimer(1)} className="quick-timer-btn">1min</button>
        <button onClick={() => startTimer(5)} className="quick-timer-btn">5min</button>
        <button onClick={() => startTimer(10)} className="quick-timer-btn">10min</button>
        <button onClick={() => startTimer(15)} className="quick-timer-btn">15min</button>
        <button onClick={() => startTimer(20)} className="quick-timer-btn">20min</button>
      </div>

      {/* Ingredients List */}
      <div className="ingredients-section">
        <h3>📝 Ingrédients nécessaires</h3>
        <div className="ingredients-grid">
          {recette.ingredients.map((ing, index) => (
            <div key={index} className="ingredient-item">
              <span className="ingredient-name">{ing.ingredientId}</span>
              <span className="ingredient-quantity">
                {ing.quantite} {ing.unite}
              </span>
            </div>
          ))}
          {recette.ingredientsOptionnels?.map((ing, index) => (
            <div key={`opt-${index}`} className="ingredient-item optional">
              <span className="ingredient-name">{ing.ingredientId} (optionnel)</span>
              <span className="ingredient-quantity">
                {ing.quantite} {ing.unite}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cooking Steps */}
      <div className="steps-section">
        <h3>👨‍🍳 Étapes de préparation</h3>
        {recette.etapes.map((etape, index) => (
          <div 
            key={index} 
            className={`step-card ${completedSteps.includes(index) ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}
          >
            <div className="step-header">
              <span className="step-number">Étape {index + 1}</span>
              <button
                onClick={() => markStepComplete(index)}
                className={`complete-btn ${completedSteps.includes(index) ? 'completed' : ''}`}
              >
                {completedSteps.includes(index) ? '✅ Terminé' : '☐ Marquer terminé'}
              </button>
            </div>
            <div className="step-content">
              {etape}
            </div>
            <div className="step-actions">
              <button
                onClick={() => setCurrentStep(index)}
                className="focus-btn"
              >
                📍 Focus cette étape
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Completion */}
      {allStepsCompleted && (
        <div className="completion-section">
          <div className="completion-message">
            🎉 Félicitations ! Votre {recette.nom} est prêt !
          </div>
          <button onClick={onComplete} className="complete-cooking-btn">
            ✨ Terminer la cuisine
          </button>
        </div>
      )}

      <style jsx>{`
        .cooking-mode {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
          min-height: 100vh;
          color: #e2e8f0;
          font-family: 'Press Start 2P', monospace;
        }

        .cooking-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: rgba(45, 55, 72, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(104, 211, 145, 0.3);
        }

        .back-btn {
          align-self: flex-start;
          background: rgba(113, 128, 150, 0.8);
          border: none;
          color: #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: rgba(113, 128, 150, 1);
          transform: translateY(-1px);
        }

        .recipe-title {
          font-size: 1rem;
          color: #68d391;
          text-shadow: 0 0 10px rgba(104, 211, 145, 0.5);
          text-align: center;
          margin: 0;
        }

        .cooking-info {
          text-align: center;
          font-size: 0.6rem;
          color: #a0aec0;
        }

        .timer-section {
          background: rgba(0, 0, 0, 0.6);
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          text-align: center;
          border: 1px solid rgba(245, 101, 101, 0.5);
        }

        .timer-display {
          font-size: 2rem;
          color: #f56565;
          text-shadow: 0 0 20px rgba(245, 101, 101, 0.8);
          margin-bottom: 1rem;
        }

        .timer-display.timer-finished {
          animation: pulse 1s infinite;
          color: #68d391;
          text-shadow: 0 0 20px rgba(104, 211, 145, 0.8);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .timer-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .timer-btn {
          background: rgba(245, 101, 101, 0.8);
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .timer-btn:hover {
          background: rgba(245, 101, 101, 1);
          transform: translateY(-1px);
        }

        .timer-alert {
          background: rgba(104, 211, 145, 0.2);
          border: 1px solid #68d391;
          border-radius: 8px;
          padding: 0.5rem;
          color: #68d391;
          font-size: 0.6rem;
        }

        .quick-timers {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 2rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          font-size: 0.6rem;
        }

        .quick-timer-btn {
          background: rgba(246, 224, 94, 0.8);
          border: none;
          color: #1a202c;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-timer-btn:hover {
          background: rgba(246, 224, 94, 1);
          transform: translateY(-1px);
        }

        .ingredients-section, .steps-section {
          margin-bottom: 2rem;
        }

        .ingredients-section h3, .steps-section h3 {
          color: #68d391;
          margin-bottom: 1rem;
          font-size: 0.8rem;
          text-shadow: 0 0 10px rgba(104, 211, 145, 0.5);
        }

        .ingredients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .ingredient-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          background: rgba(45, 55, 72, 0.6);
          border-radius: 8px;
          border: 1px solid rgba(104, 211, 145, 0.2);
          font-size: 0.6rem;
        }

        .ingredient-item.optional {
          border-color: rgba(246, 224, 94, 0.4);
          background: rgba(246, 224, 94, 0.1);
        }

        .ingredient-name {
          color: #a0aec0;
        }

        .ingredient-quantity {
          color: #68d391;
          font-weight: bold;
        }

        .step-card {
          background: rgba(45, 55, 72, 0.8);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(104, 211, 145, 0.2);
          transition: all 0.3s;
        }

        .step-card.current {
          border-color: #68d391;
          box-shadow: 0 0 20px rgba(104, 211, 145, 0.3);
        }

        .step-card.completed {
          border-color: rgba(104, 211, 145, 0.6);
          background: rgba(104, 211, 145, 0.1);
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .step-number {
          color: #68d391;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .complete-btn {
          background: rgba(113, 128, 150, 0.8);
          border: none;
          color: #e2e8f0;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .complete-btn.completed {
          background: rgba(104, 211, 145, 0.8);
          color: #1a202c;
        }

        .complete-btn:hover {
          transform: translateY(-1px);
        }

        .step-content {
          margin: 1rem 0;
          font-size: 0.6rem;
          line-height: 1.5;
          color: #e2e8f0;
        }

        .step-actions {
          display: flex;
          gap: 0.5rem;
        }

        .focus-btn {
          background: rgba(246, 224, 94, 0.8);
          border: none;
          color: #1a202c;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .focus-btn:hover {
          background: rgba(246, 224, 94, 1);
          transform: translateY(-1px);
        }

        .completion-section {
          text-align: center;
          padding: 2rem;
          background: rgba(104, 211, 145, 0.1);
          border-radius: 12px;
          border: 1px solid #68d391;
        }

        .completion-message {
          font-size: 0.8rem;
          color: #68d391;
          margin-bottom: 1rem;
          text-shadow: 0 0 10px rgba(104, 211, 145, 0.5);
        }

        .complete-cooking-btn {
          background: linear-gradient(135deg, #68d391, #4fd08f);
          border: none;
          color: #1a202c;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .complete-cooking-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          .cooking-mode {
            padding: 0.5rem;
          }

          .ingredients-grid {
            grid-template-columns: 1fr;
          }

          .timer-controls {
            flex-direction: column;
            align-items: center;
          }

          .step-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};
