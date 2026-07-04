// mobile swipe

export class TouchController {

    constructor(navigation) {

        this.navigation = navigation;

        // minimum swipe distance before changing page
        this.threshold = 50;

        // minimum time between page switches (ms)
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

        // ignore tiny movement
        if (Math.abs(deltaY) < this.threshold) {
            return;
        }

        // ignore horizontal swipe
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

                // swipe up
                if (deltaY < 0) {

                    // still not at bottom 
                    if (scrollTop + clientHeight < scrollHeight - 2) {
                        return;
                    }

                }

                // swipe down
                else {

                    // still not at top
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