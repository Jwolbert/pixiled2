import Attack from "../entity/action/attack/Attack";
import RemoteEntity from "./RemoteEntity";
import attacks from "../configs/attacks";

export default function(scene, newRemoteEntityJson) {

    class RemotePlayer extends RemoteEntity {

        positionBuffer = [];
        positionBufferSize = 2;
        positionBufferSumX;
        positionBufferSumY;

        constructor(JSON, gameObject, id) {
            super(JSON, gameObject, id);
            this.positionBufferInit();
        }

        update () {
            this.updatePositionWithBuffer();
            super.update();
        }
    
        positionBufferInit () {
            for (let i = 0; i < this.positionBufferSize; i++) {
                this.positionBuffer.push({x: this.gameObject.x, y: this.gameObject.y});
                this.positionBufferSumX = this.gameObject.x * this.positionBufferSize;
                this.positionBufferSumY = this.gameObject.y * this.positionBufferSize;
            }
        }
    
        updatePositionWithBuffer () {
            this.gameObject.setX(Math.round(this.positionBufferSumX / this.positionBufferSize));
            this.gameObject.setY(Math.round(this.positionBufferSumY / this.positionBufferSize));
            const lastBufferEntry = this.positionBuffer.shift();
            this.positionBufferSumX -= lastBufferEntry.x;
            this.positionBufferSumY -= lastBufferEntry.y;
            this.positionBuffer.push({x: this.x, y: this.y});
            this.positionBufferSumX += this.x;
            this.positionBufferSumY += this.y;
        }
    }

    let newEntity;
    if (newRemoteEntityJson.type === "player") {
        const newEntitySprite = scene.physics.add.sprite(48, 48, 'mainCharacters').setDepth(3);
        newEntitySprite.setCircle(10, 6, 14);
        scene.physics.add.collider(newEntitySprite, scene.mapLayer);
        scene.physics.add.collider(newEntitySprite, scene.character);
        scene.dynamicLayer.add(newEntitySprite);
        newEntity = new RemotePlayer(newRemoteEntityJson, newEntitySprite, newRemoteEntityJson.id);
    } else if (newRemoteEntityJson.type === "attack") {
        const attack = {
            ...attacks[newRemoteEntityJson.name],
            ...newRemoteEntityJson.attack
        };
        
        newEntity = new Attack(newRemoteEntityJson.name, scene.entities, scene.physics, attack, scene.interactions, scene.mapLayer, scene.add, scene.anims, scene.dynamicLayer);
    }
    console.log("JSON", newRemoteEntityJson);
    scene.entities[newRemoteEntityJson.id] = newEntity;
}