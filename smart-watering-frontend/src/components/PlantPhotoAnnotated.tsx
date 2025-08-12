import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Tooltip,
  Fab,
  Dialog,
  DialogContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  LocalFlorist,
  PhotoCamera,
  Edit,
  WaterDrop,
  Thermostat,
  Opacity,
  WbSunny,
  BugReport,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import { Plant } from '../types';

interface PlantPhotoAnnotatedProps {
  plant: Plant;
  onPhotoUpdate?: (file: File) => void;
  onAnnotationClick?: (type: string) => void;
}

const PlantPhotoAnnotated: React.FC<PlantPhotoAnnotatedProps> = ({
  plant,
  onPhotoUpdate,
  onAnnotationClick,
}) => {
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  // Mock data pour les annotations
  const plantHealth = {
    overall: 85,
    watering: 90,
    sunlight: 80,
    pests: 95,
    growth: 75,
  };

  const annotations = [
    {
      id: 'watering',
      type: 'watering',
      x: 30,
      y: 70,
      status: 'good',
      title: 'Niveau d\'hydratation',
      description: 'Sol correctement humidifié',
      icon: <WaterDrop />,
      color: '#4caf50',
    },
    {
      id: 'sunlight',
      type: 'light',
      x: 60,
      y: 20,
      status: 'warning',
      title: 'Exposition solaire',
      description: 'Pourrait bénéficier de plus de lumière',
      icon: <WbSunny />,
      color: '#ff9800',
    },
    {
      id: 'growth',
      type: 'growth',
      x: 80,
      y: 40,
      status: 'good',
      title: 'Croissance',
      description: 'Nouvelles pousses visibles',
      icon: <LocalFlorist />,
      color: '#4caf50',
    },
    {
      id: 'pests',
      type: 'pests',
      x: 45,
      y: 50,
      status: 'info',
      title: 'Santé générale',
      description: 'Aucun parasite détecté',
      icon: <BugReport />,
      color: '#2196f3',
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onPhotoUpdate) {
      onPhotoUpdate(file);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle fontSize="small" />;
      case 'warning':
        return <Warning fontSize="small" />;
      case 'error':
        return <Warning fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'error':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  return (
    <Card sx={{ position: 'relative', height: '100%' }}>
      {/* Photo principale */}
      <Box
        sx={{
          position: 'relative',
          height: 400,
          backgroundImage: `url("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
          },
        }}
        onClick={() => setPhotoDialogOpen(true)}
      >
        {/* Annotations interactives */}
        {annotations.map((annotation) => (
          <Tooltip
            key={annotation.id}
            title={
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {annotation.title}
                </Typography>
                <Typography variant="body2">
                  {annotation.description}
                </Typography>
              </Box>
            }
            placement="top"
          >
            <Avatar
              sx={{
                position: 'absolute',
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                width: 32,
                height: 32,
                bgcolor: getStatusColor(annotation.status),
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)',
                '&:hover': {
                  transform: 'translate(-50%, -50%) scale(1.2)',
                  zIndex: 10,
                },
                transition: 'all 0.2s ease-in-out',
                zIndex: 2,
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAnnotation(annotation.id);
                onAnnotationClick?.(annotation.type);
              }}
            >
              {React.cloneElement(annotation.icon, { fontSize: 'small' })}
            </Avatar>
          </Tooltip>
        ))}

        {/* Bouton upload photo */}
        <Fab
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 3,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              bgcolor: 'white',
            },
          }}
          component="label"
        >
          <PhotoCamera />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileUpload}
          />
        </Fab>

        {/* Info overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              color: 'white',
              textShadow: '0 1px 3px rgba(0,0,0,0.7)',
              mb: 1,
            }}
          >
            {plant.name}
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label={`Santé: ${plantHealth.overall}%`}
              size="small"
              sx={{
                bgcolor: plantHealth.overall > 80 ? 'success.main' : plantHealth.overall > 60 ? 'warning.main' : 'error.main',
                color: 'white',
              }}
            />
            <Chip
              label="4 annotations"
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                backdropFilter: 'blur(4px)',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Panneau de santé */}
      <CardContent sx={{ pb: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          État de santé de la plante
        </Typography>
        
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Santé générale
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {plantHealth.overall}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={plantHealth.overall}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: plantHealth.overall > 80 ? 'success.main' : plantHealth.overall > 60 ? 'warning.main' : 'error.main',
              },
            }}
          />
        </Box>

        {/* Métriques détaillées */}
        <Box display="flex" justifyContent="space-between" gap={1}>
          {[
            { label: 'Arrosage', value: plantHealth.watering, icon: <WaterDrop fontSize="small" /> },
            { label: 'Lumière', value: plantHealth.sunlight, icon: <WbSunny fontSize="small" /> },
            { label: 'Croissance', value: plantHealth.growth, icon: <LocalFlorist fontSize="small" /> },
            { label: 'Parasites', value: plantHealth.pests, icon: <BugReport fontSize="small" /> },
          ].map((metric) => (
            <Box key={metric.label} textAlign="center" flex={1}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: metric.value > 80 ? 'success.light' : metric.value > 60 ? 'warning.light' : 'error.light',
                  mx: 'auto',
                  mb: 0.5,
                }}
              >
                {React.cloneElement(metric.icon, {
                  color: metric.value > 80 ? 'success' : metric.value > 60 ? 'warning' : 'error'
                })}
              </Avatar>
              <Typography variant="caption" display="block" color="text.secondary">
                {metric.label}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {metric.value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>

      {/* Dialog pour photo en grand */}
      <Dialog
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <Box
            sx={{
              height: 600,
              backgroundImage: `url("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            {/* Annotations en grand */}
            {annotations.map((annotation) => (
              <Tooltip
                key={annotation.id}
                title={annotation.title}
                placement="top"
              >
                <Avatar
                  sx={{
                    position: 'absolute',
                    left: `${annotation.x}%`,
                    top: `${annotation.y}%`,
                    width: 40,
                    height: 40,
                    bgcolor: getStatusColor(annotation.status),
                    cursor: 'pointer',
                    transform: 'translate(-50%, -50%)',
                    border: '3px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                  onClick={() => setSelectedAnnotation(annotation.id)}
                >
                  {React.cloneElement(annotation.icon)}
                </Avatar>
              </Tooltip>
            ))}
          </Box>
          
          <Box p={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setPhotoDialogOpen(false)}
            >
              Fermer
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PlantPhotoAnnotated;