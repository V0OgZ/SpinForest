// 🎮 MOCK BACKEND - Simule les APIs pour tester sans Maven
const http = require('http');
const url = require('url');

// État du jeu en mémoire
let gameState = {
    games: {},
    heroes: [
        {
            id: "arthur_pendragon",
            name: "Arthur Pendragon",
            class: "Roi-Chevalier",
            stats: { attack: 20, defense: 18 },
            x: 5, y: 5
        },
        {
            id: "morgana",
            name: "Morgana",
            class: "Sorcière",
            stats: { attack: 15, defense: 12, spellPower: 25 },
            x: 10, y: 10
        }
    ]
};

// Créer le serveur
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Routes
    if (path === '/actuator/health' || path === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'UP', mock: true }));
    }
    else if (path === '/api/game/create' && req.method === 'POST') {
        const gameId = `game_${Date.now()}`;
        gameState.games[gameId] = {
            id: gameId,
            name: 'Test Game',
            heroes: [...gameState.heroes],
            created: new Date()
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: gameId, success: true }));
    }
    else if (path.startsWith('/api/game/') && req.method === 'GET') {
        const gameId = path.split('/')[3];
        const game = gameState.games[gameId];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(game || { error: 'Game not found' }));
    }
    else if (path === '/api/game/demo' && req.method === 'POST') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: true, 
            message: 'Demo scenario loaded',
            heroes: gameState.heroes 
        }));
    }
    else if (path === '/api/magic-formulas/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: `🔮 Formule ${data.formula} exécutée !`,
                runicInterpretation: `ψ_MOCK: ⊙(${data.formula}) ⟶ SUCCESS`,
                jesusBlessing: '✨ Mock blessing ✨'
            }));
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found', path: path }));
    }
});

// Démarrer le serveur
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🎮 Mock Backend running on http://localhost:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log('  - GET  /api/health');
    console.log('  - POST /api/game/create');
    console.log('  - GET  /api/game/{id}');
    console.log('  - POST /api/game/demo');
    console.log('  - POST /api/magic-formulas/execute');
});