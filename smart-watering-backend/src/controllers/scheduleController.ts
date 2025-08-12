import { Router, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { WateringSchedule, ScheduleStatus } from '@models/WateringSchedule';
import { AppDataSource } from '@config/database';
import { SchedulerService } from '@services/SchedulerService';
import { WeatherService } from '@services/WeatherService';
import { asyncHandler } from '@utils/asyncHandler';

const router = Router();
const scheduleRepository: Repository<WateringSchedule> = AppDataSource.getRepository(WateringSchedule);

let schedulerService: SchedulerService;

const initializeSchedulerService = () => {
  if (!schedulerService) {
    const weatherService = new WeatherService();
    schedulerService = new SchedulerService(weatherService);
  }
  return schedulerService;
};

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    plantId,
    date,
    startDate,
    endDate
  } = req.query;

  const queryBuilder = scheduleRepository
    .createQueryBuilder('schedule')
    .leftJoinAndSelect('schedule.plant', 'plant');

  if (status && Object.values(ScheduleStatus).includes(status as ScheduleStatus)) {
    queryBuilder.where('schedule.status = :status', { status });
  }

  if (plantId) {
    queryBuilder.andWhere('schedule.plantId = :plantId', { plantId });
  }

  if (date) {
    const targetDate = new Date(date as string);
    targetDate.setHours(0, 0, 0, 0);
    queryBuilder.andWhere('schedule.scheduledDate = :date', { date: targetDate });
  }

  if (startDate) {
    queryBuilder.andWhere('schedule.scheduledDate >= :startDate', { startDate });
  }

  if (endDate) {
    queryBuilder.andWhere('schedule.scheduledDate <= :endDate', { endDate });
  }

  const totalItems = await queryBuilder.getCount();
  const schedules = await queryBuilder
    .orderBy('schedule.scheduledDate', 'DESC')
    .addOrderBy('schedule.createdAt', 'DESC')
    .skip((Number(page) - 1) * Number(limit))
    .take(Number(limit))
    .getMany();

  res.json({
    success: true,
    data: schedules,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages: Math.ceil(totalItems / Number(limit))
    }
  });
}));

router.get('/pending', asyncHandler(async (req: Request, res: Response) => {
  const scheduler = initializeSchedulerService();
  const pendingSchedules = await scheduler.getPendingSchedules();

  res.json({
    success: true,
    data: pendingSchedules,
    count: pendingSchedules.length
  });
}));

router.get('/overdue', asyncHandler(async (req: Request, res: Response) => {
  const scheduler = initializeSchedulerService();
  const overdueSchedules = await scheduler.getOverdueSchedules();

  res.json({
    success: true,
    data: overdueSchedules,
    count: overdueSchedules.length
  });
}));

router.get('/today', asyncHandler(async (req: Request, res: Response) => {
  const scheduler = initializeSchedulerService();
  const today = new Date();
  const todaySchedules = await scheduler.getSchedulesForDate(today);

  res.json({
    success: true,
    data: todaySchedules,
    count: todaySchedules.length
  });
}));

router.get('/week-summary', asyncHandler(async (req: Request, res: Response) => {
  const scheduler = initializeSchedulerService();
  const summary = await scheduler.getWeeklyScheduleSummary();

  res.json({
    success: true,
    data: summary
  });
}));

router.post('/generate', asyncHandler(async (req: Request, res: Response) => {
  const scheduler = initializeSchedulerService();
  const schedules = await scheduler.generateDailySchedules();

  res.json({
    success: true,
    message: `Generated ${schedules.length} watering schedules`,
    data: schedules
  });
}));

router.post('/plant/:plantId/generate', asyncHandler(async (req: Request, res: Response) => {
  const { plantId } = req.params;
  const { targetDate } = req.body;

  const scheduler = initializeSchedulerService();
  const schedule = await scheduler.generateScheduleForPlant(
    plantId, 
    targetDate ? new Date(targetDate) : undefined
  );

  if (!schedule) {
    return res.json({
      success: true,
      message: 'No watering needed for this plant at this time',
      data: null
    });
  }

  res.status(201).json({
    success: true,
    message: 'Schedule generated successfully',
    data: schedule
  });
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const schedule = await scheduleRepository.findOne({
    where: { id },
    relations: ['plant']
  });

  if (!schedule) {
    return res.status(404).json({
      success: false,
      message: 'Schedule not found'
    });
  }

  res.json({
    success: true,
    data: schedule
  });
}));

router.patch('/:id/complete', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { actualAmount, notes } = req.body;

  const scheduler = initializeSchedulerService();
  
  try {
    const updatedSchedule = await scheduler.completeSchedule(id, actualAmount, notes);
    
    res.json({
      success: true,
      message: 'Schedule completed successfully',
      data: updatedSchedule
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Schedule not found'
    });
  }
}));

router.patch('/:id/skip', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const scheduler = initializeSchedulerService();
  
  try {
    const updatedSchedule = await scheduler.skipSchedule(id, reason);
    
    res.json({
      success: true,
      message: 'Schedule skipped successfully',
      data: updatedSchedule
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Schedule not found'
    });
  }
}));

router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const schedule = await scheduleRepository.findOne({ where: { id } });
  
  if (!schedule) {
    return res.status(404).json({
      success: false,
      message: 'Schedule not found'
    });
  }

  if (schedule.status === ScheduleStatus.COMPLETED) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete completed schedule'
    });
  }

  await scheduleRepository.remove(schedule);

  res.json({
    success: true,
    message: 'Schedule deleted successfully'
  });
}));

router.get('/date/:date', asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.params;
  
  try {
    const targetDate = new Date(date);
    const scheduler = initializeSchedulerService();
    const schedules = await scheduler.getSchedulesForDate(targetDate);

    res.json({
      success: true,
      data: schedules,
      count: schedules.length,
      date: targetDate.toISOString().split('T')[0]
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format'
    });
  }
}));

export default router;