import Entity from "../../Entity";

export default class Attack extends Entity {
    delay = 1;
    duration = 5;
    type = "attack";
    constructor (name, gameObject) {
        super(name, gameObject);
        this.gameObject.play('slash_slash');
    }

    update () {
        if (this.delay) {
            this.delay -= 1;
        } else if (this.duration) {
            this.duration -=1;
        } else {
            this.dead = true;
        }
    }

    addEffect () {
        console.log('effected');
    }
};