import React, { useState, useRef, useEffect } from 'react';
import { getQuantityConfig, formatQuantity, calculateNextQuantity } from '../utils/quantityUtils';

interface SmartQuantityEditorProps {
  quantity: number;
  unit: string;
  onQuantityChange: (newQuantity: number) => void;
  className?: string;
}

export const SmartQuantityEditor: React.FC<SmartQuantityEditorProps> = ({
  quantity,
  unit,
  onQuantityChange,
  className = ''
}) => {
  const config = getQuantityConfig(unit);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(quantity.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleInputSubmit = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue === '') {
      // Si l'input est vide, revenir à la valeur originale
      setInputValue(quantity.toString());
      setIsEditing(false);
      return;
    }
    
    const newQuantity = parseFloat(trimmedValue);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      onQuantityChange(newQuantity);
    } else {
      setInputValue(quantity.toString()); // Reset si invalide
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setInputValue(quantity.toString());
      setIsEditing(false);
    }
  };

  const handleIncrement = (step: number) => {
    const newQuantity = calculateNextQuantity(quantity, step, 'up');
    onQuantityChange(newQuantity);
  };

  const handleDecrement = (step: number) => {
    const newQuantity = calculateNextQuantity(quantity, step, 'down');
    onQuantityChange(newQuantity);
  };

  return (
    <div className={`smart-quantity-editor ${className}`}>
      <div className="quantity-display">
        {isEditing && config.inputEnabled ? (
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyDown={handleKeyPress}
            placeholder={config.placeholder || "0"}
            className="quantity-input"
            autoFocus
            min="0"
            step={config.smallStep}
          />
        ) : (
          <span 
            className={`quantity-value ${config.inputEnabled ? 'editable' : ''}`}
            onClick={() => config.inputEnabled && setIsEditing(true)}
            title={config.inputEnabled ? 'Cliquer pour éditer' : ''}
          >
            {formatQuantity(quantity, unit)}
          </span>
        )}
      </div>

      <div className="quantity-controls">
        {/* Boutons de décrémentation */}
        <div className="decrement-buttons">
          <button
            onClick={() => handleDecrement(config.largeStep)}
            disabled={quantity - config.largeStep < 0}
            className="qty-btn large-step"
            title={`-${config.largeStep}`}
          >
            --
          </button>
          <button
            onClick={() => handleDecrement(config.mediumStep)}
            disabled={quantity - config.mediumStep < 0}
            className="qty-btn medium-step"
            title={`-${config.mediumStep}`}
          >
            -
          </button>
          <button
            onClick={() => handleDecrement(config.smallStep)}
            disabled={quantity - config.smallStep < 0}
            className="qty-btn small-step"
            title={`-${config.smallStep}`}
          >
            ◂
          </button>
        </div>

        {/* Boutons d'incrémentation */}
        <div className="increment-buttons">
          <button
            onClick={() => handleIncrement(config.smallStep)}
            className="qty-btn small-step"
            title={`+${config.smallStep}`}
          >
            ▸
          </button>
          <button
            onClick={() => handleIncrement(config.mediumStep)}
            className="qty-btn medium-step"
            title={`+${config.mediumStep}`}
          >
            +
          </button>
          <button
            onClick={() => handleIncrement(config.largeStep)}
            className="qty-btn large-step"
            title={`+${config.largeStep}`}
          >
            ++
          </button>
        </div>
      </div>

      <style jsx>{`
        .smart-quantity-editor {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border: 1px solid #4a5568;
          border-radius: 8px;
          background: rgba(26, 32, 44, 0.8);
          min-width: 120px;
        }

        .quantity-display {
          text-align: center;
        }

        .quantity-value {
          font-family: 'Press Start 2P', monospace;
          font-size: 14px;
          color: #68d391;
          text-shadow: 0 0 10px rgba(104, 211, 145, 0.5);
          padding: 4px 8px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.3);
          display: inline-block;
          min-width: 80px;
        }

        .quantity-value.editable {
          cursor: pointer;
          border: 1px dashed transparent;
          transition: border-color 0.2s;
        }

        .quantity-value.editable:hover {
          border-color: #68d391;
        }

        .quantity-input {
          font-family: 'Press Start 2P', monospace;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid #68d391;
          border-radius: 4px;
          color: #68d391;
          text-align: center;
          padding: 4px 8px;
          width: 100px;
        }

        .quantity-input:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(104, 211, 145, 0.5);
        }

        .quantity-controls {
          display: flex;
          gap: 12px;
        }

        .decrement-buttons,
        .increment-buttons {
          display: flex;
          gap: 4px;
        }

        .qty-btn {
          font-family: 'Press Start 2P', monospace;
          font-size: 10px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid #4a5568;
          border-radius: 4px;
          color: #a0aec0;
          padding: 6px 8px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 32px;
        }

        .qty-btn:hover:not(:disabled) {
          background: rgba(104, 211, 145, 0.2);
          border-color: #68d391;
          color: #68d391;
          transform: translateY(-1px);
        }

        .qty-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .qty-btn.small-step {
          border-color: #f6e05e;
        }

        .qty-btn.medium-step {
          border-color: #ed8936;
        }

        .qty-btn.large-step {
          border-color: #f56565;
        }

        .qty-btn.small-step:hover:not(:disabled) {
          border-color: #f6e05e;
          color: #f6e05e;
          background: rgba(246, 224, 94, 0.2);
        }

        .qty-btn.medium-step:hover:not(:disabled) {
          border-color: #ed8936;
          color: #ed8936;
          background: rgba(237, 137, 54, 0.2);
        }

        .qty-btn.large-step:hover:not(:disabled) {
          border-color: #f56565;
          color: #f56565;
          background: rgba(245, 101, 101, 0.2);
        }

        @media (max-width: 768px) {
          .smart-quantity-editor {
            min-width: 100px;
          }

          .quantity-value {
            font-size: 12px;
            min-width: 70px;
          }

          .qty-btn {
            font-size: 8px;
            padding: 4px 6px;
            min-width: 28px;
          }
        }
      `}</style>
    </div>
  );
};
