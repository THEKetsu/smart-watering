import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Plant } from './Plant';

@Entity('watering_history')
export class WateringHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'plant_id' })
  plantId: string;

  @Column({ type: 'timestamp', name: 'watered_at' })
  wateredAt: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'water_amount_ml' })
  waterAmountMl: number;

  @Column({ type: 'boolean', default: false, name: 'was_scheduled' })
  wasScheduled: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'schedule_id' })
  scheduleId?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'soil_moisture_level' })
  soilMoistureLevel?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Plant, plant => plant.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plant_id' })
  plant: Plant;

  getDaysSinceWatering(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.wateredAt.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}