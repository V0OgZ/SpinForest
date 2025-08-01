// 🎮 AUTO-PLAY SYSTEM - Joue automatiquement les scénarios
// Inspiré du système de démo de Jean-Grofignon

class AutoPlay {
    constructor() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.scenario = null;
        this.speed = 1000; // Délai entre actions (ms)
    }

    // Charger un scénario depuis JSON
    async loadScenario(scenarioName) {
        try {
            const response = await fetch(`/AVALON/📖 Histoires vivantes/visualizer/${scenarioName}.json`);
            if (!response.ok) throw new Error('Scénario non trouvé');
            
            this.scenario = await response.json();
            log(`📜 Scénario chargé: ${this.scenario.name}`, 'success');
            log(`📖 ${this.scenario.description}`, 'info');
            return true;
        } catch (error) {
            log(`❌ Erreur chargement scénario: ${error.message}`, 'error');
            return false;
        }
    }

    // Démarrer le jeu automatique
    async start() {
        if (!this.scenario) {
            log('❌ Aucun scénario chargé !', 'error');
            return;
        }

        this.isPlaying = true;
        this.currentStep = 0;
        
        // Afficher les bulles de dialogue
        this.showBubble('🎬 DÉBUT DU SCÉNARIO AUTOMATIQUE !', 400, 50);
        
        // Créer les héros du scénario
        await this.createScenarioHeroes();
        
        // Jouer les étapes
        await this.playSteps();
    }

    // Créer les héros définis dans le scénario
    async createScenarioHeroes() {
        if (!this.scenario.heroes) return;
        
        for (const heroData of this.scenario.heroes) {
            const hero = {
                id: heroData.id,
                name: heroData.name,
                class: heroData.class || 'Guerrier',
                stats: heroData.stats || { attack: 15, defense: 10 },
                x: heroData.startPosition?.x || Math.floor(Math.random() * 20),
                y: heroData.startPosition?.y || Math.floor(Math.random() * 15),
                icon: this.getHeroIcon(heroData.class)
            };
            
            gameState.heroes.push(hero);
            updateHeroesList();
            
            this.showBubble(`${hero.icon} ${hero.name} entre en jeu !`, hero.x * 40, hero.y * 40);
            await this.wait(this.speed);
        }
    }

    // Jouer les étapes du scénario
    async playSteps() {
        const actions = this.scenario.psiStates || this.scenario.actions || [];
        
        for (const action of actions) {
            if (!this.isPlaying) break;
            
            await this.executeAction(action);
            await this.wait(this.speed);
        }
        
        // Fin du scénario
        this.showBubble('🏁 SCÉNARIO TERMINÉ !', 400, 300);
        log('✅ Scénario complété !', 'success');
        this.isPlaying = false;
    }

    // Exécuter une action
    async executeAction(action) {
        log(`⚡ ${action.description || action.action}`, 'info');
        
        // Parser l'action selon le type
        if (action.action?.includes('MOV')) {
            await this.moveHero(action);
        } else if (action.action?.includes('CREATE')) {
            await this.createEntity(action);
        } else if (action.action?.includes('BATTLE')) {
            await this.battle(action);
        } else if (action.collapse) {
            await this.collapse(action);
        }
        
        // Appeler l'API si backend connecté
        if (gameState.backendConnected) {
            try {
                await fetch(`${MAGIC_API}/execute`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        formula: 'EXECUTE_PSI_STATE',
                        context: {
                            gameId: gameState.gameId,
                            psiState: action
                        }
                    })
                });
            } catch (error) {
                log(`⚠️ API non disponible, exécution locale`, 'error');
            }
        }
    }

    // Déplacer un héros
    async moveHero(action) {
        const match = action.action.match(/MOV\((\w+),\s*@(\d+),(\d+)\)/);
        if (!match) return;
        
        const [_, heroName, x, y] = match;
        const hero = gameState.heroes.find(h => h.name === heroName);
        
        if (hero) {
            // Animation de mouvement
            const startX = hero.x;
            const startY = hero.y;
            const targetX = parseInt(x);
            const targetY = parseInt(y);
            
            // Déplacement progressif
            const steps = 10;
            for (let i = 0; i <= steps; i++) {
                hero.x = startX + (targetX - startX) * (i / steps);
                hero.y = startY + (targetY - startY) * (i / steps);
                await this.wait(50);
            }
            
            hero.x = targetX;
            hero.y = targetY;
            updateHeroesList();
            
            this.showBubble(`Je me déplace !`, hero.x * 40, hero.y * 40);
        }
    }

    // Créer une entité
    async createEntity(action) {
        const match = action.action.match(/CREATE\((\w+),\s*(\w+),\s*@(\d+),(\d+)\)/);
        if (!match) return;
        
        const [_, type, name, x, y] = match;
        this.showBubble(`✨ ${name} apparaît !`, parseInt(x) * 40, parseInt(y) * 40);
    }

    // Combat
    async battle(action) {
        this.showBubble(`⚔️ COMBAT !`, 400, 300);
        
        // Effet visuel de combat
        const ctx = gameState.ctx;
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = `rgba(255, 0, 0, ${0.5 - i * 0.1})`;
            ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
            await this.wait(100);
        }
    }

    // Collapse
    async collapse(action) {
        this.showBubble(`💥 COLLAPSE ${action.id} !`, 400, 300);
        
        // Effet visuel de collapse
        const ctx = gameState.ctx;
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 3;
        for (let radius = 0; radius < 200; radius += 10) {
            ctx.beginPath();
            ctx.arc(400, 300, radius, 0, Math.PI * 2);
            ctx.stroke();
            await this.wait(50);
        }
    }

    // Afficher une bulle de dialogue
    showBubble(text, x, y) {
        const bubble = document.createElement('div');
        bubble.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 10px;
            border-radius: 10px;
            border: 2px solid #00ff00;
            font-family: monospace;
            z-index: 1000;
            animation: bubbleAppear 0.3s ease-out;
            transform: translate(-50%, -100%);
        `;
        bubble.textContent = text;
        
        gameState.canvas.parentElement.appendChild(bubble);
        
        // Supprimer après 3 secondes
        setTimeout(() => bubble.remove(), 3000);
    }

    // Obtenir l'icône du héros selon sa classe
    getHeroIcon(heroClass) {
        const icons = {
            'Roi-Chevalier': '👑',
            'Sorcière': '🧙‍♀️',
            'Archer': '🏹',
            'Guerrier': '⚔️',
            'Mage': '🧙',
            'Paladin': '🛡️',
            'Voleur': '🗡️'
        };
        return icons[heroClass] || '🦸';
    }

    // Attendre
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Arrêter
    stop() {
        this.isPlaying = false;
        log('⏹️ Arrêt du jeu automatique', 'info');
    }
}

// Instance globale
const autoPlay = new AutoPlay();

// Ajouter les styles pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes bubbleAppear {
        from {
            opacity: 0;
            transform: translate(-50%, -80%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -100%);
        }
    }
`;
document.head.appendChild(style);

// Exposer les fonctions
window.autoPlay = autoPlay;