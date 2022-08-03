import Entity from "../entity/Entity";

export default class RemoteEntity extends Entity {

    type = "remoteEntity";

    constructor (JSON, gameObject, id) {
        super(JSON.name, gameObject, id);
        this.type = JSON.type;
        this.gameObject.setX(JSON.x);
        this.gameObject.setY(JSON.y);
    }

    updateWithJSON (JSON) {
        if (this.currentAnimation !== JSON.currentAnimation) {
            this.gameObject.play(this.name + '_' + JSON.currentAnimation);
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
        this.tickEffect();
    }

};