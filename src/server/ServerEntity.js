export default class ServerEntity {

    id;
    name;
    owner;
    scale;
    type = "entity";
    x;
    y;
    gameObject;
    velocityX = 0;
    velocityY = 0;
    currentAnimation;
    dead;
    currentAction = {
        name: "idle"
    };
    effects = {};
    hp = 100;
    mana = 100;
    stamina = 100;
    effectTimer = 0;
    effectTimerMaximum = 100;
    speed = 75;
    direction;
    scene;

    constructor () {
        this.id = uuidv4();
    }
}