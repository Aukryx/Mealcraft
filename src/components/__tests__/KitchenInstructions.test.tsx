import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KitchenInstructions from '../KitchenInstructions';

describe('KitchenInstructions', () => {
  test('should render instructions text', () => {
    render(<KitchenInstructions />);
    
    expect(screen.getByText('Cliquez sur les objets pour interagir avec votre cuisine')).toBeInTheDocument();
  });

  test('should apply correct styles', () => {
    render(<KitchenInstructions />);
    
    const instructionsDiv = screen.getByText('Cliquez sur les objets pour interagir avec votre cuisine');
    
    // Vérifier quelques styles critiques
    expect(instructionsDiv).toHaveStyle('position: absolute');
    expect(instructionsDiv).toHaveStyle('bottom: 5%');
    expect(instructionsDiv).toHaveStyle('left: 50%');
    expect(instructionsDiv).toHaveStyle('transform: translateX(-50%)');
    expect(instructionsDiv).toHaveStyle('background: rgba(0,0,0,0.7)');
    expect(instructionsDiv).toHaveStyle('color: rgb(255, 255, 255)');
    expect(instructionsDiv).toHaveStyle('text-align: center');
    expect(instructionsDiv).toHaveStyle('z-index: 10');
  });

  test('should use Press Start 2P font family', () => {
    render(<KitchenInstructions />);
    
    const instructionsDiv = screen.getByText('Cliquez sur les objets pour interagir avec votre cuisine');
    expect(instructionsDiv).toHaveStyle('font-family: Press Start 2P, cursive');
  });

  test('should have proper positioning and dimensions', () => {
    render(<KitchenInstructions />);
    
    const instructionsDiv = screen.getByText('Cliquez sur les objets pour interagir avec votre cuisine');
    
    expect(instructionsDiv).toHaveStyle('border-radius: 12px');
    expect(instructionsDiv).toHaveStyle('padding: 1rem 2rem');
    expect(instructionsDiv).toHaveStyle('font-size: 0.7rem');
  });

  test('should render without crashing', () => {
    expect(() => render(<KitchenInstructions />)).not.toThrow();
  });
});
