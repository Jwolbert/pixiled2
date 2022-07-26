import Phaser from "phaser";
import Player from "../entity/player/Player";
import AnimationUtility from "../utility/AnimationUtility";
import Attack from "../entity/action/attack/Attack";
import GameWebSocket from "../websocket/GameWebSocket";
import { profile, setDebugData, setEntities, createDebugBox } from "../debug/debug";
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
    layer;
    darknessLayer;
    staticLayer;

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
        this.load.tilemapTiledJSON('map', 'assets/json/smallRuins.json');
    }

    create ()
    {
        console.log("STARTING_SCENE");
        AnimationUtility.call(this, ['hatman', 'slash', 'fireball']);
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('jawbreaker_tiles', 'ruins', 32, 32, 1, 2);
        const layer = map.createLayer(0, tiles, 0, 0);
        this.layer = layer;
        map.setCollision([ 2, 18, 26, 34, 35, 41, 42, 36, 37, 28, 20, 21, 22, 30, 29, 46 ]);
        this.darknessLayer = this.add.layer();
        this.staticLayer = this.add.layer();
        this.darknessLayer.add(this.layer);
        this.staticLayer.add(map.createLayer(1, tiles, 0, 0));
        this.staticLayer.setAlpha(0.5);
        console.log(this.staticLayer);
        console.log(this.darknessLayer);

        console.log(map);
        this.map = map;
        
        console.log(this);

        this.character = this.physics.add.sprite(48, 48, 'mainCharacters').setScale(.9).setDepth(3);
        this.entitiesGroup = this.physics.add.group();
        this.physics.add.collider(this.character, layer);
        this.cameras.main.setZoom(1.5);
        this.cameras.main.startFollow(this.character);
        this.player = new Player('hatman', this.character, this.input);
        this.entities[this.player.getId()] = this.player;
        this.entitiesGroup.add(this.character);
        if (this.debug) {
            createDebugBox.call(this);
            setDebugData(this.debugData);
            setEntities(this.entities);
        }
        this.websocket = new GameWebSocket(this.entities, this.player, this.physics, layer, this.interactions, this.entitiesGroup, this.debugData);
        this.fogOfWar = new FogOfWar(this.raycasterPlugin, this, this.entities, this.entitiesGroup, this.graphics, this.map, this.physics, this.player, this.debug, this.debugData, this.darknessLayer, this.layer);
        this.cameras.resize(this.game.config.width, this.game.config.height);
    }


    update ()
    {
        Object.values(this.entities).forEach((entity) => {
            entity.update();
        });
        this.performActions();
        this.websocket.update();
        if (this.fogOfWar) {
            this.fogOfWar.update();
        }
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

    attackHandler (attack) {
        const entity = new Attack(attack.name, this.entities, this.physics, attack, this.interactions, this.layer);
        this.entities[entity.getId()] = entity;
    }
};
