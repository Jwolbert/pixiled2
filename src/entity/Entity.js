import { v4 as uuidv4 } from 'uuid';
export default class Entity {
    id;
    name;
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
    }

    getJSON () {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            x: this.x,
            y: this.y,
            velocityX: this.velocityX,
            velocityY: this.velocityY,
            dead: this.dead,
            currentAction: this.currentAction,
            hp: this.hp,
        };
    }

    updateWithJSON (JSON) {
        this.id = JSON.id;
        this.name = JSON.name;
        this.type = JSON.type;
        this.x = JSON.x;
        this.y = JSON.y;
        this.velocityX = JSON.velocityX;
        this.velocityY = JSON.velocityY;
        this.dead = JSON.dead;
        this.currentAction = JSON.currentAction;
        this.hp = JSON.hp;
    }

    update ()
    {
        this.effectTimer += 1;
        if (this.effectTimer > 100) {
            this.effects.forEach((effect, index) => {
                if(effect.duration < 1) {
                    this.effects[index]
                    effect.expire.call(this);
                    if (this.effects.length <= 1) {
                        this.effects.pop();
                        this.clearEffects();
                    } else {
                        this.effects[index] = this.effects.pop();
                    }
                } else {
                    effect.tick.call(this);
                    console.log(this.hp);
                    effect.duration -= 1;
                }
            });
            this.effectTimer = 0;
        }
        if (this.hp < 1) {
            this.dead = true;
        }
        this.gameObject.setVelocityX(this.velocityX * this.speed);
        this.gameObject.setVelocityY(this.velocityY * this.speed);
        if (this.velocityX > 0) {
            this.setAnimation('right');
        } else if (this.velocityX < 0) {
            this.setAnimation('left');
        } else if (this.velocityY > 0) {
            this.setAnimation('down');
        } else if (this.velocityY < 0) {
            this.setAnimation('up');
        } else {
            this.setAnimation('wait');
        }
    }

    clearEffects () {
        this.gameObject.setTint(0xffffff);
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