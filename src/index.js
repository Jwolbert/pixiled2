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
    window.createItemContainer([1,2,3]);
    window.createCharacterStats();
}

window.createCharacterStats = function () {
    const statCard = document.createElement('div');
        statCard.style.display = "flex"
        statCard.style.flexDirection = "column";
        statCard.style.gap = "1rem";
        statCard.style.backgroundColor = "black";
        statCard.style.borderWidth = "3px";
        statCard.style.borderColor = "gray";
        statCard.style.position = "absolute";
        statCard.style.top = 200;
        statCard.style.left = 75;
        // statCard.style.backgroundImage = "url(../assets/images/scroll.png)";

        const healthBar = document.createElement('div');
            healthBar.style.backgroundColor = "red";
            healthBar.className = "statBar";
            healthBar.id = "healthBar";

        const healthBarBorder = document.createElement('div');
            healthBarBorder.className = "statBarBorder";
            healthBarBorder.style.marginTop = "1rem";

        healthBarBorder.appendChild(healthBar);

        const manaBar = document.createElement('div');
            manaBar.style.backgroundColor = "blue";
            manaBar.className = "statBar";
            manaBar.id = "manaBar";

        const manaBarBorder = document.createElement('div');
            manaBarBorder.className = "statBarBorder";

        manaBarBorder.appendChild(manaBar);

        const staminaBar = document.createElement('div');
            staminaBar.style.backgroundColor = "green";
            staminaBar.className = "statBar";
            staminaBar.id = "staminaBar";

        const staminaBarBorder = document.createElement('div');
            staminaBarBorder.className = "statBarBorder";
            staminaBarBorder.style.marginBottom = "1rem";

        staminaBarBorder.appendChild(staminaBar);

    statCard.appendChild(healthBarBorder);
    statCard.appendChild(manaBarBorder);
    statCard.appendChild(staminaBarBorder);

    statCard.draggable = true;

    let dX = 0;
    let dY = 0;

    statCard.addEventListener('dragstart', (data) => {
        dX = data.screenX;
        dY = data.screenY;
    });
    statCard.addEventListener('dragend', (data) => {
        dX = data.screenX - dX;
        dY = data.screenY - dY;
        statCard.style.top = Number(statCard.style.top.replace("px", "")) + dY;
        statCard.style.left = Number(statCard.style.left.replace("px", "")) + dX;
    });

    const body = document.body;
    body.appendChild(statCard);
}

window.createItemContainer = function (items) {
    const bag = document.createElement('div');
    bag.style.position = 'absolute';
    // bag.style.backgroundColor = 'green';
    bag.style.backgroundImage = "url(../assets/images/BackpackDavidBrown.png)";
    bag.style.backgroundSize = "21.5rem 21.5rem";
    bag.style.width = "21.5rem";
    bag.style.height = "21.5rem";
    // bag.style.height = 200;
    bag.style.top = 500;
    bag.style.left = 75;
    bag.draggable = true;
    bag.style.cursor = "move";
    const itemList = document.createElement('div');
    itemList.style.display = "flex";
    itemList.style.flexWrap = "wrap";
    itemList.style.gap = "0.25rem";
    itemList.style.marginLeft = "4rem";
    itemList.style.marginRight = "6rem";
    itemList.style.marginTop = "6rem";
    itemList.style.marginBottom = "4rem";
    itemList.style.width = "12.5rem";
    itemList.style.height = "11.5rem";
    // itemList.style.opacity = "0";
    let dX = 0;
    let dY = 0;
    items.forEach((item) => {
        item = document.createElement('div');
        item.style.width = 50;
        item.style.height = 50;
        item.style.backgroundColor = "red";
        item.style.borderRadius = "3rem";
        item.style.opacity = "0.5";
        itemList.appendChild(item);
        item.draggable = true;
        item.style.position = "relative"
        let dX = 0;
        let dY = 0;
        item.addEventListener('dragstart', (data) => {
            console.log(data.screenX, data.screenY);
            dX = data.screenX;
            dY = data.screenY;
            data.stopPropagation();
        });
        item.addEventListener('dragend', (data) => {
            console.log(data.screenX, data.screenY);
            dX = data.screenX - dX;
            dY = data.screenY - dY;
            item.style.top = Number(item.style.top.replace("px", "")) + dY;
            item.style.left = Number(item.style.left.replace("px", "")) + dX;
            console.log(item.style.top, item.style.left);
            data.stopPropagation();
        });
    });
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
        height: 800,
        // zoom: 1.25,
        scene: [ Example ],
        // roundPixels: true,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
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

