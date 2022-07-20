import Entity from "../entity/Entity";

export default class RemoteEntity extends Entity {

    type = "remoteEntity";
    positionBuffer = [];
    positionBufferSize = 2;
    positionBufferSumX;
    positionBufferSumY;

    constructor (JSON, gameObject) {
        super(JSON.name, gameObject);
        this.type = JSON.type;
        console.log(JSON);
        this.gameObject.setX(JSON.x);
        this.gameObject.setY(JSON.y);
        if (this.type === "player") {
            for (let i = 0; i < this.positionBufferSize; i++) {
                this.positionBuffer.push({x: gameObject.x, y: gameObject.y});
                this.positionBufferSumX = gameObject.x * this.positionBufferSize;
                this.positionBufferSumY = gameObject.y * this.positionBufferSize;
            }
        } else if (this.type === "attack") {
            console.log(this.direction);
            this.gameObject.setDepth(3).setRotation(JSON.direction * -1);
        }
    }

    updateWithJSON (JSON) {
        super.setAnimation(JSON.currentAnimation);
        super.updateWithJSON(JSON);
        this.hp = JSON.hp;
    }

    update () {
        if (this.type === "player") {
            this.gameObject.setX(Math.round(this.positionBufferSumX / this.positionBufferSize));
            this.gameObject.setY(Math.round(this.positionBufferSumY / this.positionBufferSize));
            const lastBufferEntry = this.positionBuffer.shift();
            this.positionBufferSumX -= lastBufferEntry.x;
            this.positionBufferSumY -= lastBufferEntry.y;
            this.positionBuffer.push({x: this.x, y: this.y});
            this.positionBufferSumX += this.x;
            this.positionBufferSumY += this.y;
        }
        this.gameObject.setVelocityX(this.velocityX * this.speed);
        this.gameObject.setVelocityY(this.velocityY * this.speed);
        this.tickEffect();
    }

};