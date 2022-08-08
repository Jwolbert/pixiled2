import Entity from "../../Entity";
import Phaser from "phaser";

export default function (name, entities, physics, attack, interactions, layer, add, anims, dynamicLayer) {

    const particles = add.particles(attack.particleSheet);
    particles.setDepth(3);
    dynamicLayer.add(particles);
    // console.log(particles);

    let explodedD = false;

    console.log(name, entities, physics, attack, interactions, layer, add, anims, dynamicLayer);

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
        afterEmitter;
        exploded = false;
    
        constructor (name, entities, physics, attack, interactions, layer, anims) {
            super(
                name,
                physics.add.sprite(attack.location.x, attack.location.y, "bloodT")
                    .setDepth(3)
                    // .setRotation(attack.direction * -1) 
                    .setBodySize(attack.radius, attack.radius, true)
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
            // this.gameObject.alpha = 0.8;
            this.name = attack.name;
            this.currentAnimation = attack.animation;
            this.direction = attack.direction * -1;
            this.velocityX = Math.cos(this.direction);
            this.velocityY = Math.sin(this.direction);
            //this.gameObject.setCircle(attack.radius);
            this.speed = this.attack.speed;
            this.collideHealth = attack.collideHealth;
            if (this.attack.speed) {
                this.gameObject.setCircle(attack.radius, 8, 8);
                this.flightEmitter = particles.createEmitter({
                    // alpha: { start: 1, end: 0.5, ease: 'Expo.easeOut' },
                    quantity: 1,
                    frequency: 200,
                    angle: { min: 0, max: 360 },
                    // alpha: { min: 0, max: 1 },
                    speed: 20,
                    // gravityY: 100,
                    lifespan: { min: 1500, max: 2000 },
                    follow: this.gameObject,
                    particleClass: AnimatedParticle,
                    // blendMode: 'SCREEN',
                    // scale: 0.25,
                });
                // console.log(this.flightEmitter);
                // dynamicLayer.add(this.flightEmitter);
                this.gameObject.setVelocityX(this.velocityX * attack.speed);
                this.gameObject.setVelocityY(this.velocityY * attack.speed);
                this.gameObject.setBounce(attack.bounce, attack.bounce);
                dynamicLayer.add(this.gameObject);
                // if (!this.attack.source) return;
                this.physics.add.collider(this.gameObject, this.layer, () => {
                    if (this.collideHealth-- <= 0) {
                        this.explode();
                    }
                });
            }
        }

        getJSON () {
            const JSON = super.getJSON();
            JSON.attack = {
                location: attack.location,
                direction: attack.direction,
                name: attack.name,
            };
            return JSON;
        };

        explode () {
            if (this.exploded) {
                this.flightEmitter.remove();
                this.explodeEmitter.remove();
                this.afterEmitter.remove();
                this.dead = true;
                return;
            }
            this.exploded = true;
            explodedD = true;
            this.attack.radius = attack.explodeRadius;
            this.attack.duration = attack.explodeDuration;
            this.attack.selfTarget = attack.explodeSelfTarget;
            this.explodeEmitter = particles.createEmitter({
                // alpha: { start: 1, end: 0.1, ease: 'Expo.easeOut' },
                quantity: 15,
                frequency: 1,
                angle: { min: 0, max: 360 },
                speed: { start: 200, end: 0},
                lifespan: { min: 1600, max: 2000 },
                gravityY: 0,
                follow: this.gameObject,
                particleClass: AnimatedParticle,
                // blendMode: 'ADD',
                emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 16) },
                deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(this.gameObject.x, this.gameObject.y, 48) },
                maxParticles: 15,
            });
            this.afterEmitter = particles.createEmitter({
                // alpha: { start: 1, end: 0.4, ease: 'Expo.easeOut' },
                quantity: 25,
                frequency: 0,
                angle: { min: 0, max: 360 },
                speed: { start: 30, end: 0},
                lifespan: { min: 2400, max: 3000 },
                follow: this.gameObject,
                particleClass: AnimatedParticle,
                // blendMode: 'ADD',
                emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 32) },
                deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(this.gameObject.x, this.gameObject.y, 48) },
                maxParticles: 25,
            });
            this.gameObject.body.stop();
            this.flightEmitter.stop();
        }
    
        update () {
            // attack params are updated after exploding
            if (this.exploded) {
                this.gameObject.alpha -= 0.1;
            }
            if (this.attack.delay) {
                this.attack.delay -= 1;
            } else if (this.attack.duration) {
                this.attack.duration -=1;
                if (!this.attack.source) return; //remote attack wont have source
                const within = this.physics.overlapCirc(this.gameObject.getCenter().x, this.gameObject.getCenter().y, this.attack.radius);
                within.forEach((body) => {
                    if (body.gameObject?.id) {
                        if (this.entities[body.gameObject.id]?.type !== "attack" && ((body.gameObject.id !== this.attack.source) || this.attack.selfTarget)) {
                            this.interactions.push({
                                source: this.attack.source,
                                target: body.gameObject.id,
                                effect: this.attack.effect.id,
                            });
                        }
                    }
                });
            } else {
                this.explode();
            }

        }

    }

    const particleName = attack.particles;
    let frameCounter = 0;

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
                if (!explodedD) {
                    this.frame = this.anim.frames[0].frame;
                } else if (frameCounter < 15) {
                    this.frame = this.anim.frames[(frameCounter++ + 1) % 3].frame;
                } else {
                    this.frame = this.anim.frames[0].frame;
                }
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

                // this.frame = this.anim.frames[this.i].frame;

                this.i++;

                this.t -= this.anim.msPerFrame;
            }

            return result;
        }
    }

    return new Attack(name, entities, physics, attack, interactions, layer, particles, anims);
};