import PlayerVelocityControls from "../../controls/PlayerVelocityControls";
import PlayerAttackControls from "../../controls/PlayerAttackControls";
import PlayerInventoryControls from "../../controls/PlayerInventoryControls";
import PlayerAbilityControls from "../../controls/PlayerAbilityControls";
import Entity from "../Entity";
import characters from "../../configs/characters";
export default class Player extends Entity {
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
    staminaRegen = 0;
    reloadStamina = this.maxStamina;
    reloadStaminaRegen = 2;
    defaultStaminaRegen = 0;
    regenCounter = 0;
    regenRate = 1;
    reloadSpeed = 2;
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
    hidden = false;
    reloading = false;
    reloadSound;
    owned = [];

    constructor (name, gameObject, input, scene, interactions)
    {
        super(name, gameObject, window.clientId, scene, interactions, -1);
        this.controls = {};
        this.controls.velocity = new PlayerVelocityControls(input);
        this.controls.attack = new PlayerAttackControls(input);
        this.controls.inventory = new PlayerInventoryControls(input);
        this.controls.ability = new PlayerAbilityControls(input);
        this.type = "player";
        this.primaryWeapon = characters[this.name].weapons[0];
        this.secondaryWeapon = characters[this.name].weapons[1];
        this.weapon = this.primaryWeapon;
        characters[this.name].items.forEach((item) => {
            this.equipped.items.push(item.equip.call(this));
        });
        this.equipped.weapons = characters[this.name].weapons;
        this.ability = characters[this.name].ability;
    }

    addEffect (effect, addon) {
        if (effect.source !== this.id) {
            this.owned.forEach((npc) => {
                npc.goAggressive(effect.source);
            });
        }
        super.addEffect(effect, addon);
    }

    initPlayerPosition (JSON) {
        this.gameObject.x = JSON.x;
        this.gameObject.y = JSON.y;
    }

    destroy () {
        super.destroy();
        document.location.reload();
    }
    
    addNpc (npc) {
        this.owned.push(npc);
    }

    update () {
        this.velocityInput();
        this.attackInput();
        this.inventoryInput();
        this.abilityInput();
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

    velocityInput () {
        const input = this.controls.velocity.get();
        if (this.blockMovement && !(input.velocityX + input.velocityY)) {
            this.blockMovementCounter++;
            this.velocityX = this.gameObject.body.velocity.x;
            this.velocityY = this.gameObject.body.velocity.y;
            return;
        }
        if(this.blockMovement && this.blockMovementCounter++ < this.blockMovementCounterMax) {
            return;
        } else if (this.blockMovement && (input.velocityX + input.velocityY) !== 0) {
            this.debounce();
        }
        this.velocityX = input.velocityX * this.speed;
        this.velocityY = input.velocityY * this.speed;
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
            this.weapon = input.button === "left" ? this.primaryWeapon : this.secondaryWeapon;
            if (this.stamina < this.weapon.staminaCost && this.weapon.reloadable && !this.reloading) {
                this.reloadStamina = this.stamina;
                this.reloading = true;
                this.reloadSound = this.weapon.reloadSound;
                return;
            }
            this.reloading = false;
            if (this.mana < this.weapon.manaCost || this.stamina < this.weapon.staminaCost || this.hp < this.weapon.healthCost) return;
            if (input.button === "left") {
                if (this.abilityActive) {
                    super.removeEffect(this.ability.name);
                    this.abilityActive = false;
                }
            }
            this.mana -= this.weapon.manaCost;
            this.stamina -= this.weapon.staminaCost;
            this.hp -= this.weapon.healthCost;
            this.attackCooldown = this.weapon.attackCooldown;
            const location = {x: this.gameObject.x + input.location.x, y: this.gameObject.y + input.location.y};
            this.currentAction = {
                ...this.weapon.action,
                direction: input.direction,
                location: location,
                source: this.id,
            };
            if (this.weapon.action.attacking) {
                this.blockMovementEffectName = this.weapon.action.attacking.name;
                super.addEffect({...this.weapon.action.attacking}, this.currentAction);
                this.interactions.push({
                    source: this.id,
                    target: this.id,
                    effect: this.weapon.action.attacking.id,
                });
            }
        } else if (!this.reloading) {
            this.reloadStamina = this.stamina;
            this.reloading = true;
            this.reloadSound = this.weapon.reloadSound;
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

    abilityInput () {
        const control = this.controls.ability.get();
        if (this.abilityCooldown === 0) {
            window.SoundManager.play("abilityReady");
        }
        if (this.abilityCooldown-- > 0) {
            return;
        }
        if (control && this.ability) {
            if (this.abilityActive) {
                super.removeEffect(this.ability.name);
                this.abilityActive = false;
            } else {
                super.addEffect({...this.ability}, true);
                this.interactions.push({
                    source: this.id,
                    target: this.id,
                    effect: this.ability.id,
                });
                this.abilityActive = true;
            }
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


        if (this.reloadStamina >= this.maxStamina && this.reloading) {
            this.stamina = this.maxStamina;
            this.reloading = false;
            window.SoundManager.play(this.reloadSound);
        } else {
            this.reloadStamina += this.reloadStaminaRegen;
            this.reloadStamina = Math.min(this.maxStamina, this.reloadStamina.toFixed(2));
        }
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

    debounce () {
        super.removeEffect(this.blockMovementEffectName);
        this.gameObject.setBounce(0, 0);
        this.blockMovement = false;
        this.blockMovementCounter = 0;
        this.speed = this.defaultSpeed;
    }
}