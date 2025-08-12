import axios from 'axios';
import { Plant } from '@models/Plant';

// Configuration des APIs d'images
const API_CONFIG = {
  PERENUAL: {
    baseUrl: 'https://perenual.com/api/species',
    apiKey: process.env.PERENUAL_API_KEY || '', // Clé API désactivée par défaut
  },
  PIXABAY: {
    baseUrl: 'https://pixabay.com/api/',
    apiKey: process.env.PIXABAY_API_KEY || '', // Clé API désactivée par défaut
  },
  UNSPLASH: {
    baseUrl: 'https://api.unsplash.com/search/photos',
    apiKey: process.env.UNSPLASH_API_KEY || '', // Clé API désactivée par défaut
  }
};

// Interface pour les métadonnées d'images
interface PlantImageData {
  imageUrl: string;
  thumbnailUrl: string;
  source: 'perenual' | 'pixabay' | 'unsplash' | 'default';
  scientificName?: string;
  family?: string;
  genus?: string;
}

export class PlantImageService {
  
  /**
   * Récupère une image depuis l'API Perenual avec plusieurs stratégies
   */
  static async fetchFromPerenual(plantName: string): Promise<PlantImageData | null> {
    // Vérifier si l'API est disponible
    if (!API_CONFIG.PERENUAL.apiKey) {
      console.log(`⚠️ Perenual: Clé API non disponible`);
      return null;
    }

    try {
      console.log(`🌱 Recherche Perenual pour: ${plantName}`);
      
      // Stratégie 1: Recherche directe
      let response = await axios.get(`${API_CONFIG.PERENUAL.baseUrl}`, {
        params: {
          key: API_CONFIG.PERENUAL.apiKey,
          q: plantName,
          page: 1
        },
        timeout: 15000
      });

      // Si pas de résultat, essayer des variantes du nom
      if (!response.data?.data || response.data.data.length === 0) {
        const searchVariants = [
          plantName.split(' ')[0], // Premier mot seulement
          plantName.toLowerCase().replace(/[^a-z\s]/g, ''), // Supprimer caractères spéciaux
          plantName.replace(/\s+/g, '%20') // Encoder les espaces
        ];

        for (const variant of searchVariants) {
          try {
            response = await axios.get(`${API_CONFIG.PERENUAL.baseUrl}`, {
              params: {
                key: API_CONFIG.PERENUAL.apiKey,
                q: variant,
                page: 1
              },
              timeout: 10000
            });

            if (response.data?.data && response.data.data.length > 0) {
              console.log(`✅ Trouvé avec variante "${variant}"`);
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }

      if (response.data?.data && response.data.data.length > 0) {
        // Prendre la première plante qui a une image
        for (const plant of response.data.data.slice(0, 3)) { // Vérifier les 3 premiers résultats
          if (plant.default_image?.original_url || plant.default_image?.regular_url || plant.default_image?.medium_url) {
            console.log(`✅ Image trouvée sur Perenual: ${plant.common_name}`);
            
            return {
              imageUrl: plant.default_image.original_url || plant.default_image.regular_url || plant.default_image.medium_url,
              thumbnailUrl: plant.default_image.small_url || plant.default_image.thumbnail || plant.default_image.medium_url,
              source: 'perenual',
              scientificName: Array.isArray(plant.scientific_name) ? plant.scientific_name[0] : plant.scientific_name,
              family: plant.family,
              genus: plant.genus
            };
          }
        }
      }

      console.log(`⚠️ Perenual: Aucune image trouvée pour ${plantName}`);
      return null;
    } catch (error: any) {
      console.warn(`❌ Erreur Perenual pour ${plantName}:`, error?.message || error);
      return null;
    }
  }

  /**
   * Récupère une image depuis l'API Pixabay
   */
  static async fetchFromPixabay(plantName: string): Promise<PlantImageData | null> {
    // Vérifier si l'API est disponible
    if (!API_CONFIG.PIXABAY.apiKey) {
      console.log(`⚠️ Pixabay: Clé API non disponible`);
      return null;
    }

    try {
      console.log(`🔍 Recherche Pixabay pour: ${plantName}`);
      
      const searchQueries = [
        `${plantName} plant`,
        `${plantName} flower`,
        plantName
      ];

      for (const query of searchQueries) {
        const response = await axios.get(API_CONFIG.PIXABAY.baseUrl, {
          params: {
            key: API_CONFIG.PIXABAY.apiKey,
            q: query,
            image_type: 'photo',
            category: 'nature',
            min_width: 300,
            min_height: 200,
            per_page: 5
          },
          timeout: 10000
        });

        if (response.data?.hits && response.data.hits.length > 0) {
          const image = response.data.hits[0];
          console.log(`✅ Image trouvée sur Pixabay: ${query}`);
          return {
            imageUrl: image.webformatURL,
            thumbnailUrl: image.previewURL,
            source: 'pixabay'
          };
        }
      }

      console.log(`⚠️ Pixabay: Aucune image trouvée pour ${plantName}`);
      return null;
    } catch (error: any) {
      console.warn(`❌ Erreur Pixabay pour ${plantName}:`, error?.message || error);
      return null;
    }
  }

  /**
   * Récupère une image depuis l'API Unsplash (si clé API disponible)
   */
  static async fetchFromUnsplash(plantName: string): Promise<PlantImageData | null> {
    if (!API_CONFIG.UNSPLASH.apiKey) {
      return null;
    }

    try {
      console.log(`📸 Recherche Unsplash pour: ${plantName}`);
      
      const response = await axios.get(API_CONFIG.UNSPLASH.baseUrl, {
        headers: {
          'Authorization': `Client-ID ${API_CONFIG.UNSPLASH.apiKey}`
        },
        params: {
          query: `${plantName} plant`,
          per_page: 5,
          orientation: 'landscape'
        },
        timeout: 10000
      });

      if (response.data?.results && response.data.results.length > 0) {
        const image = response.data.results[0];
        console.log(`✅ Image trouvée sur Unsplash: ${plantName}`);
        return {
          imageUrl: image.urls.regular,
          thumbnailUrl: image.urls.thumb,
          source: 'unsplash'
        };
      }

      console.log(`⚠️ Unsplash: Aucune image trouvée pour ${plantName}`);
      return null;
    } catch (error: any) {
      console.warn(`❌ Erreur Unsplash pour ${plantName}:`, error?.message || error);
      return null;
    }
  }

  /**
   * Génère une image par défaut basée sur le nom de la plante
   */
  static generateDefaultImage(plantName: string): PlantImageData {
    const searchQuery = plantName.toLowerCase();
    
    // URLs d'images par défaut basées sur des mots-clés courants
    const defaultImages: Record<string, string> = {
      // Plantes d'intérieur populaires
      'monstera': 'https://images.unsplash.com/photo-1586093020299-c985f891dc0e?w=400&h=300&fit=crop&q=80',
      'snake plant': 'https://images.unsplash.com/photo-1593482892540-3ba46eebef64?w=400&h=300&fit=crop&q=80',
      'sansevieria': 'https://images.unsplash.com/photo-1593482892540-3ba46eebef64?w=400&h=300&fit=crop&q=80',
      'fiddle': 'https://images.unsplash.com/photo-1586093020299-c985f891dc0e?w=400&h=300&fit=crop&q=80',
      'ficus': 'https://images.unsplash.com/photo-1586093020299-c985f891dc0e?w=400&h=300&fit=crop&q=80',
      'pothos': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80',
      'philodendron': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80',
      'spider plant': 'https://images.unsplash.com/photo-1594736797933-d0413f4c1e3c?w=400&h=300&fit=crop&q=80',
      'chlorophytum': 'https://images.unsplash.com/photo-1594736797933-d0413f4c1e3c?w=400&h=300&fit=crop&q=80',
      
      // Succulentes et cactus
      'succulent': 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=300&fit=crop&q=80',
      'succulente': 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=300&fit=crop&q=80',
      'cactus': 'https://images.unsplash.com/photo-1509423350716-97f2360af8e4?w=400&h=300&fit=crop&q=80',
      'aloe': 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=400&h=300&fit=crop&q=80',
      'echeveria': 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&h=300&fit=crop&q=80',
      'jade': 'https://images.unsplash.com/photo-1565011523534-747a8601f9d7?w=400&h=300&fit=crop&q=80',
      
      // Plantes à fleurs
      'rose': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&q=80',
      'geranium': 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=300&fit=crop&q=80',
      'orchid': 'https://images.unsplash.com/photo-1513734697350-fe0d5d4aab59?w=400&h=300&fit=crop&q=80',
      'orchidée': 'https://images.unsplash.com/photo-1513734697350-fe0d5d4aab59?w=400&h=300&fit=crop&q=80',
      'violet': 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=300&fit=crop&q=80',
      'violette': 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=300&fit=crop&q=80',
      
      // Plantes aromatiques
      'lavande': 'https://images.unsplash.com/photo-1611909023032-2d11b934b7d4?w=400&h=300&fit=crop&q=80',
      'lavender': 'https://images.unsplash.com/photo-1611909023032-2d11b934b7d4?w=400&h=300&fit=crop&q=80',
      'basilic': 'https://images.unsplash.com/photo-1618375569909-3c8616cf663d?w=400&h=300&fit=crop&q=80',
      'basil': 'https://images.unsplash.com/photo-1618375569909-3c8616cf663d?w=400&h=300&fit=crop&q=80',
      'mint': 'https://images.unsplash.com/photo-1628556819653-c12b7a4ad7e1?w=400&h=300&fit=crop&q=80',
      'menthe': 'https://images.unsplash.com/photo-1628556819653-c12b7a4ad7e1?w=400&h=300&fit=crop&q=80',
      'rosemary': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&h=300&fit=crop&q=80',
      'romarin': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&h=300&fit=crop&q=80',
      'thyme': 'https://images.unsplash.com/photo-1581173788993-88bb3bb5e84e?w=400&h=300&fit=crop&q=80',
      'thym': 'https://images.unsplash.com/photo-1581173788993-88bb3bb5e84e?w=400&h=300&fit=crop&q=80',
      
      // Légumes et fruits
      'tomato': 'https://images.unsplash.com/photo-1592841200221-23d2d0bdf01b?w=400&h=300&fit=crop&q=80',
      'tomate': 'https://images.unsplash.com/photo-1592841200221-23d2d0bdf01b?w=400&h=300&fit=crop&q=80',
      'pepper': 'https://images.unsplash.com/photo-1583119022894-d9a1e3a6b3d6?w=400&h=300&fit=crop&q=80',
      'poivron': 'https://images.unsplash.com/photo-1583119022894-d9a1e3a6b3d6?w=400&h=300&fit=crop&q=80',
      'lettuce': 'https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=400&h=300&fit=crop&q=80',
      'salade': 'https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=400&h=300&fit=crop&q=80',
      
      // Fougères et plantes vertes
      'fern': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80',
      'fougère': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80',
      'bamboo': 'https://images.unsplash.com/photo-1571219349291-c6e8c3f41fd5?w=400&h=300&fit=crop&q=80',
      'bambou': 'https://images.unsplash.com/photo-1571219349291-c6e8c3f41fd5?w=400&h=300&fit=crop&q=80',
      'palm': 'https://images.unsplash.com/photo-1596528598877-3c89c6d51d8b?w=400&h=300&fit=crop&q=80',
      'palmier': 'https://images.unsplash.com/photo-1596528598877-3c89c6d51d8b?w=400&h=300&fit=crop&q=80',
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
      imageUrl,
      thumbnailUrl: imageUrl.replace('w=400', 'w=200'),
      source: 'default'
    };
  }

  /**
   * Récupère la meilleure image disponible pour une plante
   */
  static async fetchPlantImage(plantName: string): Promise<PlantImageData> {
    console.log(`🔍 Recherche d'image pour: ${plantName}`);
    
    try {
      // 1. Essayer Perenual en premier (meilleure qualité botanique)
      const perenualImage = await this.fetchFromPerenual(plantName);
      if (perenualImage) {
        return perenualImage;
      }

      // 2. Essayer Pixabay
      const pixabayImage = await this.fetchFromPixabay(plantName);
      if (pixabayImage) {
        return pixabayImage;
      }

      // 3. Essayer Unsplash si disponible
      const unsplashImage = await this.fetchFromUnsplash(plantName);
      if (unsplashImage) {
        return unsplashImage;
      }
      
    } catch (error: any) {
      console.error(`❌ Erreur lors de la récupération d'images pour ${plantName}:`, error?.message || error);
    }
    
    // 4. Utiliser une image par défaut
    console.log(`🎨 Utilisation d'une image par défaut pour: ${plantName}`);
    return this.generateDefaultImage(plantName);
  }

  /**
   * Met à jour les images d'une plante existante
   */
  static async updatePlantImages(plant: Plant): Promise<Partial<Plant>> {
    const imageData = await this.fetchPlantImage(plant.name);
    
    const updates: Partial<Plant> = {
      imageUrl: imageData.imageUrl,
      thumbnailUrl: imageData.thumbnailUrl,
      imageSource: imageData.source,
    };

    // Ajouter les informations botaniques si disponibles
    if (imageData.scientificName && !plant.scientificName) {
      updates.scientificName = imageData.scientificName;
    }
    if (imageData.family && !plant.family) {
      updates.family = imageData.family;
    }
    if (imageData.genus && !plant.genus) {
      updates.genus = imageData.genus;
    }

    console.log(`✅ Images mises à jour pour ${plant.name} (source: ${imageData.source})`);
    return updates;
  }
}