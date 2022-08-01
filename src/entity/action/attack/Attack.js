import Entity from "../../Entity";
import Phaser from "phaser";

export default function (name, entities, physics, attack, interactions, layer, particles, anims) {

    class Attack extends Entity {
        physics;
        entities;
        attack;
        interactions;
        type = "attack";
        attackArea = 20;
        collideHealth = 1;
        particles;
    
        constructor (name, entities, physics, attack, interactions, layer, particles, anims) {
            super(
                name,
                physics.add.sprite(attack.location.x, attack.location.y, "bloodT")
                    .setDepth(3)
                    // .setRotation(attack.direction * -1) 
                    .setBodySize(attack.radius, attack.radius, true)
            );
            this.particles = particles;
            this.anims = anims;
            this.layer = layer;
            this.entities = entities;
            this.physics = physics;
            this.interactions = interactions;
            this.attack = attack;
            this.attack.landed = false;
            console.log(this.gameObject);
            this.gameObject.play(`${attack.name}_${attack.animation}`);
            this.gameObject.alpha = 0.7;
            this.name = attack.name;
            this.currentAnimation = attack.animation;
            this.direction = attack.direction;
            attack.direction *= -1;
            this.velocityX = Math.cos(attack.direction);
            this.velocityY = Math.sin(attack.direction);
            //this.gameObject.setCircle(attack.radius);
            this.speed = this.attack.speed;
            this.collideHealth = attack.collideHealth;
            if (this.attack.speed) {
                this.gameObject.setCircle(attack.radius, 8, 8);
                let emitter = this.particles.createEmitter({
                    alpha: { start: 1, end: 0.0, ease: 'Expo.easeOut' },
                    quantity: 1,
                    frequency: 200,
                    // angle: { min: 0, max: 30 },
                    // alpha: { min: 0, max: 1 },
                    // speed: 200,
                    // gravityY: 100,
                    lifespan: { min: 3500, max: 3500 },
                    follow: this.gameObject,
                    particleClass: AnimatedParticle,
                });
                this.gameObject.setVelocityX(this.velocityX * attack.speed);
                this.gameObject.setVelocityY(this.velocityY * attack.speed);
                this.gameObject.setBounce(attack.bounce, attack.bounce);
                this.physics.add.collider(this.gameObject, this.layer, (attack, layer) => {
                    console.log(this.entities[attack.id].collideHealth);
                    if (this.entities[attack.id].collideHealth-- <= 0) {
                        console.log(this.entities[attack.id].gameObject);
                        this.entities[attack.id].dead = true;
                    }
                });
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

    }

    const animationName = attack.particles;

    class AnimatedParticle extends Phaser.GameObjects.Particles.Particle
    {
        anim;
        constructor (emitter)
        {
            super(emitter);

            this.t = 0;
            this.i = 0;
        }

        update (delta, step, processors)
        {
            if (!this.anim) {
                this.anim = this.frame.texture.manager.game.anims.anims.entries[animationName];
                // this.frame = this.anim.frames[0].frame;
                console.log(this);
            }
            var result = super.update(delta, step, processors);

            this.t += delta;

            // console.log(animationName);
            // console.log(this.frame.texture.manager.game.anims.anims);
            // console.log(this.frame.texture.manager.game.anims.anims.entries[animationName]);
            if (this.t >= this.anim.msPerFrame)
            {

                if (this.i >= this.anim.frames.length)
                {
                    this.i = 0;
                }

                this.frame = this.anim.frames[this.i].frame;

                this.i++;

                this.t -= this.anim.msPerFrame;
            }

            return result;
        }
    }

    return new Attack(name, entities, physics, attack, interactions, layer, particles, anims);
};