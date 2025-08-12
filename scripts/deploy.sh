#!/bin/bash

# Smart Watering - Script de déploiement
# Ce script automatise le déploiement de l'application complète

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="smart-watering"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        if [ -f ".env.example" ]; then
            log_warning "Fichier .env manquant, copie depuis .env.example"
            cp .env.example .env
            log_warning "⚠️  Pensez à configurer vos variables d'environnement dans .env"
        else
            log_error "Fichier .env requis"
            exit 1
        fi
    fi
    
    log_success "Prérequis validés"
}

# Configuration de l'environnement
setup_environment() {
    log_info "Configuration de l'environnement..."
    
    # Créer les dossiers nécessaires
    mkdir -p logs/{nginx,app}
    mkdir -p backups
    mkdir -p monitoring
    
    # Vérifier la clé API météo
    if ! grep -q "^OPENWEATHER_API_KEY=" .env || grep -q "your_openweather_api_key" .env; then
        log_warning "⚠️  Clé API OpenWeatherMap non configurée"
        log_warning "Obtenez votre clé gratuite sur: https://openweathermap.org/api"
    fi
    
    log_success "Environnement configuré"
}

# Construction des images
build_images() {
    log_info "Construction des images Docker..."
    
    if command -v docker-compose &> /dev/null; then
        docker-compose build --no-cache
    else
        docker compose build --no-cache
    fi
    
    log_success "Images construites avec succès"
}

# Démarrage des services
start_services() {
    local profile=${1:-""}
    log_info "Démarrage des services..."
    
    if [ -n "$profile" ]; then
        log_info "Utilisation du profil: $profile"
        if command -v docker-compose &> /dev/null; then
            docker-compose --profile "$profile" up -d
        else
            docker compose --profile "$profile" up -d
        fi
    else
        if command -v docker-compose &> /dev/null; then
            docker-compose up -d
        else
            docker compose up -d
        fi
    fi
    
    log_success "Services démarrés"
}

# Vérification de la santé des services
check_health() {
    log_info "Vérification de la santé des services..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log_info "Tentative $attempt/$max_attempts..."
        
        # Vérifier la base de données
        if docker-compose exec -T database pg_isready -U postgres -d smart_watering > /dev/null 2>&1; then
            log_success "✅ Base de données OK"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "❌ Base de données non accessible après $max_attempts tentatives"
            return 1
        fi
        
        sleep 5
        ((attempt++))
    done
    
    # Vérifier le backend
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3001/health > /dev/null 2>&1; then
            log_success "✅ Backend API OK"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "❌ Backend API non accessible"
            return 1
        fi
        
        sleep 5
        ((attempt++))
    done
    
    # Vérifier le frontend
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            log_success "✅ Frontend OK"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "❌ Frontend non accessible"
            return 1
        fi
        
        sleep 5
        ((attempt++))
    done
    
    log_success "Tous les services sont opérationnels"
}

# Initialisation des données
initialize_data() {
    log_info "Initialisation des données..."
    
    # Attendre que le backend soit prêt
    sleep 10
    
    # Tenter de récupérer les données météo initiales
    if curl -f -X POST http://localhost:3001/api/weather/update > /dev/null 2>&1; then
        log_success "Données météo initialisées"
    else
        log_warning "Impossible d'initialiser les données météo (vérifiez la clé API)"
    fi
    
    log_success "Initialisation terminée"
}

# Affichage des informations de déploiement
show_deployment_info() {
    echo ""
    log_success "🌱 Smart Watering déployé avec succès!"
    echo ""
    echo "📊 URLs d'accès:"
    echo "   • Frontend:     http://localhost:3000"
    echo "   • Backend API:  http://localhost:3001"
    echo "   • Base de données: localhost:5432"
    echo ""
    echo "📝 Informations utiles:"
    echo "   • Logs:         docker-compose logs -f [service]"
    echo "   • Arrêt:        docker-compose down"
    echo "   • Redémarrage:  docker-compose restart"
    echo "   • Sauvegarde:   ./scripts/backup.sh"
    echo ""
    
    if grep -q "your_openweather_api_key" .env 2>/dev/null; then
        log_warning "⚠️  N'oubliez pas de configurer votre clé API OpenWeatherMap dans .env"
    fi
    
    echo "🎉 L'application est prête à l'emploi!"
}

# Nettoyage en cas d'erreur
cleanup_on_error() {
    log_error "Erreur détectée, nettoyage en cours..."
    if command -v docker-compose &> /dev/null; then
        docker-compose down
    else
        docker compose down
    fi
    exit 1
}

# Fonction principale
main() {
    local command=${1:-"deploy"}
    local profile=${2:-""}
    
    # Gestionnaire d'erreur
    trap cleanup_on_error ERR
    
    echo "🌱 Smart Watering - Déploiement automatisé"
    echo "========================================"
    
    case $command in
        "deploy")
            check_prerequisites
            setup_environment
            build_images
            start_services "$profile"
            check_health
            initialize_data
            show_deployment_info
            ;;
        "start")
            start_services "$profile"
            log_success "Services redémarrés"
            ;;
        "stop")
            log_info "Arrêt des services..."
            if command -v docker-compose &> /dev/null; then
                docker-compose down
            else
                docker compose down
            fi
            log_success "Services arrêtés"
            ;;
        "restart")
            log_info "Redémarrage des services..."
            if command -v docker-compose &> /dev/null; then
                docker-compose restart
            else
                docker compose restart
            fi
            log_success "Services redémarrés"
            ;;
        "logs")
            if command -v docker-compose &> /dev/null; then
                docker-compose logs -f
            else
                docker compose logs -f
            fi
            ;;
        "status")
            if command -v docker-compose &> /dev/null; then
                docker-compose ps
            else
                docker compose ps
            fi
            ;;
        "clean")
            log_warning "Suppression de tous les conteneurs et volumes..."
            read -p "Êtes-vous sûr? (y/N) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                if command -v docker-compose &> /dev/null; then
                    docker-compose down -v
                else
                    docker compose down -v
                fi
                docker system prune -f
                log_success "Nettoyage terminé"
            fi
            ;;
        "help"|*)
            echo "Usage: $0 [COMMAND] [PROFILE]"
            echo ""
            echo "Commands:"
            echo "  deploy     Déploiement complet (défaut)"
            echo "  start      Démarrer les services"
            echo "  stop       Arrêter les services"
            echo "  restart    Redémarrer les services"
            echo "  logs       Afficher les logs"
            echo "  status     Statut des services"
            echo "  clean      Nettoyage complet"
            echo "  help       Afficher cette aide"
            echo ""
            echo "Profiles (optionnel):"
            echo "  production Inclut nginx et SSL"
            echo "  monitoring Inclut Prometheus/Grafana"
            echo "  backup     Pour les sauvegardes"
            echo ""
            echo "Exemples:"
            echo "  $0 deploy production"
            echo "  $0 start monitoring"
            echo "  $0 logs"
            ;;
    esac
}

# Exécution
main "$@"