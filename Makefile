# Smart Watering - Makefile pour simplifier les commandes
# Usage: make [target]

.PHONY: help install dev build start stop restart logs status clean backup restore deploy

# Variables
COMPOSE_FILE = docker-compose.yml
ENV_FILE = .env

# Couleurs pour les messages
YELLOW := \033[1;33m
GREEN := \033[1;32m
RED := \033[1;31m
NC := \033[0m

# Target par défaut
help: ## Afficher l'aide
	@echo "$(YELLOW)🌱 Smart Watering - Commandes disponibles$(NC)"
	@echo "============================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

install: ## Installer les dépendances et configurer l'environnement
	@echo "$(YELLOW)Installation et configuration...$(NC)"
	@if [ ! -f $(ENV_FILE) ]; then \
		cp .env.example $(ENV_FILE); \
		echo "$(YELLOW)⚠️  Fichier .env créé depuis .env.example$(NC)"; \
		echo "$(YELLOW)⚠️  Pensez à configurer vos variables d'environnement$(NC)"; \
	fi
	@mkdir -p logs/{nginx,app} backups monitoring
	@chmod +x scripts/*.sh
	@echo "$(GREEN)✅ Installation terminée$(NC)"

dev: ## Démarrer en mode développement
	@echo "$(YELLOW)Démarrage en mode développement...$(NC)"
	@cd smart-watering-backend && npm install && npm run dev &
	@cd smart-watering-frontend && npm install && npm start &
	@echo "$(GREEN)✅ Mode développement démarré$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"

build: ## Construire les images Docker
	@echo "$(YELLOW)Construction des images Docker...$(NC)"
	@docker-compose build --no-cache
	@echo "$(GREEN)✅ Images construites$(NC)"

start: ## Démarrer tous les services
	@echo "$(YELLOW)Démarrage des services...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Services démarrés$(NC)"

stop: ## Arrêter tous les services
	@echo "$(YELLOW)Arrêt des services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Services arrêtés$(NC)"

restart: ## Redémarrer tous les services
	@echo "$(YELLOW)Redémarrage des services...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)✅ Services redémarrés$(NC)"

logs: ## Afficher les logs de tous les services
	@docker-compose logs -f

logs-backend: ## Afficher les logs du backend uniquement
	@docker-compose logs -f backend

logs-frontend: ## Afficher les logs du frontend uniquement
	@docker-compose logs -f frontend

logs-db: ## Afficher les logs de la base de données
	@docker-compose logs -f database

status: ## Afficher le statut des services
	@docker-compose ps

clean: ## Nettoyer les conteneurs et volumes
	@echo "$(RED)⚠️  Suppression de tous les conteneurs et volumes$(NC)"
	@read -p "Êtes-vous sûr? (y/N) " -n 1 -r; \
	echo; \
	if [ "$$REPLY" = "y" ] || [ "$$REPLY" = "Y" ]; then \
		docker-compose down -v; \
		docker system prune -f; \
		echo "$(GREEN)✅ Nettoyage terminé$(NC)"; \
	else \
		echo "Annulé"; \
	fi

backup: ## Créer une sauvegarde de la base de données
	@./scripts/backup.sh backup

restore: ## Restaurer la base de données (make restore FILE=backup.sql.gz)
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)❌ Spécifiez le fichier: make restore FILE=backup.sql.gz$(NC)"; \
		./scripts/backup.sh list; \
	else \
		./scripts/backup.sh restore $(FILE); \
	fi

deploy: ## Déploiement complet (production)
	@./scripts/deploy.sh deploy

deploy-dev: ## Déploiement en développement
	@./scripts/deploy.sh deploy

deploy-prod: ## Déploiement en production avec nginx
	@./scripts/deploy.sh deploy production

deploy-monitoring: ## Déploiement avec monitoring (Prometheus/Grafana)
	@./scripts/deploy.sh deploy monitoring

health: ## Vérifier la santé des services
	@echo "$(YELLOW)Vérification de la santé des services...$(NC)"
	@echo "Base de données:"
	@docker-compose exec database pg_isready -U postgres -d smart_watering || echo "❌ Base de données non accessible"
	@echo "Backend API:"
	@curl -f http://localhost:3001/health > /dev/null 2>&1 && echo "✅ Backend OK" || echo "❌ Backend non accessible"
	@echo "Frontend:"
	@curl -f http://localhost:3000/health > /dev/null 2>&1 && echo "✅ Frontend OK" || echo "❌ Frontend non accessible"

shell-backend: ## Ouvrir un shell dans le conteneur backend
	@docker-compose exec backend sh

shell-db: ## Ouvrir un shell dans la base de données
	@docker-compose exec database psql -U postgres -d smart_watering

test: ## Lancer les tests
	@echo "$(YELLOW)Lancement des tests...$(NC)"
	@cd smart-watering-backend && npm test
	@cd smart-watering-frontend && npm test -- --coverage --watchAll=false
	@echo "$(GREEN)✅ Tests terminés$(NC)"

lint: ## Vérifier le code (linting)
	@echo "$(YELLOW)Vérification du code...$(NC)"
	@cd smart-watering-backend && npm run lint && npm run typecheck
	@cd smart-watering-frontend && npm run lint && npm run typecheck
	@echo "$(GREEN)✅ Code vérifié$(NC)"

seed: ## Initialiser les données de test
	@echo "$(YELLOW)Initialisation des données de test...$(NC)"
	@curl -f -X POST http://localhost:3001/api/weather/update || echo "⚠️  Impossible de récupérer les données météo"
	@echo "$(GREEN)✅ Données initialisées$(NC)"

update: ## Mettre à jour les images Docker
	@echo "$(YELLOW)Mise à jour des images...$(NC)"
	@docker-compose pull
	@docker-compose build --no-cache
	@echo "$(GREEN)✅ Images mises à jour$(NC)"

# Raccourcis utiles
up: start ## Alias pour start
down: stop ## Alias pour stop
ps: status ## Alias pour status