import PlayerVelocityControls from "../../controls/PlayerVelocityControls";
import PlayerAttackControls from "../../controls/PlayerAttackControls";
import PlayerInventoryControls from "../../controls/PlayerInventoryControls";
import Entity from "../Entity";
import items from "../../configs/items"
import weapons from "../../configs/weapons";
export default class Player extends Entity {
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

    constructor (name, gameObject, input, scene)
    {
        super(name, gameObject, window.id, scene);
        this.controls = {};
        this.controls.velocity = new PlayerVelocityControls(input);
        this.controls.attack = new PlayerAttackControls(input);
        this.controls.inventory = new PlayerInventoryControls(input);
        this.type = "player";
        this.weapon = weapons["poisonOrbScroll"];
        this.equipped.items.push(items.devRing.equip.call(this));
        // this.equipped.weapons.push(weapons["poisonOrbScroll"]);
        // this.equipped.weapons.push(weapons["iceOrbScroll"]);
        this.equipped.weapons = Object.values(weapons);
        console.log(this.equipped.weapons);
        this.attackCooldown = this.weapon.cooldown;
        console.log(scene);
    }

    destroy () {
        super.destroy();
        document.location.reload();
    }

    update () {
        this.velocityInput();
        this.attackInput();
        this.inventoryInput();
        if (this.velocityX > 0) {
            this.setAnimation('right');
        } else if (this.velocityX < 0) {
            this.setAnimation('left');
        } else if (this.velocityY > 0) {
            this.setAnimation('down');
        } else if (this.velocityY < 0) {
            this.setAnimation('up');
        } else {
            this.setAnimation('wait');
        }
        super.update();
        this.updateStats();
    }

    velocityInput () {
        const input = this.controls.velocity.get();
        this.velocityX = input.velocityX;
        this.velocityY = input.velocityY;
    }

    attackInput () {
        if (this.attackCooldown > 1) {
            this.attackCooldown -= 1;
            return;
        }
        if (this.attackCooldown > 0) {
            this.controls.attack.get();
            this.attackCooldown -= 1;
            return;
        }
        const input = this.controls.attack.get();
        if (input) {
            if (this.mana < this.weapon.manaCost || this.stamina < this.weapon.staminaCost || this.hp < this.weapon.healthCost) return;
            this.mana -= this.weapon.manaCost;
            this.stamina -= this.weapon.staminaCost;
            this.hp -= this.weapon.healthCost;
            this.attackCooldown = this.weapon.cooldown;
            const location = {x: this.gameObject.x + input.location.x, y: this.gameObject.y + input.location.y};
            this.currentAction = {
                ...this.weapon.action,
                direction: input.direction,
                location: location,
                source: this.id,
            };
        }
    }

    inventoryInput () {
        const control = this.controls.inventory.get();
        if (control) {
            this.weaponIndex += control;
            if (this.weaponIndex < 0) this.weaponIndex = this.equipped.weapons.length;
            console.log(this.weaponIndex, control);
            this.weapon = this.equipped.weapons[this.weaponIndex % this.equipped.weapons.length];
        }
    }

    updateStats () {

        if (this.regenCounter++ > this.regenRate) {
            this.mana += this.manaRegen;
            this.hp += this.healthRegen;
            this.stamina += this.staminaRegen;
            this.regenCounter = 0;
        }
        this.mana = Math.min(this.maxMana, this.mana.toFixed(2));
        this.hp = Math.min(this.maxHealth, this.hp.toFixed(2));
        this.stamina = Math.min(this.maxStamina, this.stamina.toFixed(2));

        document.querySelector("#healthBar").style.width = this.hp + "%";
        document.querySelector("#healthBarRegen").textContent = `+${this.healthRegen}`;
        document.querySelector("#healthBarRemaining").textContent = `${this.hp.toFixed(0)} / ${this.maxHealth} `;

        document.querySelector("#manaBar").style.width = this.mana + "%";
        document.querySelector("#manaBarRegen").textContent = `+${this.manaRegen}`;
        document.querySelector("#manaBarRemaining").textContent = `${this.mana.toFixed(0)} / ${this.maxMana} `;

        document.querySelector("#staminaBar").style.width = this.stamina + "%";
        document.querySelector("#staminaBarRegen").textContent = `+${this.staminaRegen}`;
        document.querySelector("#staminaBarRemaining").textContent = `${this.stamina.toFixed(0)} / ${this.maxStamina} `;
    }
}