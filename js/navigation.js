// full page navigation

export class Navigation {

    constructor() {
        this.pages = [];
        this.currentPage = 0;
        this.totalPages = 0;
        this.isSwitching = false;
        this.switchDelay = 250;
        this.resizeFrame = null;
        this.handleResize = this.handleResize.bind(this);
    }

    initialize() {

        this.pages = Array.from(document.querySelectorAll(".page"));
        this.totalPages = this.pages.length;

        if (this.totalPages === 0) {
            console.warn("No pages found.");
            return;
        }

        const navLinks = document.querySelectorAll(".nav-links a");
        navLinks.forEach((link, index) => {
            link.addEventListener("click", (event) => {
                // block default button action
                event.preventDefault(); 
                const pageidx = [0,1,2,7]; // page number for button
                this.goto(pageidx[index]); 
            });
        });

        const projectCards = document.querySelectorAll(".project-card");
        projectCards.forEach((card) => {
            card.addEventListener("click", (event) => {
                event.preventDefault(); 
                const targetIndex = parseInt(card.getAttribute("data-page-index"), 10);
                if (!isNaN(targetIndex)) {
                    this.goto(targetIndex); 
                }
            });
        });
        this.goto(0, false);

        window.addEventListener("resize", this.handleResize);

        // console.log(`Navigation initialized (${this.totalPages} pages).`);
    }

    handleResize() {
        if (this.resizeFrame !== null) {
            window.cancelAnimationFrame(this.resizeFrame);
        }

        this.resizeFrame = window.requestAnimationFrame(() => {
            this.resizeFrame = null;
            this.alignCurrentPage();
        });
    }

    alignCurrentPage() {
        const page = this.pages[this.currentPage];

        if (!page) {
            return;
        }

        page.scrollIntoView({
            behavior: "auto",
            block: "start"
        });
    }

    goto(index, smooth = true) {
        if (this.isSwitching) {
            return false;
        }

        if (index < 0 || index >= this.totalPages) {
            return false;
        }

        this.currentPage = index;
        this.isSwitching = true;

        this.pages[index].scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
            block: "start"
        });

        window.setTimeout(() => {
            this.isSwitching = false;
        }, smooth ? this.switchDelay : 0);

        return true;
    }

    move(direction) {
        return this.goto(this.currentPage + direction);
    }

    canScrollCurrentPage(direction) {
        const currentSection = this.pages[this.currentPage];

        if (!currentSection) {
            return false;
        }

        const scrollTop = currentSection.scrollTop;
        const scrollHeight = currentSection.scrollHeight;
        const clientHeight = currentSection.clientHeight;
        const isOverflowing = scrollHeight > clientHeight;

        if (!isOverflowing) {
            return false;
        }

        if (direction > 0) {
            return scrollTop + clientHeight < scrollHeight - 2;
        }

        return scrollTop > 2;
    }

    next() {
        return this.move(1);
    }

    previous() {
        return this.move(-1);
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotalPages() {
        return this.totalPages;
    }

}
