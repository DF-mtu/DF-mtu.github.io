// mobile swipe

export class TouchController {

    constructor(navigation) {
        this.navigation = navigation;
        // Minimum distance required to trigger a swipe (px)
        this.threshold = 30;

        // Maximum time allowed for a single swipe (ms)
        this.timeThreshold = 600;

        this.touchStartX = 0;
        this.touchStartY = 0;
        this.startTime = 0;

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

    }

    initialize() {

        window.addEventListener(
            "touchstart",
            this.handleTouchStart,
            { passive: false }
        );

        window.addEventListener(
            "touchend",
            this.handleTouchEnd,
            { passive: false }
        );

        console.log("Touch controller initialized.");

    }

    handleTouchStart(event) {

        // Ignore multi-touch
        if (event.touches.length > 1) {
            return;
        }

        const touch = event.touches[0];

        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.startTime = Date.now();

    }

    handleTouchEnd(event) {

        // Prevent native scrolling
        event.preventDefault();

        const touch = event.changedTouches[0];

        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const elapsedTime = Date.now() - this.startTime;

        // Check if the swipe was quick enough and covers enough distance
        if (elapsedTime > this.timeThreshold ||
            (Math.abs(deltaX) < this.threshold && Math.abs(deltaY) < this.threshold)) {
            return;
        }

        // Determine the primary direction of the swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {

            return;

        } else {

            // Vertical swipe
            if (deltaY > 0) {

                this.navigation.previous(); // Swipe down -> previous page

            } else {

                this.navigation.next(); // Swipe up -> next page

            }

        }

    }

    destroy() {

        window.removeEventListener(
            "touchstart",
            this.handleTouchStart
        );

        window.removeEventListener(
            "touchend",
            this.handleTouchEnd
        );

    }

}