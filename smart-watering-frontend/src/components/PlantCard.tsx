import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  LocalFlorist,
  WaterDrop,
  Schedule,
  MoreVert,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { format, isToday, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plant, WateringSchedule, ScheduleStatus } from '../types';
import { PlantImage } from './PlantImage';

interface PlantCardProps {
  plant: Plant;
  nextWatering?: WateringSchedule;
  onWater?: (plantId: string) => void;
  onViewDetails?: (plantId: string) => void;
  compact?: boolean;
}

const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  nextWatering,
  onWater,
  onViewDetails,
  compact = false,
}) => {
  const getWateringStatus = () => {
    if (!nextWatering) return { status: 'none', color: 'default', text: 'Pas d\'arrosage prévu' };
    
    if (nextWatering.status === ScheduleStatus.COMPLETED) {
      return { status: 'completed', color: 'success', text: 'Arrosé aujourd\'hui' };
    }
    
    if (isToday(new Date(nextWatering.scheduledDate))) {
      return { status: 'today', color: 'warning', text: 'À arroser aujourd\'hui' };
    }
    
    if (isPast(new Date(nextWatering.scheduledDate))) {
      return { status: 'overdue', color: 'error', text: 'En retard' };
    }
    
    return {
      status: 'upcoming',
      color: 'primary',
      text: `Dans ${Math.ceil((new Date(nextWatering.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} jour(s)`
    };
  };

  const wateringStatus = getWateringStatus();
  const needsWatering = wateringStatus.status === 'today' || wateringStatus.status === 'overdue';
  
  // Calculate watering progress (mock data for now)
  const wateringProgress = plant.history?.length 
    ? Math.min((plant.history.length / 30) * 100, 100) 
    : 25;

  if (compact) {
    return (
      <Card 
        sx={{ 
          mb: 1, 
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          },
          borderLeft: needsWatering ? 4 : 0,
          borderColor: needsWatering ? 'warning.main' : 'transparent',
        }}
        onClick={() => onViewDetails?.(plant.id)}
      >
        <CardContent sx={{ py: 1.5 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: needsWatering ? '2px solid' : '1px solid',
                  borderColor: needsWatering ? 'warning.main' : 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <LocalFlorist 
                  sx={{ 
                    fontSize: 24,
                    color: needsWatering ? 'warning.main' : 'primary.main' 
                  }} 
                />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {plant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {wateringStatus.text}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              {needsWatering && (
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWater?.(plant.id);
                  }}
                >
                  <WaterDrop />
                </IconButton>
              )}
              <Chip
                size="small"
                label={wateringStatus.text}
                color={wateringStatus.color as any}
                variant={needsWatering ? 'filled' : 'outlined'}
                icon={needsWatering ? <Warning /> : <CheckCircle />}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
        borderTop: needsWatering ? 4 : 0,
        borderColor: needsWatering ? 'warning.main' : 'transparent',
      }}
      onClick={() => onViewDetails?.(plant.id)}
    >
      <Box
        sx={{
          p: 2,
          pb: 1,
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          bgcolor: 'grey.50',
        }}
      >
        {/* Afficher l'image réelle de la plante depuis le backend */}
        {plant.imageUrl ? (
          <Box
            sx={{
              width: 200,
              height: 150,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'grey.50',
            }}
          >
            <img
              src={plant.imageUrl}
              alt={plant.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                // Fallback vers image par défaut basée sur le nom de la plante
                const plantNameLower = plant.name.toLowerCase();
                let fallbackUrl = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80';
                
                // Images spécifiques pour certains types de plantes
                if (plantNameLower.includes('cactus')) {
                  fallbackUrl = 'https://images.unsplash.com/photo-1509423350716-97f2360af8e4?w=400&h=300&fit=crop&q=80';
                } else if (plantNameLower.includes('succulent') || plantNameLower.includes('succulente')) {
                  fallbackUrl = 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=300&fit=crop&q=80';
                } else if (plantNameLower.includes('monstera')) {
                  fallbackUrl = 'https://images.unsplash.com/photo-1586093020299-c985f891dc0e?w=400&h=300&fit=crop&q=80';
                } else if (plantNameLower.includes('fern') || plantNameLower.includes('fougère')) {
                  fallbackUrl = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80';
                } else if (plantNameLower.includes('rose')) {
                  fallbackUrl = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&q=80';
                }
                
                e.currentTarget.src = fallbackUrl;
              }}
            />
            {plant.imageSource && plant.imageSource !== 'default' && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  textTransform: 'capitalize'
                }}
              >
                {plant.imageSource}
              </Box>
            )}
          </Box>
        ) : (
          /* Convertir la plante au format PlantSearchResult pour PlantImage si pas d'image backend */
          <PlantImage
            plant={{
              id: parseInt(plant.id) || 1,
              common_name: plant.name,
              scientific_name: plant.scientificName || plant.description || plant.name,
              other_names: [],
              family: plant.family || '',
              genus: plant.genus || '',
              cycle: 'Perennial',
              watering: 'Average',
              sunlight: ['part shade'],
              default_image: undefined
            }}
            size="medium"
            borderRadius={8}
          />
        )}
        {needsWatering && (
          <Chip
            label="À arroser"
            color="warning"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 1,
            }}
          />
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" fontWeight={600} noWrap>
            {plant.name}
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={2} noWrap>
          {plant.description || `Plante ${plant.type}`}
        </Typography>
        
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="body2" color="text.secondary">
              Santé de la plante
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {Math.round(wateringProgress)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={wateringProgress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
              }
            }} 
          />
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Schedule fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Prochain arrosage
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={500}>
            {nextWatering 
              ? format(new Date(nextWatering.scheduledDate), 'dd MMM', { locale: fr })
              : 'Non planifié'
            }
          </Typography>
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={0.5}>
            <WaterDrop fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Quantité
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={500}>
            {plant.baseWaterAmountMl}ml
          </Typography>
        </Box>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Chip
          label={wateringStatus.text}
          color={wateringStatus.color as any}
          variant={needsWatering ? 'filled' : 'outlined'}
          size="small"
          sx={{ width: '100%' }}
          icon={wateringStatus.status === 'completed' ? <CheckCircle /> : 
                wateringStatus.status === 'today' || wateringStatus.status === 'overdue' ? <Warning /> : 
                <Schedule />}
        />
      </Box>
    </Card>
  );
};

export default PlantCard;