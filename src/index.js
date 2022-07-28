import { Example } from "./scenes/MainScene"
import Phaser from "phaser";
import PhaserRaycaster from "phaser-raycaster";

//YEET
setTimeout(() => {createUi()}, 50);

function createUi () {
    const background = document.body;
    const gameWindow = document.createElement("canvas");
    console.log(document);
    console.log(background);
    gameWindow.id = "gameWindow";
    background.appendChild(gameWindow);
    background.id = "background";
    background.style.backgroundColor = "black";
    background.style.display = "flex";
    background.style.padding = "5%";
    background.style.flexDirection = "row";
    background.style.justifyContent = "center";
    const config = {
        type: Phaser.CANVAS,
        parent: 'phaser-example',
        width: 880,
        height: 660,
        zoom: 1,
        scene: [ Example ],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
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
        },
        canvas: document.getElementById('gameWindow'),
    };
    new Phaser.Game(config);
    console.log("UI CREATED");
}