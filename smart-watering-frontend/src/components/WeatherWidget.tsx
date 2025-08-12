import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  WbSunny,
  Cloud,
  CloudQueue,
  Grain,
  Thermostat,
  Opacity,
  Air,
  Visibility,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  currentWeather?: WeatherData;
  forecast?: WeatherData[];
  compact?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  currentWeather,
  forecast,
  compact = false,
}) => {
  const getWeatherIcon = (condition?: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    const iconSize = size === 'small' ? 24 : size === 'large' ? 48 : 32;
    
    if (!condition) return <WbSunny sx={{ fontSize: iconSize }} />;
    
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('pluie')) {
      return <Grain sx={{ fontSize: iconSize }} color="primary" />;
    }
    if (lowerCondition.includes('cloud') || lowerCondition.includes('nuage')) {
      return <CloudQueue sx={{ fontSize: iconSize }} color="action" />;
    }
    if (lowerCondition.includes('sun') || lowerCondition.includes('soleil')) {
      return <WbSunny sx={{ fontSize: iconSize }} color="warning" />;
    }
    return <Cloud sx={{ fontSize: iconSize }} color="action" />;
  };

  const getWeatherColor = (condition?: string) => {
    if (!condition) return 'warning';
    
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('pluie')) return 'primary';
    if (lowerCondition.includes('sun') || lowerCondition.includes('soleil')) return 'warning';
    return 'default';
  };

  const getRainImpact = (precipitationMm: number) => {
    if (precipitationMm >= 10) return { level: 'high', text: 'Arrosage réduit recommandé', color: 'success' };
    if (precipitationMm >= 5) return { level: 'medium', text: 'Arrosage léger suffisant', color: 'info' };
    if (precipitationMm > 0) return { level: 'low', text: 'Complément d\'arrosage nécessaire', color: 'warning' };
    return { level: 'none', text: 'Arrosage normal requis', color: 'default' };
  };

  if (compact) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Météo actuelle
          </Typography>
          {currentWeather ? (
            <Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  {getWeatherIcon(currentWeather.weatherCondition, 'large')}
                  <Typography variant="h3" fontWeight={300}>
                    {currentWeather.temperatureAvg.toFixed(0)}°
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body1" color="text.secondary" noWrap>
                    {currentWeather.weatherCondition || 'Ensoleillé'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(), 'EEEE', { locale: fr })}
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Opacity fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Humidité
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {currentWeather.humidity}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Grain fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Pluie
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {currentWeather.precipitationMm}mm
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              {currentWeather.precipitationMm > 0 && (
                <Box mt={2}>
                  <Chip
                    label={getRainImpact(currentWeather.precipitationMm).text}
                    color={getRainImpact(currentWeather.precipitationMm).color as any}
                    size="small"
                    variant="outlined"
                    sx={{ width: '100%' }}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary">
              Données météo non disponibles
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Conditions météorologiques
        </Typography>
        
        {currentWeather ? (
          <Box>
            {/* Météo actuelle */}
            <Box mb={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h2" fontWeight={300} color="primary">
                    {currentWeather.temperatureAvg.toFixed(0)}°C
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {currentWeather.weatherCondition || 'Conditions normales'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(), 'EEEE dd MMMM', { locale: fr })}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: `${getWeatherColor(currentWeather.weatherCondition)}.light`,
                  }}
                >
                  {getWeatherIcon(currentWeather.weatherCondition, 'large')}
                </Avatar>
              </Box>

              {/* Détails météo */}
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6} sm={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Thermostat fontSize="small" color="error" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Max/Min
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {currentWeather.temperatureMax}°/{currentWeather.temperatureMin}°
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Opacity fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Humidité
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {currentWeather.humidity}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Grain fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Précipitations
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {currentWeather.precipitationMm}mm
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Air fontSize="small" color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Vent
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {currentWeather.windSpeed || 0} km/h
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Impact sur l'arrosage */}
              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Impact sur l'arrosage:
                </Typography>
                <Chip
                  label={getRainImpact(currentWeather.precipitationMm).text}
                  color={getRainImpact(currentWeather.precipitationMm).color as any}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Prévisions */}
            {forecast && forecast.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                  Prévisions 5 jours
                </Typography>
                <Grid container spacing={1}>
                  {forecast.slice(0, 5).map((day, index) => (
                    <Grid item xs key={index}>
                      <Box
                        textAlign="center"
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: index === 0 ? 'primary.light' : 'background.paper',
                          color: index === 0 ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="caption" display="block">
                          {index === 0 ? 'Auj.' : format(new Date(day.date), 'EEE', { locale: fr })}
                        </Typography>
                        <Box my={1}>
                          {getWeatherIcon(day.weatherCondition, 'small')}
                        </Box>
                        <Typography variant="caption" display="block" fontWeight={600}>
                          {day.temperatureMax}°
                        </Typography>
                        <Typography variant="caption" display="block" color="inherit" sx={{ opacity: 0.7 }}>
                          {day.temperatureMin}°
                        </Typography>
                        {day.precipitationMm > 0 && (
                          <Typography variant="caption" display="block" color="primary">
                            {day.precipitationMm}mm
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        ) : (
          <Box textAlign="center" py={4}>
            <CloudQueue sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography color="text.secondary">
              Données météo non disponibles
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;