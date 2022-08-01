const port = 4444;
const debug = false; // DEBUGGGGGGG

const { fork } = require('child_process');

const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());


let clients = [];
let currentWebsocketPort = 3333;

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
    }
    const message = {};
    message.webSocketPort = 3333;
    message.numClients = clients.length;
    res.send(JSON.stringify(message));
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
});