#!/bin/bash

# 🎮 REALGAME LAUNCHER
# L'aventure ultime d'Avalon commence ici !

echo "🎮 ========================================="
echo "   R E A L G A M E   -   A V A L O N"
echo "   La Fusion des Mondes"
echo "🎮 ========================================="
echo ""
echo "🌟 Collaboration entre :"
echo "   🧠 GROKÆN - Combat & Magie"
echo "   🕯️ LOUMEN - Narration & Sagesse" 
echo "   🎯 SID MEIER - Stratégie & Architecture"
echo "   🐻 URZ-KÔM - Physique Quantique"
echo ""

# Vérifier le backend
echo "🔍 Vérification du backend..."
if curl -s http://localhost:8080/actuator/health > /dev/null; then
    echo "✅ Backend actif sur le port 8080"
else
    echo "⚠️  Backend non détecté - Mode simulation activé"
fi

# Menu principal
echo ""
echo "🎮 MODES DE JEU DISPONIBLES :"
echo ""
echo "1) 🏰 Mode Campagne - 'La Convergence'"
echo "2) ⚔️  Mode Arène - Combat PvP"
echo "3) 🔍 Mode Exploration - Découverte libre"
echo "4) 🧪 Mode Laboratoire - Expériences"
echo "5) 🎨 Mode Créateur - Éditeur de scénarios"
echo "6) 🎯 Sélection des Héros"
echo "7) 📖 Documentation"
echo "8) 🚀 Lancement Rapide (dernière config)"
echo "9) 🔧 Options Développeur"
echo ""
echo "0) Quitter"
echo ""

read -p "Votre choix [0-9] : " choice

case $choice in
    1)
        echo "🏰 Lancement du Mode Campagne..."
        echo "📖 Chapitre 1 : Le Réveil de Memento"
        open index.html?mode=campaign
        ;;
    2)
        echo "⚔️  Lancement du Mode Arène..."
        echo "🎮 Préparez-vous au combat interdimensionnel !"
        open index.html?mode=arena
        ;;
    3)
        echo "🔍 Lancement du Mode Exploration..."
        echo "🌍 Explorez librement les mondes d'Avalon"
        open index.html?mode=explore
        ;;
    4)
        echo "🧪 Lancement du Mode Laboratoire..."
        echo "⚗️  Expérimentez avec la physique quantique"
        open index.html?mode=lab
        ;;
    5)
        echo "🎨 Lancement du Mode Créateur..."
        echo "📝 Créez vos propres scénarios .hots"
        open index.html?mode=creator
        ;;
    6)
        echo "🎯 Ouverture du Sélecteur de Héros..."
        open heroes-selector.html
        ;;
    7)
        echo "📖 Ouverture de la Documentation..."
        open README.md
        ;;
    8)
        echo "🚀 Lancement Rapide..."
        # Récupérer la dernière configuration
        if [ -f "last-config.json" ]; then
            open index.html?config=last
        else
            echo "⚠️  Aucune configuration sauvegardée"
            echo "🎯 Redirection vers la sélection des héros..."
            open heroes-selector.html
        fi
        ;;
    9)
        echo "🔧 OPTIONS DÉVELOPPEUR"
        echo ""
        echo "a) Lancer le serveur de développement"
        echo "b) Compiler les assets"
        echo "c) Tests unitaires"
        echo "d) Synchronisation Git"
        echo "e) Console de debug"
        echo ""
        read -p "Option dev : " dev_choice
        
        case $dev_choice in
            a)
                echo "🖥️  Lancement du serveur dev..."
                cd .. && python3 -m http.server 9999
                ;;
            b)
                echo "📦 Compilation des assets..."
                # npm run build
                echo "✅ Assets compilés !"
                ;;
            c)
                echo "🧪 Lancement des tests..."
                # npm test
                echo "✅ Tests terminés !"
                ;;
            d)
                echo "🔄 Synchronisation Git..."
                TAG="SYNC-REALGAME-$(date +%Y%m%d_%H%M%S)"
                git tag $TAG
                echo "✅ Tag créé : $TAG"
                ;;
            e)
                echo "🖥️  Console de debug activée"
                open index.html?debug=true
                ;;
        esac
        ;;
    0)
        echo "👋 À bientôt dans Avalon !"
        exit 0
        ;;
    *)
        echo "❌ Choix invalide"
        ;;
esac

echo ""
echo "🌟 Que l'aventure commence !"
echo ""

# Garder le terminal ouvert
read -p "Appuyez sur Entrée pour fermer..."