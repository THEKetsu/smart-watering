#!/bin/bash

# Smart Watering - Script de sauvegarde automatisée
# Sauvegarde la base de données et les fichiers de configuration

set -e

# Configuration
BACKUP_DIR="./backups"
DB_NAME="smart_watering"
DB_USER="postgres"
DB_HOST="database"
CONTAINER_NAME="smart-watering-db"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${YELLOW}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Créer le dossier de sauvegarde
mkdir -p "$BACKUP_DIR"

# Nom du fichier de sauvegarde avec timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/smart_watering_backup_$TIMESTAMP.sql"
CONFIG_BACKUP="$BACKUP_DIR/config_backup_$TIMESTAMP.tar.gz"

# Fonction de sauvegarde de la base de données
backup_database() {
    log_info "Sauvegarde de la base de données..."
    
    if docker ps | grep -q "$CONTAINER_NAME"; then
        docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists > "$BACKUP_FILE"
        
        if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
            # Compresser la sauvegarde
            gzip "$BACKUP_FILE"
            log_success "Base de données sauvegardée: ${BACKUP_FILE}.gz"
        else
            log_error "Erreur lors de la sauvegarde de la base de données"
            return 1
        fi
    else
        log_error "Conteneur de base de données non trouvé"
        return 1
    fi
}

# Fonction de sauvegarde des configurations
backup_configs() {
    log_info "Sauvegarde des configurations..."
    
    tar -czf "$CONFIG_BACKUP" \
        --exclude="node_modules" \
        --exclude="dist" \
        --exclude="build" \
        --exclude=".git" \
        --exclude="backups" \
        .env docker-compose.yml nginx/ database/ scripts/ 2>/dev/null || true
    
    if [ -f "$CONFIG_BACKUP" ]; then
        log_success "Configurations sauvegardées: $CONFIG_BACKUP"
    else
        log_error "Erreur lors de la sauvegarde des configurations"
        return 1
    fi
}

# Fonction de nettoyage des anciennes sauvegardes
cleanup_old_backups() {
    log_info "Nettoyage des anciennes sauvegardes (> 30 jours)..."
    
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete 2>/dev/null || true
    
    log_success "Anciennes sauvegardes supprimées"
}

# Fonction de restauration
restore_database() {
    local backup_file=$1
    
    if [ ! -f "$backup_file" ]; then
        log_error "Fichier de sauvegarde non trouvé: $backup_file"
        return 1
    fi
    
    log_info "Restauration de la base de données depuis: $backup_file"
    
    # Décompresser si nécessaire
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME"
    else
        docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$backup_file"
    fi
    
    log_success "Base de données restaurée avec succès"
}

# Fonction principale
main() {
    local command=${1:-"backup"}
    
    case $command in
        "backup")
            echo "🌱 Smart Watering - Sauvegarde automatisée"
            echo "=========================================="
            
            backup_database
            backup_configs
            cleanup_old_backups
            
            echo ""
            log_success "Sauvegarde terminée avec succès!"
            echo "📁 Fichiers créés:"
            echo "   • ${BACKUP_FILE}.gz"
            echo "   • $CONFIG_BACKUP"
            ;;
            
        "restore")
            local backup_file=$2
            if [ -z "$backup_file" ]; then
                echo "Usage: $0 restore <fichier_sauvegarde>"
                echo ""
                echo "Sauvegardes disponibles:"
                ls -la "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "Aucune sauvegarde trouvée"
                exit 1
            fi
            restore_database "$backup_file"
            ;;
            
        "list")
            echo "Sauvegardes disponibles dans $BACKUP_DIR:"
            ls -la "$BACKUP_DIR" 2>/dev/null || echo "Aucune sauvegarde trouvée"
            ;;
            
        "help"|*)
            echo "Usage: $0 [COMMAND]"
            echo ""
            echo "Commands:"
            echo "  backup              Créer une sauvegarde (défaut)"
            echo "  restore <fichier>   Restaurer depuis une sauvegarde"
            echo "  list               Lister les sauvegardes"
            echo "  help               Afficher cette aide"
            echo ""
            echo "Exemples:"
            echo "  $0 backup"
            echo "  $0 restore backups/smart_watering_backup_20241201_120000.sql.gz"
            echo "  $0 list"
            ;;
    esac
}

# Exécution
main "$@"