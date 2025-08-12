import axios from 'axios';
import { 
  Plant, 
  WeatherData, 
  WateringSchedule, 
  WateringHistory,
  ApiResponse, 
  PaginatedResponse,
  CreatePlantData,
  WeatherStats,
  WeeklyScheduleSummary
} from '../types/index';

// Import des mocks pour le développement
import { mockPlantsAPI, mockSchedulesAPI, mockWeatherAPI } from './mockApi';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mode développement : utiliser les mocks si pas d'API ou si MOCK_MODE activé
const USE_MOCKS = process.env.NODE_ENV === 'development' && 
  (process.env.REACT_APP_MOCK_MODE === 'true' || !process.env.REACT_APP_API_URL);

// Log du mode utilisé
console.log(`🔧 Mode API: ${USE_MOCKS ? 'MOCK' : 'REAL'} - URL: ${BASE_URL}`);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Fonction helper pour gérer les mocks avec fallback automatique
const withFallback = async <T>(apiCall: () => Promise<T>, mockCall: () => Promise<T>): Promise<T> => {
  if (USE_MOCKS) {
    console.log('🔄 Utilisation des données mock');
    return await mockCall();
  }
  
  try {
    return await apiCall();
  } catch (error) {
    console.warn('⚠️ API indisponible, fallback vers les mocks');
    return await mockCall();
  }
};

export const plantsAPI = {
  getAll: async (params?: { page?: number; limit?: number; type?: string; isActive?: boolean }) => {
    return withFallback(
      async () => {
        const response = await api.get<PaginatedResponse<Plant>>('/plants', { params });
        return response.data;
      },
      () => mockPlantsAPI.getAll()
    );
  },

  getById: async (id: string) => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<Plant>>(`/plants/${id}`);
        return response.data;
      },
      () => mockPlantsAPI.getById(id)
    );
  },

  create: async (data: CreatePlantData) => {
    return withFallback(
      async () => {
        const response = await api.post<ApiResponse<Plant>>('/plants', data);
        return response.data;
      },
      () => mockPlantsAPI.create(data)
    );
  },

  update: async (id: string, data: Partial<CreatePlantData>) => {
    return withFallback(
      async () => {
        const response = await api.put<ApiResponse<Plant>>(`/plants/${id}`, data);
        return response.data;
      },
      () => mockPlantsAPI.update(id, data)
    );
  },

  delete: async (id: string) => {
    return withFallback(
      async () => {
        const response = await api.delete<ApiResponse<void>>(`/plants/${id}`);
        return response.data;
      },
      () => mockPlantsAPI.delete(id)
    );
  },

  toggleActive: async (id: string) => {
    return withFallback(
      async () => {
        const response = await api.patch<ApiResponse<Plant>>(`/plants/${id}/toggle-active`);
        return response.data;
      },
      () => mockPlantsAPI.toggleActive(id)
    );
  },

  getHistory: async (id: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }) => {
    return withFallback(
      async () => {
        const response = await api.get<PaginatedResponse<WateringHistory>>(`/plants/${id}/history`, { params });
        return response.data;
      },
      () => mockPlantsAPI.getHistory()
    );
  },

  getSchedules: async (id: string, params?: { page?: number; limit?: number; status?: string; startDate?: string; endDate?: string }) => {
    return withFallback(
      async () => {
        const response = await api.get<PaginatedResponse<WateringSchedule>>(`/plants/${id}/schedules`, { params });
        return response.data;
      },
      () => mockPlantsAPI.getSchedules()
    );
  },

  syncImage: async (id: string) => {
    return withFallback(
      async () => {
        const response = await api.post<ApiResponse<Plant>>(`/plants/${id}/sync-image`);
        return response.data;
      },
      async () => ({
        success: true,
        message: 'Mock: Image synchronized',
        data: null as any
      })
    );
  },

  syncAllImages: async () => {
    return withFallback(
      async () => {
        const response = await api.post<ApiResponse<{ total: number; updated: number; errors: number }>>(`/plants/sync-all-images`);
        return response.data;
      },
      async () => ({
        success: true,
        message: 'Mock: All images synchronized',
        data: { total: 5, updated: 5, errors: 0 }
      })
    );
  },
};

export const schedulesAPI = {
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    plantId?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    return withFallback(
      async () => {
        const response = await api.get<PaginatedResponse<WateringSchedule>>('/schedules', { params });
        return response.data;
      },
      async () => ({ 
        success: true, 
        data: [], 
        pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 0 } 
      })
    );
  },

  getById: async (id: string) => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WateringSchedule>>(`/schedules/${id}`);
        return response.data;
      },
      async () => ({ success: false, data: null as any })
    );
  },

  getPending: async () => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WateringSchedule[]>>('/schedules/pending');
        return response.data;
      },
      () => mockSchedulesAPI.getPending()
    );
  },

  getOverdue: async () => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WateringSchedule[]>>('/schedules/overdue');
        return response.data;
      },
      async () => ({ success: true, data: [] })
    );
  },

  getToday: async () => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WateringSchedule[]>>('/schedules/today');
        return response.data;
      },
      () => mockSchedulesAPI.getToday()
    );
  },

  getWeekSummary: async () => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WeeklyScheduleSummary>>('/schedules/week-summary');
        return response.data;
      },
      () => mockSchedulesAPI.getWeekSummary()
    );
  },

  generateDaily: async () => {
    return withFallback(
      async () => {
        const response = await api.post<ApiResponse<WateringSchedule[]>>('/schedules/generate');
        return response.data;
      },
      () => mockSchedulesAPI.generateDaily()
    );
  },

  generateForPlant: async (plantId: string, targetDate?: string) => {
    return withFallback(
      async () => {
        const response = await api.post<ApiResponse<WateringSchedule | null>>(`/schedules/plant/${plantId}/generate`, {
          targetDate
        });
        return response.data;
      },
      async () => ({ success: true, data: null })
    );
  },

  complete: async (id: string, data?: { actualAmount?: number; notes?: string }) => {
    return withFallback(
      async () => {
        const response = await api.patch<ApiResponse<WateringSchedule>>(`/schedules/${id}/complete`, data);
        return response.data;
      },
      () => mockSchedulesAPI.complete(id, data)
    );
  },

  skip: async (id: string, reason: string) => {
    return withFallback(
      async () => {
        const response = await api.patch<ApiResponse<WateringSchedule>>(`/schedules/${id}/skip`, { reason });
        return response.data;
      },
      () => mockSchedulesAPI.skip(id, reason)
    );
  },

  delete: async (id: string) => {
    return withFallback(
      async () => {
        const response = await api.delete<ApiResponse<void>>(`/schedules/${id}`);
        return response.data;
      },
      async () => ({ success: true, data: undefined })
    );
  },

  getByDate: async (date: string) => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WateringSchedule[]>>(`/schedules/date/${date}`);
        return response.data;
      },
      async () => ({ success: true, data: [] })
    );
  },
};

export const weatherAPI = {
  getCurrent: async () => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WeatherData>>('/weather/current');
        return response.data;
      },
      () => mockWeatherAPI.getCurrent()
    );
  },

  getForecast: async (days: number = 5) => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WeatherData[]>>('/weather/forecast', { 
          params: { days } 
        });
        return response.data;
      },
      () => mockWeatherAPI.getForecast()
    );
  },

  getRecent: async (days: number = 7) => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WeatherData[]>>('/weather/recent', { 
          params: { days } 
        });
        return response.data;
      },
      () => mockWeatherAPI.getForecast()
    );
  },

  getByDate: async (date: string) => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WeatherData>>(`/weather/date/${date}`);
        return response.data;
      },
      () => mockWeatherAPI.getCurrent()
    );
  },

  update: async (lat?: number, lon?: number) => {
    return withFallback(
      async () => {
        const response = await api.post<ApiResponse<WeatherData[]>>('/weather/update', { lat, lon });
        return response.data;
      },
      () => mockWeatherAPI.update()
    );
  },

  getStats: async (startDate: string, endDate: string) => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<WeatherStats>>('/weather/stats', { 
          params: { startDate, endDate } 
        });
        return response.data;
      },
      async () => ({ 
        success: true, 
        data: { 
          avgTemperature: 22, 
          maxTemperature: 30, 
          minTemperature: 15,
          avgHumidity: 65,
          totalRainfall: 25,
          totalDays: 7
        } 
      })
    );
  },

  cleanup: async (daysToKeep: number = 30) => {
    return withFallback(
      async () => {
        const response = await api.delete<ApiResponse<void>>('/weather/cleanup', { 
          params: { daysToKeep } 
        });
        return response.data;
      },
      async () => ({ success: true, data: undefined })
    );
  },

  getHealth: async () => {
    return withFallback(
      async () => {
        const response = await api.get<ApiResponse<any>>('/weather/health');
        return response.data;
      },
      () => mockWeatherAPI.getHealth()
    );
  },
};

export default api;