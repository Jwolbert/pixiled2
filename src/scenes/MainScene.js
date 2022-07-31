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
    debug = false; // DEBUGGGGGGG
    fogOfWar;
    map;
    debugData;
    mapLayer;
    dynamicLayer;
    staticLayer;
    staticLayerWalls;
    borderLayer;

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
        //this.load.spritesheet('mainCharacters', 'assets/sheets/mainCharacters.png', { frameWidth: 24, frameHeight: 32 });
        this.load.spritesheet('mainCharacters2x', 'assets/sheets/mainCharacters2x.png', { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet('bloodT', 'assets/sheets/bloodT.png', { frameWidth: 24, frameHeight: 32 });
        this.load.spritesheet('fireballSprite', 'assets/sheets/fireballSprite.png', { frameWidth: 64, frameHeight: 32 });
        this.load.tilemapTiledJSON('map', 'assets/json/smallRuins.json');
    }

    create ()
    {
        if(this.debug) {
            console.log("STARTING_SCENE");
        }


        //anims
        AnimationUtility.call(this, ['hatman', 'slash', 'fireball']);


        //layers
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('jawbreaker_tiles', 'ruins', 32, 32, 1, 2);
        this.mapLayer =  map.createLayer(0, tiles, 0, 0);
        this.dynamicLayer = this.add.layer().setDepth(1);
        this.staticLayer = this.add.layer();
        this.staticLayerWalls = this.add.layer().setDepth(2);
        // this.dynamicLayer.add(map.createLayer(1, tiles, 0, 0).setAlpha(0.4));
        this.staticLayer.add(this.mapLayer);
        // this.staticLayerWalls.add(map.createLayer(2, tiles, 0, 0).setAlpha(0.4))
        this.staticLayer.setAlpha(0.25);
        console.log(this.staticLayer);
        this.dynamicLayer.setAlpha(1);
        console.log(this.dynamicLayer);
        const colisionList = [ 2, 18, 26, 34, 35, 41, 42, 36, 37, 28, 20, 21, 22, 30, 29, 46 ];
        map.setCollision(colisionList);

        /*
        setTimeout(() => {
            const bodies = this.physics.world.bodies.getArray().filter((body) => body.gameObject.type == 'Rectangle');
            console.log(bodies);
            this.mapLayer.layer.data.flat().reduce((last,current) => {
                if ([2, 18, 29].includes(current.index)) {
                    console.log("RESIZE");
                    bodies[last].gameObject.setSize(20, 20);
                    // bodies[last].setSize(20, 20, true);
                    bodies[last].update();
                    return last + 1;
                }
                return last;
            }, 0);
            console.log("BODIES", this.physics.world.bodies);
            // this.physics.add.collider(this.character, this.mapLayer);
        }, 5000)
        console.log(this.mapLayer.layer.data);
        console.log("BODIES", this.physics.world.bodies);
        console.log(this.physics);
        // this.character.body.updateFromGameObject();

        */


        /*
        border layer
        const border = this.make.graphics();
        border.beginPath();
        border.fillRect(0, 0, 800, 50);
        border.fillRect(750, 50, 50, 500);
        border.fillRect(0, 550, 800, 50);
        border.fillRect(0, 50, 50, 500);
        const mask = border.createGeometryMask();
        mask.set
        mask.setInvertAlpha();
        this.staticLayer.setMask(mask);
        */


        console.log(map);
        this.map = map;
        
        console.log(this);

        this.entitiesGroup = this.physics.add.group();


        // MOVE THIS INTO Player.js
        //

        //game shit
        this.character = this.physics.add.sprite(72, 72, 'mainCharacters2x').setScale(.8).setDepth(3);
        this.character.body.setSize(36, 40, true);
        this.character.body.setOffset(6, 24);
        this.physics.add.collider(this.character, this.mapLayer);
        console.log(this.character);

        this.entitiesGroup.add(this.character);
        // this.physics.add.collider(this.character, this.mapLayer);


        this.player = new Player('hatman', this.character, this.input);
        //

        this.cameras.main.setZoom(1.5);
        this.cameras.main.startFollow(this.character);
        this.entities[this.player.getId()] = this.player;
        if (this.debug) {
            createDebugBox.call(this);
            setDebugData(this.debugData);
            setEntities(this.entities);
        }
        this.websocket = new GameWebSocket(this.entities, this.player, this.physics, this.mapLayer, this.interactions, this.entitiesGroup, this.debugData, this.dynamicLayer, this);
        this.fogOfWar = new FogOfWar(this.raycasterPlugin, this, this.entities, this.entitiesGroup, this.graphics, this.map, this.physics, this.player, this.debug, this.debugData, this.dynamicLayer, this.mapLayer);
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
        const entity = new Attack(attack.name, this.entities, this.physics, attack, this.interactions, this.mapLayer);
        this.entities[entity.getId()] = entity;
    }
};
