/**
 * Tests unitaires pour la fonction de recherche multilingue
 * Ce fichier teste spécifiquement la logique de traduction et de recherche intelligente
 */

import { plantsApiService } from '../services/plantsApi';

// Mock du service API
jest.mock('../services/plantsApi');
const mockPlantsApiService = plantsApiService as jest.Mocked<typeof plantsApiService>;

// Dictionnaire de traduction français-anglais (extrait du composant Plants)
const frenchToEnglishDict: Record<string, string> = {
  // Plantes communes
  'rose': 'rose',
  'basilic': 'basil',
  'menthe': 'mint',
  'persil': 'parsley',
  'coriandre': 'coriander',
  'thym': 'thyme',
  'romarin': 'rosemary',
  'lavande': 'lavender',
  'sauge': 'sage',
  'origan': 'oregano',
  
  // Légumes
  'tomate': 'tomato',
  'courgette': 'zucchini',
  'aubergine': 'eggplant',
  'poivron': 'pepper',
  'carotte': 'carrot',
  'radis': 'radish',
  'laitue': 'lettuce',
  'épinard': 'spinach',
  'haricot': 'bean',
  'petits pois': 'peas',
  
  // Fleurs
  'tulipe': 'tulip',
  'tournesol': 'sunflower',
  'marguerite': 'daisy',
  'pivoine': 'peony',
  'iris': 'iris',
  'narcisse': 'daffodil',
  'jacinthe': 'hyacinth',
  'géranium': 'geranium',
  'bégonia': 'begonia',
  'impatiens': 'impatiens',
  
  // Arbres et arbustes
  'chêne': 'oak',
  'érable': 'maple',
  'bouleau': 'birch',
  'pin': 'pine',
  'sapin': 'fir',
  'cèdre': 'cedar',
  'cyprès': 'cypress',
  'olivier': 'olive tree',
  'citronnier': 'lemon tree',
  'oranger': 'orange tree',
  
  // Plantes d'intérieur
  'ficus': 'ficus',
  'monstera': 'monstera',
  'pothos': 'pothos',
  'philodendron': 'philodendron',
  'sansevieria': 'snake plant',
  'zamioculcas': 'zz plant',
  'dracaena': 'dracaena',
  'yucca': 'yucca',
  'cactus': 'cactus',
  'succulente': 'succulent',
  
  // Fruits
  'fraisier': 'strawberry',
  'framboisier': 'raspberry',
  'groseillier': 'currant',
  'cassissier': 'blackcurrant',
  'pommier': 'apple tree',
  'poirier': 'pear tree',
  'prunier': 'plum tree',
  'cerisier': 'cherry tree',
  'abricotier': 'apricot tree',
  'pêcher': 'peach tree',
};

// Simulation de la fonction smartPlantSearch
const smartPlantSearch = async (query: string): Promise<any[]> => {
  const searchStrategies = [
    // 1. Recherche directe (anglais/latin)
    async () => {
      try {
        const response = await plantsApiService.searchPlants(query, 10);
        return response.plants || [];
      } catch {
        return [];
      }
    },
    
    // 2. Recherche avec variations scientifiques
    async () => {
      try {
        const response = await plantsApiService.searchPlants(`${query}*`, 10);
        return response.plants || [];
      } catch {
        return [];
      }
    },
    
    // 3. Traduction français-anglais
    async () => {
      const lowerQuery = query.toLowerCase().trim();
      const englishTranslation = frenchToEnglishDict[lowerQuery];
      
      if (englishTranslation) {
        try {
          const response = await plantsApiService.searchPlants(englishTranslation, 10);
          return response.plants || [];
        } catch {
          return [];
        }
      }
      return [];
    }
  ];

  // Exécuter toutes les stratégies en parallèle
  const results = await Promise.allSettled(searchStrategies.map(strategy => strategy()));
  
  // Combiner tous les résultats
  const allPlants: any[] = [];
  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value) {
      allPlants.push(...result.value);
    }
  });

  // Déduplication par ID
  const uniquePlants = allPlants.reduce((acc: any[], plant: any) => {
    if (!acc.find(p => p.id === plant.id)) {
      acc.push(plant);
    }
    return acc;
  }, []);

  // Tri par pertinence (priorité aux correspondances exactes)
  const sortedPlants = uniquePlants.sort((a, b) => {
    const aExact = a.common_name?.toLowerCase().includes(query.toLowerCase()) || 
                   a.scientific_name?.toLowerCase().includes(query.toLowerCase());
    const bExact = b.common_name?.toLowerCase().includes(query.toLowerCase()) || 
                   b.scientific_name?.toLowerCase().includes(query.toLowerCase());
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return 0;
  });

  return sortedPlants.slice(0, 10);
};

describe('Recherche multilingue - Tests unitaires', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock des réponses API
    mockPlantsApiService.searchPlants.mockImplementation(async (query: string) => {
      const mockPlants: Record<string, any[]> = {
        'rose': [
          { id: 1, common_name: 'Rose', scientific_name: 'Rosa rubiginosa', sunlight: ['full_sun'] }
        ],
        'basil': [
          { id: 2, common_name: 'Basil', scientific_name: 'Ocimum basilicum', sunlight: ['full_sun'] }
        ],
        'basilic': [], // Le terme français ne devrait pas donner de résultat direct
        'mint': [
          { id: 3, common_name: 'Mint', scientific_name: 'Mentha spicata', sunlight: ['part_shade'] }
        ],
        'tomato': [
          { id: 4, common_name: 'Tomato', scientific_name: 'Solanum lycopersicum', sunlight: ['full_sun'] }
        ],
      };
      
      return { plants: mockPlants[query.toLowerCase()] || [] };
    });
  });

  test('devrait traduire les termes français en anglais', async () => {
    // Test avec "basilic" -> "basil"
    const results = await smartPlantSearch('basilic');
    
    // Vérifier que l'API a été appelée avec la traduction
    expect(mockPlantsApiService.searchPlants).toHaveBeenCalledWith('basil', 10);
    expect(results).toHaveLength(1);
    expect(results[0].common_name).toBe('Basil');
  });

  test('devrait rechercher directement les termes anglais', async () => {
    const results = await smartPlantSearch('rose');
    
    expect(mockPlantsApiService.searchPlants).toHaveBeenCalledWith('rose', 10);
    expect(results).toHaveLength(1);
    expect(results[0].common_name).toBe('Rose');
  });

  test('devrait gérer les termes non traduits', async () => {
    const results = await smartPlantSearch('planteinexistante');
    
    // Devrait quand même essayer la recherche directe
    expect(mockPlantsApiService.searchPlants).toHaveBeenCalledWith('planteinexistante', 10);
    expect(results).toHaveLength(0);
  });

  test('devrait déduplicuer les résultats', async () => {
    // Mock pour retourner le même résultat dans plusieurs stratégies
    mockPlantsApiService.searchPlants.mockImplementation(async (query: string) => {
      if (query === 'rose' || query === 'rose*') {
        return {
          plants: [
            { id: 1, common_name: 'Rose', scientific_name: 'Rosa rubiginosa', sunlight: ['full_sun'] }
          ]
        };
      }
      return { plants: [] };
    });

    const results = await smartPlantSearch('rose');
    
    // Même si plusieurs stratégies retournent le même résultat, il ne devrait apparaître qu'une fois
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(1);
  });

  test('devrait limiter les résultats à 10 maximum', async () => {
    // Mock pour retourner beaucoup de résultats
    const manyPlants = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      common_name: `Plant ${i + 1}`,
      scientific_name: `Planta ${i + 1}`,
      sunlight: ['full_sun']
    }));

    mockPlantsApiService.searchPlants.mockResolvedValue({ plants: manyPlants });

    const results = await smartPlantSearch('test');
    
    expect(results.length).toBeLessThanOrEqual(10);
  });

  test('devrait trier par pertinence', async () => {
    mockPlantsApiService.searchPlants.mockImplementation(async (query: string) => {
      return {
        plants: [
          { id: 1, common_name: 'Rose Bush', scientific_name: 'Rosa other', sunlight: ['full_sun'] },
          { id: 2, common_name: 'Rose', scientific_name: 'Rosa rubiginosa', sunlight: ['full_sun'] },
          { id: 3, common_name: 'Other Plant', scientific_name: 'Rosa exacta', sunlight: ['full_sun'] }
        ]
      };
    });

    const results = await smartPlantSearch('rose');
    
    // Le résultat avec correspondance exacte dans le nom commun devrait être en premier
    expect(results[0].common_name).toBe('Rose');
  });
});

describe('Dictionnaire de traduction', () => {
  test('devrait contenir les traductions essentielles', () => {
    expect(frenchToEnglishDict['basilic']).toBe('basil');
    expect(frenchToEnglishDict['rose']).toBe('rose');
    expect(frenchToEnglishDict['tomate']).toBe('tomato');
    expect(frenchToEnglishDict['menthe']).toBe('mint');
    expect(frenchToEnglishDict['lavande']).toBe('lavender');
  });

  test('devrait contenir au moins 50 traductions', () => {
    const translationCount = Object.keys(frenchToEnglishDict).length;
    expect(translationCount).toBeGreaterThanOrEqual(50);
  });

  test('devrait couvrir différentes catégories', () => {
    // Herbes aromatiques
    expect(frenchToEnglishDict).toHaveProperty('basilic');
    expect(frenchToEnglishDict).toHaveProperty('thym');
    expect(frenchToEnglishDict).toHaveProperty('romarin');
    
    // Légumes
    expect(frenchToEnglishDict).toHaveProperty('tomate');
    expect(frenchToEnglishDict).toHaveProperty('courgette');
    
    // Fleurs
    expect(frenchToEnglishDict).toHaveProperty('rose');
    expect(frenchToEnglishDict).toHaveProperty('tulipe');
    
    // Arbres
    expect(frenchToEnglishDict).toHaveProperty('chêne');
    expect(frenchToEnglishDict).toHaveProperty('olivier');
  });
});