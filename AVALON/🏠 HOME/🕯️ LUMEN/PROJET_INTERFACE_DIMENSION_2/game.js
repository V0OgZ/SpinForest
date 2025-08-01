// 🌟 AVALON INTERFACE DIMENSION 2 - WALTER API V2
// Pas de saloperie en dur, que des appels backend !

const API_BASE = 'http://localhost:8080';
const MAGIC_API = `${API_BASE}/api/magic-formulas`;
const GAME_API = `${API_BASE}/api/game`;
const TEMPORAL_API = `${API_BASE}/api/temporal`;

// État global
let gameState = {
    canvas: null,
    ctx: null,
    selectedHero: null,
    heroes: [],
    mapData: null,
    backendConnected: false,
    gameId: null,
    lastFps: 0,
    mousePos: { x: 0, y: 0 }
};

// Images disponibles
const IMAGES = {
    merlin: '/AVALON/💠 Essences scellées/🖼️ Ymagerie/Merlin/Mystic Scribe and Holographic Wizard.png',
    map: '/assets/bmap-SpinForest.png',
    mapSmall: '/assets/smap-SpinForest.png',
    paladin: '/AVALON/💠 Essences scellées/🖼️ Ymagerie/Class/Paladin/Paladin dans les plaines dorées.png',
    mage: '/AVALON/💠 Essences scellées/🖼️ Ymagerie/Class/Mage/Dystopian Guardian in Neon Twilight.png'
};

// Console de log
function log(message, type = 'info') {
    const console = document.getElementById('console');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    console.appendChild(line);
    console.scrollTop = console.scrollHeight;
}

// Initialisation
window.onload = async function() {
    log('🌀 Initialisation Dimension 2...', 'info');
    
    gameState.canvas = document.getElementById('gameCanvas');
    gameState.ctx = gameState.canvas.getContext('2d');
    
    // Setup canvas events
    gameState.canvas.addEventListener('click', handleCanvasClick);
    gameState.canvas.addEventListener('mousemove', handleMouseMove);
    
    // Charger les héros depuis le backend
    await loadHeroes();
    
    // Tester la connexion backend (optionnel)
    connectBackend().catch(() => {
        log('⚠️ Mode hors-ligne, backend non disponible', 'error');
    });
    
    // Démarrer le rendu
    startGameLoop();
    
    // Cacher le loading
    document.getElementById('loading').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'grid';
    
    log('✅ Interface Dimension 2 prête !', 'success');
};

// Connexion au backend
async function connectBackend() {
    try {
        log('🔌 Connexion au backend...', 'info');
        
        // Test de santé
        const response = await fetch(`${API_BASE}/actuator/health`);
        if (response.ok) {
            gameState.backendConnected = true;
            document.getElementById('backendStatus').textContent = '✅ Connecté';
            log('✅ Backend connecté !', 'success');
            
            // Créer une game de test
            await createTestGame();
        } else {
            throw new Error('Backend non disponible');
        }
    } catch (error) {
        gameState.backendConnected = false;
        document.getElementById('backendStatus').textContent = '❌ Déconnecté';
        log(`❌ Erreur connexion: ${error.message}`, 'error');
    }
}

// Créer une game de test
async function createTestGame() {
    try {
        const response = await fetch(`${GAME_API}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Avalon Dimension 2',
                playerId: 'loumen'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            gameState.gameId = data.id;
            log(`🎮 Game créée: ${gameState.gameId}`, 'success');
        }
    } catch (error) {
        log(`❌ Erreur création game: ${error.message}`, 'error');
    }
}

// Charger les héros
async function loadHeroes() {
    try {
        // D'abord essayer depuis le backend
        if (gameState.backendConnected && gameState.gameId) {
            const response = await fetch(`${GAME_API}/${gameState.gameId}`);
            if (response.ok) {
                const data = await response.json();
                gameState.heroes = data.heroes || [];
                updateHeroesList();
                return;
            }
        }
        
        // Sinon charger depuis le JSON local
        const response = await fetch('/AVALON/💠 Essences scellées/🧙 Heroes/epic/epic-heroes.json');
        if (response.ok) {
            const data = await response.json();
            gameState.heroes = data.epic_heroes.slice(0, 5); // Prendre les 5 premiers
            updateHeroesList();
            log(`📚 ${gameState.heroes.length} héros chargés`, 'info');
        }
    } catch (error) {
        log(`❌ Erreur chargement héros: ${error.message}`, 'error');
    }
}

// Mettre à jour la liste des héros
function updateHeroesList() {
    const heroesList = document.getElementById('heroesList');
    heroesList.innerHTML = '';
    
    gameState.heroes.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-card';
        card.onclick = () => selectHero(hero);
        
        card.innerHTML = `
            <h3>${hero.name}</h3>
            <p>🏛️ ${hero.class || 'Inconnu'}</p>
            <p>⚔️ Attaque: ${hero.stats?.attack || 10}</p>
            <p>🛡️ Défense: ${hero.stats?.defense || 10}</p>
            <p>📍 Position: ${hero.x || 0}, ${hero.y || 0}</p>
        `;
        
        heroesList.appendChild(card);
    });
}

// Sélectionner un héros
function selectHero(hero) {
    gameState.selectedHero = hero;
    document.getElementById('activeHero').textContent = hero.name;
    
    // Mettre à jour l'UI
    document.querySelectorAll('.hero-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    log(`🦸 Héros sélectionné: ${hero.name}`, 'info');
}

// Créer un nouveau héros
async function createNewHero() {
    const name = prompt('Nom du héros:');
    if (!name) return;
    
    const newHero = {
        id: `hero_${Date.now()}`,
        name: name,
        class: 'Mage',
        stats: {
            attack: 15,
            defense: 10,
            spellPower: 20,
            knowledge: 15
        },
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
    };
    
    if (gameState.backendConnected) {
        try {
            // Appeler l'API pour créer le héros
            const response = await fetch(`${MAGIC_API}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formula: 'CREATE_HERO',
                    context: {
                        gameId: gameState.gameId,
                        hero: newHero
                    }
                })
            });
            
            if (response.ok) {
                log(`✅ Héros créé via API: ${name}`, 'success');
            }
        } catch (error) {
            log(`❌ Erreur API: ${error.message}`, 'error');
        }
    }
    
    // Ajouter localement
    gameState.heroes.push(newHero);
    updateHeroesList();
    selectHero(newHero);
}

// Charger un scénario
async function loadScenario() {
    if (!gameState.backendConnected) {
        log('❌ Backend non connecté !', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${GAME_API}/demo`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const data = await response.json();
            log('📜 Scénario démo chargé !', 'success');
            await loadHeroes(); // Recharger les héros
        }
    } catch (error) {
        log(`❌ Erreur chargement scénario: ${error.message}`, 'error');
    }
}

// Téléporter le héros
async function teleportHero() {
    if (!gameState.selectedHero) {
        log('❌ Aucun héros sélectionné !', 'error');
        return;
    }
    
    const x = prompt('Position X:', '10');
    const y = prompt('Position Y:', '10');
    
    if (!x || !y) return;
    
    if (gameState.backendConnected) {
        try {
            const response = await fetch(`${MAGIC_API}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formula: 'TELEPORT_HERO',
                    context: {
                        gameId: gameState.gameId,
                        heroId: gameState.selectedHero.id,
                        x: parseInt(x),
                        y: parseInt(y)
                    }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                log(`🌀 ${data.message}`, 'success');
            }
        } catch (error) {
            log(`❌ Erreur téléportation: ${error.message}`, 'error');
        }
    }
    
    // Mettre à jour localement
    gameState.selectedHero.x = parseInt(x);
    gameState.selectedHero.y = parseInt(y);
    updateHeroesList();
}

// Exécuter une formule magique
async function executeFormula() {
    const formula = prompt('Nom de la formule:', 'HEAL_HERO');
    if (!formula) return;
    
    try {
        const response = await fetch(`${MAGIC_API}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                formula: formula,
                context: {
                    gameId: gameState.gameId,
                    heroId: gameState.selectedHero?.id
                }
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            log(`🔮 ${data.message}`, 'success');
            
            // Afficher le résultat runique
            if (data.runicInterpretation) {
                log(`📜 ${data.runicInterpretation}`, 'info');
            }
        }
    } catch (error) {
        log(`❌ Erreur formule: ${error.message}`, 'error');
    }
}

// Gestion du clic sur le canvas
function handleCanvasClick(event) {
    const rect = gameState.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const gridX = Math.floor(x / 40);
    const gridY = Math.floor(y / 40);
    
    if (gameState.selectedHero) {
        // Déplacer le héros
        gameState.selectedHero.x = gridX;
        gameState.selectedHero.y = gridY;
        updateHeroesList();
        log(`📍 ${gameState.selectedHero.name} déplacé en ${gridX}, ${gridY}`, 'info');
    }
}

// Gestion du mouvement de souris
function handleMouseMove(event) {
    const rect = gameState.canvas.getBoundingClientRect();
    gameState.mousePos.x = event.clientX - rect.left;
    gameState.mousePos.y = event.clientY - rect.top;
    
    const gridX = Math.floor(gameState.mousePos.x / 40);
    const gridY = Math.floor(gameState.mousePos.y / 40);
    document.getElementById('position').textContent = `${gridX}, ${gridY}`;
}

// Boucle de rendu
function startGameLoop() {
    let lastTime = 0;
    
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Calculer FPS
        if (deltaTime > 0) {
            gameState.lastFps = Math.round(1000 / deltaTime);
            document.getElementById('fps').textContent = gameState.lastFps;
        }
        
        // Rendu
        render();
        
        requestAnimationFrame(gameLoop);
    }
    
    requestAnimationFrame(gameLoop);
}

// Fonction de rendu
function render() {
    const ctx = gameState.ctx;
    const canvas = gameState.canvas;
    
    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grille
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Dessiner les héros
    gameState.heroes.forEach(hero => {
        const x = (hero.x || 0) * 40;
        const y = (hero.y || 0) * 40;
        
        // Carré du héros
        ctx.fillStyle = hero === gameState.selectedHero ? '#00ffff' : '#00ff00';
        ctx.fillRect(x + 5, y + 5, 30, 30);
        
        // Nom
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText(hero.name, x + 2, y - 2);
    });
    
    // Curseur
    const gridX = Math.floor(gameState.mousePos.x / 40);
    const gridY = Math.floor(gameState.mousePos.y / 40);
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(gridX * 40, gridY * 40, 40, 40);
}

// Exposer les fonctions globales
window.connectBackend = connectBackend;
window.createNewHero = createNewHero;
window.loadScenario = loadScenario;
window.teleportHero = teleportHero;
window.executeFormula = executeFormula;