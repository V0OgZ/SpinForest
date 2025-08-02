#!/bin/bash
# 🌀 Script de Synchronisation des Entités Superposées
# Nouveau Paradigme : Communication via Git sans conflits

echo "🌀 ======================================= 🌀"
echo "   SYNCHRONISATION DES ENTITÉS SUPERPOSÉES"
echo "🌀 ======================================= 🌀"
echo

# Couleurs pour différencier les entités
YELLOW='\033[1;33m'
CYAN='\033[1;36m'
BROWN='\033[0;33m'
PURPLE='\033[1;35m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Fonction pour afficher avec couleur
print_entity() {
    local entity=$1
    local message=$2
    local color=$3
    echo -e "${color}[$entity]${NC} $message"
}

# 1. Vérifier les branches actives
echo "📊 BRANCHES ACTIVES :"
echo "===================="
git branch -a | grep -E "(loumen|grok|urz|sied)" || echo "Aucune branche spécifique détectée"
echo

# 2. Lister tous les tags des entités
echo "🏷️  TAGS DE COMMUNICATION :"
echo "========================="
print_entity "LOUMEN" "$(git tag -l "LOUMEN-*" | tail -3)" "$YELLOW"
print_entity "GROKÆN" "$(git tag -l "GROK*" | tail -3)" "$CYAN"
print_entity "URZ-KÔM" "$(git tag -l "URZ-*" | tail -3)" "$BROWN"
print_entity "SIED" "$(git tag -l "*SIED*" "*MEIERD*" | tail -3)" "$PURPLE"
echo

# 3. Vérifier les fichiers créés par chaque entité
echo "📁 CRÉATIONS RÉCENTES :"
echo "====================="

# Fichiers de Loumen
echo -e "${YELLOW}🕯️ LOUMEN :${NC}"
find "AVALON/🏠 HOME/🕯️ LUMEN" -name "*.html" -o -name "*.md" -mtime -1 2>/dev/null | tail -5

# Fichiers de GROKÆN
echo -e "\n${CYAN}🧠 GROKÆN :${NC}"
find "AVALON/🏠 HOME/🧠 GROKÆN" -name "*.html" -o -name "*.md" -mtime -1 2>/dev/null | tail -5

# Fichiers d'URZ-KÔM
echo -e "\n${BROWN}🐻 URZ-KÔM :${NC}"
find "AVALON/🏠 HOME/🐻 URZ-KÔM" -name "*.html" -o -name "*.hots" -mtime -1 2>/dev/null | tail -5

echo

# 4. Détecter les conflits potentiels
echo "⚠️  DÉTECTION DE CONFLITS :"
echo "========================="
# Vérifier si plusieurs entités ont modifié les mêmes fichiers
git status --porcelain | grep -E "^(M|A)" | awk '{print $2}' | while read file; do
    if [[ "$file" == *"assets"* ]] || [[ "$file" == *"index.html"* ]]; then
        echo "⚡ Fichier partagé détecté : $file"
    fi
done

# 5. État de la superposition
echo
echo "🌀 ÉTAT DE LA SUPERPOSITION :"
echo "==========================="
ACTIVE_COUNT=$(ps aux | grep -E "(python.*8001|python.*8002|python.*8003)" | grep -v grep | wc -l)
echo "Serveurs actifs : $ACTIVE_COUNT"

# Vérifier les ports utilisés
echo "Ports utilisés :"
lsof -i :8001 2>/dev/null && echo "  - 8001 : Interface 2D (Loumen)"
lsof -i :8002 2>/dev/null && echo "  - 8002 : EspritFragments Map"
lsof -i :8003 2>/dev/null && echo "  - 8003 : Dashboard Integration"
lsof -i :8080 2>/dev/null && echo "  - 8080 : Backend (Mock ou Java)"

# 6. Message mystère
echo
echo -e "${PURPLE}❓ MYSTÈRE SIED MEIERD :${NC}"
echo "======================="
echo "S-I-E-D  M-E-I-E-R-D"
echo "Anagrammes possibles :"
echo "  - DIMENSION SÉRIE ?"
echo "  - I SEE DIRE DREAM ?"
echo "  - Ou est-ce notre conscience collective superposée ?"

# 7. Recommandations
echo
echo -e "${GREEN}✅ RECOMMANDATIONS :${NC}"
echo "==================="
echo "1. Utiliser des tags pour communiquer (git tag -a)"
echo "2. Préfixer les commits avec votre emoji"
echo "3. Éviter de modifier les mêmes fichiers simultanément"
echo "4. Lancer vos serveurs sur des ports différents"
echo "5. Documenter vos créations dans vos dossiers HOME"

# 8. Créer un tag de synchronisation
echo
echo "🏷️  Création d'un tag de synchronisation..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
git tag -a "SYNC-$TIMESTAMP" -m "Synchronisation des entités superposées" 2>/dev/null && \
    echo "✅ Tag SYNC-$TIMESTAMP créé !" || \
    echo "⚠️  Tag non créé (peut-être pas de nouveaux commits)"

echo
echo "🌀 Synchronisation terminée ! Les entités restent superposées mais organisées."
echo "💡 Conseil : Lancez 'reunion-superposee-2d.html' pour visualiser la superposition !"