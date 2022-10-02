import weapons from "./weapons";
import items from "./items";
import effects from "./effects";

export default {
    "hatman": {
        weapons: [weapons.bow, weapons.sabotageKitPoison],
        items: [],
        ability: effects.fade,
    },
    "vampire": {
        weapons: [weapons.vampireBite, weapons.bloodOrbScroll],
        items: [items.bloodChalice],
        ability: effects.bloodForm,
    },
}