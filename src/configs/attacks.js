import effects from "./effects";

export default {
    default: {
        radius: 16,
        dimX: 32,
        dimY: 32,
        speed: 200,
        cooldown: 25,
        name: "default",
        animation: "default",
        explodeAnimation: "vampireBite",
        particles: "default_default",
        explosion: "default_default",
        effected: "default_default",
        particlesSheet: "default",
        type: "attack",
        delay: 1,
        duration: 1000,
        collideHealth: 0,
        bounce: 1,
        attacking: effects.slashing,
        effect: effects.poisoned,
        selfTarget: false,
        explodes: true,
        explodeRadius: 40,
        explodeDuration: 10,
        explodeSelfTarget: true,
        fizzleRadius: 32,
        fizzleDuration: 500,
        fizzleSelfTarget: true,
    },
    arrow: {
        radius: 5,
        dimX: 20,
        dimY: 10,
        speed: 300,
        cooldown: 25,
        name: "arrow",
        animation: "arrow",
        sound: "bow",
        explodeAnimation: "arrow",
        missSound: "arrowImpact",
        hitSound: "arrowHit",
        spriteSheetDirection: "left",
        visibleAfterExplode: true,
        attached: false,
        particles: "arrow",
        explosion: "arrow",
        effected: "arrow",
        particlesSheet: "slash",
        type: "attack",
        delay: 1,
        duration: 1000,
        collideHealth: 0,
        bounce: 1,
        attacking: undefined,
        effect: effects.shot,
        selfTarget: false,
        explodes: true,
        explodeRadius: 0,
        explodeDuration: 0,
        explodeSelfTarget: false,
        fizzleRadius: 0,
        fizzleDuration: 10,
        fizzleSelfTarget: false,
    },
    vampireBite: {
        radius: 10,
        dimX: 32,
        dimY: 32,
        speed: 200,
        cooldown: 25,
        name: "vampireBite",
        sound: "vampireCharge",
        animation: "vampireCharge",
        explodeAnimation: "vampireBite",
        missSound: "vampireMiss",
        hitSound: "vampireBite",
        melee: true,
        spriteSheetDirection: "up",
        visibleAfterExplode: true,
        attached: true,
        particles: "slash_pool",
        explosion: "slash_pool",
        effected: "slash_drops",
        particlesSheet: "slash",
        type: "attack",
        delay: 1,
        duration: 1000,
        collideHealth: 0,
        bounce: 1,
        attacking: effects.slashing,
        effect: effects.bitten,
        selfTarget: false,
        explodes: true,
        explodeRadius: 0,
        explodeDuration: 0,
        explodeSelfTarget: false,
        fizzleRadius: 0,
        fizzleDuration: 41,
        fizzleSelfTarget: false,
    },
    slash: {
        radius: 8,
        dimX: 32,
        dimY: 32,
        speed: 300,
        cooldown: 25,
        name: "slash",
        animation: "slash",
        explodeAnimation: "slash",
        particles: "slash_pool",
        explosion: "slash_pool",
        effected: "slash_drops",
        particlesSheet: "slash",
        type: "attack",
        delay: 5,
        duration: 500,
        collideHealth: 10,
        bounce: 1,
        attacking: effects.slashing,
        effect: effects.poisoned,
        selfTarget: false,
        explodes: true,
        explodeRadius: 0,
        explodeDuration: 10,
        explodeSelfTarget: true,
        fizzleRadius: 0,
        fizzleDuration: 10000,
        fizzleSelfTarget: true,
    },
    fireball: {
        radius: 8,
        dimX: 32,
        dimY: 32,
        speed: 200,
        cooldown: 25,
        name: "slash",
        animation: "slash",
        explodeAnimation: "slash",
        particles: "slash_slash",
        explosion: "slash_pool",
        effected: "slash_drops",
        particlesSheet: "slash",
        type: "attack",
        delay: 1,
        duration: 1000,
        collideHealth: 0,
        bounce: 1,
        effect: effects.poisoned,
        selfTarget: false,
        explodes: true,
        explodeRadius: 40,
        explodeDuration: 10,
        explodeSelfTarget: true,
        fizzleRadius: 32,
        fizzleDuration: 500,
        fizzleSelfTarget: true,
    },
    bloodOrb: {
        radius: 8,
        dimX: 32,
        dimY: 32,
        speed: 150,
        cooldown: 25,
        name: "bloodOrb",
        animation: "bloodOrb",
        sound: "bloodOrb",
        missSound: "bloodOrbImpact",
        hitSound: "bloodOrbImpact",
        explodeAnimation: "bloodOrb",
        particles: "bloodOrbParticles_particles",
        explosion: "bloodOrbParticles_particles",
        type: "attack",
        delay: 1,
        duration: 1000,
        collideHealth: 10,
        bounce: 1,
        effect: effects.drained,
        selfTarget: false,
    },
    poisonOrb: {
        radius: 8,
        dimX: 32,
        dimY: 32,
        speed: 0,
        cooldown: 25,
        name: "poisonOrb",
        animation: "poisonOrb",
        sound: "reload",
        missSound: "poisonOrb",
        hitSound: "poisonOrb",
        explodeAnimation: "poisonOrb",
        particles: "poisonOrbParticles_particles",
        explosion: "poisonOrbParticles_particles",
        effected: "poisonOrbParticles_particles",
        particlesSheet: "poisonOrbParticles",
        hidden: true,
        type: "attack",
        delay: 100,
        duration: 2000,
        collideHealth: 0,
        bounce: 1,
        effect: effects.poisoned,
        selfTarget: false,
        explodes: true,
        explodeRadius: 40,
        explodeDuration: 10,
        explodeSelfTarget: true,
        fizzleRadius: 40,
        fizzleDuration: 500,
        fizzleSelfTarget: true,
    },
    iceOrb: {
        radius: 13,
        dimX: 32,
        dimY: 32,
        speed: 50,
        cooldown: 25,
        name: "iceOrb",
        animation: "iceOrb",
        explodeAnimation: "iceOrb",
        particles: "iceOrbParticles_particles",
        explosion: "iceOrbParticles_shatter",
        effected: "iceOrbParticles_particles",
        particlesSheet: "iceOrbParticles",
        type: "attack",
        delay: 10,
        duration: 500,
        collideHealth: 0,
        bounce: 1,
        effect: effects.chilled,
        selfTarget: false,
        explodes: true,
        explodeRadius: 32,
        explodeDuration: 1,
        explodeSelfTarget: true,
        fizzleRadius: 0,
        fizzleDuration: 200,
        fizzleSelfTarget: false,
    },
};