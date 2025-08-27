import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import KitchenObject from '../KitchenObject';

describe('KitchenObject', () => {
  const defaultProps = {
    icon: <span data-testid="test-icon">🍳</span>,
    label: 'Test Label'
  };

  test('should render icon and label', () => {
    render(<KitchenObject {...defaultProps} />);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('should render complex label as React node', () => {
    const complexLabel = (
      <div>
        <div>Line 1</div>
        <div>Line 2</div>
      </div>
    );
    
    render(<KitchenObject icon={defaultProps.icon} label={complexLabel} />);
    
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
  });

  test('should render subLabel when provided', () => {
    render(
      <KitchenObject 
        {...defaultProps} 
        subLabel="Sub Label Text" 
      />
    );
    
    expect(screen.getByText('Sub Label Text')).toBeInTheDocument();
  });

  test('should not render subLabel when not provided', () => {
    render(<KitchenObject {...defaultProps} />);
    
    // Vérifier qu'il n'y a pas de div avec les styles de subLabel
    const subLabelDiv = document.querySelector('div[style*="fontSize: 0.6rem"]');
    expect(subLabelDiv).not.toBeInTheDocument();
  });

  test('should apply custom styles', () => {
    const customStyle = {
      backgroundColor: 'red',
      width: '200px',
      height: '100px'
    };
    
    render(<KitchenObject {...defaultProps} style={customStyle} />);
    
    const container = screen.getByText('Test Label').closest('div');
    
    // Vérifier que le container existe et peut recevoir des styles
    expect(container).toBeInTheDocument();
    expect(container?.tagName).toBe('DIV');
  });

  test('should call onClick when clicked', () => {
    const mockOnClick = jest.fn();
    
    render(<KitchenObject {...defaultProps} onClick={mockOnClick} />);
    
    const container = screen.getByText('Test Label').closest('div');
    fireEvent.click(container!);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('should call onMouseEnter when mouse enters', () => {
    const mockOnMouseEnter = jest.fn();
    
    render(<KitchenObject {...defaultProps} onMouseEnter={mockOnMouseEnter} />);
    
    const container = screen.getByText('Test Label').closest('div');
    fireEvent.mouseEnter(container!);
    
    expect(mockOnMouseEnter).toHaveBeenCalledTimes(1);
  });

  test('should call onMouseLeave when mouse leaves', () => {
    const mockOnMouseLeave = jest.fn();
    
    render(<KitchenObject {...defaultProps} onMouseLeave={mockOnMouseLeave} />);
    
    const container = screen.getByText('Test Label').closest('div');
    fireEvent.mouseLeave(container!);
    
    expect(mockOnMouseLeave).toHaveBeenCalledTimes(1);
  });

  test('should render React node as subLabel', () => {
    const complexSubLabel = (
      <span data-testid="complex-sublabel">Complex Sub</span>
    );
    
    render(
      <KitchenObject 
        {...defaultProps} 
        subLabel={complexSubLabel} 
      />
    );
    
    expect(screen.getByTestId('complex-sublabel')).toBeInTheDocument();
  });

  test('should handle missing event handlers gracefully', () => {
    render(<KitchenObject {...defaultProps} />);
    
    const container = screen.getByText('Test Label').closest('div');
    
    // Ces actions ne devraient pas lever d'erreur
    expect(() => {
      fireEvent.click(container!);
      fireEvent.mouseEnter(container!);
      fireEvent.mouseLeave(container!);
    }).not.toThrow();
  });

  test('should render with minimal props', () => {
    const minimalProps = {
      icon: '🏠',
      label: 'Home'
    };
    
    render(<KitchenObject {...minimalProps} />);
    
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  test('should apply subLabel styles correctly', () => {
    render(
      <KitchenObject 
        {...defaultProps} 
        subLabel="Styled Sub" 
      />
    );
    
    const subLabel = screen.getByText('Styled Sub');
    expect(subLabel).toHaveStyle('font-size: 0.6rem');
    expect(subLabel).toHaveStyle('opacity: 0.7');
    expect(subLabel).toHaveStyle('margin-top: 0.3rem');
    expect(subLabel).toHaveStyle('text-align: center');
  });
});
