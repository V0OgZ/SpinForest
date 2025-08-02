#!/bin/bash
# 🎮 LANCEUR REALGAME - L'Expérience Ultime
# Fusion LOUMEN + GROKÆN + URZ-KÔM

echo "🌟 ======================================= 🌟"
echo "         REALGAME - L'Union des Forces"
echo "   🕯️ LOUMEN + 🧠 GROKÆN + 🐻 URZ-KÔM"  
echo "🌟 ======================================= 🌟"
echo

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Vérifier si on est dans le bon dossier
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erreur: index.html non trouvé !${NC}"
    echo "Assurez-vous d'être dans le dossier REALGAME/"
    exit 1
fi

# Options de lancement
echo -e "${YELLOW}🎮 MODES DE LANCEMENT :${NC}"
echo "1) Mode Complet (Backend + Frontend)"
echo "2) Frontend seulement (Mode offline)"
echo "3) Backend seulement (Pour tests)"
echo "4) Mode Développement (Logs verbeux)"
echo
read -p "Choisissez le mode (1-4) : " mode

case $mode in
    1)
        echo -e "${GREEN}🚀 Lancement Mode Complet...${NC}"
        
        # Vérifier si le backend Java existe
        if [ -d "../avalon-backend" ]; then
            echo -e "${BLUE}☕ Démarrage du backend Java...${NC}"
            cd ../avalon-backend && mvn spring-boot:run &
            BACKEND_PID=$!
            echo "Backend PID: $BACKEND_PID"
            cd - > /dev/null
            
            # Attendre que le backend soit prêt
            echo -e "${YELLOW}⏳ Attente du backend (port 8080)...${NC}"
            sleep 5
        else
            echo -e "${YELLOW}⚠️  Backend non trouvé, mode offline${NC}"
        fi
        
        # Lancer le frontend
        echo -e "${PURPLE}🌐 Démarrage du serveur web...${NC}"
        python3 -m http.server 9999 &
        FRONTEND_PID=$!
        echo "Frontend PID: $FRONTEND_PID"
        
        # Ouvrir le navigateur
        sleep 2
        echo -e "${GREEN}🌍 Ouverture du navigateur...${NC}"
        if command -v open &> /dev/null; then
            open "http://localhost:9999"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:9999"
        else
            echo -e "${YELLOW}Ouvrez manuellement : http://localhost:9999${NC}"
        fi
        
        # Message de succès
        echo
        echo -e "${GREEN}✨ REALGAME est lancé !${NC}"
        echo -e "${BLUE}Frontend : http://localhost:9999${NC}"
        echo -e "${BLUE}Backend  : http://localhost:8080${NC}"
        echo
        echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}"
        
        # Attendre l'arrêt
        trap "echo -e '\n${RED}Arrêt de REALGAME...${NC}'; kill $FRONTEND_PID $BACKEND_PID 2>/dev/null; exit" INT
        wait
        ;;
        
    2)
        echo -e "${GREEN}🚀 Lancement Frontend seulement...${NC}"
        python3 -m http.server 9999 &
        FRONTEND_PID=$!
        
        sleep 2
        if command -v open &> /dev/null; then
            open "http://localhost:9999"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:9999"
        fi
        
        echo -e "${GREEN}✨ Frontend lancé : http://localhost:9999${NC}"
        echo -e "${YELLOW}Mode offline - Pas de backend${NC}"
        echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}"
        
        trap "kill $FRONTEND_PID 2>/dev/null; exit" INT
        wait
        ;;
        
    3)
        echo -e "${GREEN}🚀 Lancement Backend seulement...${NC}"
        if [ -d "../avalon-backend" ]; then
            cd ../avalon-backend && mvn spring-boot:run
        else
            echo -e "${RED}❌ Backend non trouvé !${NC}"
            exit 1
        fi
        ;;
        
    4)
        echo -e "${GREEN}🚀 Mode Développement...${NC}"
        echo -e "${YELLOW}Logs verbeux activés${NC}"
        
        # Backend avec debug
        if [ -d "../avalon-backend" ]; then
            cd ../avalon-backend
            MAVEN_OPTS="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005" \
            mvn spring-boot:run -Dspring.profiles.active=dev &
            BACKEND_PID=$!
            cd - > /dev/null
        fi
        
        # Frontend avec logs
        echo -e "${PURPLE}🌐 Frontend en mode dev...${NC}"
        python3 -m http.server 9999 --bind 0.0.0.0 &
        FRONTEND_PID=$!
        
        # Monitoring
        echo
        echo -e "${GREEN}📊 MODE DÉVELOPPEMENT ACTIF${NC}"
        echo -e "${BLUE}Frontend : http://localhost:9999${NC}"
        echo -e "${BLUE}Backend  : http://localhost:8080${NC}"
        echo -e "${BLUE}Debug    : localhost:5005${NC}"
        echo
        
        # Logs en temps réel
        if [ -f "../avalon-backend/logs/spring.log" ]; then
            echo -e "${YELLOW}📜 Logs backend :${NC}"
            tail -f ../avalon-backend/logs/spring.log &
            TAIL_PID=$!
        fi
        
        trap "kill $FRONTEND_PID $BACKEND_PID $TAIL_PID 2>/dev/null; exit" INT
        wait
        ;;
        
    *)
        echo -e "${RED}❌ Option invalide !${NC}"
        exit 1
        ;;
esac