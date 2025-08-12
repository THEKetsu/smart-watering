import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Fab,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PowerSettingsNew as PowerIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { plantsAPI } from '../services/api';
import { Plant, PlantType, PlantTypeLabels } from '../types/index';

const plantSchema = yup.object({
  name: yup.string().required('Le nom de la plante est requis'),
  type: yup.string().required('Le type de plante est requis'),
  description: yup.string().optional(),
  baseWateringFrequencyDays: yup.number().positive().integer().min(1).max(365).optional(),
  baseWaterAmountMl: yup.number().positive().integer().min(10).max(5000).optional(),
});

const PlantsSimple: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Plant | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: plantsResponse, isLoading, error } = useQuery(
    'plants',
    () => plantsAPI.getAll()
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(plantSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      baseWateringFrequencyDays: 7,
      baseWaterAmountMl: 250,
    },
  });

  const createMutation = useMutation(plantsAPI.create, {
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries('plants');
        toast.success('Plante créée avec succès');
        handleCloseDialog();
      } else {
        toast.error(response.message || 'Erreur lors de la création');
      }
    },
    onError: (error: any) => {
      console.error('Create plant error:', error);
      const message = error?.response?.data?.message || error?.message || 'Erreur de connexion';
      toast.error(message);
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => plantsAPI.update(id, data),
    {
      onSuccess: (response) => {
        if (response.success) {
          queryClient.invalidateQueries('plants');
          toast.success('Plante mise à jour avec succès');
          handleCloseDialog();
        } else {
          toast.error(response.message || 'Erreur lors de la mise à jour');
        }
      },
      onError: (error: any) => {
        console.error('Update plant error:', error);
        const message = error?.response?.data?.message || error?.message || 'Erreur de connexion';
        toast.error(message);
      },
    }
  );

  const deleteMutation = useMutation(plantsAPI.delete, {
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries('plants');
        toast.success('Plante supprimée avec succès');
        setDeleteConfirm(null);
      } else {
        toast.error(response.message || 'Erreur lors de la suppression');
      }
    },
    onError: (error: any) => {
      console.error('Delete plant error:', error);
      const message = error?.response?.data?.message || error?.message || 'Erreur de connexion';
      toast.error(message);
      setDeleteConfirm(null);
    },
  });

  const toggleActiveMutation = useMutation(plantsAPI.toggleActive, {
    onSuccess: () => {
      queryClient.invalidateQueries('plants');
      toast.success('Statut de la plante modifié');
    },
    onError: () => {
      toast.error('Erreur lors de la modification du statut');
    },
  });

  const handleOpenDialog = (plant?: Plant) => {
    if (plant) {
      setEditingPlant(plant);
      reset({
        name: plant.name,
        type: plant.type,
        description: plant.description || '',
        baseWateringFrequencyDays: plant.baseWateringFrequencyDays,
        baseWaterAmountMl: plant.baseWaterAmountMl,
      });
    } else {
      setEditingPlant(null);
      reset();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlant(null);
    reset();
  };

  const onSubmit = (data: any) => {
    console.log('📝 Données soumises:', data);
    
    if (editingPlant) {
      const updateData = {
        name: data.name,
        description: data.description,
      };
      updateMutation.mutate({ id: editingPlant.id, data: updateData });
    } else {
      const plantData = {
        name: data.name,
        type: data.type,
        description: data.description || '',
        baseWateringFrequencyDays: data.baseWateringFrequencyDays || 7,
        baseWaterAmountMl: data.baseWaterAmountMl || 250,
      };
      
      console.log('🌱 Données à envoyer:', plantData);
      createMutation.mutate(plantData);
    }
  };

  const handleDelete = (plant: Plant) => {
    setDeleteConfirm(plant);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.id);
    }
  };

  const handleToggleActive = (plant: Plant) => {
    toggleActiveMutation.mutate(plant.id);
  };

  const handleViewDetails = (plantId: string) => {
    navigate(`/plants/${plantId}`);
  };

  const getTypeColor = (type: PlantType) => {
    const colors: Record<PlantType, string> = {
      [PlantType.SUCCULENT]: '#4caf50',
      [PlantType.TROPICAL]: '#ff5722',
      [PlantType.MEDITERRANEAN]: '#ff9800',
      [PlantType.TEMPERATE]: '#2196f3',
      [PlantType.DESERT]: '#795548',
      [PlantType.AQUATIC]: '#00bcd4',
    };
    return colors[type] || '#666';
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">
          Erreur lors du chargement des plantes
        </Typography>
      </Box>
    );
  }

  const plants = plantsResponse?.data || [];

  return (
    <Box>
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            🌱 Mes Plantes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez votre collection de plantes
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Ajouter une plante
        </Button>
      </Box>

      {/* Liste des plantes */}
      {plants.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" mb={2}>
            Aucune plante pour le moment
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter une plante
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {plants.map((plant) => (
            <Grid item xs={12} sm={6} md={4} key={plant.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h2" fontWeight={600}>
                      {plant.name}
                    </Typography>
                    <Chip
                      label={PlantTypeLabels[plant.type]}
                      size="small"
                      sx={{ 
                        backgroundColor: getTypeColor(plant.type), 
                        color: 'white',
                      }}
                    />
                  </Box>
                  
                  {plant.description && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {plant.description}
                    </Typography>
                  )}
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Arrosage: {plant.baseWateringFrequencyDays} jours - {plant.baseWaterAmountMl}ml
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Créé le {format(new Date(plant.createdAt), 'dd/MM/yy')}
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <IconButton size="small" onClick={() => handleViewDetails(plant.id)}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDialog(plant)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleToggleActive(plant)}
                    color={plant.isActive ? 'success' : 'default'}
                  >
                    <PowerIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(plant)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Bouton flottant */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Dialog de création/édition */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingPlant ? 'Modifier la plante' : 'Ajouter une plante'}
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nom de la plante"
                      fullWidth
                      required
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      placeholder="Ex: Monstera, Basilic, Rose..."
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={Object.values(PlantType)}
                      getOptionLabel={(option) => PlantTypeLabels[option]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Type de plante"
                          required
                          error={!!errors.type}
                          helperText={errors.type?.message}
                        />
                      )}
                      onChange={(_, value) => field.onChange(value)}
                      value={field.value || null}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description (optionnel)"
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Décrivez votre plante..."
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Controller
                  name="baseWateringFrequencyDays"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fréquence (jours)"
                      type="number"
                      fullWidth
                      InputProps={{ inputProps: { min: 1, max: 365 } }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Controller
                  name="baseWaterAmountMl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Quantité (ml)"
                      type="number"
                      fullWidth
                      InputProps={{ inputProps: { min: 10, max: 5000 } }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {createMutation.isLoading || updateMutation.isLoading ? (
                <CircularProgress size={20} />
              ) : (
                editingPlant ? 'Modifier' : 'Créer'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la plante "{deleteConfirm?.name}" ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Annuler</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? <CircularProgress size={20} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlantsSimple;