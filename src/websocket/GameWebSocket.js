import RemoteEntity from "./RemoteEntity";
import effects from "../effects";

export default class GameWebSocket {
    entities;
    entitiesGroup;
    player;
    interactions;
    data;
    socket;
    counter = 0;
    forceUpdateRate = 2; // lower = faster
    open = false;
    physics;
    layer;
    owner;
    debugData;
    lastServerTick = 0;

    constructor(entities, player, physics, layer, interactions, entitiesGroup, debugData, dynamicLayer, scene) {
        this.entities = entities;
        this.entitiesGroup = entitiesGroup;
        this.owner = Object.keys(entities)[0];
        this.player = player;
        this.physics = physics;
        this.layer = layer;
        this.dynamicLayer = dynamicLayer;
        this.interactions = interactions;
        this.socket = new WebSocket("ws://" + window.location.hostname + ':' + window.webSocketPort);
        this.debugData = debugData;
        this.scene = scene;
        if (this.debugData) {
            this.debugData.websocketUpdates = 0;
            this.debugData.websocketMessagesSent = 0;
        }

        this.socket.addEventListener('open', () => {
            const message = {};
            message.owner = this.owner;
            this.socket.send(JSON.stringify(message));
            this.open = true;
        });

        this.socket.addEventListener('message', (event) => {
            // send client state
            this.update(true);

            // update client state
            const message = JSON.parse(event.data);
            if (debugData) {
                debugData.websocketUpdates++;
                if (message.requestsHandledPerSec) {
                    debugData.serverRequestsHandledPerSec = message.requestsHandledPerSec;
                }
                if (message.totalUpdates) {
                    debugData.lastServerUpdate = message.totalUpdates;
                }
                if (this.lastServerTick > message.totalUpdates) {
                    console.log("Message received out of order");
                }
                this.lastServerTick = message.totalUpdates;
            }
            Object.values(message.entities).forEach((updateEntity) => {
                if (!this.entities[updateEntity.id] && !updateEntity.dead) {
                    // new entity
                    // one sprite cant be in the two layers  :<<<<((((
                    const newEntitySprite = this.physics.add.sprite(48, 48, 'mainCharacters').setScale(.5).setDepth(3);
                    const newSceneSprite = this.physics.add.sprite(48, 48, 'mainCharacters').setScale(.5).setDepth(3);
                    this.physics.add.collider(newEntitySprite, layer);
                    this.dynamicLayer.add(newSceneSprite);
                    const newEntity = new RemoteEntity(updateEntity, newEntitySprite, newSceneSprite);
                    newEntitySprite.id = updateEntity.id;
                    this.entitiesGroup.add(newEntitySprite, true);
                    this.entities[updateEntity.id] = newEntity;
                    this.entities[updateEntity.id].updateWithJSON(updateEntity);
                }
                if(this.entities[updateEntity.id] && updateEntity.dead) {
                    // existing entity that is dead
                    this.entities[updateEntity.id].destroy();
                    delete this.entities[updateEntity.id];
                    return;
                } 
                // existing entity
                this.entities[updateEntity.id].updateWithJSON(updateEntity);
                if (updateEntity.receivedInteractions) {
                    if (updateEntity.receivedInteractions.length > 0) {
                        console.log(updateEntity.receivedInteractions);
                    }
                    updateEntity.receivedInteractions.forEach((i) => {
                        const newEffect = {
                            ...effects[i.effect],
                            source: i.source,
                            target: i.target,
                        };
                        this.entities[updateEntity.id].addEffect(newEffect);
                    });
                }
            });
        });
    }

    update(forceUpdate) {
        if (!this.open) return;
        // client will send state after receiving state from server but before reading the new state
        // forceUpdateRate will keep client message sending rate above a minimum amount
        if (this.counter++ > this.forceUpdateRate || forceUpdate) {
            const message = {};
            message.entities = this.getEntities();
            message.interactions = this.getInteractions();
            this.socket.send(JSON.stringify(message));
            this.clearInteractions();
            this.counter = 0;
            if (this.debugData) {
                this.debugData.websocketMessagesSent++;
            }
        }
    }

    getAction() {
        // websocket could prolly be optimized by only sending 'controls'(getAction())
        // every frame and entity list(getEntities()) every so often
        return this.player.currentAction;
    }

    getEntities() {
        const thinEntities = {};
        Object.values(this.entities)
        .filter((entity) => {
            return entity.owner === this.owner || !entity.owner;
        }).forEach((entity) => {
            thinEntities[entity.id] = entity.getJSON();
        });
        return thinEntities;
    }

    getInteractions() {
        return this.interactions;
    }

    clearInteractions() {
        this.interactions.length = 0;
    }
}