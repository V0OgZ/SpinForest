/**
 * 🎮 UNIFIED COMBAT SYSTEM - REALGAME
 * Fusion des systèmes de combat de GROEKEN, SID et LUMEN
 */

class UnifiedCombatSystem {
    constructor() {
        this.combatants = [];
        this.projectiles = [];
        this.effects = [];
        this.combatLog = [];
        this.currentTurn = 0;
        this.mode = 'realtime'; // 'realtime' ou 'turnbased'
    }

    /**
     * Initialise un combat entre héros et ennemis
     */
    startCombat(heroes, enemies, battlefield) {
        this.combatants = [...heroes, ...enemies];
        this.battlefield = battlefield;
        this.combatLog = [];
        this.currentTurn = 0;
        
        this.addLog("⚔️ COMBAT COMMENCÉ !", 'system');
        
        // Trier par initiative
        this.combatants.sort((a, b) => b.speed - a.speed);
        
        return {
            status: 'started',
            combatants: this.combatants,
            battlefield: this.battlefield
        };
    }

    /**
     * Exécute une attaque basique
     */
    executeAttack(attacker, target, options = {}) {
        const { throughPortal = false, ability = null } = options;
        
        // Vérifier si l'attaquant peut agir
        if (!this.canAct(attacker)) {
            return { success: false, reason: 'Cannot act' };
        }
        
        // Calculer les dégâts
        let damage = this.calculateDamage(attacker, target, ability);
        
        // Bonus portal (SID's idea)
        if (throughPortal) {
            damage = Math.floor(damage * 1.5);
            this.addEffect({
                type: 'portal_strike',
                visual: 'purple_flash',
                position: target.position
            });
        }
        
        // Appliquer les dégâts
        target.hp -= damage;
        
        // Log
        this.addLog(
            `${attacker.name} attaque ${target.name} pour ${damage} dégâts${throughPortal ? ' (Via Portal!)' : ''}`,
            'damage'
        );
        
        // Vérifier si la cible est KO
        if (target.hp <= 0) {
            this.handleDefeat(target);
        }
        
        // Créer projectile visuel (pour le mode temps réel)
        if (this.mode === 'realtime') {
            this.createProjectile(attacker, target, damage);
        }
        
        return {
            success: true,
            damage: damage,
            targetDefeated: target.hp <= 0
        };
    }

    /**
     * Lance une capacité spéciale
     */
    executeAbility(caster, ability, targets) {
        // Vérifier le mana
        if (caster.mp < ability.manaCost) {
            return { success: false, reason: 'Not enough mana' };
        }
        
        caster.mp -= ability.manaCost;
        
        // Effets selon le type d'ability
        switch (ability.type) {
            case 'damage_area':
                return this.executeAreaDamage(caster, ability, targets);
                
            case 'heal':
                return this.executeHeal(caster, ability, targets);
                
            case 'teleport':
                return this.executeTeleport(caster, ability, targets);
                
            case 'temporal':
                return this.executeTemporalAbility(caster, ability, targets);
                
            default:
                return { success: false, reason: 'Unknown ability type' };
        }
    }

    /**
     * Dégâts de zone
     */
    executeAreaDamage(caster, ability, centerPosition) {
        const affected = this.getUnitsInRadius(centerPosition, ability.radius);
        let totalDamage = 0;
        
        affected.forEach(unit => {
            if (unit.team !== caster.team) {
                const damage = this.calculateAbilityDamage(caster, unit, ability);
                unit.hp -= damage;
                totalDamage += damage;
                
                this.addEffect({
                    type: 'explosion',
                    position: unit.position,
                    color: ability.color || '#FF6600'
                });
            }
        });
        
        this.addLog(
            `${caster.name} lance ${ability.name} ! ${affected.length} cibles touchées pour ${totalDamage} dégâts total`,
            'ability'
        );
        
        return { success: true, affected: affected.length, totalDamage };
    }

    /**
     * Soin
     */
    executeHeal(caster, ability, targets) {
        let totalHealed = 0;
        
        targets.forEach(target => {
            if (target.team === caster.team) {
                const healAmount = ability.power + (caster.magic * 0.5);
                const actualHeal = Math.min(healAmount, target.maxHp - target.hp);
                target.hp += actualHeal;
                totalHealed += actualHeal;
                
                this.addEffect({
                    type: 'heal',
                    position: target.position,
                    color: '#00FF00'
                });
            }
        });
        
        this.addLog(
            `${caster.name} soigne pour ${totalHealed} PV !`,
            'heal'
        );
        
        return { success: true, totalHealed };
    }

    /**
     * Téléportation (BRISURE style)
     */
    executeTeleport(caster, ability, destination) {
        const oldPosition = { ...caster.position };
        
        // Effet de départ
        this.addEffect({
            type: 'brisure_out',
            position: oldPosition,
            color: '#8B00FF'
        });
        
        // Téléporter
        caster.position = destination;
        
        // Effet d'arrivée
        this.addEffect({
            type: 'brisure_in',
            position: destination,
            color: '#8B00FF'
        });
        
        this.addLog(
            `${caster.name} se téléporte via la BRISURE !`,
            'special'
        );
        
        return { success: true, from: oldPosition, to: destination };
    }

    /**
     * Capacité temporelle (Grammaire LUMEN)
     */
    executeTemporalAbility(caster, ability, targets) {
        // Exemple : Ralentir le temps pour les ennemis
        targets.forEach(target => {
            if (target.team !== caster.team) {
                target.temporalState = 'slowed';
                target.speedModifier = 0.5;
                
                this.addEffect({
                    type: 'temporal_distortion',
                    position: target.position,
                    duration: ability.duration
                });
            }
        });
        
        this.addLog(
            `${caster.name} manipule le temps ! Ennemis ralentis`,
            'temporal'
        );
        
        return { success: true, affected: targets.length };
    }

    /**
     * Calcul des dégâts
     */
    calculateDamage(attacker, target, ability = null) {
        let baseDamage = ability ? ability.power : attacker.attack;
        
        // Modificateurs
        let attackBonus = 1;
        let defenseReduction = target.defense * 0.5;
        
        // Bonus de type (pierre-papier-ciseaux)
        if (this.hasTypeAdvantage(attacker.type, target.type)) {
            attackBonus *= 1.5;
        }
        
        // Calcul final
        let finalDamage = Math.max(1, (baseDamage * attackBonus) - defenseReduction);
        
        // Critique (10% chance)
        if (Math.random() < 0.1) {
            finalDamage *= 2;
            this.addEffect({
                type: 'critical',
                position: target.position
            });
        }
        
        return Math.floor(finalDamage);
    }

    /**
     * Calcul dégâts ability
     */
    calculateAbilityDamage(caster, target, ability) {
        const magicPower = ability.power + (caster.magic * ability.scaling);
        const resistance = target.magicDefense || 0;
        return Math.max(1, Math.floor(magicPower - resistance));
    }

    /**
     * Vérifie si une unité peut agir
     */
    canAct(unit) {
        return unit.hp > 0 && 
               !unit.stunned && 
               unit.temporalState !== 'frozen';
    }

    /**
     * Gère la défaite d'une unité
     */
    handleDefeat(unit) {
        unit.hp = 0;
        unit.defeated = true;
        
        this.addLog(
            `${unit.name} est vaincu !`,
            'defeat'
        );
        
        // Drop de loot ?
        if (unit.loot) {
            this.dropLoot(unit.position, unit.loot);
        }
        
        // Vérifier fin de combat
        this.checkCombatEnd();
    }

    /**
     * Vérifie si le combat est terminé
     */
    checkCombatEnd() {
        const heroesAlive = this.combatants.filter(c => c.team === 'hero' && c.hp > 0);
        const enemiesAlive = this.combatants.filter(c => c.team === 'enemy' && c.hp > 0);
        
        if (heroesAlive.length === 0) {
            this.endCombat('defeat');
        } else if (enemiesAlive.length === 0) {
            this.endCombat('victory');
        }
    }

    /**
     * Termine le combat
     */
    endCombat(result) {
        this.addLog(
            result === 'victory' ? '🎉 VICTOIRE !' : '💀 DÉFAITE...',
            'system'
        );
        
        // Calculer récompenses
        if (result === 'victory') {
            const rewards = this.calculateRewards();
            return { result, rewards };
        }
        
        return { result };
    }

    /**
     * Calcule les récompenses
     */
    calculateRewards() {
        const defeatedEnemies = this.combatants.filter(c => c.team === 'enemy' && c.defeated);
        let totalXP = 0;
        let totalGold = 0;
        let items = [];
        
        defeatedEnemies.forEach(enemy => {
            totalXP += enemy.xpReward || (enemy.level * 50);
            totalGold += enemy.goldReward || (enemy.level * 20);
            
            // Chance de drop d'item
            if (Math.random() < 0.3) {
                items.push(this.generateRandomItem(enemy.level));
            }
        });
        
        return { xp: totalXP, gold: totalGold, items };
    }

    /**
     * Crée un projectile visuel
     */
    createProjectile(from, to, damage) {
        this.projectiles.push({
            id: Date.now(),
            from: { ...from.position },
            to: { ...to.position },
            current: { ...from.position },
            damage: damage,
            speed: 10,
            color: from.projectileColor || '#FFD700'
        });
    }

    /**
     * Met à jour les projectiles (mode temps réel)
     */
    updateProjectiles(deltaTime) {
        this.projectiles = this.projectiles.filter(proj => {
            // Calculer mouvement
            const dx = proj.to.x - proj.current.x;
            const dy = proj.to.y - proj.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5) {
                // Projectile arrivé
                this.addEffect({
                    type: 'impact',
                    position: proj.to,
                    damage: proj.damage
                });
                return false;
            }
            
            // Déplacer
            const moveDistance = proj.speed * deltaTime;
            proj.current.x += (dx / distance) * moveDistance;
            proj.current.y += (dy / distance) * moveDistance;
            
            return true;
        });
    }

    /**
     * Ajoute un effet visuel
     */
    addEffect(effect) {
        effect.id = Date.now();
        effect.startTime = Date.now();
        effect.duration = effect.duration || 1000;
        this.effects.push(effect);
    }

    /**
     * Met à jour les effets visuels
     */
    updateEffects(currentTime) {
        this.effects = this.effects.filter(effect => {
            return currentTime - effect.startTime < effect.duration;
        });
    }

    /**
     * Ajoute une entrée au log de combat
     */
    addLog(message, type = 'normal') {
        this.combatLog.push({
            message,
            type,
            timestamp: Date.now()
        });
        
        // Garder seulement les 50 derniers messages
        if (this.combatLog.length > 50) {
            this.combatLog.shift();
        }
    }

    /**
     * Obtient les unités dans un rayon
     */
    getUnitsInRadius(center, radius) {
        return this.combatants.filter(unit => {
            const dx = unit.position.x - center.x;
            const dy = unit.position.y - center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= radius && unit.hp > 0;
        });
    }

    /**
     * Vérifie l'avantage de type
     */
    hasTypeAdvantage(attackerType, defenderType) {
        const advantages = {
            'fire': ['nature', 'ice'],
            'water': ['fire', 'earth'],
            'nature': ['water', 'earth'],
            'earth': ['electric', 'fire'],
            'electric': ['water', 'air'],
            'air': ['earth', 'nature'],
            'ice': ['water', 'air'],
            'dark': ['light', 'psychic'],
            'light': ['dark', 'undead'],
            'psychic': ['physical', 'poison']
        };
        
        return advantages[attackerType]?.includes(defenderType) || false;
    }

    /**
     * Génère un item aléatoire
     */
    generateRandomItem(level) {
        const itemTypes = [
            { name: 'Épée', stat: 'attack', value: level * 5 },
            { name: 'Bouclier', stat: 'defense', value: level * 3 },
            { name: 'Bâton', stat: 'magic', value: level * 4 },
            { name: 'Bottes', stat: 'speed', value: level * 2 }
        ];
        
        const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        
        return {
            id: Date.now(),
            name: `${type.name} +${level}`,
            stat: type.stat,
            value: type.value,
            level: level
        };
    }

    /**
     * Drop du loot à une position
     */
    dropLoot(position, lootTable) {
        // À implémenter avec le système d'inventaire
        console.log('Loot dropped at', position, lootTable);
    }
}

// Export pour utilisation dans REALGAME
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedCombatSystem;
}