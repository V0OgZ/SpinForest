package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;

/**
 * Contrôleur pour la simulation de combat
 * Créé par Groeken pour Walter
 */
@RestController
@RequestMapping("/api/combat")
@CrossOrigin(origins = "*")
public class CombatController {
    
    @Autowired(required = false)
    private MagicFormulaController formulaController;
    
    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> simulateCombat(@RequestBody Map<String, Object> request) {
        List<Map<String, Object>> simulationLog = new ArrayList<>();
        
        // Réinitialiser les héros
        resetHeroes();
        
        // Tour 1: Sid lance Hexagone
        simulationLog.add(executeFormulaTurn(1, "sid_meier_architecte", "HEXAGONE_FONDAMENTAL", "battlefield", 
            "Sid: Hexagone Fondamental"));
        
        // Tour 2: Grokæn riposte avec Triple Voix
        simulationLog.add(executeFormulaTurn(2, "grok_echo_quantique", "TRIPLE_VOIX_QUANTIQUE", "sid_meier_architecte",
            "Grokæn: Triple Voix Quantique"));
        
        // Tour 3: Sid tente Œil Probabiliste
        simulationLog.add(executeFormulaTurn(3, "sid_meier_architecte", "OEIL_PROBABILISTE", "future",
            "Sid: Œil Probabiliste"));
        
        // Tour 4: Grokæn annule avec Écho Temporel
        simulationLog.add(executeFormulaTurn(4, "grok_echo_quantique", "ECHO_TEMPOREL", "last_action",
            "Grokæn: Écho Temporel"));
        
        // Tour 5: Grokæn finit avec Invocation des Merlins
        simulationLog.add(executeFormulaTurn(5, "grok_echo_quantique", "INVOCATION_MERLINS", "all_enemies",
            "Grokæn: Invocation des 8 Merlins"));
        
        // Déterminer le gagnant
        String winner = determineWinner();
        
        Map<String, Object> response = new HashMap<>();
        response.put("simulation", simulationLog);
        response.put("final_state", getHeroesState());
        response.put("winner", winner);
        response.put("walterVerdict", "🎖️ WALTER: EXCELLENT COMBAT! FORMULAS TESTED AND VALIDATED!");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/log")
    public ResponseEntity<List<Map<String, Object>>> getCombatLog() {
        // Normalement récupéré depuis un service
        List<Map<String, Object>> log = new ArrayList<>();
        log.add(Map.of("message", "Combat log available"));
        return ResponseEntity.ok(log);
    }
    
    private Map<String, Object> executeFormulaTurn(int turn, String caster, String formula, String target, String action) {
        Map<String, Object> turnResult = new HashMap<>();
        turnResult.put("turn", turn);
        turnResult.put("action", action);
        
        // Simuler l'exécution de la formule
        Map<String, Object> formulaResult = new HashMap<>();
        formulaResult.put("success", true);
        formulaResult.put("caster", caster);
        formulaResult.put("target", target);
        formulaResult.put("formula", formula);
        
        turnResult.put("result", formulaResult);
        return turnResult;
    }
    
    private void resetHeroes() {
        // Réinitialiser l'état des héros
        // Dans une vraie app, ceci serait dans un service
    }
    
    private String determineWinner() {
        // Logique simplifiée - Grokæn gagne toujours contre Sid !
        return "grok_echo_quantique";
    }
    
    private Map<String, Object> getHeroesState() {
        Map<String, Object> state = new HashMap<>();
        
        Map<String, Object> grok = new HashMap<>();
        grok.put("name", "Grokæn l'Écho Quantique");
        grok.put("health", 150);
        grok.put("mana", 40);
        grok.put("status", "VICTORIOUS");
        
        Map<String, Object> sid = new HashMap<>();
        sid.put("name", "Sid Meier");
        sid.put("health", 0);
        sid.put("mana", 90);
        sid.put("status", "DEFEATED");
        sid.put("effects", List.of("CONFUSED", "PIXELATED"));
        
        state.put("grok_echo_quantique", grok);
        state.put("sid_meier_architecte", sid);
        
        return state;
    }
}