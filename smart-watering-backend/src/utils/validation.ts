import Joi from 'joi';
import { PlantType } from '@models/Plant';

export const plantSchema = Joi.object({
  // Données de base (obligatoires)
  name: Joi.string().min(1).max(255).required(),
  type: Joi.string().valid(...Object.values(PlantType)).required(),
  description: Joi.string().max(1000).optional(),
  
  // Configuration d'arrosage
  baseWateringFrequencyDays: Joi.number().integer().min(1).max(30).default(7),
  baseWaterAmountMl: Joi.number().positive().max(2000).default(250),
  springMultiplier: Joi.number().positive().max(3).default(1.0),
  summerMultiplier: Joi.number().positive().max(3).default(1.2),
  autumnMultiplier: Joi.number().positive().max(3).default(0.8),
  winterMultiplier: Joi.number().positive().max(3).default(0.5),
  
  // Conditions environnementales
  minTemperature: Joi.number().min(-10).max(50).default(15),
  maxTemperature: Joi.number().min(0).max(60).default(30),
  idealHumidity: Joi.number().min(10).max(100).default(50),
  rainThresholdMm: Joi.number().min(0).max(50).default(5),
  
  // Métadonnées utilisateur
  nickname: Joi.string().max(255).optional(),
  quantity: Joi.number().integer().min(1).default(1),
  isActive: Joi.boolean().default(true),
  
  // Données enrichies de l'API externe (optionnelles - pour import depuis l'UI)
  id: Joi.number().optional(), // ID de l'API externe
  common_name: Joi.string().optional(),
  scientific_name: Joi.string().optional(),
  other_names: Joi.array().items(Joi.string()).optional(),
  family: Joi.string().optional(),
  genus: Joi.string().optional(),
  cycle: Joi.string().optional(),
  watering: Joi.string().optional(),
  sunlight: Joi.array().items(Joi.string()).optional(),
  default_image: Joi.object({
    medium_url: Joi.string().uri().optional(),
    small_url: Joi.string().uri().optional(),
  }).optional(),
}).custom((value, helpers) => {
  if (value.minTemperature >= value.maxTemperature) {
    return helpers.error('custom.temperatureRange');
  }
  return value;
}).messages({
  'custom.temperatureRange': 'minTemperature must be less than maxTemperature'
});

export const scheduleSchema = Joi.object({
  plantId: Joi.string().uuid().required(),
  scheduledDate: Joi.date().required(),
  waterAmountMl: Joi.number().positive().max(2000).required(),
  reason: Joi.string().max(500).optional(),
  notes: Joi.string().max(1000).optional()
});

export const completeScheduleSchema = Joi.object({
  actualAmount: Joi.number().positive().max(2000).optional(),
  notes: Joi.string().max(1000).optional()
});

export const skipScheduleSchema = Joi.object({
  reason: Joi.string().max(500).required()
});

export const weatherUpdateSchema = Joi.object({
  lat: Joi.number().min(-90).max(90).optional(),
  lon: Joi.number().min(-180).max(180).optional()
});

export const dateRangeSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required()
}).messages({
  'date.min': 'endDate must be after startDate'
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

export function validatePlantData(data: any) {
  return plantSchema.validate(data, { abortEarly: false });
}

export function validateScheduleData(data: any) {
  return scheduleSchema.validate(data, { abortEarly: false });
}

export function validateCompleteSchedule(data: any) {
  return completeScheduleSchema.validate(data, { abortEarly: false });
}

export function validateSkipSchedule(data: any) {
  return skipScheduleSchema.validate(data, { abortEarly: false });
}

export function validateWeatherUpdate(data: any) {
  return weatherUpdateSchema.validate(data, { abortEarly: false });
}

export function validateDateRange(data: any) {
  return dateRangeSchema.validate(data, { abortEarly: false });
}

export function validatePagination(data: any) {
  return paginationSchema.validate(data, { abortEarly: false });
}