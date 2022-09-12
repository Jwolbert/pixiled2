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
    vampireBite: {
        name: "vampireBite",
        type: "melee",
        attackCooldown: 0,
        action: attacks.vampireBite,
        healthCost: 0,
        manaCost: 0,
        staminaCost: 20,
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
        attackCooldown: 0,
        action: attacks.bloodOrb,
        healthCost: 3,
        manaCost: 0,
        staminaCost: 0,
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