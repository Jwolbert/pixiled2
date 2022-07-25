import effects from "./effects";

export default {
    dagger: {
        name: "dagger",
        attackCooldown: 0,
        action: {
            radius: 16,
            dimX: 24,
            dimY: 32,
            speed: 0,
            name: "slash",
            animation: "slash",
            type: "attack",
            delay: 1,
            duration: 5,
            collideHealth: 1,
            bounce: 0,
            effect: effects["5be01cde-0016-11ed-b939-0242ac120002"],
            selfTarget: false,
        },
    },
    fireballScroll: {
        name: "fireballScroll",
        attackCooldown: 0,
        action: {
            radius: 16,
            dimX: 64,
            dimY: 32,
            speed: 200,
            name: "fireball",
            animation: "fireball",
            type: "attack",
            delay: 1,
            duration: 1000,
            collideHealth: 1,
            bounce: 0.5,
            effect: effects["2c8c6620-0707-11ed-b939-0242ac120002"],
            selfTarget: false,
        },
    }
}