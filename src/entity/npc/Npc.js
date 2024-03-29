import Entity from "../Entity";
import NpcMap from "./NpcMap";
import NpcVelocityControls from "../../controls/NpcVelocityControls";
import NpcAttackControls from "../../controls/NpcAttackControls";
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
    maxHealth = 30;
    maxMana = 100;
    maxStamina = 100;
    manaRegen = 0.3;
    healthRegen = 0.1;
    staminaRegen = 0.5;
    regenCounter = 0;
    regenRate = 1;
    hp = 30;
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
    defaultSpeed = 50;
    input;
    npcMap;
    targetEntity;
    owner;

    constructor (name, gameObject, scene, interactions, priority, owner)
    {
        super(name, gameObject, undefined, scene, interactions, priority);
        this.owner = scene.entities[owner];
        this.controls = {};
        this.npcMap = new NpcMap(scene, this);
        this.npcMap.setTarget(undefined);
        this.controls.velocity = new NpcVelocityControls(gameObject, this.npcMap, scene, priority);
        this.controls.attack = new NpcAttackControls(scene.player, this);
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
        this.targetEntity = scene.player;
        if (this.owner) {
            this.controls.velocity.setBehavior("follow", this.owner);
            this.controls.attack.setBehavior("passive");
        } else {
            this.controls.velocity.setBehavior("random");
            this.controls.attack.setBehavior("passive");
        }
    }

    addEffect (effect, addon) {
        if (effect.source !== this.id) {
            this.targetEntity = this.scene.entities[effect.source];
            this.controls.attack.setBehavior("aggressive");
            this.controls.velocity.setBehavior("follow", this.scene.entities[effect.source]);
        }
        super.addEffect(effect, addon);
    }


    goAggressive (id) {
        this.targetEntity = this.scene.entities[id];
        this.controls.attack.setBehavior("aggressive");
        this.controls.velocity.setBehavior("follow", this.scene.entities[id]);
    }

    initPlayerPosition (JSON) {
        this.gameObject.x = JSON.x;
        this.gameObject.y = JSON.y;
    }

    update () {
        if (this.targetEntity && this.targetEntity?.hidden) {
            this.controls.attack.setBehavior("passive");
            this.controls.velocity.setBehavior("random");
        }
        this.velocityInput();
        this.attackInput();
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
        this.npcMap.destroy();
        super.destroy();
    }

    velocityInput () {
        const input = this.controls.velocity.get();
        this.velocityX = input.velocityX * this.speed;
        this.velocityY = input.velocityY * this.speed;
    }

    attackInput () {
        if (this.attackCooldown > 0) {
            this.attackCooldown -= 1;
            return;
        }
        this.input = this.controls.attack.get();
        if (!this.input) {
            return;
        }
        this.attack();
    }

    attack (notFake) {
        // notFake is an entity id, lol
        if (!this.input) return;
        if (notFake && notFake !== this.targetEntity?.id) {
            return;
        }
        // this.weapon = input.button === "left" ? this.primaryWeapon : this.secondaryWeapon;
        if (notFake && this.mana < this.weapon.manaCost || this.stamina < this.weapon.staminaCost || this.hp < this.weapon.healthCost) return;
        if (false) {
            if (this.abilityActive) {
                super.removeEffect(this.ability.name);
                this.abilityActive = false;
            }
        }
        if (notFake) {
            this.mana -= this.weapon.manaCost;
            this.stamina -= this.weapon.staminaCost;
            this.hp -= this.weapon.healthCost;
        }
        this.attackCooldown = this.weapon.attackCooldown;
        const location = {x: this.gameObject.x + this.input.location.x, y: this.gameObject.y + this.input.location.y};
        this.currentAction = {
            ...this.weapon.action,
            direction: this.input.direction,
            location: location,
            source: this.id,
            fake: !(!!notFake),
            fakeCallback: (hitId) => {
                this.controls.velocity.setBehavior("follow", this.scene.entities[hitId]);
                this.attack(hitId);
            },
        };
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