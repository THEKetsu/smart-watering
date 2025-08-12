import { Plant, Season } from '@models/Plant';
import { WeatherData } from '@models/WeatherData';
import { WateringHistory } from '@models/WateringHistory';

interface WateringRecommendation {
  shouldWater: boolean;
  waterAmountMl: number;
  confidence: number;
  reason: string;
  nextWateringDate?: Date;
}

interface AlgorithmFactors {
  seasonalFactor: number;
  weatherFactor: number;
  historyFactor: number;
  temperatureFactor: number;
  humidityFactor: number;
  rainFactor: number;
}

export class WateringAlgorithm {
  private static readonly CONFIDENCE_THRESHOLD = 0.7;
  private static readonly MAX_SKIP_DAYS = 3;

  static calculateWateringRecommendation(
    plant: Plant,
    weatherData: WeatherData[],
    lastWatering?: WateringHistory,
    forecastDays: number = 3
  ): WateringRecommendation {
    const factors = this.calculateFactors(plant, weatherData, lastWatering);
    const baseAmount = plant.baseWaterAmountMl;
    
    const currentWeather = weatherData.find(w => !w.isForecast) || weatherData[0];
    const forecast = weatherData.filter(w => w.isForecast).slice(0, forecastDays);

    const daysSinceLastWatering = lastWatering 
      ? this.getDaysSince(lastWatering.wateredAt) 
      : plant.baseWateringFrequencyDays + 1;

    const isOverdue = daysSinceLastWatering >= plant.baseWateringFrequencyDays;
    
    const willRainSoon = this.predictRainIncoming(forecast, plant.rainThresholdMm);
    
    if (willRainSoon.willRain && !isOverdue) {
      return {
        shouldWater: false,
        waterAmountMl: 0,
        confidence: willRainSoon.confidence,
        reason: `Pluie prévue dans ${willRainSoon.daysUntilRain} jour(s) - ${willRainSoon.expectedRain}mm`,
        nextWateringDate: willRainSoon.rainDate
      };
    }

    if (currentWeather.isRainyDay(plant.rainThresholdMm) && !isOverdue) {
      return {
        shouldWater: false,
        waterAmountMl: 0,
        confidence: 0.9,
        reason: `Pluie aujourd'hui: ${currentWeather.precipitationMm}mm`,
        nextWateringDate: this.calculateNextWateringDate(new Date(), plant.baseWateringFrequencyDays)
      };
    }

    if (daysSinceLastWatering > plant.baseWateringFrequencyDays + this.MAX_SKIP_DAYS) {
      const emergencyAmount = baseAmount * factors.seasonalFactor * 1.2;
      return {
        shouldWater: true,
        waterAmountMl: Math.round(emergencyAmount),
        confidence: 0.95,
        reason: `Arrosage urgent - ${daysSinceLastWatering} jours sans eau`,
        nextWateringDate: this.calculateNextWateringDate(new Date(), plant.baseWateringFrequencyDays)
      };
    }

    const adjustedAmount = this.calculateAdjustedAmount(baseAmount, factors);
    const shouldWater = this.shouldRecommendWatering(
      daysSinceLastWatering,
      plant.baseWateringFrequencyDays,
      factors,
      currentWeather,
      plant
    );

    const confidence = this.calculateConfidence(factors, currentWeather, plant, daysSinceLastWatering);

    return {
      shouldWater,
      waterAmountMl: shouldWater ? Math.round(adjustedAmount) : 0,
      confidence,
      reason: this.generateReason(factors, currentWeather, daysSinceLastWatering, plant),
      nextWateringDate: shouldWater 
        ? this.calculateNextWateringDate(new Date(), plant.baseWateringFrequencyDays)
        : undefined
    };
  }

  private static calculateFactors(
    plant: Plant,
    weatherData: WeatherData[],
    lastWatering?: WateringHistory
  ): AlgorithmFactors {
    const currentWeather = weatherData.find(w => !w.isForecast) || weatherData[0];
    const season = WeatherData.getCurrentSeason() as Season;

    return {
      seasonalFactor: plant.getSeasonalMultiplier(season),
      weatherFactor: this.calculateWeatherFactor(currentWeather, plant),
      historyFactor: this.calculateHistoryFactor(lastWatering, plant),
      temperatureFactor: this.calculateTemperatureFactor(currentWeather.temperatureAvg, plant),
      humidityFactor: this.calculateHumidityFactor(currentWeather.humidity, plant),
      rainFactor: this.calculateRainFactor(currentWeather.precipitationMm, plant)
    };
  }

  private static calculateWeatherFactor(weather: WeatherData, plant: Plant): number {
    let factor = 1.0;

    if (weather.isHotDay(25)) factor *= 1.3;
    if (weather.isDryDay(40)) factor *= 1.2;
    if (weather.temperatureAvg > plant.maxTemperature) factor *= 1.4;
    if (weather.humidity < plant.idealHumidity * 0.7) factor *= 1.2;

    return Math.min(factor, 2.0);
  }

  private static calculateHistoryFactor(lastWatering?: WateringHistory, plant?: Plant): number {
    if (!lastWatering) return 1.2;

    const daysSince = this.getDaysSince(lastWatering.wateredAt);
    const expectedFrequency = plant?.baseWateringFrequencyDays || 7;

    if (daysSince > expectedFrequency * 1.5) return 1.4;
    if (daysSince < expectedFrequency * 0.7) return 0.6;
    
    return 1.0;
  }

  private static calculateTemperatureFactor(temp: number, plant: Plant): number {
    if (temp > plant.maxTemperature) return 1.3;
    if (temp < plant.minTemperature) return 0.7;
    if (temp > (plant.maxTemperature - 5)) return 1.1;
    
    return 1.0;
  }

  private static calculateHumidityFactor(humidity: number, plant: Plant): number {
    const idealHumidity = plant.idealHumidity;
    
    if (humidity < idealHumidity * 0.6) return 1.3;
    if (humidity > idealHumidity * 1.4) return 0.8;
    if (humidity < idealHumidity * 0.8) return 1.1;
    
    return 1.0;
  }

  private static calculateRainFactor(rain: number, plant: Plant): number {
    if (rain >= plant.rainThresholdMm) return 0.3;
    if (rain > plant.rainThresholdMm * 0.5) return 0.7;
    
    return 1.0;
  }

  private static calculateAdjustedAmount(baseAmount: number, factors: AlgorithmFactors): number {
    return baseAmount * 
           factors.seasonalFactor * 
           factors.weatherFactor * 
           factors.temperatureFactor * 
           factors.humidityFactor * 
           factors.rainFactor * 
           Math.max(factors.historyFactor, 0.3);
  }

  private static shouldRecommendWatering(
    daysSinceLastWatering: number,
    baseFrequency: number,
    factors: AlgorithmFactors,
    weather: WeatherData,
    plant: Plant
  ): boolean {
    if (daysSinceLastWatering >= baseFrequency) return true;
    
    const urgencyScore = (daysSinceLastWatering / baseFrequency) * 
                        factors.weatherFactor * 
                        factors.temperatureFactor;
    
    if (urgencyScore > 0.8 && weather.isHotDay(28)) return true;
    if (urgencyScore > 0.9 && weather.isDryDay(35)) return true;
    
    return false;
  }

  private static calculateConfidence(
    factors: AlgorithmFactors,
    weather: WeatherData,
    plant: Plant,
    daysSinceLastWatering: number
  ): number {
    let confidence = 0.5;

    confidence += Math.min(daysSinceLastWatering / plant.baseWateringFrequencyDays, 0.3);
    
    if (weather.isHotDay(30)) confidence += 0.2;
    if (weather.isDryDay(30)) confidence += 0.15;
    if (weather.precipitationMm > plant.rainThresholdMm) confidence += 0.25;

    return Math.min(Math.max(confidence, 0.1), 1.0);
  }

  private static generateReason(
    factors: AlgorithmFactors,
    weather: WeatherData,
    daysSinceLastWatering: number,
    plant: Plant
  ): string {
    const reasons: string[] = [];

    if (daysSinceLastWatering >= plant.baseWateringFrequencyDays) {
      reasons.push(`${daysSinceLastWatering} jours depuis dernier arrosage`);
    }

    if (weather.isHotDay(28)) {
      reasons.push(`Température élevée: ${weather.temperatureMax}°C`);
    }

    if (weather.isDryDay(35)) {
      reasons.push(`Humidité faible: ${weather.humidity}%`);
    }

    if (factors.seasonalFactor > 1.1) {
      reasons.push('Besoins saisonniers augmentés');
    }

    return reasons.join(' • ') || 'Conditions standards';
  }

  private static predictRainIncoming(
    forecast: WeatherData[],
    threshold: number
  ): { willRain: boolean; confidence: number; daysUntilRain?: number; rainDate?: Date; expectedRain?: number } {
    for (let i = 0; i < forecast.length; i++) {
      const day = forecast[i];
      if (day.precipitationMm >= threshold) {
        return {
          willRain: true,
          confidence: 0.8,
          daysUntilRain: i + 1,
          rainDate: day.date,
          expectedRain: day.precipitationMm
        };
      }
    }

    return { willRain: false, confidence: 0.6 };
  }

  private static getDaysSince(date: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  private static calculateNextWateringDate(fromDate: Date, frequency: number): Date {
    const nextDate = new Date(fromDate);
    nextDate.setDate(nextDate.getDate() + frequency);
    return nextDate;
  }
}