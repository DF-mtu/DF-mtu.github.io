// mobile swipe

export class TouchController {

    constructor(navigation) {

        this.navigation = navigation;

        // Minimum swipe distance before changing page
        this.threshold = 30;

        // Minimum time between page switches (ms)
        this.cooldown = 500;

        this.touchStartX = 0;
        this.touchStartY = 0;

        this.lastSwitchTime = 0;

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

        console.log("Touch controller initialized.");

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

        const now = Date.now();

        if (now - this.lastSwitchTime < this.cooldown) {
            return;
        }

        const touch = event.touches[0];

        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;

        // Ignore tiny movement
        if (Math.abs(deltaY) < this.threshold) {
            return;
        }

        // Ignore horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return;
        }

        const currentSection =
            this.navigation.pages[this.navigation.currentPage];

        if (currentSection) {

            const scrollTop = currentSection.scrollTop;
            const scrollHeight = currentSection.scrollHeight;
            const clientHeight = currentSection.clientHeight;

            const isOverflowing =
                scrollHeight > clientHeight;

            if (isOverflowing) {

                // Swipe up (finger moves upward)
                if (deltaY < 0) {

                    // Still not at bottom -> allow normal scrolling
                    if (scrollTop + clientHeight < scrollHeight - 2) {
                        return;
                    }

                }

                // Swipe down (finger moves downward)
                else {

                    // Still not at top -> allow normal scrolling
                    if (scrollTop > 2) {
                        return;
                    }

                }

            }

        }

        // Prevent browser bounce / overscroll
        event.preventDefault();

        this.lastSwitchTime = now;

        if (deltaY < 0) {
            this.navigation.next();
        }
        else {
            this.navigation.previous();
        }

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