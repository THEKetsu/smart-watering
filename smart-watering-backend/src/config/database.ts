import { DataSource } from 'typeorm';
import { Plant } from '@models/Plant';
import { WeatherData } from '@models/WeatherData';
import { WateringSchedule } from '@models/WateringSchedule';
import { WateringHistory } from '@models/WateringHistory';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'smart_watering',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [Plant, WeatherData, WateringSchedule, WateringHistory],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});