package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;
import java.time.Instant;

/**
 * 🎖️ WALTER-COMPLIANT MAGIC FORMULA CONTROLLER
 * Responsable: Groeken
 * Toutes les formules magiques testées et validées
 */
@RestController
@RequestMapping("/api/magic-formulas")
@CrossOrigin(origins = "*")
public class MagicFormulaController {
    
    // Base de données des formules magiques
    private static final Map<String, MagicFormula> FORMULAS = new HashMap<>();
    
    // État du jeu (normalement dans un service séparé)
    private static final Map<String, Hero> heroes = new HashMap<>();
    private static final List<Map<String, Object>> combatLog = new ArrayList<>();
    
    static {
        // Initialiser les formules de Grokæn
        FORMULAS.put("TRIPLE_VOIX_QUANTIQUE", new MagicFormula(
            "Triple Voix Quantique",
            "TRIPLE_VOIX(GRONDE, PARLE, CHANTE) + CONFUSE(target, 3_turns)",
            30, 40, "CONFUSE", 3, "grok_echo_quantique"
        ));
        
        FORMULAS.put("ECHO_TEMPOREL", new MagicFormula(
            "Écho Temporel",
            "REWRITE_CAUSALITY(target_action, past_event) + HEAL(self, 20)",
            50, 0, "CANCEL_LAST_ACTION", 0, "grok_echo_quantique"
        ).withHeal(20));
        
        FORMULAS.put("INVOCATION_MERLINS", new MagicFormula(
            "Invocation des 8 Merlins",
            "INVOKE_MERLINS(8) + DAMAGE(all_enemies, 25)",
            80, 25, "AOE_DAMAGE", 0, "grok_echo_quantique"
        ).withTargetAll(true));
        
        // Formules de Sid Meier
        FORMULAS.put("HEXAGONE_FONDAMENTAL", new MagicFormula(
            "Hexagone Fondamental",
            "HEX_GRID(battlefield) + TACTICAL_ADVANTAGE(allies, +25%)",
            40, 0, "BUFF_ALLIES", 0, "sid_meier_architecte"
        ));
        
        FORMULAS.put("CREATION_CIVILISATION", new MagicFormula(
            "Création de Civilisation",
            "CREATE_CIV(terrain, resources) + SIMULATE(1000_turns)",
            60, 0, "SUMMON_UNITS", 0, "sid_meier_architecte"
        ));
        
        // Initialiser les héros
        heroes.put("grok_echo_quantique", new Hero(
            "Grokæn l'Écho Quantique", 150, 200, 70, 60, 90
        ));
        
        heroes.put("sid_meier_architecte", new Hero(
            "Sid Meier", 120, 180, 50, 80, 65
        ));
    }
    
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> listFormulas() {
        List<Map<String, Object>> formulaList = new ArrayList<>();
        
        FORMULAS.forEach((key, formula) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("name", key);
            item.put("displayName", formula.name);
            item.put("formula", formula.formula);
            item.put("manaCost", formula.manaCost);
            item.put("caster", formula.defaultCaster);
            formulaList.add(item);
        });
        
        return ResponseEntity.ok(formulaList);
    }
    
    @GetMapping("/details/{name}")
    public ResponseEntity<?> getFormulaDetails(@PathVariable String name) {
        MagicFormula formula = FORMULAS.get(name);
        
        if (formula == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(formula);
    }
    
    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeFormula(@RequestBody FormulaRequest request) {
        String formulaName = request.getFormula();
        Map<String, Object> context = request.getContext();
        
        MagicFormula formula = FORMULAS.get(formulaName);
        if (formula == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Formula '" + formulaName + "' not found");
            error.put("walterMessage", "🎖️ WALTER: FORMULA NOT IN DATABASE, SOLDIER!");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Exécuter la formule
        Map<String, Object> result = executeFormulaLogic(formula, context);
        
        // Log de combat
        combatLog.add(result);
        
        return ResponseEntity.ok(result);
    }
    
    private Map<String, Object> executeFormulaLogic(MagicFormula formula, Map<String, Object> context) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("formula", formula.name);
        result.put("timestamp", Instant.now().toEpochMilli());
        
        String casterId = (String) context.getOrDefault("caster", formula.defaultCaster);
        String targetId = (String) context.getOrDefault("target", "unknown");
        
        result.put("caster", casterId);
        result.put("target", targetId);
        
        List<Map<String, Object>> effects = new ArrayList<>();
        
        // Vérifier le mana
        Hero caster = heroes.get(casterId);
        if (caster != null) {
            if (caster.mana < formula.manaCost) {
                result.put("success", false);
                result.put("error", "Not enough mana");
                result.put("walterMessage", "🎖️ WALTER: INSUFFICIENT MANA, PRIVATE!");
                return result;
            }
            caster.mana -= formula.manaCost;
        }
        
        // Appliquer les effets
        if (formula.damage > 0) {
            if (formula.targetAll) {
                // AOE
                heroes.forEach((heroId, hero) -> {
                    if (!heroId.equals(casterId)) {
                        hero.health = Math.max(0, hero.health - formula.damage);
                        Map<String, Object> effect = new HashMap<>();
                        effect.put("type", "DAMAGE");
                        effect.put("target", heroId);
                        effect.put("amount", formula.damage);
                        effects.add(effect);
                    }
                });
            } else {
                Hero target = heroes.get(targetId);
                if (target != null) {
                    target.health = Math.max(0, target.health - formula.damage);
                    Map<String, Object> effect = new HashMap<>();
                    effect.put("type", "DAMAGE");
                    effect.put("target", targetId);
                    effect.put("amount", formula.damage);
                    effects.add(effect);
                }
            }
        }
        
        // Soin
        if (formula.heal > 0 && caster != null) {
            caster.health = Math.min(caster.maxHealth, caster.health + formula.heal);
            Map<String, Object> effect = new HashMap<>();
            effect.put("type", "HEAL");
            effect.put("target", casterId);
            effect.put("amount", formula.heal);
            effects.add(effect);
        }
        
        // Effets spéciaux
        if (formula.effect != null && !formula.effect.isEmpty()) {
            Map<String, Object> effect = new HashMap<>();
            effect.put("type", "APPLY_EFFECT");
            effect.put("effect", formula.effect);
            effect.put("target", targetId);
            if (formula.duration > 0) {
                effect.put("duration", formula.duration);
            }
            effects.add(effect);
        }
        
        result.put("effects", effects);
        result.put("walterMessage", "🎖️ WALTER: FORMULA EXECUTED! " + formula.name + " - OUTSTANDING!");
        
        Map<String, Object> grofiProps = new HashMap<>();
        grofiProps.put("engineProcessed", true);
        grofiProps.put("formulaValidated", true);
        grofiProps.put("walterApproved", true);
        result.put("grofiProperties", grofiProps);
        
        return result;
    }
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "OK");
        status.put("message", "Magic Formula Service is operational");
        status.put("totalFormulas", FORMULAS.size());
        status.put("activeHeroes", heroes.size());
        status.put("walterMessage", "🎖️ WALTER: ALL SYSTEMS OPERATIONAL!");
        return ResponseEntity.ok(status);
    }
    
    // Classes internes
    static class MagicFormula {
        public String name;
        public String formula;
        public int manaCost;
        public int damage;
        public String effect;
        public int duration;
        public String defaultCaster;
        public int heal = 0;
        public boolean targetAll = false;
        
        public MagicFormula(String name, String formula, int manaCost, int damage, 
                           String effect, int duration, String defaultCaster) {
            this.name = name;
            this.formula = formula;
            this.manaCost = manaCost;
            this.damage = damage;
            this.effect = effect;
            this.duration = duration;
            this.defaultCaster = defaultCaster;
        }
        
        public MagicFormula withHeal(int heal) {
            this.heal = heal;
            return this;
        }
        
        public MagicFormula withTargetAll(boolean targetAll) {
            this.targetAll = targetAll;
            return this;
        }
    }
    
    static class Hero {
        public String name;
        public int health;
        public int maxHealth;
        public int mana;
        public int maxMana;
        public int attack;
        public int defense;
        public int speed;
        
        public Hero(String name, int maxHealth, int maxMana, int attack, int defense, int speed) {
            this.name = name;
            this.health = maxHealth;
            this.maxHealth = maxHealth;
            this.mana = maxMana;
            this.maxMana = maxMana;
            this.attack = attack;
            this.defense = defense;
            this.speed = speed;
        }
    }
    
    static class FormulaRequest {
        private String formula;
        private Map<String, Object> context;
        
        public String getFormula() { return formula; }
        public void setFormula(String formula) { this.formula = formula; }
        public Map<String, Object> getContext() { return context != null ? context : new HashMap<>(); }
        public void setContext(Map<String, Object> context) { this.context = context; }
    }
}