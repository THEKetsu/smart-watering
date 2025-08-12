// Mock API pour tester l'interface sans backend
import { 
  Plant, 
  WeatherData, 
  WateringSchedule,
  PlantType,
  ScheduleStatus,
  ApiResponse, 
  PaginatedResponse 
} from '../types/index';

// Données mock
const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    type: PlantType.TROPICAL,
    description: 'Plante tropicale d\'intérieur avec de grandes feuilles',
    baseWateringFrequencyDays: 7,
    baseWaterAmountMl: 300,
    springMultiplier: 1.2,
    summerMultiplier: 1.5,
    autumnMultiplier: 0.8,
    winterMultiplier: 0.6,
    minTemperature: 18,
    maxTemperature: 27,
    idealHumidity: 65,
    rainThresholdMm: 3,
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Aloe Vera',
    type: PlantType.SUCCULENT,
    description: 'Plante grasse aux propriétés médicinales',
    baseWateringFrequencyDays: 14,
    baseWaterAmountMl: 150,
    springMultiplier: 1.0,
    summerMultiplier: 1.1,
    autumnMultiplier: 0.7,
    winterMultiplier: 0.5,
    minTemperature: 10,
    maxTemperature: 35,
    idealHumidity: 40,
    rainThresholdMm: 8,
    isActive: true,
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z'
  }
];

const mockWeather: WeatherData = {
  id: 'w1',
  date: new Date().toISOString().split('T')[0],
  temperatureMin: 18,
  temperatureMax: 25,
  temperatureAvg: 22,
  humidity: 65,
  precipitationMm: 2.5,
  windSpeed: 15,
  uvIndex: 6,
  weatherCondition: 'Partly cloudy',
  isForecast: false,
  createdAt: new Date().toISOString()
};

const mockSchedules: WateringSchedule[] = [
  {
    id: 's1',
    plantId: '1',
    scheduledDate: new Date().toISOString().split('T')[0],
    waterAmountMl: 300,
    status: ScheduleStatus.PENDING,
    reason: 'Arrosage régulier - conditions normales',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    plant: mockPlants[0]
  },
  {
    id: 's2',
    plantId: '2',
    scheduledDate: new Date().toISOString().split('T')[0],
    waterAmountMl: 150,
    status: ScheduleStatus.COMPLETED,
    reason: 'Arrosage hebdomadaire',
    actualWaterAmountMl: 160,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    plant: mockPlants[1]
  }
];

// Délai pour simuler les appels réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockPlantsAPI = {
  getAll: async (): Promise<PaginatedResponse<Plant>> => {
    await delay(500);
    return {
      success: true,
      data: mockPlants,
      pagination: {
        page: 1,
        limit: 10,
        totalItems: mockPlants.length,
        totalPages: 1
      }
    };
  },

  getById: async (id: string): Promise<ApiResponse<Plant>> => {
    await delay(300);
    const plant = mockPlants.find(p => p.id === id);
    if (!plant) throw new Error('Plant not found');
    return { success: true, data: plant };
  },

  create: async (data: any): Promise<ApiResponse<Plant>> => {
    await delay(1000);
    const newPlant: Plant = {
      ...data,
      id: Math.random().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    mockPlants.push(newPlant);
    return { success: true, data: newPlant };
  },

  update: async (id: string, data: any): Promise<ApiResponse<Plant>> => {
    await delay(800);
    const plantIndex = mockPlants.findIndex(p => p.id === id);
    if (plantIndex === -1) throw new Error('Plant not found');
    
    mockPlants[plantIndex] = { 
      ...mockPlants[plantIndex], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return { success: true, data: mockPlants[plantIndex] };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);
    const index = mockPlants.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Plant not found');
    mockPlants.splice(index, 1);
    return { success: true, data: undefined };
  },

  toggleActive: async (id: string): Promise<ApiResponse<Plant>> => {
    await delay(300);
    const plant = mockPlants.find(p => p.id === id);
    if (!plant) throw new Error('Plant not found');
    plant.isActive = !plant.isActive;
    plant.updatedAt = new Date().toISOString();
    return { success: true, data: plant };
  },

  getHistory: async (): Promise<PaginatedResponse<any>> => {
    await delay(400);
    return {
      success: true,
      data: [],
      pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 0 }
    };
  },

  getSchedules: async (): Promise<PaginatedResponse<WateringSchedule>> => {
    await delay(400);
    return {
      success: true,
      data: mockSchedules,
      pagination: { page: 1, limit: 10, totalItems: mockSchedules.length, totalPages: 1 }
    };
  }
};

export const mockSchedulesAPI = {
  getToday: async (): Promise<ApiResponse<WateringSchedule[]>> => {
    await delay(400);
    return { success: true, data: mockSchedules };
  },

  getPending: async (): Promise<ApiResponse<WateringSchedule[]>> => {
    await delay(400);
    const pending = mockSchedules.filter(s => s.status === ScheduleStatus.PENDING);
    return { success: true, data: pending };
  },

  getWeekSummary: async (): Promise<ApiResponse<any>> => {
    await delay(600);
    return {
      success: true,
      data: {
        totalSchedules: 5,
        completedSchedules: 3,
        pendingSchedules: 1,
        skippedSchedules: 1,
        totalWaterUsed: 800,
        schedulesByDay: {
          'Lundi': [mockSchedules[0]],
          'Mardi': [],
          'Mercredi': [mockSchedules[1]],
          'Jeudi': [],
          'Vendredi': [],
          'Samedi': [],
          'Dimanche': []
        }
      }
    };
  },

  generateDaily: async (): Promise<ApiResponse<WateringSchedule[]>> => {
    await delay(1500);
    return { success: true, data: [mockSchedules[0]] };
  },

  complete: async (id: string, data?: any): Promise<ApiResponse<WateringSchedule>> => {
    await delay(500);
    const schedule = mockSchedules.find(s => s.id === id);
    if (!schedule) throw new Error('Schedule not found');
    
    schedule.status = ScheduleStatus.COMPLETED;
    schedule.completedAt = new Date().toISOString();
    schedule.actualWaterAmountMl = data?.actualAmount || schedule.waterAmountMl;
    schedule.notes = data?.notes;
    
    return { success: true, data: schedule };
  },

  skip: async (id: string, reason: string): Promise<ApiResponse<WateringSchedule>> => {
    await delay(500);
    const schedule = mockSchedules.find(s => s.id === id);
    if (!schedule) throw new Error('Schedule not found');
    
    schedule.status = ScheduleStatus.SKIPPED;
    schedule.reason = reason;
    
    return { success: true, data: schedule };
  }
};

export const mockWeatherAPI = {
  getCurrent: async (): Promise<ApiResponse<WeatherData>> => {
    await delay(300);
    return { success: true, data: mockWeather };
  },

  getForecast: async (): Promise<ApiResponse<WeatherData[]>> => {
    await delay(500);
    const forecast = Array.from({ length: 7 }, (_, i) => ({
      ...mockWeather,
      id: `w${i + 2}`,
      date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isForecast: true,
      temperatureMin: 15 + Math.random() * 10,
      temperatureMax: 20 + Math.random() * 15,
      temperatureAvg: 18 + Math.random() * 12,
      humidity: 40 + Math.random() * 40,
      precipitationMm: Math.random() > 0.7 ? Math.random() * 10 : 0
    }));
    return { success: true, data: forecast };
  },

  update: async (): Promise<ApiResponse<WeatherData[]>> => {
    await delay(2000);
    return { success: true, data: [mockWeather] };
  },

  getHealth: async (): Promise<ApiResponse<any>> => {
    await delay(200);
    return {
      success: true,
      data: {
        hasCurrentWeather: true,
        forecastDaysAvailable: 7,
        lastUpdated: new Date().toISOString(),
        apiStatus: 'connected'
      }
    };
  }
};