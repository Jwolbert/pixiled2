import Example from "./scenes/MainScene"
import Phaser from "phaser";

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#4d4d4d',
    pixelArt: true,
    scene: [ Example ]
};
const game = new Phaser.Game(config);