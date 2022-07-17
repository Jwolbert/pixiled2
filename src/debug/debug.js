let previousTime = new Date().getTime();
let debugCounter = 0;
const debugFrequency = 500;

const profile = () => {
    if (debugCounter++ > debugFrequency) {
        const currentTime = new Date().getTime();
        const diffSec = (currentTime - previousTime) / 1000;
        previousTime = currentTime;
        console.log(`Update rate: ${debugFrequency / diffSec} updates per second`);
        debugCounter = 0;
    }
};

export { profile };