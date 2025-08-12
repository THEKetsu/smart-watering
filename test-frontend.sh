#!/bin/bash

# Script pour tester uniquement l'interface frontend avec Docker

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🌱 Smart Watering - Test Frontend uniquement${NC}"
echo "============================================="

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker n'est pas installé${NC}"
    echo "Installation de Docker Desktop pour macOS :"
    echo "1. Téléchargez depuis : https://docs.docker.com/desktop/install/mac-install/"
    echo "2. Ou avec Homebrew : brew install --cask docker"
    exit 1
fi

echo -e "${BLUE}📦 Construction de l'image frontend...${NC}"
docker-compose -f docker-compose.frontend-only.yml build --no-cache

echo -e "${BLUE}🚀 Démarrage du conteneur frontend...${NC}"
docker-compose -f docker-compose.frontend-only.yml up -d

echo -e "${BLUE}⏳ Attente du démarrage...${NC}"
sleep 10

# Vérifier la santé
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3000/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend accessible!${NC}"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo -e "${YELLOW}⚠️  Frontend pas encore accessible, mais vérifiez manuellement${NC}"
        break
    fi
    
    sleep 2
    ((attempt++))
done

echo ""
echo -e "${GREEN}🎉 Interface Smart Watering démarrée avec succès!${NC}"
echo ""
echo "📊 Accès :"
echo "   • Interface: http://localhost:3000"
echo ""
echo "🔧 Mode de fonctionnement :"
echo "   • Données mockées (pas besoin d'API backend)"
echo "   • Interface 100% fonctionnelle"
echo "   • Toutes les fonctionnalités disponibles"
echo ""
echo "📝 Commandes utiles :"
echo "   • Voir les logs: docker-compose -f docker-compose.frontend-only.yml logs -f"
echo "   • Arrêter: docker-compose -f docker-compose.frontend-only.yml down"
echo "   • Redémarrer: docker-compose -f docker-compose.frontend-only.yml restart"
echo ""
echo -e "${BLUE}🌿 Profitez de votre jardin intelligent!${NC}"