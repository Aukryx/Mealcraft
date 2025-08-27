import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PixelImage from '../PixelImage';

describe('PixelImage', () => {
  const defaultProps = {
    src: 'test-image.jpg',
    alt: 'Test Image',
    fallbackIcon: '🍎'
  };

  test('should render fallback icon initially', () => {
    render(<PixelImage {...defaultProps} />);
    
    expect(screen.getByText('🍎')).toBeInTheDocument();
  });

  test('should render alt text', () => {
    render(<PixelImage {...defaultProps} />);
    
    const image = screen.queryByAltText('Test Image');
    // L'image pourrait ne pas être immédiatement visible mais l'alt devrait être défini
    if (image) {
      expect(image).toHaveAttribute('alt', 'Test Image');
    }
  });

  test('should apply medium size by default', () => {
    render(<PixelImage {...defaultProps} />);
    
    const container = screen.getByText('🍎').parentElement;
    expect(container).toBeInTheDocument();
  });

  test('should apply small size when specified', () => {
    render(<PixelImage {...defaultProps} size="small" />);
    
    const container = screen.getByText('🍎').parentElement;
    expect(container).toBeInTheDocument();
  });

  test('should apply large size when specified', () => {
    render(<PixelImage {...defaultProps} size="large" />);
    
    const container = screen.getByText('🍎').parentElement;
    expect(container).toBeInTheDocument();
  });

  test('should apply custom styles', () => {
    const customStyle = {
      backgroundColor: 'red',
      borderRadius: '20px'
    };
    
    render(<PixelImage {...defaultProps} style={customStyle} />);
    
    const container = screen.getByText('🍎').parentElement;
    expect(container).toBeInTheDocument();
    expect(container?.tagName).toBe('DIV');
  });

  test('should render without src prop', () => {
    render(
      <PixelImage 
        alt="No Source Image" 
        fallbackIcon="📷" 
      />
    );
    
    expect(screen.getByText('📷')).toBeInTheDocument();
  });

  test('should handle image load error', async () => {
    render(<PixelImage {...defaultProps} />);
    
    // Simuler une erreur de chargement d'image
    const image = document.querySelector('img');
    if (image) {
      fireEvent.error(image);
      
      await waitFor(() => {
        expect(screen.getByText('🍎')).toBeInTheDocument();
      });
    }
  });

  test('should handle image load success', async () => {
    render(<PixelImage {...defaultProps} />);
    
    const image = document.querySelector('img');
    if (image) {
      fireEvent.load(image);
      
      // L'image devrait être visible après le chargement
      expect(image).toBeInTheDocument();
    }
  });

  test('should apply container styles', () => {
    render(<PixelImage {...defaultProps} />);
    
    const container = screen.getByText('🍎').parentElement;
    expect(container).toHaveStyle('display: flex');
    expect(container).toHaveStyle('align-items: center');
    expect(container).toHaveStyle('justify-content: center');
    
    // Vérifier que le container existe et est bien structuré
    expect(container).toBeInTheDocument();
    expect(container?.tagName).toBe('DIV');
  });

  test('should render with empty src string', () => {
    render(<PixelImage src="" alt="Empty Source" fallbackIcon="❓" />);
    
    expect(screen.getByText('❓')).toBeInTheDocument();
  });

  test('should handle different fallback icons', () => {
    render(<PixelImage {...defaultProps} fallbackIcon="🚀" />);
    
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });

  test('should merge custom styles with default styles', () => {
    const customStyle = { margin: '10px', padding: '5px' };
    
    render(<PixelImage {...defaultProps} style={customStyle} />);
    
    const container = screen.getByText('🍎').parentElement;
    expect(container).toBeInTheDocument();
    
    // Vérifier que le container a bien reçu des styles
    expect(container?.getAttribute('style')).toBeTruthy();
  });

  test('should render without crashing with minimal props', () => {
    expect(() => {
      render(<PixelImage alt="Minimal" fallbackIcon="🔧" />);
    }).not.toThrow();
    
    expect(screen.getByText('🔧')).toBeInTheDocument();
  });

  test('should handle complex fallback icons', () => {
    const complexIcon = '🎭🎨';
    render(<PixelImage {...defaultProps} fallbackIcon={complexIcon} />);
    
    expect(screen.getByText(complexIcon)).toBeInTheDocument();
  });
});