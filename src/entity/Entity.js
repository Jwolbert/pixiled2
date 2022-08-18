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
    effectTimerMaximum = 100;
    speed = 75;
    direction;
    scene;

    constructor (name, gameObject, id, scene)
    {
        if (id) {
            this.id = id; 
        } else {
            this.id = uuidv4();
        }
        this.name = name;
        this.gameObject = gameObject;
        this.gameObject.id = this.id;
        console.log("GAMEOBJECT ID", this.gameObject.id);
        this.dead = false;
        this.x = gameObject.x;
        this.y = gameObject.y;
        this.scene = scene;
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
        this.gameObject.setVelocityX(this.velocityX * this.speed);
        this.gameObject.setVelocityY(this.velocityY * this.speed);
        this.tickEffect();
        if (this.hp < 1) {
            this.dead = true;
        }
    }
    
    tickEffect () {
        this.effectTimer += 1;
        if (this.effectTimer > 100) {
            Object.values(this.effects).forEach((effect, index) => {
                if(effect.duration < 1) {
                    effect.emitter.stop();
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

    addEffect (effect) {
        if (!this.effects[effect.name]) {
            effect.apply.call(this);
            this.addEmitter(effect);
            this.effects[effect.name] = effect;
        } 
        this.effects[effect.name].duration = effect.duration;
    }

    addEmitter (effect) {
        if (!effect.particleName) return;
        const particleAnimationName = effect.particleName;
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
                    this.anim = this.frame.texture.manager.game.anims.anims.entries[particleAnimationName];
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

        const particleManager = this.scene.add.particles(effect.particleSheet);
        particleManager.setDepth(3);
        // dynamicLayer.add(particleManager);
        effect.emitter = particleManager.createEmitter({...particles[effect.name](this.gameObject).effected, particleClass: AnimatedParticle});
    }
}