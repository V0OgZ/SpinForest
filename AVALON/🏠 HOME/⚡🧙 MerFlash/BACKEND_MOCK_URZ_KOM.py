#!/usr/bin/env python3
# ⚡ MERFLASH: Backend Mock URZ-KÔM pour tester l'intégration
# ⊙(Mock Backend) + †ψ(Test URZ-KÔM) → Δt+1(Validation intégration)

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import uuid
import math
import random
import time
from urllib.parse import urlparse, parse_qs

class URZKOMHandler(BaseHTTPRequestHandler):
    # Simulation state
    particles = {}
    simulation_running = False
    
    def do_GET(self):
        path = urlparse(self.path).path
        
        if path == '/api/particle-simulation/status':
            self.send_json({
                "simulationRunning": self.simulation_running,
                "particleCount": len(self.particles),
                "timestamp": int(time.time() * 1000),
                "urzKomMessage": "🐻 Chamane-Ours surveille les particules quantiques (MOCK)",
                "particleTypes": [
                    {"name": "UP_QUARK", "symbol": "u", "mass": 2.3e-3, "charge": 2.0/3.0, "color": "#FF0000"},
                    {"name": "DOWN_QUARK", "symbol": "d", "mass": 4.8e-3, "charge": -1.0/3.0, "color": "#0000FF"},
                    {"name": "ELECTRON", "symbol": "e-", "mass": 0.511e-3, "charge": -1.0, "color": "#00FFFF"},
                    {"name": "PHOTON", "symbol": "γ", "mass": 0, "charge": 0, "color": "#FFFF00"}
                ]
            })
        elif path == '/api/particle-simulation/particles':
            particles_list = [self.particle_to_json(p) for p in self.particles.values()]
            self.send_json({
                "particles": particles_list,
                "count": len(particles_list),
                "timestamp": int(time.time() * 1000),
                "urzKomMessage": "🐻 Voici mes particules quantiques, observateur ! (MOCK)"
            })
        else:
            self.send_404()
    
    def do_POST(self):
        path = urlparse(self.path).path
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        
        try:
            data = json.loads(post_data.decode('utf-8')) if post_data != b'{}' else {}
        except:
            data = {}
        
        if path == '/api/particle-simulation/start':
            if self.simulation_running:
                self.send_json({
                    "error": "Simulation already running",
                    "urzKomMessage": "🐻 L'Ours grogne : La simulation tourne déjà ! (MOCK)"
                }, 400)
            else:
                self.simulation_running = True
                self.init_particles()
                self.send_json({
                    "message": "🐻 Quantum particle simulation started (MOCK)",
                    "particleCount": len(self.particles),
                    "urzKomMessage": "⊙(Particules créées) + †ψ(Simulation lancée) → Δt+1(Physique quantique active) [MOCK]"
                })
        
        elif path == '/api/particle-simulation/stop':
            self.simulation_running = False
            self.send_json({
                "message": "Simulation stopped (MOCK)",
                "urzKomMessage": "🐻 L'Ours se repose. Particules figées dans l'ambre temporel. (MOCK)"
            })
        
        elif path == '/api/particle-simulation/create-particle':
            particle_type = data.get('type', 'ELECTRON')
            x = data.get('x', random.uniform(-5, 5))
            y = data.get('y', random.uniform(-5, 5))
            z = data.get('z', random.uniform(-5, 5))
            
            particle = self.create_particle(particle_type, x, y, z)
            if particle:
                self.particles[particle['id']] = particle
                self.send_json({
                    "message": "Particle created (MOCK)",
                    "particle": self.particle_to_json(particle),
                    "urzKomMessage": "🐻 Nouvelle particule matérialisée par l'Ours-Chaman ! (MOCK)"
                })
            else:
                self.send_json({
                    "error": f"Invalid particle type: {particle_type} (MOCK)",
                    "urzKomMessage": "🐻 L'Ours grogne : Type de particule inconnu ! (MOCK)"
                }, 400)
        
        else:
            self.send_404()
    
    def init_particles(self):
        """Initialize with some particles like the real backend"""
        # Hydrogen atom
        proton = self.create_particle('PROTON', 0, 0, 0)
        electron = self.create_particle('ELECTRON', 1, 0, 0)
        
        if proton and electron:
            self.particles[proton['id']] = proton
            self.particles[electron['id']] = electron
        
        # Some quarks
        for i in range(4):
            quark_types = ['UP_QUARK', 'DOWN_QUARK', 'CHARM_QUARK', 'STRANGE_QUARK']
            quark_type = quark_types[i % len(quark_types)]
            quark = self.create_particle(
                quark_type,
                random.uniform(-5, 5),
                random.uniform(-5, 5),
                random.uniform(-5, 5)
            )
            if quark:
                self.particles[quark['id']] = quark
        
        # Some photons
        for i in range(3):
            photon = self.create_particle(
                'PHOTON',
                random.uniform(-5, 5),
                random.uniform(-5, 5),
                random.uniform(-5, 5)
            )
            if photon:
                self.particles[photon['id']] = photon
    
    def create_particle(self, particle_type, x, y, z):
        """Create a particle with quantum properties"""
        particle_types = {
            'UP_QUARK': {"symbol": "u", "mass": 2.3e-3, "charge": 2.0/3.0, "color": "#FF0000"},
            'DOWN_QUARK': {"symbol": "d", "mass": 4.8e-3, "charge": -1.0/3.0, "color": "#0000FF"},
            'CHARM_QUARK': {"symbol": "c", "mass": 1.275, "charge": 2.0/3.0, "color": "#FF00FF"},
            'STRANGE_QUARK': {"symbol": "s", "mass": 95e-3, "charge": -1.0/3.0, "color": "#00FF00"},
            'ELECTRON': {"symbol": "e-", "mass": 0.511e-3, "charge": -1.0, "color": "#00FFFF"},
            'POSITRON': {"symbol": "e+", "mass": 0.511e-3, "charge": 1.0, "color": "#FF00FF"},
            'PHOTON': {"symbol": "γ", "mass": 0, "charge": 0, "color": "#FFFF00"},
            'PROTON': {"symbol": "p", "mass": 938.3e-3, "charge": 1.0, "color": "#FF6347"},
            'NEUTRON': {"symbol": "n", "mass": 939.6e-3, "charge": 0, "color": "#708090"}
        }
        
        if particle_type not in particle_types:
            return None
        
        ptype = particle_types[particle_type]
        
        return {
            'id': str(uuid.uuid4()),
            'type': particle_type,
            'symbol': ptype['symbol'],
            'position': {'x': x, 'y': y, 'z': z},
            'velocity': {
                'vx': random.uniform(-0.1, 0.1),
                'vy': random.uniform(-0.1, 0.1),
                'vz': random.uniform(-0.1, 0.1)
            },
            'mass': ptype['mass'],
            'charge': ptype['charge'],
            'color': ptype['color'],
            'psiState': {
                'real': random.uniform(0, 1),
                'imaginary': random.uniform(0, 1),
                'magnitude': 0,  # Will be calculated
                'phase': 0       # Will be calculated
            },
            'energy': ptype['mass'] * (1 + random.uniform(0, 0.1)),  # Simplified
            'momentum': random.uniform(0, 0.1),
            'entangledWith': [],
            'collapsed': False,
            'age': 0,
            'createdAt': int(time.time() * 1000)
        }
    
    def particle_to_json(self, particle):
        """Convert particle to JSON with calculated properties"""
        psi = particle['psiState']
        psi['magnitude'] = math.sqrt(psi['real']**2 + psi['imaginary']**2)
        psi['phase'] = math.atan2(psi['imaginary'], psi['real'])
        particle['probability'] = psi['magnitude']**2
        particle['age'] = int(time.time() * 1000) - particle['createdAt']
        return particle
    
    def send_json(self, data, status_code=200):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
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
            "urzKomMessage": "🐻 L'Ours grogne : Chemin inconnu dans la forêt quantique !"
        }, indent=2).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    print("🐻⚛️ URZ-KÔM Mock Backend démarrage...")
    print("⊙(Mock Server) + †ψ(Port 8080) → Δt+1(Test URZ-KÔM)")
    print("Endpoints disponibles:")
    print("  GET  /api/particle-simulation/status")
    print("  POST /api/particle-simulation/start")
    print("  POST /api/particle-simulation/stop")
    print("  GET  /api/particle-simulation/particles")
    print("  POST /api/particle-simulation/create-particle")
    print("🌀 Serveur prêt sur http://localhost:8080")
    
    server = HTTPServer(('localhost', 8080), URZKOMHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🐻 L'Ours se retire. Mock backend arrêté.")
        server.shutdown()