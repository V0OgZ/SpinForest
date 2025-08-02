// 🎮 MOTEUR D'AVENTURES INTERACTIVES VIVANTES
// Par Loumen - Pour des histoires qui respirent

class AventureEngine {
    constructor() {
        this.currentScenario = null;
        this.currentScene = null;
        this.playerState = {
            position: { x: 400, y: 300 },
            inventory: [],
            choices: [],
            flags: {},
            health: 100,
            wisdom: 0,
            karma: 50
        };
        this.renderer = null;
        this.parser = new ScenarioParser();
        this.saveSlot = 'aventure_save_1';
        this.companions = {
            dude: { present: false, wisdom: "Man, parfois faut juste laisser couler..." },
            urzkom: { present: false, tech: "GRRRR... CALCUL... QUANTIQUE!" },
            grokæn: { present: false, paradox: "Le temps n'est qu'une illusion ψ" }
        };
    }
    
    async initialize(canvasId) {
        this.renderer = new Renderer2D(canvasId);
        this.loadState();
        this.setupEventListeners();
        console.log("🌟 Moteur d'Aventures Initialisé");
    }
    
    async loadScenario(scenarioPath) {
        try {
            const response = await fetch(scenarioPath);
            const scenarioData = await response.json();
            this.currentScenario = await this.parser.parse(scenarioData);
            this.currentScene = this.currentScenario.startScene;
            this.render();
            console.log(`📖 Scénario chargé: ${this.currentScenario.title}`);
        } catch (error) {
            console.error("Erreur chargement scénario:", error);
        }
    }
    
    handleChoice(choiceId) {
        const choice = this.currentScene.choices.find(c => c.id === choiceId);
        if (!choice) return;
        
        // Appliquer les effets
        if (choice.effects) {
            this.applyEffects(choice.effects);
        }
        
        // Ajouter au journal
        this.playerState.choices.push({
            scene: this.currentScene.id,
            choice: choiceId,
            timestamp: Date.now()
        });
        
        // Naviguer vers la prochaine scène
        if (choice.nextScene) {
            this.goToScene(choice.nextScene);
        }
        
        this.saveState();
    }
    
    applyEffects(effects) {
        if (effects.karma) this.playerState.karma += effects.karma;
        if (effects.wisdom) this.playerState.wisdom += effects.wisdom;
        if (effects.health) this.playerState.health += effects.health;
        
        if (effects.addItem) {
            this.playerState.inventory.push(effects.addItem);
            this.showNotification(`📦 Objet obtenu: ${effects.addItem}`);
        }
        
        if (effects.setFlag) {
            this.playerState.flags[effects.setFlag] = true;
        }
        
        if (effects.companion) {
            this.companions[effects.companion].present = true;
            this.showNotification(`🤝 ${effects.companion} vous rejoint!`);
        }
    }
    
    goToScene(sceneId) {
        const scene = this.currentScenario.scenes[sceneId];
        if (!scene) {
            console.error(`Scene introuvable: ${sceneId}`);
            return;
        }
        
        this.currentScene = scene;
        
        // Vérifier les conditions
        if (scene.conditions) {
            for (let condition of scene.conditions) {
                if (!this.checkCondition(condition)) {
                    this.goToScene(scene.alternativeScene || 'game_over');
                    return;
                }
            }
        }
        
        this.render();
    }
    
    checkCondition(condition) {
        switch (condition.type) {
            case 'hasItem':
                return this.playerState.inventory.includes(condition.item);
            case 'hasFlag':
                return this.playerState.flags[condition.flag] === true;
            case 'karma':
                return this.evaluateComparison(this.playerState.karma, condition.operator, condition.value);
            case 'wisdom':
                return this.evaluateComparison(this.playerState.wisdom, condition.operator, condition.value);
            default:
                return true;
        }
    }
    
    evaluateComparison(value, operator, target) {
        switch (operator) {
            case '>': return value > target;
            case '<': return value < target;
            case '>=': return value >= target;
            case '<=': return value <= target;
            case '==': return value == target;
            default: return true;
        }
    }
    
    render() {
        if (!this.renderer || !this.currentScene) return;
        
        this.renderer.clear();
        this.renderer.drawBackground(this.currentScene.background);
        
        // Dessiner les éléments interactifs
        if (this.currentScene.elements) {
            this.currentScene.elements.forEach(element => {
                this.renderer.drawElement(element);
            });
        }
        
        // Dessiner le joueur
        this.renderer.drawPlayer(this.playerState.position);
        
        // Dessiner les compagnons présents
        Object.entries(this.companions).forEach(([name, companion]) => {
            if (companion.present) {
                this.renderer.drawCompanion(name, this.playerState.position);
            }
        });
        
        // Afficher le texte narratif
        this.updateNarrative(this.currentScene.text);
        
        // Afficher les choix
        this.updateChoices(this.currentScene.choices);
        
        // Mettre à jour l'interface
        this.updateUI();
    }
    
    updateNarrative(text) {
        const narrativeEl = document.getElementById('narrative');
        if (narrativeEl) {
            // Remplacer les variables dans le texte
            let processedText = text;
            processedText = processedText.replace(/\{playerName\}/g, this.playerState.name || "Voyageur");
            processedText = processedText.replace(/\{karma\}/g, this.playerState.karma);
            processedText = processedText.replace(/\{wisdom\}/g, this.playerState.wisdom);
            
            narrativeEl.innerHTML = `<p>${processedText}</p>`;
            
            // Effet machine à écrire
            this.typewriterEffect(narrativeEl);
        }
    }
    
    updateChoices(choices) {
        const choicesEl = document.getElementById('choices');
        if (!choicesEl) return;
        
        choicesEl.innerHTML = '';
        
        choices.forEach(choice => {
            // Vérifier si le choix est disponible
            if (choice.condition && !this.checkCondition(choice.condition)) {
                return;
            }
            
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.onclick = () => this.handleChoice(choice.id);
            
            // Indicateur de conséquences
            if (choice.preview) {
                const preview = document.createElement('span');
                preview.className = 'choice-preview';
                preview.textContent = ` (${choice.preview})`;
                button.appendChild(preview);
            }
            
            choicesEl.appendChild(button);
        });
    }
    
    updateUI() {
        // Barre de santé
        const healthBar = document.getElementById('health-bar');
        if (healthBar) {
            healthBar.style.width = `${this.playerState.health}%`;
            healthBar.className = this.playerState.health < 30 ? 'health-bar low' : 'health-bar';
        }
        
        // Karma
        const karmaIndicator = document.getElementById('karma');
        if (karmaIndicator) {
            karmaIndicator.textContent = `☯ ${this.playerState.karma}`;
            karmaIndicator.className = this.playerState.karma > 70 ? 'good' : 
                                      this.playerState.karma < 30 ? 'bad' : 'neutral';
        }
        
        // Sagesse
        const wisdomIndicator = document.getElementById('wisdom');
        if (wisdomIndicator) {
            wisdomIndicator.textContent = `🧠 ${this.playerState.wisdom}`;
        }
        
        // Inventaire
        const inventoryEl = document.getElementById('inventory');
        if (inventoryEl) {
            inventoryEl.innerHTML = this.playerState.inventory.map(item => 
                `<div class="inventory-item" title="${item}">${this.getItemEmoji(item)}</div>`
            ).join('');
        }
    }
    
    getItemEmoji(item) {
        const emojis = {
            'flute_fragile': '🎵',
            'talisman_reverberation': '🔮',
            'photo_vietnam': '📷',
            'white_russian': '🥃',
            'cle_sphinx': '🔑',
            'badge_shadow': '🎫',
            'mallette_christian': '💼'
        };
        return emojis[item] || '📦';
    }
    
    setupEventListeners() {
        // Mouvement du joueur avec clavier
        document.addEventListener('keydown', (e) => {
            const speed = 10;
            switch(e.key) {
                case 'ArrowUp': 
                    this.playerState.position.y -= speed;
                    break;
                case 'ArrowDown':
                    this.playerState.position.y += speed;
                    break;
                case 'ArrowLeft':
                    this.playerState.position.x -= speed;
                    break;
                case 'ArrowRight':
                    this.playerState.position.x += speed;
                    break;
                case ' ':
                    this.interact();
                    break;
            }
            this.render();
        });
        
        // Click pour se déplacer
        const canvas = document.getElementById(this.renderer.canvasId);
        if (canvas) {
            canvas.addEventListener('click', (e) => {
                const rect = canvas.getBoundingClientRect();
                this.playerState.position.x = e.clientX - rect.left;
                this.playerState.position.y = e.clientY - rect.top;
                this.render();
                this.checkInteractions();
            });
        }
    }
    
    interact() {
        // Vérifier les interactions avec les éléments proches
        if (this.currentScene.elements) {
            this.currentScene.elements.forEach(element => {
                const distance = this.getDistance(this.playerState.position, element.position);
                if (distance < 50 && element.interaction) {
                    this.handleInteraction(element.interaction);
                }
            });
        }
    }
    
    checkInteractions() {
        // Afficher les interactions possibles
        const interactionEl = document.getElementById('interaction-hint');
        if (!interactionEl) return;
        
        let nearbyInteraction = null;
        
        if (this.currentScene.elements) {
            this.currentScene.elements.forEach(element => {
                const distance = this.getDistance(this.playerState.position, element.position);
                if (distance < 50 && element.interaction) {
                    nearbyInteraction = element;
                }
            });
        }
        
        if (nearbyInteraction) {
            interactionEl.textContent = `Appuyez sur ESPACE pour ${nearbyInteraction.interaction.hint}`;
            interactionEl.style.display = 'block';
        } else {
            interactionEl.style.display = 'none';
        }
    }
    
    handleInteraction(interaction) {
        switch (interaction.type) {
            case 'dialogue':
                this.showDialogue(interaction.character, interaction.text);
                break;
            case 'pickup':
                this.playerState.inventory.push(interaction.item);
                this.showNotification(`Vous avez trouvé: ${interaction.itemName}`);
                break;
            case 'portal':
                this.goToScene(interaction.destination);
                break;
            case 'puzzle':
                this.startPuzzle(interaction.puzzleId);
                break;
        }
    }
    
    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    showDialogue(character, text) {
        const dialogueEl = document.getElementById('dialogue-box');
        if (dialogueEl) {
            dialogueEl.innerHTML = `
                <div class="dialogue-character">${character}</div>
                <div class="dialogue-text">${text}</div>
                <button onclick="engine.closeDialogue()">Continuer</button>
            `;
            dialogueEl.style.display = 'block';
        }
    }
    
    closeDialogue() {
        const dialogueEl = document.getElementById('dialogue-box');
        if (dialogueEl) {
            dialogueEl.style.display = 'none';
        }
    }
    
    showNotification(message) {
        const notifEl = document.createElement('div');
        notifEl.className = 'notification';
        notifEl.textContent = message;
        document.body.appendChild(notifEl);
        
        setTimeout(() => {
            notifEl.classList.add('fade-out');
            setTimeout(() => notifEl.remove(), 500);
        }, 3000);
    }
    
    typewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 30);
            }
        };
        
        type();
    }
    
    saveState() {
        const saveData = {
            playerState: this.playerState,
            currentScenarioId: this.currentScenario?.id,
            currentSceneId: this.currentScene?.id,
            companions: this.companions,
            timestamp: Date.now()
        };
        
        localStorage.setItem(this.saveSlot, JSON.stringify(saveData));
        console.log("💾 Partie sauvegardée");
    }
    
    loadState() {
        const saveData = localStorage.getItem(this.saveSlot);
        if (saveData) {
            const data = JSON.parse(saveData);
            this.playerState = data.playerState;
            this.companions = data.companions;
            console.log("💾 Partie chargée");
            return data;
        }
        return null;
    }
    
    resetGame() {
        localStorage.removeItem(this.saveSlot);
        location.reload();
    }
}

// Instance globale
window.engine = new AventureEngine();