export default {
    "5be01cde-0016-11ed-b939-0242ac120002": {
        id: "5be01cde-0016-11ed-b939-0242ac120002",
        name: "bleed",
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
    "2c8c6620-0707-11ed-b939-0242ac120002": {
        id: "2c8c6620-0707-11ed-b939-0242ac120002",
        name: "ignited",
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
    "3c8c6620-0707-11ed-b939-0242ac120002": {
        id: "3c8c6620-0707-11ed-b939-0242ac120002",
        name: "drained",
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
    "4c8c6620-0707-11ed-b939-0242ac120002": {
        id: "4c8c6620-0707-11ed-b939-0242ac120002",
        name: "poisoned",
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
};