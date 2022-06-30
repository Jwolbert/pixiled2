import Phaser from "phaser";
import NpcMap from "../entity/npc/NpcMap";
import Player from "../entity/player/Player";
import AnimationUtility from "../utility/AnimationUtility";
import Attack from "../entity/action/attack/Attack";
import GameWebSocket from "../websocket/GameWebSocket";

export class Example extends Phaser.Scene
{
    entities = {};
    player;
    websocket;

    constructor ()
    {
        super();
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
        // const npcMap = new NpcMap(map);

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        const tiles = map.addTilesetImage('jawbreaker_tiles', 'ruins', 32, 32, 1, 2);

        // You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
        const layer = map.createLayer(0, tiles, 0, 0);

        map.setCollision([ 2, 18, 26, 34, 35, 41, 42, 36, 37, 28, 20, 21, 22, 30, 29, 46 ]);

        layer.width = 200;

        this.character = this.physics.add.sprite(48, 48, 'mainCharacters').setScale(.9).setDepth(3);
        // this.npcCharacter = this.physics.add.sprite(500, 250, 'mainCharacters').setDepth(3);

        this.physics.add.collider(this.character, layer);
        // this.physics.add.collider(this.npcCharacter, layer);

        this.cameras.main.setZoom(1.5);
        this.cameras.main.startFollow(this.character);

        this.player = new Player('hatman', this.character, this.input);
        this.entities[this.player.getId()] = this.player;

        // const npc = new Npc('hatman', this.npcCharacter);
        // this.entities[npc.getId()] = npc;

        // npcMap.dStar(player, npc);

        /*
        setTimeout(() => {
            player.dead = true;
        }, 60000);
        */
       setTimeout(() => {
        console.log(this.count);
       },1000);

       this.websocket = new GameWebSocket(this.entities, this.player, this.physics); 
    }


    update ()
    {
        Object.keys(this.entities).forEach((id) => {
            this.entities[id].update();
        });

        this.bringOutYourDead();

        this.websocket.update();
        this.performActions();
    }

    bringOutYourDead () {
        Object.keys(this.entities).forEach((id) => {
            const entity = this.entities[id];
            if (entity.dead) {
                entity.gameObject.destroy();
                delete this.entities[id];
            }
        });
    }

    performActions () {
        Object.keys(this.entities).forEach((id) => {
            this.actionHandler(this.entities[id].getCurrentAction());
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
        console.log(this.attackCount);
        console.log(attack.location.x, attack.location.y);
        const attackArea = 20;
        const within = this.physics.overlapRect(attack.location.x - attackArea/2, attack.location.y - attackArea/2, attackArea, attackArea);
        within.forEach((body) => {
            console.log(this.entities[body.gameObject.id].type);
            this.entities[body.gameObject.id].addEffect(attack.effect);
        });
        const sprite = this.physics.add.sprite(attack.location.x, attack.location.y, "bloodT").setDepth(3).setRotation(attack.direction).setBodySize(attackArea,attackArea,true);
        const entity = new Attack('slash', sprite);
        this.entities[entity.getId()] = entity;
        console.log("attack handled");
        console.log("length", Object.keys(this.entities).length);
    }
};
