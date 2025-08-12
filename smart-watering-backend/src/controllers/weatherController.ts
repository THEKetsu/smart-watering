import { Router, Request, Response } from 'express';
import { WeatherService } from '@services/WeatherService';
import { asyncHandler } from '@utils/asyncHandler';

const router = Router();
let weatherService: WeatherService;

const initializeWeatherService = () => {
  if (!weatherService) {
    weatherService = new WeatherService();
  }
  return weatherService;
};

router.get('/current', asyncHandler(async (req: Request, res: Response) => {
  const weather = initializeWeatherService();
  const currentWeather = await weather.getTodayWeather();

  if (!currentWeather) {
    return res.status(404).json({
      success: false,
      message: 'No weather data available for today'
    });
  }

  res.json({
    success: true,
    data: currentWeather
  });
}));

router.get('/forecast', asyncHandler(async (req: Request, res: Response) => {
  const { days = 5 } = req.query;
  const weather = initializeWeatherService();
  
  const forecastData = await weather.getForecastData(Number(days));

  res.json({
    success: true,
    data: forecastData,
    count: forecastData.length
  });
}));

router.get('/recent', asyncHandler(async (req: Request, res: Response) => {
  const { days = 7 } = req.query;
  const weather = initializeWeatherService();
  
  const recentData = await weather.getRecentWeatherData(Number(days));

  res.json({
    success: true,
    data: recentData,
    count: recentData.length
  });
}));

router.get('/date/:date', asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.params;
  
  try {
    const targetDate = new Date(date);
    const weather = initializeWeatherService();
    const weatherData = await weather.getWeatherForDate(targetDate);

    if (!weatherData) {
      return res.status(404).json({
        success: false,
        message: `No weather data found for ${date}`
      });
    }

    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format'
    });
  }
}));

router.post('/update', asyncHandler(async (req: Request, res: Response) => {
  const { lat, lon } = req.body;
  const weather = initializeWeatherService();
  
  try {
    const weatherData = await weather.fetchAndStoreWeatherData(
      lat ? Number(lat) : undefined,
      lon ? Number(lon) : undefined
    );

    res.json({
      success: true,
      message: `Weather data updated successfully`,
      data: weatherData,
      count: weatherData.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update weather data'
    });
  }
}));

router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Both startDate and endDate are required'
    });
  }

  try {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    const weather = initializeWeatherService();
    const stats = await weather.getWeatherStats(start, end);

    res.json({
      success: true,
      data: stats,
      period: {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format'
    });
  }
}));

router.delete('/cleanup', asyncHandler(async (req: Request, res: Response) => {
  const { daysToKeep = 30 } = req.query;
  const weather = initializeWeatherService();
  
  try {
    await weather.cleanupOldData(Number(daysToKeep));
    
    res.json({
      success: true,
      message: `Old weather data cleaned up (kept last ${daysToKeep} days)`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to cleanup weather data'
    });
  }
}));

router.get('/health', asyncHandler(async (req: Request, res: Response) => {
  const weather = initializeWeatherService();
  
  try {
    const currentWeather = await weather.getTodayWeather();
    const forecastCount = await weather.getForecastData(5);
    
    res.json({
      success: true,
      data: {
        hasCurrentWeather: !!currentWeather,
        forecastDaysAvailable: forecastCount.length,
        lastUpdated: currentWeather?.createdAt || null,
        apiStatus: 'connected'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Weather service health check failed',
      data: {
        hasCurrentWeather: false,
        forecastDaysAvailable: 0,
        lastUpdated: null,
        apiStatus: 'error'
      }
    });
  }
}));

export default router;