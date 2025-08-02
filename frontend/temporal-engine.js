// 🌀 Temporal Engine JS - Frontend Core
// Heroes of Time - Script Engine

console.log('🌀 Temporal Engine initialized on port 8000');

// Effet de particules flottantes
function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = '#ffdd00';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';
    
    document.body.appendChild(particle);
    
    let y = window.innerHeight;
    let x = parseFloat(particle.style.left);
    let speedY = -Math.random() * 2 - 1;
    let speedX = (Math.random() - 0.5) * 2;
    let opacity = 1;
    
    const animate = () => {
        y += speedY;
        x += speedX;
        opacity -= 0.01;
        
        particle.style.top = y + 'px';
        particle.style.left = x + 'px';
        particle.style.opacity = opacity;
        
        if (opacity > 0 && y > -10) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    };
    
    requestAnimationFrame(animate);
}

// Créer des particules régulièrement
if (document.getElementById('particles')) {
    setInterval(createParticle, 300);
}

// Gestion console temporelle
const consoleCommands = {
    'help': 'Commandes disponibles: status, backend, walter, interfaces, clear, bootstrap',
    'status': '📊 Frontend: ✅ | Backend: ❌ | Walter: 🔍 | Bootstrap: ✅',
    'backend': '🔴 Backend déconnecté. Utiliser API Walter pour reconnecter.',
    'walter': '🔵 API Walter disponible. Vérifier protocoles de sécurité.',
    'interfaces': '🌀 7 interfaces détectées: dashboard, visual-editor, sphinx, hexagon, joint, portail, bootstrap',
    'bootstrap': '🎯 Bootstrap Pocket Instance V2 - Sid Meier Edition ACTIVE',
    'clear': 'CLEAR_CONSOLE'
};

// Auto-notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#32cd32' : type === 'error' ? '#ff4444' : '#4444ff'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.5s ease-out;
        font-family: 'Courier New', monospace;
    `;
    notification.innerHTML = message;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// API Mock pour Walter
window.WalterAPI = {
    checkStatus: async () => {
        return { status: 'available', message: 'Walter Security API - Protocoles actifs' };
    },
    
    getBackendEndpoints: () => {
        return [
            '/api/health',
            '/api/magic-formulas/execute',
            '/api/heroes',
            '/api/scenarios',
            '/api/temporal-engine/status'
        ];
    }
};

// Easter egg : Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s';
        showNotification('🌈 MODE COSMIQUE ACTIVÉ !', 'success');
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Style pour animation rainbow
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Frontend Temporal Engine fully loaded');
    
    // Vérifier si on est sur la page principale
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        setTimeout(() => {
            showNotification('🌀 Frontend Temporal Engine - Port 8000 ACTIF', 'success');
        }, 1000);
    }
});

// Export des fonctions globales
window.TemporalEngine = {
    showNotification,
    createParticle,
    consoleCommands,
    WalterAPI: window.WalterAPI
};