export default {
    dagger: {
        name: "dagger",
        attackCooldown: 0,
        effect: {
            id: "5be01cde-0016-11ed-b939-0242ac120002",
            name: "bleed",
            source: this.id,
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
    }
}