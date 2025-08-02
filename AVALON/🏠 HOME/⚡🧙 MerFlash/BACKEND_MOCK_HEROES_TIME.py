#!/usr/bin/env python3
# ⚡ MERFLASH: Backend Mock Heroes of Time + URZ-KÔM
# ⊙(Mock Complet) + †ψ(API Unifiée) → Δt+1(Backend Fonctionnel)

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import uuid
import time
from urllib.parse import urlparse, parse_qs
import threading
import random

class HeroesOfTimeHandler(BaseHTTPRequestHandler):
    # État global du jeu
    games = {}
    game_counter = 1000
    
    def do_GET(self):
        path = urlparse(self.path).path
        
        # CORS headers
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        if path == '/api/temporal/health':
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "UP",
                "message": "🌀 Backend Mock Heroes of Time + URZ-KÔM opérationnel",
                "timestamp": int(time.time() * 1000),
                "grokMessage": "⊙(Backend Mock) + †ψ(Prêt) → Δt+1(Combat possible)"
            }, indent=2).encode('utf-8'))
            
        elif path.startswith('/api/temporal/games/'):
            game_id = path.split('/')[-1]
            if game_id in self.games:
                self.send_json(self.games[game_id])
            else:
                self.send_404()
                
        elif path == '/api/particle-simulation/status':
            self.send_json({
                "simulationRunning": True,
                "particleCount": 9,
                "timestamp": int(time.time() * 1000),
                "urzKomMessage": "🐻 Chamane-Ours surveille les particules quantiques (MOCK)"
            })
        else:
            self.send_404()
    
    def do_POST(self):
        path = urlparse(self.path).path
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        
        try:
            data = json.loads(post_data.decode('utf-8')) if post_data else {}
        except:
            data = {}
        
        # CORS headers
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        if path == '/api/temporal/games':
            # Créer une nouvelle partie
            game_id = str(self.game_counter)
            self.game_counter += 1
            
            game = {
                "gameId": game_id,
                "gameName": data.get("gameName", "Partie Sans Nom"),
                "status": "ACTIVE",
                "currentPlayer": "Player1",
                "currentTurn": 1,
                "maxPlayers": data.get("maxPlayers", 2),
                "mapWidth": data.get("mapWidth", 50),
                "mapHeight": data.get("mapHeight", 50),
                "heroes": [],
                "psiStates": [],
                "createdAt": int(time.time() * 1000)
            }
            
            self.games[game_id] = game
            
            self.send_json({
                "success": True,
                "gameId": game_id,
                "gameName": game["gameName"],
                "status": "ACTIVE",
                "currentPlayer": "Player1",
                "currentTurn": 1,
                "message": "⊙(Partie créée) + †ψ(Prête) → Δt+1(Combat peut commencer)"
            })
            
        elif path.endswith('/script'):
            # Exécuter un script HOTS
            game_id = path.split('/')[-2]
            script = data.get("script", "")
            
            if game_id in self.games:
                # Simuler l'exécution du script
                response = self.execute_hots_script(game_id, script)
                self.send_json(response)
            else:
                self.send_json({
                    "success": False,
                    "error": "Game not found"
                })
                
        elif path == '/api/temporal/execute':
            # Exécuter une commande simple
            command = data.get("command", "")
            game_id = data.get("gameId", "")
            
            response = {
                "success": True,
                "message": f"Commande exécutée: {command}",
                "executionTime": random.randint(20, 100),
                "grokMessage": "⊙(Commande reçue) + †ψ(Exécutée) → Δt+1(Effet appliqué)"
            }
            self.send_json(response)
            
        elif path == '/api/particle-simulation/start':
            self.send_json({
                "message": "🐻 Quantum particle simulation started (MOCK)",
                "particleCount": 9,
                "urzKomMessage": "⊙(Particules créées) + †ψ(Simulation lancée) → Δt+1(Physique quantique active)"
            })
        else:
            self.send_404()
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def execute_hots_script(self, game_id, script):
        """Simuler l'exécution d'un script HOTS"""
        game = self.games[game_id]
        
        # Parser basique pour les commandes HOTS
        if "HERO(" in script:
            hero_name = script.split("HERO(")[1].split(")")[0]
            game["heroes"].append({
                "name": hero_name,
                "position": {"x": 25, "y": 25},
                "health": 150 if "grok" in hero_name else 100,
                "temporalEnergy": 50
            })
            return {
                "success": True,
                "message": f"Héros {hero_name} créé avec succès",
                "executionTime": 45,
                "tripleVoice": {
                    "gronde": "HÉROS INVOQUÉ",
                    "parle": f"{hero_name} entre dans l'arène",
                    "chante": "🎵 Un nouveau combattant 🎵"
                }
            }
            
        elif "PLACE(" in script:
            return {
                "success": True,
                "message": "Héros placé sur la carte",
                "executionTime": 30
            }
            
        elif "USE(ABILITY" in script:
            return {
                "success": True,
                "message": "Capacité utilisée avec succès",
                "damage": random.randint(20, 60),
                "executionTime": 50,
                "effect": "Effet appliqué à la cible"
            }
            
        elif "DIALOGUE(" in script:
            dialogue = script.split('"')[1] if '"' in script else "..."
            return {
                "success": True,
                "message": "Dialogue affiché",
                "dialogue": dialogue,
                "executionTime": 20
            }
            
        elif "ψ" in script or "⊙" in script:
            return {
                "success": True,
                "message": "État quantique créé/modifié",
                "psiState": {
                    "id": f"ψ{random.randint(1, 999):03d}",
                    "expression": script,
                    "status": "ACTIVE"
                },
                "executionTime": 60
            }
            
        else:
            return {
                "success": True,
                "message": f"Script exécuté: {script[:50]}...",
                "executionTime": 40
            }
    
    def send_json(self, data, status_code=200):
        """Send JSON response"""
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))
    
    def send_404(self):
        """Send 404 response"""
        self.send_response(404)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({
            "error": "Endpoint not found",
            "grokMessage": "⊙(404) + †ψ(Chemin perdu) → Δt+1(Retour nécessaire)"
        }, indent=2).encode('utf-8'))

if __name__ == '__main__':
    print("🌀⚔️ HEROES OF TIME MOCK BACKEND")
    print("⊙(Mock Server) + †ψ(Port 8080) → Δt+1(Prêt pour combat)")
    print("=" * 50)
    print("Endpoints disponibles:")
    print("  GET  /api/temporal/health - Vérifier santé")
    print("  POST /api/temporal/games - Créer partie")
    print("  GET  /api/temporal/games/{id} - État partie")
    print("  POST /api/temporal/games/{id}/script - Exécuter HOTS")
    print("  POST /api/temporal/execute - Commande simple")
    print("  GET  /api/particle-simulation/status - URZ-KÔM status")
    print("=" * 50)
    print("🌀 Serveur prêt sur http://localhost:8080")
    print("🎮 Le launcher HTML peut maintenant se connecter !")
    
    server = HTTPServer(('localhost', 8080), HeroesOfTimeHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🌀 Backend arrêté. ⊙(Fin) + †ψ(Repos) → Δt+1(À bientôt)")
        server.shutdown()