import axios from 'axios';
import { Repository } from 'typeorm';
import { WeatherData } from '@models/WeatherData';
import { AppDataSource } from '@config/database';

interface OpenWeatherResponse {
  current: {
    temp: number;
    humidity: number;
    uvi: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
    }>;
  };
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
      day: number;
    };
    humidity: number;
    rain?: { '1h': number };
    uvi: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
    }>;
  }>;
}

export class WeatherService {
  private weatherRepository: Repository<WeatherData>;
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/3.0/onecall';

  constructor() {
    this.weatherRepository = AppDataSource.getRepository(WeatherData);
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('OPENWEATHER_API_KEY is required');
    }
  }

  async fetchAndStoreWeatherData(lat: number = 48.8566, lon: number = 2.3522): Promise<WeatherData[]> {
    try {
      const response = await axios.get<OpenWeatherResponse>(this.baseUrl, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          exclude: 'minutely,hourly,alerts'
        }
      });

      const weatherDataList: WeatherData[] = [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const currentWeather = new WeatherData();
      currentWeather.date = today;
      currentWeather.temperatureMin = response.data.daily[0].temp.min;
      currentWeather.temperatureMax = response.data.daily[0].temp.max;
      currentWeather.temperatureAvg = response.data.current.temp;
      currentWeather.humidity = response.data.current.humidity;
      currentWeather.precipitationMm = response.data.daily[0].rain?.['1h'] || 0;
      currentWeather.windSpeed = response.data.current.wind_speed;
      currentWeather.uvIndex = response.data.current.uvi;
      currentWeather.weatherCondition = response.data.current.weather[0].main;
      currentWeather.isForecast = false;

      await this.saveWeatherData(currentWeather);
      weatherDataList.push(currentWeather);

      for (let i = 1; i < Math.min(response.data.daily.length, 8); i++) {
        const dailyData = response.data.daily[i];
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + i);

        const forecastWeather = new WeatherData();
        forecastWeather.date = forecastDate;
        forecastWeather.temperatureMin = dailyData.temp.min;
        forecastWeather.temperatureMax = dailyData.temp.max;
        forecastWeather.temperatureAvg = dailyData.temp.day;
        forecastWeather.humidity = dailyData.humidity;
        forecastWeather.precipitationMm = dailyData.rain?.['1h'] || 0;
        forecastWeather.windSpeed = dailyData.wind_speed;
        forecastWeather.uvIndex = dailyData.uvi;
        forecastWeather.weatherCondition = dailyData.weather[0].main;
        forecastWeather.isForecast = true;

        await this.saveWeatherData(forecastWeather);
        weatherDataList.push(forecastWeather);
      }

      console.log(`✅ Weather data updated: ${weatherDataList.length} entries`);
      return weatherDataList;

    } catch (error) {
      console.error('❌ Failed to fetch weather data:', error);
      throw new Error('Failed to fetch weather data from OpenWeatherMap');
    }
  }

  async getRecentWeatherData(days: number = 7): Promise<WeatherData[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    return await this.weatherRepository
      .createQueryBuilder('weather')
      .where('weather.date >= :startDate', { startDate })
      .orderBy('weather.date', 'ASC')
      .getMany();
  }

  async getForecastData(days: number = 5): Promise<WeatherData[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + days);

    return await this.weatherRepository
      .createQueryBuilder('weather')
      .where('weather.date >= :today', { today })
      .andWhere('weather.date <= :endDate', { endDate })
      .orderBy('weather.date', 'ASC')
      .getMany();
  }

  async getTodayWeather(): Promise<WeatherData | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.weatherRepository
      .createQueryBuilder('weather')
      .where('weather.date = :today', { today })
      .andWhere('weather.isForecast = false')
      .getOne();
  }

  async getWeatherForDate(date: Date): Promise<WeatherData | null> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return await this.weatherRepository
      .createQueryBuilder('weather')
      .where('weather.date = :date', { date: targetDate })
      .getOne();
  }

  private async saveWeatherData(weatherData: WeatherData): Promise<void> {
    try {
      const existingData = await this.weatherRepository
        .createQueryBuilder('weather')
        .where('weather.date = :date', { date: weatherData.date })
        .andWhere('weather.isForecast = :isForecast', { isForecast: weatherData.isForecast })
        .getOne();

      if (existingData) {
        Object.assign(existingData, weatherData);
        await this.weatherRepository.save(existingData);
      } else {
        await this.weatherRepository.save(weatherData);
      }
    } catch (error) {
      console.error('Error saving weather data:', error);
      throw error;
    }
  }

  async cleanupOldData(daysToKeep: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    cutoffDate.setHours(0, 0, 0, 0);

    const result = await this.weatherRepository
      .createQueryBuilder()
      .delete()
      .where('date < :cutoffDate', { cutoffDate })
      .andWhere('isForecast = false')
      .execute();

    console.log(`🧹 Cleaned up ${result.affected} old weather records`);
  }

  async getWeatherStats(startDate: Date, endDate: Date) {
    const result = await this.weatherRepository
      .createQueryBuilder('weather')
      .select([
        'AVG(weather.temperatureAvg) as avgTemp',
        'MAX(weather.temperatureMax) as maxTemp',
        'MIN(weather.temperatureMin) as minTemp',
        'AVG(weather.humidity) as avgHumidity',
        'SUM(weather.precipitationMm) as totalRain',
        'COUNT(*) as totalDays'
      ])
      .where('weather.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('weather.isForecast = false')
      .getRawOne();

    return {
      avgTemperature: parseFloat(result.avgTemp || '0'),
      maxTemperature: parseFloat(result.maxTemp || '0'),
      minTemperature: parseFloat(result.minTemp || '0'),
      avgHumidity: parseFloat(result.avgHumidity || '0'),
      totalRainfall: parseFloat(result.totalRain || '0'),
      totalDays: parseInt(result.totalDays || '0')
    };
  }
}