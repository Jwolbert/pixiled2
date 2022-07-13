import Entity from "../entity/Entity";

export default class RemoteEntity extends Entity {

    type = "remoteEntity";

    constructor (name, gameObject) {
        super(name, gameObject);
    }

    updateWithJSON (JSON) {
        super.setAnimation(JSON.currentAnimation);
        super.updateWithJSON(JSON);
    }

    update () {
        this.gameObject.setX(this.x);
        this.gameObject.setY(this.y);
        this.gameObject.setVelocityX(this.velocityX * this.speed);
        this.gameObject.setVelocityY(this.velocityY * this.speed);
        this.gameObject.setTint(this.currentTint);
    }

};