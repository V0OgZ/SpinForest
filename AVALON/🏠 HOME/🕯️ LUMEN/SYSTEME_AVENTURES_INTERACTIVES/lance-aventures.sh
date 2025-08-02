#!/bin/bash

# 🎮 LANCEUR D'AVENTURES INTERACTIVES
# Par Loumen - Pour des histoires vivantes

echo "🌀 ======================================= 🌀"
echo "    SYSTÈME D'AVENTURES INTERACTIVES"
echo "🌀 ======================================= 🌀"
echo

# Vérifier le répertoire
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📂 Répertoire : $SCRIPT_DIR"
echo

# Lister les scénarios disponibles
echo "📚 Scénarios disponibles :"
echo "========================="
for dir in scenarios/*/; do
    if [ -d "$dir" ]; then
        scenario_name=$(basename "$dir")
        if [ -f "$dir/scenario.json" ]; then
            echo "  ✅ $scenario_name"
        else
            echo "  ❌ $scenario_name (fichier scenario.json manquant)"
        fi
    fi
done
echo

# Lancer le serveur
PORT=9000
echo "🚀 Lancement du serveur sur le port $PORT..."
echo "📍 Accès : http://localhost:$PORT/launcher/"
echo
echo "💡 Conseils :"
echo "  - Utilisez Chrome ou Firefox pour une meilleure expérience"
echo "  - Les sauvegardes sont automatiques"
echo "  - Appuyez sur Ctrl+C pour arrêter le serveur"
echo

# Ouvrir le navigateur (optionnel)
if command -v open &> /dev/null; then
    echo "🌐 Ouverture du navigateur..."
    sleep 2
    open "http://localhost:$PORT/launcher/"
elif command -v xdg-open &> /dev/null; then
    echo "🌐 Ouverture du navigateur..."
    sleep 2
    xdg-open "http://localhost:$PORT/launcher/"
fi

# Lancer le serveur Python
python3 -m http.server $PORT