import Entity from "../entity/Entity";

export default class RemoteEntity extends Entity {

    type = "remoteEntity";
    positionBuffer = [];
    positionBufferSize = 2;
    positionBufferSumX;
    positionBufferSumY;

    constructor (JSON, gameObject, id) {
        super(JSON.name, gameObject, id);
        this.type = JSON.type;
        this.gameObject.setX(JSON.x);
        this.gameObject.setY(JSON.y);
        this.positionBufferInit();
    }

    updateWithJSON (JSON) {
        if (this.currentAnimation !== JSON.currentAnimation) {
            this.gameObject.play(this.name + '_' + JSON.currentAnimation);
            this.currentAnimation = JSON.currentAnimation;
        }
        super.updateWithJSON(JSON);
        this.hp = JSON.hp;
        this.speed = JSON.speed;
        this.updatePositionWithBuffer(JSON);
    }

    update () {
        // this.gameObject.setVelocityX(this.velocityX);
        // this.gameObject.setVelocityY(this.velocityY);
        this.tickEffect();
    }

    positionBufferInit () {
        for (let i = 0; i < this.positionBufferSize; i++) {
            this.positionBuffer.push({x: this.gameObject.x, y: this.gameObject.y});
            this.positionBufferSumX = this.gameObject.x * this.positionBufferSize;
            this.positionBufferSumY = this.gameObject.y * this.positionBufferSize;
        }
    }

    updatePositionWithBuffer (JSON) {
        // this.gameObject.setX(Math.round(this.positionBufferSumX / this.positionBufferSize));
        // this.gameObject.setY(Math.round(this.positionBufferSumY / this.positionBufferSize));
        const lastBufferEntry = this.positionBuffer.shift();
        this.positionBufferSumX -= lastBufferEntry.x;
        this.positionBufferSumY -= lastBufferEntry.y;
        this.positionBuffer.push({x: JSON.x, y: JSON.y});
        this.positionBufferSumX += JSON.x;
        this.positionBufferSumY += JSON.y;
        const difX = (this.positionBufferSumX / this.positionBufferSize) - this.gameObject.x;
        const difY = (this.positionBufferSumY / this.positionBufferSize) - this.gameObject.y;
        const difXSign = Math.sign(difX);
        const difYSign = Math.sign(difY);
        this.velocityX = Math.log10(Math.abs(difX) + 1) * difXSign * this.speed * 1.5;
        this.velocityY = Math.log10(Math.abs(difY) + 1) * difYSign * this.speed * 1.5;
        this.gameObject.setVelocityX(this.velocityX);
        this.gameObject.setVelocityY(this.velocityY);
    }

    debounce () {

    }
};