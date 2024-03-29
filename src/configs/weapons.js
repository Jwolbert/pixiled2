import effects from "./effects";
import attacks from "./attacks";

export default {
    dagger: {
        name: "dagger",
        type: "melee",
        attackCooldown: 0,
        action: attacks.slash,
        healthCost: 0,
        manaCost: 0,
        staminaCost: 20,
    },
    slowbow: {
        name: "slowbow",
        type: "ranged",
        reloadSound: "reload",
        attackCooldown: 20,
        action: attacks.arrow,
        healthCost: 0,
        manaCost: 0,
        staminaCost: 5,
        reloadable: true,
    },
    bow: {
        name: "bow",
        type: "ranged",
        reloadSound: "reload",
        attackCooldown: 3,
        action: attacks.arrow,
        healthCost: 0,
        manaCost: 0,
        staminaCost: 1,
        reloadable: true,
    },
    sabotageKitPoison: {
        name: "sabotageKitPoison",
        type: "deployable",
        attackCooldown: 10,
        action: attacks.poisonOrb,
        healthCost: 0,
        manaCost: 60,
        staminaCost: 10,
    },
    vampireBite: {
        name: "vampireBite",
        type: "melee",
        attackCooldown: 0,
        action: attacks.vampireBite,
        healthCost: 0,
        manaCost: 0,
        staminaCost: 100,
    },
    fireballScroll: {
        name: "fireballScroll",
        attackCooldown: 0,
        action: attacks.fireball,
        healthCost: 0,
        manaCost: 0,
        staminaCost: 20,
    }, 
    bloodOrbScroll: {
        name: "bloodOrbScroll",
        attackCooldown: 30,
        action: attacks.bloodOrb,
        healthCost: 20,
        manaCost: 0,
        staminaCost: 20,
    },
    poisonOrbScroll: {
        name: "poisonOrbScroll",
        attackCooldown: 0,
        action: attacks.poisonOrb,
        healthCost: 0,
        manaCost: 20,
        staminaCost: 0,
    },
    iceOrbScroll: {
        name: "iceOrbScroll",
        attackCooldown: 0,
        action: attacks.iceOrb,
        healthCost: 0,
        manaCost: 40,
        staminaCost: 0,
    },
}