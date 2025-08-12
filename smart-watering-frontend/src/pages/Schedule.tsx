import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Fab,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule as ScheduleIcon,
  Warning,
  Refresh,
} from '@mui/icons-material';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';

import { schedulesAPI } from '../services/api';
import { ScheduleStatus, ScheduleStatusLabels, WateringSchedule } from '../types/index';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Schedule: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [completeDialog, setCompleteDialog] = useState<WateringSchedule | null>(null);
  const [skipDialog, setSkipDialog] = useState<WateringSchedule | null>(null);
  const [actualAmount, setActualAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [skipReason, setSkipReason] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: todaySchedules, isLoading: loadingToday } = useQuery(
    'todaySchedules',
    schedulesAPI.getToday
  );

  const { data: pendingSchedules, isLoading: loadingPending } = useQuery(
    'pendingSchedules',
    schedulesAPI.getPending
  );

  const { data: overdueSchedules, isLoading: loadingOverdue } = useQuery(
    'overdueSchedules',
    schedulesAPI.getOverdue
  );

  const { data: weekSummary } = useQuery(
    'weekSummary',
    schedulesAPI.getWeekSummary
  );

  const generateDailyMutation = useMutation(schedulesAPI.generateDaily, {
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules']);
      queryClient.invalidateQueries('todaySchedules');
      queryClient.invalidateQueries('pendingSchedules');
      queryClient.invalidateQueries('weekSummary');
      toast.success('Planning quotidien généré avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la génération du planning');
    },
  });

  const completeMutation = useMutation(
    ({ id, data }: { id: string; data: { actualAmount?: number; notes?: string } }) =>
      schedulesAPI.complete(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['schedules']);
        queryClient.invalidateQueries('todaySchedules');
        queryClient.invalidateQueries('pendingSchedules');
        queryClient.invalidateQueries('overdueSchedules');
        queryClient.invalidateQueries('weekSummary');
        toast.success('Arrosage marqué comme terminé');
        setCompleteDialog(null);
        setActualAmount(0);
        setNotes('');
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour');
      },
    }
  );

  const skipMutation = useMutation(
    ({ id, reason }: { id: string; reason: string }) =>
      schedulesAPI.skip(id, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['schedules']);
        queryClient.invalidateQueries('todaySchedules');
        queryClient.invalidateQueries('pendingSchedules');
        queryClient.invalidateQueries('overdueSchedules');
        queryClient.invalidateQueries('weekSummary');
        toast.success('Arrosage ignoré');
        setSkipDialog(null);
        setSkipReason('');
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour');
      },
    }
  );

  const handleCompleteDialogOpen = (schedule: WateringSchedule) => {
    setCompleteDialog(schedule);
    setActualAmount(schedule.waterAmountMl);
    setNotes('');
  };

  const handleCompleteSubmit = () => {
    if (completeDialog) {
      completeMutation.mutate({
        id: completeDialog.id,
        data: {
          actualAmount: actualAmount || completeDialog.waterAmountMl,
          notes: notes || undefined,
        },
      });
    }
  };

  const handleSkipDialogOpen = (schedule: WateringSchedule) => {
    setSkipDialog(schedule);
    setSkipReason('');
  };

  const handleSkipSubmit = () => {
    if (skipDialog && skipReason.trim()) {
      skipMutation.mutate({
        id: skipDialog.id,
        reason: skipReason,
      });
    }
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
      case ScheduleStatus.PENDING: return <ScheduleIcon color="warning" />;
      case ScheduleStatus.SKIPPED: return <Warning color="disabled" />;
      default: return <ScheduleIcon />;
    }
  };

  const renderScheduleTable = (schedules: WateringSchedule[], showActions = true) => {
    if (!schedules || schedules.length === 0) {
      return (
        <Alert severity="info">
          Aucune planification disponible
        </Alert>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plante</TableCell>
              <TableCell>Date prévue</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Raison</TableCell>
              {showActions && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.plant?.name || 'Plante inconnue'}</TableCell>
                <TableCell>
                  {format(new Date(schedule.scheduledDate), 'PPp', { locale: fr })}
                </TableCell>
                <TableCell>{schedule.waterAmountMl}ml</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(schedule.status)}
                    label={ScheduleStatusLabels[schedule.status]}
                    color={getStatusColor(schedule.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{schedule.reason || '-'}</TableCell>
                {showActions && (
                  <TableCell>
                    {schedule.status === ScheduleStatus.PENDING && (
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleCompleteDialogOpen(schedule)}
                          title="Marquer comme terminé"
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleSkipDialogOpen(schedule)}
                          title="Ignorer"
                        >
                          <Cancel />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const generateWeeklyCalendar = () => {
    if (!weekSummary?.data) return [];
    
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    return days.map((dayName, index) => {
      const date = addDays(startOfWeek, index);
      const daySchedules = weekSummary.data.schedulesByDay[dayName] || [];
      
      return {
        date,
        dayName,
        schedules: daySchedules,
        isToday: date.toDateString() === today.toDateString(),
      };
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Planning d'arrosage
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => generateDailyMutation.mutate()}
          disabled={generateDailyMutation.isLoading}
        >
          {generateDailyMutation.isLoading ? (
            <CircularProgress size={20} />
          ) : (
            'Générer le planning'
          )}
        </Button>
      </Box>

      {/* Statistiques rapides */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {todaySchedules?.data.length || 0}
              </Typography>
              <Typography color="textSecondary">Aujourd'hui</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="error.main">
                {overdueSchedules?.data.length || 0}
              </Typography>
              <Typography color="textSecondary">En retard</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary.main">
                {pendingSchedules?.data.length || 0}
              </Typography>
              <Typography color="textSecondary">En attente</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {weekSummary?.data.completedSchedules || 0}
              </Typography>
              <Typography color="textSecondary">Terminés (semaine)</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Calendrier hebdomadaire */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Vue hebdomadaire
          </Typography>
          <Grid container spacing={1}>
            {generateWeeklyCalendar().map((day, index) => (
              <Grid item xs={12} sm={6} md key={index}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: day.isToday ? 'primary.light' : 'background.paper',
                    opacity: day.isToday ? 1 : 0.8,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {day.dayName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {format(day.date, 'dd/MM', { locale: fr })}
                  </Typography>
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    {day.schedules.slice(0, 3).map((schedule: any, i: number) => (
                      <Chip
                        key={i}
                        label={schedule.plant?.name}
                        size="small"
                        color={getStatusColor(schedule.status) as any}
                        variant="outlined"
                      />
                    ))}
                    {day.schedules.length > 3 && (
                      <Chip
                        label={`+${day.schedules.length - 3}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Onglets de planification */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={(_, newValue) => setCurrentTab(newValue)}
            aria-label="onglets de planification"
          >
            <Tab label="Aujourd'hui" />
            <Tab label="En retard" />
            <Tab label="En attente" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          {loadingToday ? (
            <CircularProgress />
          ) : (
            renderScheduleTable(todaySchedules?.data || [])
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {loadingOverdue ? (
            <CircularProgress />
          ) : (
            renderScheduleTable(overdueSchedules?.data || [])
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {loadingPending ? (
            <CircularProgress />
          ) : (
            renderScheduleTable(pendingSchedules?.data || [])
          )}
        </TabPanel>
      </Card>

      {/* Dialog de completion */}
      <Dialog open={!!completeDialog} onClose={() => setCompleteDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Marquer l'arrosage comme terminé</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Plante:</strong> {completeDialog?.plant?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Quantité prévue:</strong> {completeDialog?.waterAmountMl}ml
            </Typography>
            
            <TextField
              label="Quantité réellement utilisée (ml)"
              type="number"
              fullWidth
              value={actualAmount}
              onChange={(e) => setActualAmount(Number(e.target.value))}
              margin="normal"
            />
            
            <TextField
              label="Notes (optionnel)"
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialog(null)}>Annuler</Button>
          <Button
            onClick={handleCompleteSubmit}
            variant="contained"
            disabled={completeMutation.isLoading}
          >
            {completeMutation.isLoading ? <CircularProgress size={20} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'ignore */}
      <Dialog open={!!skipDialog} onClose={() => setSkipDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Ignorer l'arrosage</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Plante:</strong> {skipDialog?.plant?.name}
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Raison</InputLabel>
              <Select
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                label="Raison"
              >
                <MenuItem value="Pluie">Il a plu</MenuItem>
                <MenuItem value="Sol humide">Le sol est encore humide</MenuItem>
                <MenuItem value="Plante malade">Plante malade</MenuItem>
                <MenuItem value="Absence">Absent(e)</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </Select>
            </FormControl>
            
            {skipReason === 'Autre' && (
              <TextField
                label="Précisez la raison"
                fullWidth
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                margin="normal"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSkipDialog(null)}>Annuler</Button>
          <Button
            onClick={handleSkipSubmit}
            variant="contained"
            disabled={skipMutation.isLoading || !skipReason.trim()}
            color="warning"
          >
            {skipMutation.isLoading ? <CircularProgress size={20} /> : 'Ignorer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB pour génération rapide */}
      <Fab
        color="primary"
        aria-label="generate"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => generateDailyMutation.mutate()}
        disabled={generateDailyMutation.isLoading}
      >
        <Refresh />
      </Fab>
    </Box>
  );
};

export default Schedule;