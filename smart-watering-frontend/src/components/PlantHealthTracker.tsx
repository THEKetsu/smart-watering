import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Slider,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  WaterDrop,
  WbSunny,
  Thermostat,
  Opacity,
  LocalFlorist,
  BugReport,
  Add,
  Edit,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  icon: React.ReactElement;
  color: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
  notes?: string;
}

interface PlantHealthTrackerProps {
  plantId: string;
  onUpdateHealth?: (metrics: HealthMetric[]) => void;
}

const PlantHealthTracker: React.FC<PlantHealthTrackerProps> = ({
  plantId,
  onUpdateHealth,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
  const [notes, setNotes] = useState('');

  // Mock data pour les métriques de santé
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: 'watering',
      name: 'Hydratation',
      value: 85,
      icon: <WaterDrop />,
      color: '#2196f3',
      trend: 'up',
      lastUpdated: new Date(),
      notes: 'Sol bien humidifié après l\'arrosage d\'hier',
    },
    {
      id: 'sunlight',
      name: 'Exposition solaire',
      value: 70,
      icon: <WbSunny />,
      color: '#ff9800',
      trend: 'down',
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
      notes: 'Manque de lumière en hiver',
    },
    {
      id: 'temperature',
      name: 'Température',
      value: 75,
      icon: <Thermostat />,
      color: '#f44336',
      trend: 'stable',
      lastUpdated: new Date(),
    },
    {
      id: 'humidity',
      name: 'Humidité',
      value: 60,
      icon: <Opacity />,
      color: '#00bcd4',
      trend: 'up',
      lastUpdated: new Date(),
    },
    {
      id: 'growth',
      name: 'Croissance',
      value: 90,
      icon: <LocalFlorist />,
      color: '#4caf50',
      trend: 'up',
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      notes: 'Nouvelles feuilles apparues cette semaine',
    },
    {
      id: 'pests',
      name: 'Parasites',
      value: 95,
      icon: <BugReport />,
      color: '#9c27b0',
      trend: 'stable',
      lastUpdated: new Date(),
    },
  ]);

  const handleEditMetric = (metric: HealthMetric) => {
    setEditingMetric(metric);
    setNotes(metric.notes || '');
    setDialogOpen(true);
  };

  const handleSaveMetric = () => {
    if (editingMetric) {
      const updatedMetrics = healthMetrics.map((metric) =>
        metric.id === editingMetric.id
          ? { ...editingMetric, notes, lastUpdated: new Date() }
          : metric
      );
      setHealthMetrics(updatedMetrics);
      onUpdateHealth?.(updatedMetrics);
    }
    setDialogOpen(false);
    setEditingMetric(null);
    setNotes('');
  };

  const handleValueChange = (value: number) => {
    if (editingMetric) {
      setEditingMetric({ ...editingMetric, value });
    }
  };

  const getOverallHealth = () => {
    const average = healthMetrics.reduce((sum, metric) => sum + metric.value, 0) / healthMetrics.length;
    return Math.round(average);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp fontSize="small" color="success" />;
      case 'down':
        return <TrendingDown fontSize="small" color="error" />;
      default:
        return null;
    }
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return '#4caf50';
    if (value >= 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            Suivi de santé
          </Typography>
          <Chip
            label={`${getOverallHealth()}% de santé`}
            sx={{
              bgcolor: getHealthColor(getOverallHealth()),
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Barre de santé globale */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Santé globale de la plante
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {getOverallHealth()}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getOverallHealth()}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                bgcolor: getHealthColor(getOverallHealth()),
              },
            }}
          />
        </Box>

        {/* Métriques détaillées */}
        <Grid container spacing={2}>
          {healthMetrics.map((metric) => (
            <Grid item xs={12} sm={6} md={4} key={metric.id}>
              <Card
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
                onClick={() => handleEditMetric(metric)}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${metric.color}20`,
                      color: metric.color,
                      width: 48,
                      height: 48,
                      mx: 'auto',
                      mb: 1,
                    }}
                  >
                    {React.cloneElement(metric.icon, { fontSize: 'medium' })}
                  </Avatar>
                  
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={1}>
                    <Typography variant="body2" fontWeight={600}>
                      {metric.name}
                    </Typography>
                    {getTrendIcon(metric.trend)}
                  </Box>
                  
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ color: getHealthColor(metric.value), mb: 1 }}
                  >
                    {metric.value}%
                  </Typography>
                  
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'grey.200',
                      mb: 1,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        bgcolor: getHealthColor(metric.value),
                      },
                    }}
                  />
                  
                  <Typography variant="caption" color="text.secondary">
                    Mis à jour {format(metric.lastUpdated, 'dd/MM', { locale: fr })}
                  </Typography>
                  
                  {metric.notes && (
                    <Box mt={1}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          color: 'text.secondary',
                          fontStyle: 'italic',
                        }}
                      >
                        {metric.notes}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Conseils basés sur la santé */}
        <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Conseils personnalisés
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getOverallHealth() >= 80
              ? '🌟 Excellente santé ! Continuez votre routine de soins.'
              : getOverallHealth() >= 60
              ? '⚠️ Santé correcte. Surveillez l\'exposition solaire et l\'arrosage.'
              : '🚨 Attention requise ! Vérifiez tous les paramètres de croissance.'}
          </Typography>
        </Box>
      </CardContent>

      {/* Dialog d'édition */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Modifier {editingMetric?.name}
        </DialogTitle>
        <DialogContent>
          {editingMetric && (
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Avatar sx={{ bgcolor: `${editingMetric.color}20`, color: editingMetric.color }}>
                  {React.cloneElement(editingMetric.icon)}
                </Avatar>
                <Typography variant="h6">
                  {editingMetric.value}%
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" mb={2}>
                Ajustez la valeur selon votre observation :
              </Typography>
              
              <Slider
                value={editingMetric.value}
                onChange={(_, value) => handleValueChange(value as number)}
                step={5}
                marks
                min={0}
                max={100}
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes (optionnel)"
                placeholder="Ajoutez vos observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSaveMetric} variant="contained">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PlantHealthTracker;