import Phaser from "phaser";
import Player from "../entity/player/Player.js";
import Npc from "../entity/npc/Npc.js";
import Portal from "../entity/portal/Portal.js";
import AnimationUtility from "../utility/AnimationUtility.js";
import Attack from "../entity/action/attack/Attack.js";
import GameWebSocket from "../websocket/GameWebSocket.js";
import { profile, setDebugData, setEntities, createDebugBox, setPlayer } from "../debug/debug.js";
import FogOfWar from "../fogOfWar/FogOfWar.js";
import SoundManager from "../utility/SoundManager.js";

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
    mapLayer;
    dynamicLayer;
    staticLayer;
    staticLayerWalls;
    borderLayer;
    particles;

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
        // this.load.spritesheet('mainCharacters2x', 'assets/sheets/mainCharacters2x.png', { frameWidth: 48, frameHeight: 64 });
        this.load.spritesheet('vampire', 'assets/sheets/vampire.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('iceMage', 'assets/sheets/iceMage.png', { frameWidth: 24, frameHeight: 33 });
        this.load.spritesheet('slash', 'assets/sheets/slash.png', { frameWidth: 24, frameHeight: 32 });
        this.load.spritesheet('fireballSprite', 'assets/sheets/fireballSprite.png', { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet('bloodOrb', 'assets/sheets/bloodOrb.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('bloodOrbParticles', 'assets/sheets/bloodOrbParticles.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('poisonOrb', 'assets/sheets/poisonOrb.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('vampireBite', 'assets/sheets/vampireBite.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('poisonOrbParticles', 'assets/sheets/poisonOrbParticles.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('iceOrb', 'assets/sheets/iceOrb.png', { frameWidth: 52, frameHeight: 52 });
        this.load.spritesheet('iceOrbParticles', 'assets/sheets/iceOrbParticles.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('portals', 'assets/sheets/portals.png', { frameWidth: 48, frameHeight: 96 });
        this.load.spritesheet('arrow', 'assets/sheets/arrow.png', { frameWidth: 20, frameHeight: 10 });
        this.load.tilemapTiledJSON('map', 'assets/json/smallRuins.json');

        this.load.audio('theme', ['assets/sounds/vampireSpireTheme.mp3'],{
            instances: 1
        });
        this.load.audio('step', ['assets/sounds/stepGravel.mp3'],{
            instances: 1
        });
        this.load.audio('step2', ['assets/sounds/stepGravel2.mp3'],{
            instances: 1
        });
        this.load.audio('step3', ['assets/sounds/stepGravel3.mp3'],{
            instances: 1
        });
        this.load.audio('step4', ['assets/sounds/stepGravel4.mp3'],{
            instances: 1
        });
        this.load.audio('bloodForm', ['assets/sounds/bloodForm.mp3'],{
            instances: 1
        });
        this.load.audio('bloodOrb', ['assets/sounds/bloodOrb.mp3'],{
            instances: 1
        });
        this.load.audio('poisonOrb', ['assets/sounds/poisonOrb.mp3'],{
            instances: 1
        });
        this.load.audio('bloodOrbImpact', ['assets/sounds/bloodOrbImpact.mp3'],{
            instances: 1
        });
        this.load.audio('vampireBite', ['assets/sounds/vampireBite.mp3'],{
            instances: 1
        });
        this.load.audio('vampireCharge', ['assets/sounds/vampireCharge.mp3'],{
            instances: 1
        });
        this.load.audio('vampireMiss', ['assets/sounds/vampireMiss.mp3'],{
            instances: 1
        });
        this.load.audio('bow', ['assets/sounds/bow.mp3'],{
            instances: 1
        });
        this.load.audio('arrowImpact', ['assets/sounds/arrowImpact.mp3'],{
            instances: 1
        });
        this.load.audio('arrowHit', ['assets/sounds/arrowHit.mp3'],{
            instances: 1
        });
        this.load.audio('reload', ['assets/sounds/reload.mp3'],{
            instances: 1
        });
        this.load.audio('fade', ['assets/sounds/fade.mp3'],{
            instances: 1
        });
        this.load.audio('abilityReady', ['assets/sounds/abilityReady.mp3'],{
            instances: 1
        });
    }

    create ()
    {
        if(this.debug) {
            console.log("STARTING_SCENE");
        }

        // sounds
        const theme = this.sound.add('theme', { loop: true, volume: 0.5 });
        const step = this.sound.add('step', { loop: false, volume: 0.5 });
        const step2 = this.sound.add('step2', { loop: false, volume: 0.5 });
        const step3 = this.sound.add('step3', { loop: false, volume: 0.5 });
        const step4 = this.sound.add('step4', { loop: false, volume: 0.5 });
        const bloodForm = this.sound.add('bloodForm', { loop: false, volume: 0.4 });
        const bloodOrb = this.sound.add('bloodOrb', { loop: false, volume: 0.4 });
        const bloodOrbImpact = this.sound.add('bloodOrbImpact', { loop: false, volume: 0.4 });
        const vampireBite = this.sound.add('vampireBite', { loop: false, volume: 0.4 });
        const vampireCharge = this.sound.add('vampireCharge', { loop: false, volume: 0.4 });
        const vampireMiss = this.sound.add('vampireMiss', { loop: false, volume: 0.3 });
        const bow = this.sound.add('bow', { loop: false, volume: 0.8 });
        const fade = this.sound.add('fade', { loop: false, volume: 0.4 });
        const arrowImpact = this.sound.add('arrowImpact', { loop: false, volume: 0.4 });
        const arrowHit = this.sound.add('arrowHit', { loop: false, volume: 0.4 });
        const reload = this.sound.add('reload', { loop: false, volume: 0.4 });
        const poisonOrb = this.sound.add('poisonOrb', { loop: false, volume: 0.4 });
        const abilityReady = this.sound.add('abilityReady', { loop: false, volume: 0.4 });

        theme.play();
        step.play();
        window.SoundManager = new SoundManager();

        window.SoundManager.add("step", step);
        window.SoundManager.add("step", step2);
        window.SoundManager.add("step", step3);
        window.SoundManager.add("step", step4);
        window.SoundManager.add("bloodForm", bloodForm);
        window.SoundManager.add("bloodOrb", bloodOrb);
        window.SoundManager.add("bloodOrbImpact", bloodOrbImpact);
        window.SoundManager.add("vampireBite", vampireBite);
        window.SoundManager.add("vampireCharge", vampireCharge);
        window.SoundManager.add("vampireMiss", vampireMiss);
        window.SoundManager.add("bow", bow);
        window.SoundManager.add("fade", fade);
        window.SoundManager.add("arrowImpact", arrowImpact);
        window.SoundManager.add("arrowHit", arrowHit);
        window.SoundManager.add("reload", reload);
        window.SoundManager.add("poisonOrb", poisonOrb);
        window.SoundManager.add("abilityReady", abilityReady);

        //anims
        AnimationUtility.call(this, 
            ['hatman', 'slash', 'fireball', 'bloodOrb', 'bloodOrbParticles', 'poisonOrb', 'poisonOrbParticles', 'iceOrb', 'iceOrbParticles', 'portals', 'vampire', 'vampireBite', 'arrow', 'iceMage']
            , this.debug);

        // map
        const map = this.make.tilemap({ key: 'map' });
        const colisionList = [ 2, 18, 26, 34, 35, 41, 42, 36, 37, 28, 20, 21, 22, 30, 29, 46 ];
        const tiles = map.addTilesetImage('jawbreaker_tiles', 'ruins', 32, 32, 1, 2);
        map.setCollision(colisionList);

        // layers
        this.createPhysicsLayer(map, tiles);
        this.createDisplayLayers(map, tiles);


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

        this.map = map;
        this.entitiesGroup = this.physics.add.group();


        // MOVE THIS INTO Player.js

        //game shit
        this.character = this.physics.add.sprite(72, 72, 'vampire').setScale(1).setDepth(4);
        this.character.body.setSize(18, 20, true);
        console.log(this.character.body.center.x);
        if (window.character === "vampire") {
            this.character.setCircle(10, 6, 14);
        } else {
            this.character.setCircle(10, 2, 14);
        }
        // this.physics.add.collider(this.character, this.mapLayer);

        // this.entitiesGroup.add(this.character);
        this.physics.add.collider(this.character, this.mapLayer);
        this.dynamicLayer.add(this.character);
        this.player = new Player(window.character, this.character, this.input, this, this.interactions);
        this.entities[this.player.getId()] = this.player;
        // this.portal = new Portal('portals', this.physics.add.sprite(144, -8, 'portals').setDepth(3), this.player, this);

        setTimeout(() => {
            this.npcChar = this.physics.add.sprite(72, 72, 'iceMage').setScale(1).setDepth(4);
            this.npcChar.setCircle(7, 5, 12);
            this.npc = new Npc("iceMage", this.npcChar, this, this.interactions);
            this.entities[this.npc.getId()] = this.npc;
        }, 3000);

        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.character);
        // this.entities[this.portal.getId()] = this.portal;
        if (this.debug) {
            createDebugBox.call(this);
            setDebugData(this.debugData);
            setEntities(this.entities);
            setPlayer(this.player);
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
        if (this.websocket) {
            this.websocket.update();
        }
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
        const entity = new Attack(attack.name, this.entities, this.physics, attack, this.interactions, this.mapLayer, this.add, this.anims, this.dynamicLayer);
        this.entities[entity.getId()] = entity;
    }

    createDisplayLayers (map, tiles) {
        this.staticLayer = this.add.layer();
        this.staticLayerWalls = this.add.layer().setDepth(2);
        this.staticLayer.add(map.createLayer(1, tiles, 0, 0).setAlpha(0.2));
        this.staticLayerWalls.add(map.createLayer(2, tiles, 0, 0).setAlpha(0.4))
        // this.staticLayer.setAlpha(0.25);
    }

    createPhysicsLayer (map, tiles) {
        this.mapLayer =  map.createLayer(0, tiles, 0, 0).setAlpha(0.4);
        this.dynamicLayer = this.add.layer().setDepth(1);
        this.dynamicLayer.add(this.mapLayer);
    }
};
