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

        // console.log("Wheel controller initialized.");

    }

    handleWheel(event) {
    const now = Date.now();
    if (now - this.lastScrollTime < this.cooldown) {
        return;
    }

    const delta = event.deltaY;
    if (Math.abs(delta) < this.threshold) {
        return;
    }

    const currentSection = this.navigation.pages[this.navigation.currentPage];
    
    if (currentSection) {
        const scrollTop = currentSection.scrollTop; 
        const scrollHeight = currentSection.scrollHeight; 
        const clientHeight = currentSection.clientHeight; 
        const isOverflowing = scrollHeight > clientHeight;

        if (isOverflowing) {
            const tolerance = 6; 

            const isAtBottom = (scrollHeight - clientHeight - scrollTop) <= tolerance;
            const isAtTop = scrollTop <= tolerance;

            if (delta > 0 && !isAtBottom) {
                return; 
            }
            if (delta < 0 && !isAtTop) {
                return; 
            }
        }
    }

    event.preventDefault(); 

    this.lastScrollTime = now;

    if (delta > 0) {
        this.navigation.next();
    } else {
        this.navigation.previous();
    }
}

}