import effects from "./effects";
import attacks from "./attacks";

export default {
    dagger: {
        name: "dagger",
        attackCooldown: 0,
        action: attacks.slash,
    },
    fireballScroll: {
        name: "fireballScroll",
        attackCooldown: 0,
        action: attacks.fireball
    }, 
    bloodOrbScroll: {
        name: "bloodOrbScroll",
        attackCooldown: 0,
        action: attacks.bloodOrb
    },
    poisonOrbScroll: {
        name: "poisonOrbScroll",
        attackCooldown: 0,
        action: attacks.poisonOrb,
    },
    iceOrbScroll: {
        name: "iceOrbScroll",
        attackCooldown: 0,
        action: attacks.iceOrb,
    },
}