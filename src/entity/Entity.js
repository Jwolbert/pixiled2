import { v4 as uuidv4 } from 'uuid';
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
    effects = [];
    hp = 100;
    effectTimer = 0;
    effectTimerMaximum = 100;
    speed = 100;

    constructor (name, gameObject)
    {
        this.id = uuidv4();
        this.name = name;
        this.gameObject = gameObject;
        this.gameObject.id = this.id;
        this.dead = false;
        this.x = gameObject.x;
        this.y = gameObject.y;
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
        };
    }

    updateWithJSON (JSON) {
        this.id = JSON.id;
        this.name = JSON.name;
        this.x = JSON.x;
        this.y = JSON.y;
        this.velocityX = JSON.velocityX;
        this.velocityY = JSON.velocityY;
        this.dead = JSON.dead;
        this.hp = JSON.hp;
        this.owner = JSON.owner;
        this.currentAnimation = JSON.currentAnimation;
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

    clearEffects () {
        this.gameObject.setTint(0xffffff);
    }

    tickEffect () {
        this.effectTimer += 1;
        if (this.effectTimer > 100) {
            this.effects.forEach((effect, index) => {
                if(effect.duration < 1) {
                    effect.expire.call(this);
                    if (this.effects.length <= 1) {
                        this.effects.pop();
                        this.clearEffects();
                    } else {
                        this.effects.splice(index, 1);
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
        if (!effect.selfTarget && effect.source === this.id) {
            return;
        }
        effect.apply.call(this);
        this.effects.push(effect);
    }
}