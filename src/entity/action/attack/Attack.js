import Entity from "../../Entity";
import Phaser from "phaser";

export default function (name, entities, physics, attack, interactions, layer, add, anims, dynamicLayer) {

    const particles = add.particles(attack.particleSheet);
    particles.setDepth(3);

    class Attack extends Entity {
        physics;
        entities;
        attack;
        interactions;
        type = "attack";
        attackArea = 20;
        collideHealth = 1;
        flightEmitter;
        explodeEmitter;
    
        constructor (name, entities, physics, attack, interactions, layer, anims) {
            super(
                name,
                physics.add.sprite(attack.location.x, attack.location.y, "bloodT")
                    .setDepth(3)
                    // .setRotation(attack.direction * -1) 
                    .setBodySize(attack.radius, attack.radius, true)
                    .setScale(1/3)
            );
            this.anims = anims;
            this.layer = layer;
            this.entities = entities;
            this.physics = physics;
            this.interactions = interactions;
            this.attack = attack;
            this.attack.landed = false;
            console.log(this.gameObject);
            this.gameObject.play(`${attack.name}_${attack.animation}`);
            // this.gameObject.alpha = 0.7;
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
                this.gameObject.setCircle(attack.radius, 16, 16);
                this.flightEmitter = particles.createEmitter({
                    alpha: { start: 1, end: 0.5, ease: 'Expo.easeOut' },
                    quantity: 1,
                    frequency: 200,
                    angle: { min: 0, max: 360 },
                    // alpha: { min: 0, max: 1 },
                    speed: 20,
                    // gravityY: 100,
                    lifespan: { min: 1000, max: 1000 },
                    follow: this.gameObject,
                    particleClass: AnimatedParticle,
                    scale: { start: 1/3, end: 0.1},
                    // blendMode: 'SCREEN',
                    // scale: 0.25,
                });
                this.gameObject.setVelocityX(this.velocityX * attack.speed);
                this.gameObject.setVelocityY(this.velocityY * attack.speed);
                this.gameObject.setBounce(attack.bounce, attack.bounce);
                dynamicLayer.add(this.gameObject);
                this.physics.add.collider(this.gameObject, this.layer, (attack, layer) => {
                    console.log(this.entities[attack.id].collideHealth);
                    if (this.entities[attack.id].collideHealth-- <= 0) {
                        console.log(this.entities[attack.id].gameObject);
                        this.entities[attack.id].dead = true;
                        this.flightEmitter.stop();
                    }
                });
            }
        }

        getJSON () {
            const JSON = super.getJSON();
            JSON.attack = {
                location: attack.location,
                direction: attack.directions,
                name: attack.name,
            };
            return JSON;
        };

        destroy () {
            if (attack.explodes) {
                this.explode();
            }
            super.destroy();
        }

        explode () {
            this.explodeEmitter = particles.createEmitter({
                alpha: { start: 1, end: 0.2, ease: 'Expo.easeOut' },
                quantity: 20,
                frequency: 10,
                angle: { min: 0, max: 360 },
                // alpha: { min: 0, max: 1 },
                speed: { start: 100, end: 0},
                gravityY: 50,
                lifespan: { min: 800, max: 1000 },
                follow: this.gameObject,
                particleClass: AnimatedParticle,
                // blendMode: 'ADD',
                scale: { start: 1/3, end: 0.1},
                maxParticles: 40,
            });
            attack.radius = attack.explodeRadius;
            setTimeout(() => {
                this.flightEmitter.remove();
                this.explodeEmitter.remove();
            }, 10000);
        }
    
        update () {
            if (!this.attack.source) return; //remote attack wont have source
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
                                console.log("EFFECT", body.gameObject);
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

    const particleName = attack.particles;

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
                this.anim = this.frame.texture.manager.game.anims.anims.entries[particleName];
                // this.frame = this.anim.frames[0].frame;
                // console.log("FIRST_PARTICLE",this);
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