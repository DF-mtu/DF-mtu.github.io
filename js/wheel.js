// mouse wheel

export class WheelController {

    constructor(navigation) {

        this.navigation = navigation;

        // Ignore tiny trackpad movements
        this.threshold = 30;

        this.handleWheel = this.handleWheel.bind(this);

    }

    initialize() {

        window.addEventListener(
            "wheel",
            this.handleWheel,
            { passive: false }
        );

        // console.log("Wheel controller initialized.");

    }

    handleWheel(event) {
        const delta = event.deltaY;
        if (Math.abs(delta) < this.threshold) {
            return;
        }

        const direction = delta > 0 ? 1 : -1;

        if (this.navigation.canScrollCurrentPage(direction)) {
            return;
        }

        event.preventDefault(); 

        this.navigation.move(direction);
    }

}
