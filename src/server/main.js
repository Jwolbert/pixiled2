const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');

const port = 3334;

const wss = new WebSocket.Server({server: server});

let numberOfClients = 0;

wss.on('connection', (ws) => {
    wss.state = {};
    wss.state.data = {};
    wss.state.entities = {};
    console.log('Client connected!');

    if(numberOfClients === 0) {
        setInterval(() => {
            console.log(wss.state.entities);
            wss.clients.forEach((client) => {
                client.send(JSON.stringify(wss.state));
            });
        }, 5000);
    }

    console.log("Number of clients: " + ++numberOfClients);

    ws.on('message', function incoming(message) {
        message = JSON.parse(message);
        if (message.entities) {
            wss.state.entities = {
                ...wss.state.entities,
                ...message.entities,
            };
        }
    });
});

app.get('/', (req, res) => res.send('Hello world!'));

server.listen(port, () => console.log('Listening on port 3334'));
