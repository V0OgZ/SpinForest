#!/bin/bash
# 🚀 SCRIPT LANCE DÉMO - Super simple pour Vincent !

echo "🌟 LANCEMENT DÉMO AVALON DIMENSION 2"
echo "===================================="
echo ""

# Tuer les anciens processus
echo "🔧 Nettoyage des anciens processus..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:8001 | xargs kill -9 2>/dev/null || true

# Aller dans le bon dossier
cd "$(dirname "$0")"

# Lancer le backend
echo "🎮 Lancement du backend (port 8080)..."
python3 backend.py &
BACKEND_PID=$!

# Lancer l'interface
echo "🌐 Lancement de l'interface (port 8001)..."
python3 -m http.server 8001 &
FRONTEND_PID=$!

# Attendre un peu
sleep 3

# Vérifier que tout marche
echo ""
echo "✅ VÉRIFICATION DES SERVICES:"
echo "----------------------------"
curl -s http://localhost:8080/api/health > /dev/null && echo "✅ Backend: OK" || echo "❌ Backend: ERREUR"
curl -s http://localhost:8001 > /dev/null && echo "✅ Interface: OK" || echo "❌ Interface: ERREUR"

echo ""
echo "🎯 TOUT EST PRÊT !"
echo "=================="
echo ""
echo "👉 Ouvre ton navigateur sur: http://localhost:8001"
echo ""
echo "📋 POUR JOUER:"
echo "1. Clique sur '🔌 CONNECTER BACKEND'"
echo "2. Choisis un scénario dans le menu AUTO-PLAY"
echo "3. Clique sur '▶️ JOUER AUTO'"
echo ""
echo "⏹️  Pour arrêter: Ctrl+C ou ferme ce terminal"
echo ""
echo "🛋️ Profite du spectacle Vincent !"
echo ""

# Attendre
wait $BACKEND_PID $FRONTEND_PID