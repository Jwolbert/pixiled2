import Entity from "../entity/Entity";

export default class RemoteEntity extends Entity {

    type = "remoteEntity";
    positionBuffer = [];
    positionBufferSize = 2;
    positionBufferSumX;
    positionBufferSumY;
    sceneSprite;

    constructor (JSON, gameObject, sceneSprite) {
        super(JSON.name, gameObject);
        this.gameObject.setAlpha(0);
        this.type = JSON.type;
        this.sceneSprite = sceneSprite;
        this.gameObject.setX(JSON.x);
        this.gameObject.setY(JSON.y);
        this.sceneSprite.setX(JSON.x);
        this.sceneSprite.setY(JSON.y);
    }

    updateWithJSON (JSON) {
        if (this.currentAnimation !== JSON.currentAnimation) {
            this.sceneSprite.play(this.name + '_' + JSON.currentAnimation);
            this.currentAnimation = JSON.currentAnimation;
        }
        super.updateWithJSON(JSON);
        this.hp = JSON.hp;
        this.speed = JSON.speed;
        this.velocityX = JSON.velocityX;
        this.velocityY = JSON.velocityY;
    }

    update () {
        this.gameObject.setVelocityX(this.velocityX * this.speed);
        this.gameObject.setVelocityY(this.velocityY * this.speed);
        this.sceneSprite.setX(this.gameObject.x);
        this.sceneSprite.setY(this.gameObject.y);
        this.tickEffect();
    }

};