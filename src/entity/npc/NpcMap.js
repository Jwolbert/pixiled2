export default class NpcMap {
    mapInfo;

    constructor (map) {
        this.mapInfo = this.createMapInfo(map);
        console.log(this.mapInfo);
    }

    createMapInfo (map) {
        console.log(map);
        return {
            tiles: map.layers[0].data
            .map((row) => {
                return row.map((col) => {
                    return {
                        index: col.index,
                        collide: col.collideDown && col.collideUp && col.collideLeft && col.collideRight,
                        cost: {},
                        state: {},
                    };
                });
            }),
            tileHeight: map.tileHeight,
            tileWidth: map.tileWidth,
        }
    }

    dStar (targetEntity, souceEntity) {
        // we build a dStar map from targetEntity
        // and end once we reach sourceEntity
        const queue = [];
        console.log(Math.round(targetEntity.gameObject.x / 32), Math.round(targetEntity.gameObject.y / 32));
        const initX = Math.round(targetEntity.gameObject.x / 32);
        const initY = Math.round(targetEntity.gameObject.x / 32);
        queue.push({
            open: true,
            x: initX,
            y: initY,
        });
        const directions = [[1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1], [0,-1], [1,-1]];
        this.mapInfo[initX][initY].cost[targetEntity.id] = 0;
        this.mapInfo[initX][initY].open[targetEntity.id] = true;
        while(queue.length > 0) {
            const currentLocation = queue.pop();
            current = this.mapInfo[currentLocation.x][currentLocation.y].cost[targetEntity.id]
            const currentCost = current.cost[targetEntity.id];
            const nearbyTiles = [];
            directions.forEach((direction) => {
                const neighbor = this.mapInfo[current.x + direction[0]][current.y + direction[1]];
                const neighborCost = neighbor.cost[targetEntity.id];
                if(neighborCost ?? 0 < currentCost) {
                    neighbor.cost[targetEntity.id] = currentCost += 1;
                } else if (neighborCost ?? 0 < currentCost)
                nearbyTiles
            });
            this.mapInfo[initX][initY].cost[targetEntity.id]
        }
    }
}