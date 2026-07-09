// mobile swipe

export class TouchController {

    constructor(navigation) {

        this.navigation = navigation;

        // minimum swipe distance before changing page
        this.threshold = 50;

        this.touchStartX = 0;
        this.touchStartY = 0;

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);

    }

    initialize() {

        window.addEventListener(
            "touchstart",
            this.handleTouchStart,
            { passive: true }
        );

        window.addEventListener(
            "touchmove",
            this.handleTouchMove,
            { passive: false }
        );
    }

    handleTouchStart(event) {

        if (event.touches.length > 1) {
            return;
        }

        const touch = event.touches[0];

        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;

    }

    handleTouchMove(event) {

        if (event.touches.length > 1) {
            return;
        }

        const touch = event.touches[0];

        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;

        // ignore tiny movement
        if (Math.abs(deltaY) < this.threshold) {
            return;
        }

        // ignore horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return;
        }

        const direction = deltaY < 0 ? 1 : -1;

        if (this.navigation.canScrollCurrentPage(direction)) {
            return;
        }

        // Prevent browser bounce / overscroll
        event.preventDefault();

        this.navigation.move(direction);

    }

    destroy() {

        window.removeEventListener(
            "touchstart",
            this.handleTouchStart
        );

        window.removeEventListener(
            "touchmove",
            this.handleTouchMove
        );

    }

}
