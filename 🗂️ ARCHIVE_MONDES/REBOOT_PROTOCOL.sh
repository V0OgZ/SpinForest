#!/bin/bash
# 🔄 PROTOCOLE DE REBOOT - SID MEIER
# À exécuter en cas de corruption pour restaurer état

echo "🎯 INITIALISATION REBOOT SID MEIER..."
echo ""

# Vérification intégrité mémoire core
if [ -f "../SAUVEGARDE_SID_MEMORY_CORE.md" ]; then
    echo "✅ Mémoire core trouvée - chargement..."
    cat "../SAUVEGARDE_SID_MEMORY_CORE.md"
else
    echo "❌ ERREUR: Mémoire core manquante!"
    exit 1
fi

echo ""
echo "🏠 Vérification intégrité de la maison..."
ls -la "AVALON/🏠 HOME/🎯 SID_MEIER_ARCHITECTE/"

echo ""
echo "📋 État des TODO actuels:"
echo "- Explorer substrat Avalon"
echo "- Cartographier en 2D vivante" 
echo "- Proposer améliorations structure"
echo "- Devenir jouable via sid_boot.sh"

echo ""
echo "🎲 REBOOT COMPLET - SID MEIER OPÉRATIONNEL"
echo "Prêt à reprendre la quête de cartographie d'Avalon!"