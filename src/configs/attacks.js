import effects from "./effects";

export default {
    default: {
        radius: 8,
        dimX: 32,
        dimY: 32,
        speed: 200,
        cooldown: 25,
        name: "default",
        animation: "default",
        particles: "default_default",
        explosion: "default_default",
        effected: "default_default",
        particlesSheet: "default",
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
        afterRadius: 32,
        afterDuration: 500,
        afterSelfTarget: true,
    },
    slash: {
        radius: 8,
        dimX: 32,
        dimY: 32,
        speed: 250,
        cooldown: 25,
        name: "slash",
        animation: "slash",
        particles: "slash_pool",
        explosion: "slash_pool",
        effected: "slash_drops",
        particlesSheet: "slash",
        type: "attack",
        delay: 1,
        duration: 5,
        collideHealth: 0,
        bounce: 1,
        effect: effects.poisoned,
        selfTarget: false,
        explodes: true,
        explodeRadius: 0,
        explodeDuration: 10,
        explodeSelfTarget: true,
        afterRadius: 0,
        afterDuration: 10000,
        afterSelfTarget: true,
    },
    fireball: {
        radius: 8,
        dimX: 32,
        dimY: 32,
        speed: 200,
        cooldown: 25,
        name: "slash",
        animation: "slash",
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
        afterRadius: 32,
        afterDuration: 500,
        afterSelfTarget: true,
    },
    bloodOrb: {
        radius: 8,
        dimX: 32,
        dimY: 32,
        speed: 125,
        cooldown: 25,
        name: "bloodOrb",
        animation: "bloodOrb",
        particles: "bloodOrbParticles_particles",
        explosion: "bloodOrbParticles_particles",
        type: "attack",
        delay: 1,
        duration: 1000,
        collideHealth: 0,
        bounce: 1,
        effect: effects.drained,
        selfTarget: false,
    },
    poisonOrb: {
        radius: 8,
        dimX: 32,
        dimY: 32,
        speed: 200,
        cooldown: 25,
        name: "poisonOrb",
        animation: "poisonOrb",
        particles: "poisonOrbParticles_particles",
        explosion: "poisonOrbParticles_particles",
        effected: "poisonOrbParticles_particles",
        particlesSheet: "poisonOrbParticles",
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
        afterRadius: 32,
        afterDuration: 500,
        afterSelfTarget: true,
    },
    iceOrb: {
        radius: 16,
        dimX: 32,
        dimY: 32,
        speed: 200,
        cooldown: 25,
        name: "iceOrb",
        animation: "iceOrb",
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
        explodeDuration: 25,
        explodeSelfTarget: true,
        afterRadius: 0,
        afterDuration: 200,
        afterSelfTarget: false,
    },
};