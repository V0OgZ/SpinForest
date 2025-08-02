package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application principale - Backend Heroes of Time
 * Intègre Magic Formulas, Particle Simulation, et Combat
 */
@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        
        System.out.println("╔══════════════════════════════════════════════════════╗");
        System.out.println("║        🎖️ WALTER BACKEND OPERATIONAL 🎖️               ║");
        System.out.println("╠══════════════════════════════════════════════════════╣");
        System.out.println("║  Magic Formula API: ✓ READY                          ║");
        System.out.println("║  Particle Simulation: ✓ READY                        ║");
        System.out.println("║  Combat System: ✓ READY                              ║");
        System.out.println("║                                                      ║");
        System.out.println("║  Groeken says: 'Backend projette l'ordre!'          ║");
        System.out.println("╚══════════════════════════════════════════════════════╝");
    }
}