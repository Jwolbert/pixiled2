export default class FogOfWar {

    raycasterPlugin;
    raycaster;
    ray;
    scene;
    entities;
    entitiesGroup;
    graphics;
    physics;
    player;
    intersections = [];

    constructor (raycasterPlugin, scene, entities, entitiesGroup, graphics, map, physics, player) {
        this.raycasterPlugin = raycasterPlugin;
        this.scene = scene;
        this.entities = entities;
        this.entitiesGroup = entitiesGroup;
        this.graphics = graphics;
        this.map = map;
        this.physics = physics;
        this.player = player;
        this.createObstacles();
        this.createRayCaster();
    }

    createObstacles () {
        const collisionSet = new Set([ 2, 18, 26, 34, 35, 41, 42, 36, 37, 28, 20, 21, 22, 30, 29, 46 ]);

        const obstacles = this.scene.add.group();
        this.map.layers[0].data.forEach((row) => {
            row.forEach((tile) => {
                if (collisionSet.has(tile.index)) {
                    const obstacle = this.scene.add.rectangle(tile.x * 32 + 16, tile.y * 32 + 16, 32, 32).setStrokeStyle(1, 0xff0000);
                    obstacles.add(obstacle, true);
                }
            });
        });

        this.obstacles = obstacles;
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

        this.scene.add.rectangle(1600, 1600, 3200, 3200).setFillStyle(0x000000, 0.1);
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
        this.graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.1 } });

        this.drawRay();
    }

    drawRay () {
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
    };
}