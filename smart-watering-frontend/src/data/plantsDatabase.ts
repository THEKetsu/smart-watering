// Base de données complète de plantes pour le mode mock
// Inspirée des bases de données botaniques réelles

import { PlantSearchResult } from '../services/plantsApi';

export const COMPLETE_PLANTS_DATABASE: PlantSearchResult[] = [
  // PLANTES D'INTÉRIEUR POPULAIRES
  {
    id: 1,
    common_name: 'Monstera Deliciosa',
    scientific_name: 'Monstera deliciosa',
    other_names: ['Swiss Cheese Plant', 'Split-leaf Philodendron', 'Monstera'],
    family: 'Araceae',
    genus: 'Monstera',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['part shade'],
    default_image: {
      medium_url: 'https://perenual.com/storage/species_image/1_monstera_deliciosa/medium/52567842536_fc1e6de5ad_b.jpg',
      small_url: 'https://perenual.com/storage/species_image/1_monstera_deliciosa/small/52567842536_fc1e6de5ad_b.jpg',
    },
  },
  {
    id: 2,
    common_name: 'Snake Plant',
    scientific_name: 'Sansevieria trifasciata',
    other_names: ["Mother-in-law's Tongue", 'Saint George Sword', 'Langue de Belle-Mère', 'Plante Serpent'],
    family: 'Asparagaceae',
    genus: 'Sansevieria',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['part shade', 'shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1593482892540-3ba46eebef64?w=400',
      small_url: 'https://images.unsplash.com/photo-1593482892540-3ba46eebef64?w=200',
    },
  },
  {
    id: 3,
    common_name: 'Fiddle Leaf Fig',
    scientific_name: 'Ficus lyrata',
    other_names: ['Banjo Fig', 'Ficus Lyre'],
    family: 'Moraceae',
    genus: 'Ficus',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1586093020299-c985f891dc0e?w=400',
      small_url: 'https://images.unsplash.com/photo-1586093020299-c985f891dc0e?w=200',
    },
  },
  {
    id: 4,
    common_name: 'Rubber Plant',
    scientific_name: 'Ficus elastica',
    other_names: ['Rubber Tree', 'Indian Rubber Tree', 'Caoutchouc', 'Hévéa'],
    family: 'Moraceae',
    genus: 'Ficus',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['part sun', 'part shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      small_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    },
  },
  {
    id: 5,
    common_name: 'Pothos',
    scientific_name: 'Epipremnum aureum',
    other_names: ['Golden Pothos', "Devil's Ivy", 'Lierre du Diable'],
    family: 'Araceae',
    genus: 'Epipremnum',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['part shade', 'shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1509423350716-97f2360af87e?w=400',
      small_url: 'https://images.unsplash.com/photo-1509423350716-97f2360af87e?w=200',
    },
  },
  {
    id: 6,
    common_name: 'Peace Lily',
    scientific_name: 'Spathiphyllum wallisii',
    other_names: ['Fleur de Lune', 'White Sails', 'Spathiphyllum'],
    family: 'Araceae',
    genus: 'Spathiphyllum',
    cycle: 'Perennial',
    watering: 'Frequent',
    sunlight: ['part shade', 'shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400',
      small_url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=200',
    },
  },
  {
    id: 7,
    common_name: 'Spider Plant',
    scientific_name: 'Chlorophytum comosum',
    other_names: ['Plante Araignée', 'Airplane Plant', 'Ribbon Plant', 'Chlorophytum'],
    family: 'Asparagaceae',
    genus: 'Chlorophytum',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['part shade', 'shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1581110750418-66b9c12e3937?w=400',
      small_url: 'https://images.unsplash.com/photo-1581110750418-66b9c12e3937?w=200',
    },
  },
  {
    id: 8,
    common_name: 'ZZ Plant',
    scientific_name: 'Zamioculcas zamiifolia',
    other_names: ['Zamioculcas', 'Plante ZZ', 'Aroid Palm'],
    family: 'Araceae',
    genus: 'Zamioculcas',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['part shade', 'shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      small_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200',
    },
  },
  {
    id: 9,
    common_name: 'Boston Fern',
    scientific_name: 'Nephrolepis exaltata',
    other_names: ['Fougère de Boston', 'Sword Fern', 'Nephrolepis'],
    family: 'Lomariopsidaceae',
    genus: 'Nephrolepis',
    cycle: 'Perennial',
    watering: 'Frequent',
    sunlight: ['part shade', 'shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1463436079085-41bfdc95c5ee?w=400',
      small_url: 'https://images.unsplash.com/photo-1463436079085-41bfdc95c5ee?w=200',
    },
  },
  {
    id: 10,
    common_name: 'Aloe Vera',
    scientific_name: 'Aloe barbadensis',
    other_names: ['Aloe', 'True Aloe', 'Barbados Aloe', 'Aloès'],
    family: 'Asphodelaceae',
    genus: 'Aloe',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1509423350716-97f2360af87e?w=400',
      small_url: 'https://images.unsplash.com/photo-1509423350716-97f2360af87e?w=200',
    },
  },

  // PLANTES GRASSES ET CACTÉES
  {
    id: 11,
    common_name: 'Jade Plant',
    scientific_name: 'Crassula ovata',
    other_names: ['Money Plant', 'Friendship Tree', 'Arbre de Jade'],
    family: 'Crassulaceae',
    genus: 'Crassula',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1528928441742-b4ccac1589a4?w=400',
      small_url: 'https://images.unsplash.com/photo-1528928441742-b4ccac1589a4?w=200',
    },
  },
  {
    id: 12,
    common_name: 'Echeveria',
    scientific_name: 'Echeveria elegans',
    other_names: ['Mexican Snowball', 'White Mexican Rose', 'Échévéria'],
    family: 'Crassulaceae',
    genus: 'Echeveria',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
      small_url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200',
    },
  },
  {
    id: 13,
    common_name: 'Barrel Cactus',
    scientific_name: 'Ferocactus wislizeni',
    other_names: ['Fishhook Barrel Cactus', 'Arizona Barrel Cactus', 'Cactus Tonneau'],
    family: 'Cactaceae',
    genus: 'Ferocactus',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
      small_url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200',
    },
  },
  {
    id: 14,
    common_name: 'Prickly Pear',
    scientific_name: 'Opuntia ficus-indica',
    other_names: ['Indian Fig Opuntia', 'Barbary Fig', 'Figuier de Barbarie'],
    family: 'Cactaceae',
    genus: 'Opuntia',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1516237922-a1b38c60b818?w=400',
      small_url: 'https://images.unsplash.com/photo-1516237922-a1b38c60b818?w=200',
    },
  },

  // PLANTES DE JARDIN ET EXTÉRIEUR
  {
    id: 15,
    common_name: 'Rose',
    scientific_name: 'Rosa gallica',
    other_names: ['Rosier', 'Garden Rose', 'French Rose'],
    family: 'Rosaceae',
    genus: 'Rosa',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1518621012118-1d2e8e6c0e1a?w=400',
      small_url: 'https://images.unsplash.com/photo-1518621012118-1d2e8e6c0e1a?w=200',
    },
  },
  {
    id: 16,
    common_name: 'Lavender',
    scientific_name: 'Lavandula angustifolia',
    other_names: ['Lavande', 'English Lavender', 'True Lavender'],
    family: 'Lamiaceae',
    genus: 'Lavandula',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1464302583106-6efb2d2b4e8c?w=400',
      small_url: 'https://images.unsplash.com/photo-1464302583106-6efb2d2b4e8c?w=200',
    },
  },
  {
    id: 17,
    common_name: 'Sunflower',
    scientific_name: 'Helianthus annuus',
    other_names: ['Tournesol', 'Common Sunflower'],
    family: 'Asteraceae',
    genus: 'Helianthus',
    cycle: 'Annual',
    watering: 'Average',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1470119693886-47d3a203b829?w=400',
      small_url: 'https://images.unsplash.com/photo-1470119693886-47d3a203b829?w=200',
    },
  },
  {
    id: 18,
    common_name: 'Tulip',
    scientific_name: 'Tulipa gesneriana',
    other_names: ['Tulipe', 'Garden Tulip', "Didier's Tulip"],
    family: 'Liliaceae',
    genus: 'Tulipa',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=400',
      small_url: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=200',
    },
  },
  {
    id: 19,
    common_name: 'Poppy',
    scientific_name: 'Papaver rhoeas',
    other_names: ['Coquelicot', 'Common Poppy', 'Field Poppy'],
    family: 'Papaveraceae',
    genus: 'Papaver',
    cycle: 'Annual',
    watering: 'Average',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1516716183851-52dc2c70bd1a?w=400',
      small_url: 'https://images.unsplash.com/photo-1516716183851-52dc2c70bd1a?w=200',
    },
  },
  {
    id: 20,
    common_name: 'Geranium',
    scientific_name: 'Pelargonium zonale',
    other_names: ['Pélargonium', 'Garden Geranium', 'Horseshoe Geranium'],
    family: 'Geraniaceae',
    genus: 'Pelargonium',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1597848212624-e593c83aaff1?w=400',
      small_url: 'https://images.unsplash.com/photo-1597848212624-e593c83aaff1?w=200',
    },
  },

  // HERBES AROMATIQUES ET CULINAIRES
  {
    id: 21,
    common_name: 'Basil',
    scientific_name: 'Ocimum basilicum',
    other_names: ['Sweet Basil', 'Basilic', 'Great Basil'],
    family: 'Lamiaceae',
    genus: 'Ocimum',
    cycle: 'Annual',
    watering: 'Average',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400',
      small_url: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=200',
    },
  },
  {
    id: 22,
    common_name: 'Mint',
    scientific_name: 'Mentha spicata',
    other_names: ['Spearmint', 'Garden Mint', 'Menthe'],
    family: 'Lamiaceae',
    genus: 'Mentha',
    cycle: 'Perennial',
    watering: 'Frequent',
    sunlight: ['part sun', 'part shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400',
      small_url: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=200',
    },
  },
  {
    id: 23,
    common_name: 'Rosemary',
    scientific_name: 'Rosmarinus officinalis',
    other_names: ['Romarin', 'Garden Rosemary'],
    family: 'Lamiaceae',
    genus: 'Rosmarinus',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1585315372965-733db917dee0?w=400',
      small_url: 'https://images.unsplash.com/photo-1585315372965-733db917dee0?w=200',
    },
  },
  {
    id: 24,
    common_name: 'Thyme',
    scientific_name: 'Thymus vulgaris',
    other_names: ['Common Thyme', 'Thym', 'Garden Thyme'],
    family: 'Lamiaceae',
    genus: 'Thymus',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1594736797933-d0f06ba56d18?w=400',
      small_url: 'https://images.unsplash.com/photo-1594736797933-d0f06ba56d18?w=200',
    },
  },
  {
    id: 25,
    common_name: 'Parsley',
    scientific_name: 'Petroselinum crispum',
    other_names: ['Garden Parsley', 'Persil', 'Common Parsley'],
    family: 'Apiaceae',
    genus: 'Petroselinum',
    cycle: 'Biennial',
    watering: 'Average',
    sunlight: ['part sun', 'part shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1635260177909-2a558e6c4062?w=400',
      small_url: 'https://images.unsplash.com/photo-1635260177909-2a558e6c4062?w=200',
    },
  },
  {
    id: 26,
    common_name: 'Sage',
    scientific_name: 'Salvia officinalis',
    other_names: ['Garden Sage', 'Sauge', 'Common Sage'],
    family: 'Lamiaceae',
    genus: 'Salvia',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1591217670539-bee9d3e3ca0c?w=400',
      small_url: 'https://images.unsplash.com/photo-1591217670539-bee9d3e3ca0c?w=200',
    },
  },
  {
    id: 27,
    common_name: 'Oregano',
    scientific_name: 'Origanum vulgare',
    other_names: ['Wild Marjoram', 'Origan', 'Common Oregano'],
    family: 'Lamiaceae',
    genus: 'Origanum',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
      small_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200',
    },
  },
  {
    id: 28,
    common_name: 'Chives',
    scientific_name: 'Allium schoenoprasum',
    other_names: ['Garden Chives', 'Ciboulette', 'Chive'],
    family: 'Amaryllidaceae',
    genus: 'Allium',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1628001602756-4b2ba2d20748?w=400',
      small_url: 'https://images.unsplash.com/photo-1628001602756-4b2ba2d20748?w=200',
    },
  },

  // PLANTES TROPICALES ET EXOTIQUES
  {
    id: 29,
    common_name: 'Bird of Paradise',
    scientific_name: 'Strelitzia reginae',
    other_names: ['Orange Bird of Paradise', 'Crane Flower', 'Oiseau de Paradis'],
    family: 'Strelitziaceae',
    genus: 'Strelitzia',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
      small_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200',
    },
  },
  {
    id: 30,
    common_name: 'Hibiscus',
    scientific_name: 'Hibiscus rosa-sinensis',
    other_names: ['Chinese Hibiscus', 'Rose of Sharon', 'Hibiscus'],
    family: 'Malvaceae',
    genus: 'Hibiscus',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1597848212626-026a5302f9c0?w=400',
      small_url: 'https://images.unsplash.com/photo-1597848212626-026a5302f9c0?w=200',
    },
  },
  {
    id: 31,
    common_name: 'Bougainvillea',
    scientific_name: 'Bougainvillea spectabilis',
    other_names: ['Paper Flower', 'Lesser Bougainvillea', 'Bougainvillier'],
    family: 'Nyctaginaceae',
    genus: 'Bougainvillea',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1605300043686-d28bc5b91c3d?w=400',
      small_url: 'https://images.unsplash.com/photo-1605300043686-d28bc5b91c3d?w=200',
    },
  },
  {
    id: 32,
    common_name: 'Plumeria',
    scientific_name: 'Plumeria rubra',
    other_names: ['Frangipani', 'Temple Tree', 'Frangipanier'],
    family: 'Apocynaceae',
    genus: 'Plumeria',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1572408882155-6ecb92a0f0e4?w=400',
      small_url: 'https://images.unsplash.com/photo-1572408882155-6ecb92a0f0e4?w=200',
    },
  },

  // ARBRES ET ARBUSTES
  {
    id: 33,
    common_name: 'Olive Tree',
    scientific_name: 'Olea europaea',
    other_names: ['European Olive', 'Olivier', 'Common Olive'],
    family: 'Oleaceae',
    genus: 'Olea',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400',
      small_url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200',
    },
  },
  {
    id: 34,
    common_name: 'Lemon Tree',
    scientific_name: 'Citrus limon',
    other_names: ['Citronnier', 'Common Lemon'],
    family: 'Rutaceae',
    genus: 'Citrus',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1578656425270-bd8a23e02ad1?w=400',
      small_url: 'https://images.unsplash.com/photo-1578656425270-bd8a23e02ad1?w=200',
    },
  },
  {
    id: 35,
    common_name: 'Japanese Maple',
    scientific_name: 'Acer palmatum',
    other_names: ['Palmate Maple', 'Smooth Japanese Maple', 'Érable du Japon'],
    family: 'Sapindaceae',
    genus: 'Acer',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['part sun', 'part shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1572376992991-896a5550e87a?w=400',
      small_url: 'https://images.unsplash.com/photo-1572376992991-896a5550e87a?w=200',
    },
  },

  // ORCHIDÉES ET PLANTES À FLEURS SPÉCIALES
  {
    id: 36,
    common_name: 'Orchid',
    scientific_name: 'Phalaenopsis amabilis',
    other_names: ['Moth Orchid', 'Moon Orchid', 'Orchidée'],
    family: 'Orchidaceae',
    genus: 'Phalaenopsis',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['part shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1574181174086-210fb1eb4098?w=400',
      small_url: 'https://images.unsplash.com/photo-1574181174086-210fb1eb4098?w=200',
    },
  },
  {
    id: 37,
    common_name: 'African Violet',
    scientific_name: 'Saintpaulia ionantha',
    other_names: ['Violette Africaine', 'Usambara Violet'],
    family: 'Gesneriaceae',
    genus: 'Saintpaulia',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['part shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400',
      small_url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=200',
    },
  },
  {
    id: 38,
    common_name: 'Begonia',
    scientific_name: 'Begonia x semperflorens-cultorum',
    other_names: ['Wax Begonia', 'Bedding Begonia', 'Bégonia'],
    family: 'Begoniaceae',
    genus: 'Begonia',
    cycle: 'Annual',
    watering: 'Average',
    sunlight: ['part shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1597848212728-c7fcf5bac9e4?w=400',
      small_url: 'https://images.unsplash.com/photo-1597848212728-c7fcf5bac9e4?w=200',
    },
  },

  // LÉGUMES ET PLANTES COMESTIBLES
  {
    id: 39,
    common_name: 'Tomato',
    scientific_name: 'Solanum lycopersicum',
    other_names: ['Tomate', 'Love Apple', 'Garden Tomato'],
    family: 'Solanaceae',
    genus: 'Solanum',
    cycle: 'Annual',
    watering: 'Average',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
      small_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200',
    },
  },
  {
    id: 40,
    common_name: 'Pepper',
    scientific_name: 'Capsicum annuum',
    other_names: ['Bell Pepper', 'Sweet Pepper', 'Poivron'],
    family: 'Solanaceae',
    genus: 'Capsicum',
    cycle: 'Annual',
    watering: 'Average',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1583663979748-d3d9bb6ba23b?w=400',
      small_url: 'https://images.unsplash.com/photo-1583663979748-d3d9bb6ba23b?w=200',
    },
  },

  // PLANTES AQUATIQUES
  {
    id: 41,
    common_name: 'Water Lily',
    scientific_name: 'Nymphaea alba',
    other_names: ['White Water Lily', 'European White Water Lily', 'Nénuphar'],
    family: 'Nymphaeaceae',
    genus: 'Nymphaea',
    cycle: 'Perennial',
    watering: 'Frequent',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400',
      small_url: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=200',
    },
  },
  {
    id: 42,
    common_name: 'Lotus',
    scientific_name: 'Nelumbo nucifera',
    other_names: ['Sacred Lotus', 'Indian Lotus', 'Lotus Sacré'],
    family: 'Nelumbonaceae',
    genus: 'Nelumbo',
    cycle: 'Perennial',
    watering: 'Frequent',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1509220675639-af3043ded04f?w=400',
      small_url: 'https://images.unsplash.com/photo-1509220675639-af3043ded04f?w=200',
    },
  },

  // BAMBOUS ET GRAMINÉES
  {
    id: 43,
    common_name: 'Bamboo',
    scientific_name: 'Bambusa vulgaris',
    other_names: ['Common Bamboo', 'Golden Bamboo', 'Bambou'],
    family: 'Poaceae',
    genus: 'Bambusa',
    cycle: 'Perennial',
    watering: 'Frequent',
    sunlight: ['part sun', 'part shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400',
      small_url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=200',
    },
  },
  {
    id: 44,
    common_name: 'Pampas Grass',
    scientific_name: 'Cortaderia selloana',
    other_names: ['Uruguayan Pampas Grass', 'Herbe de la Pampa'],
    family: 'Poaceae',
    genus: 'Cortaderia',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
      small_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200',
    },
  },

  // CONIFÈRES
  {
    id: 45,
    common_name: 'Pine Tree',
    scientific_name: 'Pinus sylvestris',
    other_names: ['Scots Pine', 'Pin Sylvestre'],
    family: 'Pinaceae',
    genus: 'Pinus',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1441906363717-62fe51295894?w=400',
      small_url: 'https://images.unsplash.com/photo-1441906363717-62fe51295894?w=200',
    },
  },
  {
    id: 46,
    common_name: 'Cedar',
    scientific_name: 'Cedrus libani',
    other_names: ['Cedar of Lebanon', 'Lebanon Cedar', 'Cèdre du Liban'],
    family: 'Pinaceae',
    genus: 'Cedrus',
    cycle: 'Perennial',
    watering: 'Minimum',
    sunlight: ['full sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1507690797743-e55ad72f7b85?w=400',
      small_url: 'https://images.unsplash.com/photo-1507690797743-e55ad72f7b85?w=200',
    },
  },

  // PLANTES CARNIVORES
  {
    id: 47,
    common_name: 'Venus Flytrap',
    scientific_name: 'Dionaea muscipula',
    other_names: ['Venus Flytrap', 'Dionée Attrape-mouche'],
    family: 'Droseraceae',
    genus: 'Dionaea',
    cycle: 'Perennial',
    watering: 'Frequent',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      small_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200',
    },
  },
  {
    id: 48,
    common_name: 'Pitcher Plant',
    scientific_name: 'Nepenthes ventricosa',
    other_names: ['Tropical Pitcher Plant', 'Plante Carnivore'],
    family: 'Nepenthaceae',
    genus: 'Nepenthes',
    cycle: 'Perennial',
    watering: 'Frequent',
    sunlight: ['part sun', 'part shade'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400',
      small_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200',
    },
  },

  // BULBES À FLEURS
  {
    id: 49,
    common_name: 'Daffodil',
    scientific_name: 'Narcissus pseudonarcissus',
    other_names: ['Wild Daffodil', 'Lent Lily', 'Jonquille'],
    family: 'Amaryllidaceae',
    genus: 'Narcissus',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1488916916857-40b66ff40464?w=400',
      small_url: 'https://images.unsplash.com/photo-1488916916857-40b66ff40464?w=200',
    },
  },
  {
    id: 50,
    common_name: 'Hyacinth',
    scientific_name: 'Hyacinthus orientalis',
    other_names: ['Garden Hyacinth', 'Dutch Hyacinth', 'Jacinthe'],
    family: 'Asparagaceae',
    genus: 'Hyacinthus',
    cycle: 'Perennial',
    watering: 'Average',
    sunlight: ['full sun', 'part sun'],
    default_image: {
      medium_url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400',
      small_url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=200',
    },
  },
];

// Fonction de recherche pour la base de données complète
export function searchPlantsInDatabase(query: string, limit: number = 20): PlantSearchResult[] {
  const searchQuery = query.toLowerCase();
  
  if (!searchQuery) {
    return COMPLETE_PLANTS_DATABASE.slice(0, limit);
  }

  const filteredPlants = COMPLETE_PLANTS_DATABASE.filter(plant => {
    return (
      plant.common_name.toLowerCase().includes(searchQuery) ||
      plant.scientific_name.toLowerCase().includes(searchQuery) ||
      (plant.other_names && plant.other_names.some(name => 
        name.toLowerCase().includes(searchQuery)
      )) ||
      (plant.genus && plant.genus.toLowerCase().includes(searchQuery)) ||
      (plant.family && plant.family.toLowerCase().includes(searchQuery))
    );
  });

  // Tri par pertinence (noms qui commencent par la requête en premier)
  return filteredPlants
    .sort((a, b) => {
      const aStartsWith = a.common_name.toLowerCase().startsWith(searchQuery) ||
                         (a.other_names && a.other_names.some(name => 
                           name.toLowerCase().startsWith(searchQuery)
                         ));
      const bStartsWith = b.common_name.toLowerCase().startsWith(searchQuery) ||
                         (b.other_names && b.other_names.some(name => 
                           name.toLowerCase().startsWith(searchQuery)
                         ));
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    })
    .slice(0, limit);
}