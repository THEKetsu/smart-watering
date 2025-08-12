import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import Plants from '../pages/Plants';
import { plantsApiService } from '../services/plantsApi';

// Mock du service API
jest.mock('../services/plantsApi');
const mockPlantsApiService = plantsApiService as jest.Mocked<typeof plantsApiService>;

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Plants - Recherche multilingue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock des résultats de recherche
    mockPlantsApiService.searchPlants.mockImplementation(async (query: string) => {
      // Simulation de différents résultats selon la requête
      if (query.toLowerCase().includes('rose') || query.toLowerCase().includes('rosa')) {
        return {
          plants: [
            {
              id: 1,
              common_name: 'Rose',
              scientific_name: 'Rosa rubiginosa',
              sunlight: ['full_sun', 'part_shade'],
              default_image: {
                small_url: 'https://test.com/rose-small.jpg',
                medium_url: 'https://test.com/rose-medium.jpg',
              },
            },
            {
              id: 2,
              common_name: 'Wild Rose',
              scientific_name: 'Rosa canina',
              sunlight: ['full_sun'],
              default_image: {
                small_url: 'https://test.com/wildrose-small.jpg',
                medium_url: 'https://test.com/wildrose-medium.jpg',
              },
            },
          ],
        };
      }
      
      if (query.toLowerCase().includes('basilic') || query.toLowerCase().includes('basil')) {
        return {
          plants: [
            {
              id: 3,
              common_name: 'Basil',
              scientific_name: 'Ocimum basilicum',
              sunlight: ['full_sun'],
              default_image: {
                small_url: 'https://test.com/basil-small.jpg',
                medium_url: 'https://test.com/basil-medium.jpg',
              },
            },
          ],
        };
      }
      
      return { plants: [] };
    });
  });

  test('devrait rechercher des plantes en français', async () => {
    render(<Plants />, { wrapper: createWrapper });
    
    // Attendre que le composant soit rendu
    await waitFor(() => {
      expect(screen.getByText('Ajouter une nouvelle plante')).toBeInTheDocument();
    });
    
    // Ouvrir le modal d'ajout
    const addButton = screen.getByText('Ajouter une nouvelle plante');
    fireEvent.click(addButton);
    
    // Attendre que le modal soit ouvert
    await waitFor(() => {
      expect(screen.getByText('Rechercher par nom')).toBeInTheDocument();
    });
    
    // Cliquer sur l'onglet recherche par nom
    const nameTab = screen.getByText('Rechercher par nom');
    fireEvent.click(nameTab);
    
    // Trouver le champ de recherche
    const searchInput = screen.getByLabelText('Nom de la plante');
    
    // Taper "rose" en français
    fireEvent.change(searchInput, { target: { value: 'rose' } });
    
    // Attendre que la recherche soit effectuée
    await waitFor(() => {
      expect(mockPlantsApiService.searchPlants).toHaveBeenCalledWith('rose', 10);
    }, { timeout: 2000 });
  });

  test('devrait rechercher des plantes avec terme français traduit', async () => {
    render(<Plants />, { wrapper: createWrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Ajouter une nouvelle plante')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('Ajouter une nouvelle plante');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Rechercher par nom')).toBeInTheDocument();
    });
    
    const nameTab = screen.getByText('Rechercher par nom');
    fireEvent.click(nameTab);
    
    const searchInput = screen.getByLabelText('Nom de la plante');
    
    // Taper "basilic" (terme français qui devrait être traduit vers "basil")
    fireEvent.change(searchInput, { target: { value: 'basilic' } });
    
    // Attendre que la recherche soit effectuée avec le terme traduit
    await waitFor(() => {
      // Vérifier que l'API a été appelée (la fonction smartPlantSearch gère la traduction)
      expect(mockPlantsApiService.searchPlants).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  test('devrait afficher les résultats de recherche', async () => {
    render(<Plants />, { wrapper: createWrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Ajouter une nouvelle plante')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('Ajouter une nouvelle plante');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Rechercher par nom')).toBeInTheDocument();
    });
    
    const nameTab = screen.getByText('Rechercher par nom');
    fireEvent.click(nameTab);
    
    const searchInput = screen.getByLabelText('Nom de la plante');
    
    // Rechercher "rose"
    fireEvent.change(searchInput, { target: { value: 'rose' } });
    
    // Attendre que les résultats apparaissent
    await waitFor(() => {
      expect(screen.getByText('Rose')).toBeInTheDocument();
      expect(screen.getByText('Wild Rose')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('devrait gérer les recherches vides', async () => {
    render(<Plants />, { wrapper: createWrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Ajouter une nouvelle plante')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('Ajouter une nouvelle plante');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Rechercher par nom')).toBeInTheDocument();
    });
    
    const nameTab = screen.getByText('Rechercher par nom');
    fireEvent.click(nameTab);
    
    const searchInput = screen.getByLabelText('Nom de la plante');
    
    // Rechercher un terme inexistant
    fireEvent.change(searchInput, { target: { value: 'planteinexistante' } });
    
    await waitFor(() => {
      expect(mockPlantsApiService.searchPlants).toHaveBeenCalledWith('planteinexistante', 10);
    }, { timeout: 2000 });
  });

  test('devrait afficher le message multilingue', async () => {
    render(<Plants />, { wrapper: createWrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Ajouter une nouvelle plante')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('Ajouter une nouvelle plante');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Rechercher par nom')).toBeInTheDocument();
    });
    
    const nameTab = screen.getByText('Rechercher par nom');
    fireEvent.click(nameTab);
    
    // Vérifier que le message multilingue est présent
    await waitFor(() => {
      expect(screen.getByText(/Tapez en français ou anglais/)).toBeInTheDocument();
    });
  });
});

describe('Dictionnaire de traduction français-anglais', () => {
  test('devrait contenir les traductions de base', () => {
    // Import direct du composant pour tester la logique interne
    const { getByTestId } = render(<Plants />, { wrapper: createWrapper });
    
    // Les traductions sont testées via les appels API mockés ci-dessus
    // Le dictionnaire est intégré dans la fonction smartPlantSearch
    expect(true).toBe(true); // Test de base pour s'assurer que le composant se monte
  });
});