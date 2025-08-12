import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Container,
  Tabs,
  Tab,
  Fab,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Schedule,
  History,
  WaterDrop,
  LocalFlorist,
  PhotoCamera,
  Analytics,
  Settings,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { plantsAPI } from '../services/api';
import { PlantTypeLabels, ScheduleStatusLabels, ScheduleStatus } from '../types/index';
import PlantPhotoAnnotated from '../components/PlantPhotoAnnotated';
import PlantHealthTracker from '../components/PlantHealthTracker';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plant-tabpanel-${index}`}
      aria-labelledby={`plant-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const PlantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const { data: plantResponse, isLoading, error } = useQuery(
    ['plant', id],
    () => plantsAPI.getById(id!),
    { enabled: !!id }
  );

  const { data: historyResponse } = useQuery(
    ['plant-history', id],
    () => plantsAPI.getHistory(id!, { limit: 10 }),
    { enabled: !!id }
  );

  const { data: schedulesResponse } = useQuery(
    ['plant-schedules', id],
    () => plantsAPI.getSchedules(id!, { limit: 20 }),
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !plantResponse?.data) {
    return (
      <Alert severity="error">
        Plante introuvable
      </Alert>
    );
  }

  const plant = plantResponse.data;
  const history = historyResponse?.data || [];
  const schedules = schedulesResponse?.data || [];

  const getStatusColor = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.COMPLETED: return 'success';
      case ScheduleStatus.PENDING: return 'warning';
      case ScheduleStatus.SKIPPED: return 'default';
      default: return 'default';
    }
  };

  const generateWateringChart = () => {
    return history.slice(0, 10).reverse().map((entry) => ({
      date: format(new Date(entry.wateredAt), 'dd/MM', { locale: fr }),
      amount: entry.waterAmountMl,
      scheduled: entry.wasScheduled ? entry.waterAmountMl : 0,
      manual: !entry.wasScheduled ? entry.waterAmountMl : 0,
    }));
  };

  const getTypeColor = (type: any) => {
    const colors: Record<string, string> = {
      succulent: '#4caf50',
      tropical: '#ff5722',
      mediterranean: '#ff9800',
      temperate: '#2196f3',
      desert: '#795548',
      aquatic: '#00bcd4',
    };
    return colors[type] || '#666';
  };

  const handlePhotoUpdate = (file: File) => {
    console.log('Photo upload:', file.name);
  };

  const handleAnnotationClick = (type: string) => {
    console.log('Annotation clicked:', type);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton 
          onClick={() => navigate('/plants')}
          sx={{ 
            bgcolor: 'background.paper', 
            boxShadow: 1,
            '&:hover': { boxShadow: 2 }
          }}
        >
          <ArrowBack />
        </IconButton>
        
        <Avatar
          sx={{
            bgcolor: getTypeColor(plant.type),
            width: 48,
            height: 48,
          }}
        >
          <LocalFlorist />
        </Avatar>
        
        <Box flexGrow={1}>
          <Typography variant="h4" fontWeight={600}>
            {plant.name}
          </Typography>
          <Box display="flex" gap={1} mt={1}>
            <Chip
              label={PlantTypeLabels[plant.type]}
              sx={{ 
                bgcolor: getTypeColor(plant.type), 
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label={plant.isActive ? '🟢 Actif' : '🔴 Inactif'}
              color={plant.isActive ? 'success' : 'default'}
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={() => navigate('/plants')}
          sx={{ minWidth: 120 }}
        >
          Modifier
        </Button>
      </Box>

      {/* Navigation par onglets */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="plant details tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<PhotoCamera />}
            label="Photo & Santé"
            id="plant-tab-0"
          />
          <Tab
            icon={<Analytics />}
            label="Statistiques"
            id="plant-tab-1"
          />
          <Tab
            icon={<History />}
            label="Historique"
            id="plant-tab-2"
          />
          <Tab
            icon={<Settings />}
            label="Paramètres"
            id="plant-tab-3"
          />
        </Tabs>
      </Paper>

      {/* Panneau Photo & Santé */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <PlantPhotoAnnotated
              plant={plant}
              onPhotoUpdate={handlePhotoUpdate}
              onAnnotationClick={handleAnnotationClick}
            />
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <PlantHealthTracker
              plantId={plant.id}
              onUpdateHealth={(metrics) => console.log('Health updated:', metrics)}
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Panneau Statistiques */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <WaterDrop color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Historique d'arrosage (10 derniers)
                  </Typography>
                </Box>
                
                {history.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={generateWateringChart()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="scheduled" fill="#4caf50" name="Planifié" />
                      <Bar dataKey="manual" fill="#2196f3" name="Manuel" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Alert severity="info">Aucun historique d'arrosage</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Métriques de performance
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary" fontWeight={600}>
                        {history.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Arrosages totaux
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main" fontWeight={600}>
                        {Math.round(history.reduce((sum, h) => sum + h.waterAmountMl, 0))}ml
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Eau consommée
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Panneau Historique */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <History color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Historique détaillé des arrosages
                  </Typography>
                </Box>
                
                {history.length > 0 ? (
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Quantité (ml)</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Notes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {history.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>
                              {format(new Date(entry.wateredAt), 'PPp', { locale: fr })}
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <WaterDrop fontSize="small" color="primary" />
                                {entry.waterAmountMl}ml
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={entry.wasScheduled ? 'Planifié' : 'Manuel'}
                                color={entry.wasScheduled ? 'primary' : 'secondary'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{entry.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">Aucun historique d'arrosage disponible</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Panneau Paramètres */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <LocalFlorist sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Informations de base
                </Typography>
                
                {plant.description && (
                  <Typography variant="body1" paragraph>
                    {plant.description}
                  </Typography>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Type de plante
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {PlantTypeLabels[plant.type]}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Fréquence d'arrosage
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {plant.baseWateringFrequencyDays} jours
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Quantité d'eau
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {plant.baseWaterAmountMl}ml
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Température idéale
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {plant.minTemperature}°C - {plant.maxTemperature}°C
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Actions sur la plante
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => navigate('/plants')}
                    size="large"
                    fullWidth
                  >
                    Modifier les paramètres
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<WaterDrop />}
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Arroser maintenant
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Schedule />}
                    color="secondary"
                    size="large"
                    fullWidth
                  >
                    Planifier arrosage
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* FAB pour actions rapides */}
      <Fab
        color="primary"
        aria-label="water plant"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <WaterDrop />
      </Fab>
    </Container>
  );
};

export default PlantDetail;