// mouse wheel

export class WheelController {

    constructor(navigation) {

        this.navigation = navigation;

        // Ignore tiny trackpad movements
        this.threshold = 30;

        // Minimum time between page switches (ms)
        this.cooldown = 50;


        this.lastScrollTime = 0;

        this.handleWheel = this.handleWheel.bind(this);

    }

    initialize() {

        window.addEventListener(
            "wheel",
            this.handleWheel,
            { passive: false }
        );

        console.log("Wheel controller initialized.");

    }

    handleWheel(event) {

        // disable browser scrolling
        event.preventDefault();

        const now = Date.now();

        // CD
        if (now - this.lastScrollTime < this.cooldown) {
            return;
        }

        const delta = event.deltaY;

        // Ignore jitter
        if (Math.abs(delta) < this.threshold) {
            return;
        }

        // current time
        this.lastScrollTime = now;

        if (delta > 0) {

            this.navigation.next();

        } else {

            this.navigation.previous();

        }

    }

    destroy() {

        window.removeEventListener(
            "wheel",
            this.handleWheel
        );

    }

}