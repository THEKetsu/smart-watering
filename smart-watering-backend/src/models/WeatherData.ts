import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('weather_data')
@Index(['date'], { unique: true })
export class WeatherData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'temperature_min' })
  temperatureMin: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'temperature_max' })
  temperatureMax: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'temperature_avg' })
  temperatureAvg: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  humidity: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0.0, name: 'precipitation_mm' })
  precipitationMm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'wind_speed' })
  windSpeed?: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'uv_index' })
  uvIndex?: number;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'weather_condition' })
  weatherCondition?: string;

  @Column({ type: 'boolean', default: false, name: 'is_forecast' })
  isForecast: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  static getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
    const month = new Date().getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  isRainyDay(threshold: number = 1.0): boolean {
    return this.precipitationMm >= threshold;
  }

  isHotDay(threshold: number = 30.0): boolean {
    return this.temperatureMax >= threshold;
  }

  isDryDay(humidityThreshold: number = 40.0): boolean {
    return this.humidity <= humidityThreshold;
  }
}