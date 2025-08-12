import axios from 'axios';
import { COMPLETE_PLANTS_DATABASE, searchPlantsInDatabase } from '../data/plantsDatabase';

// API alternative plus stable - Perenual
const PERENUAL_API_KEY = 'sk-tQkz669b659e1c9616842'; // API key gratuite
const PERENUAL_BASE_URL = 'https://perenual.com/api';

// Interfaces pour l'API Trefle
export interface TrefleSearchResult {
  id: number;
  common_name: string | null;
  scientific_name: string;
  slug: string;
  synonyms?: string[];
  family?: string;
  genus?: string;
  image_url?: string;
}

export interface TrefleSpecies extends TrefleSearchResult {
  year?: number;
  bibliography?: string;
  author?: string;
  status?: string;
  rank?: string;
  family_common_name?: string;
  duration?: string[];
  edible_part?: string[];
  vegetable?: boolean;
  observations?: string;
  images?: {
    flower?: Array<{ image_url: string }>;
    leaf?: Array<{ image_url: string }>;
    habit?: Array<{ image_url: string }>;
  };
  specifications?: {
    ligneous_type?: string;
    growth_form?: string;
    growth_habit?: string;
    growth_rate?: string;
    average_height?: {
      cm: number;
    };
    maximum_height?: {
      cm: number;
    };
    nitrogen_fixation?: string;
    shape_and_orientation?: string;
    toxicity?: string;
  };
  growth?: {
    ph_minimum?: number;
    ph_maximum?: number;
    light?: number;
    atmospheric_humidity?: number;
    growth_months?: string[];
    bloom_months?: string[];
    fruit_months?: string[];
    minimum_precipitation?: {
      mm: number;
    };
    maximum_precipitation?: {
      mm: number;
    };
    minimum_root_depth?: {
      cm: number;
    };
    minimum_temperature?: {
      deg_c: number;
    };
    maximum_temperature?: {
      deg_c: number;
    };
    soil_nutriments?: number;
    soil_salinity?: number;
    soil_texture?: number;
    soil_humidity?: number;
  };
}

// Interface pour compatibilité avec l'ancienne API
export interface PlantSearchResult {
  id: number;
  common_name: string;
  scientific_name: string;
  other_names?: string[];
  family?: string;
  genus?: string;
  cycle: string;
  watering: string;
  sunlight: string[];
  default_image?: {
    medium_url: string;
    small_url: string;
  };
}

export interface PlantDetails extends PlantSearchResult {
  description?: string;
  duration?: string[];
  edible_part?: string[];
  vegetable?: boolean;
  growth_rate?: string;
  average_height?: number;
  maximum_height?: number;
  ph_minimum?: number;
  ph_maximum?: number;
  light_requirement?: number;
  humidity_requirement?: number;
  minimum_temperature?: number;
  maximum_temperature?: number;
  growth_months?: string[];
  bloom_months?: string[];
  soil_requirements?: {
    nutriments?: number;
    salinity?: number;
    texture?: number;
    humidity?: number;
  };
}

class PlantsApiService {
  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    try {
      const response = await axios.get(`${PERENUAL_BASE_URL}${endpoint}`, {
        params: {
          ...params,
          key: PERENUAL_API_KEY,
        },
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Smart-Watering-App/1.0'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.warn('Erreur API Perenual:', error.response?.status, error.message);
        // Retourner des données mock en cas d'erreur
        return this.getMockData(endpoint, params);
      }
      throw error;
    }
  }

  // Données mock enrichies en cas d'indisponibilité de l'API
  private getMockData(endpoint: string, params: Record<string, any>) {
    if (endpoint === '/species-list') {
      // Utiliser la base de données complète importée
      const searchQuery = params.q?.toLowerCase() || '';
      const limit = params.limit || 20;
      
      if (!searchQuery) {
        return {
          data: COMPLETE_PLANTS_DATABASE.slice(0, Math.min(limit, 12)),
          meta: { total: Math.min(limit, 12) }
        };
      }

      const results = searchPlantsInDatabase(searchQuery, limit);
      return {
        data: results,
        meta: { total: results.length }
      };
    }

    if (endpoint.includes('/species/')) {
      const id = parseInt(endpoint.split('/').pop() || '1');
      const mockPlant = {
        id,
        common_name: 'Swiss cheese plant',
        scientific_name: 'Monstera deliciosa',
        family: 'Araceae',
        genus: 'Monstera',
        cycle: 'Perennial',
        watering: 'Average',
        sunlight: ['partial shade'],
        description: 'A popular houseplant with large, fenestrated leaves.',
        growth_rate: 'Medium',
        vegetable: false,
        duration: ['Perennial'],
        minimum_temperature: 18,
        maximum_temperature: 27,
        light_requirement: 6,
        humidity_requirement: 65,
        default_image: {
          medium_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          small_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
        },
      };
      return { data: mockPlant };
    }

    return { data: [], meta: { total: 0 } };
  }

  async searchPlants(query: string, page: number = 1): Promise<{
    plants: PlantSearchResult[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await this.makeRequest('/species-list', {
        q: query,
        page,
      });

      const plants = this.convertPerenualToPlantSearchResults(response.data || []);

      return {
        plants,
        total: response.total || plants.length,
        hasMore: page * 30 < (response.total || 0),
      };
    } catch (error) {
      console.warn('Recherche échouée, utilisation des mocks:', error);
      // Fallback vers les mocks
      const mockResponse = this.getMockData('/species-list', { q: query });
      return {
        plants: mockResponse.data as PlantSearchResult[],
        total: mockResponse.meta?.total || 0,
        hasMore: false,
      };
    }
  }

  private convertPerenualToPlantSearchResults(perenualData: any[]): PlantSearchResult[] {
    return perenualData.map(plant => ({
      id: plant.id,
      common_name: plant.common_name || plant.scientific_name,
      scientific_name: plant.scientific_name,
      other_names: plant.other_name || [],
      family: plant.family,
      genus: plant.genus,
      cycle: plant.cycle || 'Perennial',
      watering: plant.watering || 'Average',
      sunlight: plant.sunlight || ['partial sun'],
      default_image: plant.default_image ? {
        medium_url: plant.default_image.medium_url || plant.default_image.original_url,
        small_url: plant.default_image.small_url || plant.default_image.original_url,
      } : undefined,
    }));
  }

  // Gardé pour compatibilité
  private convertTrefleToPlantSearchResults(trefleData: TrefleSearchResult[]): PlantSearchResult[] {
    return this.convertPerenualToPlantSearchResults(trefleData);
  }

  async getPlantDetails(plantId: number): Promise<PlantDetails> {
    const response = await this.makeRequest(`/species/${plantId}`);
    return this.convertTrefleToPlantDetails(response.data || response);
  }

  private convertTrefleToPlantDetails(trefleData: TrefleSpecies): PlantDetails {
    const baseData = {
      id: trefleData.id,
      common_name: trefleData.common_name || trefleData.scientific_name,
      scientific_name: trefleData.scientific_name,
      other_names: trefleData.synonyms,
      family: trefleData.family,
      genus: trefleData.genus,
      description: trefleData.observations,
      duration: trefleData.duration,
      edible_part: trefleData.edible_part,
      vegetable: trefleData.vegetable || false,
      growth_rate: trefleData.specifications?.growth_rate || 'Medium',
      average_height: trefleData.specifications?.average_height?.cm,
      maximum_height: trefleData.specifications?.maximum_height?.cm,
      ph_minimum: trefleData.growth?.ph_minimum,
      ph_maximum: trefleData.growth?.ph_maximum,
      light_requirement: trefleData.growth?.light,
      humidity_requirement: trefleData.growth?.atmospheric_humidity,
      minimum_temperature: trefleData.growth?.minimum_temperature?.deg_c,
      maximum_temperature: trefleData.growth?.maximum_temperature?.deg_c,
      growth_months: trefleData.growth?.growth_months,
      bloom_months: trefleData.growth?.bloom_months,
      soil_requirements: {
        nutriments: trefleData.growth?.soil_nutriments,
        salinity: trefleData.growth?.soil_salinity,
        texture: trefleData.growth?.soil_texture,
        humidity: trefleData.growth?.soil_humidity,
      },
      cycle: trefleData.duration?.includes('Perennial') ? 'Perennial' : 
             trefleData.duration?.includes('Annual') ? 'Annual' : 'Perennial',
      watering: this.mapWateringFromHumidity(trefleData.growth?.atmospheric_humidity),
      sunlight: this.mapSunlightFromLight(trefleData.growth?.light),
      default_image: this.getImageFromTrefle(trefleData),
    };

    return baseData;
  }

  private getImageFromTrefle(trefleData: TrefleSpecies): { medium_url: string; small_url: string } | undefined {
    if (trefleData.image_url) {
      return {
        medium_url: trefleData.image_url,
        small_url: trefleData.image_url,
      };
    }
    
    const images = trefleData.images;
    if (images?.habit?.[0]?.image_url) {
      return {
        medium_url: images.habit[0].image_url,
        small_url: images.habit[0].image_url,
      };
    }
    
    if (images?.leaf?.[0]?.image_url) {
      return {
        medium_url: images.leaf[0].image_url,
        small_url: images.leaf[0].image_url,
      };
    }
    
    return undefined;
  }

  private mapWateringFromHumidity(humidity?: number): string {
    if (!humidity) return 'Average';
    if (humidity < 3) return 'Minimum';
    if (humidity > 7) return 'Frequent';
    return 'Average';
  }

  private mapSunlightFromLight(light?: number): string[] {
    if (!light) return ['partial sun'];
    if (light <= 3) return ['shade'];
    if (light <= 6) return ['partial shade'];
    if (light <= 8) return ['partial sun'];
    return ['full sun'];
  }

  async getPlantsByCategory(filters: {
    watering?: 'frequent' | 'average' | 'minimum' | 'none';
    sunlight?: 'full_sun' | 'part_sun' | 'part_shade' | 'shade';
    indoor?: boolean;
    cycle?: 'perennial' | 'annual' | 'biennial';
    poisonous?: boolean;
    edible?: boolean;
  }): Promise<PlantSearchResult[]> {
    const params: Record<string, any> = {};
    
    // Mapping des filtres vers les paramètres Trefle
    if (filters.cycle === 'perennial') params['filter[duration]'] = 'perennial';
    if (filters.cycle === 'annual') params['filter[duration]'] = 'annual';
    if (filters.edible) params['filter[edible]'] = 'true';
    
    const response = await this.makeRequest('/species', params);
    return this.convertTrefleToPlantSearchResults(response.data || []);
  }

  // Suggestions de plantes populaires pour l'interface
  async getPopularHouseplants(): Promise<PlantSearchResult[]> {
    // Rechercher quelques plantes d'intérieur populaires
    const response = await this.makeRequest('/species', {
      q: 'monstera pothos sansevieria ficus',
      'filter[common_name]': 'monstera,pothos,sansevieria,ficus'
    });
    return this.convertTrefleToPlantSearchResults(response.data || []);
  }

  // Convertir les données Trefle vers le format de notre application
  convertToAppFormat(plantData: PlantDetails) {
    return {
      name: plantData.common_name,
      scientificName: plantData.scientific_name,
      description: plantData.description || `${plantData.common_name} est une plante ${plantData.cycle.toLowerCase()}.`,
      wateringFrequency: this.mapWateringFrequency(plantData.watering),
      sunlightRequirement: plantData.sunlight?.[0] || 'partial shade',
      minTemperature: plantData.minimum_temperature || 15,
      maxTemperature: plantData.maximum_temperature || 25,
      idealHumidity: plantData.humidity_requirement || 50,
      imageUrl: plantData.default_image?.medium_url,
      growthRate: plantData.growth_rate || 'Medium',
      family: plantData.family,
      genus: plantData.genus,
    };
  }

  private mapWateringFrequency(watering: string): number {
    switch (watering?.toLowerCase()) {
      case 'frequent': return 2; // Tous les 2 jours
      case 'average': return 5; // Tous les 5 jours
      case 'minimum': return 10; // Une fois tous les 10 jours
      case 'none': return 21; // Une fois toutes les 3 semaines
      default: return 7; // Valeur par défaut: une fois par semaine
    }
  }
}

export const trefleApiService = new PlantsApiService();
// Pour compatibilité, on garde l'ancien nom
export const plantsApiService = trefleApiService;