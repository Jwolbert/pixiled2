import RemoteEntity from "./RemoteEntity";

export default class GameWebSocket {
    entities;
    player;
    data;
    socket;
    counter = 0;
    // sendEntitiesRate = 1; // lower = faster
    open = false;
    physics;
    layer;

    constructor(entities, player, physics, layer) {
        this.entities = entities;
        this.player = player;
        this.physics = physics;
        this.layer = layer;
        this.socket = new WebSocket("ws://" + window.location.hostname + ':3334');

        this.socket.addEventListener('open', (event) => {
            this.socket.send(JSON.stringify({'Hello Server!':':)'}));
            this.open = true;
        });

        this.socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            Object.values(message.entities).forEach((updateEntity) => {
                if (!this.entities[updateEntity.id] && !updateEntity.dead) {
                    // new entity
                    const newEntitySprite = this.physics.add.sprite(48, 48, 'mainCharacters').setScale(.9).setDepth(3);
                    this.physics.add.collider(newEntitySprite, layer);
                    const newEntity = new RemoteEntity(updateEntity.name, newEntitySprite);
                    newEntitySprite.id = updateEntity.id;
                    this.entities[updateEntity.id] = newEntity;
                    this.entities[updateEntity.id].updateWithJSON(updateEntity);
                }
                if(this.entities[updateEntity.id] && updateEntity.dead) {
                    // existing entity that is dead
                    console.log("dead");
                    console.log(this.entities);
                    this.entities[updateEntity.id].destroy();
                    delete this.entities[updateEntity.id];
                } else if (this.entities[updateEntity.id]) {
                    // existing entity
                    this.entities[updateEntity.id].updateWithJSON(updateEntity);
                }
            });
        });
    }

    update() {
        if (!this.open) return;
        const message = {};
        message.entities = this.getEntities();
        this.socket.send(JSON.stringify(message));
    }

    getAction() {
        // websocket could prolly be optimized by only sending 'controls'(getAction())
        // every frame and entity list(getEntities()) every so often
        return this.player.currentAction;
    }

    getEntities() {
        const thinEntities = {};
        Object.values(this.entities).forEach((entity) => {
            thinEntities[entity.id] = entity.getJSON();
        });
        return thinEntities;
    }
}