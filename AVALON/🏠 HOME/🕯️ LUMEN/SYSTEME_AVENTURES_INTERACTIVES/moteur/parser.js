// 📖 PARSER DE SCÉNARIOS - Transforme les histoires en aventures vivantes

class ScenarioParser {
    constructor() {
        this.scenarioCache = new Map();
    }
    
    async parse(scenarioData) {
        // Si c'est un fichier .hots, le convertir
        if (scenarioData.format === 'hots') {
            return this.parseHOTS(scenarioData);
        }
        
        // Format JSON natif
        return this.validateAndProcess(scenarioData);
    }
    
    parseHOTS(hotsData) {
        // Convertir le format HOTS en structure de jeu
        const scenario = {
            id: hotsData.id || 'scenario_' + Date.now(),
            title: hotsData.title || 'Aventure Sans Nom',
            description: hotsData.description || '',
            author: hotsData.author || 'Anonyme',
            version: hotsData.version || '1.0',
            startScene: hotsData.startScene || 'intro',
            scenes: {}
        };
        
        // Parser les scènes du format HOTS
        if (hotsData.phases) {
            hotsData.phases.forEach((phase, index) => {
                const sceneId = phase.id || `scene_${index}`;
                scenario.scenes[sceneId] = this.parsePhaseToScene(phase);
            });
        }
        
        return scenario;
    }
    
    parsePhaseToScene(phase) {
        const scene = {
            id: phase.id,
            title: phase.name || 'Scène',
            text: this.extractNarrative(phase),
            background: phase.background || 'default',
            music: phase.music || null,
            choices: [],
            elements: [],
            conditions: []
        };
        
        // Extraire les choix
        if (phase.actions) {
            scene.choices = phase.actions.map(action => ({
                id: action.id,
                text: action.text || action.description,
                nextScene: action.nextPhase || action.target,
                effects: this.parseEffects(action),
                condition: action.condition || null,
                preview: action.preview || null
            }));
        }
        
        // Extraire les éléments interactifs
        if (phase.elements) {
            scene.elements = phase.elements.map(elem => ({
                id: elem.id,
                type: elem.type,
                position: elem.position || { x: 100, y: 100 },
                sprite: elem.sprite,
                interaction: this.parseInteraction(elem)
            }));
        }
        
        // Conditions d'entrée
        if (phase.requirements) {
            scene.conditions = phase.requirements;
        }
        
        return scene;
    }
    
    extractNarrative(phase) {
        // Extraire le texte narratif depuis différentes sources possibles
        if (phase.narrative) return phase.narrative;
        if (phase.description) return phase.description;
        if (phase.text) return phase.text;
        
        // Construire à partir des dialogues
        if (phase.dialogues) {
            return phase.dialogues.map(d => 
                `<strong>${d.character}:</strong> ${d.text}`
            ).join('<br><br>');
        }
        
        return "Vous êtes ici...";
    }
    
    parseEffects(action) {
        const effects = {};
        
        // Effets standards
        if (action.karma !== undefined) effects.karma = action.karma;
        if (action.wisdom !== undefined) effects.wisdom = action.wisdom;
        if (action.health !== undefined) effects.health = action.health;
        
        // Items
        if (action.giveItem) effects.addItem = action.giveItem;
        if (action.removeItem) effects.removeItem = action.removeItem;
        
        // Flags
        if (action.setFlag) effects.setFlag = action.setFlag;
        if (action.removeFlag) effects.removeFlag = action.removeFlag;
        
        // Compagnons
        if (action.addCompanion) effects.companion = action.addCompanion;
        
        // Effets spéciaux
        if (action.special) effects.special = action.special;
        
        return effects;
    }
    
    parseInteraction(element) {
        if (!element.interaction) return null;
        
        const interaction = {
            type: element.interaction.type || 'examine',
            hint: element.interaction.hint || 'Examiner'
        };
        
        switch (interaction.type) {
            case 'dialogue':
                interaction.character = element.interaction.character;
                interaction.text = element.interaction.text;
                break;
            case 'pickup':
                interaction.item = element.interaction.item;
                interaction.itemName = element.interaction.itemName;
                break;
            case 'portal':
                interaction.destination = element.interaction.destination;
                break;
            case 'puzzle':
                interaction.puzzleId = element.interaction.puzzleId;
                break;
        }
        
        return interaction;
    }
    
    validateAndProcess(scenarioData) {
        // Valider la structure
        if (!scenarioData.scenes || !scenarioData.startScene) {
            throw new Error("Structure de scénario invalide");
        }
        
        // Vérifier que toutes les scènes référencées existent
        Object.values(scenarioData.scenes).forEach(scene => {
            if (scene.choices) {
                scene.choices.forEach(choice => {
                    if (choice.nextScene && !scenarioData.scenes[choice.nextScene]) {
                        console.warn(`Scène manquante: ${choice.nextScene}`);
                        choice.nextScene = 'error_scene';
                    }
                });
            }
        });
        
        // Ajouter des scènes par défaut si nécessaire
        if (!scenarioData.scenes.error_scene) {
            scenarioData.scenes.error_scene = {
                id: 'error_scene',
                title: 'Erreur',
                text: 'Quelque chose s\'est mal passé. La timeline est corrompue.',
                choices: [{
                    id: 'restart',
                    text: 'Recommencer',
                    nextScene: scenarioData.startScene
                }]
            };
        }
        
        if (!scenarioData.scenes.game_over) {
            scenarioData.scenes.game_over = {
                id: 'game_over',
                title: 'Fin',
                text: 'Votre aventure se termine ici... pour le moment.',
                choices: [{
                    id: 'restart',
                    text: 'Recommencer',
                    nextScene: scenarioData.startScene
                }]
            };
        }
        
        return scenarioData;
    }
    
    // Convertisseur pour les vieux fichiers
    async convertLegacyScenario(filePath) {
        try {
            const response = await fetch(filePath);
            const text = await response.text();
            
            // Détecter le format
            if (text.includes('SCENARIO:') || text.includes('PHASE:')) {
                return this.parseLegacyHOTS(text);
            }
            
            // Essayer comme JSON
            try {
                return JSON.parse(text);
            } catch {
                console.error("Format de scénario non reconnu");
                return null;
            }
        } catch (error) {
            console.error("Erreur conversion:", error);
            return null;
        }
    }
    
    parseLegacyHOTS(text) {
        const lines = text.split('\n');
        const scenario = {
            id: 'legacy_' + Date.now(),
            title: 'Scénario Importé',
            scenes: {},
            startScene: 'scene_0'
        };
        
        let currentScene = null;
        let sceneCount = 0;
        
        lines.forEach(line => {
            line = line.trim();
            
            if (line.startsWith('SCENARIO:')) {
                scenario.title = line.substring(9).trim();
            } else if (line.startsWith('PHASE:')) {
                if (currentScene) {
                    scenario.scenes[currentScene.id] = currentScene;
                }
                currentScene = {
                    id: `scene_${sceneCount++}`,
                    title: line.substring(6).trim(),
                    text: '',
                    choices: []
                };
            } else if (line.startsWith('TEXT:')) {
                if (currentScene) {
                    currentScene.text = line.substring(5).trim();
                }
            } else if (line.startsWith('CHOICE:')) {
                if (currentScene) {
                    const parts = line.substring(7).split('->');
                    currentScene.choices.push({
                        id: `choice_${currentScene.choices.length}`,
                        text: parts[0].trim(),
                        nextScene: `scene_${sceneCount}` // Approximation
                    });
                }
            }
        });
        
        if (currentScene) {
            scenario.scenes[currentScene.id] = currentScene;
        }
        
        return scenario;
    }
}