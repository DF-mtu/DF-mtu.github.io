// full page navigation

export class Navigation {

    constructor() {
        this.pages = [];
        this.currentPage = 0;
        this.totalPages = 0;
        this.isAnimating = false;
        this.animationDuration = 200;
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
            link.addEventListener("pointerdown", (event) => {
                // block default button action
                event.preventDefault(); 
                this.goto(index); 
            });
            link.addEventListener("click", (event) => {
            event.preventDefault(); 
            });
        });

        this.goto(0, false);

        console.log(`Navigation initialized (${this.totalPages} pages).`);

    }

    goto(index, smooth = true) {
        if (this.isAnimating) {
            return;
        }

        if (index < 0 || index >= this.totalPages) {
            return;
        }

        this.currentPage = index;
        this.isAnimating = true;

        this.pages[index].scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
            block: "start"
        });

        window.setTimeout(() => {
            this.isAnimating = false;
        }, this.animationDuration);
    }

    next() {
        if (this.currentPage >= this.totalPages - 1) {
            return;
        }
        this.goto(this.currentPage + 1);
    }

    previous() {
        if (this.currentPage <= 0) {
            return;
        }
        this.goto(this.currentPage - 1);
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotalPages() {
        return this.totalPages;
    }

}