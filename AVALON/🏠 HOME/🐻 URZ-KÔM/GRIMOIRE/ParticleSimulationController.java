package com.herosoftime.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 🐻 URZ-KÔM's Quantum Particle Simulation Controller
 * Simulates quarks, atoms, and quantum mechanics using the temporal engine
 * Based on the Standard Model of particle physics
 */
@RestController
@RequestMapping("/api/particle-simulation")
@CrossOrigin(origins = "*")
public class ParticleSimulationController {

    // Particle types based on Standard Model
    enum ParticleType {
        // Quarks
        UP_QUARK("u", 2.3e-3, 2.0/3.0, 0.5, "#FF0000"),
        DOWN_QUARK("d", 4.8e-3, -1.0/3.0, 0.5, "#0000FF"),
        CHARM_QUARK("c", 1.275, 2.0/3.0, 0.5, "#FF00FF"),
        STRANGE_QUARK("s", 95e-3, -1.0/3.0, 0.5, "#00FF00"),
        TOP_QUARK("t", 173.07, 2.0/3.0, 0.5, "#FFD700"),
        BOTTOM_QUARK("b", 4.18, -1.0/3.0, 0.5, "#8B4513"),
        
        // Leptons
        ELECTRON("e-", 0.511e-3, -1.0, 0.5, "#00FFFF"),
        POSITRON("e+", 0.511e-3, 1.0, 0.5, "#FF00FF"),
        MUON("μ-", 105.7e-3, -1.0, 0.5, "#9370DB"),
        TAU("τ-", 1.777, -1.0, 0.5, "#FF1493"),
        
        // Bosons
        PHOTON("γ", 0, 0, 1.0, "#FFFF00"),
        GLUON("g", 0, 0, 1.0, "#FFA500"),
        W_BOSON("W", 80.385, 1.0, 1.0, "#4169E1"),
        Z_BOSON("Z", 91.188, 0, 1.0, "#32CD32"),
        HIGGS("H", 125.09, 0, 0, "#FFD700"),
        
        // Composite particles
        PROTON("p", 938.3e-3, 1.0, 0.5, "#FF6347"),
        NEUTRON("n", 939.6e-3, 0, 0.5, "#708090"),
        HYDROGEN("H", 938.3e-3, 0, 0, "#87CEEB"),
        HELIUM("He", 3728.4e-3, 0, 0, "#DDA0DD");

        final String symbol;
        final double mass; // GeV/c²
        final double charge; // in units of e
        final double spin;
        final String color;

        ParticleType(String symbol, double mass, double charge, double spin, String color) {
            this.symbol = symbol;
            this.mass = mass;
            this.charge = charge;
            this.spin = spin;
            this.color = color;
        }
    }

    // Quantum particle with psi-state superposition
    static class QuantumParticle {
        String id;
        ParticleType type;
        double x, y, z; // Position
        double vx, vy, vz; // Velocity
        ComplexAmplitude psiState; // Quantum state ψ = a + bi
        double energy;
        double momentum;
        List<String> entangledWith = new ArrayList<>();
        long createdAt;
        boolean collapsed = false;

        QuantumParticle(ParticleType type, double x, double y, double z) {
            this.id = UUID.randomUUID().toString();
            this.type = type;
            this.x = x;
            this.y = y;
            this.z = z;
            this.vx = (Math.random() - 0.5) * 0.1;
            this.vy = (Math.random() - 0.5) * 0.1;
            this.vz = (Math.random() - 0.5) * 0.1;
            this.psiState = new ComplexAmplitude(Math.random(), Math.random());
            this.energy = calculateEnergy();
            this.momentum = calculateMomentum();
            this.createdAt = System.currentTimeMillis();
        }

        double calculateEnergy() {
            double v2 = vx*vx + vy*vy + vz*vz;
            return type.mass * Math.sqrt(1 + v2); // Relativistic energy
        }

        double calculateMomentum() {
            return Math.sqrt(vx*vx + vy*vy + vz*vz) * type.mass;
        }

        Map<String, Object> toJson() {
            Map<String, Object> json = new HashMap<>();
            json.put("id", id);
            json.put("type", type.name());
            json.put("symbol", type.symbol);
            json.put("position", Map.of("x", x, "y", y, "z", z));
            json.put("velocity", Map.of("vx", vx, "vy", vy, "vz", vz));
            json.put("mass", type.mass);
            json.put("charge", type.charge);
            json.put("spin", type.spin);
            json.put("color", type.color);
            json.put("psiState", psiState.toJson());
            json.put("probability", psiState.getProbability());
            json.put("energy", energy);
            json.put("momentum", momentum);
            json.put("entangledWith", entangledWith);
            json.put("collapsed", collapsed);
            json.put("age", System.currentTimeMillis() - createdAt);
            return json;
        }
    }

    // Complex amplitude for quantum states
    static class ComplexAmplitude {
        double real;
        double imaginary;

        ComplexAmplitude(double real, double imaginary) {
            this.real = real;
            this.imaginary = imaginary;
        }

        double getProbability() {
            return real * real + imaginary * imaginary;
        }

        double getMagnitude() {
            return Math.sqrt(getProbability());
        }

        double getPhase() {
            return Math.atan2(imaginary, real);
        }

        ComplexAmplitude add(ComplexAmplitude other) {
            return new ComplexAmplitude(
                this.real + other.real,
                this.imaginary + other.imaginary
            );
        }

        Map<String, Object> toJson() {
            return Map.of(
                "real", real,
                "imaginary", imaginary,
                "magnitude", getMagnitude(),
                "phase", getPhase()
            );
        }
    }

    // Simulation state
    private final Map<String, QuantumParticle> particles = new ConcurrentHashMap<>();
    private boolean simulationRunning = false;
    private Thread simulationThread;

    @GetMapping("/status")
    public ResponseEntity<?> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("simulationRunning", simulationRunning);
        status.put("particleCount", particles.size());
        status.put("timestamp", System.currentTimeMillis());
        status.put("particleTypes", Arrays.stream(ParticleType.values())
            .map(type -> Map.of(
                "name", type.name(),
                "symbol", type.symbol,
                "mass", type.mass,
                "charge", type.charge,
                "spin", type.spin,
                "color", type.color
            ))
            .collect(Collectors.toList()));
        return ResponseEntity.ok(status);
    }

    @PostMapping("/start")
    public ResponseEntity<?> startSimulation() {
        if (simulationRunning) {
            return ResponseEntity.badRequest().body(Map.of("error", "Simulation already running"));
        }

        simulationRunning = true;
        
        // Initialize with some particles
        initializeParticles();
        
        // Start simulation thread
        simulationThread = new Thread(this::runSimulation);
        simulationThread.start();

        return ResponseEntity.ok(Map.of(
            "message", "🐻 Quantum particle simulation started",
            "particleCount", particles.size()
        ));
    }

    @PostMapping("/stop")
    public ResponseEntity<?> stopSimulation() {
        simulationRunning = false;
        if (simulationThread != null) {
            try {
                simulationThread.join(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        return ResponseEntity.ok(Map.of("message", "Simulation stopped"));
    }

    @GetMapping("/particles")
    public ResponseEntity<?> getParticles() {
        List<Map<String, Object>> particleList = particles.values().stream()
            .map(QuantumParticle::toJson)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of(
            "particles", particleList,
            "count", particleList.size(),
            "timestamp", System.currentTimeMillis()
        ));
    }

    @PostMapping("/create-particle")
    public ResponseEntity<?> createParticle(@RequestBody Map<String, Object> request) {
        String typeStr = (String) request.get("type");
        Double x = (Double) request.getOrDefault("x", Math.random() * 10 - 5);
        Double y = (Double) request.getOrDefault("y", Math.random() * 10 - 5);
        Double z = (Double) request.getOrDefault("z", Math.random() * 10 - 5);

        try {
            ParticleType type = ParticleType.valueOf(typeStr);
            QuantumParticle particle = new QuantumParticle(type, x, y, z);
            particles.put(particle.id, particle);
            
            return ResponseEntity.ok(Map.of(
                "message", "Particle created",
                "particle", particle.toJson()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid particle type: " + typeStr
            ));
        }
    }

    @PostMapping("/quantum-entangle/{id1}/{id2}")
    public ResponseEntity<?> entangleParticles(@PathVariable String id1, @PathVariable String id2) {
        QuantumParticle p1 = particles.get(id1);
        QuantumParticle p2 = particles.get(id2);
        
        if (p1 == null || p2 == null) {
            return ResponseEntity.notFound().build();
        }

        // Create quantum entanglement
        p1.entangledWith.add(id2);
        p2.entangledWith.add(id1);
        
        // Entangled particles share correlated psi states
        ComplexAmplitude entangledState = p1.psiState.add(p2.psiState);
        double norm = entangledState.getMagnitude();
        if (norm > 0) {
            entangledState.real /= norm;
            entangledState.imaginary /= norm;
        }
        
        return ResponseEntity.ok(Map.of(
            "message", "Particles entangled",
            "entangledState", entangledState.toJson()
        ));
    }

    @PostMapping("/collapse/{id}")
    public ResponseEntity<?> collapseWaveFunction(@PathVariable String id) {
        QuantumParticle particle = particles.get(id);
        if (particle == null) {
            return ResponseEntity.notFound().build();
        }

        particle.collapsed = true;
        
        // Collapse entangled particles
        for (String entangledId : particle.entangledWith) {
            QuantumParticle entangled = particles.get(entangledId);
            if (entangled != null) {
                entangled.collapsed = true;
            }
        }

        return ResponseEntity.ok(Map.of(
            "message", "Wave function collapsed",
            "particle", particle.toJson()
        ));
    }

    private void initializeParticles() {
        // Create a hydrogen atom (proton + electron)
        QuantumParticle proton = new QuantumParticle(ParticleType.PROTON, 0, 0, 0);
        QuantumParticle electron = new QuantumParticle(ParticleType.ELECTRON, 1, 0, 0);
        particles.put(proton.id, proton);
        particles.put(electron.id, electron);
        
        // Create some quarks
        for (int i = 0; i < 6; i++) {
            ParticleType[] quarkTypes = {
                ParticleType.UP_QUARK, ParticleType.DOWN_QUARK,
                ParticleType.CHARM_QUARK, ParticleType.STRANGE_QUARK
            };
            ParticleType type = quarkTypes[i % quarkTypes.length];
            QuantumParticle quark = new QuantumParticle(
                type,
                Math.random() * 10 - 5,
                Math.random() * 10 - 5,
                Math.random() * 10 - 5
            );
            particles.put(quark.id, quark);
        }
        
        // Create some photons
        for (int i = 0; i < 3; i++) {
            QuantumParticle photon = new QuantumParticle(
                ParticleType.PHOTON,
                Math.random() * 10 - 5,
                Math.random() * 10 - 5,
                Math.random() * 10 - 5
            );
            particles.put(photon.id, photon);
        }
    }

    private void runSimulation() {
        while (simulationRunning) {
            try {
                updateParticles();
                checkInteractions();
                Thread.sleep(50); // 20 FPS
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }

    private void updateParticles() {
        double dt = 0.05; // Time step
        
        for (QuantumParticle particle : particles.values()) {
            // Update position
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
            particle.z += particle.vz * dt;
            
            // Boundary conditions (box of size 20x20x20)
            if (Math.abs(particle.x) > 10) particle.vx *= -0.9;
            if (Math.abs(particle.y) > 10) particle.vy *= -0.9;
            if (Math.abs(particle.z) > 10) particle.vz *= -0.9;
            
            // Quantum evolution of psi state
            if (!particle.collapsed) {
                double phase = particle.getPhase() + dt * particle.energy;
                double magnitude = particle.psiState.getMagnitude();
                particle.psiState.real = magnitude * Math.cos(phase);
                particle.psiState.imaginary = magnitude * Math.sin(phase);
            }
            
            // Update energy and momentum
            particle.energy = particle.calculateEnergy();
            particle.momentum = particle.calculateMomentum();
        }
    }

    private void checkInteractions() {
        List<QuantumParticle> particleList = new ArrayList<>(particles.values());
        
        for (int i = 0; i < particleList.size(); i++) {
            for (int j = i + 1; j < particleList.size(); j++) {
                QuantumParticle p1 = particleList.get(i);
                QuantumParticle p2 = particleList.get(j);
                
                double dx = p1.x - p2.x;
                double dy = p1.y - p2.y;
                double dz = p1.z - p2.z;
                double distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                // Electromagnetic interaction for charged particles
                if (distance < 2.0 && p1.type.charge != 0 && p2.type.charge != 0) {
                    double force = 0.1 * p1.type.charge * p2.type.charge / (distance * distance);
                    double fx = force * dx / distance;
                    double fy = force * dy / distance;
                    double fz = force * dz / distance;
                    
                    // Apply force
                    p1.vx += fx * 0.05 / p1.type.mass;
                    p1.vy += fy * 0.05 / p1.type.mass;
                    p1.vz += fz * 0.05 / p1.type.mass;
                    
                    p2.vx -= fx * 0.05 / p2.type.mass;
                    p2.vy -= fy * 0.05 / p2.type.mass;
                    p2.vz -= fz * 0.05 / p2.type.mass;
                }
                
                // Strong force for quarks (very short range)
                if (distance < 0.5 && 
                    (p1.type.name().contains("QUARK") && p2.type.name().contains("QUARK"))) {
                    // Confining force increases with distance
                    double strongForce = 10.0 * distance;
                    double fx = -strongForce * dx / distance;
                    double fy = -strongForce * dy / distance;
                    double fz = -strongForce * dz / distance;
                    
                    p1.vx += fx * 0.05 / p1.type.mass;
                    p1.vy += fy * 0.05 / p1.type.mass;
                    p1.vz += fz * 0.05 / p1.type.mass;
                    
                    p2.vx -= fx * 0.05 / p2.type.mass;
                    p2.vy -= fy * 0.05 / p2.type.mass;
                    p2.vz -= fz * 0.05 / p2.type.mass;
                }
            }
        }
    }
}