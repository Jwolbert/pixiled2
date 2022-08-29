const ServerEntity = require("./ServerEntity");

class ServerPlayer extends ServerEntity {

    controls;
    weapon;
    attackCooldown;
    weaponIndex = 0;
    equipped = {
        weapons: [],
        items: [],
        clothing: [],
    }
    maxHealth = 100;
    maxMana = 100;
    maxStamina = 100;
    manaRegen = 0.2;
    healthRegen = 0.1;
    staminaRegen = 0.1;
    regenCounter = 0;
    regenRate = 1;
    roundingConstant = 1000;

    constructor (name, id) {
        super(name, id);
    }
}

module.exports = ServerPlayer;