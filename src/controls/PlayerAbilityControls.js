export default class PlayerInventoryControls {

    input;
    activate = null;

    constructor (input) {
        this.input = input;
        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 32) {
                this.activate = true;
            }
        });
    }

    get () {
        if (this.activate) {
            const temp = this.activate;
            this.activate = null;
            return temp;
        }
        return null;
    }
}