import { Router, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Plant, PlantType } from '@models/Plant';
import { AppDataSource } from '@config/database';
import { validatePlantData } from '@utils/validation';
import { asyncHandler } from '@utils/asyncHandler';
import { PlantImageService } from '@services/PlantImageService';

const router = Router();
const plantRepository: Repository<Plant> = AppDataSource.getRepository(Plant);

router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = validatePlantData(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  // Extract only the Plant entity fields from the validated data
  const plantData = {
    name: value.name,
    type: value.type,
    description: value.description,
    baseWateringFrequencyDays: value.baseWateringFrequencyDays,
    baseWaterAmountMl: value.baseWaterAmountMl,
    springMultiplier: value.springMultiplier,
    summerMultiplier: value.summerMultiplier,
    autumnMultiplier: value.autumnMultiplier,
    winterMultiplier: value.winterMultiplier,
    minTemperature: value.minTemperature,
    maxTemperature: value.maxTemperature,
    idealHumidity: value.idealHumidity,
    rainThresholdMm: value.rainThresholdMm,
    isActive: value.isActive
  };

  const plant = plantRepository.create(plantData);
  
  // Récupérer automatiquement l'image de la plante
  try {
    console.log(`🌱 Récupération d'image pour la nouvelle plante: ${plant.name}`);
    const imageUpdates = await PlantImageService.updatePlantImages(plant);
    Object.assign(plant, imageUpdates);
  } catch (error: any) {
    console.warn(`⚠️ Impossible de récupérer l'image pour ${plant.name}:`, error?.message || error);
    // Continuer même si l'image échoue
  }
  
  const savedPlant = await plantRepository.save(plant);

  res.status(201).json({
    success: true,
    message: 'Plant created successfully',
    data: savedPlant
  });
}));

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    type, 
    isActive 
  } = req.query;

  const queryBuilder = plantRepository.createQueryBuilder('plant');

  if (type && Object.values(PlantType).includes(type as PlantType)) {
    queryBuilder.where('plant.type = :type', { type });
  }

  if (isActive !== undefined) {
    const activeFilter = isActive === 'true';
    queryBuilder.andWhere('plant.isActive = :isActive', { isActive: activeFilter });
  }

  const totalItems = await queryBuilder.getCount();
  const plants = await queryBuilder
    .orderBy('plant.createdAt', 'DESC')
    .skip((Number(page) - 1) * Number(limit))
    .take(Number(limit))
    .getMany();

  res.json({
    success: true,
    data: plants,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages: Math.ceil(totalItems / Number(limit))
    }
  });
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const plant = await plantRepository.findOne({
    where: { id },
    relations: ['schedules', 'history']
  });

  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'Plant not found'
    });
  }

  res.json({
    success: true,
    data: plant
  });
}));

router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const plant = await plantRepository.findOne({ where: { id } });
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'Plant not found'
    });
  }

  const { error, value } = validatePlantData(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }

  Object.assign(plant, value);
  const updatedPlant = await plantRepository.save(plant);

  res.json({
    success: true,
    message: 'Plant updated successfully',
    data: updatedPlant
  });
}));

router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const plant = await plantRepository.findOne({ where: { id } });
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'Plant not found'
    });
  }

  await plantRepository.remove(plant);

  res.json({
    success: true,
    message: 'Plant deleted successfully'
  });
}));

router.patch('/:id/toggle-active', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const plant = await plantRepository.findOne({ where: { id } });
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'Plant not found'
    });
  }

  plant.isActive = !plant.isActive;
  const updatedPlant = await plantRepository.save(plant);

  res.json({
    success: true,
    message: `Plant ${plant.isActive ? 'activated' : 'deactivated'} successfully`,
    data: updatedPlant
  });
}));

router.get('/:id/history', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    page = 1, 
    limit = 10,
    startDate,
    endDate 
  } = req.query;

  const plant = await plantRepository.findOne({ where: { id } });
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'Plant not found'
    });
  }

  const queryBuilder = plantRepository
    .createQueryBuilder('plant')
    .leftJoinAndSelect('plant.history', 'history')
    .where('plant.id = :id', { id });

  if (startDate) {
    queryBuilder.andWhere('history.wateredAt >= :startDate', { startDate });
  }

  if (endDate) {
    queryBuilder.andWhere('history.wateredAt <= :endDate', { endDate });
  }

  const result = await queryBuilder
    .orderBy('history.wateredAt', 'DESC')
    .skip((Number(page) - 1) * Number(limit))
    .take(Number(limit))
    .getOne();

  const history = result?.history || [];

  res.json({
    success: true,
    data: history,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalItems: history.length
    }
  });
}));

router.get('/:id/schedules', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    page = 1, 
    limit = 10,
    status,
    startDate,
    endDate 
  } = req.query;

  const plant = await plantRepository.findOne({ where: { id } });
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'Plant not found'
    });
  }

  const queryBuilder = plantRepository
    .createQueryBuilder('plant')
    .leftJoinAndSelect('plant.schedules', 'schedule')
    .where('plant.id = :id', { id });

  if (status) {
    queryBuilder.andWhere('schedule.status = :status', { status });
  }

  if (startDate) {
    queryBuilder.andWhere('schedule.scheduledDate >= :startDate', { startDate });
  }

  if (endDate) {
    queryBuilder.andWhere('schedule.scheduledDate <= :endDate', { endDate });
  }

  const result = await queryBuilder
    .orderBy('schedule.scheduledDate', 'DESC')
    .skip((Number(page) - 1) * Number(limit))
    .take(Number(limit))
    .getOne();

  const schedules = result?.schedules || [];

  res.json({
    success: true,
    data: schedules,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalItems: schedules.length
    }
  });
}));

// Route pour synchroniser l'image d'une plante spécifique
router.post('/:id/sync-image', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const plant = await plantRepository.findOne({ where: { id } });
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: 'Plant not found'
    });
  }

  try {
    console.log(`🔄 Synchronisation d'image pour: ${plant.name}`);
    const imageUpdates = await PlantImageService.updatePlantImages(plant);
    
    // Mettre à jour la plante avec les nouvelles données d'image
    Object.assign(plant, imageUpdates);
    const updatedPlant = await plantRepository.save(plant);

    res.json({
      success: true,
      message: 'Plant image synchronized successfully',
      data: updatedPlant
    });
  } catch (error: any) {
    console.error(`❌ Erreur lors de la synchronisation d'image pour ${plant.name}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to synchronize plant image',
      error: error?.message || 'Unknown error'
    });
  }
}));

// Route pour synchroniser toutes les images des plantes
router.post('/sync-all-images', asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log('🌱 Synchronisation de toutes les images de plantes...');
    
    const plants = await plantRepository.find({
      where: { isActive: true }
    });

    const results = {
      total: plants.length,
      updated: 0,
      errors: 0
    };

    for (const plant of plants) {
      try {
        console.log(`🔄 Synchronisation de: ${plant.name}`);
        const imageUpdates = await PlantImageService.updatePlantImages(plant);
        
        Object.assign(plant, imageUpdates);
        await plantRepository.save(plant);
        results.updated++;
        
        // Petite pause pour éviter de surcharger les APIs
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error: any) {
        console.error(`❌ Erreur pour ${plant.name}:`, error?.message || error);
        results.errors++;
      }
    }

    res.json({
      success: true,
      message: 'Bulk image synchronization completed',
      data: results
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la synchronisation globale:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to synchronize all plant images',
      error: error?.message || 'Unknown error'
    });
  }
}));

export default router;