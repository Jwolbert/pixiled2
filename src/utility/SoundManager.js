export default class SoundManager {
    sounds = {};
    soundIndexes = {};

    constructor () {

    }

    add (name, sound) {
        if (this.sounds[name]) {
            if(isNaN(this.soundIndexes[name])) {
                this.sounds[name] = [this.sounds[name]];
            }
            this.sounds[name].push(sound);
            this.soundIndexes[name] = 0;
            return;
        }
        this.sounds[name] = sound;
    }

    play (name) {
        if (!isNaN(this.soundIndexes[name])) {
            this.soundIndexes[name] = Math.floor(Math.random() * this.sounds[name].length);
            // this.soundIndexes[name] %= this.sounds[name].length;
            console.log(this.soundIndexes[name]);
            this.sounds[name][this.soundIndexes[name]].play();
        } else {
            this.sounds[name].play();
        }
    }
}