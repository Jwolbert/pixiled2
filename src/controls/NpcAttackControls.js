export default class NpcAttackControls {
    direction;
    location;
    range = 10;
    target;
    source;
    behaviors = {aggressive: 0, passive: 1};
    currentBehavior = this.behaviors.aggressive;

    constructor (target, source) 
    {
        this.target = target;
        this.source = source;
    }

    setBehavior (behavior) {
        this.currentBehavior = this.behaviors[behavior];
    }

    calculateLocation () {
        const dx = this.target.gameObject.body.center.x - this.source.gameObject.body.center.x;
        const dy = this.source.gameObject.body.center.y - this.target.gameObject.body.center.y;
        this.direction = Math.atan( dy / dx);
        if (dx < 0) {
            this.direction += Math.PI;
        } else if (dx >= 0 && dy < 0) {
            this.direction += Math.PI * 2;
        }
        this.location = {x: Math.cos(this.direction) * this.range, y: -1 * Math.sin(this.direction) * this.range}
        // this.direction += Math.PI;
        // this.direction *= -1;
    }

    get () {
        if (this.currentBehavior === this.behaviors.passive) return;
        this.calculateLocation();
        const control = {
            type: "attack",
            direction: this.direction,
            location: this.location,
        };
        return control;
    }
}