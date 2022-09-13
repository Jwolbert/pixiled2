import Entity from "../../Entity";
import Phaser from "phaser";
import particles from "../../../configs/particles";
import PlayerAttackControls from "../../../controls/PlayerAttackControls";

export default function (name, entities, physics, attack, interactions, layer, add, anims, dynamicLayer, id) {

    const particleManager = add.particles(attack.particleSheet);
    particleManager.setDepth(3);
    dynamicLayer.add(particleManager);

    const particleAnimationNameFlight = attack.particles;
    const particleAnimationNameExplode = attack.explosion;
    const particleAnimationNameFizzle = attack.particles;

    console.log(particleAnimationNameFlight,particleAnimationNameExplode,particleAnimationNameFizzle);

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
        fizzleEmitter;
        exploded = false;
        fizzled = false;
    
        constructor (name, entities, physics, attack, interactions, layer, anims) {
            super(
                name,
                physics.add.sprite(attack.location.x, attack.location.y, "bloodT")
                    .setDepth(attack.direction < Math.PI ? 3 : 4)
                    .setRotation(attack.direction * -1 + Math.PI / 2) 
                    .setBodySize(attack.radius, attack.radius, true)
            );
            console.log(attack.direction);
            this.anims = anims;
            this.layer = layer;
            this.entities = entities;
            this.physics = physics;
            this.interactions = interactions;
            this.attack = attack;
            this.attack.landed = false;
            console.log(this.gameObject);
            this.gameObject.play(`${attack.name}_${attack.animation}`);
            this.gameObject.alpha = 0.8;
            this.name = attack.name;
            this.currentAnimation = attack.animation;
            this.direction = attack.direction * -1;
            this.velocityX = Math.cos(this.direction);
            this.velocityY = Math.sin(this.direction);
            //this.gameObject.setCircle(attack.radius);
            this.speed = this.attack.speed;
            this.collideHealth = attack.collideHealth;
            // console.log(this.flightEmitter);
            // dynamicLayer.add(this.flightEmitter);
            if (this.attack.speed) {
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
                // this.gameObject.setCircle(attack.radius, attack.radius, attack.radius);
                this.createFlightEmitter();
            }
        }

        createFlightEmitter () {
            if (this.attack.speed) {
                this.flightEmitter = particleManager.createEmitter({...particles[attack.name](this.gameObject).flight, particleClass: AnimatedParticleFlight});
            }
        }

        getJSON () {
            const JSON = super.getJSON();
            JSON.attack = {
                location: attack.location,
                direction: attack.direction,
                name: attack.name,
                source: attack.source,
            };
            return JSON;
        };

        explode () {
            if (this.exploded) {
                this.fizzle();
                console.log("fizzle");
                return;
            }
            this.gameObject.play(`${attack.name}_${attack.explodeAnimation}`);
            this.entities[attack.source]?.debounce();
            this.exploded = true;
            this.attack.radius = attack.explodeRadius;
            this.attack.duration = attack.explodeDuration;
            this.attack.selfTarget = attack.explodeSelfTarget;
            this.explodeEmitter = particleManager.createEmitter({...particles[attack.name](this.gameObject).explosion, particleClass: AnimatedParticleExplosion});
            this.fizzleEmitter = particleManager.createEmitter({...particles[attack.name](this.gameObject).fizzle, particleClass: AnimatedParticleFizzle});
            this.gameObject.body.stop();
            this.flightEmitter.stop();
        }

        fizzle () {
            if (this.fizzled) {
                this.flightEmitter.remove();
                this.explodeEmitter.remove();
                this.fizzleEmitter.remove();
                this.dead = true;
                return;
            }
            this.fizzled = true;
            this.attack.radius = attack.fizzleRadius;
            this.attack.duration = attack.fizzleDuration;
            this.attack.selfTarget = attack.fizzleSelfTarget;
        }
    
        update () {
            // attack params are updated after exploding
            if (this.exploded && !attack.visibleAfterExplode) {
                this.gameObject.alpha -= 0.1;
            }
            if (this.attack.delay) {
                this.attack.delay -= 1;
            } else if (this.attack.duration) {
                this.attack.duration -=1;
                // if (!this.attack.source || !this.attack.radius) return; //remote attack wont have source
                const within = this.physics.overlapCirc(this.gameObject.getCenter().x, this.gameObject.getCenter().y, this.attack.radius);
                let attached = this.exploded;
                within.forEach((body) => {
                    if (body.gameObject?.id) {
                        if (this.attack.attached && body.gameObject.id === this.attack.source) {
                            attached = true;
                        }
                        console.log(body.gameObject.id, this.attack.source);
                        if (this.entities[body.gameObject.id]?.type !== "attack" && (this.attack.selfTarget || (body.gameObject.id !== this.attack.source && (this.explode())))) {
                            if (!this.attack.source || !this.attack.radius) return; //remote attack wont have source
                            this.interactions.push({
                                source: this.attack.source,
                                target: body.gameObject.id,
                                effect: this.attack.effect.id,
                            });
                        }
                    }
                });
                if (this.attack.attached && !attached) {
                    console.log("attttaacccchhh");
                    this.explode();
                }
            } else {
                this.explode();
            }

        }

    }

    class AnimatedParticleFlight extends Phaser.GameObjects.Particles.Particle
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
                this.anim = this.frame.texture.manager.game.anims.anims.entries[particleAnimationNameFlight];
                console.log(this.anim, this.frame.texture.manager.game.anims.anims.entries);
                this.frame = this.anim.frames[Math.floor(Math.random() * this.anim.frames.length)].frame;
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

    class AnimatedParticleExplosion extends Phaser.GameObjects.Particles.Particle
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
                this.anim = this.frame.texture.manager.game.anims.anims.entries[particleAnimationNameExplode];
                this.frame = this.anim.frames[Math.floor(Math.random() * this.anim.frames.length)].frame;
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

    class AnimatedParticleFizzle extends Phaser.GameObjects.Particles.Particle
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
                this.anim = this.frame.texture.manager.game.anims.anims.entries[particleAnimationNameFizzle];
                this.frame = this.anim.frames[Math.floor(Math.random() * this.anim.frames.length)].frame;
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

// if (!this.anim) {
//     this.anim = this.frame.texture.manager.game.anims.anims.entries[particleName];
//     if (!explodedD) {
//         const frameIndexes = particles[attack.name](this.gameObject).flightParticle;
//         const index = frameIndexes[frameCounter++ % frameIndexes.length];
//         this.frame = this.anim.frames[particles[attack.name](this.gameObject).flightParticle].frame;
//     } else if (frameCounter < 5000) {
//         const frameIndexes = particles[attack.name](this.gameObject).explosionParticle;
//         const index = frameIndexes[frameCounter++ % frameIndexes.length];
//         this.frame = this.anim.frames[index].frame;
//     } else {
//         const frameIndexes = particles[attack.name](this.gameObject).afterParticle;
//         const index = frameIndexes[frameCounter++ % frameIndexes.length];
//         this.frame = this.anim.frames[particles[attack.name](this.gameObject).afterParticle].frame;
//     }
//     // console.log("FIRST_PARTICLE",this);
// }