import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  WbSunny,
  CloudQueue,
  Opacity,
  Air,
  Thermostat,
  Update,
} from '@mui/icons-material';
import { format, isToday, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { toast } from 'react-toastify';

import { weatherAPI } from '../services/api';
import { WeatherData } from '../types/index';

const Weather: React.FC = () => {
  const [updateDialog, setUpdateDialog] = useState(false);
  const [lat, setLat] = useState<string>('');
  const [lon, setLon] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: currentWeather, isLoading: loadingCurrent } = useQuery(
    'currentWeather',
    weatherAPI.getCurrent
  );

  const { data: forecast, isLoading: loadingForecast } = useQuery(
    'forecast',
    () => weatherAPI.getForecast(7)
  );

  const { data: recentWeather, isLoading: loadingRecent } = useQuery(
    'recentWeather',
    () => weatherAPI.getRecent(7)
  );

  const { data: weatherHealth } = useQuery(
    'weatherHealth',
    weatherAPI.getHealth
  );

  const updateMutation = useMutation(
    ({ lat, lon }: { lat?: number; lon?: number }) => weatherAPI.update(lat, lon),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('currentWeather');
        queryClient.invalidateQueries('forecast');
        queryClient.invalidateQueries('recentWeather');
        queryClient.invalidateQueries('weatherHealth');
        toast.success('Données météo mises à jour avec succès');
        setUpdateDialog(false);
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour des données météo');
      },
    }
  );

  const handleUpdate = () => {
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;
    updateMutation.mutate({ lat: latitude, lon: longitude });
  };

  const getWeatherIcon = (condition?: string) => {
    if (!condition) return <WbSunny />;
    
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <Opacity color="primary" />;
    }
    if (conditionLower.includes('cloud')) {
      return <CloudQueue color="action" />;
    }
    return <WbSunny color="warning" />;
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 5) return '#2196f3';
    if (temp < 15) return '#00bcd4';
    if (temp < 25) return '#4caf50';
    if (temp < 35) return '#ff9800';
    return '#f44336';
  };

  const generateTemperatureChart = () => {
    if (!forecast?.data) return [];
    
    return forecast.data.map((weather) => ({
      date: format(new Date(weather.date), 'EEE dd', { locale: fr }),
      tempMin: weather.temperatureMin,
      tempMax: weather.temperatureMax,
      tempAvg: weather.temperatureAvg,
    }));
  };

  const generateRainChart = () => {
    if (!forecast?.data) return [];
    
    return forecast.data.map((weather) => ({
      date: format(new Date(weather.date), 'EEE', { locale: fr }),
      rain: weather.precipitationMm,
      humidity: weather.humidity,
    }));
  };

  const generateHistoryChart = () => {
    if (!recentWeather?.data) return [];
    
    return recentWeather.data.map((weather) => ({
      date: format(new Date(weather.date), 'dd/MM', { locale: fr }),
      temperature: weather.temperatureAvg,
      rain: weather.precipitationMm,
      humidity: weather.humidity,
    }));
  };

  const getWeatherStatus = (weather: WeatherData) => {
    if (weather.precipitationMm > 5) return { label: 'Pluvieux', color: 'primary' as const };
    if (weather.temperatureMax > 30) return { label: 'Chaud', color: 'warning' as const };
    if (weather.temperatureMin < 5) return { label: 'Froid', color: 'info' as const };
    if (weather.humidity > 80) return { label: 'Humide', color: 'secondary' as const };
    return { label: 'Modéré', color: 'success' as const };
  };

  if (loadingCurrent || loadingForecast || loadingRecent) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Données météorologiques
        </Typography>
        <Button
          variant="contained"
          startIcon={<Update />}
          onClick={() => setUpdateDialog(true)}
          disabled={updateMutation.isLoading}
        >
          {updateMutation.isLoading ? <CircularProgress size={20} /> : 'Mettre à jour'}
        </Button>
      </Box>

      {/* Statut de l'API météo */}
      {weatherHealth?.data && (
        <Alert
          severity={weatherHealth.data.apiStatus === 'connected' ? 'success' : 'error'}
          sx={{ mb: 3 }}
        >
          API Météo: {weatherHealth.data.apiStatus === 'connected' ? 'Connectée' : 'Erreur'} 
          {weatherHealth.data.lastUpdated && (
            <> - Dernière mise à jour: {format(new Date(weatherHealth.data.lastUpdated), 'PPp', { locale: fr })}</>
          )}
        </Alert>
      )}

      {/* Météo actuelle */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Conditions actuelles
          </Typography>
          
          {currentWeather?.data ? (
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  {getWeatherIcon(currentWeather.data.weatherCondition)}
                  <Box>
                    <Typography variant="h3" component="div">
                      {currentWeather.data.temperatureAvg.toFixed(1)}°C
                    </Typography>
                    <Typography color="textSecondary">
                      {currentWeather.data.weatherCondition || 'Conditions normales'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Thermostat color="error" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Min/Max</Typography>
                        <Typography variant="body1">
                          {currentWeather.data.temperatureMin}° / {currentWeather.data.temperatureMax}°
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Opacity color="primary" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Humidité</Typography>
                        <Typography variant="body1">{currentWeather.data.humidity}%</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CloudQueue color="info" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Pluie</Typography>
                        <Typography variant="body1">{currentWeather.data.precipitationMm}mm</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Air color="action" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Vent</Typography>
                        <Typography variant="body1">
                          {currentWeather.data.windSpeed?.toFixed(1) || 'N/A'} km/h
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="warning">Aucune donnée météo actuelle disponible</Alert>
          )}
        </CardContent>
      </Card>

      {/* Graphiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Températures prévues */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prévisions de température (7 jours)
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={generateTemperatureChart()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="tempMax" 
                    fill="#ff9800" 
                    stroke="#ff5722"
                    name="Max (°C)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tempMin" 
                    fill="#2196f3" 
                    stroke="#1976d2"
                    name="Min (°C)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tempAvg" 
                    stroke="#4caf50" 
                    strokeWidth={2}
                    name="Moyenne (°C)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pluie et humidité */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pluie et humidité prévues
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={generateRainChart()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="rain" fill="#2196f3" name="Pluie (mm)" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#4caf50" 
                    name="Humidité (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Historique récent */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Historique des 7 derniers jours
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateHistoryChart()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="temperature" 
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
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#4caf50" 
                    name="Humidité (%)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tableau détaillé des prévisions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Prévisions détaillées
          </Typography>
          
          {forecast?.data ? (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Conditions</TableCell>
                    <TableCell>Température</TableCell>
                    <TableCell>Humidité</TableCell>
                    <TableCell>Pluie</TableCell>
                    <TableCell>Vent</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forecast.data.map((weather) => {
                    const status = getWeatherStatus(weather);
                    const weatherDate = new Date(weather.date);
                    
                    return (
                      <TableRow 
                        key={weather.id}
                        sx={{ 
                          backgroundColor: isToday(weatherDate) ? 'primary.light' : 'inherit',
                          opacity: isToday(weatherDate) ? 1 : isFuture(weatherDate) ? 0.9 : 0.7
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={isToday(weatherDate) ? 'bold' : 'normal'}>
                              {format(weatherDate, 'EEEE dd MMM', { locale: fr })}
                            </Typography>
                            {isToday(weatherDate) && (
                              <Chip label="Aujourd'hui" size="small" color="primary" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getWeatherIcon(weather.weatherCondition)}
                            <Typography variant="body2">
                              {weather.weatherCondition || 'Normal'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {weather.temperatureAvg.toFixed(1)}°C
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {weather.temperatureMin}° / {weather.temperatureMax}°
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{weather.humidity}%</TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2"
                            color={weather.precipitationMm > 0 ? 'primary.main' : 'textSecondary'}
                            fontWeight={weather.precipitationMm > 5 ? 'bold' : 'normal'}
                          >
                            {weather.precipitationMm}mm
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {weather.windSpeed?.toFixed(1) || 'N/A'} km/h
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">Aucune prévision disponible</Alert>
          )}
        </CardContent>
      </Card>

      {/* Dialog de mise à jour */}
      <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mettre à jour les données météo</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Laissez les champs vides pour utiliser la localisation par défaut (Paris).
            </Alert>
            
            <TextField
              label="Latitude (optionnel)"
              type="number"
              fullWidth
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              margin="normal"
              placeholder="48.8566"
              helperText="Exemple: 48.8566 pour Paris"
            />
            
            <TextField
              label="Longitude (optionnel)"
              type="number"
              fullWidth
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              margin="normal"
              placeholder="2.3522"
              helperText="Exemple: 2.3522 pour Paris"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialog(false)}>Annuler</Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? <CircularProgress size={20} /> : 'Mettre à jour'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Weather;