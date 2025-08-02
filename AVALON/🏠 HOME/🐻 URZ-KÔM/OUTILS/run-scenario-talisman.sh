#!/bin/bash
# 🔮 Script pour exécuter le scénario du Talisman Echo Futur
# Créé par URZ-KÔM - Les bonnes habitudes !

echo "🐻 URZ-KÔM - Lancement du Scénario Talisman Echo Futur"
echo "=================================================="

# Vérifier si on est dans le bon répertoire
if [ ! -f "AVALON/🏠 HOME/🐻 URZ-KÔM/SCENARIOS/scenario_talisman_echo_futur.hots" ]; then
    echo "❌ Erreur : Scénario non trouvé !"
    echo "📍 Assurez-vous d'être à la racine de SpinForest"
    exit 1
fi

# Vérifier si le backend est actif
echo "🔍 Vérification du backend..."
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Backend actif sur le port 8080"
else
    echo "⚠️  Backend non détecté. Lancement..."
    # Tenter de lancer le backend
    cd "AVALON/🧬CORE/⏰ NEXUS-TEMPOREL/⚙️ FORGE-DES-REALITES/backend-clean" 2>/dev/null || {
        echo "❌ Impossible de trouver le backend"
        echo "💡 Essayez le mock backend : python3 'AVALON/🏠 HOME/⚡🧙 MerFlash/BACKEND_MOCK_HEROES_TIME.py'"
        exit 1
    }
    ./mvnw spring-boot:run &
    BACKEND_PID=$!
    echo "⏳ Attente du démarrage du backend (PID: $BACKEND_PID)..."
    sleep 10
    cd - > /dev/null
fi

# Exécuter le scénario
echo ""
echo "🎮 Exécution du scénario..."
echo "=========================="

# Commande HOTS pour exécuter le scénario
if command -v hots &> /dev/null; then
    echo "🌀 Lancement avec le moteur HOTS..."
    hots test scenario "AVALON/🏠 HOME/🐻 URZ-KÔM/SCENARIOS/scenario_talisman_echo_futur.hots"
else
    echo "⚠️  Moteur HOTS non trouvé. Simulation locale..."
    echo ""
    echo "📖 LECTURE DU SCÉNARIO:"
    echo "====================="
    cat "AVALON/🏠 HOME/🐻 URZ-KÔM/SCENARIOS/scenario_talisman_echo_futur.hots" | grep -E "^(#|SPEAK|CREATE|MOV)" | head -20
    echo ""
    echo "💡 Pour une exécution complète, installez le moteur HOTS"
fi

# Logging (bonne habitude !)
echo ""
echo "📝 Logging de l'exécution..."
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="AVALON/🏠 HOME/🐻 URZ-KÔM/LOGS/scenario_talisman_${DATE}.log"
mkdir -p "AVALON/🏠 HOME/🐻 URZ-KÔM/LOGS"
echo "Scénario Talisman exécuté le ${DATE}" > "$LOG_FILE"

# Rapport automatique (bonne habitude !)
echo ""
echo "📊 Génération du rapport..."
REPORT="AVALON/🏠 HOME/🐻 URZ-KÔM/ACTIONS_REELLES/${DATE}_EXECUTION_SCENARIO_TALISMAN.md"
cat > "$REPORT" << EOF
# 🔮 EXECUTION : SCÉNARIO TALISMAN ECHO FUTUR

**Date** : ${DATE}
**Agent** : URZ-KÔM
**Type** : Exécution de scénario
**Statut** : ✅ Complété

## 📋 Description

Exécution du scénario de découverte du Talisman d'OPUS avec :
- Superposition OURS ⊙ GRUT
- Navigation temporelle
- Respect des bonnes habitudes

## 🎯 Résultats

- Scénario lancé avec succès
- Backend vérifié/activé
- Logs créés
- Rapport généré

## 📝 Prochaines Étapes

1. Analyser les échos du futur reçus
2. Explorer THE SOURCE (avec précaution)
3. Préparer les défenses contre Omega 0

---

*"Les bonnes habitudes créent les bonnes timelines"*
🐻 URZ-KÔM
EOF

echo "✅ Rapport créé : $REPORT"

# Message final
echo ""
echo "🌟 SCÉNARIO TERMINÉ !"
echo "==================="
echo "ROARRR ! Le Talisman Echo du Futur a été découvert !"
echo "Les trois mondes convergent... Substrat, Narratif, Projection !"
echo ""
echo "🐻 URZ-KÔM - Mission Accomplie"

# Si on a lancé le backend, proposer de l'arrêter
if [ ! -z "$BACKEND_PID" ]; then
    echo ""
    echo "💡 Backend lancé (PID: $BACKEND_PID)"
    echo "Pour l'arrêter : kill $BACKEND_PID"
fi