export default {
    teleport: {
        id: "slashing",
        name: "slashing",
        selfTarget: false,
        apply(attack) {
            window.switchRoom(window.port)
        },
        tick() {
            this.hp -= 1;
        },
        expire() {
            this.gameObject.setBounce(0, 0);
            this.blockMovement = false;
        },
        duration: 5,
    },
    slashing: {
        id: "slashing",
        name: "slashing",
        selfTarget: false,
        apply(attack) {
            const direction = attack.direction * -1;
            this.velocityX = Math.cos(direction);
            this.velocityY = Math.sin(direction);
            this.gameObject.setVelocityX(this.velocityX * attack.speed);
            this.gameObject.setVelocityY(this.velocityY * attack.speed);
            this.gameObject.setBounce(attack.bounce, attack.bounce);
            this.speed = attack.speed;
            this.blockMovement = true;
        },
        tick() {
            this.hp -= 1;
        },
        expire() {
            this.gameObject.setBounce(0, 0);
            this.blockMovement = false;
            this.speed = this.defaultSpeed;
        },
        duration: 5,
    },
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
        reApply: true,
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