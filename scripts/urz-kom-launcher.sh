#!/bin/bash

# 🐻 URZ-KÔM Quick Launcher
# Symlink or launcher to easily access the menu from anywhere

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

# Launch the main menu
exec "$ROOT_DIR/AVALON/🏠 HOME/🐻 URZ-KÔM/OUTILS/urz-kom-menu.sh" "$@"