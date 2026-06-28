// entry point

import { Navigation } from "./navigation.js";
import { WheelController } from "./wheel.js";
import { TouchController } from "./touch.js";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Website initialized.");

    // Navigation
    const navigation = new Navigation();
    navigation.initialize();

    // Mouse Wheel
    const wheel = new WheelController(navigation);
    wheel.initialize();

    const touch = new TouchController(navigation);
    touch.initialize();
});