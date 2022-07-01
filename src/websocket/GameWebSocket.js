import Entity from "../entity/Entity";

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
                console.log(updateEntity);
                if (!this.entities[updateEntity.id]) {
                    const newEntitySprite = this.physics.add.sprite(48, 48, 'mainCharacters').setScale(.9).setDepth(3);
                    this.physics.add.collider(newEntitySprite, layer);
                    const newEntity = new Entity('hatman', newEntitySprite);
                    this.entities[updateEntity.id] = newEntity;
                } else if(updateEntity.dead) {
                    console.log("dead");
                    this.entities[updateEntity.id].destroy();
                    delete this.entities[updateEntity.id];
                }
                this.entities[updateEntity.id].updateWithJSON(updateEntity);
            });
        });
    }

    update() {
        if (!this.open) return;
        const message = {};
        message.entities = this.getEntities();
        this.counter = 0;
        // message.action = this.getAction;
        this.socket.send(JSON.stringify(message));
    }

    getAction() {
        return this.player.currentAction;
    }

    getEntities() {
        console.log(Object.keys(this.entities).length);
        const thinEntities = {};
        Object.values(this.entities).forEach((entity) => {
            thinEntities[entity.id] = entity.getJSON();
        });
        return thinEntities;
    }
}