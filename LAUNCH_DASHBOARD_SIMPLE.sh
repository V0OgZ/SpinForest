#!/bin/bash
# 🚀 LAUNCH DASHBOARD SIMPLE - Tout en un !
# Pour Vincent qui se perd dans tous les scripts que tout le monde a créé

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

clear
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        🚀 LAUNCH DASHBOARD SIMPLE - Tout en Un !            ║"
echo "║                                                              ║"
echo "║         Vincent, choisis ton aventure !                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}[1]${NC} 🌲 Ballade dans la forêt (SANS backend - juste la visite)"
echo -e "${GREEN}[2]${NC} 🔮 Dashboard Quantique (avec simulation backend)"
echo -e "${GREEN}[3]${NC} 🎮 Dashboard Complet + Backend (si dispo)"
echo -e "${GREEN}[4]${NC} 🕯️ Interface Lumen 2D (Dimension 2)"
echo -e "${GREEN}[5]${NC} 🌀 Q3 Arena Supersayan (GROEKEN)"
echo -e "${GREEN}[6]${NC} 📊 Voir tous les serveurs actifs"
echo -e "${GREEN}[7]${NC} 🛑 Arrêter tous les serveurs"
echo -e "${GREEN}[0]${NC} 🚪 Sortir"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -n "Ton choix : "
read choice

case $choice in
    1)
        echo -e "${YELLOW}🌲 Lancement de la ballade dans la forêt...${NC}"
        echo -e "${BLUE}Ouverture de index.html dans ton navigateur${NC}"
        
        # Ouvrir index.html directement
        if command -v open &> /dev/null; then
            open index.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open index.html
        else
            echo "Ouvre manuellement : file://$(pwd)/index.html"
        fi
        
        echo -e "${GREEN}✅ La forêt t'attend ! Clique sur les carrés colorés !${NC}"
        ;;
        
    2)
        echo -e "${YELLOW}🔮 Lancement du Dashboard Quantique...${NC}"
        
        # Serveur simple pour éviter les CORS
        echo -e "${BLUE}Démarrage serveur sur port 8005...${NC}"
        python3 -m http.server 8005 &
        SERVER_PID=$!
        
        sleep 2
        
        # Ouvrir le dashboard
        if command -v open &> /dev/null; then
            open "http://localhost:8005/assets/quantum-dashboard.html"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:8005/assets/quantum-dashboard.html"
        else
            echo "Ouvre : http://localhost:8005/assets/quantum-dashboard.html"
        fi
        
        echo -e "${GREEN}✅ Dashboard Quantique lancé !${NC}"
        echo -e "${CYAN}Serveur PID: $SERVER_PID (Ctrl+C pour arrêter)${NC}"
        wait
        ;;
        
    3)
        echo -e "${YELLOW}🎮 Lancement Dashboard Complet...${NC}"
        
        # Essayer de démarrer le backend mock
        echo -e "${BLUE}Tentative backend sur port 8080...${NC}"
        
        # Chercher un script backend
        if [ -f "AVALON/🧬CORE/⏰ NEXUS-TEMPOREL/⚙️ FORGE-DES-REALITES/backend-clean/run_backend.py" ]; then
            echo -e "${GREEN}Backend trouvé ! Démarrage...${NC}"
            cd "AVALON/🧬CORE/⏰ NEXUS-TEMPOREL/⚙️ FORGE-DES-REALITES/backend-clean"
            python3 run_backend.py &
            BACKEND_PID=$!
            cd - > /dev/null
            sleep 3
        else
            echo -e "${YELLOW}Pas de backend, mode simulation...${NC}"
        fi
        
        # Serveur frontend
        python3 -m http.server 8005 &
        SERVER_PID=$!
        
        sleep 2
        
        # Ouvrir dashboard
        if command -v open &> /dev/null; then
            open "http://localhost:8005/assets/quantum-dashboard.html"
        else
            echo "Ouvre : http://localhost:8005/assets/quantum-dashboard.html"
        fi
        
        echo -e "${GREEN}✅ Dashboard complet lancé !${NC}"
        wait
        ;;
        
    4)
        echo -e "${YELLOW}🕯️ Interface Lumen Dimension 2...${NC}"
        
        # Chercher l'interface Lumen
        if [ -d "AVALON/🏠 HOME/🕯️ LUMEN/PROJET_INTERFACE_DIMENSION_2" ]; then
            cd "AVALON/🏠 HOME/🕯️ LUMEN/PROJET_INTERFACE_DIMENSION_2"
            python3 -m http.server 8001 &
            SERVER_PID=$!
            
            sleep 2
            
            if command -v open &> /dev/null; then
                open "http://localhost:8001/index.html"
            else
                echo "Ouvre : http://localhost:8001/index.html"
            fi
            
            echo -e "${GREEN}✅ Interface Lumen lancée !${NC}"
            cd - > /dev/null
            wait
        else
            echo -e "${RED}❌ Interface Lumen non trouvée${NC}"
        fi
        ;;
        
    5)
        echo -e "${YELLOW}🌀 Q3 Arena Supersayan de GROEKEN...${NC}"
        
        # Chercher l'arène Q3
        if [ -f "AVALON/🏠 HOME/🧠 GROKÆN/q3-arena-supersayan.html" ]; then
            python3 -m http.server 8006 &
            SERVER_PID=$!
            
            sleep 2
            
            if command -v open &> /dev/null; then
                open "http://localhost:8006/AVALON/🏠 HOME/🧠 GROKÆN/q3-arena-supersayan.html"
            else
                echo "Ouvre : http://localhost:8006/AVALON/🏠 HOME/🧠 GROKÆN/q3-arena-supersayan.html"
            fi
            
            echo -e "${GREEN}✅ Q3 Arena lancée ! OVER 9000 !${NC}"
            wait
        else
            echo -e "${RED}❌ Q3 Arena non trouvée${NC}"
        fi
        ;;
        
    6)
        echo -e "${YELLOW}📊 Serveurs actifs...${NC}"
        echo ""
        
        # Check ports
        echo -e "${CYAN}Ports utilisés :${NC}"
        netstat -an 2>/dev/null | grep -E ":(8001|8002|8003|8004|8005|8006|8080)" | grep LISTEN || echo "Aucun serveur détecté"
        
        echo ""
        echo -e "${CYAN}Processus Python :${NC}"
        ps aux | grep python | grep -v grep || echo "Aucun processus Python"
        
        echo ""
        read -p "Appuie sur Entrée pour continuer..."
        $0  # Relancer le menu
        ;;
        
    7)
        echo -e "${RED}🛑 Arrêt de tous les serveurs...${NC}"
        
        # Kill Python servers
        pkill -f "python.*http.server" 2>/dev/null && echo "Serveurs HTTP arrêtés"
        pkill -f "python.*run_backend" 2>/dev/null && echo "Backend arrêté"
        
        echo -e "${GREEN}✅ Tous les serveurs arrêtés !${NC}"
        ;;
        
    0)
        echo -e "${PURPLE}À bientôt dans la forêt ! 🌲${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}Choix invalide !${NC}"
        sleep 1
        $0  # Relancer le menu
        ;;
esac