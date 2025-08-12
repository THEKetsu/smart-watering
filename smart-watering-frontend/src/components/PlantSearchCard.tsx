import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  Add,
  WbSunny,
  LocalFlorist,
  Opacity,
} from '@mui/icons-material';
import { PlantSearchResult } from '../services/plantsApi';
import { PlantImage } from './PlantImage';

interface PlantSearchCardProps {
  plant: PlantSearchResult;
  onAddPlant: (plant: PlantSearchResult) => void;
  showDetails?: boolean;
}

const PlantSearchCard: React.FC<PlantSearchCardProps> = ({
  plant,
  onAddPlant,
  showDetails = false,
}) => {
  // Mapper les besoins en eau
  const getWateringIcon = (watering: string) => {
    switch (watering?.toLowerCase()) {
      case 'frequent':
      case 'frequent watering':
        return { icon: <Opacity />, color: 'primary', text: 'Fréquent' };
      case 'average':
      case 'regular watering':
        return { icon: <Opacity />, color: 'info', text: 'Modéré' };
      case 'minimum':
      case 'less watering':
        return { icon: <Opacity />, color: 'secondary', text: 'Minimal' };
      default:
        return { icon: <Opacity />, color: 'default', text: 'Normal' };
    }
  };

  // Mapper les besoins en soleil
  const getSunlightChips = (sunlight: string[] | undefined) => {
    if (!sunlight || sunlight.length === 0) return [];
    
    return sunlight.map((light, index) => {
      let label = '';
      let color: 'default' | 'primary' | 'secondary' | 'warning' = 'default';
      
      switch (light.toLowerCase()) {
        case 'full sun':
        case 'full shade':
          label = 'Plein soleil';
          color = 'warning';
          break;
        case 'part sun':
        case 'part shade':
          label = 'Mi-ombre';
          color = 'primary';
          break;
        case 'shade':
          label = 'Ombre';
          color = 'secondary';
          break;
        default:
          label = light;
          break;
      }
      
      return (
        <Chip
          key={index}
          label={label}
          size="small"
          color={color}
          variant="outlined"
          icon={<WbSunny />}
          sx={{ mr: 0.5 }}
        />
      );
    });
  };

  const wateringInfo = getWateringIcon(plant.watering);

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Image de la plante */}
      <Box sx={{ p: 2, pb: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <PlantImage 
            plant={plant} 
            size="medium" 
            borderRadius={8}
          />
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box mb={2}>
          <Typography 
            variant="h6" 
            fontWeight={600} 
            gutterBottom
            sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {plant.common_name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            fontStyle="italic"
            gutterBottom
          >
            {plant.scientific_name}
          </Typography>
          
          {plant.other_names && plant.other_names.length > 0 && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              Autres noms: {plant.other_names.slice(0, 2).join(', ')}
            </Typography>
          )}
        </Box>

        {showDetails && (
          <Box mb={2}>
            {/* Famille et genre */}
            {(plant.family || plant.genus) && (
              <Box mb={1}>
                {plant.family && (
                  <Chip 
                    label={`Famille: ${plant.family}`}
                    size="small"
                    color="default"
                    variant="outlined"
                    icon={<LocalFlorist />}
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                )}
                {plant.genus && (
                  <Chip 
                    label={`Genre: ${plant.genus}`}
                    size="small"
                    color="default"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                )}
              </Box>
            )}

            {/* Cycle de vie */}
            {plant.cycle && (
              <Box mb={1}>
                <Chip 
                  label={plant.cycle === 'Perennial' ? 'Vivace' : plant.cycle}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ mr: 0.5 }}
                />
              </Box>
            )}

            {/* Besoins en eau */}
            {plant.watering && (
              <Box mb={1}>
                <Chip 
                  label={`Arrosage: ${wateringInfo.text}`}
                  size="small"
                  color={wateringInfo.color as any}
                  variant="filled"
                  icon={wateringInfo.icon}
                  sx={{ mr: 0.5 }}
                />
              </Box>
            )}

            {/* Besoins en soleil */}
            {plant.sunlight && plant.sunlight.length > 0 && (
              <Box>
                {getSunlightChips(plant.sunlight)}
              </Box>
            )}
          </Box>
        )}
        
        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Add />}
            onClick={() => onAddPlant(plant)}
            sx={{
              backgroundColor: 'success.main',
              '&:hover': {
                backgroundColor: 'success.dark',
              },
            }}
          >
            Ajouter à mes plantes
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlantSearchCard;