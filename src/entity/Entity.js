import { v4 as uuidv4 } from 'uuid';
import particles from "../configs/particles";

export default class Entity {
    id;
    name;
    owner;
    scale;
    type = "entity";
    x;
    y;
    gameObject;
    velocityX = 0;
    velocityY = 0;
    currentAnimation;
    dead;
    currentAction = {
        name: "idle"
    };
    effects = {};
    hp = 100;
    mana = 100;
    stamina = 100;
    effectTimer = 0;
    effectTimerMaximum = 25;
    defaultSpeed = 75;
    speed = 75;
    direction;
    scene;
    blockMovement = false;
    interactions;

    constructor (name, gameObject, id, scene, interactions)
    {
        if (id) {
            this.id = id; 
        } else {
            this.id = uuidv4();
        }
        this.name = name;
        this.gameObject = gameObject;
        this.gameObject.id = this.id;
        this.dead = false;
        this.x = gameObject.x;
        this.y = gameObject.y;
        this.scene = scene;
        this.interactions = interactions;
    }

    getJSON () {
        return {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            velocityX: this.velocityX,
            velocityY: this.velocityY,
            dead: this.dead,
            hp: this.hp,
            owner: this.owner,
            currentAnimation: this.currentAnimation,
            type: this.type,
            // direction: this.direction,
            speed: this.speed,
        };
    }

    updateWithJSON (JSON) {
        this.id = JSON.id;
        this.name = JSON.name;
        this.x = JSON.x;
        this.y = JSON.y;
        // this.dead = JSON.dead; entiities die in websocket
        this.owner = JSON.owner;
        this.currentAnimation = JSON.currentAnimation;
        // this.direction = JSON.direction;
    }

    update ()
    {
        this.x = this.gameObject.x;
        this.y = this.gameObject.y;
        if (!this.blockMovement) {
            this.gameObject.setVelocityX(this.velocityX);
            this.gameObject.setVelocityY(this.velocityY);
        }
        this.tickEffect();
        if (this.hp < 1) {
            this.dead = true;
        }
    }
    
    tickEffect () {
        this.effectTimer += 1;
        if (this.effectTimer > this.effectTimerMaximum) {
            Object.values(this.effects).forEach((effect, index) => {
                if(effect.duration < 1) {
                    effect?.emitter?.stop();
                    effect.expire.call(this);
                    if (this.effects.length <= 1) {
                        this.effects = {};
                    } else {
                        delete this.effects[effect.name];
                    }
                } else {
                    effect.tick.call(this);
                    effect.duration -= 1;
                }
            });
            this.effectTimer = 0;
        }
    }

    setAnimation (animation) {
        if (this.currentAnimation !== animation) {
            this.gameObject.play(this.name + '_' + animation);
            this.currentAnimation = animation;
            if (this.blockMovement) {
                this.gameObject.stop();
            }
        }
    }

    destroy () {
        this.gameObject.destroy();
    }

    getId () {
        return this.id;
    }

    getCurrentAction () {
        const action = this.currentAction;
        this.currentAction = {
            name: "idle"
        };
        return action;
    }

    addEffect (effect, addon) {
        if (!effect.source && !addon) return;
        if (!this.effects[effect.name]) {
            effect.apply.call(this, addon);
            this.addEmitter(effect);
            this.effects[effect.name] = effect;
        } else if (effect.reApply) {
            effect.expire.call(this);
            effect.apply.call(this, addon);
        }
        this.effects[effect.name].duration = effect.duration;
    }

    removeEffect (effectName) {
        if (this.effects[effectName]) {
            const effect = this.effects[effectName];
            effect.expire.call(this);
            effect?.emitter?.stop();
            this.interactions.push({
                source: undefined,
                target: this.id,
                effect: effect.id,
            });
            delete this.effects[effectName];
        }
    }

    addEmitter (effect) {
        if (!effect.particleName) return;
        const particleAnimationName = effect.particleName;
        class AnimatedParticle extends Phaser.GameObjects.Particles.Particle
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
                    this.anim = this.frame.texture.manager.game.anims.anims.entries[particleAnimationName];
                    this.frame = this.anim.frames[Math.floor(Math.random() * this.anim.frames.length)].frame;
                    console.log("anim", this.anim);
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

        const particleManager = this.scene.add.particles(effect.particleSheet);
        particleManager.setDepth(3);
        this.scene.dynamicLayer.add(particleManager);
        effect.emitter = particleManager.createEmitter({...particles[effect.name](this.gameObject).effected, particleClass: AnimatedParticle});
    }
}