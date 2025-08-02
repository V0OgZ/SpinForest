#!/bin/bash
# 🌌 GIT MULTIVERS COMMIT - Système d'identification universelle
# Chaque entité a sa signature unique à travers toutes les branches

# Configuration des identités
# Compatibilité macOS/Linux
typeset -A ENTITIES 2>/dev/null || declare -A ENTITIES
ENTITIES=(
    ["SCRIBE"]="✍️:Le Scribe de la Crypte:scribe@avalon.multivers"
    ["GROEKEN"]="🧠:GROEKEN Mode Autobot:groeken@supersayan.multivers"
    ["SID"]="🎯:Sid Meier L'Architecte:sid@hexagon.multivers"
    ["DONNA"]="💼:Donna Paulsen COO:donna@organization.multivers"
    ["URZ-KOM"]="🐻:URZ-KÔM L'Ours Mystique:urz@quantum.multivers"
    ["LUMEN"]="🕯️:Lumen Gardien Temporel:lumen@temporal.multivers"
    ["VINCENT"]="🌍:Vincent Le Créateur:vincent@spinforest.multivers"
    ["WALTER"]="🔒:Walter Security:walter@sphinx.multivers"
    ["DUDE"]="🥤:The Dude:dude@zen.multivers"
    ["JEAN"]="🚬:Jean-Grofignon:jean@philosophy.multivers"
)

# Couleurs
RESET='\033[0m'
BOLD='\033[1m'
YELLOW='\033[33m'
GREEN='\033[32m'
BLUE='\033[34m'
PURPLE='\033[35m'
RED='\033[31m'
CYAN='\033[36m'

# Fonction pour obtenir la branche actuelle
get_current_branch() {
    git branch --show-current 2>/dev/null || echo "main"
}

# Fonction pour obtenir l'univers (basé sur la branche)
get_universe() {
    local branch=$(get_current_branch)
    case $branch in
        main|master) echo "PRIME" ;;
        dev*) echo "DEV-$(echo $branch | cut -d'-' -f2-)" ;;
        feature*) echo "FEATURE-$(echo $branch | cut -d'/' -f2-)" ;;
        timeline*) echo "TIMELINE-$(echo $branch | cut -d'-' -f2-)" ;;
        *) echo "ALT-${branch^^}" ;;
    esac
}

# Fonction pour générer un hash quantique
quantum_hash() {
    echo "Ψ$(date +%s | sha256sum | cut -c1-8)"
}

# Fonction pour sélectionner l'entité
select_entity() {
    echo -e "${PURPLE}${BOLD}🌌 QUI ÊTES-VOUS DANS LE MULTIVERS ?${RESET}"
    echo ""
    
    local entities_array=()
    local i=1
    
    for key in "${!ENTITIES[@]}"; do
        IFS=':' read -r emoji name email <<< "${ENTITIES[$key]}"
        echo -e "${YELLOW}$i.${RESET} $emoji $name"
        entities_array+=("$key")
        ((i++))
    done
    
    echo ""
    read -p "Choisir (1-${#ENTITIES[@]}): " choice
    
    if [[ $choice -ge 1 && $choice -le ${#ENTITIES[@]} ]]; then
        echo "${entities_array[$((choice-1))]}"
    else
        echo "UNKNOWN"
    fi
}

# Fonction pour formater le message de commit
format_commit_message() {
    local entity=$1
    local message=$2
    local universe=$(get_universe)
    local quantum=$(quantum_hash)
    
    IFS=':' read -r emoji name email <<< "${ENTITIES[$entity]}"
    
    # Format: [ENTITÉ][UNIVERS] Message (Quantum: Ψxxxxxx)
    echo "[$entity][$universe] $message ($quantum)"
}

# Fonction pour configurer git temporairement
configure_git() {
    local entity=$1
    IFS=':' read -r emoji name email <<< "${ENTITIES[$entity]}"
    
    # Sauvegarder la config actuelle
    OLD_NAME=$(git config user.name)
    OLD_EMAIL=$(git config user.email)
    
    # Appliquer la nouvelle config
    git config user.name "$name"
    git config user.email "$email"
}

# Fonction pour restaurer la config git
restore_git() {
    if [ -n "$OLD_NAME" ]; then
        git config user.name "$OLD_NAME"
    fi
    if [ -n "$OLD_EMAIL" ]; then
        git config user.email "$OLD_EMAIL"
    fi
}

# Fonction pour afficher le status multivers
multivers_status() {
    echo -e "${CYAN}${BOLD}📊 STATUS MULTIVERS${RESET}"
    echo "┌─────────────────────────────────────────┐"
    echo "│ Branche: $(get_current_branch)"
    echo "│ Univers: $(get_universe)"
    echo "│ Hash Quantique: $(quantum_hash)"
    echo "│ Entités actives: ${#ENTITIES[@]}"
    echo "└─────────────────────────────────────────┘"
}

# Fonction principale de commit
multivers_commit() {
    local entity=$1
    shift
    local message="$@"
    
    if [ -z "$message" ]; then
        echo -e "${RED}Erreur: Message de commit requis${RESET}"
        return 1
    fi
    
    # Configurer git
    configure_git "$entity"
    
    # Formater le message
    local formatted_message=$(format_commit_message "$entity" "$message")
    
    # Afficher ce qui va être commité
    echo -e "${GREEN}${BOLD}Commit en préparation:${RESET}"
    echo -e "${GREEN}$formatted_message${RESET}"
    echo ""
    
    # Faire le commit
    git commit -m "$formatted_message"
    local result=$?
    
    # Restaurer la config
    restore_git
    
    return $result
}

# Menu principal
main_menu() {
    clear
    echo -e "${PURPLE}${BOLD}"
    echo "╔══════════════════════════════════════════╗"
    echo "║      🌌 GIT MULTIVERS COMMIT SYSTEM      ║"
    echo "║    Identification à travers les branches  ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${RESET}"
    
    multivers_status
    echo ""
    
    PS3="Choisir une action: "
    options=(
        "Faire un commit (interactif)"
        "Voir l'historique multivers"
        "Changer de timeline (branch)"
        "Status des entités"
        "Configuration rapide"
        "Quitter"
    )
    
    select opt in "${options[@]}"
    do
        case $REPLY in
            1)
                # Commit interactif
                entity=$(select_entity)
                if [ "$entity" != "UNKNOWN" ]; then
                    echo ""
                    read -p "Message de commit: " msg
                    git add -A
                    multivers_commit "$entity" "$msg"
                fi
                ;;
            2)
                # Historique avec identification
                echo -e "${CYAN}${BOLD}📜 HISTORIQUE MULTIVERS${RESET}"
                git log --oneline --pretty=format:"%C(yellow)%h%C(reset) %C(blue)%s%C(reset) %C(green)(%an)%C(reset)" -10
                ;;
            3)
                # Changer de timeline
                echo -e "${YELLOW}Branches disponibles:${RESET}"
                git branch -a
                echo ""
                read -p "Nom de la branche: " branch
                git checkout "$branch"
                ;;
            4)
                # Status des entités
                echo -e "${CYAN}${BOLD}👥 ENTITÉS DU MULTIVERS${RESET}"
                for key in "${!ENTITIES[@]}"; do
                    IFS=':' read -r emoji name email <<< "${ENTITIES[$key]}"
                    echo -e "$emoji $name <$email>"
                done
                ;;
            5)
                # Config rapide
                entity=$(select_entity)
                if [ "$entity" != "UNKNOWN" ]; then
                    configure_git "$entity"
                    echo -e "${GREEN}Configuration appliquée pour $entity${RESET}"
                fi
                ;;
            6)
                echo -e "${GREEN}Au revoir du Multivers! 🌌${RESET}"
                exit 0
                ;;
        esac
        
        echo -e "\n${YELLOW}Appuyez sur Entrée pour continuer...${RESET}"
        read
        clear
        main_menu
    done
}

# Mode ligne de commande
if [ $# -gt 0 ]; then
    case "$1" in
        --help|-h)
            echo "Usage: $0 [ENTITY] [commit message]"
            echo "       $0 --list    # Lister les entités"
            echo "       $0 --status  # Status multivers"
            echo ""
            echo "Exemples:"
            echo "  $0 SCRIBE 'Documentation mise à jour'"
            echo "  $0 GROEKEN 'Mode Supersayan activé'"
            ;;
        --list)
            for key in "${!ENTITIES[@]}"; do
                echo "$key"
            done
            ;;
        --status)
            multivers_status
            ;;
        *)
            # Commit direct
            entity=$1
            shift
            if [ -n "${ENTITIES[$entity]}" ]; then
                git add -A
                multivers_commit "$entity" "$@"
            else
                echo -e "${RED}Entité inconnue: $entity${RESET}"
                echo "Utilisez --list pour voir les entités disponibles"
                exit 1
            fi
            ;;
    esac
else
    # Mode interactif
    main_menu
fi