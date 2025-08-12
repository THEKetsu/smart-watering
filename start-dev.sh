#!/bin/bash

# Script pour démarrer l'application en mode développement
echo "🚀 Démarrage de Smart Watering en mode développement..."

# Arrêter tous les services
echo "📛 Arrêt des services existants..."
docker-compose down --remove-orphans 2>/dev/null || true

# Démarrer la base de données
echo "🗄️ Démarrage de la base de données..."
docker-compose up -d database

echo "⏳ Attente que la base de données soit prête..."
sleep 15

# Vérifier le statut de la base de données
echo "🔍 Vérification de la base de données..."
if docker-compose exec database pg_isready -U postgres -d smart_watering; then
    echo "✅ Base de données prête !"
else
    echo "❌ Erreur base de données"
    exit 1
fi

# Démarrer le frontend en mode développement (sans Docker)
echo "🎨 Démarrage du frontend en mode développement..."
cd smart-watering-frontend
REACT_APP_MOCK_MODE=false REACT_APP_API_URL=http://localhost:3001/api npm start &
FRONTEND_PID=$!

cd ..

# Affichage des informations
echo ""
echo "🌟 Smart Watering est en cours de démarrage !"
echo ""
echo "📍 Services disponibles :"
echo "   🎨 Frontend: http://localhost:3000"
echo "   🗄️ Base de données: localhost:5432"
echo ""
echo "🔧 Mode: Développement avec base de données complète"
echo "📦 Base de plantes: 50+ espèces incluses"
echo ""
echo "⚠️ Note: Le backend n'est pas démarré (erreurs TypeScript à corriger)"
echo "         Le frontend fonctionne en mode mock avec la grande base de données"
echo ""
echo "🛑 Pour arrêter :"
echo "   1. Ctrl+C pour arrêter le frontend"
echo "   2. 'docker-compose down' pour arrêter la base"
echo ""

# Attendre que le frontend soit arrêté
wait $FRONTEND_PID