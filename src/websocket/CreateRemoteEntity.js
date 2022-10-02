import Attack from "../entity/action/attack/Attack";
import RemoteEntity from "./RemoteEntity";
import attacks from "../configs/attacks";

export default function(scene, newRemoteEntityJson) {

    class RemotePlayer extends RemoteEntity {

        constructor(JSON, gameObject, id, scene) {
            super(JSON, gameObject, id, scene);
        }

        addEffect (effect) {
            super.addEffect(effect);
        }
    }

    let newEntity;
    if (newRemoteEntityJson.type === "player") {
        const newEntitySprite = scene.physics.add.sprite(48, 48, 'mainCharacters').setDepth(3);
        if (newRemoteEntityJson.name === "vampire") {
            newEntitySprite.setCircle(10, 6, 14);
        } else {
            newEntitySprite.setCircle(10, 2, 14);
        }
        scene.physics.add.collider(newEntitySprite, scene.mapLayer);
        scene.physics.add.collider(newEntitySprite, scene.character);
        scene.dynamicLayer.add(newEntitySprite);
        newEntity = new RemotePlayer(newRemoteEntityJson, newEntitySprite, newRemoteEntityJson.id, scene);
    } else if (newRemoteEntityJson.type === "attack") {
        const attack = {
            ...attacks[newRemoteEntityJson.name],
            ...newRemoteEntityJson.attack,
        };
        
        newEntity = new Attack(newRemoteEntityJson.name, scene.entities, scene.physics, attack, scene.interactions, scene.mapLayer, scene.add, scene.anims, scene.dynamicLayer);
        newEntity.id = newRemoteEntityJson.id;
        newEntity.gameObject.id = newRemoteEntityJson.id;
        console.log(newEntity);
    }
    console.log("JSON", newRemoteEntityJson);
    scene.entities[newRemoteEntityJson.id] = newEntity;
}