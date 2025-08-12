# 🌱 Smart Watering Backend

Backend intelligent pour la planification d'arrosage automatique basé sur les conditions météorologiques et les besoins spécifiques des plantes.

## 🚀 Fonctionnalités

### Algorithme Intelligent
- **Adaptation météorologique** : Ajustement automatique selon pluie, température, humidité
- **Facteurs saisonniers** : Prise en compte des besoins variables selon la saison
- **Historique d'arrosage** : Analyse des arrosages précédents pour optimiser la planification
- **Prédiction de pluie** : Évite l'arrosage quand la pluie est prévue
- **Scores de confiance** : Évalue la fiabilité des recommandations

### API Complète
- **Gestion des plantes** : CRUD complet avec types, caractéristiques et paramètres personnalisables
- **Planification dynamique** : Génération automatique des horaires d'arrosage
- **Données météo** : Intégration OpenWeatherMap avec prévisions 7 jours
- **Historique** : Suivi complet des arrosages effectués
- **Statistiques** : Analyses de consommation d'eau et performances

### Architecture Moderne
- **TypeScript** : Code typé et maintenable
- **PostgreSQL** : Base de données relationnelle robuste avec TypeORM
- **Tâches automatisées** : Mise à jour météo et génération de planning via cron
- **Validation** : Schémas Joi pour sécuriser les données

## 📋 Prérequis

- Node.js ≥ 18
- PostgreSQL ≥ 13
- Clé API OpenWeatherMap

## ⚡ Installation

```bash
# Cloner le projet
cd smart-watering-backend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Construire le projet
npm run build

# Démarrer en développement
npm run dev

# Ou en production
npm start
```

## 🔧 Configuration (.env)

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_watering
DB_USER=postgres
DB_PASSWORD=your_password

# API Météo
OPENWEATHER_API_KEY=your_api_key

# Serveur
PORT=3000
NODE_ENV=development
```

## 🌐 API Endpoints

### Plantes
```
POST   /api/plants              - Créer une plante
GET    /api/plants              - Lister les plantes
GET    /api/plants/:id          - Détails d'une plante
PUT    /api/plants/:id          - Modifier une plante
DELETE /api/plants/:id          - Supprimer une plante
GET    /api/plants/:id/history  - Historique d'arrosage
GET    /api/plants/:id/schedules - Planning d'arrosage
```

### Planning
```
GET    /api/schedules                    - Lister les planifications
GET    /api/schedules/today             - Planning du jour
GET    /api/schedules/pending           - Arrosages en attente
POST   /api/schedules/generate          - Générer le planning quotidien
POST   /api/schedules/plant/:id/generate - Générer pour une plante
PATCH  /api/schedules/:id/complete      - Marquer comme terminé
PATCH  /api/schedules/:id/skip          - Ignorer un arrosage
```

### Météo
```
GET    /api/weather/current    - Météo actuelle
GET    /api/weather/forecast   - Prévisions
POST   /api/weather/update     - Mettre à jour les données météo
GET    /api/weather/stats      - Statistiques météorologiques
```

## 🤖 Algorithme d'Arrosage

L'algorithme combine plusieurs facteurs pour déterminer si un arrosage est nécessaire :

### Facteurs Principaux
- **Jours depuis dernier arrosage** vs fréquence de base de la plante
- **Conditions météo** : température, humidité, précipitations
- **Saison** : multiplicateurs selon la période de l'année
- **Prévisions** : évite l'arrosage si pluie prévue

### Calcul de Recommandation
```typescript
const recommendation = WateringAlgorithm.calculateWateringRecommendation(
  plant,           // Caractéristiques de la plante
  weatherData,     // Données météo actuelles et prévisions
  lastWatering,    // Dernier arrosage effectué
  forecastDays     // Nombre de jours de prévision à considérer
);

// Retourne:
// - shouldWater: boolean
// - waterAmountMl: number 
// - confidence: number (0-1)
// - reason: string
// - nextWateringDate?: Date
```

### Exemples de Logique

**Arrosage urgent** : Plus de 3 jours de retard → Arrosage immédiat avec quantité augmentée

**Pluie prévue** : Si pluie > seuil dans les 3 jours → Report d'arrosage

**Conditions extrêmes** : Température > 30°C + Humidité < 40% → Quantité d'eau augmentée

## 🔄 Automatisation

### Tâches Cron Programmées
- **6h00 quotidien** : Génération du planning d'arrosage
- **8h00 et 20h00** : Mise à jour des données météo
- **2h00 dimanche** : Nettoyage des anciennes données

## 📊 Types de Plantes Supportés

```typescript
enum PlantType {
  SUCCULENT = 'succulent',        // Faibles besoins en eau
  TROPICAL = 'tropical',          // Besoins élevés, humidité importante
  MEDITERRANEAN = 'mediterranean', // Résistant à la sécheresse
  TEMPERATE = 'temperate',        // Besoins modérés
  DESERT = 'desert',              // Très faibles besoins
  AQUATIC = 'aquatic'             // Besoins constants élevés
}
```

## 🔗 Intégration Frontend

### React/Next.js
```typescript
// Service API
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Récupérer le planning du jour
const todaySchedule = await api.get('/schedules/today');

// Créer une plante
const newPlant = await api.post('/plants', {
  name: 'Monstera',
  type: 'tropical',
  baseWateringFrequencyDays: 7,
  baseWaterAmountMl: 300
});
```

### React Native
```typescript
// Hook personnalisé pour les données
const usePlants = () => {
  const [plants, setPlants] = useState([]);
  
  useEffect(() => {
    api.get('/plants').then(res => setPlants(res.data.data));
  }, []);
  
  return plants;
};
```

## 🧪 Tests

```bash
npm test           # Lancer les tests
npm run test:watch # Tests en mode watch
```

## 📈 Performance

- **Caching** : Données météo mises en cache pour éviter les appels API excessifs
- **Indexation DB** : Index sur les dates et IDs pour requêtes rapides
- **Nettoyage automatique** : Suppression des anciennes données
- **Pagination** : Toutes les listes sont paginées par défaut

## 🔒 Sécurité

- **Validation** : Tous les inputs sont validés avec Joi
- **Sanitization** : Protection contre les injections
- **Error Handling** : Gestion centralisée des erreurs
- **CORS** : Configuration appropriée pour l'origine

---

🌱 **Prêt pour faire pousser votre jardin intelligent !**