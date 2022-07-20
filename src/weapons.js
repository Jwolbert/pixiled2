import effects from "./effects";

export default {
    dagger: {
        name: "dagger",
        attackCooldown: 0,
        action: {
            name: "slash",
            type: "attack",
            effect: effects["5be01cde-0016-11ed-b939-0242ac120002"],
        },
    },
    fireballScroll: {
        name: "fireballScroll",
        attackCooldown: 0,
        effect: effects["2c8c6620-0707-11ed-b939-0242ac120002"],
    }
}