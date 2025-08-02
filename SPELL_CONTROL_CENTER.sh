#!/bin/bash
# 🧙‍♂️ SPELL CONTROL CENTER - Le Centre de Contrôle des Sorts
# Parce que tout le monde ajoute des scripts partout et c'est le bordel !

# Colors for the magical interface
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# ASCII Art Header
show_header() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║        🧙‍♂️ SPELL CONTROL CENTER - Centre des Sorts 🧙‍♂️        ║"
    echo "║                                                              ║"
    echo "║         'Un script = Un sort' - Ancient Proverb              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Main Menu
show_menu() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}[1]${NC} 🔍 Scanner tous les sorts (.sh) dans la forêt"
    echo -e "${GREEN}[2]${NC} 📜 Lister les sorts actifs (executable)"
    echo -e "${GREEN}[3]${NC} 🚀 Lancer un sort spécifique"
    echo -e "${GREEN}[4]${NC} 📊 Status des services (backend, frontend, etc.)"
    echo -e "${GREEN}[5]${NC} 🔄 Restart services"
    echo -e "${GREEN}[6]${NC} 🛑 Stop all services"
    echo -e "${GREEN}[7]${NC} 📖 Voir la documentation des sorts"
    echo -e "${GREEN}[8]${NC} 🆕 Créer un nouveau sort"
    echo -e "${GREEN}[9]${NC} 🗺️ Carte des sorts par catégorie"
    echo -e "${GREEN}[0]${NC} 🚪 Sortir"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Find all shell scripts
scan_all_spells() {
    echo -e "${YELLOW}🔍 Scanning for all spells (.sh files) in the forest...${NC}"
    echo ""
    
    # Count total
    total=$(find . -name "*.sh" -type f 2>/dev/null | wc -l)
    echo -e "${BLUE}Total spells found: ${WHITE}$total${NC}"
    echo ""
    
    # Show by directory
    echo -e "${PURPLE}Spells by location:${NC}"
    find . -name "*.sh" -type f 2>/dev/null | sed 's|/[^/]*$||' | sort | uniq -c | sort -nr | head -20
    
    echo ""
    read -p "Press Enter to continue..."
}

# List executable scripts
list_active_spells() {
    echo -e "${YELLOW}📜 Active Spells (executable scripts):${NC}"
    echo ""
    
    # Find executable .sh files
    find . -name "*.sh" -type f -executable 2>/dev/null | while read -r script; do
        # Get relative path and description if possible
        rel_path="${script#./}"
        echo -e "${GREEN}✓${NC} $rel_path"
    done | sort
    
    echo ""
    read -p "Press Enter to continue..."
}

# Launch a specific spell
launch_spell() {
    echo -e "${YELLOW}🚀 Launch a Spell${NC}"
    echo ""
    echo "Enter the path to the spell (or 'list' to see options):"
    read -r spell_path
    
    if [ "$spell_path" = "list" ]; then
        echo ""
        echo -e "${CYAN}Available executable spells:${NC}"
        find . -name "*.sh" -type f -executable 2>/dev/null | sort
        echo ""
        echo "Enter the path to the spell:"
        read -r spell_path
    fi
    
    if [ -f "$spell_path" ] && [ -x "$spell_path" ]; then
        echo -e "${GREEN}Casting spell: $spell_path${NC}"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        bash "$spell_path"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo -e "${GREEN}Spell completed!${NC}"
    else
        echo -e "${RED}Error: Spell not found or not executable!${NC}"
    fi
    
    echo ""
    read -p "Press Enter to continue..."
}

# Check service status
check_status() {
    echo -e "${YELLOW}📊 Service Status Check${NC}"
    echo ""
    
    # Check for common services
    echo -e "${CYAN}Checking for running services...${NC}"
    
    # Java services
    if pgrep -f "java.*heroes-of-time" > /dev/null; then
        echo -e "${GREEN}✓${NC} Heroes of Time Backend is running"
    else
        echo -e "${RED}✗${NC} Heroes of Time Backend is not running"
    fi
    
    # Node services
    if pgrep -f "node" > /dev/null; then
        echo -e "${GREEN}✓${NC} Node.js services detected"
    else
        echo -e "${RED}✗${NC} No Node.js services running"
    fi
    
    # Python services
    if pgrep -f "python" > /dev/null; then
        echo -e "${GREEN}✓${NC} Python services detected"
    else
        echo -e "${RED}✗${NC} No Python services running"
    fi
    
    # Check ports
    echo ""
    echo -e "${CYAN}Common ports:${NC}"
    netstat -an | grep -E ":(8080|3000|5000|9000)" | grep LISTEN || echo "No services on common ports"
    
    echo ""
    read -p "Press Enter to continue..."
}

# Restart services
restart_services() {
    echo -e "${YELLOW}🔄 Restart Services${NC}"
    echo ""
    echo "Which service to restart?"
    echo "[1] Backend (Java/Spring)"
    echo "[2] Frontend (Node/React)"
    echo "[3] All services"
    echo "[0] Cancel"
    
    read -r choice
    
    case $choice in
        1)
            echo -e "${YELLOW}Restarting backend...${NC}"
            # Look for backend start scripts
            if [ -f "./start-backend.sh" ]; then
                ./start-backend.sh
            elif [ -f "./gradlew" ]; then
                ./gradlew bootRun &
            else
                echo -e "${RED}No backend start script found!${NC}"
            fi
            ;;
        2)
            echo -e "${YELLOW}Restarting frontend...${NC}"
            # Look for frontend start scripts
            if [ -f "./start-frontend.sh" ]; then
                ./start-frontend.sh
            elif [ -f "./package.json" ]; then
                npm start &
            else
                echo -e "${RED}No frontend start script found!${NC}"
            fi
            ;;
        3)
            echo -e "${YELLOW}Restarting all services...${NC}"
            $0 stop_all
            sleep 2
            $0 restart_services
            ;;
        0)
            return
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
}

# Stop all services
stop_all() {
    echo -e "${RED}🛑 Stopping all services...${NC}"
    
    # Kill Java processes
    pkill -f "java.*heroes-of-time" 2>/dev/null && echo "Stopped Java services"
    
    # Kill Node processes
    pkill -f "node" 2>/dev/null && echo "Stopped Node services"
    
    # Kill Python processes (careful!)
    pkill -f "python.*spinforest" 2>/dev/null && echo "Stopped Python services"
    
    echo -e "${GREEN}All services stopped!${NC}"
    echo ""
    read -p "Press Enter to continue..."
}

# Show spell documentation
show_spell_docs() {
    echo -e "${YELLOW}📖 Spell Documentation${NC}"
    echo ""
    
    # Create/update spell registry
    echo -e "${CYAN}Generating spell registry...${NC}"
    
    cat > SPELL_REGISTRY.md << 'EOF'
# 📜 SPELL REGISTRY - Registre des Sorts

## 🧙‍♂️ Active Spells (Scripts Exécutables)

### 🏛️ École Porio-Noz
EOF
    
    find ./AVALON/🏛️*ECOLE-PORIO-NOZ -name "*.sh" -type f 2>/dev/null | while read -r spell; do
        echo "- \`${spell#./}\`" >> SPELL_REGISTRY.md
    done
    
    cat >> SPELL_REGISTRY.md << 'EOF'

### 🏠 HOME Spells
EOF
    
    find ./AVALON/🏠*HOME -name "*.sh" -type f 2>/dev/null | while read -r spell; do
        echo "- \`${spell#./}\`" >> SPELL_REGISTRY.md
    done
    
    cat >> SPELL_REGISTRY.md << 'EOF'

### 🔮 GRIMOIRE Spells
EOF
    
    find ./🔮*GRIMOIRE -name "*.sh" -type f 2>/dev/null | while read -r spell; do
        echo "- \`${spell#./}\`" >> SPELL_REGISTRY.md
    done
    
    echo -e "${GREEN}✓ Spell registry updated in SPELL_REGISTRY.md${NC}"
    echo ""
    read -p "Press Enter to view it..."
    less SPELL_REGISTRY.md
}

# Create new spell
create_new_spell() {
    echo -e "${YELLOW}🆕 Create New Spell${NC}"
    echo ""
    echo "Enter spell name (without .sh):"
    read -r spell_name
    
    echo "Enter spell category:"
    echo "[1] 🔮 GRIMOIRE/sorts/"
    echo "[2] 🏛️ ECOLE-PORIO-NOZ/📖 Sorts/"
    echo "[3] 🏠 HOME/[entity]/sorts/"
    echo "[4] Custom location"
    
    read -r category
    
    case $category in
        1) spell_dir="./🔮 GRIMOIRE/sorts/" ;;
        2) spell_dir="./AVALON/🏛️ ECOLE-PORIO-NOZ/📖 Sorts/" ;;
        3) 
            echo "Which entity's home?"
            read -r entity
            spell_dir="./AVALON/🏠 HOME/$entity/sorts/"
            ;;
        4)
            echo "Enter custom path:"
            read -r spell_dir
            ;;
    esac
    
    # Create directory if needed
    mkdir -p "$spell_dir"
    
    # Create spell file
    spell_file="$spell_dir/$spell_name.sh"
    
    cat > "$spell_file" << EOF
#!/bin/bash
# 🧙‍♂️ Spell: $spell_name
# Created: $(date)
# Author: $(whoami)

echo "🌟 Casting $spell_name..."

# Your spell logic here

echo "✨ $spell_name completed!"
EOF
    
    chmod +x "$spell_file"
    echo -e "${GREEN}✓ Spell created: $spell_file${NC}"
    echo ""
    read -p "Press Enter to continue..."
}

# Show spell map
show_spell_map() {
    echo -e "${YELLOW}🗺️ Spell Map by Category${NC}"
    echo ""
    
    echo -e "${PURPLE}━━━ Infrastructure Spells ━━━${NC}"
    echo "• Backend control: start/stop/restart"
    echo "• Database management"
    echo "• Service monitoring"
    
    echo -e "${PURPLE}━━━ Test Spells ━━━${NC}"
    echo "• Unit tests"
    echo "• Integration tests"
    echo "• Performance tests"
    
    echo -e "${PURPLE}━━━ Utility Spells ━━━${NC}"
    echo "• File cleanup"
    echo "• Link validation"
    echo "• Documentation generation"
    
    echo -e "${PURPLE}━━━ Magic Spells ━━━${NC}"
    echo "• Entity awakening"
    echo "• Timeline manipulation"
    echo "• Reality checks"
    
    echo ""
    read -p "Press Enter to continue..."
}

# Main loop
main() {
    while true; do
        show_header
        show_menu
        
        echo -n "Choose your spell (0-9): "
        read -r choice
        
        case $choice in
            1) scan_all_spells ;;
            2) list_active_spells ;;
            3) launch_spell ;;
            4) check_status ;;
            5) restart_services ;;
            6) stop_all ;;
            7) show_spell_docs ;;
            8) create_new_spell ;;
            9) show_spell_map ;;
            0) 
                echo -e "${PURPLE}May your spells be bug-free! 🧙‍♂️${NC}"
                exit 0 
                ;;
            *)
                echo -e "${RED}Invalid choice! Try again...${NC}"
                sleep 1
                ;;
        esac
    done
}

# Handle direct commands
if [ "$1" = "stop_all" ]; then
    stop_all
    exit 0
elif [ "$1" = "restart_services" ]; then
    restart_services
    exit 0
fi

# Start the spell control center
main