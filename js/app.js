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


// menu
const menuButton = document.getElementById('menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('pointerdown', () => {
    navLinks.classList.toggle('active');
});

const links = document.querySelectorAll('.nav-links li a');
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});