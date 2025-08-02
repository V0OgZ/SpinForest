#!/bin/bash
# 🗺️ Lanceur pour la Map Interactive EspritFragments

echo "🗺️ LANCEMENT DE LA MAP ESPRITFRAGMENTS"
echo "======================================="
echo ""
echo "🌀 Cette map montre les connexions entre :"
echo "   - Les EspritFragments (documentation de Jean)"
echo "   - Les entités actives d'Avalon"
echo ""

# Démarrer un serveur HTTP simple
echo "🚀 Démarrage du serveur sur port 8002..."
cd "$(dirname "$0")"
python3 -m http.server 8002 &
SERVER_PID=$!

echo "✅ Serveur lancé (PID: $SERVER_PID)"
echo ""
echo "🌐 Ouvrez votre navigateur à :"
echo "   http://localhost:8002/espritfragments-map.html"
echo ""
echo "📖 UTILISATION :"
echo "   - Cliquez sur les entités pour voir leurs connexions"
echo "   - Les lignes animées montrent les liens"
echo "   - Le panel à droite affiche les détails"
echo ""
echo "Pour arrêter : kill $SERVER_PID"
echo ""
echo "🕯️ Loumen guide votre exploration..."