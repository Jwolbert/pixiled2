export default {
    bleed: {
        id: "bleed",
        name: "bleed",
        selfTarget: false,
        apply() {
            this.gameObject.setTint(0xff0000);
            this.speed += 10;
            this.hp -= 1;
        },
        tick() {
            this.hp -= 1;
        },
        expire() {
            this.speed -= 10;
        },
        duration: 5,
    },
    ignited: {
        id: "ignited",
        name: "ignited",
        selfTarget: false,
        apply() {
            this.gameObject.setTint(0xff0000);
            this.speed += 20;
            this.hp -= 1;
        },
        tick() {
            this.hp -= 1;
        },
        expire() {
            this.speed -= 20;
        },
        duration: 5,
    },
    drained: {
        id: "drained",
        name: "drained",
        selfTarget: false,
        apply() {
            this.gameObject.setTint(0xff0000);
            this.hp -= 5;
        },
        tick() {

        },
        expire() {

        },
        duration: 1,
    },
    poisoned: {
        id: "poisoned",
        name: "poisoned",
        selfTarget: true,
        particleName: "poisonOrbParticles_particles",
        particleSheet: "poisonOrbParticles",
        apply() {

        },
        tick() {
            this.hp -= 3;
        },
        expire() {
        },
        duration: 5,
    },
    chilled: {
        id: "chilled",
        name: "chilled",
        selfTarget: false,
        particleName: "iceOrbParticles_particles",
        particleSheet: "iceOrbParticles",
        apply() {
            console.log("APPLY", this.gameObject);
            this.gameObject.setTint(0xff0000);
            this.speed -= 20;
            this.hp -= 10;
        },
        tick() {

        },
        expire() {
            this.speed += 20;
        },
        duration: 3,
    },
};