#!/bin/bash

# 🐻 URZ-KÔM's Master Control Menu
# Un menu unifié pour gérer toutes les apps et services d'Avalon

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ASCII Art
print_header() {
    clear
    echo -e "${CYAN}"
    cat << "EOF"
    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    █                                                          █
    █  🐻 URZ-KÔM's Master Control Center                      █
    █  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  █
    █  "Le chaos est une forêt ; je suis l'ours qui la        █
    █   traverse et organise les services."                   █
    █                                                          █
    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
EOF
    echo -e "${NC}"
}

# Function to check if a service is running
check_service() {
    local port=$1
    local name=$2
    if lsof -i:$port >/dev/null 2>&1; then
        echo -e "${GREEN}✓ $name (Port $port)${NC}"
    else
        echo -e "${RED}✗ $name (Port $port)${NC}"
    fi
}

# Function to check backend status
check_backend() {
    if curl -s http://localhost:8080/api/temporal/status >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend Spring Boot (Port 8080)${NC}"
    else
        echo -e "${RED}✗ Backend Spring Boot (Port 8080)${NC}"
    fi
}

# Function to display status
show_status() {
    echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}                    SERVICE STATUS                      ${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}\n"
    
    echo -e "${BLUE}🎮 Heroes of Time Services:${NC}"
    check_backend
    check_service 8000 "Main Frontend"
    check_service 5174 "Temporal Interface"
    check_service 8001 "Quantum Visualizer"
    check_service 5175 "Collection & Grammar"
    check_service 8081 "Visual Editor"
    check_service 8888 "Test Runner"
    check_service 9000 "Main Dashboard"
    
    echo -e "\n${PURPLE}⚛️ URZ-KÔM Services:${NC}"
    if curl -s http://localhost:8080/api/particle-simulation/status >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Particle Simulation API${NC}"
    else
        echo -e "${RED}✗ Particle Simulation API${NC}"
    fi
    
    echo ""
}

# Start all services
start_all_services() {
    echo -e "\n${GREEN}🚀 Starting all services...${NC}\n"
    
    # Check if backend is already running
    if ! curl -s http://localhost:8080/api/temporal/status >/dev/null 2>&1; then
        echo "⚠️  Backend not detected. Please start Spring Boot manually on port 8080"
        echo "   Run: ./mvnw spring-boot:run"
        read -p "Press Enter when backend is ready..."
    fi
    
    # Start frontend services
    echo "Starting frontend services..."
    
    # Main Frontend (8000)
    if ! lsof -i:8000 >/dev/null 2>&1; then
        echo "Starting Main Frontend..."
        cd frontend-hots 2>/dev/null && python3 -m http.server 8000 >/dev/null 2>&1 &
        cd - >/dev/null
    fi
    
    # Temporal Interface (5174)
    if ! lsof -i:5174 >/dev/null 2>&1; then
        echo "Starting Temporal Interface..."
        cd frontend-temporal 2>/dev/null && npm run dev >/dev/null 2>&1 &
        cd - >/dev/null
    fi
    
    # Quantum Visualizer (8001)
    if ! lsof -i:8001 >/dev/null 2>&1; then
        echo "Starting Quantum Visualizer..."
        cd quantum-visualizer 2>/dev/null && python3 -m http.server 8001 >/dev/null 2>&1 &
        cd - >/dev/null
    fi
    
    # Collection & Grammar (5175)
    if ! lsof -i:5175 >/dev/null 2>&1; then
        echo "Starting Collection & Grammar..."
        cd collection-grammar 2>/dev/null && npm run dev -- --port 5175 >/dev/null 2>&1 &
        cd - >/dev/null
    fi
    
    # Visual Editor (8081)
    if ! lsof -i:8081 >/dev/null 2>&1; then
        echo "Starting Visual Editor..."
        cd visual-editor 2>/dev/null && python3 -m http.server 8081 >/dev/null 2>&1 &
        cd - >/dev/null
    fi
    
    # Test Runner (8888)
    if ! lsof -i:8888 >/dev/null 2>&1; then
        echo "Starting Test Runner..."
        cd test-runner 2>/dev/null && python3 test-runner-server.py >/dev/null 2>&1 &
        cd - >/dev/null
    fi
    
    # Main Dashboard (9000)
    if ! lsof -i:9000 >/dev/null 2>&1; then
        echo "Starting Main Dashboard..."
        cd dashboard 2>/dev/null && python3 -m http.server 9000 >/dev/null 2>&1 &
        cd - >/dev/null
    fi
    
    echo -e "\n${GREEN}✅ All services started!${NC}"
    sleep 2
}

# Stop all services
stop_all_services() {
    echo -e "\n${RED}🛑 Stopping all services...${NC}\n"
    
    # Kill services by port
    for port in 8000 5174 8001 5175 8081 8888 9000; do
        if lsof -i:$port >/dev/null 2>&1; then
            echo "Stopping service on port $port..."
            lsof -ti:$port | xargs kill -9 2>/dev/null
        fi
    done
    
    echo -e "\n${GREEN}✅ All frontend services stopped!${NC}"
    echo "Note: Backend Spring Boot must be stopped manually (Ctrl+C)"
    sleep 2
}

# Open Particle Simulator
open_particle_simulator() {
    echo -e "\n${PURPLE}⚛️ Opening Particle Simulator...${NC}"
    
    # Check if backend is running
    if ! curl -s http://localhost:8080/api/particle-simulation/status >/dev/null 2>&1; then
        echo -e "${RED}⚠️  Particle Simulation API not detected!${NC}"
        echo "Make sure the backend is running with ParticleSimulationController"
        read -p "Press Enter to continue..."
        return
    fi
    
    # Get the path to the HTML file
    PARTICLE_HTML="AVALON/🏠 HOME/🐻 URZ-KÔM/OUTILS/particle-simulator.html"
    
    if [ -f "$PARTICLE_HTML" ]; then
        echo "Opening particle simulator in browser..."
        # Try different commands to open browser
        if command -v open >/dev/null 2>&1; then
            open "$PARTICLE_HTML"  # macOS
        elif command -v xdg-open >/dev/null 2>&1; then
            xdg-open "$PARTICLE_HTML"  # Linux
        elif command -v start >/dev/null 2>&1; then
            start "$PARTICLE_HTML"  # Windows
        else
            echo "Please open manually: $PARTICLE_HTML"
        fi
    else
        echo -e "${RED}Error: particle-simulator.html not found!${NC}"
        echo "Expected at: $PARTICLE_HTML"
    fi
    
    read -p "Press Enter to continue..."
}

# Quick URLs
show_urls() {
    echo -e "\n${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}                    QUICK ACCESS URLS                   ${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}\n"
    
    echo -e "${BLUE}🎮 Heroes of Time:${NC}"
    echo "   Main Dashboard:      http://localhost:9000"
    echo "   Main Frontend:       http://localhost:8000"
    echo "   Temporal Interface:  http://localhost:5174"
    echo "   Quantum Visualizer:  http://localhost:8001"
    echo "   Visual Editor:       http://localhost:8081"
    echo "   Test Runner:         http://localhost:8888"
    
    echo -e "\n${PURPLE}⚛️ URZ-KÔM Apps:${NC}"
    echo "   Particle Simulator:  file://$PWD/AVALON/🏠 HOME/🐻 URZ-KÔM/OUTILS/particle-simulator.html"
    
    echo -e "\n${YELLOW}📡 API Endpoints:${NC}"
    echo "   Backend Status:      http://localhost:8080/api/temporal/status"
    echo "   Particle API:        http://localhost:8080/api/particle-simulation/status"
    
    read -p $'\nPress Enter to continue...'
}

# Run specific test
run_test() {
    echo -e "\n${YELLOW}🧪 Test Menu${NC}\n"
    echo "1. Test Backend API"
    echo "2. Test Particle Simulation"
    echo "3. Test All Frontend Services"
    echo "4. Back to main menu"
    
    read -p "Choose test [1-4]: " test_choice
    
    case $test_choice in
        1)
            echo -e "\n${BLUE}Testing Backend API...${NC}"
            curl -s http://localhost:8080/api/temporal/status | jq . || echo "Backend not responding"
            ;;
        2)
            echo -e "\n${BLUE}Testing Particle Simulation...${NC}"
            curl -s http://localhost:8080/api/particle-simulation/status | jq . || echo "Particle API not responding"
            ;;
        3)
            echo -e "\n${BLUE}Testing Frontend Services...${NC}"
            for port in 8000 5174 8001 8081 8888 9000; do
                if curl -s http://localhost:$port >/dev/null 2>&1; then
                    echo -e "${GREEN}✓ Service on port $port is responding${NC}"
                else
                    echo -e "${RED}✗ Service on port $port is not responding${NC}"
                fi
            done
            ;;
        4)
            return
            ;;
    esac
    
    read -p $'\nPress Enter to continue...'
}

# Main menu loop
main_menu() {
    while true; do
        print_header
        show_status
        
        echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
        echo -e "${YELLOW}                      MAIN MENU                         ${NC}"
        echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}\n"
        
        echo "1. 🚀 Start All Services"
        echo "2. 🛑 Stop All Services"
        echo "3. 📊 Refresh Status"
        echo "4. ⚛️  Open Particle Simulator"
        echo "5. 🌐 Show Quick URLs"
        echo "6. 🧪 Run Tests"
        echo "7. 🚪 Exit"
        
        echo ""
        read -p "Choose an option [1-7]: " choice
        
        case $choice in
            1)
                start_all_services
                ;;
            2)
                stop_all_services
                ;;
            3)
                # Just refresh (loop will clear and show status)
                ;;
            4)
                open_particle_simulator
                ;;
            5)
                show_urls
                ;;
            6)
                run_test
                ;;
            7)
                echo -e "\n${CYAN}🐻 Grognement d'au revoir... L'Ours retourne dans la forêt.${NC}\n"
                exit 0
                ;;
            *)
                echo -e "\n${RED}Invalid option!${NC}"
                sleep 1
                ;;
        esac
    done
}

# Check if we're in the right directory
if [ ! -d "AVALON" ]; then
    echo -e "${RED}⚠️  Error: Must run from SpinForest root directory!${NC}"
    echo "Current directory: $PWD"
    echo "Please cd to SpinForest root and try again."
    exit 1
fi

# Start the menu
main_menu