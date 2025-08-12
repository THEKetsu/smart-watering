import React from 'react';
import { useQuery } from 'react-query';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Fab,
  Container,
  Paper,
  Divider,
} from '@mui/material';
import {
  LocalFlorist,
  Schedule,
  WaterDrop,
  CheckCircle,
  Warning,
  TrendingUp,
  Add,
  Notifications,
  WbSunny,
} from '@mui/icons-material';
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

import { schedulesAPI, plantsAPI, weatherAPI } from '../services/api';
import { ScheduleStatus, ScheduleStatusLabels } from '../types/index';
import PlantCard from '../components/PlantCard';
import WeatherWidget from '../components/WeatherWidget';

const Dashboard: React.FC = () => {
  const { data: todaySchedules, isLoading: loadingSchedules } = useQuery(
    'todaySchedules',
    schedulesAPI.getToday
  );

  const { data: weekSummary, isLoading: loadingWeekSummary } = useQuery(
    'weekSummary',
    schedulesAPI.getWeekSummary
  );

  const { data: plants, isLoading: loadingPlants } = useQuery(
    'plants',
    () => plantsAPI.getAll({ isActive: true })
  );

  const { data: currentWeather, isLoading: loadingWeather } = useQuery(
    'currentWeather',
    weatherAPI.getCurrent
  );

  const { data: forecast } = useQuery(
    'forecast',
    () => weatherAPI.getForecast(5)
  );

  const generateWeeklyChart = () => {
    if (!weekSummary?.data) return [];
    
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return days.map((day, index) => {
      const daySchedules = weekSummary.data.schedulesByDay[day] || [];
      return {
        day,
        completed: daySchedules.filter((s: any) => s.status === ScheduleStatus.COMPLETED).length,
        pending: daySchedules.filter((s: any) => s.status === ScheduleStatus.PENDING).length,
        skipped: daySchedules.filter((s: any) => s.status === ScheduleStatus.SKIPPED).length,
      };
    });
  };

  const generateWeatherChart = () => {
    if (!forecast?.data) return [];
    
    return forecast.data.slice(0, 5).map((weather) => ({
      date: format(new Date(weather.date), 'EEE', { locale: fr }),
      temp: weather.temperatureAvg,
      rain: weather.precipitationMm,
      humidity: weather.humidity,
    }));
  };

  const getStatusColor = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.COMPLETED: return 'success';
      case ScheduleStatus.PENDING: return 'warning';
      case ScheduleStatus.SKIPPED: return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.COMPLETED: return <CheckCircle color="success" />;
      case ScheduleStatus.PENDING: return <Schedule color="warning" />;
      case ScheduleStatus.SKIPPED: return <Warning color="disabled" />;
      default: return <Schedule />;
    }
  };

  if (loadingSchedules || loadingWeekSummary || loadingPlants || loadingWeather) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const todayPlantsToWater = todaySchedules?.data.filter(schedule => 
    schedule.status === ScheduleStatus.PENDING
  ) || [];

  const handleWaterPlant = (plantId: string) => {
    // TODO: Implement watering action
    console.log('Watering plant:', plantId);
  };

  const handleViewPlantDetails = (plantId: string) => {
    window.location.href = `/plants/${plantId}`;
  };

  return (
    <Container maxWidth="xl">
      {/* Header avec salutation et météo */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Bonjour ! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr })}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<Notifications />}
              size="small"
              color="primary"
            >
              Notifications
            </Button>
          </Box>
        </Box>

        {/* Résumé rapide */}
        {todayPlantsToWater.length > 0 && (
          <Alert 
            severity="info" 
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small">
                Voir tout
              </Button>
            }
          >
            <strong>{todayPlantsToWater.length} plante(s)</strong> ont besoin d'être arrosées aujourd'hui
          </Alert>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Section plantes du jour */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={600}>
                Plantes à arroser aujourd'hui
              </Typography>
              <Chip 
                label={`${todayPlantsToWater.length} plantes`}
                color={todayPlantsToWater.length > 0 ? 'warning' : 'success'}
                size="small"
              />
            </Box>
            
            {todayPlantsToWater.length > 0 ? (
              <Box>
                {todayPlantsToWater.map((schedule) => (
                  <PlantCard
                    key={schedule.id}
                    plant={schedule.plant!}
                    nextWatering={schedule}
                    onWater={handleWaterPlant}
                    onViewDetails={handleViewPlantDetails}
                    compact
                  />
                ))}
              </Box>
            ) : (
              <Box textAlign="center" py={4}>
                <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" color="success.main" gutterBottom>
                  Toutes les plantes sont arrosées !
                </Typography>
                <Typography color="text.secondary">
                  Aucun arrosage prévu pour aujourd'hui
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Statistiques principales */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', py: 2 }}>
                <CardContent>
                  <LocalFlorist color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight={600}>
                    {plants?.data.length || 0}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Plantes actives
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', py: 2 }}>
                <CardContent>
                  <Schedule color="warning" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight={600}>
                    {todaySchedules?.data.length || 0}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Arrosages aujourd'hui
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', py: 2 }}>
                <CardContent>
                  <WaterDrop color="info" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight={600}>
                    {weekSummary?.data.totalWaterUsed.toFixed(0) || 0}ml
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Eau cette semaine
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', py: 2 }}>
                <CardContent>
                  <TrendingUp color="success" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight={600}>
                    {Math.round(((weekSummary?.data.completedSchedules || 0) / Math.max(weekSummary?.data.totalSchedules || 1, 1)) * 100)}%
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Taux de réussite
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Sidebar météo et actions */}
        <Grid item xs={12} lg={4}>
          <WeatherWidget 
            currentWeather={currentWeather?.data}
            forecast={forecast?.data}
            compact
          />
          
          {/* Actions rapides */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Actions rapides
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button 
                variant="contained" 
                startIcon={<Schedule />}
                fullWidth
                onClick={() => schedulesAPI.generateDaily()}
              >
                Générer planning du jour
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<WaterDrop />}
                fullWidth
                href="/schedule"
              >
                Voir tous les arrosages
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<LocalFlorist />}
                fullWidth
                href="/plants"
              >
                Gérer mes plantes
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Graphiques et analyses */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Arrosages de la semaine
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={generateWeeklyChart()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#4caf50" name="Terminés" />
                  <Bar dataKey="pending" fill="#ff9800" name="En attente" />
                  <Bar dataKey="skipped" fill="#9e9e9e" name="Ignorés" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Évolution météo (5 jours)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateWeatherChart()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#ff5722" 
                    name="Température (°C)" 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="rain" 
                    stroke="#2196f3" 
                    name="Pluie (mm)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* FAB pour ajouter une plante */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        href="/plants"
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default Dashboard;