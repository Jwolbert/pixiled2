import Entity from "../../Entity";
import Phaser from "phaser";
import particles from "../../../configs/particles";

export default function (name, entities, physics, attack, interactions, layer, add, anims, dynamicLayer, id) {

    const particleManager = add.particles(attack.particleSheet);
    particleManager.setDepth(3);
    dynamicLayer.add(particleManager);

    const particleAnimationNameFlight = attack.particles;
    const particleAnimationNameExplode = attack.explosion;
    const particleAnimationNameFizzle = attack.particles;

    // console.log(particleAnimationNameFlight,particleAnimationNameExplode,particleAnimationNameFizzle);

    function directionAdjust(dir) {
        const map = {
            left: Math.PI,
            right: Math.PI / 2,
            up: Math.PI / 2,
            down: Math.PI / 2,
        };
        return map[dir] ?? 0;
    };

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
                physics.add.sprite(attack.location.x, attack.location.y, name)
                    .setDepth(attack.direction < Math.PI ? 3 : 4)
                    .setRotation(attack.direction * -1 + directionAdjust(attack.spriteSheetDirection)) 
            //         .setBodySize(attack.dimX, attack.dimY, true)
            );
            this.direction = attack.direction * -1;
            this.velocityX = Math.cos(this.direction);
            this.velocityY = Math.sin(this.direction);
            if (attack.dimX !== attack.dimY) {
                this.gameObject.setCircle(attack.radius, attack.dimX * (this.velocityX + Math.abs(this.velocityY)) / 4, attack.dimY * (this.velocityY + Math.abs(this.velocityX)) / 4);
            } else if (attack.melee) {
                this.gameObject.setCircle(attack.radius, attack.dimX / 4, attack.dimY / 2);
            } else {
                this.gameObject.setCircle(attack.radius, attack.dimX / 4, attack.dimY / 4);
            }
            this.anims = anims;
            this.layer = layer;
            this.entities = entities;
            this.physics = physics;
            this.interactions = interactions;
            this.attack = attack;
            this.attack.landed = false;
            this.gameObject.play(`${attack.name}_${attack.animation}`);
            this.gameObject.alpha = 0.9;
            this.name = attack.name;
            this.currentAnimation = attack.animation;
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
            if (!this.attack.source && this.attack.hidden) {
                this.gameObject.alpha = 0;
            }
        }

        createFlightEmitter () {
            if (this.attack.speed && particles[attack.name]) {
                this.flightEmitter = particleManager.createEmitter({...particles[attack.name](this.gameObject).flight, particleClass: AnimatedParticleFlight});
            }
        }

        getJSON () {
            const JSON = super.getJSON();
            JSON.attack = {
                location: attack.location,
                direction: attack.direction,
                name: attack.name,
                exploded: this.exploded,
                fizzled: this.fizzled,
                // source: attack.source,
            };
            return JSON;
        };

        updateWithJSON (JSON) {
            super.updateWithJSON(JSON);
            if (this.attack.source) return;
            if (JSON.attack.exploded !== this.exploded) {
                this.explode();
            } else if (JSON.attack.fizzled !== this.fizzled) {
                this.fizzle();
            }
        }

        explode () {
            if (this.exploded) {
                this.fizzle();
                // console.log("fizzle");
                return;
            }
            this.gameObject.alpha = 0.9;
            this.gameObject.play(`${attack.name}_${attack.explodeAnimation}`);
            this.entities[attack.source]?.debounce();
            this.exploded = true;
            this.attack.radius = attack.explodeRadius;
            this.attack.duration = attack.explodeDuration;
            this.attack.selfTarget = attack.explodeSelfTarget;
            if (particles[attack.name]) {
                this.explodeEmitter = particleManager.createEmitter({...particles[attack.name](this.gameObject).explosion, particleClass: AnimatedParticleExplosion});
                this.fizzleEmitter = particleManager.createEmitter({...particles[attack.name](this.gameObject).fizzle, particleClass: AnimatedParticleFizzle});
            }
            this.gameObject.body.stop();
            this.flightEmitter?.stop();
            return true;
        }

        fizzle () {
            if (this.fizzled) {
                this.explodeEmitter?.stop();
                this.fizzleEmitter?.stop();
                this.dead = true;
                return;
            }
            this.fizzled = true;
            this.attack.radius = attack.fizzleRadius;
            this.attack.duration = attack.fizzleDuration;
            this.attack.selfTarget = attack.fizzleSelfTarget;
        }

        destroy () {
            this.explodeEmitter?.stop();
            this.fizzleEmitter?.stop();
            super.destroy();
        }
    
        update () {
            // attack params are updated after exploding
            if (this.exploded && !attack.visibleAfterExplode) {
                this.gameObject.alpha -= 0.1;
            }
            if (!this.attack.source) {
                return;
            }
            if (this.attack.delay) {
                this.attack.delay -= 1;
            } else if (this.attack.duration) {
                this.attack.duration -=1;
                if (!this.attack.radius) return;
                const within = this.physics.overlapCirc(this.gameObject.getCenter().x, this.gameObject.getCenter().y, this.attack.radius);
                let attached = this.exploded;
                within.forEach((body) => {
                    if (body.gameObject?.id) {
                        if (this.attack.attached && body.gameObject.id === this.attack.source) {
                            attached = true;
                        }
                        if (this.entities[body.gameObject.id]?.type !== "attack" && (this.attack.selfTarget || (body.gameObject.id !== this.attack.source && (this.explode())))) {
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
        yo = false;
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
                this.frame = this.anim.frames[Math.floor(Math.random() * this.anim.frames.length)].frame;
            }
            var result = super.update(delta, step, processors);

            this.t += delta;

            // console.log(animationName);
            // console.log(this.frame.texture.manager.game.anims.anims);
            // console.log(this.frame.texture.manager.game.anims.anims.entries[animationName]);
            if (this.t >= this.anim.msPerFrame)
            {

                if (!this.yo && this.i >= this.anim.frames.length)
                {
                    if (this.anim.yoyo) {
                        this.yo = true;
                        this.i = this.anim.frames.length - 1;
                    } else {
                        this.i = 0;
                    }
                } else if(this.yo && this.i < 0) {
                    this.yo = false;
                    this.i = 0;
                }

                this.frame = this.anim.frames[this.i].frame;

                if (this.yo) {
                    this.i--;
                } else {
                    this.i++;
                }

                this.t -= this.anim.msPerFrame;
            }

            return result;
        }
    }

    class AnimatedParticleExplosion extends Phaser.GameObjects.Particles.Particle
    {
        anim;
        yo = false;
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

                if (!this.yo && this.i >= this.anim.frames.length)
                {
                    if (this.anim.yoyo) {
                        this.yo = true;
                        this.i = this.anim.frames.length - 1;
                    } else {
                        this.i = 0;
                    }
                } else if(this.yo && this.i < 0) {
                    this.yo = false;
                    this.i = 0;
                }

                this.frame = this.anim.frames[this.i].frame;

                if (this.yo) {
                    this.i--;
                } else {
                    this.i++;
                }

                this.t -= this.anim.msPerFrame;
            }

            return result;
        }
    }

    class AnimatedParticleFizzle extends Phaser.GameObjects.Particles.Particle
    {
        anim;
        yo = false;
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

                if (!this.yo && this.i >= this.anim.frames.length)
                {
                    if (this.anim.yoyo) {
                        this.yo = true;
                        this.i = this.anim.frames.length - 1;
                    } else {
                        this.i = 0;
                    }
                } else if(this.yo && this.i < 0) {
                    this.yo = false;
                    this.i = 0;
                }

                this.frame = this.anim.frames[this.i].frame;

                if (this.yo) {
                    this.i--;
                } else {
                    this.i++;
                }

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