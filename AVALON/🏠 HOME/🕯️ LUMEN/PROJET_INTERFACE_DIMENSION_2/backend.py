#!/usr/bin/env python3
# 🎮 MOCK BACKEND PYTHON - API simple pour tester

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime

# État global
games = {}
game_counter = 1

class APIHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if self.path in ['/api/health', '/actuator/health']:
            response = {'status': 'UP', 'mock': True, 'timestamp': str(datetime.now())}
        elif self.path.startswith('/api/game/'):
            game_id = self.path.split('/')[-1]
            response = games.get(game_id, {'error': 'Game not found'})
        else:
            response = {'error': 'Not found', 'path': self.path}
        
        self.wfile.write(json.dumps(response).encode())
    
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode() if content_length > 0 else '{}'
        
        try:
            data = json.loads(body) if body else {}
        except:
            data = {}
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        global game_counter
        
        if self.path == '/api/game/create':
            game_id = f'game_{game_counter}'
            game_counter += 1
            games[game_id] = {
                'id': game_id,
                'name': data.get('name', 'Test Game'),
                'heroes': [
                    {'id': 'arthur', 'name': 'Arthur', 'x': 5, 'y': 5},
                    {'id': 'morgana', 'name': 'Morgana', 'x': 10, 'y': 10}
                ]
            }
            response = {'id': game_id, 'success': True}
        
        elif self.path == '/api/game/demo':
            response = {
                'success': True,
                'message': 'Demo scenario loaded',
                'scenario': 'DUEL_COLLAPSE'
            }
        
        elif self.path == '/api/magic-formulas/execute':
            formula = data.get('formula', 'UNKNOWN')
            response = {
                'success': True,
                'message': f'🔮 Formule {formula} exécutée !',
                'runicInterpretation': f'ψ_MOCK: ⊙({formula}) ⟶ SUCCESS',
                'data': {'mockResult': True}
            }
        
        else:
            response = {'error': 'Unknown endpoint', 'path': self.path}
        
        self.wfile.write(json.dumps(response).encode())
    
    def log_message(self, format, *args):
        # Afficher les logs
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {format % args}")

if __name__ == '__main__':
    print('🎮 Mock Backend Python démarré sur http://localhost:8080')
    print('📋 Endpoints disponibles:')
    print('  - GET  /api/health')
    print('  - POST /api/game/create')
    print('  - GET  /api/game/{id}')
    print('  - POST /api/game/demo')
    print('  - POST /api/magic-formulas/execute')
    print('----------------------------------------')
    
    server = HTTPServer(('localhost', 8080), APIHandler)
    server.serve_forever()