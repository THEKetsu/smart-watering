// Service pour récupérer et gérer les images de plantes depuis plusieurs APIs
import { PlantSearchResult } from './plantsApi';

// Configuration des APIs d'images
const IMAGE_APIS = {
  UNSPLASH: {
    baseUrl: 'https://images.unsplash.com',
    searchUrl: 'https://api.unsplash.com/search/photos',
    apiKey: process.env.REACT_APP_UNSPLASH_API_KEY,
  },
  PERENUAL: {
    baseUrl: 'https://perenual.com/api/species',
    apiKey: process.env.REACT_APP_PERENUAL_API_KEY || 'sk-gMRu674c5b36e6bb07413',
  },
  PIXABAY: {
    baseUrl: 'https://pixabay.com/api/',
    apiKey: process.env.REACT_APP_PIXABAY_API_KEY || '47458895-6e54ef6a24fea66dd7a2aa1ba',
  }
};

// Interface pour les métadonnées d'images
interface PlantImageMetadata {
  url: string;
  thumbnailUrl: string;
  source: 'unsplash' | 'perenual' | 'pixabay' | 'default';
  alt: string;
  photographer?: string;
  photoUrl?: string;
}

// Cache des images pour éviter les requêtes répétées
const imageCache = new Map<string, PlantImageMetadata>();

/**
 * Génère des URLs d'images depuis Unsplash
 */
export function generateUnsplashUrl(searchQuery: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const dimensions = {
    small: '200x200',
    medium: '400x300',
    large: '600x400'
  };
  
  const query = encodeURIComponent(searchQuery);
  return `https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=300&fit=crop&crop=center&q=80&auto=format&ixlib=rb-1.2.1&s=${query}`;
}

/**
 * Génère des URLs d'images depuis Pixabay
 */
export function generatePixabayUrl(searchQuery: string): string {
  const query = encodeURIComponent(searchQuery + ' plant');
  return `https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_640.jpg`;
}

/**
 * Récupère une image depuis l'API Perenual (si disponible)
 */
export async function fetchPerenualImage(plantName: string): Promise<PlantImageMetadata | null> {
  try {
    if (!IMAGE_APIS.PERENUAL.apiKey) return null;
    
    const response = await fetch(
      `${IMAGE_APIS.PERENUAL.baseUrl}?key=${IMAGE_APIS.PERENUAL.apiKey}&q=${encodeURIComponent(plantName)}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const plant = data.data[0];
      if (plant.default_image) {
        return {
          url: plant.default_image.medium_url || plant.default_image.original_url,
          thumbnailUrl: plant.default_image.small_url || plant.default_image.thumbnail,
          source: 'perenual',
          alt: `${plant.common_name} - ${plant.scientific_name}`,
        };
      }
    }
    return null;
  } catch (error) {
    console.warn('Erreur lors de la récupération depuis Perenual:', error);
    return null;
  }
}

/**
 * Récupère une image depuis l'API Pixabay
 */
export async function fetchPixabayImage(plantName: string): Promise<PlantImageMetadata | null> {
  try {
    const response = await fetch(
      `${IMAGE_APIS.PIXABAY.baseUrl}?key=${IMAGE_APIS.PIXABAY.apiKey}&q=${encodeURIComponent(plantName + ' plant')}&image_type=photo&category=nature&min_width=300&min_height=200&per_page=3`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.hits && data.hits.length > 0) {
      const image = data.hits[0];
      return {
        url: image.webformatURL,
        thumbnailUrl: image.previewURL,
        source: 'pixabay',
        alt: plantName,
        photographer: image.user,
        photoUrl: image.pageURL,
      };
    }
    return null;
  } catch (error) {
    console.warn('Erreur lors de la récupération depuis Pixabay:', error);
    return null;
  }
}

/**
 * Génère des images par défaut basées sur le nom de la plante
 */
export function generateDefaultImages(plant: PlantSearchResult): PlantImageMetadata {
  const searchQuery = plant.common_name.toLowerCase();
  
  // URLs d'images par défaut basées sur des mots-clés courants
  const defaultImages: Record<string, string> = {
    'monstera': 'https://images.unsplash.com/photo-1586093020299-c985f891dc0e?w=400&h=300&fit=crop&q=80',
    'snake plant': 'https://images.unsplash.com/photo-1593482892540-3ba46eebef64?w=400&h=300&fit=crop&q=80',
    'sansevieria': 'https://images.unsplash.com/photo-1593482892540-3ba46eebef64?w=400&h=300&fit=crop&q=80',
    'fiddle': 'https://images.unsplash.com/photo-1586093020299-c985f891dc0e?w=400&h=300&fit=crop&q=80',
    'pothos': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80',
    'philodendron': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80',
    'succulent': 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=300&fit=crop&q=80',
    'cactus': 'https://images.unsplash.com/photo-1509423350716-97f2360af8e4?w=400&h=300&fit=crop&q=80',
    'aloe': 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=400&h=300&fit=crop&q=80',
    'rose': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&q=80',
    'geranium': 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=300&fit=crop&q=80',
    'coquelicot': 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=300&fit=crop&q=80',
    'lavande': 'https://images.unsplash.com/photo-1611909023032-2d11b934b7d4?w=400&h=300&fit=crop&q=80',
    'basilic': 'https://images.unsplash.com/photo-1618375569909-3c8616cf663d?w=400&h=300&fit=crop&q=80',
    'basil': 'https://images.unsplash.com/photo-1618375569909-3c8616cf663d?w=400&h=300&fit=crop&q=80',
    'mint': 'https://images.unsplash.com/photo-1628556819653-c12b7a4ad7e1?w=400&h=300&fit=crop&q=80',
    'menthe': 'https://images.unsplash.com/photo-1628556819653-c12b7a4ad7e1?w=400&h=300&fit=crop&q=80',
    'tomato': 'https://images.unsplash.com/photo-1592841200221-23d2d0bdf01b?w=400&h=300&fit=crop&q=80',
    'tomate': 'https://images.unsplash.com/photo-1592841200221-23d2d0bdf01b?w=400&h=300&fit=crop&q=80',
    'fern': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80',
    'fougère': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80',
    'tree': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80',
    'arbre': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80',
  };
  
  // Trouve la meilleure correspondance
  let imageUrl = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80'; // image par défaut
  
  for (const [keyword, url] of Object.entries(defaultImages)) {
    if (searchQuery.includes(keyword)) {
      imageUrl = url;
      break;
    }
  }
  
  return {
    url: imageUrl,
    thumbnailUrl: imageUrl.replace('w=400', 'w=200'),
    source: 'default',
    alt: plant.common_name,
  };
}

/**
 * Récupère la meilleure image disponible pour une plante
 */
export async function getPlantImage(plant: PlantSearchResult): Promise<PlantImageMetadata> {
  const cacheKey = `${plant.id}-${plant.common_name}`;
  
  // Vérifier le cache d'abord
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }
  
  // Si la plante a déjà une image par défaut, l'utiliser
  if (plant.default_image?.medium_url) {
    const metadata: PlantImageMetadata = {
      url: plant.default_image.medium_url,
      thumbnailUrl: plant.default_image.small_url || plant.default_image.medium_url,
      source: 'default',
      alt: plant.common_name,
    };
    imageCache.set(cacheKey, metadata);
    return metadata;
  }
  
  // Essayer les différentes sources d'images
  try {
    // 1. Essayer Perenual en premier (meilleure qualité botanique)
    const perenualImage = await fetchPerenualImage(plant.common_name);
    if (perenualImage) {
      imageCache.set(cacheKey, perenualImage);
      return perenualImage;
    }
    
    // 2. Essayer Pixabay
    const pixabayImage = await fetchPixabayImage(plant.common_name);
    if (pixabayImage) {
      imageCache.set(cacheKey, pixabayImage);
      return pixabayImage;
    }
  } catch (error) {
    console.warn('Erreur lors de la récupération d\'images:', error);
  }
  
  // 3. Utiliser les images par défaut
  const defaultImage = generateDefaultImages(plant);
  imageCache.set(cacheKey, defaultImage);
  return defaultImage;
}

/**
 * Précharge les images pour une liste de plantes
 */
export async function preloadPlantImages(plants: PlantSearchResult[]): Promise<void> {
  const promises = plants.slice(0, 10).map(plant => getPlantImage(plant)); // Précharger seulement les 10 premières
  await Promise.allSettled(promises);
}