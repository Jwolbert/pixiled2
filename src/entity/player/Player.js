import PlayerVelocityControls from "../../controls/PlayerVelocityControls";
import PlayerAttackControls from "../../controls/PlayerAttackControls";
import Entity from "../Entity";
import weapons from "../../weapons";
export default class Player extends Entity {
    controls;
    weapon;

    constructor (name, gameObject, input)
    {
        super(name, gameObject);
        this.controls = {};
        this.controls.velocity = new PlayerVelocityControls(input);
        this.controls.attack = new PlayerAttackControls(input);
        this.type = "player";
        this.weapon = weapons["dagger"];
    }

    update () {
        this.velocityInput();
        this.attackInput();
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
    }

    velocityInput () {
        const input = this.controls.velocity.get();
        this.velocityX = input.velocityX;
        this.velocityY = input.velocityY;
    }

    attackInput () {
        if (this.weapon.attackCooldown > 1) {
            this.weapon.attackCooldown -= 1;
            return;
        }
        if (this.weapon.attackCooldown > 0) {
            const input = this.controls.attack.get();
            this.weapon.attackCooldown -= 1;
            return;
        }
        const input = this.controls.attack.get();
        if (input) {
            this.weapon.attackCooldown = 100;
            const location = {x: this.gameObject.x + input.location.x, y: this.gameObject.y + input.location.y};
            this.currentAction = {
                ...this.weapon.action,
                direction: input.direction,
                location: location,
                source: this.id,
            };
        }
    }
}