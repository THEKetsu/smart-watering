import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { WateringSchedule } from './WateringSchedule';
import { WateringHistory } from './WateringHistory';

export enum PlantType {
  SUCCULENT = 'succulent',
  TROPICAL = 'tropical',
  MEDITERRANEAN = 'mediterranean',
  TEMPERATE = 'temperate',
  DESERT = 'desert',
  AQUATIC = 'aquatic'
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter'
}

@Entity('plants')
export class Plant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: PlantType })
  type: PlantType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'image_url' })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'thumbnail_url' })
  thumbnailUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'scientific_name' })
  scientificName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  family?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  genus?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'image_source' })
  imageSource?: string;

  @Column({ type: 'int', default: 7, name: 'base_watering_frequency_days' })
  baseWateringFrequencyDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 250.00, name: 'base_water_amount_ml' })
  baseWaterAmountMl: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0, name: 'spring_multiplier' })
  springMultiplier: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.2, name: 'summer_multiplier' })
  summerMultiplier: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.8, name: 'autumn_multiplier' })
  autumnMultiplier: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.5, name: 'winter_multiplier' })
  winterMultiplier: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 15.0, name: 'min_temperature' })
  minTemperature: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 30.0, name: 'max_temperature' })
  maxTemperature: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 50.0, name: 'ideal_humidity' })
  idealHumidity: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.0, name: 'rain_threshold_mm' })
  rainThresholdMm: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => WateringSchedule, schedule => schedule.plant)
  schedules: WateringSchedule[];

  @OneToMany(() => WateringHistory, history => history.plant)
  history: WateringHistory[];

  getSeasonalMultiplier(season: Season): number {
    switch (season) {
      case Season.SPRING: return this.springMultiplier;
      case Season.SUMMER: return this.summerMultiplier;
      case Season.AUTUMN: return this.autumnMultiplier;
      case Season.WINTER: return this.winterMultiplier;
      default: return 1.0;
    }
  }
}