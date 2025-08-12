export enum PlantType {
  SUCCULENT = 'succulent',
  TROPICAL = 'tropical',
  MEDITERRANEAN = 'mediterranean',
  TEMPERATE = 'temperate',
  DESERT = 'desert',
  AQUATIC = 'aquatic'
}

export enum ScheduleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled'
}

export interface Plant {
  id: string;
  name: string;
  type: PlantType;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  scientificName?: string;
  family?: string;
  genus?: string;
  imageSource?: string;
  baseWateringFrequencyDays: number;
  baseWaterAmountMl: number;
  springMultiplier: number;
  summerMultiplier: number;
  autumnMultiplier: number;
  winterMultiplier: number;
  minTemperature: number;
  maxTemperature: number;
  idealHumidity: number;
  rainThresholdMm: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  schedules?: WateringSchedule[];
  history?: WateringHistory[];
}

export interface WeatherData {
  id: string;
  date: string;
  temperatureMin: number;
  temperatureMax: number;
  temperatureAvg: number;
  humidity: number;
  precipitationMm: number;
  windSpeed?: number;
  uvIndex?: number;
  weatherCondition?: string;
  isForecast: boolean;
  createdAt: string;
}

export interface WateringSchedule {
  id: string;
  plantId: string;
  scheduledDate: string;
  waterAmountMl: number;
  status: ScheduleStatus;
  reason?: string;
  actualWaterAmountMl?: number;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  plant?: Plant;
}

export interface WateringHistory {
  id: string;
  plantId: string;
  wateredAt: string;
  waterAmountMl: number;
  wasScheduled: boolean;
  scheduleId?: string;
  notes?: string;
  soilMoistureLevel?: number;
  createdAt: string;
  plant?: Plant;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface WeatherStats {
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  avgHumidity: number;
  totalRainfall: number;
  totalDays: number;
}

export interface WeeklyScheduleSummary {
  totalSchedules: number;
  completedSchedules: number;
  pendingSchedules: number;
  skippedSchedules: number;
  totalWaterUsed: number;
  schedulesByDay: Record<string, WateringSchedule[]>;
}

export interface CreatePlantData {
  name: string;
  type: PlantType;
  description?: string;
  baseWateringFrequencyDays: number;
  baseWaterAmountMl: number;
  springMultiplier: number;
  summerMultiplier: number;
  autumnMultiplier: number;
  winterMultiplier: number;
  minTemperature: number;
  maxTemperature: number;
  idealHumidity: number;
  rainThresholdMm: number;
}

export const PlantTypeLabels: Record<PlantType, string> = {
  [PlantType.SUCCULENT]: 'Succulente',
  [PlantType.TROPICAL]: 'Tropicale',
  [PlantType.MEDITERRANEAN]: 'Méditerranéenne',
  [PlantType.TEMPERATE]: 'Tempérée',
  [PlantType.DESERT]: 'Désert',
  [PlantType.AQUATIC]: 'Aquatique'
};

export const ScheduleStatusLabels: Record<ScheduleStatus, string> = {
  [ScheduleStatus.PENDING]: 'En attente',
  [ScheduleStatus.COMPLETED]: 'Terminé',
  [ScheduleStatus.SKIPPED]: 'Ignoré',
  [ScheduleStatus.CANCELLED]: 'Annulé'
};