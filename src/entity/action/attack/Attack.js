import { ContextExclusionPlugin } from "webpack";
import Entity from "../../Entity";

export default class Attack extends Entity {
    physics;
    entities;
    attack;
    interactions;
    type = "attack";
    attackArea = 20;

    constructor (name, entities, physics, attack, interactions) {
        super(
            name,
            physics.add.sprite(attack.location.x, attack.location.y, "bloodT")
                .setDepth(3)
                .setRotation(attack.direction * -1)
                .setCircle(attack.radius, attack.radius, 0)
        );
        this.entities = entities;
        this.physics = physics;
        this.interactions = interactions;
        this.attack = attack;
        this.attack.landed = false;
        this.gameObject.play(`${attack.name}_${attack.animation}`);
        this.name = attack.name;
        this.currentAnimation = attack.animation;
        this.direction = attack.direction;
        if (this.attack.speed) {
            attack.direction *= -1;
            this.velocityX = Math.cos(attack.direction);
            this.velocityY = Math.sin(attack.direction);
            this.gameObject.setCircle(attack.radius, attack.radius + attack.radius * this.velocityX , attack.radius * this.velocityY);
            this.gameObject.setVelocityX(this.velocityX * attack.speed);
            this.gameObject.setVelocityY(this.velocityY * attack.speed);
        }
    }

    update () {
        if (this.attack.delay) {
            this.attack.delay -= 1;
        } else if (this.attack.duration) {
            this.attack.duration -=1;
            if (!this.attack.landed) {
                const within = this.physics.overlapCirc(this.gameObject.getCenter().x, this.gameObject.getCenter().y, this.attack.radius);
                within.forEach((body) => {
                    if (body.gameObject.id) {
                        if (this.entities[body.gameObject.id]?.type !== "attack" && (body.gameObject.id !== this.attack.source) || this.attack.selfTarget) {
                            this.interactions.push({
                                source: this.attack.source,
                                target: body.gameObject.id,
                                effect: this.attack.effect.id,
                            });
                            this.attack.landed = true;
                        }
                    }
                });
            }
        } else {
            this.dead = true;
        }
    }
};