import Phaser from "phaser";
import Player from "../entity/player/Player";
import AnimationUtility from "../utility/AnimationUtility";
import Attack from "../entity/action/attack/Attack";
import GameWebSocket from "../websocket/GameWebSocket";

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
        console.log(map);

        const collisionSet = new Set([ 2, 18, 26, 34, 35, 41, 42, 36, 37, 28, 20, 21, 22, 30, 29, 46 ]);
        console.log(this);

        const obstacles = this.add.group();
        map.layers[0].data.forEach((row) => {
            row.forEach((tile) => {
                if (collisionSet.has(tile.index)) {
                    const obstacle = this.add.rectangle(tile.x * 32 + 16, tile.y * 32 + 16, 32, 32).setStrokeStyle(1, 0xff0000);
                    obstacles.add(obstacle, true);
                }
            });
        });
        /*
        for (let x = 0; x < 100; x++) {
            let obstacle = this.add.rectangle(x * 32 + 16, -1 * 32 + 16, 32, 32).setStrokeStyle(1, 0xff0000);
            obstacles.add(obstacle, true);
            obstacle = this.add.rectangle(x * 32 + 16, 100 * 32 + 16, 32, 32).setStrokeStyle(1, 0xff0000);
            obstacles.add(obstacle, true);
        }
        for (let y = 0; y < 100; y++) {
            let obstacle = this.add.rectangle(-1 * 32 + 16, y * 32 + 16, 32, 32).setStrokeStyle(1, 0x0000ff);
            obstacles.add(obstacle, true);
            obstacle = this.add.rectangle(100 * 32 + 16, y * 32 + 16, 32, 32).setStrokeStyle(1, 0x0000ff);
            obstacles.add(obstacle, true);
        }
        */
        this.obstacles = obstacles;

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
        this.websocket = new GameWebSocket(this.entities, this.player, this.physics, layer, this.interactions, this.entitiesGroup);
        this.createUi();
        this.createRayCaster();
    }


    update ()
    {
        Object.values(this.entities).forEach((entity) => {
            entity.update();
        });
        this.performActions();
        this.websocket.update();
        this.interactions.length = 0;
        this.drawRay();
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
        console.log(gameWindow);
        gameWindow.id = "gameWindow";
        background.id = "background";
        // background.style.backgroundColor = "black";
        background.style.display = "flex";
        background.style.padding = "5%";
        background.style.justifyContent = "center";
    }

    createRayCaster () {
        //create raycaster
        this.raycaster = this.raycasterPlugin.createRaycaster();

        //create ray
        this.ray = this.raycaster.createRay({
            autoSlice: false,  //automatically slice casting result into triangles
            collisionRange: 250, //ray's field of view range
        });

        //enable ray arcade physics
        this.ray.enablePhysics();

        // console.log(this.ray._raycaster);

        /*
        this.ray._raycaster.setOptions({
            debug: {
                enabled: true, //enable debug mode
                maps: true, //enable maps debug
                rays: true, //enable rays debug
                graphics: {
                    ray: 0x00ff00, //debug ray color; set false to disable
                    rayPoint: 0xff00ff, //debug ray point color; set false to disable
                    mapPoint: 0x00ffff, //debug map point color; set false to disable
                    mapSegment: 0x0000ff, //debug map segment color; set false to disable
                    mapBoundingBox: 0xff0000 //debug map bounding box color; set false to disable
                }
              }
          });
          */

        this.ray._raycaster.setBoundingBox(0, 0, 3200, 3200);
        console.log(this.ray._raycaster);

        this.add.rectangle(1600, 1600, 3200, 3200).setFillStyle(0x000000, 0.1);
        //map obstacles
        this.raycaster.mapGameObjects(this.obstacles.getChildren());

        // TODO: get this working
        let x = this.physics.add.overlap(this.ray, this.entitiesGroup, function(rayCircle, target){
            console.log(target);
            if (this.entities[target.id]) {
                console.log(this.entities[target.id]);
            }
        }, this.ray.processOverlap.bind(this.ray));
        
        console.log(x);
        //reset targets
        /*
        this.game.events.on('prestep', function(){
          for(let target of targets.getChildren()) {
            if(!target.isOverlapingFov)
              target.setFillStyle(0x00ff00);
            target.isOverlapingFov = false;
          }
        });
        */

        //draw rays
        this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.1 } });

        this.drawRay();
    }

    drawRay() {
        this.ray.setOrigin(this.player.gameObject.x, this.player.gameObject.y);
        this.intersections = this.ray.castCircle();
        this.graphics.clear();
        this.graphics.lineStyle(1, 0x00ff00);
        this.graphics.fillStyle(0xffffff, 0.085);
        if(this.intersections.length > 0) {
            this.graphics.fillPoints(this.intersections);
        }
      
        if(this.ray.slicedIntersections.length > 0)
            for(let slice of this.ray.slicedIntersections) {
                this.graphics.strokeTriangleShape(slice);
            }
      
        // this.graphics.fillStyle(0xff00ff);
        this.graphics.fillPoint(this.ray.origin.x, this.ray.origin.y, 3);
    }
};
