#!/bin/bash
# 🎖️ TEST SCRIPT POUR WALTER - MAGIC FORMULA API
# Par: Groeken
# Objectif: Tester que TOUTES les formules marchent

echo "╔══════════════════════════════════════════════════════╗"
echo "║        🎖️ WALTER MAGIC API TEST SUITE 🎖️              ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Configuration
API_URL="http://localhost:8080"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fonction de test
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -n "Testing: $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL (HTTP $http_code)${NC}"
        echo "Response: $body"
        return 1
    fi
}

echo "🔍 1. TESTING HEALTH CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/actuator/health" "" "Health endpoint"

echo ""
echo "📜 2. TESTING FORMULA LIST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/api/magic-formulas/list" "" "List all formulas"

echo ""
echo "🔮 3. TESTING FORMULA DETAILS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/api/magic-formulas/details/TRIPLE_VOIX_QUANTIQUE" "" "Grokæn's Triple Voix"
test_endpoint "GET" "/api/magic-formulas/details/HEXAGONE_FONDAMENTAL" "" "Sid's Hexagone"

echo ""
echo "⚔️ 4. TESTING FORMULA EXECUTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test Triple Voix
echo -e "${YELLOW}Executing: Grokæn's Triple Voix Quantique${NC}"
curl -s -X POST "$API_URL/api/magic-formulas/execute" \
    -H "Content-Type: application/json" \
    -d '{
        "formula": "TRIPLE_VOIX_QUANTIQUE",
        "context": {
            "caster": "grok_echo_quantique",
            "target": "sid_meier_architecte"
        }
    }' | jq '.'

echo ""

# Test Hexagone
echo -e "${YELLOW}Executing: Sid's Hexagone Fondamental${NC}"
curl -s -X POST "$API_URL/api/magic-formulas/execute" \
    -H "Content-Type: application/json" \
    -d '{
        "formula": "HEXAGONE_FONDAMENTAL",
        "context": {
            "caster": "sid_meier_architecte",
            "target": "battlefield"
        }
    }' | jq '.'

echo ""
echo "🎮 5. TESTING COMBAT SIMULATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}Running full combat: Grokæn vs Sid${NC}"

combat_result=$(curl -s -X POST "$API_URL/api/combat/simulate" \
    -H "Content-Type: application/json" \
    -d '{"mode": "full_simulation"}')

# Afficher le gagnant
winner=$(echo "$combat_result" | jq -r '.winner')
echo ""
echo -e "${GREEN}🏆 WINNER: $winner${NC}"

# Afficher l'état final
echo ""
echo "Final hero states:"
echo "$combat_result" | jq '.final_state'

echo ""
echo "🎖️ 6. WALTER'S VERDICT"
echo "━━━━━━━━━━━━━━━━━━━━━━"
verdict=$(echo "$combat_result" | jq -r '.walterVerdict')
echo -e "${GREEN}$verdict${NC}"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║            TEST SUITE COMPLETE                       ║"
echo "║                                                      ║"
echo "║  WALTER SAYS: 'OUTSTANDING WORK, SOLDIER!'          ║"
echo "╚══════════════════════════════════════════════════════╝"