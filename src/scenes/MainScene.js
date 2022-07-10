import Phaser from "phaser";
import Player from "../entity/player/Player";
import AnimationUtility from "../utility/AnimationUtility";
import Attack from "../entity/action/attack/Attack";
import GameWebSocket from "../websocket/GameWebSocket";

export class Example extends Phaser.Scene
{
    entities = {};
    data = {};
    interactions = [];
    player;
    websocket;

    constructor (websocket)
    {
        super();
        this.websocket = websocket;
    }

    preload ()
    {
        //this.load.spritesheet('hatman', 'assets/sheets/mainCharacters.png', { frameWidth: 24, frameHeight: 32 });
        this.load.image('ruins', 'assets/sheets/jawbreaker_tiles-extruded.png');
        this.load.spritesheet('mainCharacters', 'assets/sheets/mainCharacters.png', { frameWidth: 24, frameHeight: 32 });
        this.load.spritesheet('bloodT', 'assets/sheets/bloodT.png', { frameWidth: 24, frameHeight: 32 });
        this.load.tilemapTiledJSON('map', 'assets/json/Ruins2.json');
    }

    create ()
    {
        console.log("STARTING_SCENE");
        AnimationUtility.call(this, ['hatman', 'slash']);
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('jawbreaker_tiles', 'ruins', 32, 32, 1, 2);
        const layer = map.createLayer(0, tiles, 0, 0);
        map.setCollision([ 2, 18, 26, 34, 35, 41, 42, 36, 37, 28, 20, 21, 22, 30, 29, 46 ]);
        layer.width = 200;
        this.character = this.physics.add.sprite(48, 48, 'mainCharacters').setScale(.9).setDepth(3);
        this.physics.add.collider(this.character, layer);
        this.cameras.main.setZoom(1.5);
        this.cameras.main.startFollow(this.character);
        this.player = new Player('hatman', this.character, this.input);
        this.entities[this.player.getId()] = this.player;
        this.websocket = new GameWebSocket(this.entities, this.player, this.physics, layer, this.interactions);
    }


    update ()
    {
        Object.values(this.entities).forEach((entity) => {
            entity.update();
        });
        this.performActions();
        this.websocket.update();
        this.interactions.length = 0;
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
};
