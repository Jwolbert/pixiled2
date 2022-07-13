export default {
    "5be01cde-0016-11ed-b939-0242ac120002": {
        id: "5be01cde-0016-11ed-b939-0242ac120002",
        name: "bleed",
        selfTarget: false,
        apply() {
            //this.gameObject.setTint(0xff0000);
            this.currentTint = 0xff0000;
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
};