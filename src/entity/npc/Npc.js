import Entity from "../Entity";

export default class Npc extends Entity {
    constructor(name, gameObject) {
        super(name, gameObject);
        this.type = "npc";
        this.velocityX = -0.25;
    }

};