package com.avalon.services;

import com.avalon.services.engines.GrofiEngine.QuantumState;
import com.avalon.models.MagicCastRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * 🛡️ Causal Integrity Service - Gardien de la Causalité
 * Inspiré par le scénario AXISI vs LENTUS et la philosophie de WALTER.
 * Vérifie si les conditions pour un effondrement quantique sont valides.
 */
@Service
@Slf4j
public class CausalIntegrityService {

    // Simule l'état temporel des entités.
    private final Map<String, Double> temporalStates = new HashMap<>();
    // Simule les zones où la réalité est stable et force l'effondrement.
    private final Set<String> anchoredZones = new HashSet<>();

    public CausalIntegrityService() {
        // Initialiser les états temporels pour le test
        temporalStates.put("AXISI", 3.0);
        temporalStates.put("LENTUS", 1.6);
    }
    
    public boolean canCollapse(QuantumState state, String observerId) {
        log.info("🛡️ Vérification de l'intégrité causale pour l'effondrement de {}", state.psiId);

        MagicCastRequest originalRequest = state.originalRequest;
        String actionOwnerId = originalRequest.getCasterId();
        
        if ("TEMPORAL_THEFT".equals(originalRequest.getFormula())) {
            String targetOwnerId = originalRequest.getParameters().get("owner").toString();

            double thiefTime = temporalStates.getOrDefault(observerId, 1.0);
            double ownerTime = temporalStates.getOrDefault(targetOwnerId, 1.0);
            double objectAnchorTime = (double) originalRequest.getParameters().get("anchorTime");

            log.debug("Thief: {} @ t={}", observerId, thiefTime);
            log.debug("Owner: {} @ t={}", targetOwnerId, ownerTime);
            log.debug("Object anchored @ t={}", objectAnchorTime);

            if (ownerTime < objectAnchorTime) {
                log.warn("❌ BLOCAGE CAUSAL: Le propriétaire ({}) n'a pas encore atteint l'ancre temporelle ({}) de l'objet.", targetOwnerId, objectAnchorTime);
                return false;
            }
        }
        
        log.info("✅ Intégrité causale validée pour {}", state.psiId);
        return true;
    }

    /**
     * Vérifie si une coordonnée est dans une zone d'ancrage.
     */
    public boolean isAnchored(String coordinates) {
        boolean anchored = anchoredZones.contains(coordinates);
        if (anchored) {
            log.info("⚓ Zone {} est ancrée. La superposition sera immédiatement effondrée.", coordinates);
        }
        return anchored;
    }
    
    public void setTemporalState(String entityId, double time) {
        temporalStates.put(entityId, time);
        log.info("🕰️ Mise à jour de l'état temporel pour {}: t={}", entityId, time);
    }

    public void addAnchoredZone(String coordinates) {
        anchoredZones.add(coordinates);
        log.info("⚓ Zone d'ancrage ajoutée à {}", coordinates);
    }

    public void clearAll() {
        temporalStates.clear();
        anchoredZones.clear();
        log.info("🔄 CausalIntegrityService réinitialisé.");
    }
}