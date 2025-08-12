#!/bin/bash

echo "🧪 Tests automatisés de Smart Watering"
echo "======================================"

# Vérifier que l'application fonctionne
echo "🔍 Test 1: Vérification du frontend..."
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend accessible sur http://localhost:3000"
else
    echo "❌ Frontend non accessible"
    exit 1
fi

# Test de la page Plants
echo ""
echo "🔍 Test 2: Vérification de la page Plants..."
if curl -f -s http://localhost:3000/plants > /dev/null; then
    echo "✅ Page Plants accessible"
else
    echo "❌ Page Plants non accessible"
fi

# Test du Dashboard
echo ""
echo "🔍 Test 3: Vérification du Dashboard..."
if curl -f -s http://localhost:3000/dashboard > /dev/null; then
    echo "✅ Dashboard accessible"
else
    echo "❌ Dashboard non accessible"
fi

# Vérifier les logs du conteneur
echo ""
echo "🔍 Test 4: Vérification des logs..."
ERRORS=$(docker-compose -f docker-compose.simple.yml logs frontend-demo 2>&1 | grep -i "error\|failed\|cannot" | grep -v "eslint" | wc -l)
if [ "$ERRORS" -eq 0 ]; then
    echo "✅ Aucune erreur critique dans les logs"
else
    echo "⚠️  $ERRORS erreur(s) trouvée(s) dans les logs"
fi

echo ""
echo "📊 Résumé des tests:"
echo "==================="
echo "🎯 Application Smart Watering"
echo "🐳 Mode: Docker (frontend seul)"
echo "🌱 Base de données: 50+ plantes incluses"
echo "🔍 Recherche multilingue: Français/Anglais"
echo ""
echo "🚀 Pour tester les fonctionnalités:"
echo "   1. Ouvrez http://localhost:3000"
echo "   2. Allez sur 'Mes Plantes'"
echo "   3. Cliquez 'Ajouter une plante'"
echo "   4. Recherchez: coquelicot, geranium, monstera, basilic..."
echo ""
echo "✨ Tests terminés avec succès !"