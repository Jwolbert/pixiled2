import PlayerVelocityControls from "../../controls/PlayerVelocityControls";
import PlayerAttackControls from "../../controls/PlayerAttackControls";
import PlayerInventoryControls from "../../controls/PlayerInventoryControls";
import Entity from "../Entity";
import weapons from "../../configs/weapons";
export default class Player extends Entity {
    controls;
    weapon;
    attackCooldown;
    weaponIndex = 0;
    equipped = {
        weapons: [],
        items: {},
        clothing: {},
    }
    maxHealth = 100;
    maxMana = 100;
    maxStamina = 100;
    manaRegen = 1;
    healthRegen = 1;
    staminaRegen = 2;
    regenCounter = 0;
    regenRate = 20;

    constructor (name, gameObject, input, scene)
    {
        super(name, gameObject, window.id, scene);
        this.controls = {};
        this.controls.velocity = new PlayerVelocityControls(input);
        this.controls.attack = new PlayerAttackControls(input);
        this.controls.inventory = new PlayerInventoryControls(input);
        this.type = "player";
        this.weapon = weapons["poisonOrbScroll"];
        // this.equipped.weapons.push(weapons["poisonOrbScroll"]);
        // this.equipped.weapons.push(weapons["iceOrbScroll"]);
        this.equipped.weapons = Object.values(weapons);
        console.log(this.equipped.weapons);
        this.attackCooldown = this.weapon.cooldown;
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
            if (this.mana < this.weapon.manaCost || this.stamina < this.weapon.staminaCost) return;
            this.mana -= this.weapon.manaCost;
            this.stamina -= this.weapon.staminaCost;
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
            this.health += this.healthRegen;
            this.stamina += this.staminaRegen;
            this.regenCounter = 0;
        }
        this.mana = Math.min(this.maxMana, this.mana);
        this.hp = Math.min(this.maxHealth, this.hp);
        this.stamina = Math.min(this.maxStamina, this.stamina);

        const healthBar = document.querySelector("#healthBar");
            healthBar.style.width = this.hp + "%";

        const manaBar = document.querySelector("#manaBar");
            manaBar.style.width = this.mana + "%";

        const staminaBar = document.querySelector("#staminaBar");
            staminaBar.style.width = this.stamina + "%";
    }
}