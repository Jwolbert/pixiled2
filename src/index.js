import { Example } from "./scenes/MainScene"
import Phaser from "phaser";
import PhaserRaycaster from "phaser-raycaster";
import { v4 as uuidv4 } from 'uuid';

//YEET

setTimeout(() => {createMenu()}, 50);

let config;
const audio = new Audio('/assets/sounds/start.wav');
audio.volume = 0.1;
function createMenu () {
    const body = document.body;
    const modal = document.createElement('div');
    const modalRow0 = document.createElement('div');
    modalRow0.className = "modalRow";
    modalRow0.textContent = "PIXILED v0.1"
    modalRow0.style.color = "red";
    modalRow0.style.fontSize = "1.5rem";
    const modalRow1 = document.createElement('div');
    modalRow1.className = "modalRow";
    const modalRow2 = document.createElement('div');
    modalRow2.className = "modalRow";
    const modalRow3 = document.createElement('div');
    modalRow3.className = "modalRow";
    modal.className = 'modal';
    modal.id = 'menuModal';
    const vampireButton = document.createElement('div');
    vampireButton.className = 'button';
    vampireButton.style.backgroundColor = "red";
    vampireButton.onclick = pickBloodWizard;
    const vampireButtonText = document.createElement('span');
    const vampireButtonSubText = document.createElement('span');
    vampireButtonText.textContent = 'Blood Wizard';
    vampireButtonText.style.color = "white";
    vampireButtonSubText.textContent = 'Click to play';
    vampireButtonSubText.style.color = "white";
    vampireButtonSubText.style.fontSize = "16px";
    vampireButton.appendChild(vampireButtonText);
    vampireButton.appendChild(document.createElement('br'));
    vampireButton.appendChild(vampireButtonSubText);
    const shadeButton = document.createElement('div');
    shadeButton.className = 'button';
    shadeButton.style.backgroundColor = "midnightblue";
    shadeButton.onclick = pickShade;
    const shadeButtonText = document.createElement('span');
    const shadeButtonSubText = document.createElement('span');
    shadeButtonText.textContent = 'Toxic Shade';
    shadeButtonSubText.textContent = 'Click to play';
    shadeButtonText.style.color = "lawngreen";
    shadeButtonSubText.style.color = "lawngreen";
    shadeButtonSubText.style.fontSize = "16px";
    shadeButton.appendChild(shadeButtonText);
    shadeButton.appendChild(document.createElement('br'));
    shadeButton.appendChild(shadeButtonSubText);

    const controlBox = document.createElement('div');
    controlBox.className = "controlBox";
    const controlBoxText = document.createElement('span');
    controlBoxText.textContent = "Controls";
    const controlBoxLine1 = document.createElement('span');
    controlBoxLine1.textContent = "Movement: WASD Keys";
    const controlBoxLine2 = document.createElement('span');
    controlBoxLine2.textContent = "Primary attack: left mouse click/hold";
    const controlBoxLine3 = document.createElement('span');
    controlBoxLine3.textContent = "Secondar attack: right mouse click/hold";
    const controlBoxLine4 = document.createElement('span');
    controlBoxLine4.textContent = "Special ability: E Key";
    controlBox.appendChild(controlBoxText);
    controlBox.appendChild(document.createElement('br'));
    controlBox.appendChild(controlBoxLine1);
    controlBox.appendChild(document.createElement('br'));
    controlBox.appendChild(controlBoxLine2);
    controlBox.appendChild(document.createElement('br'));
    controlBox.appendChild(controlBoxLine3);
    controlBox.appendChild(document.createElement('br'));
    controlBox.appendChild(controlBoxLine4);

    const vampireBox = document.createElement('div');
    vampireBox.className = "vampireBox";
    const vampireBoxText = document.createElement('span');
    vampireBoxText.textContent = "Equipment";
    vampireBoxText.style.fontSize = "1.5rem";
    vampireBoxText.style.textDecoration = "underline";
    const vampireBoxLine1 = document.createElement('span');
    vampireBoxLine1.textContent = "Primary: Vampiric Maw";
    const vampireBoxLine2 = document.createElement('span');
    vampireBoxLine2.textContent = "Secondary: Blood Orb Scroll";
    const vampireBoxLine3 = document.createElement('span');
    vampireBoxLine3.textContent = "Special ability: Blood Mist Form";
    vampireBox.appendChild(vampireBoxText);
    vampireBox.appendChild(document.createElement('br'));
    vampireBox.appendChild(vampireBoxLine1);
    vampireBox.appendChild(document.createElement('br'));
    vampireBox.appendChild(vampireBoxLine2);
    vampireBox.appendChild(document.createElement('br'));
    vampireBox.appendChild(vampireBoxLine3);

    const shadeBox = document.createElement('div');
    shadeBox.className = "shadeBox";
    const shadeBoxText = document.createElement('span');
    shadeBoxText.textContent = "Equipment";
    shadeBoxText.style.fontSize = "1.5rem";
    shadeBoxText.style.textDecoration = "underline";
    const shadeBoxLine1 = document.createElement('span');
    shadeBoxLine1.textContent = "Primary: Automatic Crossbow";
    const shadeBoxLine2 = document.createElement('span');
    shadeBoxLine2.textContent = "Secondary: Sabotage Kit (Poison)";
    const shadeBoxLine3 = document.createElement('span');
    shadeBoxLine3.textContent = "Special ability: Invisibility Potion";
    const shadeBoxLine4 = document.createElement('span');
    shadeBoxLine4.textContent = "(Hint: Sabo kit traps are invisible to enemies)";
    shadeBox.appendChild(shadeBoxText);
    shadeBox.appendChild(document.createElement('br'));
    shadeBox.appendChild(shadeBoxLine1);
    shadeBox.appendChild(document.createElement('br'));
    shadeBox.appendChild(shadeBoxLine2);
    shadeBox.appendChild(document.createElement('br'));
    shadeBox.appendChild(shadeBoxLine3);
    shadeBox.appendChild(document.createElement('br'));
    shadeBox.appendChild(shadeBoxLine4);

    controlBox.style.fontSize = "16px";

    modalRow1.appendChild(vampireButton);
    modalRow1.appendChild(shadeButton);
    modalRow2.appendChild(vampireBox);
    modalRow2.appendChild(shadeBox);
    modalRow3.appendChild(controlBox);
    modal.appendChild(modalRow0);
    modal.appendChild(modalRow1);
    modal.appendChild(modalRow2);
    modal.appendChild(modalRow3);
    body.appendChild(modal);
}

function pickShade () {
    window.character = "hatman";
    sendId();
}

function pickBloodWizard () {
    window.character = "vampire";
    sendId();
}

function createStatBarInternal (node) {
    const internals = document.createElement('div');
    const regenRate = document.createElement('div');
    const remaining = document.createElement('div');
    internals.style.display = "flex";
    internals.style.justifyContent = "space-between";
    internals.style.padding = "0 1rem";
    internals.style.width = "218px";
    regenRate.id = node.id + "Regen";
    regenRate.style.color = "white";
    remaining.id = node.id + "Remaining";
    remaining.style.color = "white";
    internals.appendChild(remaining);
    internals.appendChild(regenRate);
    node.appendChild(internals);
    node.style.display = "flex";
    node.style.flexDirection = "column";
    node.style.justifyContent = "center";
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
        statCard.style.top = 10;
        statCard.style.left = 10;
        // statCard.style.backgroundImage = "url(../assets/images/scroll.png)";




        const healthBar = document.createElement('div');
            healthBar.style.backgroundColor = "red";
            healthBar.className = "statBar";
            healthBar.id = "healthBar";
            createStatBarInternal(healthBar);

        const healthBarBorder = document.createElement('div');
            healthBarBorder.className = "statBarBorder";
            healthBarBorder.style.marginTop = "1rem";

        healthBarBorder.appendChild(healthBar);

        const manaBar = document.createElement('div');
            manaBar.style.backgroundColor = "blue";
            manaBar.className = "statBar";
            manaBar.id = "manaBar";
            createStatBarInternal(manaBar);

        const manaBarBorder = document.createElement('div');
            manaBarBorder.className = "statBarBorder";

        manaBarBorder.appendChild(manaBar);

        const staminaBar = document.createElement('div');
            staminaBar.style.backgroundColor = "green";
            staminaBar.className = "statBar";
            staminaBar.id = "staminaBar";
            createStatBarInternal(staminaBar);

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
        dX = data.screenX;
        dY = data.screenY;
    });
    bag.addEventListener('dragend', (data) => {
        dX = data.screenX - dX;
        dY = data.screenY - dY;
        bag.style.top = Number(bag.style.top.replace("px", "")) + dY;
        bag.style.left = Number(bag.style.left.replace("px", "")) + dX;
    });
    const body = document.body;
    body.appendChild(bag);
};

function destroyMenu () {
    const menu = document.getElementById("menuModal");
    menu.remove();
}

function sendId () {
    audio.play();
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

window.switchRoom = function (port) {
    window.webSocketPort = port;
    window.game.destroy();
    window.game = new Phaser.Game(config);
    console.log("room switch");
}

function startGame () {
    const background = document.body;
    const gameWindow = document.createElement("canvas");
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
    // window.createItemContainer([1,2,3]);
    window.createCharacterStats();
    config = {
        type: Phaser.CANVAS,
        parent: 'phaser-example',
        width: 800,
        height: 800,
        scene: [ Example ],
//        roundPixels: true,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
            }
        },
        pixelArt: true,
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
    window.game = new Phaser.Game(config);
}

