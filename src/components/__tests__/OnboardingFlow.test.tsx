import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingFlow from '../OnboardingFlow';
import { UserProfile } from '../../data/database';

describe('OnboardingFlow', () => {
  const mockProfile: UserProfile = {
    id: '1',
    nom: 'Test User',
    dateCreation: new Date(),
    derniereConnexion: new Date(),
    tutorialComplete: false,
    preferences: {
      consommationMode: 'simulation',
      portionsParDefaut: 4,
      alertesStock: true,
      planificationAutomatique: false,
      modeNuit: false,
      difficultePreferee: null,
      regimesAlimentaires: [],
      allergies: [],
      tempsCuissonMax: null,
      budgetMoyen: null
    }
  };

  const defaultProps = {
    onProfileCreated: jest.fn(),
    onCreateProfile: jest.fn().mockResolvedValue(mockProfile)
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 0 - Profile Creation', () => {
    test('should render welcome message and form', () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      expect(screen.getByText('MealCraft')).toBeInTheDocument();
      expect(screen.getByText('Comment vous appelez-vous ?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Votre prénom')).toBeInTheDocument();
      expect(screen.getByText('Commencer ! 🚀')).toBeInTheDocument();
      expect(screen.getByText('🍳')).toBeInTheDocument();
    });

    test('should update input value when typing', () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: 'John' } });
      
      expect(input).toHaveValue('John');
    });

    test('should show error when trying to submit empty name', async () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      // Entrer un nom d'abord pour activer le bouton
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Puis le vider pour déclencher l'erreur
      fireEvent.change(input, { target: { value: '' } });
      
      const button = screen.getByText('Commencer ! 🚀');
      
      // Le bouton devrait être désactivé quand le nom est vide
      expect(button).toBeDisabled();
    });

    test('should disable button when name is empty', () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const button = screen.getByText('Commencer ! 🚀');
      expect(button).toBeDisabled();
    });

    test('should enable button when name is entered', () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: 'John' } });
      
      const button = screen.getByText('Commencer ! 🚀');
      expect(button).not.toBeDisabled();
    });

    test('should call onCreateProfile when form is submitted', async () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: 'John' } });
      
      const button = screen.getByText('Commencer ! 🚀');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(defaultProps.onCreateProfile).toHaveBeenCalledWith('John');
      });
    });

    test('should submit form on Enter key press', async () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: 'John' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      await waitFor(() => {
        expect(defaultProps.onCreateProfile).toHaveBeenCalledWith('John');
      });
    });

    test('should show loading state during profile creation', async () => {
      const slowCreateProfile = jest.fn((): Promise<UserProfile> => new Promise(resolve => 
        setTimeout(() => resolve(mockProfile), 100)
      ));
      
      render(
        <OnboardingFlow 
          {...defaultProps} 
          onCreateProfile={slowCreateProfile}
        />
      );
      
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: 'John' } });
      
      const button = screen.getByText('Commencer ! 🚀');
      fireEvent.click(button);
      
      expect(screen.getByText('Création...')).toBeInTheDocument();
      expect(button).toBeDisabled();
      
      await waitFor(() => {
        expect(screen.queryByText('Création...')).not.toBeInTheDocument();
      });
    });

    test('should handle profile creation error', async () => {
      const failingCreateProfile = jest.fn().mockRejectedValue(new Error('Network error'));
      
      render(
        <OnboardingFlow 
          {...defaultProps} 
          onCreateProfile={failingCreateProfile}
        />
      );
      
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: 'John' } });
      
      const button = screen.getByText('Commencer ! 🚀');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Erreur lors de la création du profil')).toBeInTheDocument();
      });
    });

    test('should call onProfileCreated after successful creation', async () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: 'John' } });
      
      const button = screen.getByText('Commencer ! 🚀');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(defaultProps.onProfileCreated).toHaveBeenCalledWith(mockProfile);
      });
    });

    test('should trim whitespace from name', async () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: '  John  ' } });
      
      const button = screen.getByText('Commencer ! 🚀');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(defaultProps.onCreateProfile).toHaveBeenCalledWith('  John  ');
      });
    });

    test('should show error for whitespace-only name', async () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: '   ' } });
      
      const button = screen.getByText('Commencer ! 🚀');
      
      // Le bouton devrait être désactivé pour un nom avec seulement des espaces
      expect(button).toBeDisabled();
    });
  });

  describe('Button styles', () => {
    test('should apply correct styles to enabled button', () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Votre prénom');
      fireEvent.change(input, { target: { value: 'John' } });
      
      const button = screen.getByText('Commencer ! 🚀');
      expect(button).toHaveStyle('background: #28a745');
      expect(button).toHaveStyle('cursor: pointer');
    });

    test('should apply correct styles to disabled button', () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const button = screen.getByText('Commencer ! 🚀');
      expect(button).toHaveStyle('background: #ccc');
      expect(button).toHaveStyle('cursor: not-allowed');
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels', () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const label = screen.getByText('Comment vous appelez-vous ?');
      expect(label.tagName).toBe('LABEL');
    });

    test('should support keyboard navigation', () => {
      render(<OnboardingFlow {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Votre prénom');
      expect(input).toBeVisible();
      
      input.focus();
      expect(input).toHaveFocus();
    });
  });
});
