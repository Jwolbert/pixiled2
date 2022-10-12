export default class NpcVelocityControls {
    npcMap;
    gameObject;

    constructor (gameObject, npcMap) 
    {
        this.npcMap = npcMap;
        this.gameObject = gameObject;
    }

    getClosestLowestCostNode(path) {
        path.forEach((node) => {
            node.difX = node.pixelX - this.gameObject.x;
            node.difY = node.pixelY - this.gameObject.y;
            node.dif = Math.abs(node.difX) + Math.abs(node.difY);
        });
        path.sort((a, b) => {
            if (a.dif > b.dif) {
                return 1;
            }
            return -1;
        });
        const top3 = path.slice(0,3);
        top3.sort((a, b) => {
            if (a.cost < b.cost) {
                return 1;
            }
            return -1;
        });
        return top3[0];
    }

    get () {
        const path = this.npcMap.get();
        console.log(path);
        if (!path) {
            return {velocityX: 0, velocityY: 0};
        }
        const nextNode = this.getClosestLowestCostNode(path);
        if (nextNode.terminal) {
            return {velocityX: 0, velocityY: 0};
        }
        const difX = nextNode.difX;
        const difY = nextNode.difY;
        const difXSign = Math.sign(difX);
        const difYSign = Math.sign(difY);
        let velocityX = Math.log10(Math.abs(difX) + 1) * difXSign;
        let velocityY = Math.log10(Math.abs(difY) + 1) * difYSign;

        // if (this.cursors.left.isDown)
        // {
        //     velocityX = -1;
        // }
        // else if (this.cursors.right.isDown)
        // {
        //     velocityX = 1;
        // }

        // if (this.cursors.up.isDown)
        // {
        //     velocityY = -1;
        // }
        // else if (this.cursors.down.isDown)
        // {
        //     velocityY = 1;
        // }

        return {velocityX, velocityY};
    }
}