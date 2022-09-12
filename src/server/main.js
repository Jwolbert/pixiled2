const port = 4444;
const debug = false; // DEBUGGGGGGG

const { fork } = require('child_process');

const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const Player = require("./ServerPlayer.js")
const app = express();
app.use(cors());
app.use(bodyParser.json());


const clients = [];
let currentWebsocketPort = 3333;

const rooms = [];

app.post('/joinGame', (req, res) => {
    const { clientId } = req.body;
    if (clientId) {
        clients.push(clientId);
    }
    if (currentWebsocketPort === 3333){
        const child = fork('room.js', { env: { port: currentWebsocketPort++ } });
        child.on('message', (message) => {
            console.log(message);
        });
        child.on('exit', () => {
            console.log("room closed");
            currentWebsocketPort = 3333;
            rooms.length = 0;
        });
        child.on('error', (e) => {
            console.log(e); 
            console.log("room closed - error");
            currentWebsocketPort = 3333;
            rooms.length = 0;
        });
        const message = {};
        const player = new Player('hatman');
        player.updateWithJSON({id: clientId});
        message.player = player;
        child.send(message);
        rooms.push(child);
    } else {
        const message = {};
        const player = new Player('hatman');
        player.updateWithJSON({id: clientId});
        message.player = player;
        rooms[0].send(message);
    }
    const message = {};
    message.webSocketPort = 3333;
    message.numClients = clients.length;
    setTimeout(() => {
        res.send(JSON.stringify(message));
    }, 1000);
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
});