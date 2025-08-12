import * as cron from 'node-cron';
import { Repository } from 'typeorm';
import { Plant } from '@models/Plant';
import { WateringSchedule, ScheduleStatus } from '@models/WateringSchedule';
import { WateringHistory } from '@models/WateringHistory';
import { AppDataSource } from '@config/database';
import { WeatherService } from './WeatherService';
import { WateringAlgorithm } from './WateringAlgorithm';

export class SchedulerService {
  private plantRepository: Repository<Plant>;
  private scheduleRepository: Repository<WateringSchedule>;
  private historyRepository: Repository<WateringHistory>;
  private weatherService: WeatherService;

  constructor(weatherService: WeatherService) {
    this.plantRepository = AppDataSource.getRepository(Plant);
    this.scheduleRepository = AppDataSource.getRepository(WateringSchedule);
    this.historyRepository = AppDataSource.getRepository(WateringHistory);
    this.weatherService = weatherService;
  }

  startAutomaticScheduling(): void {
    cron.schedule('0 6 * * *', async () => {
      console.log('🔄 Starting daily watering schedule generation...');
      await this.generateDailySchedules();
    });

    cron.schedule('0 8,20 * * *', async () => {
      console.log('🌤️ Updating weather data...');
      await this.weatherService.fetchAndStoreWeatherData();
    });

    cron.schedule('0 2 * * 0', async () => {
      console.log('🧹 Weekly cleanup...');
      await this.weeklyCleanup();
    });

    console.log('⏰ Automatic scheduling started');
  }

  async generateDailySchedules(): Promise<WateringSchedule[]> {
    try {
      const activePlants = await this.plantRepository.find({
        where: { isActive: true },
        relations: ['history']
      });

      const schedules: WateringSchedule[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await this.weatherService.fetchAndStoreWeatherData();
      const weatherData = await this.weatherService.getForecastData(5);

      for (const plant of activePlants) {
        try {
          const existingSchedule = await this.scheduleRepository.findOne({
            where: {
              plantId: plant.id,
              scheduledDate: today,
              status: ScheduleStatus.PENDING
            }
          });

          if (existingSchedule) {
            console.log(`⏭️ Schedule already exists for plant ${plant.name}`);
            continue;
          }

          const lastWatering = await this.getLastWatering(plant.id);
          const recommendation = WateringAlgorithm.calculateWateringRecommendation(
            plant,
            weatherData,
            lastWatering,
            3
          );

          if (recommendation.shouldWater && recommendation.confidence >= 0.7) {
            const schedule = new WateringSchedule();
            schedule.plantId = plant.id;
            schedule.scheduledDate = today;
            schedule.waterAmountMl = recommendation.waterAmountMl;
            schedule.status = ScheduleStatus.PENDING;
            schedule.reason = recommendation.reason;

            const savedSchedule = await this.scheduleRepository.save(schedule);
            schedules.push(savedSchedule);

            console.log(`✅ Schedule created for ${plant.name}: ${recommendation.waterAmountMl}ml - ${recommendation.reason}`);
          } else {
            console.log(`⏭️ No watering needed for ${plant.name}: ${recommendation.reason}`);
          }

        } catch (error) {
          console.error(`❌ Error processing plant ${plant.name}:`, error);
        }
      }

      return schedules;

    } catch (error) {
      console.error('❌ Failed to generate daily schedules:', error);
      throw error;
    }
  }

  async generateScheduleForPlant(plantId: string, targetDate?: Date): Promise<WateringSchedule | null> {
    const plant = await this.plantRepository.findOne({
      where: { id: plantId },
      relations: ['history']
    });

    if (!plant || !plant.isActive) {
      throw new Error('Plant not found or inactive');
    }

    const scheduleDate = targetDate || new Date();
    scheduleDate.setHours(0, 0, 0, 0);

    const weatherData = await this.weatherService.getForecastData(5);
    const lastWatering = await this.getLastWatering(plantId);

    const recommendation = WateringAlgorithm.calculateWateringRecommendation(
      plant,
      weatherData,
      lastWatering
    );

    if (!recommendation.shouldWater || recommendation.confidence < 0.5) {
      return null;
    }

    const existingSchedule = await this.scheduleRepository.findOne({
      where: {
        plantId,
        scheduledDate: scheduleDate,
        status: ScheduleStatus.PENDING
      }
    });

    if (existingSchedule) {
      existingSchedule.waterAmountMl = recommendation.waterAmountMl;
      existingSchedule.reason = recommendation.reason;
      return await this.scheduleRepository.save(existingSchedule);
    }

    const schedule = new WateringSchedule();
    schedule.plantId = plantId;
    schedule.scheduledDate = scheduleDate;
    schedule.waterAmountMl = recommendation.waterAmountMl;
    schedule.status = ScheduleStatus.PENDING;
    schedule.reason = recommendation.reason;

    return await this.scheduleRepository.save(schedule);
  }

  async getSchedulesForDate(date: Date): Promise<WateringSchedule[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return await this.scheduleRepository.find({
      where: { scheduledDate: targetDate },
      relations: ['plant'],
      order: { createdAt: 'ASC' }
    });
  }

  async getPendingSchedules(): Promise<WateringSchedule[]> {
    return await this.scheduleRepository.find({
      where: { status: ScheduleStatus.PENDING },
      relations: ['plant'],
      order: { scheduledDate: 'ASC' }
    });
  }

  async getOverdueSchedules(): Promise<WateringSchedule[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    return await this.scheduleRepository.find({
      where: {
        status: ScheduleStatus.PENDING,
        scheduledDate: yesterday
      },
      relations: ['plant']
    });
  }

  async completeSchedule(scheduleId: string, actualAmount?: number, notes?: string): Promise<WateringSchedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['plant']
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    schedule.markCompleted(actualAmount, notes);
    const savedSchedule = await this.scheduleRepository.save(schedule);

    const history = new WateringHistory();
    history.plantId = schedule.plantId;
    history.wateredAt = new Date();
    history.waterAmountMl = schedule.actualWaterAmountMl || schedule.waterAmountMl;
    history.wasScheduled = true;
    history.scheduleId = scheduleId;
    history.notes = notes;

    await this.historyRepository.save(history);

    console.log(`✅ Schedule completed for plant ${schedule.plant.name}`);
    return savedSchedule;
  }

  async skipSchedule(scheduleId: string, reason?: string): Promise<WateringSchedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['plant']
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    schedule.markSkipped(reason);
    const savedSchedule = await this.scheduleRepository.save(schedule);

    console.log(`⏭️ Schedule skipped for plant ${schedule.plant.name}: ${reason}`);
    return savedSchedule;
  }

  async getWeeklyScheduleSummary(): Promise<any> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.plant', 'plant')
      .where('schedule.scheduledDate BETWEEN :start AND :end', {
        start: startOfWeek,
        end: endOfWeek
      })
      .orderBy('schedule.scheduledDate', 'ASC')
      .getMany();

    const summary = {
      totalSchedules: schedules.length,
      completedSchedules: schedules.filter(s => s.status === ScheduleStatus.COMPLETED).length,
      pendingSchedules: schedules.filter(s => s.status === ScheduleStatus.PENDING).length,
      skippedSchedules: schedules.filter(s => s.status === ScheduleStatus.SKIPPED).length,
      totalWaterUsed: schedules
        .filter(s => s.status === ScheduleStatus.COMPLETED)
        .reduce((total, s) => total + (s.actualWaterAmountMl || s.waterAmountMl), 0),
      schedulesByDay: {} as any
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      const dayName = daysOfWeek[dayDate.getDay()];
      
      summary.schedulesByDay[dayName] = schedules.filter(s => 
        s.scheduledDate.toDateString() === dayDate.toDateString()
      );
    }

    return summary;
  }

  private async getLastWatering(plantId: string): Promise<WateringHistory | undefined> {
    const result = await this.historyRepository.findOne({
      where: { plantId },
      order: { wateredAt: 'DESC' }
    });
    return result || undefined;
  }

  private async weeklyCleanup(): Promise<void> {
    await this.weatherService.cleanupOldData(30);
    
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 90);
    
    const result = await this.scheduleRepository
      .createQueryBuilder()
      .delete()
      .where('scheduledDate < :oldDate', { oldDate })
      .andWhere('status != :pending', { pending: ScheduleStatus.PENDING })
      .execute();

    console.log(`🧹 Cleaned up ${result.affected} old schedules`);
  }
}