let previousTime = new Date().getTime();
let debugCounter = 0;
const debugFrequency = 500;
let debugData = {};

const profile = () => {
    if (debugCounter++ > debugFrequency) {
        const currentTime = new Date().getTime();
        const diffSec = (currentTime - previousTime) / 1000;
        previousTime = currentTime;
        console.log(`Update rate: ${(debugFrequency / diffSec).toFixed(2)} updates per second`);
        debugCounter = 0;

        const fps = document.querySelector("#fpsMeter");
        fps.textContent = `Frame rate: ${(debugFrequency / diffSec).toFixed(2)} updates per second`;

        if (debugData.websocketUpdates) {
            const websocketUpdates = document.querySelector("#websocketUpdates");
            websocketUpdates.textContent = `Server update rate: ${(debugData.websocketUpdates / diffSec).toFixed(2)} updates per second`;
            debugData.websocketUpdates = 0;
        }

        if (debugData.serverRequestsHandledPerSec) {
            const webserverRequests = document.querySelector("#webserverRequests");
            webserverRequests.textContent = `Server processing rate: ${debugData.serverRequestsHandledPerSec.toFixed(2)} requests per second`;
            debugData.websocketUpdates = 0;
        }
    }
};

const setDebugData = (data) => {
    debugData = data;
};

export { profile, setDebugData };