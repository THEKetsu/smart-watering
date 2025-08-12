/**
 * Tests unitaires pour le dictionnaire de traduction français-anglais
 * Test isolé sans dépendances externes
 */

// Dictionnaire de traduction français-anglais (copié depuis Plants.tsx)
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

// Fonction de traduction
const translateFrenchToEnglish = (frenchTerm: string): string | null => {
  const lowerTerm = frenchTerm.toLowerCase().trim();
  return frenchToEnglishDict[lowerTerm] || null;
};

// Fonction de validation de recherche multilingue
const validateMultilingualSearch = (searchTerm: string): {
  original: string;
  translated: string | null;
  strategies: string[];
} => {
  const original = searchTerm.toLowerCase().trim();
  const translated = translateFrenchToEnglish(original);
  
  const strategies: string[] = [
    `Direct search: "${original}"`,
    `Wildcard search: "${original}*"`,
  ];
  
  if (translated) {
    strategies.push(`French-to-English translation: "${original}" → "${translated}"`);
  }
  
  return {
    original,
    translated,
    strategies
  };
};

describe('Dictionnaire de traduction français-anglais', () => {
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

  test('devrait couvrir différentes catégories de plantes', () => {
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
    
    // Plantes d'intérieur
    expect(frenchToEnglishDict).toHaveProperty('ficus');
    expect(frenchToEnglishDict).toHaveProperty('monstera');
  });

  test('devrait avoir des traductions cohérentes', () => {
    // Vérifier que toutes les valeurs sont des chaînes non vides
    Object.entries(frenchToEnglishDict).forEach(([french, english]) => {
      expect(typeof french).toBe('string');
      expect(typeof english).toBe('string');
      expect(french.length).toBeGreaterThan(0);
      expect(english.length).toBeGreaterThan(0);
      expect(french).toBe(french.toLowerCase()); // Les clés doivent être en minuscules
    });
  });
});

describe('Fonction de traduction', () => {
  test('devrait traduire les termes français connus', () => {
    expect(translateFrenchToEnglish('basilic')).toBe('basil');
    expect(translateFrenchToEnglish('tomate')).toBe('tomato');
    expect(translateFrenchToEnglish('rose')).toBe('rose');
  });

  test('devrait gérer les majuscules et espaces', () => {
    expect(translateFrenchToEnglish('BASILIC')).toBe('basil');
    expect(translateFrenchToEnglish(' tomate ')).toBe('tomato');
    expect(translateFrenchToEnglish('Rose')).toBe('rose');
  });

  test('devrait retourner null pour les termes non traduits', () => {
    expect(translateFrenchToEnglish('planteinexistante')).toBeNull();
    expect(translateFrenchToEnglish('randomword')).toBeNull();
    expect(translateFrenchToEnglish('')).toBeNull();
  });

  test('devrait gérer les termes composés', () => {
    expect(translateFrenchToEnglish('petits pois')).toBe('peas');
    expect(translateFrenchToEnglish('olive tree')).toBeNull(); // Ce n'est pas une clé française
  });
});

describe('Validation de recherche multilingue', () => {
  test('devrait générer les stratégies de recherche pour un terme français', () => {
    const result = validateMultilingualSearch('basilic');
    
    expect(result.original).toBe('basilic');
    expect(result.translated).toBe('basil');
    expect(result.strategies).toHaveLength(3);
    expect(result.strategies[0]).toBe('Direct search: "basilic"');
    expect(result.strategies[1]).toBe('Wildcard search: "basilic*"');
    expect(result.strategies[2]).toBe('French-to-English translation: "basilic" → "basil"');
  });

  test('devrait générer les stratégies pour un terme anglais', () => {
    const result = validateMultilingualSearch('basil');
    
    expect(result.original).toBe('basil');
    expect(result.translated).toBeNull();
    expect(result.strategies).toHaveLength(2); // Pas de traduction
    expect(result.strategies[0]).toBe('Direct search: "basil"');
    expect(result.strategies[1]).toBe('Wildcard search: "basil*"');
  });

  test('devrait normaliser les termes de recherche', () => {
    const result = validateMultilingualSearch(' TOMATE ');
    
    expect(result.original).toBe('tomate');
    expect(result.translated).toBe('tomato');
  });
});

describe('Couverture des catégories de plantes', () => {
  test('devrait couvrir les herbes aromatiques populaires', () => {
    const herbs = ['basilic', 'menthe', 'persil', 'thym', 'romarin', 'lavande', 'sauge', 'origan'];
    herbs.forEach(herb => {
      expect(frenchToEnglishDict).toHaveProperty(herb);
    });
  });

  test('devrait couvrir les légumes courants', () => {
    const vegetables = ['tomate', 'courgette', 'aubergine', 'poivron', 'carotte', 'radis', 'laitue', 'épinard'];
    vegetables.forEach(vegetable => {
      expect(frenchToEnglishDict).toHaveProperty(vegetable);
    });
  });

  test('devrait couvrir les fleurs communes', () => {
    const flowers = ['rose', 'tulipe', 'tournesol', 'marguerite', 'iris'];
    flowers.forEach(flower => {
      expect(frenchToEnglishDict).toHaveProperty(flower);
    });
  });

  test('devrait couvrir les arbres fruitiers', () => {
    const fruitTrees = ['pommier', 'poirier', 'cerisier', 'citronnier', 'olivier'];
    fruitTrees.forEach(tree => {
      expect(frenchToEnglishDict).toHaveProperty(tree);
    });
  });

  test('devrait couvrir les plantes d\'intérieur populaires', () => {
    const housePlants = ['ficus', 'monstera', 'pothos', 'philodendron', 'cactus', 'succulente'];
    housePlants.forEach(plant => {
      expect(frenchToEnglishDict).toHaveProperty(plant);
    });
  });
});

describe('Tests de robustesse', () => {
  test('devrait gérer des entrées vides ou invalides', () => {
    expect(translateFrenchToEnglish('')).toBeNull();
    expect(translateFrenchToEnglish('   ')).toBeNull();
  });

  test('devrait être insensible à la casse', () => {
    const testCases = [
      ['basilic', 'basil'],
      ['BASILIC', 'basil'],
      ['Basilic', 'basil'],
      ['bAsIlIc', 'basil']
    ];

    testCases.forEach(([input, expected]) => {
      expect(translateFrenchToEnglish(input)).toBe(expected);
    });
  });

  test('devrait gérer les espaces en début et fin', () => {
    expect(translateFrenchToEnglish('  basilic  ')).toBe('basil');
    expect(translateFrenchToEnglish('\ttomate\n')).toBe('tomato');
  });
});