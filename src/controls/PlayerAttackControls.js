import { GameObjects } from "phaser";

export default class PlayerAttackControls {
    input;
    attacking = false;
    direction;
    screenWidth;
    screenHeight;
    location;
    range = 30;
    constructor (input) 
    {
        this.input = input;
        this.screenWidth = input.scene.game.config.width;
        this.screenHeight = input.scene.game.config.height;
        this.input.on('pointerdown', (pointer) => {
            if (this.attacking) {
                return;
            }
            console.log("click:", pointer.x, pointer.y);
            const dx = pointer.x - this.screenWidth / 2;
            const dy = this.screenHeight / 2 - pointer.y;
            console.log("delta", dx, dy);
            this.direction = Math.atan( dy / dx);
            if (dx < 0) {
                this.direction += Math.PI;
            } else if (dx >= 0 && dy < 0) {
                this.direction += Math.PI * 2;
            }
            this.location = {x: Math.cos(this.direction) * this.range, y: -1 * Math.sin(this.direction) * this.range}
            // this.direction += Math.PI;
            // this.direction *= -1;
            console.log("control direction", this.direction);
            this.attacking = true;
        });
    }
    get () {
        if (this.attacking) {
            this.attacking = false;
            const control = {
                type: "attack",
                direction: this.direction,
                location: this.location,
            };
            return control;
        }
        return null;
    }
}