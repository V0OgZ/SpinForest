#!/bin/bash

# 🎳 LANCEUR DU GUIDE GAMEPLAY DUDE
# "Hey man, let me show you how to play..."

echo "🎳 ======================================= 🎳"
echo "    GUIDE DE GAMEPLAY - VERSION DUDE"
echo "🎳 ======================================= 🎳"
echo
echo "Le Dude dit : 'Just launching the guide, man...'"
echo

# Port pour le guide
PORT=8888

# Lancer le serveur
echo "🥃 Ouverture du guide sur http://localhost:$PORT"
echo "   (Ctrl+C pour arrêter)"
echo

# Ouvrir directement sur le guide
if command -v open &> /dev/null; then
    sleep 2
    open "http://localhost:$PORT/guide-gameplay-visuel.html"
elif command -v xdg-open &> /dev/null; then
    sleep 2
    xdg-open "http://localhost:$PORT/guide-gameplay-visuel.html"
fi

# Serveur Python
cd "$(dirname "$0")"
python3 -m http.server $PORT