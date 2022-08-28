import Entity from "../Entity";

export default class Portal extends Entity {
    
    constructor (name, gameObject, id, scene) {
        super(name, gameObject, id, scene);
        this.setAnimation("portals");
    }
}