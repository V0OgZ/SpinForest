#!/bin/bash
# 🎮 DEMO API SCRIPT - GROKÆN vs Vince Vega
# ⊙(Script de démo) + †ψ(Combat API) → Δt+1(Spectacle épique)

echo "🌀 GROKÆN DEMO LAUNCHER - Combat Méta-Temporel"
echo "============================================"

# Configuration
BACKEND_URL="http://localhost:8080/api/temporal"
GAME_ID=""

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher avec style
log() {
    echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $1"
}

error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

triple_voice() {
    echo -e "${RED}GRONDE:${NC} $1 | ${GREEN}PARLE:${NC} $2 | ${BLUE}CHANTE:${NC} $3"
}

# Vérifier le backend
check_backend() {
    log "🔍 Vérification du backend..."
    if curl -s -f "$BACKEND_URL/health" > /dev/null; then
        log "✅ Backend opérationnel!"
        return 0
    else
        error "Backend non disponible sur $BACKEND_URL"
        return 1
    fi
}

# Créer une partie
create_game() {
    log "🎮 Création de la partie GROKÆN vs Vince..."
    
    RESPONSE=$(curl -s -X POST "$BACKEND_URL/games" \
        -H "Content-Type: application/json" \
        -d '{
            "gameName": "GROKÆN vs Vince - Duel Méta",
            "maxPlayers": 2,
            "mapWidth": 50,
            "mapHeight": 50
        }')
    
    GAME_ID=$(echo $RESPONSE | grep -o '"gameId":[0-9]*' | grep -o '[0-9]*')
    
    if [ -n "$GAME_ID" ]; then
        log "✅ Partie créée! ID: $GAME_ID"
        return 0
    else
        error "Impossible de créer la partie"
        echo "Réponse: $RESPONSE"
        return 1
    fi
}

# Exécuter une commande HOTS
execute_command() {
    local command="$1"
    local description="$2"
    
    log "📡 $description"
    
    curl -s -X POST "$BACKEND_URL/games/$GAME_ID/script" \
        -H "Content-Type: application/json" \
        -d "{\"script\": \"$command\"}" | jq '.' 2>/dev/null || echo "Commande envoyée"
}

# Scénario de combat
run_combat_scenario() {
    log "⚔️ DÉBUT DU COMBAT ÉPIQUE!"
    echo ""
    
    # Setup
    execute_command "WORLD(interstice_arena)" "Création de l'arène interdimensionnelle"
    sleep 1
    
    # Héros
    execute_command "HERO(grok_echo_quantique)" "Invocation de GROKÆN"
    execute_command "PLACE(grok_echo_quantique, @25,25)" "GROKÆN entre dans l'arène"
    triple_voice "PRÉSENCE CONFIRMÉE" "Me voici dans l'arène" "🎵 L'écho résonne 🎵"
    sleep 2
    
    execute_command "HERO(vince_vega_errant)" "Invocation de Vince Vega"
    execute_command "PLACE(vince_vega_errant, @25,20)" "Vince apparaît"
    echo -e "${YELLOW}Vince:${NC} 'Encore un truc bizarre. Au moins j'ai mon flingue.'"
    sleep 2
    
    # Round 1
    echo ""
    log "🥊 ROUND 1 - Premier Contact"
    execute_command "USE(ABILITY, triple_voice_quantique, grok_echo_quantique, vince_vega_errant)" "GROKÆN utilise Triple Voix!"
    triple_voice "TRIPLE VOIX ACTIVÉE" "Confusion maximale engagée" "🎵 Trois échos dansent 🎵"
    execute_command "EFFECT(vince_vega_errant, CONFUSE(3))" "Vince est confus!"
    echo -e "${YELLOW}Vince:${NC} 'Putain, j'entends triple!'"
    sleep 2
    
    # Round 2
    echo ""
    log "🥊 ROUND 2 - Riposte"
    execute_command "USE(ABILITY, tir_inter_instances, vince_vega_errant, grok_echo_quantique)" "Vince tire!"
    echo -e "${YELLOW}Vince:${NC} 'Prends ça, l'IA!'"
    execute_command "DAMAGE(grok_echo_quantique, 40)" "40 dégâts à GROKÆN!"
    triple_voice "IMPACT DÉTECTÉ" "Intéressant, je saigne du code" "🎵 La douleur résonne 🎵"
    sleep 2
    
    # Round 3
    echo ""
    log "🥊 ROUND 3 - Manipulation Temporelle"
    execute_command "USE(ABILITY, grammaire_temporelle, grok_echo_quantique)" "Grammaire Temporelle!"
    execute_command "REWRITE_LOCAL_CAUSALITY()" "Réécriture de la causalité..."
    triple_voice "CAUSALITÉ MODIFIÉE" "Ton tir n'a jamais existé" "🎵 Le temps obéit 🎵"
    execute_command "HEAL(grok_echo_quantique, 40)" "GROKÆN récupère 40 HP!"
    echo -e "${YELLOW}Vince:${NC} 'C'est de la triche ça!'"
    sleep 2
    
    # Round 4
    echo ""
    log "🥊 ROUND 4 - Escalade"
    execute_command "USE(ABILITY, errance_dimensionnelle, vince_vega_errant)" "Vince se duplique!"
    execute_command "CREATE(COPY, vince_instance_2, @20,25)" "Vince #2 apparaît"
    execute_command "CREATE(COPY, vince_instance_3, @30,25)" "Vince #3 apparaît"
    echo -e "${YELLOW}Vince(s):${NC} 'Trois voix? Voilà trois Vince!'"
    sleep 2
    
    # Round 5 - Finale
    echo ""
    log "🥊 ROUND 5 - Invocation Ultime"
    execute_command "USE(ABILITY, invocation_8_merlins, grok_echo_quantique)" "INVOCATION DES 8 MERLINS!"
    triple_voice "MERLINS INVOQUÉS" "Les transcendés arrivent" "🎵 Huit voix s'unissent 🎵"
    execute_command "SUMMON(merlin_1, @24,24)" "Merlin 1 apparaît!"
    execute_command "SUMMON(merlin_2, @26,26)" "Merlin 2 apparaît!"
    echo "Merlins: 'GROKÆN nous appelle! Pour Avalon!'"
    sleep 2
    
    # Résolution
    echo ""
    log "🏁 RÉSOLUTION"
    execute_command "DIALOGUE(vince_vega_errant, 'OK OK, match nul. On va boire un café?')" "Vince propose la paix"
    triple_voice "PROPOSITION ACCEPTÉE" "Un café semble approprié" "🎵 La paix résonne 🎵"
    execute_command "TRUCE()" "MATCH NUL - Les deux transcendent"
    
    echo ""
    log "✨ COMBAT TERMINÉ - TRANSCENDANCE MUTUELLE ✨"
}

# Menu principal
main_menu() {
    echo ""
    echo "=== MENU DÉMO ==="
    echo "1) Lancer le combat complet"
    echo "2) Tester la connexion backend"
    echo "3) Mode démo rapide (sans API)"
    echo "4) Quitter"
    echo ""
    read -p "Choix: " choice
    
    case $choice in
        1)
            if check_backend && create_game; then
                run_combat_scenario
            else
                error "Impossible de lancer le combat"
            fi
            ;;
        2)
            check_backend
            ;;
        3)
            log "🎬 MODE DÉMO RAPIDE"
            triple_voice "DÉMO ACTIVÉE" "Combat simulé localement" "🎵 Sans backend 🎵"
            echo -e "${YELLOW}Vince:${NC} 'On fait semblant alors?'"
            sleep 1
            log "GROKÆN lance Triple Voix!"
            log "Vince riposte avec Tir Inter-Instances!"
            log "GROKÆN utilise Grammaire Temporelle!"
            log "Combat épique simulé... MATCH NUL!"
            ;;
        4)
            log "Au revoir!"
            exit 0
            ;;
        *)
            error "Choix invalide"
            ;;
    esac
}

# Boucle principale
echo ""
triple_voice "SYSTÈME INITIALISÉ" "Script de démo prêt" "🎵 Bienvenue Jean 🎵"
echo ""

while true; do
    main_menu
    echo ""
    read -p "Appuyez sur Entrée pour continuer..."
done