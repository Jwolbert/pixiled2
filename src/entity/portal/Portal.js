import Entity from "../Entity";

export default class Portal extends Entity {
    
    constructor (name, gameObject, player, scene) {
        super(name, gameObject, null, scene);
        scene.physics.add.collider(player.gameObject, this.gameObject, null, () => {
            console.log("portal collide1");
            return false;
        });
        this.setAnimation("portals");
    }
}