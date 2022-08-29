class ServerEntity {

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

    constructor (name, id) {
        this.id = id; 
        this.name = name;
    }

    getId () {
        return this.id;
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
}

module.exports = ServerEntity;