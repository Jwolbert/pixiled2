import Entity from "../entity/Entity";

export default class RemoteEntity extends Entity {

    type = "remoteEntity";
    positionBuffer = [];
    positionBufferSize = 1;
    positionBufferSumX;
    positionBufferSumY;

    constructor (name, gameObject) {
        super(name, gameObject);
        for (let i = 0; i < this.positionBufferSize; i++) {
            this.positionBuffer.push({x: gameObject.x, y: gameObject.y});
            this.positionBufferSumX = gameObject.x * this.positionBufferSize;
            this.positionBufferSumY = gameObject.y * this.positionBufferSize;
        }
    }

    updateWithJSON (JSON) {
        super.setAnimation(JSON.currentAnimation);
        super.updateWithJSON(JSON);
    }

    update () {
        this.gameObject.setX(this.positionBufferSumX / this.positionBufferSize);
        this.gameObject.setY(this.positionBufferSumY / this.positionBufferSize);
        const lastBufferEntry = this.positionBuffer.shift();
        this.positionBufferSumX -= lastBufferEntry.x;
        this.positionBufferSumY -= lastBufferEntry.y;
        this.positionBuffer.push({x: this.x, y: this.y});
        this.positionBufferSumX += this.x;
        this.positionBufferSumY += this.y;
        this.gameObject.setVelocityX(this.velocityX * this.speed);
        this.gameObject.setVelocityY(this.velocityY * this.speed);
    }

};