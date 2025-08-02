// 🎨 RENDERER 2D - Donne vie aux aventures

class Renderer2D {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas?.getContext('2d');
        this.sprites = new Map();
        this.particles = [];
        this.animations = [];
        
        if (this.canvas) {
            this.canvas.width = 800;
            this.canvas.height = 600;
        }
        
        this.loadAssets();
    }
    
    loadAssets() {
        // Précharger les sprites essentiels
        const assetList = {
            'player': '/assets/sprites/loumen.png',
            'dude': '/assets/sprites/dude.png',
            'urzkom': '/assets/sprites/urzkom.png',
            'grokæn': '/assets/sprites/grokæn.png',
            'marie': '/assets/sprites/marie.png',
            'forest': '/assets/backgrounds/forest.png',
            'portal': '/assets/sprites/portal.png'
        };
        
        // Pour l'instant, on utilise des placeholders
        this.sprites.set('player', this.createPlaceholderSprite('🕯️', 40));
        this.sprites.set('dude', this.createPlaceholderSprite('🎳', 50));
        this.sprites.set('urzkom', this.createPlaceholderSprite('🐻', 60));
        this.sprites.set('grokæn', this.createPlaceholderSprite('🧠', 45));
        this.sprites.set('marie', this.createPlaceholderSprite('👤', 45));
    }
    
    createPlaceholderSprite(emoji, size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        ctx.font = `${size * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, size/2, size/2);
        
        return canvas;
    }
    
    clear() {
        if (!this.ctx) return;
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawBackground(backgroundId) {
        if (!this.ctx) return;
        
        switch(backgroundId) {
            case 'forest':
                this.drawForestBackground();
                break;
            case 'portal':
                this.drawPortalBackground();
                break;
            case 'sphinx':
                this.drawSphinxBackground();
                break;
            default:
                this.drawDefaultBackground();
        }
    }
    
    drawForestBackground() {
        const ctx = this.ctx;
        
        // Ciel nocturne
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a2a');
        gradient.addColorStop(1, '#1a1a3a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Étoiles
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.6;
            const size = Math.random() * 2;
            const opacity = Math.random() * 0.8 + 0.2;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Arbres quantiques
        for (let i = 0; i < 8; i++) {
            const x = (i * 120) + 60;
            const y = this.canvas.height - 100;
            this.drawQuantumTree(x, y);
        }
        
        // Sol
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, this.canvas.height - 80, this.canvas.width, 80);
    }
    
    drawQuantumTree(x, y) {
        const ctx = this.ctx;
        const time = Date.now() * 0.001;
        
        // Tronc
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 150);
        ctx.stroke();
        
        // Feuillage quantique avec pulsation
        const pulse = Math.sin(time + x * 0.01) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(0, 255, 150, ${pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y - 150, 60, 0, Math.PI * 2);
        ctx.fill();
        
        // Particules
        for (let i = 0; i < 3; i++) {
            const angle = time + i * 2;
            const px = x + Math.cos(angle) * 40;
            const py = y - 150 + Math.sin(angle) * 40;
            
            ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawPortalBackground() {
        const ctx = this.ctx;
        const time = Date.now() * 0.001;
        
        // Fond sombre
        ctx.fillStyle = '#000011';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Vortex central
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const radius = i * 20;
            const rotation = time * (21 - i) * 0.1;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            
            ctx.strokeStyle = `rgba(150, 100, 255, ${0.5 - i * 0.025})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 1.8);
            ctx.stroke();
            
            ctx.restore();
        }
    }
    
    drawSphinxBackground() {
        const ctx = this.ctx;
        
        // Désert
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#ffcc66');
        gradient.addColorStop(0.5, '#ff9933');
        gradient.addColorStop(1, '#cc6600');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sphinx silhouette
        ctx.fillStyle = '#4a3020';
        ctx.beginPath();
        ctx.moveTo(200, 400);
        ctx.lineTo(250, 300);
        ctx.lineTo(300, 280);
        ctx.lineTo(350, 290);
        ctx.lineTo(400, 280);
        ctx.lineTo(450, 300);
        ctx.lineTo(500, 400);
        ctx.closePath();
        ctx.fill();
        
        // Hiéroglyphes
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.font = '30px Arial';
        const glyphs = ['𓁹', '𓂀', '𓃀', '𓄿', '𓅓'];
        glyphs.forEach((glyph, i) => {
            ctx.fillText(glyph, 100 + i * 120, 100);
        });
    }
    
    drawDefaultBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width/2, this.canvas.height/2, 0,
            this.canvas.width/2, this.canvas.height/2, this.canvas.width
        );
        gradient.addColorStop(0, '#2a2a4a');
        gradient.addColorStop(1, '#1a1a2a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawPlayer(position) {
        if (!this.ctx) return;
        
        const sprite = this.sprites.get('player');
        if (sprite) {
            // Aura lumineuse
            const gradient = this.ctx.createRadialGradient(
                position.x, position.y, 0,
                position.x, position.y, 50
            );
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, 50, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Sprite
            this.ctx.drawImage(sprite, 
                position.x - sprite.width/2, 
                position.y - sprite.height/2
            );
            
            // Flamme animée
            this.drawFlame(position.x, position.y - 30);
        }
    }
    
    drawFlame(x, y) {
        const ctx = this.ctx;
        const time = Date.now() * 0.01;
        const flicker = Math.sin(time) * 5;
        
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        
        // Flamme principale
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x - 8 - flicker/2, y - 10, x, y - 20 - flicker);
        ctx.quadraticCurveTo(x + 8 + flicker/2, y - 10, x, y);
        ctx.fill();
        
        // Coeur de la flamme
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    drawCompanion(name, playerPos) {
        const sprite = this.sprites.get(name);
        if (!sprite) return;
        
        // Position relative au joueur
        const offsets = {
            'dude': { x: -80, y: 0 },
            'urzkom': { x: 80, y: 20 },
            'grokæn': { x: 0, y: -60 }
        };
        
        const offset = offsets[name] || { x: 50, y: 0 };
        const x = playerPos.x + offset.x;
        const y = playerPos.y + offset.y;
        
        // Aura spécifique
        if (name === 'dude') {
            // Aura zen
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 40, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.drawImage(sprite, x - sprite.width/2, y - sprite.height/2);
    }
    
    drawElement(element) {
        if (!this.ctx) return;
        
        const { position, type, id } = element;
        
        switch(type) {
            case 'item':
                this.drawItem(position, id);
                break;
            case 'npc':
                this.drawNPC(position, id);
                break;
            case 'portal':
                this.drawPortal(position);
                break;
            case 'interactive':
                this.drawInteractive(position, id);
                break;
        }
    }
    
    drawItem(position, itemId) {
        const ctx = this.ctx;
        
        // Effet de flottement
        const float = Math.sin(Date.now() * 0.003) * 5;
        const y = position.y + float;
        
        // Lueur
        ctx.save();
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20;
        
        // Icône selon l'item
        const icons = {
            'flute_fragile': '🎵',
            'talisman': '🔮',
            'photo': '📷',
            'key': '🔑'
        };
        
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icons[itemId] || '📦', position.x, y);
        
        ctx.restore();
    }
    
    drawPortal(position) {
        const ctx = this.ctx;
        const time = Date.now() * 0.002;
        
        // Vortex animé
        for (let i = 0; i < 10; i++) {
            const radius = 20 + i * 5;
            const alpha = 0.5 - i * 0.05;
            
            ctx.save();
            ctx.translate(position.x, position.y);
            ctx.rotate(time * (1 + i * 0.1));
            
            ctx.strokeStyle = `rgba(150, 100, 255, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 1.5);
            ctx.stroke();
            
            ctx.restore();
        }
        
        // Centre lumineux
        const gradient = ctx.createRadialGradient(
            position.x, position.y, 0,
            position.x, position.y, 30
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(150, 100, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(position.x, position.y, 30, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawNPC(position, npcId) {
        const sprite = this.sprites.get(npcId);
        if (sprite) {
            this.ctx.drawImage(sprite, 
                position.x - sprite.width/2, 
                position.y - sprite.height/2
            );
        } else {
            // Placeholder
            this.ctx.fillStyle = '#666';
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Indicateur d'interaction
        if (this.isNearPlayer(position)) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('!', position.x, position.y - 30);
        }
    }
    
    drawInteractive(position, id) {
        // Objet avec lequel on peut interagir
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(position.x - 25, position.y - 25, 50, 50);
        this.ctx.setLineDash([]);
    }
    
    isNearPlayer(position) {
        // Vérifier la proximité (à implémenter avec la position du joueur)
        return false;
    }
    
    // Système de particules
    addParticle(x, y, type) {
        this.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3,
            life: 1,
            type
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            particle.vy += 0.1; // Gravité
            
            if (particle.life > 0) {
                this.drawParticle(particle);
                return true;
            }
            return false;
        });
    }
    
    drawParticle(particle) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = particle.life;
        
        switch(particle.type) {
            case 'magic':
                ctx.fillStyle = '#ffd700';
                break;
            case 'smoke':
                ctx.fillStyle = '#666';
                break;
            default:
                ctx.fillStyle = '#fff';
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // Méthode d'animation principale
    animate() {
        this.updateParticles();
        
        // Animer les éléments
        this.animations.forEach(anim => {
            anim.update();
            if (anim.finished) {
                this.animations = this.animations.filter(a => a !== anim);
            }
        });
    }
}