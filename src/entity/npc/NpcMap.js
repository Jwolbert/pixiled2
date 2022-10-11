import Phaser from "phaser";

export default class NpcMap {
    mapInfo;
    graphics;
    scene;
    gridSize = 32;
    debug = false;

    constructor (scene, identityEntity) {
        // from scene.js ...
        // this.load.image('ruins', 'assets/sheets/jawbreaker_tiles-extruded.png');
        // this.load.tilemapTiledJSON('map', 'assets/json/smallRuins.json');
        // const map = this.make.tilemap({ key: 'map' });
        // const colisionList = [ 2, 18, 26, 34, 35, 41, 42, 36, 37, 28, 20, 21, 22, 30, 29, 46 ];
        // const tiles = map.addTilesetImage('jawbreaker_tiles', 'ruins', 32, 32, 1, 2);
        // map.setCollision(colisionList);
        // this.map = map;
        if (scene.debug) {
            this.debug = true;
            this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });
        }
        this.mapInfo = this.createMapInfo(scene.map);
        this.scene = scene;
        this.dijkstra(scene.player, identityEntity).forEach((node) => {
            if (this.debug) {
                this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0xff00ff }, fillStyle: { color: 0xffffff } });
                const circle = new Phaser.Geom.Circle(node.x * this.gridSize + this.gridSize / 2, node.y * this.gridSize + this.gridSize / 2, 5);
                this.graphics.strokeCircleShape(circle);
            }
            console.log(node);
        });
        console.log(this.mapInfo);
    }

    createMapInfo (map) {
        console.log(map);
        const mapInfo = {
            tiles: map.layers[0].data
            .map((row, y) => {
                return row.map((col, x) => {
                    if (this.debug && !(col.collideDown && col.collideUp && col.collideLeft && col.collideRight)) {
                        const circle = new Phaser.Geom.Circle(x * this.gridSize + this.gridSize / 2, y * this.gridSize + this.gridSize / 2, 10);
                        this.graphics.strokeCircleShape(circle);
                    }
                    return {
                        x,
                        y,
                        collide: col.collideDown && col.collideUp && col.collideLeft && col.collideRight,
                        cost: 9999,
                        visited: false,
                    };
                });
            }),
            tileHeight: map.tileHeight,
            tileWidth: map.tileWidth,
        };
        mapInfo.dimX = [0, mapInfo.tiles.length];
        mapInfo.dimY = [0, mapInfo.tiles[0].length];
        return mapInfo;
    }

    dijkstra (targetEntity, sourceEntity) {
        const tiles = this.mapInfo.tiles;
        const open = [];
        const startX = Math.floor(targetEntity.gameObject.body.center.x / 32);
        const startY = Math.floor(targetEntity.gameObject.body.center.y / 32);
        const endX = Math.floor(sourceEntity.gameObject.body.center.x / 32);
        const endY = Math.floor(sourceEntity.gameObject.body.center.y / 32);
        const start = tiles[startY][startX];
        console.log(startX, startY, endX, endY);
        start.cost = 0;
        open.push(start);
        while(open.length) {
            const next = open.shift();
            if (next.x === endX && next.y === endY) {
                console.log("Path finding complete");
                return this.getPath(next, startX, startY);
            }
            const neighbors = this.getNeighbors(next);
            neighbors.forEach((neighbor) => {
                // neighbor = [neighbor object, cost to traverse from next]
                if (!neighbor.visited && neighbor[0].cost > (next.cost + neighbor[1])) {
                    neighbor[0].cost = next.cost + neighbor[1];
                    open.push(neighbor[0]);
                }
            });
            next.visited = true;
        }
    }

    directions = [[1,0,1], [1,1,1.414], [0,1,1], [-1,1,1.414], [-1,0,1], [-1,-1,1.414], [0,-1,1], [1,-1,1.414]];
    getNeighbors(next) {
        return this.directions.reduce((neighbors, direction) => {
            const neighbor = this.mapInfo.tiles[next.y + direction[0]][next.x + direction[1]];
            if (neighbor && !neighbor.collide)
            {
                neighbors.push([neighbor, direction[2]]);
            }
            return neighbors;
        }, []);
    }

    getPath(end, startX, startY) {
        const shortestPath = [];
        let next = end;
        shortestPath.push(next);
        let steps = 0;
        while (next.x !== startX || next.y !== startY) {
            next = this.getNeighbors(next).reduce((lowestNeighbor, neighbor) => {
                if (!lowestNeighbor || lowestNeighbor.cost > neighbor[0].cost) {
                    return neighbor[0];
                }
                return lowestNeighbor;
            }, undefined);
            shortestPath.push(next);
            if (steps++ > 1000) {
                console.log("Unable to create path");
                return [];
            }
        }
        return shortestPath;
    }
}