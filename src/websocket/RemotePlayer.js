import RemoteEntity from "./RemoteEntity";

export class RemotePlayer extends RemoteEntity {

    constructor(JSON, gameObject, sceneSprite) {
        super(JSON, gameObject, sceneSprite);
        this.positionBufferInit();
    }
d
    update () {
        this.updatePositionWithBuffer();
        super.update();
    }

    positionBufferInit () {
        for (let i = 0; i < this.positionBufferSize; i++) {
            this.positionBuffer.push({x: gameObject.x, y: gameObject.y});
            this.positionBufferSumX = gameObject.x * this.positionBufferSize;
            this.positionBufferSumY = gameObject.y * this.positionBufferSize;
        }
    }

    updatePositionWithBuffer () {
        console.log(this.gameObject);
        this.gameObject.setX(Math.round(this.positionBufferSumX / this.positionBufferSize));
        this.gameObject.setY(Math.round(this.positionBufferSumY / this.positionBufferSize));
        this.sceneSprite.setX(Math.round(this.positionBufferSumX / this.positionBufferSize));
        this.sceneSprite.setY(Math.round(this.positionBufferSumY / this.positionBufferSize));
        const lastBufferEntry = this.positionBuffer.shift();
        this.positionBufferSumX -= lastBufferEntry.x;
        this.positionBufferSumY -= lastBufferEntry.y;
        this.positionBuffer.push({x: this.x, y: this.y});
        this.positionBufferSumX += this.x;
        this.positionBufferSumY += this.y;
    }

}