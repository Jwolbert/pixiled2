export default class NpcVelocityControls {
    npcMap;
    gameObject;
    closestGroupSize = 3;
    standoff = 0.1;
    costStepMax = 3;

    constructor (gameObject, npcMap) 
    {
        this.npcMap = npcMap;
        this.gameObject = gameObject;
    }

    getClosestLowestCostNodes(path) {
        let closest = [];
        // clone path
        path.forEach((node) => {
            closest.push({
                difX: node.pixelX - this.gameObject.body.center.x,
                difY: node.pixelY - this.gameObject.body.center.y,
                dif: Math.abs(node.pixelX - this.gameObject.body.center.x) + Math.abs(node.pixelY - this.gameObject.body.center.y),
                cost: node.cost,
            });
        });
        // get cost of node closest to npc
        const closestCost = closest.reduce((last, next) => {
            if (last.dif > next.dif) {
                return next;
            }
            return last;
        }, {dif: 9999}).cost;
        //filter out nodes which are too far along path
        closest = closest.filter((node) => {
            return node.cost < (closestCost + this.costStepMax);
        })
        //sort by descending cost
        closest.sort((a, b) => {
            if (a.cost < b.cost) {
                return 1;
            }
            return -1;
        });
        closest = closest.slice(0, this.closestGroupSize - 1);
        return closest;
    }

    sumVelocity = (sum, node, index) => {
        const stepDown = this.closestGroupSize / (index + 1);
        return [
            sum[0] + (Math.log10(Math.abs(node.difX) + 1) * Math.sign(node.difX)) / stepDown,
            sum[1] + (Math.log10(Math.abs(node.difY) + 1) * Math.sign(node.difY)) / stepDown
        ];
    };
    get () {
        const path = this.npcMap.get();
        if (!path) {
            return {velocityX: 0, velocityY: 0};
        }
        
        const closest = this.getClosestLowestCostNodes(path);
        let [velocityX, velocityY] = closest.reduce(this.sumVelocity, [0, 0]);
        if (this.standoff > (Math.abs(velocityX) + Math.abs(velocityY))) {
            return {velocityX: 0, velocityY: 0};
        }
        return {velocityX, velocityY};
    }
}