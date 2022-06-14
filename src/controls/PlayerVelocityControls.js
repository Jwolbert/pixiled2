export default class PlayerVelocityControls {
    cursors;
    input;
    constructor (input) 
    {
        this.input = input;
        this.cursors = {};
        this.cursors.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursors.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cursors.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
    get () {
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown)
        {
            velocityX = -1;
        }
        else if (this.cursors.right.isDown)
        {
            velocityX = 1;
        }

        if (this.cursors.up.isDown)
        {
            velocityY = -1;
        }
        else if (this.cursors.down.isDown)
        {
            velocityY = 1;
        }

        if (velocityX === 0 || velocityY === 0) {
            return {velocityX, velocityY};
        } else {
            let normalizedVelocityX = (Math.abs(velocityX) / (Math.abs(velocityX) + Math.abs(velocityY))) * velocityX * 1.41;
            let normalizedVelocityY = (Math.abs(velocityY) / (Math.abs(velocityX) + Math.abs(velocityY))) * velocityY * 1.41;
            return {velocityX: normalizedVelocityX, velocityY: normalizedVelocityY};
        }
    }
}