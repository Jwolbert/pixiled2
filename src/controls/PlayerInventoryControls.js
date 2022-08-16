export default class PlayerInventoryControls {

    input;
    swap = null

    constructor (input) {
        this.input = input;
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (deltaY > 0) {
                this.swap = 1;
            } else {
                this.swap = -1;
            }
        });
    }

    get () {
        if (this.swap) {
            const temp = this.swap;
            this.swap = null;
            return temp;
        }
        return null;
    }
}