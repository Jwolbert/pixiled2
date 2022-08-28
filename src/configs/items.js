import selfRef from "./items.js"

export default {
    devRing: {
        name: "devRing",
        equip() {
            this.manaRegen += 5;
            this.staminaRegen += 5;
            this.healthRegen += 1;
            return selfRef.devRing;
        },
    }
}