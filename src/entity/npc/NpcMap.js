import Phaser from "phaser";

export default class NpcMap {
    mapInfo;
    passableTileGraphics;
    pathGraphics;
    identityEntity;
    targetEntity;
    scene;
    gridSize = 32;
    debug = false;
    currentPath;
    timeoutId = undefined;
    timeoutMultiple = 75;
    randomRange = 4;
    randomMin = 4;
    loop;
    drawGrid;
    stopped = false;

    constructor (scene, identityEntity, drawGrid) {
        // from scene.js ...
        // this.load.image('ruins', 'assets/sheets/jawbreaker_tiles-extruded.png');
        // this.load.tilemapTiledJSON('map', 'assets/json/smallRuins.json');
        // const map = this.make.tilemap({ key: 'map' });
        // const colisionList = [ 2, 18, 26, 34, 35, 41, 42, 36, 37, 28, 20, 21, 22, 30, 29, 46 ];
        // const tiles = map.addTilesetImage('jawbreaker_tiles', 'ruins', 32, 32, 1, 2);
        // map.setCollision(colisionList);
        // this.map = map;
        this.scene = scene;
        this.identityEntity = identityEntity;
        this.targetEntity = this.scene.player;
        this.drawGrid = drawGrid;
        this.loop = () => {
            if (scene.debug) {
                if (this.passableTileGraphics) {
                    this.passableTileGraphics.destroy(); 
                }
                if (this.pathGraphics) {
                    this.pathGraphics.destroy();
                }
                this.debug = true;
                this.passableTileGraphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });
                this.pathGraphics = scene.add.graphics({ lineStyle: { width: 2, color: 0xff00ff }, fillStyle: { color: 0xffffff } });
            }
            this.mapInfo = this.createMapInfo(scene.map);
            this.currentPath = this.dijkstra(this.targetEntity, this.identityEntity).map((node) => {
                if (this.debug) {
                    const circle = new Phaser.Geom.Circle(node.x * this.gridSize + this.gridSize / 2, node.y * this.gridSize + this.gridSize / 2, 5);
                    this.pathGraphics.strokeCircleShape(circle);
                    // console.log(node);
                }
                return {
                    ...node,
                    pixelX: node.x * this.gridSize + this.gridSize / 2,
                    pixelY: node.y * this.gridSize + this.gridSize / 2,
                }
            });
            if (this.targetEntity && !this.stopped) {
                this.timeoutId = setTimeout(this.loop, this.timeoutMultiple * this.currentPath.length);
            }
        }
    }

    destroy() {
        clearTimeout(this.timeoutId);
    }

    get () {
        return this.currentPath;
    }

    stop () {
        this.stopped = true;
        clearTimeout(this.timeoutId);
    }

    setTarget (target) {
        this.stopped = false;
        this.targetEntity = target;
        this.loop();
    }

    setPath(path) {
        this.currentPath = path;
    }

    createMapInfo (map) {
        const mapInfo = {
            tiles: map.layers[0].data
            .map((row, y) => {
                return row.map((col, x) => {
                    if (this.drawGrid && !(col.collideDown && col.collideUp && col.collideLeft && col.collideRight)) {
                        const circle = new Phaser.Geom.Circle(x * this.gridSize + this.gridSize / 2, y * this.gridSize + this.gridSize / 2, 10);
                        this.passableTileGraphics.strokeCircleShape(circle);
                    }
                    return {
                        x,
                        y,
                        collide: col.collideDown && col.collideUp && col.collideLeft && col.collideRight,
                        cost: 9999,
                        visited: false,
                        terminal: false,
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
        if (!sourceEntity.gameObject.body) return [];
        const tiles = this.mapInfo.tiles;
        const open = [];
        const startX = Math.floor(sourceEntity.gameObject.body.center.x / 32);
        const startY = Math.floor(sourceEntity.gameObject.body.center.y / 32);
        let endX;
        let endY;
        if (!this.targetEntity) {
            // random
            endX = startX + (this.randomRange * this.randomMin / 2 - Math.round(Math.random() * this.randomRange)  * this.randomMin);
            endY = startY + (this.randomRange * this.randomMin / 2 - Math.round(Math.random() * this.randomRange)  * this.randomMin);
            while (!tiles[endY]?.[endX] || tiles[endY][endX].collide) {
                endX = startX + (this.randomRange * this.randomMin / 2 - Math.round(Math.random() * this.randomRange)  * this.randomMin);
                endY = startY + (this.randomRange * this.randomMin / 2 - Math.round(Math.random() * this.randomRange)  * this.randomMin);
            }
        } else {
            endX = Math.floor(targetEntity.gameObject.body.center.x / 32);
            endY = Math.floor(targetEntity.gameObject.body.center.y / 32);
        }
        const start = tiles[startY][startX];
        start.cost = 0;
        open.push(start);
        let steps = 0;
        while(open.length) {
            const next = open.shift();
            if (next.x === endX && next.y === endY) {
                if (this.debug) {
                    console.log("Dijkstra steps: ", steps);
                }
                next.terminal = true;
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
            steps++;
        }
    }

    // directions = [[1,0,1], [1,1,1.414], [0,1,1], [-1,1,1.414], [-1,0,1], [-1,-1,1.414], [0,-1,1], [1,-1,1.414]];
    directions = [[1,0,1], [0,1,1], [-1,0,1], [0,-1,1]];
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
        next.terminal = true;
        return shortestPath;
    }
}