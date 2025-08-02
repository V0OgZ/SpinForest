// 🎮 MOTEUR DE CARTE ISOMÉTRIQUE - HEROES OF TIME
// Gestion avancée des cartes, brouillard causal et déplacements

class IsoMapEngine {
    constructor(canvas, backendUrl = 'http://localhost:8080') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.backendUrl = backendUrl;
        
        // Configuration ISO
        this.tileWidth = 128;
        this.tileHeight = 64;
        
        // État du jeu
        this.gameState = {
            map: null,
            hero: null,
            camera: { x: 0, y: 0, zoom: 1 },
            fog: new Map(), // Utilise Map pour performance
            selectedTile: null,
            hoveredTile: null,
            path: [],
            history: [],
            temporalLocks: new Set(),
            activeEffects: [],
            particles: []
        };
        
        // Configuration
        this.config = {
            maxUndoSteps: 10,
            fogRadius: 2,
            animationSpeed: 1,
            showGrid: false,
            showCoordinates: false
        };
        
        // Cache des images
        this.imageCache = new Map();
        this.tileCache = new Map();
        
        // Pathfinding
        this.pathfinder = new Pathfinder(this);
        
        // Initialiser les événements
        this.setupEventListeners();
    }
    
    // INITIALISATION
    async initialize(mapId = 'fragments_001') {
        try {
            // Charger la carte
            this.gameState.map = await this.loadMap(mapId);
            
            // Initialiser le héros
            this.initializeHero();
            
            // Révéler la zone de départ
            this.revealInitialArea();
            
            // Centrer la caméra
            this.centerCameraOnHero();
            
            // Démarrer le rendu
            this.startRenderLoop();
            
            return true;
        } catch (error) {
            console.error("Erreur initialisation:", error);
            return false;
        }
    }
    
    // CHARGEMENT DE CARTE
    async loadMap(mapId) {
        try {
            // Essayer le backend d'abord
            const response = await fetch(`${this.backendUrl}/api/map/${mapId}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log("Backend indisponible, chargement local");
        }
        
        // Charger depuis le fichier local
        const localResponse = await fetch(`./maps/${mapId}.json`);
        return await localResponse.json();
    }
    
    // CONVERSION DE COORDONNÉES
    cartToIso(x, y, z = 0) {
        const isoX = (x - y) * this.tileWidth / 2;
        const isoY = (x + y) * this.tileHeight / 2 - z * 20;
        return { x: isoX, y: isoY };
    }
    
    isoToCart(isoX, isoY) {
        const x = (isoX / (this.tileWidth / 2) + isoY / (this.tileHeight / 2)) / 2;
        const y = (isoY / (this.tileHeight / 2) - isoX / (this.tileWidth / 2)) / 2;
        return { 
            x: Math.floor(x), 
            y: Math.floor(y) 
        };
    }
    
    screenToWorld(screenX, screenY) {
        const worldX = (screenX - this.gameState.camera.x) / this.gameState.camera.zoom;
        const worldY = (screenY - this.gameState.camera.y) / this.gameState.camera.zoom;
        return this.isoToCart(worldX, worldY);
    }
    
    // GESTION DU HÉROS
    initializeHero() {
        const startPos = this.gameState.map.starting_position;
        this.gameState.hero = {
            id: startPos.hero.id,
            name: startPos.hero.name,
            x: startPos.tile[0] + this.gameState.map.platforms[0].position.x,
            y: startPos.tile[1] + this.gameState.map.platforms[0].position.y,
            z: 0,
            movePoints: startPos.hero.movement,
            maxMovePoints: startPos.hero.movement,
            temporalCharges: startPos.hero.temporal_charges,
            facing: 'SE',
            moving: false,
            inventory: [],
            effects: []
        };
    }
    
    // BROUILLARD DE CAUSALITÉ
    revealInitialArea() {
        const platforms = this.gameState.map.fog_of_causality.initial_revealed;
        platforms.forEach(platformId => {
            const platform = this.gameState.map.platforms.find(p => p.id === platformId);
            if (platform) {
                this.revealPlatform(platform);
            }
        });
    }
    
    revealPlatform(platform) {
        const px = platform.position.x;
        const py = platform.position.y;
        
        for (let x = 0; x < platform.size.w; x++) {
            for (let y = 0; y < platform.size.h; y++) {
                this.revealTile(px + x, py + y);
            }
        }
    }
    
    revealTile(x, y, state = 'revealed') {
        const key = `${x},${y}`;
        const currentState = this.gameState.fog.get(key);
        
        // Ne pas écraser un état collapsed
        if (currentState === 'collapsed') return;
        
        this.gameState.fog.set(key, state);
        
        // Effet visuel de révélation
        this.addRevealEffect(x, y);
    }
    
    revealArea(centerX, centerY, radius) {
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist <= radius) {
                    this.revealTile(centerX + dx, centerY + dy);
                }
            }
        }
    }
    
    collapseCausalArea(x, y, radius = 1) {
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const key = `${x + dx},${y + dy}`;
                if (this.gameState.fog.has(key)) {
                    this.gameState.fog.set(key, 'collapsed');
                    this.gameState.temporalLocks.add(key);
                }
            }
        }
        
        // Effet visuel de collapse
        this.addCollapseEffect(x, y, radius);
    }
    
    // DÉPLACEMENT DU HÉROS
    async moveHero(targetX, targetY) {
        const hero = this.gameState.hero;
        
        // Vérifier si le mouvement est valide
        if (!this.canMoveTo(targetX, targetY)) return false;
        
        // Calculer le chemin
        const path = this.pathfinder.findPath(
            { x: hero.x, y: hero.y },
            { x: targetX, y: targetY }
        );
        
        if (!path || path.length === 0) return false;
        
        // Vérifier les points de mouvement
        const cost = path.length - 1;
        if (cost > hero.movePoints) return false;
        
        // Sauvegarder l'état pour l'annulation
        this.saveState();
        
        // Animer le mouvement
        await this.animateHeroMovement(path);
        
        // Mettre à jour la position
        hero.x = targetX;
        hero.y = targetY;
        hero.movePoints -= cost;
        
        // Révéler la nouvelle zone
        this.revealArea(targetX, targetY, this.config.fogRadius);
        
        // Vérifier les interactions
        this.checkInteractions();
        
        // Envoyer au backend
        this.sendMoveToBackend(targetX, targetY);
        
        return true;
    }
    
    canMoveTo(x, y) {
        const key = `${x},${y}`;
        
        // Vérifier le brouillard
        if (!this.gameState.fog.has(key)) return false;
        
        // Vérifier si la zone est collapsed
        if (this.gameState.temporalLocks.has(key)) return false;
        
        // Vérifier si c'est une plateforme valide
        return this.isValidTile(x, y);
    }
    
    isValidTile(x, y) {
        return this.gameState.map.platforms.some(platform => {
            const px = platform.position.x;
            const py = platform.position.y;
            return x >= px && x < px + platform.size.w &&
                   y >= py && y < py + platform.size.h;
        });
    }
    
    // ANIMATION
    async animateHeroMovement(path) {
        return new Promise(resolve => {
            let index = 0;
            const animate = () => {
                if (index >= path.length - 1) {
                    this.gameState.hero.moving = false;
                    resolve();
                    return;
                }
                
                const current = path[index];
                const next = path[index + 1];
                
                // Interpolation fluide
                const t = 0.2; // Vitesse de déplacement
                this.gameState.hero.x += (next.x - current.x) * t;
                this.gameState.hero.y += (next.y - current.y) * t;
                
                // Vérifier si on est arrivé
                const dx = Math.abs(this.gameState.hero.x - next.x);
                const dy = Math.abs(this.gameState.hero.y - next.y);
                
                if (dx < 0.1 && dy < 0.1) {
                    this.gameState.hero.x = next.x;
                    this.gameState.hero.y = next.y;
                    index++;
                }
                
                requestAnimationFrame(animate);
            };
            
            this.gameState.hero.moving = true;
            animate();
        });
    }
    
    // UNDO TEMPOREL
    saveState() {
        const state = {
            hero: { ...this.gameState.hero },
            fog: new Map(this.gameState.fog),
            timestamp: Date.now()
        };
        
        this.gameState.history.push(state);
        
        // Limiter l'historique
        if (this.gameState.history.length > this.config.maxUndoSteps) {
            this.gameState.history.shift();
        }
    }
    
    undoMove() {
        if (this.gameState.history.length === 0) return false;
        if (this.gameState.hero.temporalCharges <= 0) return false;
        
        const previousState = this.gameState.history.pop();
        
        // Vérifier si la zone actuelle est collapsed
        const key = `${this.gameState.hero.x},${this.gameState.hero.y}`;
        if (this.gameState.temporalLocks.has(key)) {
            alert("Cette zone est causalement verrouillée !");
            return false;
        }
        
        // Restaurer l'état
        this.gameState.hero = { ...previousState.hero };
        this.gameState.fog = new Map(previousState.fog);
        this.gameState.hero.temporalCharges--;
        
        // Effet visuel
        this.addTemporalEffect(this.gameState.hero.x, this.gameState.hero.y);
        
        return true;
    }
    
    // EFFETS VISUELS
    addRevealEffect(x, y) {
        this.gameState.activeEffects.push({
            type: 'reveal',
            x, y,
            age: 0,
            maxAge: 30
        });
    }
    
    addCollapseEffect(x, y, radius) {
        this.gameState.activeEffects.push({
            type: 'collapse',
            x, y,
            radius,
            age: 0,
            maxAge: 60
        });
    }
    
    addTemporalEffect(x, y) {
        this.gameState.activeEffects.push({
            type: 'temporal',
            x, y,
            age: 0,
            maxAge: 45
        });
    }
    
    updateEffects() {
        this.gameState.activeEffects = this.gameState.activeEffects.filter(effect => {
            effect.age++;
            return effect.age < effect.maxAge;
        });
    }
    
    // PARTICULES
    createParticle(x, y, type = 'star') {
        const particle = {
            x, y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            life: 1,
            type,
            color: this.getParticleColor(type)
        };
        
        this.gameState.particles.push(particle);
    }
    
    getParticleColor(type) {
        const colors = {
            'star': '#FFD700',
            'magic': '#6495ED',
            'temporal': '#9370DB',
            'collapse': '#FF6347'
        };
        return colors[type] || '#FFFFFF';
    }
    
    updateParticles() {
        this.gameState.particles = this.gameState.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.05; // Gravité
            particle.life -= 0.02;
            
            return particle.life > 0;
        });
    }
    
    // INTERACTIONS
    checkInteractions() {
        const hero = this.gameState.hero;
        
        // Vérifier les vortex
        this.gameState.map.vortexes?.forEach(vortex => {
            if (vortex.position.x === hero.x && vortex.position.y === hero.y) {
                this.onVortexEnter(vortex);
            }
        });
        
        // Vérifier les plateformes spéciales
        const platform = this.getPlatformAt(hero.x, hero.y);
        if (platform && platform.content) {
            this.onPlatformInteraction(platform);
        }
    }
    
    getPlatformAt(x, y) {
        return this.gameState.map.platforms.find(platform => {
            const px = platform.position.x;
            const py = platform.position.y;
            return x >= px && x < px + platform.size.w &&
                   y >= py && y < py + platform.size.h;
        });
    }
    
    onVortexEnter(vortex) {
        if (vortex.active) {
            this.showVortexDialog(vortex);
        }
    }
    
    onPlatformInteraction(platform) {
        if (platform.content.artifacts) {
            this.showArtifactDialog(platform.content.artifacts[0]);
        }
    }
    
    // DIALOGUES
    showVortexDialog(vortex) {
        const destinations = vortex.destinations.join(', ');
        if (confirm(`Entrer dans le vortex temporel ?\nDestinations: ${destinations}`)) {
            this.activateVortex(vortex);
        }
    }
    
    showArtifactDialog(artifactId) {
        if (confirm(`Prendre l'artefact: ${artifactId} ?`)) {
            this.collectArtifact(artifactId);
        }
    }
    
    // ACTIONS
    activateVortex(vortex) {
        // Animation de téléportation
        this.addTemporalEffect(this.gameState.hero.x, this.gameState.hero.y);
        
        // TODO: Changer de carte ou timeline
        console.log("Activation du vortex:", vortex);
    }
    
    collectArtifact(artifactId) {
        this.gameState.hero.inventory.push(artifactId);
        
        // Effet visuel
        for (let i = 0; i < 20; i++) {
            this.createParticle(this.gameState.hero.x, this.gameState.hero.y, 'star');
        }
        
        console.log("Artefact collecté:", artifactId);
    }
    
    // BACKEND
    async sendMoveToBackend(x, y) {
        try {
            await fetch(`${this.backendUrl}/api/hero/move`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    heroId: this.gameState.hero.id,
                    x, y,
                    gameId: this.gameState.map.id
                })
            });
        } catch (error) {
            console.log("Backend indisponible");
        }
    }
    
    // CAMÉRA
    centerCameraOnHero() {
        const hero = this.gameState.hero;
        const iso = this.cartToIso(hero.x, hero.y, hero.z);
        
        this.gameState.camera.x = this.canvas.width / 2 - iso.x * this.gameState.camera.zoom;
        this.gameState.camera.y = this.canvas.height / 2 - iso.y * this.gameState.camera.zoom;
    }
    
    moveCamera(dx, dy) {
        this.gameState.camera.x += dx;
        this.gameState.camera.y += dy;
    }
    
    zoomCamera(delta) {
        const oldZoom = this.gameState.camera.zoom;
        this.gameState.camera.zoom = Math.max(0.5, Math.min(2, oldZoom + delta));
        
        // Zoom centré sur la souris
        if (this.gameState.hoveredTile) {
            const iso = this.cartToIso(this.gameState.hoveredTile.x, this.gameState.hoveredTile.y);
            const dx = iso.x * (this.gameState.camera.zoom - oldZoom);
            const dy = iso.y * (this.gameState.camera.zoom - oldZoom);
            this.gameState.camera.x -= dx;
            this.gameState.camera.y -= dy;
        }
    }
    
    // ÉVÉNEMENTS
    setupEventListeners() {
        // Click
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // Mouvement souris
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Molette
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.zoomCamera(-e.deltaY * 0.001);
        });
        
        // Clavier
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Redimensionnement
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        
        const worldPos = this.screenToWorld(screenX, screenY);
        
        if (this.isValidTile(worldPos.x, worldPos.y)) {
            this.moveHero(worldPos.x, worldPos.y);
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        
        const worldPos = this.screenToWorld(screenX, screenY);
        
        if (this.isValidTile(worldPos.x, worldPos.y)) {
            this.gameState.hoveredTile = worldPos;
            this.canvas.style.cursor = 'pointer';
        } else {
            this.gameState.hoveredTile = null;
            this.canvas.style.cursor = 'default';
        }
    }
    
    handleKeyDown(e) {
        const moves = {
            'ArrowUp': { x: 0, y: -1 },
            'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 },
            'ArrowRight': { x: 1, y: 0 }
        };
        
        if (moves[e.key]) {
            e.preventDefault();
            const hero = this.gameState.hero;
            this.moveHero(hero.x + moves[e.key].x, hero.y + moves[e.key].y);
        } else if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            this.undoMove();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.centerCameraOnHero();
        } else if (e.key === 'g') {
            this.config.showGrid = !this.config.showGrid;
        } else if (e.key === 'c') {
            this.config.showCoordinates = !this.config.showCoordinates;
        }
    }
    
    // RENDU
    startRenderLoop() {
        const render = () => {
            this.update();
            this.draw();
            requestAnimationFrame(render);
        };
        render();
    }
    
    update() {
        this.updateEffects();
        this.updateParticles();
    }
    
    draw() {
        const ctx = this.ctx;
        
        // Effacer
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sauvegarder le contexte
        ctx.save();
        
        // Appliquer la transformation de caméra
        ctx.translate(this.gameState.camera.x, this.gameState.camera.y);
        ctx.scale(this.gameState.camera.zoom, this.gameState.camera.zoom);
        
        // Dessiner dans l'ordre de profondeur
        this.drawBackground();
        this.drawPlatforms();
        this.drawConnections();
        this.drawVortexes();
        this.drawEffects();
        this.drawHero();
        this.drawParticles();
        
        if (this.config.showGrid) this.drawGrid();
        if (this.gameState.hoveredTile) this.drawHover();
        if (this.gameState.path.length > 0) this.drawPath();
        
        // Restaurer le contexte
        ctx.restore();
        
        // UI (non affecté par la caméra)
        this.drawUI();
    }
    
    // ... [Les méthodes de dessin seront dans la partie suivante]
}

// PATHFINDING
class Pathfinder {
    constructor(engine) {
        this.engine = engine;
    }
    
    findPath(start, end) {
        // A* simplifié pour la démo
        const path = [];
        let current = { ...start };
        
        while (current.x !== end.x || current.y !== end.y) {
            const dx = end.x - current.x;
            const dy = end.y - current.y;
            
            if (dx !== 0) current.x += Math.sign(dx);
            if (dy !== 0) current.y += Math.sign(dy);
            
            path.push({ ...current });
            
            // Vérifier si le chemin est valide
            if (!this.engine.canMoveTo(current.x, current.y)) {
                return null;
            }
        }
        
        return path;
    }
}