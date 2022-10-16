import weapons from "./weapons";
import items from "./items";
import effects from "./effects";

export default {
    "hatman": {
        weapons: [weapons.bow, weapons.sabotageKitPoison],
        items: [],
        ability: effects.fade,
        visible: true,
    },
    "vampire": {
        weapons: [weapons.vampireBite, weapons.bloodOrbScroll],
        items: [items.bloodChalice, items.devRing],
        ability: effects.bloodForm,
    },
    "iceMage": {
        weapons: [weapons.slowbow, weapons.sabotageKitPoison],
        items: [items.bloodChalice],
        ability: effects.bloodForm,
    },
}