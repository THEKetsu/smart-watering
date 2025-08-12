import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { errorHandler } from './utils/errorHandler';
import plantRoutes from './controllers/plantController';
import weatherRoutes from './controllers/weatherController';
import scheduleRoutes from './controllers/scheduleController';
import { WeatherService } from './services/WeatherService';
import { SchedulerService } from './services/SchedulerService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/plants', plantRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/schedules', scheduleRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    const weatherService = new WeatherService();
    const schedulerService = new SchedulerService(weatherService);
    schedulerService.startAutomaticScheduling();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();