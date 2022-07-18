let previousTime = new Date().getTime();
let debugCounter = 0;
const debugFrequency = 60;
let lastServerTick = 0;
let debugData = {};
let entities;

const profile = () => {
    if (debugCounter++ > debugFrequency) {
        const currentTime = new Date().getTime();
        const diffSec = (currentTime - previousTime) / 1000;
        previousTime = currentTime;
        debugCounter = 0;

        const fps = document.querySelector("#fpsMeter");
        fps.textContent = `Frame rate: ${(debugFrequency / diffSec).toFixed(2)} frames per second`;

        if (debugData.websocketUpdates) {
            const websocketUpdates = document.querySelector("#websocketUpdates");
            websocketUpdates.textContent = `Client update rate: ${(debugData.websocketUpdates / diffSec).toFixed(2)} updates per second`;
            debugData.websocketUpdates = 0;
        }

        if (debugData.websocketMessagesSent) {
            const websocketMessagesSent = document.querySelector("#websocketMessages");
            websocketMessagesSent.textContent = `Client send rate: ${(debugData.websocketMessagesSent / diffSec).toFixed(2)} messages per second`;
            debugData.websocketMessagesSent = 0;
        }

        if (debugData.serverRequestsHandledPerSec) {
            const webserverRequests = document.querySelector("#webserverRequests");
            webserverRequests.textContent = `Server processing rate: ${debugData.serverRequestsHandledPerSec.toFixed(2)} requests per second`;
        }

        if (debugData.lastServerUpdate) {
            const webserverLastUpdate = document.querySelector("#webserverLastUpdate");
            webserverLastUpdate.textContent = `Last server tick received: #${debugData.lastServerUpdate}`;
            if (lastServerTick > debugData.lastServerUpdate) {
                
            }
        }

        if (entities) {
            const entityList = document.querySelector("#entityList");
            while (entityList.firstChild) {
                entityList.removeChild(entityList.firstChild);
            }
            Object.keys(entities).forEach((id) => {
                const entityNode = document.createElement("div");
                entityNode.textContent = `ID: ${id.split("-")[0]} HP: ${entities[id].hp}`
                entityList.appendChild(entityNode);
            });
        }
    }
};

const setDebugData = (data) => {
    debugData = data;
};

const setEntities = (data) => {
    entities = data;
};

export { profile, setDebugData, setEntities };