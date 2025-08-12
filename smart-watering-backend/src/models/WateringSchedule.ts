import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Plant } from './Plant';

export enum ScheduleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled'
}

@Entity('watering_schedules')
@Index(['plantId', 'scheduledDate'], { unique: true })
export class WateringSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'plant_id' })
  plantId: string;

  @Column({ type: 'date', name: 'scheduled_date' })
  scheduledDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'water_amount_ml' })
  waterAmountMl: number;

  @Column({ type: 'enum', enum: ScheduleStatus, default: ScheduleStatus.PENDING })
  status: ScheduleStatus;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'actual_water_amount_ml' })
  actualWaterAmountMl?: number;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Plant, plant => plant.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plant_id' })
  plant: Plant;

  markCompleted(actualAmount?: number, notes?: string): void {
    this.status = ScheduleStatus.COMPLETED;
    this.completedAt = new Date();
    this.actualWaterAmountMl = actualAmount || this.waterAmountMl;
    if (notes) this.notes = notes;
  }

  markSkipped(reason?: string): void {
    this.status = ScheduleStatus.SKIPPED;
    if (reason) this.reason = reason;
  }

  isOverdue(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduled = new Date(this.scheduledDate);
    
    return scheduled < today && this.status === ScheduleStatus.PENDING;
  }
}