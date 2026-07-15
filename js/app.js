// entry point

import { Navigation } from "./navigation.js";
import { WheelController } from "./wheel.js";
import { TouchController } from "./touch.js";

document.addEventListener("DOMContentLoaded", () => {

    // console.log("Website initialized.");

    // Navigation
    const navigation = new Navigation();
    navigation.initialize();

    const scrollIndicator = document.getElementById("scroll-indicator");
    const scrollIndicatorIcon = scrollIndicator?.querySelector("i");
    const scrollIndicatorLabel = scrollIndicator?.querySelector(".scroll-indicator-label");

    const updateScrollIndicator = () => {
        if (!scrollIndicator) {
            return;
        }

        const isLastPage = navigation.getCurrentPage() === navigation.getTotalPages() - 1;
        const label = isLastPage ? "Back to top" : "Go to next section";

        scrollIndicator.setAttribute("aria-label", label);
        scrollIndicator.title = label;

        if (scrollIndicatorLabel) {
            scrollIndicatorLabel.textContent = isLastPage ? "Back to top" : "Scroll";
        }

        if (scrollIndicatorIcon) {
            scrollIndicatorIcon.classList.toggle("fa-arrow-down-long", !isLastPage);
            scrollIndicatorIcon.classList.toggle("fa-arrow-up-long", isLastPage);
        }
    };

    scrollIndicator?.addEventListener("click", () => {
        if (navigation.getCurrentPage() === navigation.getTotalPages() - 1) {
            navigation.goto(0);
            return;
        }

        navigation.next();
    });

    document.addEventListener("navigation:pagechange", updateScrollIndicator);
    updateScrollIndicator();

    // Mouse Wheel
    const wheel = new WheelController(navigation);
    wheel.initialize();

    const touch = new TouchController(navigation);
    touch.initialize();
});

// menu
const menuButton = document.getElementById('menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

const links = document.querySelectorAll('.nav-links li a');
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});