document.addEventListener("DOMContentLoaded", () => {
    const slides = [...document.querySelectorAll(".wiki-links-images .mod")];
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    if (!slides.length || !prevBtn || !nextBtn) {
        console.warn("Carousel: missing elements");
        return;
    }

    const positions = ["far-left", "left", "center", "right", "far-right", "hidden"];
    let currentIndex = 2;

    const themeColors = [
        "rgba(0, 150, 255, 0.6)",   // Beyond Ocean
        "rgba(255, 215, 0, 0.6)",   // Beyond Ascension
        "rgba(158, 158, 158, 0.6)", // Beyond Depth
        "rgba(1, 71, 238, 0.6)",    // Beyond Cosmo
        "rgba(50, 205, 50, 0.6)",   // Beyond Zombie
        "rgba(103, 42, 236, 0.6)"   // Beyond Nightfall
    ];

    const updatePositions = () => {
        slides.forEach((slide, i) => {
            let posIndex = (i - currentIndex + 2 + slides.length) % slides.length;

            if (posIndex >= positions.length) posIndex = positions.length - 1;

            const pos = positions[posIndex];
            slide.setAttribute("data-pos", pos);

            if (pos === "center") {
                document.documentElement.style.setProperty("--theme-color", themeColors[i]);
            }

            slide.onclick = pos === "center" ? null : (e) => {
                e.preventDefault();
                const direction = posIndex < 2 ? -1 : 1;
                rotate(direction);
            };
        });
    };

    const rotate = (direction) => {
        currentIndex = (currentIndex + direction + slides.length) % slides.length;
        updatePositions();
    };

    prevBtn.onclick = () => rotate(-1);
    nextBtn.onclick = () => rotate(1);

    // Keyboard
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") rotate(-1);
        if (e.key === "ArrowRight") rotate(1);
    });

    // Touch
    let touchStartX = 0;
    let touchEndX = 0;
    const container = document.querySelector(".wiki-links");

    container.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > swipeThreshold) {
            rotate(diff > 0 ? -1 : 1);
        }
    };

    updatePositions();
});