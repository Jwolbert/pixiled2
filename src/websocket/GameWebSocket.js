import effects from "../configs/effects";
import CreateRemoteEntity from "./CreateRemoteEntity";

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

            // player init
            if (message.init) {
                this.player.initPlayerPosition(message.init);
            }

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
                if (updateEntity.dead) {
                    // dead
                    this.entities[updateEntity.id]?.destroy();
                    delete this.entities[updateEntity.id];
                    return;
                } 
                if (!this.entities[updateEntity.id]) {
                    CreateRemoteEntity(scene, updateEntity);
                }
                // existing entity
                this.entities[updateEntity.id].updateWithJSON(updateEntity);
                updateEntity?.receivedInteractions?.forEach((i) => {
                    const newEffect = {
                        ...effects[i.effect],
                        source: i.source,
                        target: i.target,
                    };
                    this.entities[updateEntity.id].addEffect(newEffect);
                });
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