const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');
const port = 3334;
const wss = new WebSocket.Server({server: server});
const debug = true;

let numberOfClients = 0;

wss.on('connection', (ws) => {
    if(numberOfClients++ === 0) {
        console.log("First gamer connected!");
        wss.state = {};
        wss.state.data = {};
        wss.state.entities = {};
        wss.state.deadEntities = {};
        wss.state.entitiesInteracted = [];
        let previousTime = new Date().getTime();
        setInterval(() => {
            if (debug) {
                wss.state.totalUpdates++;
            }
            wss.clients.forEach((client) => {
                client.send(JSON.stringify(wss.state));
            });
            wss.state.entitiesInteracted.forEach((id) => {
                wss.state.entities[id].receivedInteractions = [];
            });
        }, 30);

        if (debug) {
            console.log("debugging enabled");
            wss.requestsHandled = 0;
            wss.state.totalUpdates = 0;
            setInterval(() => {
                const currentTime = new Date().getTime();
                const diffSec = (currentTime - previousTime) / 1000;
                previousTime = currentTime;
                wss.state.requestsHandledPerSec = wss.requestsHandled / diffSec;
                wss.requestsHandled = 0;
            }, 5000);
        }
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
                    if (wss.state.entities[id].receivedInteractions) {
                        message.entities[id].receivedInteractions = wss.state.entities[id].receivedInteractions;
                        wss.state.entitiesInteracted.push(id);
                    }
                    wss.state.entities[id] = message.entities[id];
                }
            });
        }
        if (message.interactions) {
            message.interactions.forEach((i) => {
                console.log(i);
                if (!wss.state.entities[i.target].receivedInteractions) {
                    wss.state.entities[i.target].receivedInteractions = [];
                }
                wss.state.entities[i.target].receivedInteractions.push(i);
            });
        }
        wss.requestsHandled++;
    });
});


app.get('/', (req, res) => res.send('Hello world!'));

server.listen(port, () => console.log('Listening on port 3334'));
