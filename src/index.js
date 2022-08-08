import { Example } from "./scenes/MainScene"
import Phaser from "phaser";
import PhaserRaycaster from "phaser-raycaster";
import { v4 as uuidv4 } from 'uuid';

//YEET

setTimeout(() => {createMenu()}, 50);


function createMenu () {
    const body = document.body;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'menuModal';
    modal.textContent = "hello"
    const button = document.createElement('div');
    button.className = 'button';
    button.onclick = sendId;
    const buttonText = document.createElement('span');
    buttonText.textContent = 'Start game';
    button.appendChild(buttonText);
    modal.appendChild(button);
    body.appendChild(modal);
    window.createItemContainer(5, 5);
}

window.createItemContainer = function (rows, columns) {
    const bag = document.createElement('div');
    bag.style.position = 'absolute';
    bag.style.backgroundColor = 'green';
    // bag.style.width = 200;
    // bag.style.height = 200;
    bag.style.top = 0;
    bag.style.left = 0;
    bag.draggable = true;
    bag.style.cursor = "move";
    bag.style.padding = "1rem";
    const itemList = document.createElement('div');
    itemList.style.backgroundColor = "black";
    itemList.style.display = "flex";
    itemList.style.gridTemplateColumns = "repeat(auto-fill,minmax(200px, 1fr))";
    itemList.style.flexWrap = "wrap";
    let dX = 0;
    let dY = 0;
    for(let i = 0; i < rows; i++) {
        for(let i = 0; i < columns; i++) {
            const item = document.createElement('div');
            item.style.width = 50;
            item.style.height = 50;
            itemList.appendChild(item);
        }
    }
    bag.appendChild(itemList);
    bag.addEventListener('dragstart', (data) => {
        console.log(data.screenX, data.screenY);
        dX = data.screenX;
        dY = data.screenY;
    });
    bag.addEventListener('dragend', (data) => {
        console.log(data.screenX, data.screenY);
        dX = data.screenX - dX;
        dY = data.screenY - dY;
        bag.style.top = Number(bag.style.top.replace("px", "")) + dY;
        bag.style.left = Number(bag.style.left.replace("px", "")) + dX;
        console.log(bag.style.top, bag.style.left);
    });
    const body = document.body;
    body.appendChild(bag);
};

function destroyMenu () {
    const menu = document.getElementById("menuModal");
    menu.remove();
}

function sendId () {
    const oReq = new XMLHttpRequest();
    oReq.open("POST", "http://" + window.location.hostname + ":4444/joinGame");
    oReq.setRequestHeader('Content-Type', 'application/json');
    const message = {};
    message.clientId = uuidv4();
    window.clientId = message.clientId;
    oReq.send(JSON.stringify(message));
    oReq.onreadystatechange = function () {
        if (this.readyState != 4) return;
    
        if (this.status == 200) {
            const data = JSON.parse(this.responseText);
    
            window.webSocketPort = data.webSocketPort;
        }
        destroyMenu();
        startGame();
    };
}

function startGame () {
    const background = document.body;
    const gameWindow = document.createElement("canvas");
    console.log(document);
    console.log(background);
    gameWindow.id = "gameWindow";
    gameWindow.oncontextmenu = function () {
        return false;
    };
    background.appendChild(gameWindow);
    background.id = "background";
    background.style.backgroundColor = "black";
    background.style.display = "flex";
    // background.style.padding = "5%";
    background.style.flexDirection = "row";
    background.style.justifyContent = "center";
    const config = {
        type: Phaser.CANVAS,
        parent: 'phaser-example',
        width: 800,
        height: 600,
        // zoom: 1.25,
        scene: [ Example ],
        // roundPixels: true,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
            }
        },
        // pixelArt: true,
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

