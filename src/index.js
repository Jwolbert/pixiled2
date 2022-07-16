import { Example } from "./scenes/MainScene"
import Phaser from "phaser";
import PhaserRaycaster from "phaser-raycaster";

console.log(PhaserRaycaster);
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    zoom: 1,
    scene: [ Example ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    plugins: {
        scene: [
            {
                key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    }
};
const game = new Phaser.Game(config);

/*
const script = document.createElement('script');
const scriptList = ['//cdn.jsdelivr.net/npm/phaser@3.51.0/dist/phaser.min.js', 'src/scenes/MainScene.js', 'src/main.js', 'src/controls/controls.js'];
const loadScript = () => {
    const script = document.createElement('script');
    script.src = scriptList.shift();
    document.head.appendChild(script);
    script.onload = () => {
        if(scriptList.length === 0) {
            startGame();
        } else {
            loadScript();
        }
    };
};
loadScript();
*/