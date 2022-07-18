const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');
const port = 3334;
const wss = new WebSocket.Server({server: server});
const debug = true;
const debugInterval = 1000;

const serverTickInterval = 17;

let numberOfClients = 0;

wss.on('connection', (ws) => {
    if(numberOfClients++ === 0) {
        console.log("First gamer connected!");
        wss.state = {};
        wss.state.entities = {};
        wss.entitiesInteracted = [];
        let previousTime = new Date().getTime();
        setInterval(() => {
            if (debug) {
                wss.state.totalUpdates++;
            }
            wss.clients.forEach((client) => {
                client.send(JSON.stringify(wss.state));
            });
            // clean up
            wss.entitiesInteracted.forEach((id) => {
                if (wss.state.entities[id]) {
                    wss.state.entities[id].receivedInteractions = [];
                }
            });
            // TODO: this array might be able to be removed bc websockets no longer send objects owner by another client
            const deadEntities = {};
            Object.keys(wss.state.entities).forEach((id) => {
                if (wss.state.entities[id].dead && !wss.state.entities[id].cleaned) {
                    deadEntities[id] = wss.state.entities[id];
                    wss.state.entities[id].cleaned = true;
                }
            });
            // TODO: same story for this timeout
            setTimeout(() => {
                Object.keys(deadEntities).forEach((id) => {
                    delete wss.state.entities[id];
                });
            }, 2000);
        }, serverTickInterval);

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
            }, debugInterval);
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
                        console.log("owner " + ws.owner.split("-")[0]);
                    }
                    console.log(`owner ${ws.owner.split("-")[0]} adding ${id.split("-")[0]}`);
                    message.entities[id].owner = ws.owner;
                    wss.state.entities[id] = message.entities[id];
                } else if (wss.state.entities[id].owner === ws.owner) {
                    message.entities[id].owner = ws.owner;
                    if (wss.state.entities[id].receivedInteractions) {
                        message.entities[id].receivedInteractions = wss.state.entities[id].receivedInteractions;
                        wss.entitiesInteracted.push(id);
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
