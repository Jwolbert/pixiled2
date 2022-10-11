import selfRef from "./items.js"

export default {
    devRing: {
        name: "devRing",
        equip() {
            this.speed += 200;
            this.manaRegen += 5;
            this.staminaRegen += 5;
            this.healthRegen += 0;
            return selfRef.devRing;
        },
    },
    bloodChalice: {
        name: "bloodChalice",
        equip() {
            this.manaRegen += 0.2;
            this.staminaRegen += 2;
            this.healthRegen += 0.1;
            return selfRef.bloodChalice;
        },
    },
}