import Entity from "../Entity";
import NpcMap from "./NpcMap";
import NpcVelocityControls from "../../controls/NpcVelocityControls";
import characters from "../../configs/characters";

export default class Npc extends Entity {
    controls;
    weapon;
    primaryWeapon;
    secondaryWeapon;
    attackCooldown = 0;
    weaponIndex = 0;
    equipped = {
        weapons: [],
        items: [],
        clothing: [],
    }
    maxHealth = 100;
    maxMana = 100;
    maxStamina = 100;
    manaRegen = 0.3;
    healthRegen = 0.1;
    staminaRegen = 0.5;
    regenCounter = 0;
    regenRate = 1;
    roundingConstant = 1000;
    blockMovement = false;
    blockMovementCounter = 0
    blockMovementCounterMax = 50;
    blockMovementEffectName = null;
    walkingInterval = undefined;
    ability = undefined;
    abilityActive = false;
    abilityCooldown = 0;
    silent = false;
    speed = 50;

    constructor (name, gameObject, scene, interactions)
    {
        super(name, gameObject, undefined, scene, interactions);
        this.controls = {};
        this.controls.velocity = new NpcVelocityControls(gameObject, new NpcMap(scene, this));
        // this.controls.attack = new PlayerAttackControls(input);
        // this.controls.inventory = new PlayerInventoryControls(input);
        // this.controls.ability = new PlayerAbilityControls(input);
        this.type = "npc";
        this.primaryWeapon = characters[this.name].weapons[0];
        this.secondaryWeapon = characters[this.name].weapons[1];
        this.weapon = this.primaryWeapon;
        characters[this.name].items.forEach((item) => {
            this.equipped.items.push(item.equip.call(this));
        });
        this.equipped.weapons = characters[this.name].weapons;
        this.ability = characters[this.name].ability;
    }

    initPlayerPosition (JSON) {
        this.gameObject.x = JSON.x;
        this.gameObject.y = JSON.y;
    }

    update () {
        this.velocityInput();
        // this.attackInput();
        // this.inventoryInput();
        // this.abilityInput();
        let direction = Math.atan( this.velocityY / this.velocityX);
        if (this.velocityX < 0) {
            direction += Math.PI;
        } else if (this.velocityX >= 0 && this.velocityY < 0) {
            direction += Math.PI * 2;
        }
        if (isNaN(direction)) {
            this.setAnimation('wait');
        } else if (direction >= Math.PI * (7 / 4) || direction <= Math.PI / 4) {
            this.setAnimation('right');
        } else if (direction > Math.PI / 4 && direction < Math.PI * (3 / 4)) {
            this.setAnimation('down');
        } else if (direction >= Math.PI * (3 / 4) && direction <= Math.PI * (5 / 4)) {
            this.setAnimation('left');
        } else if (direction > Math.PI * (5 / 4) && direction < Math.PI * (7 / 4)) {
            this.setAnimation('up');
        }
        if (this.currentAnimation !== 'wait' && !this.walkingInterval && !this.blockMovement && !this.silent) {
            window.SoundManager.play('step');
            this.walkingInterval = setInterval(() => {
                window.SoundManager.play('step');
            }, 500);
        } else if (this.currentAnimation === 'wait' || this.blockMovement || this.silent) {
            clearInterval(this.walkingInterval);
            this.walkingInterval = undefined;
        }
        super.update();
        this.updateStats();
        if (characters[this.name].visible && this.gameObject.alpha < 0.25) {
            this.gameObject.alpha = 0.25;
        }
    }
    destroy () {
        clearInterval(this.walkingInterval);
        super.destroy();
    }

    velocityInput () {
        const input = this.controls.velocity.get();
        // if (this.blockMovement && !(input.velocityX + input.velocityY)) {
        //     this.blockMovementCounter++;
        //     this.velocityX = this.gameObject.body.velocity.x;
        //     this.velocityY = this.gameObject.body.velocity.y;
        //     return;
        // }
        // if(this.blockMovement && this.blockMovementCounter++ < this.blockMovementCounterMax) {
        //     return;
        // } else if (this.blockMovement && (input.velocityX + input.velocityY) !== 0) {
        //     this.debounce();
        // }

        this.velocityX = input.velocityX * this.speed;
        this.velocityY = input.velocityY * this.speed;
    }

    debounce () {
        super.removeEffect(this.blockMovementEffectName);
        this.gameObject.setBounce(0, 0);
        this.blockMovement = false;
        this.blockMovementCounter = 0;
        this.speed = this.defaultSpeed;
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
    }
};