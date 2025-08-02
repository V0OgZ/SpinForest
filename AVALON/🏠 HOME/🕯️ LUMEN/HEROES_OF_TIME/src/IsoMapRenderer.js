// 🎨 RENDERER ISOMÉTRIQUE - HEROES OF TIME
// Méthodes de rendu pour le moteur de carte

// Extension de IsoMapEngine avec les méthodes de rendu
IsoMapEngine.prototype.drawBackground = function() {
    const ctx = this.ctx;
    
    // Nébuleuses cosmiques
    const time = Date.now() * 0.0001;
    
    for (let i = 0; i < 5; i++) {
        const x = Math.sin(time + i) * 200;
        const y = Math.cos(time * 0.7 + i) * 150;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 300);
        gradient.addColorStop(0, `rgba(138, 43, 226, 0.2)`);
        gradient.addColorStop(0.5, `rgba(75, 0, 130, 0.1)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 300, y - 300, 600, 600);
    }
    
    // Étoiles flottantes
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 137.5 + time * 10) % 1000 - 500;
        const y = (i * 89.7 + time * 5) % 800 - 400;
        const size = (i % 3) + 1;
        const opacity = 0.3 + (Math.sin(time * 3 + i) + 1) * 0.35;
        
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
};

IsoMapEngine.prototype.drawPlatforms = function() {
    if (!this.gameState.map || !this.gameState.map.platforms) return;
    
    // Trier les plateformes par profondeur (y + x)
    const sortedPlatforms = [...this.gameState.map.platforms].sort((a, b) => {
        const depthA = a.position.x + a.position.y;
        const depthB = b.position.x + b.position.y;
        return depthA - depthB;
    });
    
    sortedPlatforms.forEach(platform => {
        this.drawPlatform(platform);
    });
};

IsoMapEngine.prototype.drawPlatform = function(platform) {
    const px = platform.position.x;
    const py = platform.position.y;
    const height = platform.height || 0;
    
    // Dessiner chaque tuile de la plateforme
    for (let y = 0; y < platform.size.h; y++) {
        for (let x = 0; x < platform.size.w; x++) {
            const tileX = px + x;
            const tileY = py + y;
            const key = `${tileX},${tileY}`;
            
            const fogState = this.gameState.fog.get(key);
            
            if (fogState) {
                // Tuile révélée
                this.drawTile(tileX, tileY, platform, height, fogState);
                
                // Contenu spécial au centre
                if (x === Math.floor(platform.size.w / 2) && 
                    y === Math.floor(platform.size.h / 2)) {
                    this.drawPlatformContent(platform, tileX, tileY, height);
                }
            } else {
                // Brouillard
                this.drawFogTile(tileX, tileY);
            }
        }
    }
};

IsoMapEngine.prototype.drawTile = function(x, y, platform, height, fogState) {
    const ctx = this.ctx;
    const iso = this.cartToIso(x, y, height);
    
    ctx.save();
    ctx.translate(iso.x, iso.y);
    
    // Couleur selon le type et l'état
    let baseColor = this.getPlatformColor(platform.type);
    if (fogState === 'collapsed') {
        baseColor = this.desaturateColor(baseColor);
    }
    
    // Face supérieure
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.tileWidth/2, this.tileHeight/2);
    ctx.lineTo(0, this.tileHeight);
    ctx.lineTo(-this.tileWidth/2, this.tileHeight/2);
    ctx.closePath();
    ctx.fill();
    
    // Texture
    this.drawTileTexture(ctx, platform.type);
    
    // Bordure
    ctx.strokeStyle = fogState === 'collapsed' 
        ? 'rgba(255, 100, 100, 0.5)' 
        : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Faces latérales si hauteur
    if (height > 0) {
        const h = height * 20;
        
        // Face gauche
        ctx.fillStyle = this.adjustBrightness(baseColor, -30);
        ctx.beginPath();
        ctx.moveTo(-this.tileWidth/2, this.tileHeight/2);
        ctx.lineTo(-this.tileWidth/2, this.tileHeight/2 + h);
        ctx.lineTo(0, this.tileHeight + h);
        ctx.lineTo(0, this.tileHeight);
        ctx.closePath();
        ctx.fill();
        
        // Face droite
        ctx.fillStyle = this.adjustBrightness(baseColor, -50);
        ctx.beginPath();
        ctx.moveTo(0, this.tileHeight);
        ctx.lineTo(0, this.tileHeight + h);
        ctx.lineTo(this.tileWidth/2, this.tileHeight/2 + h);
        ctx.lineTo(this.tileWidth/2, this.tileHeight/2);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.restore();
    
    // Coordonnées debug
    if (this.config.showCoordinates) {
        ctx.save();
        ctx.translate(iso.x, iso.y + this.tileHeight/2);
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${x},${y}`, 0, 0);
        ctx.restore();
    }
};

IsoMapEngine.prototype.drawTileTexture = function(ctx, type) {
    // Ajouter des détails selon le type
    ctx.globalAlpha = 0.3;
    
    switch(type) {
        case 'settlement':
            // Herbe
            ctx.strokeStyle = '#2d5a2d';
            for (let i = 0; i < 5; i++) {
                const x = (Math.random() - 0.5) * this.tileWidth * 0.8;
                const y = (Math.random() - 0.5) * this.tileHeight * 0.8;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y - 5);
                ctx.stroke();
            }
            break;
            
        case 'ruins':
            // Fissures
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-10, -10);
            ctx.lineTo(5, 5);
            ctx.moveTo(10, -5);
            ctx.lineTo(-5, 10);
            ctx.stroke();
            break;
    }
    
    ctx.globalAlpha = 1;
};

IsoMapEngine.prototype.drawFogTile = function(x, y) {
    const ctx = this.ctx;
    const iso = this.cartToIso(x, y);
    
    ctx.save();
    ctx.translate(iso.x, iso.y);
    
    // Brouillard animé
    const time = Date.now() * 0.0005;
    const offset = Math.sin(time + x * 0.5 + y * 0.3) * 0.2;
    
    ctx.fillStyle = `rgba(20, 20, 40, ${0.8 + offset})`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.tileWidth/2, this.tileHeight/2);
    ctx.lineTo(0, this.tileHeight);
    ctx.lineTo(-this.tileWidth/2, this.tileHeight/2);
    ctx.closePath();
    ctx.fill();
    
    // Particules de brume
    if (Math.random() < 0.02) {
        this.createParticle(x, y, 'fog');
    }
    
    ctx.restore();
};

IsoMapEngine.prototype.drawPlatformContent = function(platform, x, y, height) {
    const ctx = this.ctx;
    const iso = this.cartToIso(x, y, height);
    
    ctx.save();
    ctx.translate(iso.x, iso.y - 40);
    
    // Icône principale
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const icons = {
        'settlement': '🏘️',
        'structure': '🏰',
        'battleground': '⚔️',
        'artifact_site': '🗡️',
        'ruins': '🏚️'
    };
    
    // Ombre
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(icons[platform.type] || '📍', 2, 2);
    
    // Icône
    ctx.fillStyle = '#fff';
    ctx.fillText(icons[platform.type] || '📍', 0, 0);
    
    // Nom de la plateforme
    if (platform.content && platform.content.buildings) {
        ctx.font = '12px Arial';
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        const name = platform.content.buildings[0].name || platform.id;
        ctx.strokeText(name, 0, 30);
        ctx.fillText(name, 0, 30);
    }
    
    ctx.restore();
};

IsoMapEngine.prototype.drawConnections = function() {
    if (!this.gameState.map || !this.gameState.map.connections) return;
    
    const ctx = this.ctx;
    
    this.gameState.map.connections.forEach(connection => {
        if (connection.type === 'bridge' && connection.passable) {
            this.drawBridge(connection);
        }
    });
};

IsoMapEngine.prototype.drawBridge = function(connection) {
    const ctx = this.ctx;
    
    // Trouver les plateformes
    const from = this.gameState.map.platforms.find(p => p.id === connection.from);
    const to = this.gameState.map.platforms.find(p => p.id === connection.to);
    
    if (!from || !to) return;
    
    // Calculer les centres
    const fromCenter = {
        x: from.position.x + from.size.w / 2,
        y: from.position.y + from.size.h / 2
    };
    const toCenter = {
        x: to.position.x + to.size.w / 2,
        y: to.position.y + to.size.h / 2
    };
    
    const fromIso = this.cartToIso(fromCenter.x, fromCenter.y);
    const toIso = this.cartToIso(toCenter.x, toCenter.y);
    
    // Pont d'énergie
    ctx.save();
    
    const time = Date.now() * 0.001;
    const pulseWidth = 3 + Math.sin(time) * 2;
    
    // Lueur
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#6495ED';
    
    // Ligne principale
    ctx.strokeStyle = '#6495ED';
    ctx.lineWidth = pulseWidth;
    ctx.globalAlpha = 0.7;
    ctx.setLineDash([10, 5]);
    ctx.lineDashOffset = -time * 5;
    
    ctx.beginPath();
    ctx.moveTo(fromIso.x, fromIso.y);
    ctx.lineTo(toIso.x, toIso.y);
    ctx.stroke();
    
    ctx.restore();
};

IsoMapEngine.prototype.drawVortexes = function() {
    if (!this.gameState.map || !this.gameState.map.vortexes) return;
    
    this.gameState.map.vortexes.forEach(vortex => {
        const key = `${vortex.position.x},${vortex.position.y}`;
        if (this.gameState.fog.get(key)) {
            this.drawVortex(vortex);
        }
    });
};

IsoMapEngine.prototype.drawVortex = function(vortex) {
    const ctx = this.ctx;
    const iso = this.cartToIso(vortex.position.x, vortex.position.y);
    
    ctx.save();
    ctx.translate(iso.x, iso.y);
    
    const time = Date.now() * 0.001;
    
    // Plusieurs couches de spirales
    for (let layer = 0; layer < 3; layer++) {
        ctx.strokeStyle = `rgba(100, 149, 237, ${0.8 - layer * 0.2})`;
        ctx.lineWidth = 4 - layer;
        
        ctx.beginPath();
        for (let i = 0; i < 100; i++) {
            const angle = i * 0.1;
            const radius = angle * 3 + layer * 15;
            const wobble = Math.sin(angle * 3 + time) * 5;
            
            const x = Math.cos(angle + time * (1 + layer * 0.3)) * (radius + wobble);
            const y = Math.sin(angle + time * (1 + layer * 0.3)) * (radius + wobble) * 0.5;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    
    // Centre lumineux
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(147, 112, 219, 0.5)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Particules
    if (Math.random() < 0.3) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 30;
        this.createParticle(
            vortex.position.x + Math.cos(angle) * dist / this.tileWidth,
            vortex.position.y + Math.sin(angle) * dist / this.tileHeight,
            'temporal'
        );
    }
    
    ctx.restore();
};

IsoMapEngine.prototype.drawHero = function() {
    const hero = this.gameState.hero;
    if (!hero) return;
    
    const ctx = this.ctx;
    const iso = this.cartToIso(hero.x, hero.y, hero.z);
    
    ctx.save();
    ctx.translate(iso.x, iso.y - 50);
    
    // Ombre
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 50, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Corps du héros
    const bobbing = hero.moving ? Math.sin(Date.now() * 0.01) * 3 : 0;
    ctx.translate(0, bobbing);
    
    // Armure
    const gradient = ctx.createLinearGradient(0, -30, 0, 20);
    gradient.addColorStop(0, '#6495ED');
    gradient.addColorStop(1, '#4169E1');
    ctx.fillStyle = gradient;
    
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(-15, -10);
    ctx.lineTo(-12, 20);
    ctx.lineTo(12, 20);
    ctx.lineTo(15, -10);
    ctx.closePath();
    ctx.fill();
    
    // Tête
    ctx.fillStyle = '#FFE4B5';
    ctx.beginPath();
    ctx.arc(0, -35, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Casque
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(0, -38, 13, Math.PI, 0);
    ctx.fill();
    
    // Épée
    if (!hero.moving) {
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(18, -15);
        ctx.lineTo(25, -40);
        ctx.stroke();
        
        // Garde
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(15, -20);
        ctx.lineTo(22, -20);
        ctx.stroke();
    }
    
    // Aura temporelle
    const time = Date.now() * 0.001;
    ctx.strokeStyle = `rgba(147, 112, 219, ${0.3 + Math.sin(time) * 0.2})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 10]);
    ctx.lineDashOffset = time * 10;
    
    ctx.beginPath();
    ctx.arc(0, -10, 40 + Math.sin(time * 2) * 5, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
    
    // Nom du héros
    if (this.config.showCoordinates) {
        ctx.save();
        ctx.translate(iso.x, iso.y - 70);
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(hero.name, 0, 0);
        ctx.restore();
    }
};

IsoMapEngine.prototype.drawEffects = function() {
    const ctx = this.ctx;
    
    this.gameState.activeEffects.forEach(effect => {
        const progress = effect.age / effect.maxAge;
        
        switch(effect.type) {
            case 'reveal':
                this.drawRevealEffect(effect, progress);
                break;
            case 'collapse':
                this.drawCollapseEffect(effect, progress);
                break;
            case 'temporal':
                this.drawTemporalEffect(effect, progress);
                break;
        }
    });
};

IsoMapEngine.prototype.drawRevealEffect = function(effect, progress) {
    const ctx = this.ctx;
    const iso = this.cartToIso(effect.x, effect.y);
    
    ctx.save();
    ctx.translate(iso.x, iso.y);
    
    const scale = 1 + progress * 2;
    const alpha = 1 - progress;
    
    ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    
    ctx.beginPath();
    ctx.moveTo(0, -this.tileHeight * scale);
    ctx.lineTo(this.tileWidth/2 * scale, 0);
    ctx.lineTo(0, this.tileHeight * scale);
    ctx.lineTo(-this.tileWidth/2 * scale, 0);
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
};

IsoMapEngine.prototype.drawCollapseEffect = function(effect, progress) {
    const ctx = this.ctx;
    const iso = this.cartToIso(effect.x, effect.y);
    
    ctx.save();
    ctx.translate(iso.x, iso.y);
    
    // Onde de choc
    const radius = effect.radius * this.tileWidth * (1 + progress * 3);
    const alpha = 1 - progress;
    
    ctx.strokeStyle = `rgba(255, 99, 71, ${alpha})`;
    ctx.lineWidth = 5 - progress * 4;
    
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Fissures
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        const length = radius * 0.8;
        
        ctx.strokeStyle = `rgba(255, 0, 0, ${alpha * 0.5})`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
            Math.cos(angle) * length,
            Math.sin(angle) * length * 0.5
        );
        ctx.stroke();
    }
    
    ctx.restore();
};

IsoMapEngine.prototype.drawTemporalEffect = function(effect, progress) {
    const ctx = this.ctx;
    const iso = this.cartToIso(effect.x, effect.y);
    
    ctx.save();
    ctx.translate(iso.x, iso.y - 30);
    
    // Spirale temporelle
    const rotations = progress * Math.PI * 4;
    
    ctx.strokeStyle = `rgba(147, 112, 219, ${1 - progress})`;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    for (let i = 0; i < 50; i++) {
        const t = i / 50;
        const angle = t * Math.PI * 2 + rotations;
        const radius = t * 50;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.5 - t * 50;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    ctx.restore();
};

IsoMapEngine.prototype.drawParticles = function() {
    const ctx = this.ctx;
    
    this.gameState.particles.forEach(particle => {
        const iso = this.cartToIso(particle.x, particle.y);
        
        ctx.save();
        ctx.translate(iso.x, iso.y);
        
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
};

IsoMapEngine.prototype.drawGrid = function() {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Grille visible
    const startX = Math.floor(-this.gameState.camera.x / this.tileWidth) - 2;
    const endX = startX + Math.ceil(this.canvas.width / this.tileWidth) + 4;
    const startY = Math.floor(-this.gameState.camera.y / this.tileHeight) - 2;
    const endY = startY + Math.ceil(this.canvas.height / this.tileHeight) + 4;
    
    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            const iso = this.cartToIso(x, y);
            
            ctx.beginPath();
            ctx.moveTo(iso.x, iso.y);
            ctx.lineTo(iso.x + this.tileWidth/2, iso.y + this.tileHeight/2);
            ctx.lineTo(iso.x, iso.y + this.tileHeight);
            ctx.lineTo(iso.x - this.tileWidth/2, iso.y + this.tileHeight/2);
            ctx.closePath();
            ctx.stroke();
        }
    }
};

IsoMapEngine.prototype.drawHover = function() {
    const tile = this.gameState.hoveredTile;
    const iso = this.cartToIso(tile.x, tile.y);
    const ctx = this.ctx;
    
    ctx.save();
    ctx.translate(iso.x, iso.y);
    
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.tileWidth/2, this.tileHeight/2);
    ctx.lineTo(0, this.tileHeight);
    ctx.lineTo(-this.tileWidth/2, this.tileHeight/2);
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
};

IsoMapEngine.prototype.drawPath = function() {
    const ctx = this.ctx;
    
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = 0.7;
    
    ctx.beginPath();
    this.gameState.path.forEach((point, index) => {
        const iso = this.cartToIso(point.x, point.y);
        if (index === 0) {
            ctx.moveTo(iso.x, iso.y + this.tileHeight/2);
        } else {
            ctx.lineTo(iso.x, iso.y + this.tileHeight/2);
        }
    });
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
};

IsoMapEngine.prototype.drawUI = function() {
    // Interface utilisateur (sera implémentée dans un composant séparé)
};

// HELPERS
IsoMapEngine.prototype.getPlatformColor = function(type) {
    const colors = {
        'settlement': '#4a7c4e',
        'structure': '#6b5b73',
        'battleground': '#8b4513',
        'artifact_site': '#FFD700',
        'ruins': '#696969'
    };
    return colors[type] || '#444444';
};

IsoMapEngine.prototype.adjustBrightness = function(color, amount) {
    const num = parseInt(color.slice(1), 16);
    const r = Math.max(0, Math.min(255, ((num >> 16) & 255) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + amount));
    const b = Math.max(0, Math.min(255, (num & 255) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

IsoMapEngine.prototype.desaturateColor = function(color) {
    const num = parseInt(color.slice(1), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    
    const gray = Math.floor(r * 0.3 + g * 0.59 + b * 0.11);
    const mixed = {
        r: Math.floor(r * 0.3 + gray * 0.7),
        g: Math.floor(g * 0.3 + gray * 0.7),
        b: Math.floor(b * 0.3 + gray * 0.7)
    };
    
    return `#${((mixed.r << 16) | (mixed.g << 8) | mixed.b).toString(16).padStart(6, '0')}`;
};