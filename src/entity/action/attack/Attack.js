import Entity from "../../Entity";

export default class Attack extends Entity {
    physics;
    entities;
    delay = 1;
    attack;
    duration = 5;
    interactions;
    type = "attack";
    attackArea = 20;

    constructor (name, gameObject, entities, physics, attack, interactions) {
        super(name, gameObject);
        this.entities = entities;
        this.physics = physics;
        this.interactions = interactions;
        this.attack = attack;
        this.gameObject.play('slash_slash');
        this.name = "slash";
        this.currentAnimation = "slash";
    }

    update () {
        if (this.delay) {
            this.delay -= 1;
            const within = this.physics.overlapRect(this.attack.location.x - this.attackArea/2, this.attack.location.y - this.attackArea/2, this.attackArea, this.attackArea);
            within.forEach((body) => {
                console.log(body.gameObject);
                if (body.gameObject.id) {
                    this.interactions.push({
                        source: this.attack.source,
                        target: body.gameObject.id,
                        effect: this.attack.effect.id,
                    });
                }
            });
        } else if (this.duration) {
            this.duration -=1;
        } else {
            this.dead = true;
        }
    }
};