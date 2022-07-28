let previousTime = new Date().getTime();
let debugCounter = 0;
const debugFrequency = 60;
let lastServerTick = 0;
let frameRateMin = 60;
let frameRateCounter = 0;
let debugData = {};
let entities;

const profile = () => {
    if (debugCounter++ > debugFrequency) {
        const currentTime = new Date().getTime();
        const diffSec = (currentTime - previousTime) / 1000;
        previousTime = currentTime;
        debugCounter = 0;

        const fps = document.querySelector("#fpsMeter");
        const frameRate = debugFrequency / diffSec;
        if (frameRateCounter++ > 10) {
            frameRateCounter = 0;
            frameRateMin = 60;
        }
        if (frameRateMin > frameRate) {
            frameRateMin = frameRate;
        }
        fps.textContent = `Frame rate: ${frameRate.toFixed(2)}/${frameRateMin.toFixed(2)} frames per second`;

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
        }

        if (entities) {
            const entityList = document.querySelector("#entityList");
            while (entityList.firstChild) {
                entityList.removeChild(entityList.firstChild);
            }
            Object.keys(entities).forEach((id) => {
                const entityNode = document.createElement("div");
                entityNode.textContent = `ID: ${id.split("-")[0]} HP: ${entities[id].hp} TYPE: ${entities[id].type}`
                entityList.appendChild(entityNode);
            });
        }

        if (debugData.fogOfWar?.time) {
            const fogOfWarTime = document.querySelector("#fogOfWarTime");
            fogOfWarTime.textContent = `Fog of war compute time: ${debugData.fogOfWar.time.toFixed(3)}`;
        }

        if (debugData.fogOfWar?.rays) {
            const fogOfWarRays = document.querySelector("#fogOfWarRays");
            fogOfWarRays.textContent = `Fog of war compute rays: ${debugData.fogOfWar.rays}`;
        }
    }
};

const setDebugData = (data) => {
    debugData = data;
};

const setEntities = (data) => {
    entities = data;
    document.querySelector("#clientId");
};

function createDebugBox() {
    const debugBox = document.createElement("div");
    debugBox.style.backgroundColor = "grey";
    debugBox.style.padding = "0.5rem";
    debugBox.style.position = "absolute";
    debugBox.style.right = "0";

    const debugTitle = document.createElement("div");
    debugTitle.textContent = "-------------------- DEBUG PANEL --------------------";
    debugBox.appendChild(debugTitle);
    debugBox.appendChild(document.createElement("br"));

    const clientId = document.createElement("div");
    clientId.id = "clientId";
    clientId.textContent = `Client ID: ${this.player.id.split("-")[0]}`;
    debugBox.appendChild(clientId);
    debugBox.appendChild(document.createElement("br"));

    const netStats = document.createElement("div");
    netStats.id = "netStats";
    netStats.textContent = "-------------------- NET STATS -------------------------";
    debugBox.appendChild(netStats);
    debugBox.appendChild(document.createElement("br"));

    const fps = document.createElement("div");
    fps.id = "fpsMeter";
    debugBox.appendChild(fps);

    const websocketUpdates = document.createElement("div");
    websocketUpdates.id = "websocketUpdates";
    debugBox.appendChild(websocketUpdates);

    const websocketMessagesSent = document.createElement("div");
    websocketMessagesSent.id = "websocketMessages";
    debugBox.appendChild(websocketMessagesSent);

    const webserverRequests = document.createElement("div");
    webserverRequests.id = "webserverRequests";
    debugBox.appendChild(webserverRequests);

    const webserverLastUpdate = document.createElement("div");
    webserverLastUpdate.id = "webserverLastUpdate";
    debugBox.appendChild(webserverLastUpdate);
    debugBox.appendChild(document.createElement("br"));

    const entityListTitle = document.createElement("div");
    entityListTitle.id = "entityListTitle";
    entityListTitle.textContent = "-------------------- ENTITY LIST -----------------------";
    debugBox.appendChild(entityListTitle);
    debugBox.appendChild(document.createElement("br"));

    const entityList = document.createElement("div");
    entityList.id = "entityList";
    debugBox.appendChild(entityList);
    debugBox.appendChild(document.createElement("br"));

    const fogOfWarTitle = document.createElement("div");
    fogOfWarTitle.id = "fogOfWarTitle";
    fogOfWarTitle.textContent = "-------------------- FOG OF WAR -----------------------";
    debugBox.appendChild(fogOfWarTitle);
    debugBox.appendChild(document.createElement("br"));

    const fogOfWarTime = document.createElement("div");
    fogOfWarTime.id = "fogOfWarTime";
    debugBox.appendChild(fogOfWarTime);

    const fogOfWarRays = document.createElement("div");
    fogOfWarRays.id = "fogOfWarRays";
    debugBox.appendChild(fogOfWarRays);
    debugBox.appendChild(document.createElement("br"));

    const background = document.body;
    background.appendChild(debugBox);
};

export { profile, setDebugData, setEntities, createDebugBox };