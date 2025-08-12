import React, { useState, useEffect } from 'react';
import { Box, Skeleton, Avatar } from '@mui/material';
import { LocalFlorist } from '@mui/icons-material';
import { getPlantImage } from '../services/plantImages';
import { PlantSearchResult } from '../services/plantsApi';

interface PlantImageProps {
  plant: PlantSearchResult;
  size?: 'small' | 'medium' | 'large';
  borderRadius?: number;
  showSkeleton?: boolean;
}

const SIZES = {
  small: { width: 80, height: 80 },
  medium: { width: 200, height:150 },
  large: { width: 400, height: 300 }
};

export const PlantImage: React.FC<PlantImageProps> = ({ 
  plant, 
  size = 'medium', 
  borderRadius = 8,
  showSkeleton = true 
}) => {
  const [imageData, setImageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const dimensions = SIZES[size];

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await getPlantImage(plant);
        setImageData(data);
      } catch (err) {
        console.warn('Erreur chargement image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [plant.id, plant.common_name]);

  const handleImageError = () => {
    setError(true);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  if (loading && showSkeleton) {
    return (
      <Skeleton
        variant="rectangular"
        width={dimensions.width}
        height={dimensions.height}
        sx={{ borderRadius: `${borderRadius}px` }}
        animation="wave"
      />
    );
  }

  if (error || !imageData) {
    return (
      <Box
        sx={{
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: `${borderRadius}px`,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed',
          borderColor: 'grey.300'
        }}
      >
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'success.light' }}>
          <LocalFlorist />
        </Avatar>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'grey.50'
      }}
    >
      {loading && showSkeleton && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
          animation="wave"
        />
      )}
      <img
        src={imageData.url}
        alt={imageData.alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: loading ? 'none' : 'block'
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      {/* Badge de source d'image */}
      {imageData.source !== 'default' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: '12px',
            textTransform: 'capitalize'
          }}
        >
          {imageData.source}
        </Box>
      )}
    </Box>
  );
};