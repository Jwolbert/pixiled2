export default function (listOfNames) {
    const animationConfig = {
        key: 'down',
        yoyo: false,
        repeat: -1,
        frameRate: 6,
    }
    const pathMap = require(`../../assets/nameToPathMap.json`);

    listOfNames.forEach((name) => {
        const path = pathMap[name];
        const data = require(`../../assets/json/${path}.json`);
        Object.keys(data[name].animations).forEach((animation) => {
            console.log('animation name', name + "_" + animation)
            const config = {
                key: name + "_" + animation,
                frames: this.anims.generateFrameNumbers(path, data[name].animations[animation]),
                frameRate: animationConfig.frameRate,
                yoyo: animationConfig.yoyo,
                repeat: animationConfig.repeat
            };
            this.anims.create(config);
        });
    });
};