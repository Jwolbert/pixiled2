export default class NpcVelocityControls {
    npcMap;
    gameObject;
    closestGroupSize = 3;
    pathRefreshVelocity = 0.1;
    costStepMax = 3;
    waitTime = 3000;
    behaviors = {follow: 0, random: 1, stop: 2, run: 3};
    currentBehavior = this.behaviors.random;
    detectionRadius = 10 + Math.random() * 5;
    standoffDistance = this.detectionRadius * 3 / 4;
    deflectionVelocity = 1;
    scene;

    constructor (gameObject, npcMap, scene) 
    {
        this.npcMap = npcMap;
        this.gameObject = gameObject;
        this.scene = scene;
    }

    setBehavior (behavior) {
        this.currentBehavior = this.behaviors[behavior];
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

    debounce = false;
    pathGraphics;
    standOffGraphics;
    detectionGraphics;
    get () {
        if (this.detectionGraphics) {
            this.detectionGraphics.destroy();
        }
        this.detectionGraphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xf0ffff }, fillStyle: { color: 0xffffff } });
        const circle3 = new Phaser.Geom.Circle(this.gameObject.body.center.x, this.gameObject.body.center.y, this.detectionRadius);
        this.detectionGraphics.strokeCircleShape(circle3);
        const within = this.scene.physics.overlapCirc(this.gameObject.getCenter().x, this.gameObject.getCenter().y, this.detectionRadius);
        let deflectionVelocityX = 0;
        let deflectionVelocityY = 0;
        if (this.pathGraphics) {
            this.pathGraphics.destroy();
        }
        const path = this.npcMap.get();
        if (!path) {
            return {velocityX: 0, velocityY: 0};
        }
        const closestNode = this.getClosestLowestCostNodes(path);
        let [velocityX, velocityY] = closestNode.reduce(this.sumVelocity, [0, 0]);

        const closest = within.reduce((closestBody, body) => {
            if ((body.velocity.x != 0 ||
                 body.velocity.y != 0) &&
                  body.gameObject?.id &&
                   body.gameObject.id !== this.gameObject.id) {
                    if (!closestBody) {
                        return body;
                    }
                    const difX1 = body.center.x - this.gameObject.body.center.x;
                    const difY2 = body.center.y - this.gameObject.body.center.y;
                    const difX3 = closestBody.center.x - this.gameObject.body.center.x;
                    const difY4 = closestBody.center.y - this.gameObject.body.center.y;
                    const distance1 = Math.sqrt(Math.pow(difX1, 2) + Math.pow(difY2, 2));
                    const distance2 = Math.sqrt(Math.pow(difX3, 2) + Math.pow(difY4, 2));
                    if (distance1 < distance2) {
                        return body;
                    }
            }
            return closestBody;
        }, undefined);
        if (closest) {
            const difX = closest.center.x - this.gameObject.body.center.x;
            const difY = closest.center.y - this.gameObject.body.center.y;
            const diagLen = Math.sqrt(Math.pow(difX, 2) + Math.pow(difY, 2));
            if ((diagLen > this.standoffDistance)) {
                if (this.standOffGraphics) {
                    this.standOffGraphics.destroy();
                }
                this.standOffGraphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x0fffff }, fillStyle: { color: 0xffffff } });
                const circle4 = new Phaser.Geom.Circle(this.gameObject.body.center.x, this.gameObject.body.center.y, this.standoffDistance);
                this.standOffGraphics.strokeCircleShape(circle4);
                return {velocityX: 0, velocityY: 0};
            }
            this.pathGraphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x00ffff }, fillStyle: { color: 0xffffff } });
            deflectionVelocityX = (Math.log10(Math.abs(difX) + 1) * Math.sign(difX)) * this.deflectionVelocity;
            deflectionVelocityY = (Math.log10(Math.abs(difY) + 1) * Math.sign(difY)) * this.deflectionVelocity;
            const circle1 = new Phaser.Geom.Circle(closest.center.x, closest.center.y, 10);
            const circle2 = new Phaser.Geom.Circle(this.gameObject.body.center.x, this.gameObject.body.center.y, 10);
            this.pathGraphics.strokeCircleShape(circle1);
            this.pathGraphics.strokeCircleShape(circle2);
            deflectionVelocityX *= -1;
            deflectionVelocityY *= -1;
        }

        if (this.currentBehavior === this.behaviors.stop) {
            return {velocityX: deflectionVelocityX, velocityY: deflectionVelocityY};
        }

        // console.log(velocityX.toFixed(2), velocityY.toFixed(2), deflectionVelocityX.toFixed(2), deflectionVelocityY.toFixed(2));
        if (this.pathRefreshVelocity > (Math.abs(velocityX) + Math.abs(velocityY))) {
            if (this.currentBehavior === this.behaviors.random && !this.debounce) {
                this.debounce = true;
                setTimeout(() => {
                    // setting target refreshes map
                    this.npcMap.setTarget(undefined);
                    this.debounce = false;
                }, this.waitTime);
            }
            return {velocityX: deflectionVelocityX, velocityY: deflectionVelocityY};
        }

        const outputVelocity = {};
        if (Math.sign(deflectionVelocityX) === Math.sign(velocityX)) {
            outputVelocity.velocityX = velocityX;
        } else {
            outputVelocity.velocityX = velocityX + deflectionVelocityX;
        }
        if (Math.sign(deflectionVelocityY) === Math.sign(velocityY)) {
            outputVelocity.velocityY = velocityY;
        } else {
            outputVelocity.velocityY = velocityY + deflectionVelocityY;
        }
        return outputVelocity;
    }
}