import { Example } from "./scenes/MainScene"
import Phaser from "phaser";
import PhaserRaycaster from "phaser-raycaster";
import { v4 as uuidv4 } from 'uuid';

//YEET

// setTimeout(() => {createMenu()}, 50);
setTimeout(() => {startGame()}, 50);


function createMenu () {
    const body = document.body;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.textContent = "hello"
    const button = document.createElement('div');
    button.className = 'button';
    button.onclick = sendId;
    const buttonText = document.createElement('span');
    buttonText.textContent = 'Start game';
    button.appendChild(buttonText);
    modal.appendChild(button);
    body.appendChild(modal);
}

function sendId () {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", startGame);
    oReq.open("POST", "http://" + window.location.hostname + ":4444/joinGame");
    oReq.setRequestHeader('Content-Type', 'application/json');
    const message = {};
    message.clientId = uuidv4();
    window.clientId = message.clientId;
    oReq.send(JSON.stringify(message));
}

function startGame () {
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
                debug: true,
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

