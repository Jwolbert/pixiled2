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
        particleName: "bloodOrbParticles_particles",
        particleSheet: "bloodOrbParticles",
        selfTarget: false,
        apply(attack) {
            if (!attack) return;
            const direction = attack.direction * -1;
            this.velocityX = Math.cos(direction);
            this.velocityY = Math.sin(direction);
            this.gameObject.setVelocityX(this.velocityX * attack.speed);
            this.gameObject.setVelocityY(this.velocityY * attack.speed);
            this.gameObject.setBounce(attack.bounce, attack.bounce);
            this.gameObject.setAlpha(0.5);
            this.gameObject.stop();
            this.speed = attack.speed;
            this.blockMovement = true;
        },
        tick() {

        },
        expire() {
            this.gameObject.setBounce(0, 0);
            this.gameObject.setAlpha(1);
            this.blockMovement = false;
            this.speed = this.defaultSpeed;
        },
        duration: 50,
    },
    bitten: {
        id: "bitten",
        name: "bitten",
        reApply: true,
        selfTarget: false,
        apply() {
            this.hp -= 50;
        },
        tick() {

        },
        expire() {

        },
        duration: 1,
    },
    shot: {
        id: "shot",
        name: "shot",
        reApply: true,
        selfTarget: false,
        apply() {
            this.hp -= 9;
        },
        tick() {

        },
        expire() {

        },
        duration: 1,
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
            this.hp -= 20;
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
            this.hp -= 1.5;
        },
        expire() {
        },
        duration: 30,
    },
    fade: {
        id: "fade",
        name: "fade",
        // particleName: "bloodOrbParticles_particles",
        // particleSheet: "bloodOrbParticles",
        selfTarget: true,
        cancelOnAttack: true,
        apply() {
            this.speed += 25;
            window.SoundManager.play("fade");
            this.hidden = true;
        },
        tick() {
            this.gameObject.alpha -= 0.1;
            this.stamina += 1;
        },
        expire() {
            this.gameObject.setAlpha(1);
            this.speed = this.defaultSpeed;
            this.abilityCooldown = 500;
            this.hidden = false;
        },
        duration: 200,
    },
    bloodForm: {
        id: "bloodForm",
        name: "bloodForm",
        particleName: "bloodOrbParticles_particles",
        particleSheet: "bloodOrbParticles",
        selfTarget: true,
        requiresMana: true,
        cancelOnAttack: true,
        apply() {
            this.gameObject.setAlpha(0);
            this.gameObject.stop();
            this.speed += 75;
            this.silent = true;
            window.SoundManager.play("bloodForm");
        },
        tick() {
            this.mana -= 5;
        },
        expire() {
            this.speed = this.defaultSpeed;
            this.gameObject.setAlpha(1);
            if (this.mana < 0) this.mana = 0;
            this.silent = false;
        },
        duration: 200,
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