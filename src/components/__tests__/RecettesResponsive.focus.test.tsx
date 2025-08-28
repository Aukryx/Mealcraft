import { render, screen, fireEvent, act } from '@testing-library/react';
import RecettesResponsive from '../RecettesResponsive';
import { Recette } from '../../data/recettesDeBase';

// Mock du hook useStock
jest.mock('../../hooks/useStock', () => ({
  useStock: () => ({
    stock: [
      { id: 'tomate', quantite: 5 },
      { id: 'pomme', quantite: 10 }
    ]
  })
}));

const mockRecettes: Recette[] = [
  {
    id: '1',
    nom: 'Salade de tomates',
    ingredients: [{ ingredientId: 'tomate', quantite: 2, unite: 'pièce' }],
    etapes: ['Couper les tomates'],
    categorie: 'entrée',
    tags: ['rapide']
  },
  {
    id: '2', 
    nom: 'Tarte aux pommes',
    ingredients: [{ ingredientId: 'pomme', quantite: 4, unite: 'pièce' }],
    etapes: ['Préparer la pâte', 'Ajouter les pommes'],
    categorie: 'dessert',
    tags: ['végétarien']
  }
];

const mockProps = {
  recettes: mockRecettes,
  onEdit: jest.fn(),
  onDelete: jest.fn(), 
  onAdd: jest.fn(),
  onStartCooking: jest.fn()
};

describe('RecettesResponsive - Focus de la recherche', () => {
  test('La barre de recherche maintient le focus après la saisie', async () => {
    render(<RecettesResponsive {...mockProps} />);
    
    // Ouvrir les filtres
    const filterButton = screen.getByText(/🔍 Filtres/);
    fireEvent.click(filterButton);
    
    // Trouver l'input de recherche
    const searchInput = screen.getByPlaceholderText('Nom de la recette...');
    
    // Donner le focus et taper du texte
    fireEvent.focus(searchInput);
    expect(searchInput).toHaveFocus();
    
    // Taper caractère par caractère
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'S' } });
    });
    
    // L'input devrait toujours avoir le focus après le changement
    expect(searchInput).toHaveFocus();
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Sa' } });
    });
    
    expect(searchInput).toHaveFocus();
    expect(searchInput).toHaveValue('Sa');
  });
  
  test('Le composant se rend correctement', () => {
    render(<RecettesResponsive {...mockProps} />);
    
    // Vérifier que les recettes sont affichées
    expect(screen.getByText('Salade de tomates')).toBeInTheDocument();
    expect(screen.getByText('Tarte aux pommes')).toBeInTheDocument();
  });
});
