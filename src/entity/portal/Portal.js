import Entity from "../Entity";

export default class Portal extends Entity {

    type = "portal";
    interactions;
    portalCounter = 0;
    
    constructor (name, gameObject, player, scene, interactions) {
        super(name, gameObject, null, scene);
        this.interactions = interactions;
        scene.physics.add.collider(player.gameObject, this.gameObject, null, () => {
            console.log("portal collide1");
            if (this.portalCounter++ > 500) {
                this.interactions.push({
                    source: this.getId(),
                    target: player.getId(),
                    effect: this.attack.effect.id,
                });
            }
            return false;
        });
        this.setAnimation("portals");
    }

    update () {

    }

    addEffect (effect) {

    }
}