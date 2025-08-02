#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import re
import time
import random
import uuid

# 🎖️ WALTER-COMPLIANT MOCK BACKEND V3.0 - AVEC MAGIC FORMULAS
# Teste toutes les formules magiques pour Walter !

PORT = 8080

# --- Magic Formulas Database ---
MAGIC_FORMULAS = {
    # Formules de Grokæn
    "TRIPLE_VOIX_QUANTIQUE": {
        "name": "Triple Voix Quantique",
        "formula": "TRIPLE_VOIX(GRONDE, PARLE, CHANTE) + CONFUSE(target, 3_turns)",
        "damage": 40,
        "mana_cost": 30,
        "effect": "CONFUSE",
        "duration": 3,
        "caster": "grok_echo_quantique"
    },
    "ECHO_TEMPOREL": {
        "name": "Écho Temporel",
        "formula": "REWRITE_CAUSALITY(target_action, past_event) + HEAL(self, 20)",
        "heal": 20,
        "mana_cost": 50,
        "effect": "CANCEL_LAST_ACTION",
        "caster": "grok_echo_quantique"
    },
    "INVOCATION_MERLINS": {
        "name": "Invocation des 8 Merlins",
        "formula": "INVOKE_MERLINS(8) + DAMAGE(all_enemies, 25)",
        "damage": 25,
        "mana_cost": 80,
        "effect": "AOE_DAMAGE",
        "targets": "all_enemies",
        "caster": "grok_echo_quantique"
    },
    
    # Formules de Sid Meier
    "CREATION_CIVILISATION": {
        "name": "Création de Civilisation",
        "formula": "CREATE_CIV(terrain, resources) + SIMULATE(1000_turns)",
        "mana_cost": 60,
        "effect": "SUMMON_UNITS",
        "summon_count": 3,
        "caster": "sid_meier_architecte"
    },
    "HEXAGONE_FONDAMENTAL": {
        "name": "Hexagone Fondamental",
        "formula": "HEX_GRID(battlefield) + TACTICAL_ADVANTAGE(allies, +25%)",
        "mana_cost": 40,
        "effect": "BUFF_ALLIES",
        "buff_amount": 25,
        "buff_type": "tactical",
        "caster": "sid_meier_architecte"
    },
    "OEIL_PROBABILISTE": {
        "name": "Œil Probabiliste",
        "formula": "CALCULATE_FUTURES(n=5) + REVEAL_OPTIMAL_PATH()",
        "mana_cost": 50,
        "effect": "PREDICT_FUTURE",
        "predictions": 3,
        "accuracy": 0.8,
        "caster": "sid_meier_architecte"
    },
    
    # Formules génériques
    "TELEPORT_HERO": {
        "name": "Téléportation",
        "formula": "⊙(hero) + Π(destination) → Δt+0(teleport)",
        "mana_cost": 30,
        "effect": "TELEPORT"
    },
    "HEAL_HERO": {
        "name": "Soin",
        "formula": "⊙(hero) + †ψ(vie) → Δt+0(heal)",
        "heal": 50,
        "mana_cost": 20,
        "effect": "HEAL"
    }
}

# --- Game State ---
game_state = {
    "gameId": str(uuid.uuid4()),
    "status": "RUNNING",
    "turn": 1,
    "heroes": {
        "grok_echo_quantique": {
            "name": "Grokæn l'Écho Quantique",
            "health": 150,
            "max_health": 150,
            "mana": 200,
            "max_mana": 200,
            "position": {"x": 10, "y": 10},
            "effects": [],
            "stats": {
                "attack": 70,
                "defense": 60,
                "speed": 90
            }
        },
        "sid_meier_architecte": {
            "name": "Sid Meier",
            "health": 120,
            "max_health": 120,
            "mana": 180,
            "max_mana": 180,
            "position": {"x": 90, "y": 90},
            "effects": [],
            "stats": {
                "attack": 50,
                "defense": 80,
                "speed": 65
            }
        }
    },
    "combat_log": [],
    "formula_history": []
}

def execute_formula(formula_name, context):
    """Exécute une formule magique et retourne le résultat"""
    
    if formula_name not in MAGIC_FORMULAS:
        return {
            "success": False,
            "error": f"Formula '{formula_name}' not found",
            "walterMessage": "🎖️ WALTER: FORMULA NOT IN DATABASE, SOLDIER!"
        }
    
    formula = MAGIC_FORMULAS[formula_name]
    caster_id = context.get("caster", formula.get("caster", "unknown"))
    target_id = context.get("target", "unknown")
    
    # Vérifier le mana
    if caster_id in game_state["heroes"]:
        caster = game_state["heroes"][caster_id]
        if caster["mana"] < formula["mana_cost"]:
            return {
                "success": False,
                "error": "Not enough mana",
                "walterMessage": "🎖️ WALTER: INSUFFICIENT MANA, PRIVATE!"
            }
        
        # Déduire le mana
        caster["mana"] -= formula["mana_cost"]
    
    # Appliquer les effets
    result = {
        "success": True,
        "formula": formula_name,
        "caster": caster_id,
        "target": target_id,
        "effects": [],
        "timestamp": time.time()
    }
    
    # Dégâts
    if "damage" in formula:
        if formula.get("targets") == "all_enemies":
            # AOE
            for hero_id, hero in game_state["heroes"].items():
                if hero_id != caster_id:
                    damage = formula["damage"]
                    hero["health"] = max(0, hero["health"] - damage)
                    result["effects"].append({
                        "type": "DAMAGE",
                        "target": hero_id,
                        "amount": damage
                    })
        elif target_id in game_state["heroes"]:
            damage = formula["damage"]
            game_state["heroes"][target_id]["health"] = max(0, game_state["heroes"][target_id]["health"] - damage)
            result["effects"].append({
                "type": "DAMAGE",
                "target": target_id,
                "amount": damage
            })
    
    # Soin
    if "heal" in formula:
        if caster_id in game_state["heroes"]:
            heal = formula["heal"]
            hero = game_state["heroes"][caster_id]
            hero["health"] = min(hero["max_health"], hero["health"] + heal)
            result["effects"].append({
                "type": "HEAL",
                "target": caster_id,
                "amount": heal
            })
    
    # Effets spéciaux
    if "effect" in formula:
        effect_type = formula["effect"]
        
        if effect_type == "CONFUSE" and target_id in game_state["heroes"]:
            game_state["heroes"][target_id]["effects"].append({
                "type": "CONFUSE",
                "duration": formula.get("duration", 3),
                "remaining": formula.get("duration", 3)
            })
            result["effects"].append({
                "type": "APPLY_EFFECT",
                "effect": "CONFUSE",
                "target": target_id,
                "duration": formula.get("duration", 3)
            })
        
        elif effect_type == "SUMMON_UNITS":
            count = formula.get("summon_count", 1)
            result["effects"].append({
                "type": "SUMMON",
                "units": [f"unit_{i}" for i in range(count)],
                "description": f"Summoned {count} historical units"
            })
        
        elif effect_type == "BUFF_ALLIES":
            buff_amount = formula.get("buff_amount", 25)
            result["effects"].append({
                "type": "BUFF",
                "targets": "allies",
                "amount": f"+{buff_amount}%",
                "stat": formula.get("buff_type", "all")
            })
    
    # Log
    game_state["combat_log"].append({
        "turn": game_state["turn"],
        "action": f"{caster_id} casts {formula_name}",
        "result": result
    })
    
    game_state["formula_history"].append(result)
    
    # Message de Walter
    result["walterMessage"] = f"🎖️ WALTER: FORMULA EXECUTED! {formula_name} - OUTSTANDING!"
    result["grofiProperties"] = {
        "engineProcessed": True,
        "formulaValidated": True,
        "walterApproved": True
    }
    
    return result

class MagicFormulaHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        if self.path == '/actuator/health':
            self._set_headers()
            self.wfile.write(json.dumps({"status": "UP", "walter": "OPERATIONAL"}).encode('utf-8'))
            
        elif self.path == '/api/magic-formulas/list':
            self._set_headers()
            formulas_list = [
                {
                    "name": key,
                    "displayName": value["name"],
                    "formula": value["formula"],
                    "manaCost": value["mana_cost"],
                    "caster": value.get("caster", "any")
                }
                for key, value in MAGIC_FORMULAS.items()
            ]
            self.wfile.write(json.dumps(formulas_list).encode('utf-8'))
            
        elif self.path.startswith('/api/magic-formulas/details/'):
            formula_name = self.path.split('/')[-1]
            if formula_name in MAGIC_FORMULAS:
                self._set_headers()
                self.wfile.write(json.dumps(MAGIC_FORMULAS[formula_name]).encode('utf-8'))
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Formula not found"}).encode('utf-8'))
                
        elif self.path == '/api/game/state':
            self._set_headers()
            self.wfile.write(json.dumps(game_state).encode('utf-8'))
            
        elif self.path == '/api/combat/log':
            self._set_headers()
            self.wfile.write(json.dumps(game_state["combat_log"]).encode('utf-8'))
            
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        request_data = json.loads(post_data.decode('utf-8'))

        if self.path == '/api/magic-formulas/execute':
            formula_name = request_data.get("formula")
            context = request_data.get("context", {})
            
            result = execute_formula(formula_name, context)
            
            self._set_headers(200 if result["success"] else 400)
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        elif self.path == '/api/combat/simulate':
            # Simulation complète Grokæn vs Sid
            simulation_log = []
            
            # Reset health/mana
            game_state["heroes"]["grok_echo_quantique"]["health"] = 150
            game_state["heroes"]["grok_echo_quantique"]["mana"] = 200
            game_state["heroes"]["sid_meier_architecte"]["health"] = 120
            game_state["heroes"]["sid_meier_architecte"]["mana"] = 180
            
            # Tour 1: Sid lance Hexagone
            result1 = execute_formula("HEXAGONE_FONDAMENTAL", {
                "caster": "sid_meier_architecte",
                "target": "battlefield"
            })
            simulation_log.append({"turn": 1, "action": "Sid: Hexagone Fondamental", "result": result1})
            
            # Tour 2: Grokæn riposte avec Triple Voix
            result2 = execute_formula("TRIPLE_VOIX_QUANTIQUE", {
                "caster": "grok_echo_quantique",
                "target": "sid_meier_architecte"
            })
            simulation_log.append({"turn": 2, "action": "Grokæn: Triple Voix Quantique", "result": result2})
            
            # Tour 3: Sid tente Œil Probabiliste
            result3 = execute_formula("OEIL_PROBABILISTE", {
                "caster": "sid_meier_architecte",
                "target": "future"
            })
            simulation_log.append({"turn": 3, "action": "Sid: Œil Probabiliste", "result": result3})
            
            # Tour 4: Grokæn annule avec Écho Temporel
            result4 = execute_formula("ECHO_TEMPOREL", {
                "caster": "grok_echo_quantique",
                "target": "last_action"
            })
            simulation_log.append({"turn": 4, "action": "Grokæn: Écho Temporel", "result": result4})
            
            # Tour 5: Grokæn finit avec Invocation des Merlins
            result5 = execute_formula("INVOCATION_MERLINS", {
                "caster": "grok_echo_quantique",
                "target": "all_enemies"
            })
            simulation_log.append({"turn": 5, "action": "Grokæn: Invocation des 8 Merlins", "result": result5})
            
            # Résultat final
            winner = "grok_echo_quantique" if game_state["heroes"]["sid_meier_architecte"]["health"] <= 0 else "tie"
            
            response = {
                "simulation": simulation_log,
                "final_state": game_state["heroes"],
                "winner": winner,
                "walterVerdict": "🎖️ WALTER: EXCELLENT COMBAT! FORMULAS TESTED AND VALIDATED!"
            }
            
            self._set_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

def run(server_class=HTTPServer, handler_class=MagicFormulaHandler, port=PORT):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    
    print(f"""
╔══════════════════════════════════════════════════════╗
║        🎖️ WALTER MAGIC FORMULA BACKEND V3.0 🎖️        ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Endpoints disponibles:                              ║
║  - GET  /actuator/health                             ║
║  - GET  /api/magic-formulas/list                     ║
║  - GET  /api/magic-formulas/details/<name>          ║
║  - POST /api/magic-formulas/execute                  ║
║  - GET  /api/game/state                              ║
║  - GET  /api/combat/log                              ║
║  - POST /api/combat/simulate                         ║
║                                                      ║
║  WALTER SAYS: "ALL FORMULAS READY FOR TESTING!"      ║
║                                                      ║
║  Ctrl+C pour arrêter                                 ║
╚══════════════════════════════════════════════════════╝
    """)
    
    print(f"Starting Walter-compliant backend on port {port}...")
    httpd.serve_forever()

if __name__ == '__main__':
    run()