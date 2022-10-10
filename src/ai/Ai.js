import { Example } from "../scenes/MainScene.js";
import Phaser from "phaser";

config = {
    type: Phaser.HEADLESS,
    parent: 'phaser-example',
    scene: [ Example ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
};
new Phaser.Game(config);