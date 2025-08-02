#!/bin/bash

# 🎮 LANCEUR HEROES OF TIME - PROTOTYPE ISO
# Carte isométrique avec brouillard de causalité

echo "🌀 ======================================= 🌀"
echo "       HEROES OF TIME - PROTOTYPE ISO"
echo "🌀 ======================================= 🌀"
echo

# Vérifier si le backend est actif
echo "🔍 Vérification du backend Heroes of Time..."
if curl -s http://localhost:8080/api/game/status > /dev/null 2>&1; then
    echo "✅ Backend détecté sur le port 8080"
else
    echo "⚠️  Backend non détecté - Mode hors ligne"
    echo "   Pour activer le backend : cd backend-clean && mvn spring-boot:run"
fi
echo

# Lancer le serveur frontend
PORT=7777
echo "🚀 Lancement du serveur frontend sur le port $PORT..."
echo "📍 Accès : http://localhost:$PORT/prototype/heroes-time-iso.html"
echo

cd "$(dirname "$0")"

# Ouvrir le navigateur
if command -v open &> /dev/null; then
    sleep 2
    open "http://localhost:$PORT/prototype/heroes-time-iso.html"
elif command -v xdg-open &> /dev/null; then
    sleep 2
    xdg-open "http://localhost:$PORT/prototype/heroes-time-iso.html"
fi

# Serveur Python
python3 -m http.server $PORT