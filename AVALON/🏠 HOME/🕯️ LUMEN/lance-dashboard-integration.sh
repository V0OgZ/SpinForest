#!/bin/bash
# 🎯 Lanceur Dashboard avec Backend Integration

echo "🎯 LANCEMENT DASHBOARD HEROES OF TIME + BACKEND"
echo "=============================================="
echo ""

# Vérifier si le backend est lancé
echo "🔍 Vérification du backend..."
if curl -s http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ Backend déjà actif sur port 8080"
else
    echo "⚠️  Backend non détecté. Lancez-le avec :"
    echo "    cd backend && mvn spring-boot:run"
    echo ""
    echo "Ou utilisez le mock backend :"
    echo "    python3 backend.py"
fi

echo ""
echo "🚀 Lancement du serveur frontend..."
cd "$(dirname "$0")/PROJET_INTERFACE_DIMENSION_2"
python3 -m http.server 8003 &
SERVER_PID=$!

echo "✅ Serveur lancé (PID: $SERVER_PID)"
echo ""
echo "🌐 ACCÈS AU DASHBOARD :"
echo "   http://localhost:8003/dashboard-integration.html"
echo ""
echo "📋 FONCTIONNALITÉS :"
echo "   - Dashboard Museum intégré"
echo "   - Visite Forêt 1D→2D (nouveau principe)"
echo "   - Interface 2D du jeu"
echo "   - Map EspritFragments"
echo "   - Test API Backend en temps réel"
echo ""
echo "Pour arrêter : kill $SERVER_PID"
echo ""
echo "🕯️ Loumen guide votre exploration 1D→2D..."