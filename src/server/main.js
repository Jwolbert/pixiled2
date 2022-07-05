const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');

const port = 3334;

const wss = new WebSocket.Server({server: server});

let numberOfClients = 0;

function bringOutYourDead(entities) {
    const d34dB33f = [];
    Object.values(entities).forEach((entity) => {
        if (entity.dead) {
            delete entities[entity.id];
            d34dB33f.push(entity.id);
        }
    });
    return d34dB33f;
}

wss.on('connection', (ws) => {
    if(numberOfClients++ === 0) {
        console.log("First gamer connected!");
        wss.state = {};
        wss.state.data = {};
        wss.state.entities = {};
        wss.state.deadEntities = {};
    }

    console.log('Client connected!');
    console.log("Number of clients: " + numberOfClients);

    ws.on('message', function incoming(message) {
        message = JSON.parse(message);
        if (message.entities) {
            Object.keys(message.entities).forEach((id) => {
                if (!wss.state.entities[id]) {
                    if (ws.owner === undefined) {
                        ws.owner = id;
                        console.log("owner: " + ws.owner);
                    }
                    console.log(`owner ${ws.owner} adding ${id}`);
                    message.entities[id].owner = ws.owner;
                    wss.state.entities[id] = message.entities[id];
                } else if (wss.state.entities[id].owner === ws.owner) {
                    message.entities[id].owner = ws.owner;
                    wss.state.entities[id] = message.entities[id];
                }
            });
        }
        ws.send(JSON.stringify(wss.state));
    });
});


app.get('/', (req, res) => res.send('Hello world!'));

server.listen(port, () => console.log('Listening on port 3334'));
