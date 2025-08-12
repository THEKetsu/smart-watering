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
  Alert,
  CircularProgress,
  Fab,
  Paper,
  Tabs,
  Tab,
  Autocomplete,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PowerSettingsNew as PowerIcon,
  PhotoCamera,
  Search,
  CloudUpload,
  Sync as SyncIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { plantsAPI } from '../services/api';
import { Plant, PlantType, PlantTypeLabels, CreatePlantData } from '../types/index';
import { plantsApiService, PlantSearchResult } from '../services/plantsApi';
import PlantSearchCard from '../components/PlantSearchCard';

// Dictionnaire de traduction français → anglais pour les plantes courantes
const plantTranslationDict: Record<string, string> = {
  // Plantes d'intérieur courantes
  'monstera': 'monstera',
  'philodendron': 'philodendron',
  'pothos': 'pothos',
  'ficus': 'ficus',
  'caoutchouc': 'rubber tree',
  'sansevieria': 'snake plant',
  'langue de belle-mère': 'snake plant',
  'plante serpent': 'snake plant',
  'aloe': 'aloe',
  'aloe vera': 'aloe vera',
  'cactus': 'cactus',
  'succulente': 'succulent',
  'plante grasse': 'succulent',
  'palmier': 'palm',
  'yucca': 'yucca',
  'dracaena': 'dracaena',
  'dragonnier': 'dracaena',
  'chlorophytum': 'spider plant',
  'plante araignée': 'spider plant',
  'zamioculcas': 'zz plant',
  'plante zz': 'zz plant',
  'anthurium': 'anthurium',
  'spathiphyllum': 'peace lily',
  'fleur de lune': 'peace lily',
  'calathea': 'calathea',
  'maranta': 'prayer plant',
  'fougère': 'fern',
  'boston fern': 'boston fern',
  'nephrolepis': 'boston fern',
  'begonia': 'begonia',
  'cyclamen': 'cyclamen',
  'orchidée': 'orchid',
  'phalaenopsis': 'phalaenopsis',
  'violette africaine': 'african violet',
  'saintpaulia': 'african violet',
  'hibiscus': 'hibiscus',
  'géranium': 'geranium',
  'pélargonium': 'geranium',
  'lavande': 'lavender',
  'romarin': 'rosemary',
  'basilic': 'basil',
  'menthe': 'mint',
  'persil': 'parsley',
  'ciboulette': 'chives',
  'thym': 'thyme',
  'sauge': 'sage',
  'coriandre': 'cilantro',
  'aneth': 'dill',
  // Arbres et arbustes
  'olivier': 'olive tree',
  'citronnier': 'lemon tree',
  'oranger': 'orange tree',
  'mandarinier': 'mandarin tree',
  'figuier': 'fig tree',
  'bonsai': 'bonsai',
  'bambou': 'bamboo',
  'eucalyptus': 'eucalyptus',
  'magnolia': 'magnolia',
  'camélia': 'camellia',
  'azalée': 'azalea',
  'rhododendron': 'rhododendron',
  'hortensia': 'hydrangea',
  'jasmin': 'jasmine',
  'bougainvillier': 'bougainvillea',
  'rosier': 'rose',
  'rose': 'rose',
  'pivoine': 'peony',
  'dahlia': 'dahlia',
  'tulipe': 'tulip',
  'narcisse': 'narcissus',
  'jonquille': 'daffodil',
  'iris': 'iris',
  'lys': 'lily',
  'lis': 'lily',
  'glaïeul': 'gladiolus',
  'tournesol': 'sunflower',
  'marguerite': 'daisy',
  'chrysanthème': 'chrysanthemum',
  'pétunia': 'petunia',
  'impatiens': 'impatiens',
  'géranium lierre': 'ivy geranium',
  'lierre': 'ivy',
  'vigne': 'vine',
  'vigne vierge': 'virginia creeper'
};

const plantSchema = yup.object({
  nickname: yup.string().optional(),
  quantity: yup.number().positive().integer().required('La quantité est requise'),
});

const Plants: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Plant | null>(null);
  const [plantSearchQuery, setPlantSearchQuery] = useState('');
  const [plantSearchResults, setPlantSearchResults] = useState<PlantSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedApiPlant, setSelectedApiPlant] = useState<PlantSearchResult | null>(null);
  const [searchMethod, setSearchMethod] = useState<'name' | 'photo'>('name');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);
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
      nickname: '',
      quantity: 1,
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
    ({ id, data }: { id: string; data: Partial<CreatePlantData> }) =>
      plantsAPI.update(id, data),
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

  const syncAllImagesMutation = useMutation(plantsAPI.syncAllImages, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('plants');
      const { total, updated, errors } = data.data;
      toast.success(`Images synchronisées: ${updated}/${total} mises à jour, ${errors} erreurs`);
    },
    onError: () => {
      toast.error('Erreur lors de la synchronisation des images');
    },
  });

  const handleOpenDialog = (plant?: Plant) => {
    if (plant) {
      setEditingPlant(plant);
      reset({
        nickname: (plant as any).nickname || '',
        quantity: (plant as any).quantity || 1,
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
    setPlantSearchQuery('');
    setPlantSearchResults([]);
    setSelectedApiPlant(null);
    setSearchMethod('name');
    setUploadedImage(null);
    setImagePreview(null);
    setPhotoAnalyzing(false);
    reset();
  };

  // 🌍 Solution "Best Practice" : Recherche Intelligente Multilingue
  const smartPlantSearch = async (query: string): Promise<PlantSearchResult[]> => {
    const searchStrategies = [
      // 1. Recherche directe (noms anglais/latins)
      async () => {
        const response = await plantsApiService.searchPlants(query);
        return response.plants;
      },
      
      // 2. Recherche avec noms scientifiques partiels
      async () => {
        if (query.length >= 3) {
          const scientificTerms = [
            query + '*', // Recherche avec wildcard
            query.charAt(0).toUpperCase() + query.slice(1), // Première lettre maj
          ];
          
          const allResults: PlantSearchResult[] = [];
          for (const term of scientificTerms) {
            try {
              const response = await plantsApiService.searchPlants(term);
              allResults.push(...response.plants);
            } catch {}
          }
          return allResults;
        }
        return [];
      },
      
      // 3. Dictionnaire français → anglais
      async () => {
        const lowerQuery = query.toLowerCase().trim();
        const translations: string[] = [];
        
        // Correspondances exactes
        if (plantTranslationDict[lowerQuery]) {
          translations.push(plantTranslationDict[lowerQuery]);
        }
        
        // Correspondances partielles
        Object.entries(plantTranslationDict).forEach(([french, english]) => {
          if (french.includes(lowerQuery) || lowerQuery.includes(french)) {
            if (!translations.includes(english)) {
              translations.push(english);
            }
          }
        });
        
        // Rechercher avec les traductions
        const allResults: PlantSearchResult[] = [];
        for (const translation of translations) {
          try {
            const response = await plantsApiService.searchPlants(translation);
            allResults.push(...response.plants);
          } catch {}
        }
        return allResults;
      }
    ];
    
    // Exécuter toutes les stratégies en parallèle
    const allResultArrays = await Promise.allSettled(
      searchStrategies.map(strategy => strategy())
    );
    
    // Combiner et dédupliquer les résultats
    const combinedResults: PlantSearchResult[] = [];
    const seenIds = new Set<number>();
    
    allResultArrays.forEach(result => {
      if (result.status === 'fulfilled') {
        result.value.forEach(plant => {
          if (!seenIds.has(plant.id)) {
            seenIds.add(plant.id);
            combinedResults.push(plant);
          }
        });
      }
    });
    
    // Tri par pertinence (noms qui commencent par la requête en premier)
    return combinedResults.sort((a, b) => {
      const aStartsWith = a.common_name.toLowerCase().startsWith(query.toLowerCase());
      const bStartsWith = b.common_name.toLowerCase().startsWith(query.toLowerCase());
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    });
  };

  // Recherche de plantes avec toutes les stratégies
  const handlePlantSearch = async (query: string) => {
    if (query.length < 1) {
      setPlantSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await smartPlantSearch(query);
      setPlantSearchResults(results);
      
      // Analytics/Debug
      if (results.length > 0) {
        console.log(`🔍 Recherche "${query}" → ${results.length} résultats`);
      }
      
    } catch (error) {
      console.error('Erreur lors de la recherche de plantes:', error);
      toast.error('Erreur lors de la recherche de plantes');
      setPlantSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Gestion de l'upload d'image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      
      // Créer un preview de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyse de la photo pour identifier la plante
  const handlePhotoAnalysis = async () => {
    if (!uploadedImage) {
      toast.error('Veuillez d\'abord sélectionner une photo');
      return;
    }

    setPhotoAnalyzing(true);
    try {
      // Simulation d'analyse d'image (en réalité, vous utiliseriez une API comme PlantNet ou PlantID)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulation de résultats basés sur l'analyse d'image
      const mockResults: PlantSearchResult[] = [
        {
          id: 1001,
          common_name: 'Monstera deliciosa',
          scientific_name: 'Monstera deliciosa',
          cycle: 'Perennial',
          watering: 'Average',
          sunlight: ['Indirect'],
          default_image: {
            small_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
            medium_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'
          }
        },
        {
          id: 1002,
          common_name: 'Pothos',
          scientific_name: 'Epipremnum aureum',
          cycle: 'Perennial',
          watering: 'Average',
          sunlight: ['Low', 'Indirect'],
          default_image: {
            small_url: 'https://images.unsplash.com/photo-1509423350716-97f2360af87e?w=100&h=100&fit=crop',
            medium_url: 'https://images.unsplash.com/photo-1509423350716-97f2360af87e?w=300&h=300&fit=crop'
          }
        }
      ];
      
      setPlantSearchResults(mockResults);
      toast.success('Analyse terminée ! Voici les plantes détectées.');
    } catch (error) {
      console.error('Erreur lors de l\'analyse de la photo:', error);
      toast.error('Erreur lors de l\'analyse de la photo');
    } finally {
      setPhotoAnalyzing(false);
    }
  };

  // Sélection d'une plante depuis l'API
  const handleSelectApiPlant = async (plant: PlantSearchResult) => {
    setSelectedApiPlant(plant);
    setPlantSearchResults([]);
    setPlantSearchQuery(plant.common_name);

    // Garder seulement les valeurs utilisateur
    reset({
      nickname: '',
      quantity: 1,
    });
  };

  const onSubmit = (data: any) => {
    if (!selectedApiPlant) {
      toast.error('Veuillez sélectionner une plante depuis la base de données');
      return;
    }

    if (editingPlant) {
      const updateData = {
        nickname: data.nickname,
        quantity: data.quantity,
      };
      updateMutation.mutate({ id: editingPlant.id, data: updateData as any });
    } else {
      // Combiner les données API avec les données utilisateur
      const plantData = {
        ...selectedApiPlant,
        nickname: data.nickname,
        quantity: data.quantity,
        // Les données techniques viennent de l'API
        name: selectedApiPlant.common_name,
        type: PlantType.TROPICAL, // À déterminer depuis l'API
        description: selectedApiPlant.scientific_name,
        baseWateringFrequencyDays: 7, // À récupérer depuis l'API
        baseWaterAmountMl: 250,
        springMultiplier: 1.0,
        summerMultiplier: 1.2,
        autumnMultiplier: 0.8,
        winterMultiplier: 0.5,
        minTemperature: 15,
        maxTemperature: 30,
        idealHumidity: 50,
        rainThresholdMm: 5,
      };
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
      <Alert severity="error">
        Erreur lors du chargement des plantes
      </Alert>
    );
  }

  const plants = plantsResponse?.data || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Mes plantes ({plants.length})
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<SyncIcon />}
            onClick={() => syncAllImagesMutation.mutate()}
            disabled={syncAllImagesMutation.isLoading}
          >
            {syncAllImagesMutation.isLoading ? 'Synchronisation...' : 'Sync Images'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter une plante
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {plants.map((plant) => (
          <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={plant.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3, pb: '16px !important' }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                  <Box flexGrow={1} mr={2}>
                    <Typography variant="h5" component="h2" fontWeight={600} mb={1}>
                      {plant.name}
                    </Typography>
                    <Chip
                      label={PlantTypeLabels[plant.type]}
                      size="medium"
                      sx={{ 
                        backgroundColor: getTypeColor(plant.type), 
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.875rem'
                      }}
                    />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      size="medium"
                      onClick={() => handleToggleActive(plant)}
                      color={plant.isActive ? 'success' : 'default'}
                      sx={{
                        bgcolor: plant.isActive ? 'success.light' : 'grey.100',
                        '&:hover': {
                          bgcolor: plant.isActive ? 'success.main' : 'grey.200',
                        }
                      }}
                    >
                      <PowerIcon />
                    </IconButton>
                  </Box>
                </Box>

                {plant.description && (
                  <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                    {plant.description}
                  </Typography>
                )}

                <Box mb={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Fréquence d'arrosage
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {plant.baseWateringFrequencyDays} jours
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Quantité d'eau
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {plant.baseWaterAmountMl}ml
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Température idéale
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {plant.minTemperature}°C - {plant.maxTemperature}°C
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Statut
                    </Typography>
                    <Chip
                      label={plant.isActive ? 'Actif' : 'Inactif'}
                      color={plant.isActive ? 'success' : 'default'}
                      size="small"
                      variant={plant.isActive ? 'filled' : 'outlined'}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Créé le {format(new Date(plant.createdAt), 'dd/MM/yy')}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ px: 3, pb: 2, pt: 1, justifyContent: 'space-between' }}>
                <Box display="flex" gap={1}>
                  <IconButton
                    size="medium"
                    onClick={() => handleViewDetails(plant.id)}
                    title="Voir les détails"
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.main' }
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="medium"
                    onClick={() => handleOpenDialog(plant)}
                    title="Modifier"
                    sx={{
                      bgcolor: 'grey.100',
                      '&:hover': { bgcolor: 'grey.200' }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                <IconButton
                  size="medium"
                  onClick={() => handleDelete(plant)}
                  title="Supprimer"
                  color="error"
                  sx={{
                    bgcolor: 'error.light',
                    color: 'white',
                    '&:hover': { bgcolor: 'error.main' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {plants.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            Aucune plante ajoutée
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Commencez par ajouter votre première plante
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter une plante
          </Button>
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Dialog de création/édition */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingPlant ? 'Modifier la plante' : 'Ajouter une plante'}
          </DialogTitle>
          <DialogContent>
            {/* Section de recherche de plantes - OBLIGATOIRE */}
            {!editingPlant && (
              <Box sx={{ mb: 4, p: 3, bgcolor: selectedApiPlant ? 'success.light' : 'grey.50', borderRadius: 2, border: '2px solid', borderColor: selectedApiPlant ? 'success.main' : 'grey.300' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  🌱 Étape 1 : Identifiez votre plante (OBLIGATOIRE)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Choisissez votre méthode préférée pour identifier votre plante
                </Typography>

                {/* Onglets de sélection de méthode */}
                <Paper sx={{ mb: 3 }}>
                  <Tabs 
                    value={searchMethod} 
                    onChange={(_, newValue) => {
                      setSearchMethod(newValue);
                      setPlantSearchResults([]);
                      setPlantSearchQuery('');
                      setUploadedImage(null);
                      setImagePreview(null);
                    }}
                    centered
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Tab 
                      value="name" 
                      label="Recherche par nom" 
                      icon={<Search />} 
                      iconPosition="start"
                    />
                    <Tab 
                      value="photo" 
                      label="Identification par photo" 
                      icon={<PhotoCamera />} 
                      iconPosition="start"
                    />
                  </Tabs>
                </Paper>

                {/* Recherche par nom avec autocomplétion */}
                {searchMethod === 'name' && (
                  <Box>
                    <Autocomplete
                      options={plantSearchResults}
                      getOptionLabel={(option) => option.common_name}
                      loading={searchLoading}
                      onInputChange={(_, newValue) => {
                        setPlantSearchQuery(newValue);
                        handlePlantSearch(newValue);
                      }}
                      onChange={(_, newValue) => {
                        if (newValue) {
                          handleSelectApiPlant(newValue);
                        }
                      }}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box display="flex" alignItems="center" gap={2} width="100%">
                            {option.default_image?.small_url && (
                              <Avatar
                                src={option.default_image.small_url}
                                alt={option.common_name}
                                sx={{ width: 40, height: 40 }}
                              />
                            )}
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {option.common_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {option.scientific_name}
                              </Typography>
                            </Box>
                            <Box display="flex" gap={0.5}>
                              {option.watering && (
                                <Chip 
                                  label={option.watering} 
                                  size="small" 
                                  variant="outlined" 
                                  color="primary" 
                                />
                              )}
                            </Box>
                          </Box>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Tapez en français ou anglais (ex: Monstera, Caoutchouc, Ficus...)"
                          error={!selectedApiPlant}
                          helperText={
                            !selectedApiPlant 
                              ? "⚠️ Recherche intelligente : français, anglais, noms latins" 
                              : "✅ Plante sélectionnée avec succès"
                          }
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            endAdornment: (
                              <>
                                {searchLoading && <CircularProgress color="inherit" size={20} />}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      noOptionsText={
                        plantSearchQuery.length < 1 
                          ? "Commencez à taper pour voir les suggestions..."
                          : searchLoading 
                            ? "Recherche en cours..."
                            : "Aucune plante trouvée"
                      }
                      sx={{ mb: 2 }}
                    />

                    <Alert severity="success" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        🌍 <strong>Recherche Multilingue :</strong><br/>
                        • <strong>Français :</strong> caoutchouc, plante serpent, monstera<br/>
                        • <strong>Anglais :</strong> rubber tree, snake plant, monstera<br/>
                        • <strong>Latin :</strong> Ficus elastica, Sansevieria, Monstera deliciosa<br/>
                        La recherche combine automatiquement toutes les langues !
                      </Typography>
                    </Alert>
                  </Box>
                )}

                {/* Recherche par photo */}
                {searchMethod === 'photo' && (
                  <Box>
                    <Box 
                      sx={{ 
                        border: '2px dashed',
                        borderColor: uploadedImage ? 'success.main' : 'grey.400',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        bgcolor: uploadedImage ? 'success.light' : 'grey.50',
                        mb: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: uploadedImage ? 'success.dark' : 'primary.main',
                          bgcolor: uploadedImage ? 'success.main' : 'primary.light'
                        }
                      }}
                      component="label"
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      
                      {imagePreview ? (
                        <Box>
                          <Box
                            component="img"
                            src={imagePreview}
                            alt="Preview"
                            sx={{
                              width: '100%',
                              maxWidth: 200,
                              height: 150,
                              objectFit: 'cover',
                              borderRadius: 1,
                              mb: 2
                            }}
                          />
                          <Typography variant="body1" fontWeight={600} color="success.dark">
                            ✅ Photo sélectionnée
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cliquez sur "Analyser la photo" pour identifier votre plante
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" fontWeight={600} mb={1}>
                            Prenez ou sélectionnez une photo
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cliquez ici pour choisir une photo de votre plante
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {uploadedImage && (
                      <Button
                        variant="contained"
                        onClick={handlePhotoAnalysis}
                        disabled={photoAnalyzing}
                        fullWidth
                        size="large"
                        sx={{ mb: 2 }}
                      >
                        {photoAnalyzing ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Analyse en cours...
                          </>
                        ) : (
                          <>
                            <PhotoCamera sx={{ mr: 1 }} />
                            Analyser la photo
                          </>
                        )}
                      </Button>
                    )}

                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        📸 <strong>Conseils pour une meilleure reconnaissance :</strong><br/>
                        • Prenez la photo de jour avec un bon éclairage<br/>
                        • Montrez les feuilles distinctement<br/>
                        • Évitez les ombres importantes<br/>
                        • Une vue d'ensemble de la plante est préférable
                      </Typography>
                    </Alert>

                    {/* Résultats de l'analyse photo */}
                    {plantSearchResults.length > 0 && searchMethod === 'photo' && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                          🔍 Plantes identifiées :
                        </Typography>
                        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                          {plantSearchResults.map((plant) => (
                            <Card 
                              key={plant.id} 
                              sx={{ 
                                mb: 1, 
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': { 
                                  bgcolor: 'primary.light',
                                  transform: 'translateY(-2px)',
                                  boxShadow: 2
                                }
                              }}
                              onClick={() => handleSelectApiPlant(plant)}
                            >
                              <CardContent sx={{ py: 2 }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                  {plant.default_image?.small_url && (
                                    <Avatar
                                      src={plant.default_image.small_url}
                                      alt={plant.common_name}
                                      sx={{ width: 50, height: 50 }}
                                    />
                                  )}
                                  <Box flex={1}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                      {plant.common_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {plant.scientific_name}
                                    </Typography>
                                    <Box display="flex" gap={0.5} mt={1}>
                                      {plant.watering && <Chip label={`Arrosage: ${plant.watering}`} size="small" variant="outlined" color="primary" />}
                                      {plant.cycle && <Chip label={plant.cycle} size="small" variant="outlined" />}
                                    </Box>
                                  </Box>
                                  <Button variant="contained" size="small">
                                    Sélectionner
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Confirmation de sélection */}
                {selectedApiPlant && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      {selectedApiPlant.default_image?.small_url && (
                        <Avatar
                          src={selectedApiPlant.default_image.small_url}
                          alt={selectedApiPlant.common_name}
                          sx={{ width: 40, height: 40 }}
                        />
                      )}
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          ✅ Plante sélectionnée: {selectedApiPlant.common_name}
                        </Typography>
                        <Typography variant="body2">
                          {selectedApiPlant.scientific_name}
                        </Typography>
                      </Box>
                    </Box>
                  </Alert>
                )}
              </Box>
            )}
            
            {/* Section utilisateur - Seulement après sélection API */}
            {(selectedApiPlant || editingPlant) && (
              <Box sx={{ mt: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  ✏️ Étape 2 : Personnalisez votre plante
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Ajoutez vos informations personnelles pour cette plante
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="nickname"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Surnom (facultatif)"
                          placeholder="ex: Ma monstera du salon"
                          fullWidth
                          error={!!errors.nickname}
                          helperText={errors.nickname?.message || "Donnez un nom personnalisé à votre plante"}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="quantity"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Quantité *"
                          type="number"
                          inputProps={{ min: 1, step: 1 }}
                          fullWidth
                          error={!!errors.quantity}
                          helperText={errors.quantity?.message || "Combien de plantes de ce type avez-vous ?"}
                          required
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                
                {selectedApiPlant && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1, border: '1px solid', borderColor: 'info.main' }}>
                    <Typography variant="body2" color="info.dark" sx={{ fontWeight: 600, mb: 1 }}>
                      ℹ️ Informations automatiques de la base de données :
                    </Typography>
                    <Typography variant="body2" color="info.dark">
                      • Nom scientifique : {selectedApiPlant.scientific_name}<br/>
                      • Cycle de vie : {selectedApiPlant.cycle || 'Non spécifié'}<br/>
                      • Besoins en eau : {selectedApiPlant.watering || 'Standards'}<br/>
                      • Tous les autres paramètres sont configurés automatiquement
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading || updateMutation.isLoading || (!selectedApiPlant && !editingPlant)}
            >
              {createMutation.isLoading || updateMutation.isLoading ? (
                <CircularProgress size={20} />
              ) : editingPlant ? (
                'Modifier'
              ) : (
                'Créer'
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
            Cette action est irréversible.
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

export default Plants;