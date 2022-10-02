export default class PlayerAttackControls {
    input;
    attacking = false;
    direction;
    screenWidth;
    screenHeight;
    location;
    range = 10;
    button;

    constructor (input) 
    {
        this.input = input;
        this.screenWidth = input.scene.game.config.width;
        this.screenHeight = input.scene.game.config.height;
        this.input.on('pointerdown', (pointer) => {
            this.calculateLocation(pointer);
            this.attacking = true;
            this.button = pointer.rightButtonDown() ? "right" : "left";
        });

        this.input.on('pointermove', (pointer) => {
            if (this.attacking)
            {
                this.calculateLocation(pointer);
            }
        });
        this.input.on('pointerup', () => {
            this.attacking = false;
        });
        this.input.on('gameout', () => {
            this.attacking = false;
        });
    }

    calculateLocation (pointer) {
        const dx = pointer.x - this.screenWidth / 2;
        const dy = this.screenHeight / 2 - pointer.y;
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
        if (this.attacking) {
            const control = {
                type: "attack",
                button: this.button,
                direction: this.direction,
                location: this.location,
            };
            return control;
        }
        return null;
    }
}