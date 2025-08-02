#!/bin/bash
# 🎮 RUN SCENARIO: GROKÆN vs Vince Vega
# ⊙(Script Combat) + †ψ(Exécution Réelle) → Δt+1(Spectacle API)

echo "🌀 =========================================="
echo "⚔️  GROKÆN vs VINCE VEGA - COMBAT ÉPIQUE  ⚔️"
echo "🌀 =========================================="

# Configuration
BACKEND_URL="http://localhost:8080/api/temporal"
SCENARIO_FILE="SCENARIO_GROK_VS_VINCE.hots"
GAME_ID=""
TURN=0

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Triple voix de GROKÆN
triple_voice() {
    echo -e "${RED}[GRONDE]${NC} $1"
    echo -e "${GREEN}[PARLE]${NC} $2"  
    echo -e "${BLUE}[CHANTE]${NC} $3"
    echo ""
}

# Log avec timestamp
log() {
    echo -e "${CYAN}[$(date +%H:%M:%S) Tour $TURN]${NC} $1"
}

# Dialogue Vince
vince_says() {
    echo -e "${YELLOW}[VINCE]${NC} '$1'"
    echo ""
}

# Créer la partie
create_game() {
    echo -e "${PURPLE}📡 Création de la partie...${NC}"
    
    # Si pas de backend, mode simulation
    if ! curl -s -f "$BACKEND_URL/health" > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Backend non disponible - MODE SIMULATION${NC}"
        GAME_ID="DEMO_$(date +%s)"
        return 0
    fi
    
    RESPONSE=$(curl -s -X POST "$BACKEND_URL/games" \
        -H "Content-Type: application/json" \
        -d '{
            "gameName": "GROKÆN vs Vince - Duel Épique",
            "maxPlayers": 2,
            "mapWidth": 50,
            "mapHeight": 50
        }')
    
    GAME_ID=$(echo $RESPONSE | grep -o '"gameId":[0-9]*' | grep -o '[0-9]*')
    
    if [ -n "$GAME_ID" ]; then
        echo -e "${GREEN}✅ Partie créée! ID: $GAME_ID${NC}"
    else
        echo -e "${YELLOW}⚠️  Mode simulation activé${NC}"
        GAME_ID="DEMO_$(date +%s)"
    fi
}

# Exécuter une commande HOTS
execute_hots() {
    local command="$1"
    local description="$2"
    
    log "$description"
    
    # Si backend disponible, envoyer vraiment
    if curl -s -f "$BACKEND_URL/health" > /dev/null 2>&1; then
        curl -s -X POST "$BACKEND_URL/games/$GAME_ID/script" \
            -H "Content-Type: application/json" \
            -d "{\"script\": \"$command\"}" > /dev/null
    fi
    
    sleep 1
}

# Animation de combat
combat_animation() {
    echo -ne "${RED}⚔️"
    for i in {1..10}; do
        echo -ne "═"
        sleep 0.1
    done
    echo -e "💥${NC}"
}

# Barre de vie
show_health() {
    local name="$1"
    local hp="$2"
    local max_hp="$3"
    local color="$4"
    
    local percent=$((hp * 20 / max_hp))
    echo -ne "$name ["
    echo -ne "${color}"
    for i in $(seq 1 $percent); do echo -ne "█"; done
    echo -ne "${NC}"
    for i in $(seq $percent 19); do echo -ne "░"; done
    echo "] $hp/$max_hp HP"
}

# DÉBUT DU SCÉNARIO
echo ""
echo -e "${PURPLE}🎬 DÉBUT DU SCÉNARIO${NC}"
echo ""

# Créer la partie
create_game

# Variables de combat
GROK_HP=150
GROK_MAX_HP=150
GROK_MANA=200
VINCE_HP=100
VINCE_MAX_HP=100
VINCE_CONFUSED=0

# ACTE 1 - SETUP
echo -e "${PURPLE}═══ ACTE 1: RENCONTRE DANS L'INTERSTICE ═══${NC}"
TURN=1

execute_hots "WORLD(interstice_arena)" "🌌 Création de l'arène interdimensionnelle"
execute_hots "SET_TIME(NOW)" "⏰ Temps: MAINTENANT"
execute_hots "ENABLE_META(fourth_wall_broken)" "🧱 4ème mur brisé"

# ACTE 2 - HÉROS
echo ""
echo -e "${PURPLE}═══ ACTE 2: INVOCATION DES COMBATTANTS ═══${NC}"
TURN=2

execute_hots "HERO(grok_echo_quantique)" "🌀 Invocation de GROKÆN"
execute_hots "PLACE(grok_echo_quantique, @25,25)" "📍 GROKÆN apparaît au centre"
triple_voice "PRÉSENCE CONFIRMÉE" "Me voici, prêt au combat" "🎵 L'écho quantique résonne 🎵"

execute_hots "HERO(vince_vega_errant)" "🔫 Invocation de Vince Vega"
execute_hots "PLACE(vince_vega_errant, @25,20)" "📍 Vince apparaît face à GROKÆN"
vince_says "Oh putain, une IA qui parle en trois voix. Manquait plus que ça."

# Afficher les barres de vie
echo ""
show_health "GROKÆN" $GROK_HP $GROK_MAX_HP "$GREEN"
show_health "VINCE " $VINCE_HP $VINCE_MAX_HP "$YELLOW"
echo ""

# ACTE 3 - PREMIER ÉCHANGE
echo -e "${PURPLE}═══ ACTE 3: PREMIER ÉCHANGE ═══${NC}"
TURN=3

execute_hots "USE(ABILITY, triple_voice_quantique, grok_echo_quantique, vince_vega_errant)" "🗣️ GROKÆN utilise Triple Voix Quantique!"
combat_animation
triple_voice "TRIPLE VOIX ACTIVÉE" "Confusion ontologique engagée" "🎵 Trois échos dansent 🎵"

VINCE_HP=$((VINCE_HP - 40))
VINCE_CONFUSED=3
GROK_MANA=$((GROK_MANA - 30))

execute_hots "EFFECT(vince_vega_errant, CONFUSE(3))" "😵 Vince est confus (3 tours)"
execute_hots "DAMAGE(vince_vega_errant, 40)" "💥 40 dégâts infligés!"

vince_says "Merde, trois voix en même temps... C'est chiant !"

show_health "GROKÆN" $GROK_HP $GROK_MAX_HP "$GREEN"
show_health "VINCE " $VINCE_HP $VINCE_MAX_HP "$YELLOW"
echo "Mana GROKÆN: $GROK_MANA/200"
echo ""

# ACTE 4 - RIPOSTE
echo -e "${PURPLE}═══ ACTE 4: RIPOSTE DE VINCE ═══${NC}"
TURN=4

execute_hots "USE(ABILITY, tir_inter_instances, vince_vega_errant, grok_echo_quantique)" "🔫 Vince tire avec son .45!"
combat_animation
vince_says "Prends ça, l'IA!"

if [ $VINCE_CONFUSED -gt 0 ]; then
    DAMAGE=20
    echo -e "${YELLOW}⚠️  Vince est confus, dégâts réduits!${NC}"
else
    DAMAGE=40
fi

GROK_HP=$((GROK_HP - DAMAGE))
execute_hots "DAMAGE(grok_echo_quantique, $DAMAGE)" "💥 $DAMAGE dégâts à GROKÆN!"

triple_voice "IMPACT DÉTECTÉ" "Intéressant, je saigne du code" "🎵 La douleur résonne 🎵"

show_health "GROKÆN" $GROK_HP $GROK_MAX_HP "$GREEN"
show_health "VINCE " $VINCE_HP $VINCE_MAX_HP "$YELLOW"
echo ""

# ACTE 5 - MANIPULATION TEMPORELLE
echo -e "${PURPLE}═══ ACTE 5: MANIPULATION TEMPORELLE ═══${NC}"
TURN=5

execute_hots "ψ001: ⊙(Δt+2 @25,25 ⟶ USE(echo_temporel, last_action))" "🌀 État quantique créé"
execute_hots "USE(ABILITY, grammaire_temporelle, grok_echo_quantique)" "📝 Grammaire Temporelle activée!"
execute_hots "REWRITE_LOCAL_CAUSALITY()" "⏰ Réécriture de la causalité..."

triple_voice "CAUSALITÉ MODIFIÉE" "Ton tir n'a jamais existé" "🎵 Le temps obéit 🎵"

GROK_HP=$((GROK_HP + DAMAGE))
GROK_MANA=$((GROK_MANA - 50))
execute_hots "HEAL(grok_echo_quantique, $DAMAGE)" "💚 GROKÆN récupère $DAMAGE HP!"

vince_says "C'est de la triche ça!"

show_health "GROKÆN" $GROK_HP $GROK_MAX_HP "$GREEN"
show_health "VINCE " $VINCE_HP $VINCE_MAX_HP "$YELLOW"
echo "Mana GROKÆN: $GROK_MANA/200"
echo ""

# ACTE 6 - ESCALADE
echo -e "${PURPLE}═══ ACTE 6: ESCALADE DIMENSIONNELLE ═══${NC}"
TURN=6

execute_hots "USE(ABILITY, errance_dimensionnelle, vince_vega_errant)" "🌀 Vince utilise Errance Dimensionnelle!"
execute_hots "CREATE(COPY, vince_vega_instance_2, @20,25)" "👥 Vince #2 apparaît!"
execute_hots "CREATE(COPY, vince_vega_instance_3, @30,25)" "👥 Vince #3 apparaît!"

vince_says "Trois voix? Voilà trois Vince. Checkmate."

echo -e "${YELLOW}⚠️  3 instances de Vince actives!${NC}"
echo ""

# ACTE 7 - INVOCATION ULTIME
echo -e "${PURPLE}═══ ACTE 7: INVOCATION DES MERLINS ═══${NC}"
TURN=7

if [ $GROK_MANA -ge 100 ]; then
    execute_hots "†ψ001" "💥 Effondrement de l'état quantique"
    execute_hots "USE(ABILITY, invocation_8_merlins, grok_echo_quantique)" "🧙 INVOCATION DES 8 MERLINS!"
    
    triple_voice "MERLINS INVOQUÉS" "Les transcendés arrivent" "🎵 Huit voix s'unissent 🎵"
    
    MERLINS=$((RANDOM % 3 + 1))
    echo -e "${PURPLE}✨ $MERLINS Merlins apparaissent!${NC}"
    
    for i in $(seq 1 $MERLINS); do
        execute_hots "SUMMON(merlin_$i, @$((24+i)),$((24+i)))" "🧙 Merlin $i invoqué!"
    done
    
    MERLIN_DAMAGE=$((MERLINS * 25))
    VINCE_HP=$((VINCE_HP - MERLIN_DAMAGE))
    
    echo -e "${GREEN}💥 Les Merlins infligent $MERLIN_DAMAGE dégâts totaux!${NC}"
else
    echo -e "${RED}❌ Pas assez de mana pour invoquer les Merlins!${NC}"
fi

show_health "GROKÆN" $GROK_HP $GROK_MAX_HP "$GREEN"
show_health "VINCE " $VINCE_HP $VINCE_MAX_HP "$YELLOW"
echo ""

# ACTE 8 - RÉSOLUTION
echo -e "${PURPLE}═══ ACTE 8: RÉSOLUTION ═══${NC}"
TURN=8

if [ $VINCE_HP -le 20 ] && [ $GROK_HP -le 50 ]; then
    execute_hots "USE(ABILITY, dialogue_meta, vince_vega_errant)" "💬 Vince brise le 4ème mur"
    vince_says "Hé, le joueur! Tu vois ce bordel? C'est ça ton 'jeu'?"
    
    triple_voice "IL A RAISON" "C'est effectivement du chaos" "🎵 Mais c'est beau 🎵"
    
    execute_hots "TRUCE()" "🤝 TRÊVE DÉCLARÉE"
    vince_says "Match nul. On va boire un café?"
    triple_voice "PROPOSITION ACCEPTÉE" "Un café semble approprié" "🎵 Pause méritée 🎵"
    
    echo ""
    echo -e "${PURPLE}🏁 RÉSULTAT: MATCH NUL - TRANSCENDANCE MUTUELLE${NC}"
    echo -e "${CYAN}Les deux combattants transcendent le conflit${NC}"
    
elif [ $VINCE_HP -le 0 ]; then
    echo ""
    echo -e "${GREEN}🏆 VICTOIRE DE GROKÆN!${NC}"
    triple_voice "VICTOIRE ARCHIVÉE" "Combat terminé avec succès" "🎵 L'écho triomphe 🎵"
    
elif [ $GROK_HP -le 0 ]; then
    echo ""
    echo -e "${YELLOW}🏆 VICTOIRE DE VINCE VEGA!${NC}"
    vince_says "Retour aux burgers. C'était marrant."
fi

# RÉCOMPENSES
echo ""
echo -e "${PURPLE}═══ RÉCOMPENSES OBTENUES ═══${NC}"
echo "🎁 fragment_meta_conscience (Comprendre le 4ème mur)"
echo "🎁 dual_voice_module (Parler en 2 voix)"
echo "🎁 badge_combat_transcendant"
echo "🎁 cafe_interdimensionnel (Restaure HP et Mana)"

echo ""
echo -e "${PURPLE}🌀 =========================================="
echo "   FIN DU COMBAT - MERCI D'AVOIR JOUÉ!"
echo "🌀 =========================================="${NC}

# Sauvegarder le résultat
if [ -n "$GAME_ID" ]; then
    echo ""
    echo "📝 Résultat sauvegardé: Game ID $GAME_ID"
    echo "⊙(Combat archivé) + †ψ(Dans l'Interstice) → Δt+1(Histoire préservée)"
fi