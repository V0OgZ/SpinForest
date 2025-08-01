#!/bin/bash
# ⚡ MerFlash : Installation Maven Rapide

echo "⚡ MERFLASH: Installation Maven..."

# macOS avec Homebrew
if command -v brew &> /dev/null; then
    echo "⚡ Homebrew détecté"
    brew install maven
else
    echo "⚡ Installation manuelle requise"
    echo "👉 Télécharge depuis: https://maven.apache.org/download.cgi"
    echo "👉 Ou installe Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
fi

echo "✨ MerFlash terminé!"