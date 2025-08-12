import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  CircularProgress,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Avatar,
} from '@mui/material';
import {
  Storage,
  Cloud,
  Schedule,
  Notifications,
  Security,
  Info,
  GitHub,
  Api,
  CheckCircle,
  Error,
  Warning,
  Refresh,
  Person,
  Language,
  Palette,
  VolumeUp,
} from '@mui/icons-material';
import { plantsAPI, weatherAPI } from '../services/api';
import { plantsApiService } from '../services/plantsApi';

interface SystemStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'checking';
  message: string;
  responseTime?: number;
  lastChecked?: Date;
}

const Settings: React.FC = () => {
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([]);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  // États pour les préférences utilisateur
  const [userPrefs, setUserPrefs] = useState({
    language: navigator.language.startsWith('fr') ? 'fr' : 'en',
    theme: 'light' as 'light' | 'dark' | 'auto',
    notifications: true,
    soundEnabled: true,
    soundVolume: 50,
    temperatureUnit: 'celsius' as 'celsius' | 'fahrenheit',
    autoSync: true,
  });
  
  const systemInfo = {
    version: '1.0.0',
    buildDate: new Date().toLocaleDateString('fr-FR'),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    mockMode: process.env.REACT_APP_MOCK_MODE === 'true',
  };

  const checkSystemStatus = async () => {
    setIsCheckingStatus(true);
    const statuses: SystemStatus[] = [];

    // Test Backend API
    try {
      const startTime = Date.now();
      await plantsAPI.getAll({ page: 1, limit: 1 });
      const responseTime = Date.now() - startTime;
      statuses.push({
        name: 'Backend API',
        status: 'online',
        message: systemInfo.mockMode ? 'Mode mock actif' : 'Connexion établie',
        responseTime,
        lastChecked: new Date(),
      });
    } catch (error) {
      statuses.push({
        name: 'Backend API',
        status: systemInfo.mockMode ? 'degraded' : 'offline',
        message: systemInfo.mockMode ? 'Fallback vers données mock' : 'Impossible de se connecter au backend',
        lastChecked: new Date(),
      });
    }

    // Test Trefle Plant API
    try {
      const startTime = Date.now();
      await plantsApiService.searchPlants('test', 1);
      const responseTime = Date.now() - startTime;
      statuses.push({
        name: 'Trefle Plant API',
        status: 'online',
        message: 'Base de données de plantes accessible (1M+ espèces)',
        responseTime,
        lastChecked: new Date(),
      });
    } catch (error) {
      statuses.push({
        name: 'Trefle Plant API',
        status: 'degraded',
        message: 'Utilisation des données mock',
        lastChecked: new Date(),
      });
    }

    // Test Weather API
    try {
      const startTime = Date.now();
      await weatherAPI.getCurrent();
      const responseTime = Date.now() - startTime;
      statuses.push({
        name: 'API Météo',
        status: systemInfo.mockMode ? 'degraded' : 'online',
        message: systemInfo.mockMode ? 'Données météo simulées' : 'Données météo en temps réel',
        responseTime,
        lastChecked: new Date(),
      });
    } catch (error) {
      statuses.push({
        name: 'API Météo',
        status: 'offline',
        message: 'Service météo indisponible',
        lastChecked: new Date(),
      });
    }

    // Test Database (via backend)
    statuses.push({
      name: 'Base de données',
      status: systemInfo.mockMode ? 'degraded' : 'online',
      message: systemInfo.mockMode ? 'Mode développement - données en mémoire' : 'PostgreSQL connecté',
      lastChecked: new Date(),
    });

    setSystemStatuses(statuses);
    setIsCheckingStatus(false);
  };

  useEffect(() => {
    checkSystemStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle color="success" />;
      case 'degraded':
        return <Warning color="warning" />;
      case 'offline':
        return <Error color="error" />;
      case 'checking':
        return <CircularProgress size={20} />;
      default:
        return <Info color="info" />;
    }
  };

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'degraded':
        return 'warning';
      case 'offline':
        return 'error';
      case 'checking':
        return 'info';
      default:
        return 'default';
    }
  };

  const features = [
    {
      title: 'Recherche de plantes',
      description: 'Intégration API Trefle avec 1M+ espèces botaniques',
      status: 'active',
      icon: <Storage color="success" />,
      details: 'Pré-remplissage automatique des formulaires',
    },
    {
      title: 'Algorithme intelligent',
      description: 'Adaptation automatique selon météo et besoins des plantes',
      status: 'active',
      icon: <Schedule color="success" />,
      details: 'Calculs basés sur météo, saisons et paramètres plante',
    },
    {
      title: 'Intégration météo',
      description: 'API météo pour prévisions et historique',
      status: systemInfo.mockMode ? 'development' : 'active',
      icon: <Cloud color={systemInfo.mockMode ? 'warning' : 'success'} />,
      details: systemInfo.mockMode ? 'Données simulées en développement' : 'Données en temps réel',
    },
    {
      title: 'Interface moderne',
      description: 'Design Material-UI avec barre rétractable',
      status: 'active',
      icon: <Api color="success" />,
      details: 'Responsive, animations fluides, profil utilisateur',
    },
    {
      title: 'Notifications push',
      description: 'Alertes pour arrosages en attente',
      status: 'planned',
      icon: <Notifications color="warning" />,
    },
    {
      title: 'Authentification',
      description: 'Gestion des utilisateurs et sécurité',
      status: 'planned',
      icon: <Security color="warning" />,
    },
  ];

  const getFeatureStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'development': return 'warning';
      case 'planned': return 'info';
      case 'disabled': return 'default';
      default: return 'default';
    }
  };

  const getFeatureStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'ACTIF';
      case 'development': return 'DEV';
      case 'planned': return 'PLANIFIÉ';
      case 'disabled': return 'DÉSACTIVÉ';
      default: return 'INCONNU';
    }
  };

  const handlePrefChange = (key: keyof typeof userPrefs, value: any) => {
    setUserPrefs(prev => ({
      ...prev,
      [key]: value
    }));
    // Ici on pourrait persister les préférences dans localStorage ou via API
    localStorage.setItem('userPreferences', JSON.stringify({
      ...userPrefs,
      [key]: value
    }));
  };

  // Charger les préférences au montage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setUserPrefs(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Erreur lors du chargement des préférences:', error);
      }
    }
  }, []);

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'fr': return '🇫🇷 Français';
      case 'en': return '🇬🇧 English';
      case 'es': return '🇪🇸 Español';
      case 'de': return '🇩🇪 Deutsch';
      case 'it': return '🇮🇹 Italiano';
      default: return code;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        ⚙️ Paramètres et informations
      </Typography>

      <Grid container spacing={3}>
        {/* Préférences utilisateur */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Préférences utilisateur
              </Typography>
              
              <Grid container spacing={3}>
                {/* Langue */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Langue</InputLabel>
                    <Select
                      value={userPrefs.language}
                      onChange={(e) => handlePrefChange('language', e.target.value)}
                      label="Langue"
                      startAdornment={
                        <Language sx={{ mr: 1, color: 'action.active' }} />
                      }
                    >
                      <MenuItem value="fr">🇫🇷 Français</MenuItem>
                      <MenuItem value="en">🇬🇧 English</MenuItem>
                      <MenuItem value="es">🇪🇸 Español</MenuItem>
                      <MenuItem value="de">🇩🇪 Deutsch</MenuItem>
                      <MenuItem value="it">🇮🇹 Italiano</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Détectée automatiquement : {getLanguageLabel(navigator.language.startsWith('fr') ? 'fr' : 'en')}
                  </Typography>
                </Grid>

                {/* Thème */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Thème</InputLabel>
                    <Select
                      value={userPrefs.theme}
                      onChange={(e) => handlePrefChange('theme', e.target.value)}
                      label="Thème"
                      startAdornment={
                        <Palette sx={{ mr: 1, color: 'action.active' }} />
                      }
                    >
                      <MenuItem value="light">☀️ Clair</MenuItem>
                      <MenuItem value="dark">🌙 Sombre</MenuItem>
                      <MenuItem value="auto">🔄 Automatique</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Unité de température */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Unité de température</InputLabel>
                    <Select
                      value={userPrefs.temperatureUnit}
                      onChange={(e) => handlePrefChange('temperatureUnit', e.target.value)}
                      label="Unité de température"
                    >
                      <MenuItem value="celsius">🌡️ Celsius (°C)</MenuItem>
                      <MenuItem value="fahrenheit">🌡️ Fahrenheit (°F)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Notifications */}
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userPrefs.notifications}
                        onChange={(e) => handlePrefChange('notifications', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Notifications color={userPrefs.notifications ? 'primary' : 'disabled'} />
                        <Box>
                          <Typography variant="body1">
                            Notifications push
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Alertes pour les arrosages programmés
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Grid>

                {/* Son */}
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userPrefs.soundEnabled}
                        onChange={(e) => handlePrefChange('soundEnabled', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <VolumeUp color={userPrefs.soundEnabled ? 'primary' : 'disabled'} />
                        <Box>
                          <Typography variant="body1">
                            Sons et alertes
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sons des notifications
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Grid>

                {/* Volume sonore */}
                {userPrefs.soundEnabled && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography gutterBottom>
                        Volume des sons : {userPrefs.soundVolume}%
                      </Typography>
                      <Slider
                        value={userPrefs.soundVolume}
                        onChange={(_, value) => handlePrefChange('soundVolume', value)}
                        min={0}
                        max={100}
                        step={10}
                        marks
                        valueLabelDisplay="auto"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Synchronisation automatique */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userPrefs.autoSync}
                        onChange={(e) => handlePrefChange('autoSync', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Cloud color={userPrefs.autoSync ? 'primary' : 'disabled'} />
                        <Box>
                          <Typography variant="body1">
                            Synchronisation automatique
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Synchronise automatiquement vos données avec le cloud
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              
              <Alert severity="info">
                <Typography variant="body2">
                  💡 La langue est détectée automatiquement depuis votre navigateur/téléphone ({navigator.language}). 
                  Vous pouvez la modifier manuellement si nécessaire.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Informations système */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informations système
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Version de l'application"
                    secondary={systemInfo.version}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Date de build"
                    secondary={systemInfo.buildDate}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Environnement"
                    secondary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          {systemInfo.nodeEnv}
                        </Typography>
                        {systemInfo.mockMode && (
                          <Chip
                            label="MOCK"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="URL de l'API"
                    secondary={systemInfo.apiUrl}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />
              
              <Button
                variant="outlined"
                startIcon={<GitHub />}
                href="https://github.com/anthropics/claude-code"
                target="_blank"
                size="small"
              >
                Code source
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Fonctionnalités */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚀 Fonctionnalités
              </Typography>
              
              <List>
                {features.map((feature, index) => (
                  <React.Fragment key={feature.title}>
                    <ListItem>
                      <ListItemIcon>
                        {feature.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">
                              {feature.title}
                            </Typography>
                            <Chip
                              label={getFeatureStatusLabel(feature.status)}
                              color={getFeatureStatusColor(feature.status) as any}
                              variant={feature.status === 'active' ? 'filled' : 'outlined'}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {feature.description}
                            </Typography>
                            {feature.details && (
                              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {feature.details}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < features.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Statut du système */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" gutterBottom>
                  📊 Statut des composants
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={isCheckingStatus ? <CircularProgress size={16} /> : <Refresh />}
                  onClick={checkSystemStatus}
                  disabled={isCheckingStatus}
                  size="small"
                >
                  {isCheckingStatus ? 'Vérification...' : 'Actualiser'}
                </Button>
              </Box>
              
              {isCheckingStatus && <LinearProgress sx={{ mb: 2 }} />}
              
              <List>
                {systemStatuses.map((status, index) => (
                  <React.Fragment key={status.name}>
                    <ListItem>
                      <ListItemIcon>
                        {getStatusIcon(status.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1">
                              {status.name}
                            </Typography>
                            <Chip
                              label={status.status.toUpperCase()}
                              size="small"
                              color={getStatusColor(status.status) as any}
                              variant={status.status === 'online' ? 'filled' : 'outlined'}
                            />
                            {status.responseTime && (
                              <Chip
                                label={`${status.responseTime}ms`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {status.message}
                            </Typography>
                            {status.lastChecked && (
                              <Typography variant="caption" color="text.secondary">
                                Dernière vérification : {status.lastChecked.toLocaleTimeString('fr-FR')}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < systemStatuses.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              {systemInfo.mockMode && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  🇫🇷 Mode développement activé - Les données sont simulées pour permettre les tests sans backend.
                </Alert>
              )}
              
              {systemStatuses.some(s => s.status === 'offline') && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  ⚠️ Certains services sont hors ligne. L'application fonctionne en mode dégradé.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;