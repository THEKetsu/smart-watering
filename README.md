# 🌱 Smart Watering - Système d'Arrosage Intelligent

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://docker.com)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://postgresql.org)

> Système complet d'arrosage automatique intelligent basé sur l'IA météorologique et les besoins spécifiques des plantes.

## 🚀 Fonctionnalités

### 🧠 Intelligence Artificielle
- **Algorithme adaptatif** : Ajustement automatique selon conditions météo
- **Prédiction météorologique** : Intégration OpenWeatherMap 7 jours
- **Facteurs saisonniers** : Adaptation aux cycles naturels des plantes
- **Score de confiance** : Évaluation de la fiabilité des recommandations
- **Apprentissage continu** : Amélioration basée sur l'historique

### 🌿 Gestion des Plantes
- **6 types supportés** : Succulente, tropicale, méditerranéenne, tempérée, désert, aquatique
- **Paramètres personnalisables** : Fréquence, quantité, seuils de température/humidité
- **Multiplicateurs saisonniers** : Adaptation fine selon les saisons
- **Historique complet** : Suivi des arrosages et performances

### 📊 Interface Moderne
- **Dashboard interactif** : Visualisation temps réel avec graphiques
- **Responsive design** : Compatible mobile/desktop
- **Thème nature** : Design inspiré du jardinage
- **Gestion intuitive** : CRUD complet avec validation avancée

### 🏗️ Architecture Conteneurisée
- **Docker & Docker Compose** : Déploiement en un clic
- **Microservices** : Séparation frontend/backend/base de données
- **Scalabilité** : Prêt pour la production
- **Monitoring optionnel** : Prometheus/Grafana intégrés

## 📋 Prérequis

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Clé API OpenWeatherMap** (gratuite)
- **4GB RAM** minimum
- **Ports libres** : 3000, 3001, 5432

## ⚡ Installation Rapide

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/smart-watering
cd smart-watering

# 2. Configuration initiale
make install

# 3. Configurer la clé API dans .env
OPENWEATHER_API_KEY=votre_cle_api_ici

# 4. Déploiement complet
make deploy

# 5. Accéder à l'application
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

## 🛠️ Commandes Utiles

```bash
# Gestion des services
make start          # Démarrer tous les services
make stop           # Arrêter tous les services  
make restart        # Redémarrer tous les services
make status         # Statut des conteneurs

# Développement
make dev            # Mode développement (sans Docker)
make logs           # Voir tous les logs
make health         # Vérifier la santé des services

# Maintenance
make backup         # Sauvegarde complète
make restore FILE=backup.sql.gz  # Restauration
make clean          # Nettoyage complet

# Tests et qualité
make test           # Lancer les tests
make lint           # Vérification du code
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   React + TS    │◄──►│   Node.js + TS  │◄──►│   PostgreSQL    │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   Redis Cache   │              │
         └──────────────┤   Port: 6379    ├──────────────┘
                        └─────────────────┘
                                │
                    ┌─────────────────┐
                    │ OpenWeatherMap  │
                    │      API        │
                    └─────────────────┘
```

### Stack Technologique

**Frontend**
- React 18 avec TypeScript
- Material-UI pour l'interface
- React Query pour l'état serveur
- Recharts pour les graphiques
- React Hook Form + Yup validation

**Backend**
- Node.js 18 avec TypeScript
- Express.js + TypeORM
- Cron jobs automatisés
- Architecture modulaire
- API RESTful complète

**Base de données**
- PostgreSQL 15
- Migrations automatiques
- Index optimisés
- Vues statistiques précalculées

**Infrastructure**
- Docker & Docker Compose
- Nginx reverse proxy
- Monitoring Prometheus/Grafana
- Sauvegardes automatisées

## 📊 Algorithme Intelligent

### Facteurs de Décision

```typescript
const recommendation = WateringAlgorithm.calculateWateringRecommendation(
  plant,           // Caractéristiques spécifiques
  weatherData,     // Données météo actuelles + prévisions
  lastWatering,    // Historique d'arrosage
  forecastDays     // Horizon de prévision (3-5 jours)
);
```

### Logique d'Adaptation

1. **Analyse des besoins de base** : Fréquence et quantité selon le type de plante
2. **Facteur saisonnier** : Multiplication selon la saison (hiver: 0.5x, été: 1.5x)
3. **Conditions météorologiques** :
   - Température > 30°C → +30% d'eau
   - Humidité < 40% → +20% d'eau
   - Pluie prévue → Report d'arrosage
4. **Historique** : Ajustement selon les arrosages précédents
5. **Score de confiance** : Évaluation de la fiabilité (0-1)

### Exemples de Comportement

**🌧️ Pluie prévue** : "Pluie prévue dans 2 jours (8mm) - Arrosage reporté"

**🔥 Canicule** : "Température élevée (35°C) + Air sec (25%) → 400ml au lieu de 250ml"

**❄️ Hiver** : "Saison hivernale → Quantité réduite à 125ml (×0.5)"

## 🔧 Configuration Avancée

### Variables d'Environnement

```bash
# API Météo (OBLIGATOIRE)
OPENWEATHER_API_KEY=votre_cle_api

# Base de données
DB_HOST=database
DB_PORT=5432
DB_NAME=smart_watering
DB_USER=postgres
DB_PASSWORD=mot_de_passe_securise

# Sécurité
JWT_SECRET=cle_secrete_jwt
CORS_ORIGIN=http://localhost:3000

# Cache Redis (optionnel)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=mot_de_passe_redis
```

### Profils de Déploiement

```bash
# Développement (services de base)
make deploy

# Production (avec reverse proxy)
make deploy-prod

# Monitoring (avec Prometheus/Grafana)
make deploy-monitoring
```

### Configuration des Plantes

```typescript
interface PlantConfig {
  name: string;
  type: PlantType;                    // Type de plante
  baseWateringFrequencyDays: number;  // Fréquence de base (jours)
  baseWaterAmountMl: number;          // Quantité de base (ml)
  
  // Multiplicateurs saisonniers
  springMultiplier: number;           // Printemps (1.2)
  summerMultiplier: number;           // Été (1.5)  
  autumnMultiplier: number;           // Automne (0.8)
  winterMultiplier: number;           // Hiver (0.5)
  
  // Seuils environnementaux
  minTemperature: number;             // Temp minimale (°C)
  maxTemperature: number;             // Temp maximale (°C)
  idealHumidity: number;              // Humidité idéale (%)
  rainThresholdMm: number;            // Seuil pluie pour annuler (mm)
}
```

## 📊 API Documentation

### Endpoints Principaux

```bash
# Plantes
GET    /api/plants                    # Liste des plantes
POST   /api/plants                    # Créer une plante
GET    /api/plants/:id                # Détails d'une plante
PUT    /api/plants/:id                # Modifier une plante
DELETE /api/plants/:id                # Supprimer une plante

# Planning d'arrosage
GET    /api/schedules/today           # Planning du jour
GET    /api/schedules/pending         # Arrosages en attente
POST   /api/schedules/generate        # Générer le planning
PATCH  /api/schedules/:id/complete    # Marquer comme terminé
PATCH  /api/schedules/:id/skip        # Ignorer un arrosage

# Météo
GET    /api/weather/current           # Conditions actuelles
GET    /api/weather/forecast          # Prévisions 7 jours
POST   /api/weather/update            # Mise à jour forcée
GET    /api/weather/stats             # Statistiques météo
```

### Exemples de Requêtes

```bash
# Créer une plante
curl -X POST http://localhost:3001/api/plants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monstera",
    "type": "tropical",
    "baseWateringFrequencyDays": 7,
    "baseWaterAmountMl": 300
  }'

# Générer le planning du jour
curl -X POST http://localhost:3001/api/schedules/generate

# Marquer un arrosage comme terminé
curl -X PATCH http://localhost:3001/api/schedules/abc123/complete \
  -H "Content-Type: application/json" \
  -d '{"actualAmount": 280, "notes": "Plante en bonne santé"}'
```

## 🔐 Sécurité

### Mesures Implémentées

- **Validation stricte** : Tous les inputs validés avec Joi
- **Sanitization** : Protection contre injections SQL/XSS
- **CORS configuré** : Origines autorisées uniquement
- **Rate limiting** : Protection contre abus API
- **Conteneurs non-root** : Sécurité renforcée Docker
- **Variables sensibles** : Stockage sécurisé dans .env

### Production

```bash
# HTTPS avec certificats SSL
# Reverse proxy Nginx
# Firewall conteneurisé
# Logs centralisés
# Monitoring sécurisé
```

## 🚀 Déploiement Production

### Serveur VPS/Cloud

```bash
# 1. Préparation serveur
sudo apt update && sudo apt install docker.io docker-compose-plugin

# 2. Cloner et configurer
git clone https://repo.git && cd smart-watering
cp .env.example .env
# Éditer .env avec vos vraies configurations

# 3. Déploiement production
make deploy-prod

# 4. Configuration domaine + SSL
# Configurer DNS vers votre serveur
# Certificats SSL automatiques avec Certbot
```

### Monitoring

```bash
# Déploiement avec monitoring
make deploy-monitoring

# Accès aux interfaces
# Grafana:    http://votre-domaine:3001
# Prometheus: http://votre-domaine:9090
```

## 📱 Évolutions Futures

### Roadmap 2024

- [ ] **Application mobile** React Native
- [ ] **Notifications push** PWA + push notifications
- [ ] **API vocale** Intégration assistants vocaux
- [ ] **IoT sensors** Capteurs d'humidité du sol
- [ ] **Multi-utilisateurs** Gestion des comptes
- [ ] **API publique** Documentation OpenAPI
- [ ] **Machine Learning** Amélioration algorithme IA

### Contributions

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **OpenWeatherMap** pour les données météorologiques gratuites
- **Material-UI** pour les composants React magnifiques
- **TypeScript** pour la robustesse du code
- **Docker** pour la simplicité de déploiement
- **PostgreSQL** pour la fiabilité des données

---

<div align="center">

**🌱 Développé avec ❤️ pour un jardinage plus intelligent 🌱**

[Documentation](docs/) • [Issues](issues/) • [Discussions](discussions/)

</div>