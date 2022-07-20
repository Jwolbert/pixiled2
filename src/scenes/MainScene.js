import Phaser from "phaser";
import Player from "../entity/player/Player";
import AnimationUtility from "../utility/AnimationUtility";
import Attack from "../entity/action/attack/Attack";
import GameWebSocket from "../websocket/GameWebSocket";
import { profile, setDebugData, setEntities } from "../debug/debug";
import FogOfWar from "../fogOfWar/FogOfWar";

export class Example extends Phaser.Scene
{
    entities = {};
    entitiesGroup;
    data = {};
    interactions = [];
    player;
    websocket;
    obstacles;
    raycaster;
    ray;
    graphics;
    intersections = [];
    debug = true; // DEBUGGGGGGG
    fogOfWar;
    map;
    debugData;

    constructor (websocket)
    {
        super();
        this.websocket = websocket;
        if (this.debug) {
            this.debugData = {};
        }
    }

    preload ()
    {
        //this.load.spritesheet('hatman', 'assets/sheets/mainCharacters.png', { frameWidth: 24, frameHeight: 32 });
        this.load.image('ruins', 'assets/sheets/jawbreaker_tiles-extruded.png');
        this.load.spritesheet('mainCharacters', 'assets/sheets/mainCharacters.png', { frameWidth: 24, frameHeight: 32 });
        this.load.spritesheet('bloodT', 'assets/sheets/bloodT.png', { frameWidth: 24, frameHeight: 32 });
        this.load.spritesheet('fireballSprite', 'assets/sheets/fireballSprite.png', { frameWidth: 64, frameHeight: 32 });
        this.load.tilemapTiledJSON('map', 'assets/json/Ruins2.json');
    }

    create ()
    {
        console.log("STARTING_SCENE");
        AnimationUtility.call(this, ['hatman', 'slash', 'fireball']);
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('jawbreaker_tiles', 'ruins', 32, 32, 1, 2);
        const layer = map.createLayer(0, tiles, 0, 0);
        map.setCollision([ 2, 18, 26, 34, 35, 41, 42, 36, 37, 28, 20, 21, 22, 30, 29, 46 ]);
        console.log(map);
        this.map = map;
        
        console.log(this);

        layer.width = 200;
        this.character = this.physics.add.sprite(48, 48, 'mainCharacters').setScale(.9).setDepth(3);
        this.entitiesGroup = this.physics.add.group();
        this.physics.add.collider(this.character, layer);
        this.cameras.main.setZoom(1.5);
        this.cameras.main.startFollow(this.character);
        this.player = new Player('hatman', this.character, this.input);
        this.entities[this.player.getId()] = this.player;
        this.entitiesGroup.add(this.character);
        console.log(this.entitiesGroup);
        setDebugData(this.debugData);
        setEntities(this.entities);
        this.websocket = new GameWebSocket(this.entities, this.player, this.physics, layer, this.interactions, this.entitiesGroup, this.debugData);
        this.createUi();
        this.fogOfWar = new FogOfWar(this.raycasterPlugin, this, this.entities, this.entitiesGroup, this.graphics, this.map, this.physics, this.player);
    }


    update ()
    {
        Object.values(this.entities).forEach((entity) => {
            entity.update();
        });
        this.performActions();
        this.websocket.update();
        this.fogOfWar.drawRay();
        if (this.debug) {
            profile();
        }
    }

    performActions () {
        Object.values(this.entities).forEach((entity) => {
            this.actionHandler(entity.getCurrentAction());
        });
    }

    actionHandler (action) {
        if(action && action.type === "attack") {
            this.attackHandler(action);
        }
    }

    attackCount = 0;

    attackHandler (attack) {
        this.attackCount += 1;
        const attackArea = 20;
        console.log(this.attackCount);
        console.log(attack.location.x, attack.location.y);
        const sprite = this.physics.add.sprite(attack.location.x, attack.location.y, "bloodT").setDepth(3).setRotation(attack.direction).setBodySize(attackArea,attackArea,true);
        const entity = new Attack('slash', sprite, this.entities, this.physics, attack, this.interactions);
        this.entities[entity.getId()] = entity;
        console.log("attack handled");
        console.log("length", Object.keys(this.entities).length);
    }

    createUi () {
        const gameWindow = document.querySelector("canvas");
        const background = document.querySelector("body");
        gameWindow.id = "gameWindow";
        background.id = "background";
        background.style.backgroundColor = "black";
        //background.style.display = "flex";
        //background.style.padding = "5%";
        //background.style.flexDirection = "row";
        //background.style.justifyContent = "center";
        if (this.debug) {
            const debugBox = document.createElement("div");
            debugBox.style.backgroundColor = "grey";
            debugBox.style.padding = "0.5rem";

            const debugTitle = document.createElement("div");
            debugTitle.textContent = "-------------------- DEBUG PANEL --------------------";
            debugBox.appendChild(debugTitle);
            debugBox.appendChild(document.createElement("br"));

            const clientId = document.createElement("div");
            clientId.id = "clientId";
            clientId.textContent = `Client ID: ${this.player.id.split("-")[0]}`;
            debugBox.appendChild(clientId);
            debugBox.appendChild(document.createElement("br"));

            const netStats = document.createElement("div");
            netStats.id = "netStats";
            netStats.textContent = "-------------------- NET STATS -------------------------";
            debugBox.appendChild(netStats);
            debugBox.appendChild(document.createElement("br"));

            const fps = document.createElement("div");
            fps.id = "fpsMeter";
            debugBox.appendChild(fps);

            const websocketUpdates = document.createElement("div");
            websocketUpdates.id = "websocketUpdates";
            debugBox.appendChild(websocketUpdates);

            const websocketMessagesSent = document.createElement("div");
            websocketMessagesSent.id = "websocketMessages";
            debugBox.appendChild(websocketMessagesSent);

            const webserverRequests = document.createElement("div");
            webserverRequests.id = "webserverRequests";
            debugBox.appendChild(webserverRequests);

            const webserverLastUpdate = document.createElement("div");
            webserverLastUpdate.id = "webserverLastUpdate";
            debugBox.appendChild(webserverLastUpdate);
            debugBox.appendChild(document.createElement("br"));

            const entityListTitle = document.createElement("div");
            entityListTitle.id = "entityListTitle";
            entityListTitle.textContent = "-------------------- ENTITY LIST -----------------------";
            debugBox.appendChild(entityListTitle);
            debugBox.appendChild(document.createElement("br"));

            const entityList = document.createElement("div");
            entityList.id = "entityList";
            debugBox.appendChild(entityList);

            background.appendChild(debugBox);
        }
        console.log("UI CREATED");
    }
};
